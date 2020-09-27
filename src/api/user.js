/**
 * user模块接口列表
 */
import http from '@/utils/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

const user = {
  // 登录
  login(params) {
    return http.post('/user/login', qs.stringify(params))
  },
  // 注册
  register(params) {
    return http.post('/user/register', qs.stringify(params))
  },
  // 用户列表
  userList() {
    return http.get('/user')
  },
  // 用户详情
  userDetail(id, params) {
    return http.get('/user/${id}', {
      params: params
    })
  },
  // 获取个人表情
  getEmoji(params) {
    return http.get('/user/getEmoji', {
      params: params
    })
  },
  // 添加个人表情
  addEmoji(params) {
    return http.get('/user/addEmoji', {
      params: params
    })
  },
  // 修改头像
  updateAvatar(params) {
    return http.post('/user/updateAvatar', qs.stringify(params))
  }
}

export default user
