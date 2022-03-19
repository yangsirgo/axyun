import {
  post,
  get,
  put,
  del
} from '@/utils/request'

// 获取收费项目列表
export function getChargeItemList(data) {
  return get('/finance-pub/chargeItem/getChargeItem', data)
}
// 新增收费项目
export function addChargeItem(data) {
  return post('/finance-pub/chargeItem/addChargeItem', data)
}
// 更新收费项目
export function updateChargeItem(data) {
  return put('/finance-pub/chargeItem/updateChargeItem', data)
}
// 删除收费项目
export function deleteChargeItem(data) {
  return del('/finance-pub/chargeItem/deleteChargeItem', data)
}
