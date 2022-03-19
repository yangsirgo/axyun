import {
  post,
  get,
  put,
  del
} from '@/utils/request'


/**
 * 获取药品字典
 * @param data
 * @returns {*}
 */
export function getDrugDict(data) {
  return get('/hmm-stock/drugDict/params', data)
}
