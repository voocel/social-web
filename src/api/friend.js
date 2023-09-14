/**
 * friend模块接口列表
 */
import http from '@/utils/http' // 导入http中创建的axios实例

const friend = {
  // 获取好友列表
  getFriends(params) {
    return http.get('/friend/list', {
      params: params
    })
  },
  // 获取好友申请
  getFriendApply(params) {
    return http.get('/friend/getApply', {
      params: params
    })
  },
  // 好友申请
  addFriendApply(params) {
    return http.post('/friend/addApply', params)
  },
  // 同意好友申请
  agreeFriendApply(params) {
    return http.get('/friend/agreeApply', {
      params: params
    })
  },
  // 拒绝好友申请
  refuseFriendApply(params) {
    return http.get('/friend/refuseApply', {
      params: params
    })
  }
}

export default friend
