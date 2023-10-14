import http from '@/utils/http'
import qs from 'qs'

const message = {
  // 获取历史消息
  getMessages(params) {
    return http.get('/message/list', qs.stringify(params))
  },
  // 获取群组历史消息
  getGroups(params) {
    return http.get('/groupMessage/list', qs.stringify(params))
  }
}

export default message
