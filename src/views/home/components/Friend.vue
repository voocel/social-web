<template>
  <div class="friends">
    <ul>
      <router-link to="/chat">
        <li
          class="friends-item"
          :class="{ active: activeClass == index }"
          v-for="(item, index) in friendsData"
          :key="index"
          @click="selectFriend(index, item)"
        >
          <el-row>
            <el-col :span="4">
              <div class="avatar">
                <!-- <img :src="item.avatar" alt="" /> -->
                <avatar
                  :size="36"
                  :lighten="60"
                  :username="item.nickname"
                ></avatar>
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
import storage from "@/common/storage";
var userInfo = JSON.parse(storage.get(storage.USER_INFO));

export default {
  name: "Friend",
  data() {
    return {
      activeClass: -1
    };
  },
  props: {
    friendsData: Array
  },
  methods: {
    selectFriend(index, uinfo) {
      this.$store.commit("clearMsg");
      this.activeClass = index;
      let localMsg = this.getRecord(uinfo.friend_id);
      this.$store.commit("pushMsg", localMsg);
      this.$store.commit("setCurSelectUser", {
        uid: uinfo.friend_id,
        nickname: uinfo.nickname,
        avatar: uinfo.avatar
      });
    },
    getRecord(toUid) {
      let msgkey = "msg_" + userInfo.uid + "_" + toUid;
      let msg = storage.get(msgkey);
      return JSON.parse(msg);
    }
  }
};
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
    margin-top: 1px;
    border-bottom: 1px #f6f6f6 solid;
    .avatar {
      margin-top: 11px;
      margin-left: 8px;
      // img {
      //   width: 40px;
      //   height: 40px;
      //   margin-left: 8px;
      // }
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
