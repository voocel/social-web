<template>
  <div class="login">
    <div class="wrapper fadeInDown">
      <div class="formContent">
        <h1 class="active">登 录</h1>
        <div>
          <avatar
            v-if="username"
            class="icon"
            :size="100"
            :lighten="180"
            :username="username"
          />
          <img v-else src="../../assets/images/avatar.png" width="30%" alt>
        </div>
        <form>
          <input v-model="username" type="text" placeholder="用户名">
          <input v-model="password" type="password" placeholder="密码">
          <input
            type="button"
            style="cursor:pointer"
            value="登录"
            @click="login"
          >
          <router-link to="/register">
            <el-button size="mini" type="text">点击注册</el-button>
          </router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import storage from '@/common/storage'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      if (this.username !== '' && this.password !== '') {
        this.$api.user
          .login({
            username: this.username,
            password: this.password
          })
          .then(res => {
            if (res) {
              var result = res.data
              if (res.data.code === 0) {
                const data = {
                  uid: result.data.id,
                  username: result.data.username,
                  avatar: result.data.avatar
                }
                storage.set(storage.USER_INFO, JSON.stringify(data))
                storage.set(storage.USER_TOKEN, result.data.access_token)
                this.$router.push('/')
              } else {
                this.$message({
                  message: result.msg,
                  type: 'error'
                })
              }
            }
          })
      } else {
        const message = this.username === '' ? '请输入用户名' : '请输入密码'
        this.$message({
          message: message,
          type: 'warn'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  // background-color: #39ace7;
  font-family: "Poppins", sans-serif;
  height: 100vh;
  .wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-height: 100%;
    .formContent {
      -webkit-border-radius: 12px 12px 12px 12px;
      border-radius: 12px 12px 12px 12px;
      background: #fff;
      padding: 32px;
      width: 80%;
      max-width: 330px;
      position: relative;
      padding: 10px 0 20px;
      -webkit-box-shadow: 0 32px 62px 0 rgba(0, 0, 0, 0.3);
      box-shadow: 0 32px 62px 0 rgba(0, 0, 0, 0.3);
      text-align: center;
      h1 {
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        display: inline-block;
        margin: 20px 4px 5px;
        color: #cccccc;
      }
      .active {
        text-align: center;
        font-size: 18px;
        text-transform: uppercase;
        display: inline-block;
        padding: 10px 10px 20px;
        color: #39ace7;
      }
      form {
        input[type="button"],
        input[type="reset"],
        input[type="submit"] {
          background-color: #39ace7;
          border: none;
          color: white;
          padding: 10px 30px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          text-transform: uppercase;
          font-size: 14px;
          -webkit-box-shadow: 0 6px 16px 0 rgba(95, 186, 233, 0.4);
          box-shadow: 0 6px 16px 0 rgba(95, 186, 233, 0.4);
          -webkit-border-radius: 4px 4px 4px 4px;
          border-radius: 4px 4px 4px 4px;
          margin: 10px 12px 24px;
          -webkit-transition: all 0.3s ease-in-out;
          -moz-transition: all 0.3s ease-in-out;
          -ms-transition: all 0.3s ease-in-out;
          -o-transition: all 0.3s ease-in-out;
          transition: all 0.3s ease-in-out;
        }

        input[type="button"]:hover,
        input[type="reset"]:hover,
        input[type="submit"]:hover {
          background-color: #39ace7;
        }

        input[type="button"]:active,
        input[type="reset"]:active,
        input[type="submit"]:active {
          -moz-transform: scale(0.95);
          -webkit-transform: scale(0.95);
          -o-transform: scale(0.95);
          -ms-transform: scale(0.95);
          transform: scale(0.95);
        }

        input[type="password"],
        input[type="text"] {
          background-color: #f6f6f6;
          border: none;
          color: #0d0d0d;
          padding: 8px 18px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
          margin: 20px;
          width: 76%;
          border: 1px solid #f6f6f6;
          -webkit-transition: all 0.5s ease-in-out;
          -moz-transition: all 0.5s ease-in-out;
          -ms-transition: all 0.5s ease-in-out;
          -o-transition: all 0.5s ease-in-out;
          transition: all 0.5s ease-in-out;
          -webkit-border-radius: 4px 4px 4px 4px;
          border-radius: 4px 4px 4px 4px;
        }

        input[type="text"]:focus {
          background-color: #fff;
          border-bottom: 1px solid #5fbae9;
        }

        input[type="password"]:focus {
          background-color: #fff;
          border-bottom: 1px solid #5fbae9;
        }

        input[type="text"]:placeholder {
          color: #cccccc;
        }

        input[type="password"]:placeholder {
          color: #cccccc;
        }
      }
    }

    .fadeInDown {
      -webkit-animation-name: fadeInDown;
      animation-name: fadeInDown;
      -webkit-animation-duration: 1s;
      animation-duration: 1s;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
    }
    @-webkit-keyframes fadeInDown {
      0% {
        opacity: 0;
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
      }

      100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
      }
    }
    @keyframes fadeInDown {
      0% {
        opacity: 0;
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
      }

      100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
      }
    }
  }
}
*:focus {
  outline: none;
}
.icon {
  margin: 0 auto;
}
</style>
