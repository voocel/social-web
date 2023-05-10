<template>
  <div class="leftnav">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane name="first">
        <span slot="label">
          <i class="el-icon-chat-dot-round" /> 当前会话
        </span>
        <alive />
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"> <i class="el-icon-user" /> 我的好友 </span>
        <friend :friends-data="friendsData" />
      </el-tab-pane>
      <el-tab-pane name="three">
        <span slot="label"> <i class="iconfont">&#xeb9e;</i> 我的群聊 </span>
        <group :groups-data="groupsData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Friend from './Friend'
import Group from './Group'
import Alive from './Alive'
import storage from '@/common/storage'
var userInfo = JSON.parse(storage.get(storage.USER_INFO))

export default {
  name: 'LeftNav',
  components: {
    Friend,
    Group,
    Alive
  },
  data() {
    return {
      activeName: 'first',
      friendsData: [],
      groupsData: []
    }
  },
  methods: {
    handleTabClick(e) {
      switch (e.name) {
        case 'first':
          this.handleGetAlive()
          break
        case 'second':
          this.handleGetFriends()
          break
        case 'three':
          this.handleGetGroups()
          break
        default:
          break
      }
    },
    handleGetAlive() {},
    handleGetFriends() {
      this.$api.friend
        .getFriends()
        .then(res => {
          if (res.data.code === 0) {
            this.friendsData = res.data.data
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
    },
    handleGetGroups() {
      this.$api.group
        .getGroups({
          uid: userInfo.uid
        })
        .then(res => {
          if (res.data.code === 0) {
            this.groupsData = res.data.data
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin: 0 0 0 10px;
}
.leftnav {
  font-family: "Poppins", sans-serif;
}
</style>
