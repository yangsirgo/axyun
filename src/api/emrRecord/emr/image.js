import { post, get, patch } from '@/utils/requestEmr'

//新增
export function insert(data) {
  return post('/image/insert', data, true)
}
//修改单条数据   post
export function update(data) {
  return post('/image/update', data, true)
}
//批量修改
export function multiUpdate(data) {
  return post('/image/multiUpdate', data, true)
}
//批量删除
export function removeBatch(data) {
  return patch('/image/batch', data, true)
}
//通过id查找
export function getById(id) {
  return get('/image/getById/' + id, null)
}
//带条件分页查询   get
export function getManageList(data) {
  return get('/image/getByParamsInPage', data, false)
}
//根据指定ID获取数据  get
export function getDetail(id) {
  return get('/image/getById/' + id, null)
}

// 获取seq编码
export function getCd(data) {
  return get('/image/seq_no', data, false)
}

