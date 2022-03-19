import {post,get,put,del} from '@/utils/request'

export function getBasicTemplateList(data) {
  return get('/basicTemplate/list', data, true)
}
export function getPage(data) {
  return get('/basicTemplate//manage-page', data, true)
}
export function save(data){
  return post('/basicTemplate/default', data, true)
}
export function update(data){
  return put('/basicTemplate/default', data, true)
}
export function remove(data){
  return del('/basicTemplate/batch', data, true)
}
export function setEnable(data){
  return put('/basicTemplate/enable/batch', data, true)
}
export function setDisable(data){
  return put('/basicTemplate/disable/batch', data, true)
}
export function getDetail(id, data){
  return get('/basicTemplate/' + id, data, true)
}
export function getContent(data){
  return get('/basicTemplate/content/' + data.id, data, true)
}
export function saveContent(data){
  return post('/basicTemplate/content', data, true)
}
export function copy(data){
  return put('/basicTemplate/copy', data, true)
}

export function getNextSeq(data){
  return get('/basicTemplate/seq_no', data, true)
}


