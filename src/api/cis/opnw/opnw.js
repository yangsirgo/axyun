import {
  post,
  get,
  put,
  del
} from '@/utils/request'
const url = '/opnw'

/**
 * 获取患者皮试结果信息
 * @param data
 * @returns {*}
 */
export function getExecResult(data) {
  return get(url+'/execRecord/info', data, false)
}


