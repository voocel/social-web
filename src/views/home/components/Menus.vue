<template>
  <div class="menu">
    <!-- <el-radio-group v-model="isCollapse">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>-->
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="1">
        <i class="el-icon-chat-dot-square" />
        <span slot="title">会话</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu" />
          <span slot="title">导航二</span>
        </template>
        <el-menu-item-group>
          <span slot="title">分组一</span>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <span slot="title">选项4</span>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3">
        <i class="el-icon-setting" />
        <span slot="title">设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import storage from '@/common/storage'
var userInfo = JSON.parse(storage.get(storage.USER_INFO))

export default {
  name: 'Menus',
  data() {
    return {
      isCollapse: true,
      showCutter: false,
      nickname: userInfo.nickname,
      avatarSrc: ''
    }
  },
  created() {
    this.avatarSrc = userInfo.avatar
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-aside {
  text-align: left;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu {
  height: calc(100vh - 60px);
  background-color: rgb(238, 238, 238);
  // background: #f3f3f3;
}
// .menu {
//   height: 100vh;
// }
</style>

<style>
.el-aside {
  text-align: left !important;
}
</style>
