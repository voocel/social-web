<template>
  <div>
    <div class="head-add">
      <el-popover placement="bottom" width="120" trigger="click">
        <div class="add-list">
          <ul>
            <li @click="friendVisible = true">
              <i class="iconfont">&#xeb92;</i>添加好友
            </li>
            <li @click="groupVisible = true">
              <i class="iconfont">&#xeb9d;</i>创建群组
            </li>
          </ul>
        </div>
        <el-button slot="reference" class="add-btn">
          <span>
            <i class="el-icon-plus" />
          </span>
        </el-button>
      </el-popover>
      <el-dialog title="添加" :visible.sync="friendVisible" :close-on-click-modal="false" width="24%" center>
        <div>
          <el-input v-model="friendId" placeholder="请输入用户ID" clearable>
            <template slot="prepend">用户ID</template>
          </el-input>
          <el-input
            v-model="applyInfo"
            type="textarea"
            :rows="3"
            placeholder="请求添加你为好友"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="friendVisible = false">取 消</el-button>
          <el-button type="primary" @click="addFriend">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="创建" :visible.sync="groupVisible" :close-on-click-modal="false" width="24%" center>
        <div>
          <el-input v-model="groupName" placeholder="请输入群组名称" clearable>
            <template slot="prepend">群组名称</template>
          </el-input>
          <el-input
            v-model="groupNotice"
            placeholder="请输入群组描述"
            clearable
          >
            <template slot="prepend">群组描述</template>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="groupVisible = false">取 消</el-button>
          <el-button type="primary" @click="createGroup">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import storage from '@/common/storage'
var userInfo = JSON.parse(storage.get(storage.USER_INFO))

export default {
  name: 'Add',
  data() {
    return {
      friendVisible: false,
      groupVisible: false,
      groupName: '',
      friendId: '',
      applyInfo: '',
      groupNotice: ''
    }
  },
  methods: {
    addFriend() {
      this.$api.friend
        .addFriendApply({
          uid: userInfo.uid,
          friend_id: this.friendId,
          apply_info: this.applyInfo
        })
        .then(res => {
          if (res.data.code === 200) {
            this.friendVisible = false
            this.$message({
              message: '发送申请成功,等待对方同意',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
    },
    createGroup() {
      this.$api.group
        .createGroup({
          name: this.groupName,
          notice: this.groupNotice
        })
        .then(res => {
          if (res.data.code === 200) {
            this.groupVisible = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.head-add {
  float: left;
}
.add-list {
  li {
    line-height: 30px;
    cursor: pointer;
    i {
      margin-left: 5px;
      padding-right: 8px;
    }
  }
  li:hover {
    background-color: rgb(224, 238, 252);
  }
}

.head-add {
  height: 60px;
  line-height: 60px;
  .add-btn {
    border: 0px;
    color: rgb(42, 218, 42);
    font-size: 20px;
  }
  .add-btn:hover {
    background: #fff;
  }
}
</style>
