import {post,get,put,del} from '@/utils/request'

const url = '/common'
// 中医症候保存
export function saveZyDisease(data) {
  return post(url+'/patTcmSyndrome/saveTcmSyndrome', data)
}

// 中医症候查询
export function selectTcmSyndrome(data) {
  return post(url+'/patTcmSyndrome/selectPatTcmSyndrome', data)
}

// 保存中医症候
export function savePatTcmSyndrome(data) {
  return post(url+'/patTcmSyndrome/savePatTcmSyndrome', data)
}


// 疾病字典维护查询接口
export function getXiYiList(data) {
  return post(url+'/icd10Dictionary/getDiagInfo', data)
}

// 中医症候保存
export function icdSaveOrUpdate(data) {
  return post(url+'/icd10Dictionary/saveDiagInfo', data)
}

// 通过id查询中西医疾病信息
export function getDiagInfoById(data) {
  return post(url+'/icd10Dictionary/getDiagInfoById', data)
}


// 关联证候页面删除接口
export function delTcmAndSyndrome(data) {
  return del(url+'/patTcmSyndrome/deleteDiagSyndromeRelation', data)
}

