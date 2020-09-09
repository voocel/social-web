<template>
  <div class="header">
    <div class="head-avatar">
      <el-dropdown class="item" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <avatar
            v-if="!avatarSrc"
            :size="45"
            :lighten="60"
            :username="nickname"
          />
          <img v-else class="uinfo-avatar" :src="avatarSrc" alt>
          <div :class="[isOnline === true ? 'online' : 'offline']" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">个人中心</el-dropdown-item>
          <el-dropdown-item command="b">修改头像</el-dropdown-item>
          <el-dropdown-item command="c">修改昵称</el-dropdown-item>
          <el-dropdown-item command="d" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <avatar-crop
        v-if="showCutter"
        return-type="url"
        @cancel="showCutter = false"
        @enter="uploadAvatar"
      />
    </div>
    <search />
    <add />
    <friend-apply />
  </div>
</template>

<script>
import AvatarCrop from '@/components/AvatarCrop'
import Search from './Search'
import Add from './Add'
import FriendApply from './FriendApply'
import storage from '@/common/storage'
const userInfo = JSON.parse(storage.get(storage.USER_INFO))

export default {
  name: 'Header',
  components: {
    AvatarCrop,
    Search,
    Add,
    FriendApply
  },
  props: {
    isOnline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showCutter: false,
      nickname: userInfo.nickname,
      avatarSrc: ''
    }
  },
  mounted() {
    // this.$refs.abc.style.background='blue'
  },
  created() {
    this.avatarSrc = userInfo.avatar
  },
  methods: {
    uploadAvatar(src) {
      this.avatarSrc = src
      this.showCutter = false
      console.log(src)
      this.$api.user
        .updateAvatar({
          image: src
        })
        .then(res => {
          if (res) {
            if (res.data.code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              userInfo.avatar = res.data.result
              storage.set(storage.USER_INFO, JSON.stringify(userInfo))
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          }
        })
    },
    handleCommand(command) {
      switch (command) {
        case 'b':
          this.showCutter = true
          break
        case 'd':
          this.logout()
          break
        default:
          break
      }
    },
    logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          storage.del(storage.USER_INFO)
          storage.del(storage.USER_TOKEN)
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.head-avatar {
  float: left;
}
.header {
  text-align: left;
  //   background-color: #f3f3f3;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #eee;
  .item {
    width: 63px;
    margin-left: 0px;
    padding-left: 8px;
    background: rgb(62, 69, 77);
    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
      position: relative;
      .online {
        position: absolute;
        top: 26px;
        left: 45px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: rgb(92, 247, 3);
      }
      .offline {
        position: absolute;
        top: 26px;
        left: 45px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: red;
      }
      .uinfo-avatar {
        width: 45px;
        height: 45px;
        border-radius: 10%;
        overflow: hidden;
      }
    }
  }
}
</style>
