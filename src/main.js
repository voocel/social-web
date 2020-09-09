import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import Avatar from 'vue-avatar'
import VueChatScroll from 'vue-chat-scroll'
import Common from '@/common/common.js'
import Api from './api'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/reset.css'
import '@/assets/styles/iconfont.css'
import directives from './directives'
import storage from '@/common/storage'

Object.keys(directives).forEach(k => Vue.directive(k, directives[k]))
Vue.use(ElementUI)
Vue.use(VueChatScroll)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.component('Avatar', Avatar)
Vue.prototype.common = Common
Vue.prototype.$api = Api

// 导航守卫
router.beforeEach(async(to, from, next) => {
  if (to.meta.requiresAuth === false) {
    next()
  } else {
    const token = storage.get(storage.USER_TOKEN)
    if (!token) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
