<template>
  <div class="friends">
    <ul>
      <router-link to="/chat">
        <li
          v-for="(item, index) in friendsData"
          :key="index"
          class="friends-item"
          :class="{ active: activeClass == index }"
          @click="selectFriend(index, item)"
        >
          <el-row>
            <el-col :span="4">
              <div class="avatar">
                <div v-if="item.avatar == ''" class="avatar-default">
                  <avatar
                    :size="40"
                    :lighten="60"
                    :username="item.nickname"
                  />
                </div>
                <div v-else>
                  <img height="40" width="40" :src="item.avatar" alt="">
                </div>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="nickname">{{ item.nickname }}</div>
            </el-col>
          </el-row>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { route, targetType } from '@/utils/message'
export default {
  name: 'Friend',
  props: {
    friendsData: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      activeClass: -1
    }
  },
  methods: {
    selectFriend(index, uinfo) {
      this.activeClass = index
      this.$store.commit('setCurSelected', {
        target_type: targetType.USER,
        id: uinfo.friend_id,
        nickname: uinfo.nickname,
        avatar: uinfo.avatar,
        route: route.MESSAGE
      })
      this.$store.commit('hasNewMsg')
      this.clearUnread(uinfo.friend_id)
    },
    clearUnread(toUid) {
      const aliveList = this.$store.state.aliveList
      if (aliveList[toUid]) {
        aliveList[toUid].unread = ''
        this.$store.commit('setAliveList', aliveList)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.active {
  background: $SelectedColor !important;
}
.friends {
  .friends-item:hover {
    background: $SelectedColor;
    cursor: pointer;
  }
  .friends-item {
    line-height: 60px;
    background: rgb(255, 255, 255);
    border-bottom: 1px #f6f6f6 solid;
    .avatar {
      margin-left: 8px;
      img {
        border-radius: 50%;
      }
      .avatar-default {
        line-height: 60px;
        margin-top: 10px;
      }
    }
    .nickname {
      line-height: 60px;
      color: #676767;
      font-size: 16px;
      color: #000;
    }
  }
}
</style>
