<template>
  <div>
    <el-container>
      <el-header>
        <div class="to-name">{{ curNickname }}</div>
      </el-header>
      <el-main v-chat-scroll>
        <chat-box :msg-datas="records" />
      </el-main>
      <el-footer>
        <el-row>
          <div class="chat-footer">
            <div class="action">
              <span v-watchMouse="showEmoji" class="emoji">
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
              </span>
              <span class="photo">
                <i style="font-size:24px;" class="iconfont">&#xeba5;</i>
              </span>
              <span class="photo">
                <i style="font-size:24px;" class="iconfont">&#xeb98;</i>
              </span>
              <!-- <span class="photo"><i class="el-icon-picture-outline"></i></span> -->
              <span class="more">
                <i class="el-icon-circle-plus-outline" />
              </span>
            </div>
            <el-input
              v-model="inputData"
              class="content"
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10 }"
              placeholder="请输入内容"
              maxlength="60"
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
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import ChatBox from '@/components/ChatBox'
// import Icon from "@/components/Icon";
import Emoji from '@/components/Emoji'
import storage from '@/common/storage'
import { route } from '@/utils/message'
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
      inputData: '',
      curChatNickname: '',
      showEmoji: { f: false }
    }
  },
  computed: {
    records() {
      return this.$store.state.msgData
    },
    curNickname() {
      if (this.$store.state.curSelected) {
        return this.$store.state.curSelected['nickname']
      } else {
        return ''
      }
    }
  },
  methods: {
    send() {
      if (this.inputData === '') {
        this.$message.error('消息不能为空')
        return
      }
      const pushData = {
        nickname: userInfo.nickname,
        uid: userInfo.uid,
        avatar: userInfo.avatar,
        content: this.inputData,
        self: true,
        timeline: this.common.getCurTime()
      }
      this.$store.commit('pushMsg', pushData)
      const toUinfo = this.$store.state.curSelected
      if (!toUinfo) {
        this.$message.error('请先选择发送的用户')
        return
      }
      const sendData = {
        sender: { id: parseInt(userInfo.uid) },
        receiver: { id: parseInt(toUinfo.uid) },
        content_type: 1,
        content: this.inputData
      }
      this.$emit('childSend', route.MESSAGE, sendData)
      this.recordMsg(this.inputData, toUinfo.uid)
      this.recordAlive(toUinfo, this.inputData)
      this.inputData = ''
    },
    // 聚焦输入框
    focusTxtContent() {
      document.querySelector('#txtContent input').focus()
    },
    recordMsg(content, toUid) {
      const msgkey = 'msg_' + userInfo.uid + '_' + toUid
      let data = storage.get(msgkey)
      if (!data) {
        data = []
      } else {
        data = JSON.parse(data)
      }
      data.push({
        uid: userInfo.uid,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        content: content,
        self: true,
        timeline: this.common.getCurTime()
      })
      storage.set(msgkey, JSON.stringify(data))
    },
    recordAlive(Uinfo, lasgMsg) {
      let aliveList = this.$store.state.aliveList
      const unread = ''
      if (!aliveList) {
        aliveList = {}
      }
      aliveList[Uinfo.uid] = {
        to_id: Uinfo.uid,
        nickname: Uinfo.nickname,
        avatar: Uinfo.avatar,
        last_msg: lasgMsg,
        last_time: this.common.getCurTime(1),
        unread: unread
      }
      this.$store.commit('setAliveList', aliveList)
    },
    chooseEmojiDefault(em) {
      this.inputData += em
      console.log(em)
      this.showEmoji.f = false
    },
    chooseEmoji(url) {
      console.log(url)
      this.showEmoji.f = false
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
.el-footer {
  color: #333;
  text-align: center;
  line-height: 60px;
  background-color: #eee;
  padding: 0;
  .chat-footer {
    .action {
      height: 40px;
      line-height: 40px;
      background: rgb(247, 245, 245);
      text-align: left;
      span {
        cursor: pointer;
      }
      .emoji {
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
        margin-left: 20px;
      }
      .more {
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
.el-main {
  color: #333;
  text-align: center;
  height: calc(65vh - 50px);
  padding: 10px;
  // min-height: calc(90vh - 105px);
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
