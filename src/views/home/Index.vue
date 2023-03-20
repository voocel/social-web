<template>
  <el-container class="main" :style="{ height: fullHeight + 'px' }">
    <div class="head">chat</div>
    <el-header>
      <headers :is-online="socketStatus" />
    </el-header>
    <el-container>
      <el-aside class="menu" width="65px">
        <menus />
      </el-aside>
      <el-aside class="dialog" width="360px">
        <left-nav />
      </el-aside>
      <el-main>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          :show-close="false"
          :close-on-click-modal="false"
          width="30%"
          height="40%"
        >
          <span>正在尝试重新连接服务器({{ maxReconnect }})...</span>
        </el-dialog>
        <router-view @childSend="childSend" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Menus from './components/Menus'
import Headers from '../header/Header'
import LeftNav from './components/LeftNav'
import tips from '@/utils/tips'
import storage from '@/common/storage'

var userInfo = JSON.parse(storage.get(storage.USER_INFO))

export default {
  name: 'Index',
  components: {
    Menus,
    Headers,
    LeftNav
  },
  data() {
    return {
      dialogVisible: false,
      maxReconnect: 0,
      fullHeight: document.documentElement.clientHeight,
      websocket: null,
      reconnectData: null,
      lockReconnect: false, // 避免重复连接，因为onerror之后会立即触发 onclose
      timeout: 20000, // 10s一次心跳检测
      timeoutObj: null,
      serverTimeoutObj: null,
      socketStatus: false
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.initWebSocket()
  },
  destroyed() {
    this.lockReconnect = true
    this.websocket.close()
    clearTimeout(this.reconnectData)
    clearTimeout(this.timeoutObj)
    clearTimeout(this.serverTimeoutObj)
  },
  methods: {
    initWebSocket() {
      var wsurl = 'ws://' + process.env.VUE_APP_SOCKET_URL + ':' + process.env.VUE_APP_SOCKET_PORT + '/ws?token=xxx'
      this.websocket = new WebSocket(wsurl)
      this.websocket.onmessage = this.onMessage
      this.websocket.onopen = this.onOpen
      this.websocket.onerror = this.onError
      this.websocket.onclose = this.onClose
      this.websocket.binaryType = 'arraybuffer'
    },
    onOpen() {
      const actions = {
        cmd: 'connect',
        param: {
          uid: parseInt(userInfo.uid),
          appId: 1,
          token: storage.get(storage.USER_TOKEN)
        }
      }
      this.wsSend(JSON.stringify(actions))
      this.heatBeat()
      this.socketStatus = true
      this.dialogVisible = false
    },
    onClose(e) {
      console.log('断开连接', e)
      if (this.websocket.readyState !== 1) {
        this.socketStatus = false
        this.reconnect()
      }
    },
    onError(e) {
      console.log('连接错误..', e)
      this.dialogVisible = true
    },
    reconnect() {
      if (this.lockReconnect || this.maxReconnect >= 10) {
        return
      }
      this.lockReconnect = true
      this.reconnectData && clearTimeout(this.reconnectData)
      this.reconnectData = setTimeout(() => {
        this.initWebSocket()
        this.lockReconnect = false
        this.maxReconnect++
      }, 5000)
    },
    heatBeat() {
      this.timeoutObj && clearTimeout(this.timeoutObj)
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
      this.timeoutObj = setTimeout(() => {
        if (this.websocket.readyState === 1) {
          this.wsSend('{"cmd":"ping"}')
        } else {
          this.reconnect()
        }
        this.serverTimeoutObj = setTimeout(() => {
          // this.websocket.close();
        }, this.timeout)
      }, this.timeout)
    },
    onMessage(e) {
      this.heatBeat()
      console.log(e.data)
      const json = JSON.parse(e.data)
      console.log(json)
      if (json.data.cmd !== 'pong') console.log(json)
      if (json.code === 0) {
        switch (json.data.cmd) {
          case 'connect':
            console.log('连接服务器成功!')
            this.$message({
              showClose: true,
              message: json.data.message,
              duration: 3000,
              type: 'success'
            })
            break
          case 'msg':
            this.sysmsg = json.data.content
            this.$message({
              showClose: true,
              message: json.data.message,
              duration: 3000,
              type: 'success'
            })
            break
          case 'chat':
            console.log(json.data)
            this.chat(json.data.content)
            break

          default:
        }
      } else {
        if (json.type === 'online') {
          this.onlineNum = json.data
        }
        if (json.code !== undefined) {
          if (json.code === 401) {
            tips.reLoginTip()
          } else {
            this.$message({
              showClose: true,
              message: json.message,
              duration: 3000,
              type: 'error'
            })
          }
        }
      }
    },
    packMsg(str) {
      var buf = new ArrayBuffer(str.length + 4)
      var bufView = new Uint8Array(buf)
      bufView[0] = 3
      for (var i = 0, strLen = str.length; i < strLen + 4; i++) {
        bufView[i + 4] = str.charCodeAt(i)
      }
      return buf
    },
    wsSend(msg) {
      msg = this.str2ab(msg)
      this.websocket.send(msg)
    },
    childSend(res) {
      this.wsSend(res)
    },
    // message = route(4byte)+data
    str2ab(str) {
      var buf = new ArrayBuffer(str.length + 4) // 每个字符占用1个字节
      var bufView = new Uint8Array(buf)
      var route = 4
      bufView[0] = route
      for (var i = 0, strLen = str.length; i < strLen + 4; i++) {
        bufView[i + 4] = str.charCodeAt(i)
      }
      return buf
    },
    handleResize() {
      this.fullHeight = document.documentElement.clientHeight
    },
    chat(msg) {
      if (this.$store.state.curSelected && this.$store.state.curSelected.uid === msg.from_uid) {
        const pushData = {
          nickname: msg.from_nickname,
          uid: msg.from_uid,
          avatar: msg.from_avatar,
          content: msg.content,
          self: false,
          timeline: msg.time
        }
        this.$store.commit('pushMsg', pushData)
      }
      this.recordAlive(msg)
      this.recordMsg(msg)

      const aliveList = this.$store.state.aliveList
      let unread
      if (
        // JSON.stringify(aliveList) == "{}" ||
        !aliveList[msg.from_uid] ||
        isNaN(parseInt(aliveList[msg.from_uid].unread))
      ) {
        unread = 1
      } else {
        unread = parseInt(aliveList[msg.from_uid].unread) + 1
      }
      aliveList[msg.from_uid] = {
        to_id: msg.from_uid,
        nickname: msg.from_nickname,
        avatar: msg.from_avatar,
        last_msg: msg.content,
        last_time: this.common.getCurTime(1),
        unread: unread
      }
      this.$store.commit('setAliveList', aliveList)
    },
    recordAlive(msg) {
      const aliveList = storage.get('aliveList') ? JSON.parse(storage.get('aliveList')) : {}
      aliveList[msg.from_uid] = {
        to_id: msg.from_uid,
        nickname: msg.from_nickname,
        avatar: msg.from_avatar,
        last_msg: msg.content,
        last_time: this.common.getCurTime(1),
        unread: 20
      }
    },
    recordMsg(msg) {
      const msgkey = 'msg_' + userInfo.uid + '_' + msg.from_uid
      const data = storage.get(msgkey) ? JSON.parse(storage.get(msgkey)) : []
      data.push({
        uid: msg.from_uid,
        nickname: msg.from_nickname,
        avatar: msg.from_avatar,
        content: msg.content,
        self: false,
        timeline: this.common.getCurTime()
      })
      storage.set(msgkey, JSON.stringify(data))
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-header {
  padding-left: 0;
  padding-right: 0;
}
.el-header,
.el-footer {
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-aside {
  color: #333;
  text-align: center;
  // line-height: 50px;
}
// .el-header {
//   background: #eee;
// }
.menu {
  background-color: #f3f3f3;
}
.dialog {
  background-color: #fff;
  border-right: 1px solid #eee;
}
.el-main {
  color: #333;
  text-align: center;
  padding: 0;
}
body > .el-container {
  margin-bottom: 40px;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}
.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.head {
  height: 45px;
  line-height: 45px;
  // background: #5ca6ef;
  // background-image: linear-gradient(to left, #a1c4fd , #c2e9fb);
  background-image: linear-gradient(to top, #dfe9f3 0%, white 100%);
  text-align: center;
  color: rgb(39, 6, 70);
}
</style>
