import {
  post,
  get,
  put,
  del
} from '@/utils/request';
const urlA = '/outpatient'
// 查询上侧列表
export function injectionList(data) {
  return post(urlA+'/outpatientOrderQuery/injectionList', data)
}
// 查询上侧列表
export function treatmentList(data) {
  return post(urlA+'/outpatientOrderQuery/treatmentList', data)
}