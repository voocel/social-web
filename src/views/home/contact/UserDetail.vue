<template>
  <div class="container">
    <div class="user-header-content-container">
      <div class="header">
        <div v-if="user.avatar == ''">
          <avatar :size="40" :lighten="60" :username="user.name" />
        </div>
        <div v-else>
          <img :src="user.avatar" alt="">
        </div>
        <div class="name">
          <h2>{{ user.name }}</h2>
        </div>
      </div>
      <div class="content">
        <ul>
          <li>
            <label>备注名</label>
            <div class="alias">
              <input
                ref="input"
                type="text"
                :value="user.alias"
                placeholder="备注名"
                @keyup.enter="updateAlias"
              >
            </div>
          </li>
          <li>
            <label>ID</label>
            <p>{{ user.name }}</p>
          </li>
          <li>
            <label>地区</label>
            <p>未知</p>
          </li>
          <li>
            <label>标签</label>
            <p>{{ user.label }}</p>
          </li>
        </ul>
      </div>
      <div class="footer">
        <div class="action" @click="chat">
          <i class="icon-ion-ios-chatboxes-outline" />
          <a>发消息</a>
        </div>
        <div class="action" @click="startAudioCall">
          <i class="icon-ion-ios-telephone-outline" />
          <a>语音通话</a>
        </div>
        <div class="action" @click="startVideoCall">
          <i class="icon-ion-ios-videocam-outline" />
          <a>视频通话</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDetail',
  components: {},
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  methods: {
    chat() {
      this.$router.replace('/chat')
    },
    updateAlias() {},
    startAudioCall() {},
    startVideoCall() {}
  }
}
</script>

<style lang="scss" scoped>
.container {
  border-top-right-radius: var(--main-border-radius);
  border-bottom-right-radius: var(--main-border-radius);
  display: flex;
  justify-content: center;
}

.user-header-content-container {
  width: 400px;
}

.header {
  margin-top: 60px;
  height: 75px;
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #e6e6e6;
}

.header .avatar {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  margin-right: 20px;
}

.header .name {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.header .name h2 {
  font-size: 15px;
  font-style: normal;
  font-weight: normal;
  margin-bottom: 5px;
}

.header .name p {
  font-size: 13px;
  color: #7f7f7f;
}

.content {
  width: 100%;
  text-align: left;
  border-bottom: 1px solid #e6e6e6;
}

.content ul {
  list-style: none;
  margin: 20px 0 10px 0;
}

.content ul li {
  margin-left: 0;
  height: 40px;
  line-height: 40px;
  display: flex;
  font-size: 12px;
}

.content ul li label {
  margin-right: 20px;
  width: 40px;
  text-align: justify;
  text-align-last: justify;
  color: #7f7f7f;
}

.content ul li p {
  font-size: 12px;
}

.content ul li .alias > input {
  width: 100%;
  border: none;
  border-radius: 3px;
  outline: none;
  padding: 5px;
  color: #bfbfbf;
  font-size: 13px;
}

.content ul li .alias > input:active {
  border: 1px solid #4168e0;
}

.content ul li .alias input:focus {
  border: 1px solid #4168e0;
}

.content ul li > div {
  display: inline-block;
  flex: 1;
}

.footer {
  display: flex;
  justify-content: center;
  padding-top: 30px;
}

.footer .action {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: #5d7ce8;
}

.footer .action a {
  font-size: 10px;
  padding-top: 1px;
}

.footer .action i {
  font-size: 20px;
}
</style>
