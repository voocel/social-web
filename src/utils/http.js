/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import store from '../store/index'
import tips from './tips'
import storage from '../common/storage'

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      tips.reLoginTip()
      break
    // 403 token过期,清除token并跳转登录页
    case 403:
      tips.msgTip('登录过期，请重新登录')
      storage.del(storage.USER_TOKEN)
      store.commit('loginSuccess', null)
      setTimeout(() => {
        tips.toLogin()
      }, 1000)
      break
    // 404请求不存在
    case 404:
      tips.msgTip('请求的资源不存在')
      break
    default:
      console.log(other)
  }
}

// 创建axios实例
var instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_HREF + process.env.VUE_APP_BASE_API,
  timeout: 1000 * 12
})
// // 设置post请求头
instance.defaults.headers.post['Content-Type'] =
  'application/json'

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
// console.log(storage.get(storage.USER_TOKEN))
instance.interceptors.request.use(
  config => {
    // const token = store.state.token;
    const token = storage.get(storage.USER_TOKEN)
    token && (config.headers.Authorization = token)
    return config
  },
  error => Promise.error(error)
)

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        store.commit('changeNetwork', false)
      } else {
        return Promise.reject(error)
      }
    }
  }
)

export default instance
