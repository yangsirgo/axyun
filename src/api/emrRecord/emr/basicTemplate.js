import { post, get, patch } from '@/utils/requestEmr'

export function getBasicTemplateList(data) {
  return get('/basicTemplate/list', data, true)
}
export function getPage(data) {
  return get('/basicTemplate//manage-page', data, true)
}
export function save(data) {
  return post('/basicTemplate/default', data, true)
}
export function update(id, data) {
  return post(`/basicTemplate/default/${id}`, data, true)
}
export function remove(data) {
  return patch('/basicTemplate/batch', data, true)
}
export function setEnable(data) {
  return post('/basicTemplate/enable/batch', data, true)
}
export function setDisable(data) {
  return post('/basicTemplate/disable/batch', data, true)
}
export function getDetail(id, data) {
  return get('/basicTemplate/' + id, data, true)
}
export function getContent(data) {
  return get('/basicTemplate/content/' + data.id, data, true)
}
export function saveContent(data) {
  return post('/basicTemplate/content', data, true)
}
export function copy(data) {
  return post('/basicTemplate/copy', data, true)
}

export function getNextSeq(data) {
  return get('/basicTemplate/seq_no', data, true)
}


export function putLocalEn(enId, data) {
  return post(`/en/local-en/${enId}`, data, false)
}
