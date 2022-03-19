import { post, get, patch } from '@/utils/requestEmr'

export function getParagraphTypeList(data) {
  return get('/paragraphType/list', data, true)
}

export function getParagraphTypeOpt(data) {
  return get('/paragraphType/list', data, true)
}

export function getTypeByCode(data) {
  return get('/paragraphType/by-code', data, true)
}

export function getNextSeq(data) {
  return get('/paragraphType/seq_no', data, true)
}


export function getIcd10DictionaryByKey(key = '') {
  return get(`/icd10Dictionary/getIcd10DictionaryByKey/${key}`, false)
}

export function getAllIcd10Dictionary() {
  return get('/icd10Dictionary/all', false)
}

export function getIcd10DictionaryPage(data) {
  return get('/icd10Dictionary/page', data, false)
}


export function create(data) {
  return post('/paragraphType/default', data, true)
}

export function getParagraphTypeNextSeqNo(data) {
  return get('/paragraphType/seq_no', data, true)
}
export function deleteByParagraphType(data) {
  return patch('/paragraphType/delete/', data, true)
}
