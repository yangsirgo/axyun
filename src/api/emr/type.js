import {post,get,put,del} from '@/utils/request'

export function getTypes(data) {
  return get('/type/getTypeSelectByCondition', data, true)
}

export function getTypeList(data) {
  return get('/type/list', data)
}

export function createType(data) {
  return post('/type/default', data, true)
}

export function getTypeInfoById (data) {
  return get('/type/' + data.id,{},true)
}

export function modifyTypeInfoById (data) {
  return put('/type/' + data.typeId,data,true)
}

export function deleteTypeById(data){
  return del('/type/' + data.id,{},true)
}

export function deleteForBatch(data) {
  return del('/type/batch',data,true)

}

export function getTypeByCode(data){
  return get('/type/by-code',data,true)
}

export function getTypeNextSeqNo(data){
  return get('/type/seq_no', data, true)
}

export function getNextTypeNum(data) {
  return get('/type/next-num', data, true)
}
