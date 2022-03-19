import {
  post,
  get,
  put,
  del
} from '@/utils/request';
// 查询预约字典目录
export function getDictItemByPage(params) {
  return get('/appointment/dictItem/getDictItemByPage', params)
}
// 新增预约字典目录
export function addDictItem(params) {
  return post('/appointment/dictItem/addDictItem', params)
}
// 修改预约字典目录
export function updateDictItem(params) {
  return put('/appointment/dictItem/updateDictItem', params)
}
// 删除预约字典
export function delDictItem(params) {
  return del('/appointment/dictItem/delDictItem/' + params)
}
// 查询预约字典
export function getPageDictValueList(params) {
  return get('/appointment/dictValue/getPageDictValueList', params)
}
// 新增预约字典
export function adddictValue(params) {
  return post('/appointment/dictValue/adddictValue', params)
}
// 修改预约字典
export function updatedictValue(params) {
  return put('/appointment/dictValue/updatedictValue', params)
}
// 删除预约字典
export function deldictValue(params) {
  return del('/appointment/dictValue/deldictValue/' + params)
}
