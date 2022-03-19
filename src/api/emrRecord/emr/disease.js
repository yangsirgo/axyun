import { post, get, patch } from '@/utils/requestEmr'

//新增
export function insert(data) {
  return post('/diseases/insert', data, false)
}
//修改单条数据
export function update(data) {
  return post('/diseases/update', data, false)
}
//批量修改
export function multiUpdate(data) {
  return post('/diseases/multiUpdate', data, false)
}
//批量删除
export function removeBatch(data) {
  return patch('/diseases/batchDeleteDiseases', data, false)
}
//带条件分页查询   get
export function getManageList(data) {
  return get('/diseases/getByParamsInPage', data, false)
}
//根据指定ID获取数据  get
export function getDetail(id) {
  return get('/diseases/getById/' + id, null, false)
}
// 获取seq编码
export function getCd(data) {
  return get('/diseases/seq_no', data, false)
}
//根据指定ID获取数据  get
export function getAll() {
  return get('/diseases/all', false)
}


