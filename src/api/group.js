/**
 * group模块接口列表
 */
import base from './base' // 导入接口域名列表
import http from '@/utils/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

const group = {
  // 创建群组
  createGroup(params) {
    return http.post(`${base.sq}/group/createGroup`, qs.stringify(params))
  },
  // 获取群聊列表
  getGroups(params) {
    return http.get(`${base.sq}/group/getGroups`, {
      params: params
    })
  }
}

export default group
