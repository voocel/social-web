<template>
  <div>
    <el-container direction="vertical">
      <el-header>
        <div class="to-name">{{ selectedUser['nickname'] }}</div>
      </el-header>
      <el-main v-chat-scroll>
        <chat-box :msg-datas="records" />
      </el-main>
      <el-footer>
        <div class="chat-footer">
          <div class="action">
            <div v-watchMouse="showEmoji" class="emoji">
              <!-- <icon
                name="biaoqing1"
                @clickIcon="showEmoji.f = !showEmoji.f"
                cursor="pointer"
                title="发送表情"
              ></icon>-->
              <span @click="showEmoji.f = !showEmoji.f">😄</span>
              <el-collapse-transition>
                <div v-show="showEmoji.f" class="emoji-container">
                  <emoji
                    @chooseEmoji="chooseEmoji"
                    @chooseEmojiDefault="chooseEmojiDefault"
                  />
                </div>
              </el-collapse-transition>
            </div>
            <div class="photo">
              <el-upload
                ref="upload"
                class="upload-demo"
                action="#"
                :http-request="handleUpload"
                :before-upload="beforeUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :auto-upload="true"
                :show-file-list="false"
              >
                <i slot="trigger" style="font-size:24px;" class="iconfont">&#xeba5;</i>
              </el-upload>
            </div>
            <div class="history">
              <i style="font-size:24px;" class="iconfont">&#xeb98;</i>
            </div>
            <!-- <span class="photo"><i class="el-icon-picture-outline"></i></span> -->
            <div class="more">
              <i class="el-icon-circle-plus-outline" />
            </div>
          </div>
          <el-input
            ref="content"
            v-model="inputData"
            class="content"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 10 }"
            placeholder="请输入内容"
            maxlength="70"
            show-word-limit
            @keyup.enter.native="send"
          />
          <div class="send-btn">
            <el-button
              type="success"
              size="small"
              @click="send"
            >发送</el-button>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import ChatBox from '@/components/ChatBox'
// import Icon from "@/components/Icon";
import Emoji from '@/components/Emoji'
import storage from '@/common/storage'
import { route, contentType } from '@/utils/message'
import idb from '@/store/idb'

var userInfo = JSON.parse(storage.get(storage.USER_INFO))

export default {
  name: 'Chat',
  components: {
    ChatBox,
    // Icon,
    Emoji
  },
  data() {
    return {
      msgDatas: [],
      inputData: '',
      curChatNickname: '',
      showEmoji: { f: false }
    }
  },
  computed: {
    records() {
      return this.msgDatas
    },
    newMsg() {
      return this.$store.state.newMsg
    },
    selectedUser() {
      if (this.$store.state.curSelected) {
        return this.$store.state.curSelected
      } else {
        return ''
      }
    }
  },
  watch: {
    newMsg: {
      handler() {
        this.loadLocalMsg()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleUpload(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      this.$api.user.uploadFile(formData)
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message({
              message: '发送成功',
              type: 'success'
            })

            const toInfo = this.$store.state.curSelected
            if (!toInfo) {
              this.$message.error('请先选择要发送的用户')
              return
            }
            const sendData = {
              sender: { id: parseInt(userInfo.uid) },
              receiver: { id: parseInt(toInfo.id) },
              content: res.data.data.url,
              content_type: contentType.IMAGE
            }
            this.$emit('childSend', route.MESSAGE, sendData)
            this.recordMsg(res.data.data.url, contentType.IMAGE, toInfo.uid)
            this.recordAlive(toInfo, '[图片]')
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
    },
    beforeUpload(file) {
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        // console.log(e.target.result)
      }
    },
    send(e) {
      if (e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) {
        this.inputData = this.inputData.trimEnd()
      }
      if (this.inputData === '') {
        this.$message.error('消息不能为空')
        return
      }

      const toInfo = this.$store.state.curSelected
      if (!toInfo) {
        this.$message.error('请先选择要发送的对象')
        return
      }
      const sendData = {
        sender: { id: parseInt(userInfo.uid) },
        receiver: { id: parseInt(toInfo.id) },
        content: this.inputData,
        content_type: contentType.TEXT
      }
      this.$emit('childSend', toInfo.route, sendData)
      this.recordMsg(this.inputData, contentType.TEXT, toInfo.id)
      this.recordAlive(toInfo, this.inputData)
      this.inputData = ''
    },
    // 聚焦输入框
    focusTxtContent() {
      document.querySelector('#txtContent input').focus()
    },
    loadLocalMsg() {
      const condition = {
        where: (object) => {
          if (object.sender_id === userInfo.uid && object.receiver_id === this.selectedUser.id) return true
          if (object.receiver_id === userInfo.uid && object.sender_id === this.selectedUser.id) return true
        }
      }
      idb().findObject('msg', condition).then((data) => {
        this.msgDatas = data
      })
    },
    recordMsg(content, content_type, toUid) {
      idb().addObject('msg', {
        self: true,
        sender_id: userInfo.uid,
        receiver_id: toUid,
        uid: userInfo.uid,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        content: content,
        content_type: content_type,
        timeline: this.common.getCurTime()
      })
      this.loadLocalMsg()
    },
    recordAlive(toInfo, lasgMsg) {
      let aliveList = this.$store.state.aliveList
      const unread = ''
      if (!aliveList) {
        aliveList = {}
      }
      aliveList[toInfo.id] = {
        id: toInfo.id,
        nickname: toInfo.nickname,
        avatar: toInfo.avatar,
        last_msg: lasgMsg,
        last_time: this.common.getCurTime(1),
        unread: unread,
        route: toInfo.route
      }
      this.$store.commit('setAliveList', aliveList)
    },
    chooseEmojiDefault(em) {
      this.inputData += em
      console.log(em)
      this.showEmoji.f = false
      this.$refs.content.focus()
    },
    chooseEmoji(url) {
      console.log(url)
      this.showEmoji.f = false
      this.$refs.content.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  height: 40px !important;
  border-radius: 3px;
}
::v-deep .el-textarea__inner {
  border: 0px;
}
.el-header {
  color: #333;
  text-align: center;
  line-height: 40px;
  height: 40px !important;
  border-bottom: 1px #eee solid;
  padding: 0 20px;
  font-size: 18px;
  .to-name {
    color: #409eff;
    text-align: left;
  }
}
.el-main {
  width: 100%;
  // height: 100vw;
  // aspect-ratio: 16/16;
  color: #333;
  height: calc(100vh - 320px);
  padding: 5px 10px;
}
.el-footer {
  color: #333;
  text-align: center;
  background-color: #eee;
  padding: 0;
  // height: calc(35vh);
  .chat-footer {
    height: 100%;
    .action {
      height: 40px;
      line-height: 40px;
      background: rgb(233, 233, 219);
      text-align: left;
      span {
        cursor: pointer;
      }
      .emoji {
        float: left;
        // padding-left: 10px;
        text-align: center;
        font-size: 22px;
        .emoji-container {
          width: 400px;
          height: 260px;
          position: absolute;
          bottom: 230px;
          left: 0;
          z-index: 10;
          transition: all 0.2s;
          /*transform: scaleX(0);*/
          /*opacity: 0;*/
        }
      }
      .photo {
        float: left;
        margin-left: 20px;
        font-size: 24px;
      }
      .history {
        float: left;
        margin-left: 20px;
        font-size: 24px;
      }
      .more {
        float: left;
        margin-left: 20px;
        font-size: 24px;
      }
    }
    .content {
      border: 0px;
    }
    .send-btn {
      text-align: right;
      padding-right: 15px;
    }
  }
}
.clear {
  clear: both;
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
</style>
