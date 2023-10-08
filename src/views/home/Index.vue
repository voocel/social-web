<template>
  <el-container class="main" :style="{ height: fullHeight + 'px' }">
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
      <el-main class="chat-main">
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
import { message, route } from '@/utils/message'
import storage from '@/common/storage'
import idb from '@/store/idb'

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
      const token = storage.get(storage.USER_TOKEN)
      var wsurl = 'ws://' + process.env.VUE_APP_SOCKET_URL + ':' + process.env.VUE_APP_SOCKET_PORT + '/ws?token=' + token
      this.websocket = new WebSocket(wsurl)
      this.websocket.onmessage = this.onMessage
      this.websocket.onopen = this.onOpen
      this.websocket.onerror = this.onError
      this.websocket.onclose = this.onClose
      this.websocket.binaryType = 'arraybuffer'
    },
    onOpen() {
      // this.heatBeat()
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
      this.timeoutObj = setInterval(() => {
        if (this.websocket.readyState === 1) {
          this.wsSend(1, '')
        } else {
          this.reconnect()
        }
        this.serverTimeoutObj = setTimeout(() => {
          // this.websocket.close();
        }, this.timeout)
      }, this.timeout)
    },
    onMessage(e) {
      console.log(e)
      const json = message.unpack(e.data)
      console.log(json)
      if (json.route !== route.HEARBEAT) console.log(json)
      switch (json.route) {
        case route.AUTH:
          setTimeout(() => {
            tips.reLoginTip()
          }, 1000)

          return
        case route.CONNECT:
          console.log('connect successfully!')
          this.$message({
            showClose: true,
            message: json.data.msg,
            duration: 3000,
            type: 'success'
          })
          break
        case route.SYSTEM:
          this.sysmsg = json.data.content
          this.$message({
            showClose: true,
            message: json.data.msg,
            duration: 3000,
            type: 'success'
          })
          break
        case route.MESSAGE:
        case route.GROUP_MESSAGE:
          console.log(json.data)
          this.chat(json.data, json.route)
          break
        case route.HEARBEAT:
          break
        default:
          this.$message({
            showClose: true,
            message: json,
            duration: 3000,
            type: 'error'
          })
      }
    },
    wsSend(route, msg) {
      msg = message.pack(route, msg)
      this.websocket.send(msg)
    },
    childSend(route, res) {
      this.wsSend(route, res)
    },
    handleResize() {
      this.fullHeight = document.documentElement.clientHeight
    },
    chat(msg, route) {
      if (this.$store.state.curSelected && this.$store.state.curSelected.id === msg.sender.id) {
        //
      }
      this.recordAlive(msg, route)
      this.recordMsg(msg)
    },
    recordAlive(msg, r) {
      let aliveId = msg.sender.id
      let name = msg.sender.nickname
      let avatar = msg.sender.avatar
      if (r === route.GROUP_MESSAGE) {
        aliveId = msg.receiver.id
        name = msg.receiver.nickname
        avatar = msg.receiver.avatar
      }
      const aliveList = this.$store.state.aliveList
      let unread
      if (
        // JSON.stringify(aliveList) == "{}" ||
        !aliveList[aliveId] ||
        isNaN(parseInt(aliveList[aliveId].unread))
      ) {
        unread = 1
      } else {
        unread = parseInt(aliveList[aliveId].unread) + 1
      }

      aliveList[aliveId] = {
        id: msg.aliveId,
        nickname: name,
        avatar: avatar,
        last_msg: msg.content,
        last_time: this.common.getCurTime(1),
        unread: unread,
        route: r
      }
      this.$store.commit('setAliveList', aliveList)
    },
    recordMsg(msg) {
      idb().addObject('msg', {
        self: false,
        sender_id: msg.sender.id,
        receiver_id: userInfo.uid,
        uid: userInfo.uid,
        nickname: msg.sender.nickname,
        avatar: msg.sender.avatar,
        content: msg.content,
        content_type: msg.content_type,
        timeline: this.common.getCurTime()
      })
      this.$store.commit('hasNewMsg')
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
