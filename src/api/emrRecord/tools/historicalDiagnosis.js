import { post, get } from '@/utils/requestEmr'

export function test(data) {
  return get('/outpAppt/triageStatus/repeat', data, true)
}

// 电子病历 检查报告列表接口
export function getDiagList(paId, enTpCd, data) {
  return get(`/viEn/getHistoryDiag/${paId}/${enTpCd}`, data, false)
}

// 历史就诊
export function getHistoryVisit(paId, enTpCd, data) {
  return get(`/en/getHistoryVisit/${paId}/${enTpCd}`, data, false)
}
// 历史就诊 兼容家床
export function getHistoryVisitViEn(paId, data) {
  return post(`/viEn/getHistoryVisit/${paId}`, data, false)
}

// 主诊断 使用
export function codeShow(icd10Encoding) {
  return get(`/icd10Dictionary/getIcd10Dictionary/${icd10Encoding}`, false)
}


// 查询病例树
export function getTree(data) {
  return get(`/main/getTree`, data, false)
}

// 查询既往诊断
export function getHistoryDiagPageList(data) {
  return get('/diag/diag-page', data, false)
}



// 查询既往诊断 不带分页查询
export function getHistoryDiagList(data) {
  return get('/diag/diag-list', data, false)
}
