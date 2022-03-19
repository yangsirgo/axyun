import {post,get,put,del} from '@/utils/request'

export function getParagraphTypeList(data) {
  return get('/paragraphType/list', data, true)
}

export function getParagraphTypeOpt(data) {
  return get('/paragraphType/list', data, true)
}

export function getTypeByCode(data){
  return get('/paragraphType/by-code', data, true)
}

export function getNextSeq(data){
  return get('/paragraphType/seq_no', data, true)
}
