/**
 * friend模块接口列表
 */
import http from '@/utils/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

const friend = {
  // 添加好友
  addFriend(params) {
    return http.post('/friend/addFriend', qs.stringify(params))
  },
  // 获取好友列表
  getFriends(params) {
    return http.get('/friend/getFriends', {
      params: params
    })
  },
  // 获取好友申请
  getFriendApply(params) {
    return http.get('/friend/getFriendApply', {
      params: params
    })
  },
  // 添加好友申请
  addFriendApply(params) {
    return http.post('/friend/addFriendApply', qs.stringify(params))
  },
  // 同意好友申请
  agreeFriendApply(params) {
    return http.get('/friend/agreeFriendApply', {
      params: params
    })
  },
  // 拒绝好友申请
  refuseFriendApply(params) {
    return http.get('/friend/refuseFriendApply', {
      params: params
    })
  }
}

export default friend
