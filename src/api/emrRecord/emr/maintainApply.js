import { post, get, patch } from '@/utils/requestEmr'

//getList
export function getByParamsInPage(data) {
  return get('/maintainApply/getbyParamsInPage', data, false)
}
export function apply(data) {
  return post('/maintainApply/apply', data, false)
}
export function approve(data) {
  return post('/maintainApply/check', data, false)
}
export function multiSendApply(data) {
  return post('/maintainApply/multiSendApply', data, false)
}
export function multiRecallApply(data) {
  return post('/maintainApply/multiRecallApply', data, false)
}
export function updateById(id, data) {
  return post('/maintainApply/' + id, data, false)
}
export function deleteById(id, data) {
  return patch('/maintainApply/' + id, data, false)
}

export function maintainApplyComp(mrMtAppId, loading = false) {
  return post(`/maintainApply/comp/${mrMtAppId}`, {}, loading)
}
