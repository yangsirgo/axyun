import {
  post,
  get,
  put,
  del
} from '@/utils/request'

// 获取收费项目列表
export function getGroupChargeItemList(data) {
  return get('/finance-pub/groupChargeItem/getChargeItem', data)
}
// 获取收费项目详情
export function getGroupChargeItemById(data) {
  return get('/finance-pub/groupChargeItem/get/' + data.chargeItemId, "")
}
// 新增收费项目
export function addGroupChargeItem(data) {
  return post('/finance-pub/groupChargeItem/addChargeItem', data)
}
// 更新收费项目
export function updateGroupChargeItem(data) {
  return put('/finance-pub/groupChargeItem/updateChargeItem', data)
}
// 删除收费项目
export function deleteGroupChargeItem(data) {
  return del('/finance-pub/groupChargeItem/deleteChargeItem', data)
}
// 导入集团收费项目
export function importChargeItem(data) {
  return post('/finance-pub/groupChargeItem/importChargeItem', data)
}