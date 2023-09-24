<template>
  <div class="chat-content">
    <ul>
      <li v-for="(item, index) in msgDatas" :key="index" class="content-item">
        <div class="msg-date">{{ item.timeline }}</div>
        <div v-if="item.self">
          <div class="msg-from self-msg-from">
            <span class="loc">[北京]</span>
            <span class="msg-author">{{ item.nickname }}</span>
            <avatar
              v-if="!avatarSrc"
              :size="36"
              :lighten="60"
              :username="item.nickname"
            />
            <img v-else class="uinfo-avatar" :src="avatarSrc" alt>
          </div>
          <div class="clear" />
          <el-image
            v-if="item.content_type===contentType.IMAGE"
            class="msg-image self-msg-content"
            :src="item.content"
            :preview-src-list="[item.content]"
          />
          <div v-else class="msg-text self-msg-content">{{ item.content }}</div>
        </div>

        <div v-else>
          <div class="msg-from other-msg-from">
            <avatar
              v-if="!item.avatar"
              :size="36"
              :lighten="60"
              :username="item.nickname"
            />
            <img v-else class="uinfo-avatar" :src="item.avatar" alt>
            <span class="msg-author">{{ item.nickname }}</span>
            <span class="loc">[上海]</span>
          </div>
          <div class="clear" />
          <el-image
            v-if="item.content_type===contentType.IMAGE"
            class="msg-image other-msg-content"
            :src="item.content"
            :preview-src-list="[item.content]"
          />
          <div v-else class="msg-text other-msg-content">{{ item.content }}</div>
        </div>
        <div class="clear" />
      </li>
    </ul>
  </div>
</template>

<script>
import storage from '@/common/storage'
import { contentType } from '@/utils/message'

var userInfo = JSON.parse(storage.get(storage.USER_INFO))

export default {
  name: 'ChatBox',
  props: {
    msgDatas: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      avatarSrc: '',
      contentType: contentType
    }
  },
  created() {
    this.avatarSrc = userInfo.avatar
  }
}
</script>

<style lang="scss" scoped>
.clear {
  clear: both;
}
.self-msg-from {
  float: right;
  img {
    margin-right: 5px;
  }
  .msg-author {
    margin-left: 5px;
    margin-right: 5px;
  }
}
.self-msg-content {
  float: right;
  background-color: rgb(133, 206, 97);
  margin-right: 15px;
  text-align: right;
}

.other-msg-from {
  float: left;
  img {
    margin-left: 5px;
  }
  .msg-author {
    margin-left: 5px;
    margin-right: 5px;
  }
}
.other-msg-content {
  float: left;
  background-color: rgb(202, 137, 57);
  margin-left: 15px;
  text-align: left;
}

.chat-content {
  flex: 1;
  width: 100%;
  overflow: auto;
  .content-item {
    width: 100%;
    color: #fff;
    .msg-date {
      text-align: center;
      color: rgb(214, 208, 208);
      font-size: 80%;
    }
    .msg-from {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      span.loc {
        color: rgb(212, 161, 161);
        font-size: 60%;
      }
      .msg-author {
        color: rgb(202, 137, 57);
        font-weight: bold;
      }
      img {
        width: 30px;
        height: 30px;
        border-radius: 15px;
      }
    }
    .msg-text {
      min-width: 40px;
      margin-top: 5px;
      padding: 12px 10px;
      border-radius: 10px;
      word-wrap: break-word;
      word-break: break-all;
    }
    .msg-image {
      width: 120px;
      height: 120px;
      padding: 1px 1px;
    }
  }
}
</style>
