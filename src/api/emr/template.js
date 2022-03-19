import {post,get,put,del} from '@/utils/request'

export function getUsableList(data) {
  return get('/template/usable-list', data, true)
}

export function getTree(data) {
  return get('/template/manage-tree-param', data, true)
}

export function save(data) {
  return post('/template/default', data, true)
}

export  function saveAs(data){
  return post('/template/saveAs',data,true)
}

export function update(data) {
  return put('/template/default/' + data.templateId, data, true)
}

export function getByParams(data) {
  return get('/template/hos-page', data, true)
}

export function removeTemplate(data) {
  return del('/template/batch', data, true)
}

export function getNextSeq(data){
  return get('/template/seq_no', data, true)
}


export function setEnable(data) {
  return put('/template/enable/batch', data, true)
}

export function setDisable(data) {
  return put('/template/disable/batch', data, true)
}

export function getDetail(id, data) {
  return get('/template/' + id , data, true)
}

export function getContent(id, data) {
  return get('/template/content/' + id , data, true)
}

export function getByCode(code, data) {
  return get('/template/code/' + code , data, true)
}

export function saveContent(data) {
  return post('/template/content', data, true)
}

export function getDiagnosisMes(data){
  return get(url+'/patDiag/getDiagnosisMes', data, true)
}

export function getTypeGroupSelectByCondition(data){
  return get('/typeGroup/getTypeGroupSelectByCondition', data, true)
}

export function getTypeSelectByCondition(data){
  return get('/type/getTypeSelectByCondition', data, true)
}

export function copyTemplates(data) {
  return put('/template/copy', data, true)
}

export function upVersion(data){
  return put('/template/up-version/' + data.flag,data,true)
}

export function checkUpVersion(data) {
  return get('/template/check-version', data, true)
}

