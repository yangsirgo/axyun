import { post, get, patch } from '@/utils/requestEmr'

//getList
export function getManageList(data) {
  return get('/speChar/getByParamsInPage', data, false)
}
export function getListByParams(data) {
  return get('/speChar/getListByParams', data, false)
}
export function save(data) {
  return post('/speChar/insert', data, true)
}

export function update(data) {
  return post('/speChar/update', data, true)
}

export function remove(id, data) {
  return patch('/speChar/{id}/' + id)
}
export function removeSpecialSymbalbatch(data) {
  return patch('/speChar/batch', data, true)
}
export function multiUpdate(data) {
  return post('/speChar/multiUpdate', data, true)
}
export function getDetail(id) {
  return get('/speChar/' + id, null)
}
// 获取seq编码
export function getCd(data) {
  return get('/speChar/seq_no', data, false)
}

