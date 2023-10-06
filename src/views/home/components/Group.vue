<template>
  <div class="groups">
    <ul>
      <router-link to="/chat">
        <li
          v-for="(item, index) in groupsData"
          :key="index"
          class="groups-item"
          :class="{ active: activeClass == index }"
          @click="selectGroup(index, item)"
        >
          <el-row>
            <el-col :span="4">
              <div class="avatar">
                <div v-if="item.avatar == ''" class="avatar-default">
                  <avatar
                    :size="40"
                    :lighten="60"
                    :username="item.name"
                  />
                </div>
                <div v-else>
                  <img height="40" width="40" :src="item.avatar" alt="">
                </div>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="group-name">{{ item.name }}</div>
            </el-col>
          </el-row>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { route } from '@/utils/message'
export default {
  name: 'Group',
  props: {
    groupsData: {
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
    selectGroup(index, info) {
      this.activeClass = index
      this.$store.commit('setCurSelected', {
        id: info.id,
        nickname: info.name,
        avatar: info.avatar,
        route: route.GROUP_MESSAGE
      })
      this.$store.commit('hasNewMsg')
      this.clearUnread(info.id)
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
.groups {
  .groups-item:hover {
    background: $SelectedColor;
    cursor: pointer;
  }
  .groups-item {
    line-height: 60px;
    background: rgb(255, 255, 255);
    margin-top: 1px;
    border-bottom: 1px #f6f6f6 solid;
    .avatar {
      margin-left: 8px;
      img {
        width: 40px;
        height: 40px;
      };
      .avatar-default {
        line-height: 60px;
        margin-top: 10px;
      }
    }
    .group-name {
      line-height: 60px;
      color: #676767;
      font-size: 16px;
      color: #000;
    }
  }
}
</style>
