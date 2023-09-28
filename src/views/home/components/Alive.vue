<template>
  <div>
    <div class="alive">
      <ul>
        <router-link to="/chat">
          <li
            v-for="(item, index) in aliveData"
            :key="index"
            class="alive-item"
            :class="{ active: activeClass == index }"
            @click="selectUser(index, item)"
          >
            <el-row>
              <el-col :span="4">
                <div class="avatar">
                  <div v-if="item.avatar == ''">
                    <avatar
                      :size="36"
                      :lighten="60"
                      :username="item.nickname"
                    />
                  </div>
                  <div v-else>
                    <img class="custom-img" height="40" width="40" :src="item.avatar" alt="">
                  </div>
                </div>
              </el-col>
              <el-col :span="20">
                <div class="content">
                  <el-row>
                    <el-col :span="20">
                      <div class="nickname">{{ item.nickname }}</div>
                    </el-col>
                    <el-col :span="4">
                      <div class="latest">{{ item.last_time }}</div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="20">
                      <div class="msg">{{ item.last_msg }}</div>
                    </el-col>
                    <el-col :span="4">
                      <el-badge
                        :value="item.unread"
                        :max="99"
                        class="unread"
                      />
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
import storage from '@/common/storage'
var userInfo = JSON.parse(storage.get(storage.USER_INFO))

export default {
  name: 'Alive',
  data() {
    return {
      activeClass: -1
    }
  },
  computed: {
    aliveData() {
      return this.$store.state.aliveList
      // return this.$store.getters.getAliveList
    }
  },
  created() {
    if (this.$store.state.curSelected && this.$store.state.curSelected.index) {
      this.activeClass = this.$store.state.curSelected.index
    } else {
      if (this.$router.currentRoute.path !== '/') this.$router.push('/')
    }
  },
  methods: {
    selectUser(index, uinfo) {
      this.$store.commit('clearMsg')
      this.activeClass = index
      const localMsg = this.getRecord(uinfo.to_id)
      this.$store.commit('pushMsg', localMsg)
      this.$store.commit('setCurSelectUser', {
        index: index,
        uid: uinfo.to_id,
        nickname: uinfo.nickname,
        avatar: uinfo.avatar
      })
      this.clearUnread(uinfo.to_id)
    },
    // 拉取本地聊天记录
    getRecord(toUid) {
      const msgkey = 'msg_' + userInfo.uid + '_' + toUid
      const msg = storage.get(msgkey)
      return JSON.parse(msg)
    },
    // 清空未读消息数
    clearUnread(toUid) {
      const aliveList = this.$store.state.aliveList
      aliveList[toUid].unread = ''
      this.$store.commit('setAliveList', aliveList)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  background: rgb(245, 245, 245);
  height: 24px !important;
  font-size: 12px;
}
.active {
  background: $SelectedColor !important;
}
.alive {
  .alive-item:hover {
    background: $SelectedColor;
    cursor: pointer;
  }
  .alive-item {
    line-height: 58px;
    background: rgb(255, 255, 255);
    border-bottom: 1px #f6f6f6 solid;
    .avatar {
      margin-left: 8px;
      // img {
      //   width: 40px;
      //   height: 40px;
      //   margin-left: 8px;
      // }
    }
    .custom-img{
      border-radius: 50%;
    }
    .content {
      line-height: 30px;
      color: #9c9c9c;
      font-size: 12px;
      .nickname {
        color: #000;
        font-size: 14px;
      }
      .msg {
        font-size: 12px;
      }
      .latest {
        text-align: center;
      }
      .unread {
        float: right;
        margin-right: 10px;
      }
    }
  }
}
</style>
