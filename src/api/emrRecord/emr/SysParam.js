import { post, get, patch } from '@/utils/requestEmr'

export function insertParam(data) {
  return post('/param/save', data, false)
}

export function modifyParam(data) {
  return post('/param/modify', data, false)
}

export function getPageInCondition(data) {
  return get('/param/getPageByCondition', data, false)
}

export function detailQuery(data) {
  return get('/param/detailQuery', data, false)
}

export function multiRemove(data) {
  return patch('/param/batch', data, false)
}

export function multiModify(data) {
  return post('/param/modifyList', data, true)
}

export function getParamsByKey(data, loading = false) {
  return get('/param/getByKey', data, loading)
}
