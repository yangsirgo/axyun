import { post, get, put, del } from '@/utils/request'

const url = '/common'
const urlA = '/outpatient'

export function submitApply(data) {
  return post(url + '/applyExam/add-apply-by-chargeItem', data, true)
}

export function saveApply(data) {
  return post(urlA + '/easApplyAssay/saveApply', data, true)
}

export function saveApplyExam(data) {
  return post(urlA + '/easApplyExam/saveApply', data, true)
}

export function cancelApply(data) {
  return post(url + '/applyExam/backout-apply/' + data.type + '/' + data.ids, {}, true)
}

export function backoutApply(data) {
  return post(urlA + '/easApplyAssay/backoutApply', { ids: data.id }, true)
}

export function backoutApplyExam(data) {
  return post(urlA + '/easApplyExam/backoutApply', { ids: data.id }, true)
}

//打印检查检验申请单单条
export function applyPrint(data) {
  return get(urlA + '/easApplyExam/applyPrint', data)
}

//打印检查检验申请单单条批量
export function applyListPrint(data) {
  return get(urlA + '/easApplyExam/applyListPrint', data)
}

//打印治疗单
export function applyTreatListPrint(data) {
  return get(urlA + '/easApplyExam/applyTreatListPrint', data)
}