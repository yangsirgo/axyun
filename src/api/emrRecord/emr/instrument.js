import { post, get, patch } from '@/utils/requestEmr'

export function getTree(data, loading = true) {
  return get('/main/getTree', data, loading)
}
export function getTempalteTree(data) {
  return get('/main/getTempalteTree', data)
}

export function contentQuery(data, loading = true) {
  return get('/mr/contentQuery', data, loading)
}

export function save(data, loading = true) {
  return post('/main/save', data, loading)
}

export function modifyContent(data) {
  return post('/mr/modifyContent', data, true)
}

export function removeMr(data) {
  return patch('/mr/remove', data, true)
}
// 检查当前用户是否 是维护申请人
export function chkAppPerson(mrId) {
  return get(`/maintainApply/chkAppPerson/${mrId}`, {}, false)
}

export function attributeQuery(data) {
  return get('/mr/attributeQuery', data, true)
}

export function modifyAttribute(data) {
  return post('/mr/modifyAttribute', data, true)
}

export function modifyAttribute_id(data) {
  return post(`/mr/${data.mrId}/`, data, true)
}


export function cancelSubmit(data) {
  return post('/mr/cancel-submit', data, true)
}

export function contentQueryByCondition(data) {
  return get('/mr/contentQueryByCondition', data)
}

export function getMrHomePage(data) {
  return get('/mr/getMrHomePage', data)
}

export function byPatientList(data) {
  return get('/mr/by-patient-list', data)
}

export function checkCancelStatus(data) {
  return get('/mr/checkCancelStatus', data)
}

export function checkMrCreatedBy(data) {
  return get('/mr/checkMrCreatedBy/' + data.mrId + '/' + data.createdBy, {}, false)
}

export function byIdList(data) {
  return get('/mr/by-id-list', data)
}

export function checkMrReplaceable(data) {
  return get('/main/checkMrReplaceable', data, true)
}

// 检查就诊号在某个时间段内是否已书写某类文书接口
export function chkHadWrite(data) {
  return get('/mr/chk-had-write', data, true)
}

// 更新维护申请接口
export function saveOrUpdate(data) {
  return post('/maintainApply/save-or-update', data)
}

// 更新打印后的数据
export function updatePrintNo(data) {
  return patch('/mr/print-no', data, false)
}

export function getLastFollowUpDate(data) {
  return get('/en/getLastFollowUpDate/' + data, data, false)
}


export function saveHighBloodPressureContent(data) {
  return post('/syn/saveHighBloodPressureContent', data, true)
}

export function feritinFrom(data) {
  return post('/mr/feritinFrom', data, true)
}

