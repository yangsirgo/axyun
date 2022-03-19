import {post,get,put,del} from '@/utils/request'

export function getTree(data){
  return get('/main/getTree', data, true)
}
export function getTempalteTree(data) {
  return get('/main/getTempalteTree',data)
}

export function contentQuery(data){
  return get('/mr/contentQuery', data, true)
}

export function save(data){
  return post('/main/save', data, true)
}

export function modifyContent(data){
  return put('/mr/modifyContent', data, true)
}

export function removeMr(data){
  return del('/mr/remove', data, true)
}

export function attributeQuery(data){
  return get('/mr/attributeQuery', data, true)
}

export function modifyAttribute(data){
  return put('/mr/modifyAttribute', data, true)
}

export function contentQueryByCondition(data) {
  return get('/mr/contentQueryByCondition',data)
}

export function getMrHomePage(data) {
  return get('/mr/getMrHomePage',data)
}

export function byPatientList(data) {
  return get('/mr/by-patient-list',data)
}

export function byIdList(data) {
  return get('/mr/by-id-list',data)
}


export function checkCancelStatus(data){
  return get('/mr/checkCancelStatus',data)
}

export function checkMrCreatedBy(data){
  return get('/mr/checkMrCreatedBy/' + data.mrId + '/' + data.createdBy,{},false)
}

export function finishWrite(data) {
  return get('/mr/mrFile/' + data.patientId + '/' + data.enId,{},true)
}

export function getRecentRecordByPatientId(patientId) {
  return get('/appointment/high-blood-screen/getRecentRecordByPatientId/' + patientId, {} ,true)
}
