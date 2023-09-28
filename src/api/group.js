/**
 * group模块接口列表
 */
import http from '@/utils/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

const group = {
  // 创建群组
  createGroup(params) {
    return http.post('/group/create', params)
  },
  // 获取群聊列表
  getGroups(params) {
    return http.get('/group/list', qs.stringify(params))
  },
  // 加入群聊
  joinGroup(params) {
    return http.post('/group/joinGroup', params)
  }
}

export default group
