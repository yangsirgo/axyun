import { post, get, patch } from '@/utils/requestEmr'

//新增
export function insert(data) {
  return post('/sensitiveWord/insert', data, true)
}
//修改单条数据   post
export function update(data) {
  return post('/sensitiveWord/update', data, true)
}
//批量修改
export function multiUpdate(data) {
  return post('/sensitiveWord/multiUpdate', data, true)
}
//批量删除
export function removeBatch(data) {
  return patch('/sensitiveWord/batch', data, true)
}
//带条件无分页查询   get
export function getByParams(data) {
  return get('/sensitiveWord/getByParams', data, false)
}
//带条件分页查询   get
export function getManageList(data) {
  return get('/sensitiveWord/getByParamsInPage', data, false)
}
//根据指定ID获取数据  get
export function getDetail(id) {
  return get('/sensitiveWord/' + id, null)
}
// 获取seq编码
export function getCd(data) {
  return get('/sensitiveWord/seq_no', data, false)
}


