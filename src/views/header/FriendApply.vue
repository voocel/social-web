<template>
  <div>
    <div class="head-newfriend" @click="dialogTableVisible = true">
      <i style="font-size:20px;" class="iconfont">&#xeb92;</i>
      <div v-if="hasNewFriend" class="newfriend-dot" />
    </div>
    <el-dialog width="40%" title="好友申请" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
      <el-table :data="applyData" :show-header="false">
        <el-table-column property="from_id" width="110" />
        <el-table-column property="remark" />
        <el-table-column property="created_at">
          <template slot-scope="scope">
            <span style="color: #aaa; font-size: 12px">{{ formatDate(scope.row.created_at,"yyyy-MM-dd HH:mm:ss") }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">
              <el-button
                size="mini"
                @click="handleRefuse(scope.$index, scope.row)"
              >拒绝</el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleAgree(scope.$index, scope.row)"
              >同意</el-button>
            </div>
            <div v-else-if="scope.row.status == 1">
              <span style="color:silver;">已同意</span>
            </div>
            <div v-else>
              <span style="color:silver;">已拒绝</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '@element-ui/src/utils/date-util'
export default {
  name: 'FriendApply',
  data() {
    return {
      dialogTableVisible: false,
      applyData: [],
      hasNewFriend: false
    }
  },
  watch: {
    dialogTableVisible(v) {
      if (v === true) {
        this.handleGetFriendApply()
      }
    }
  },
  created() {
    this.handleGetFriendApply()
  },
  methods: {
    formatDate(params) {
      formatDate(params)
    },
    handleAgree(index, row) {
      console.log(index, row)
      this.$api.friend
        .agreeFriendApply({
          from_id: row.from_id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.handleGetFriendApply()
            console.log(res)
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
    },
    handleRefuse(index, row) {
      console.log(index, row)
      this.$api.friend
        .refuseFriendApply({
          from_id: row.from_id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.handleGetFriendApply()
            console.log(res)
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
    },
    handleGetFriendApply() {
      this.$api.friend.getFriendApply().then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          this.applyData = res.data.data
          this.applyData.forEach(e => {
            if (e.status === 0) {
              this.hasNewFriend = true
            }
          })
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
::v-deep .el-table_1_column_2 {
  color: gray;
  font-size: 13px;
}
::v-deep .el-dialog__body {
  padding: 0 10px 20px 15px;
}
.head-newfriend {
  float: left;
  cursor: pointer;
  position: relative;
  .newfriend-dot {
    position: absolute;
    top: 21px;
    left: 19px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgb(240, 85, 85);
  }
}
</style>
