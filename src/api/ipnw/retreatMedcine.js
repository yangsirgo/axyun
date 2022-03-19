import {
  get,
  post,
  put,
  del
} from '@/utils/request'

// 获取退药申请患者信息
export function getApplyPatientList(query) {
  return get('/applyDrugBack/getApplyPatientList', query)
}

// 根据住院号查明细
export function getApplyDrugBackList(query) {
  return get('/applyDrugBack/getApplyDrugBackList', query)
}

// 提交退药申请
export function addApplyDrugBack(query) {
  return post('/applyDrugBack/addApplyDrugBack', query)
}

// 撤销退药申请
export function cancelApplyDrugBack(query) {
  return post('/applyDrugBack/cancelApplyDrugBack', query)
}
