import {post,get,put,del} from '@/utils/request'

export function getTypeGroups(data) {
  return get('/typeGroup/list', data, true)
}

export function getTree(data){
  return get('/typeGroup/getTree',data)
}

export function create(data){
  return post('/typeGroup/default',data,true)
}

export function getTypeGroupById(data){
  return get('/typeGroup/' + data.id,{}, true)
}

export function modifyTypeGroupById(data){
  return put('/typeGroup/' + data.typeGroupId,data, true)
}

export function deleteById(data){
  return del('/typeGroup/with-sub/' + data.id,{},true)
}

export function getTypeGroupNextSeqNo(data){
  return get('/typeGroup/seq_no', data, true)
}

export function getTypeGroupByCode(data){
  return get('/typeGroup/by-code/' + data.code, data, true)
}
