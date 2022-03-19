import { get, post } from '@/utils/requestEmr'

// 获取出院患者信息
export function getPatientInfo(inpCode) {
  return get(`/inp/patient/${inpCode}`, {}, false)
}
// 确认出院
export function confirmLeaveHos(data) {
  return post(`/inp/out/ward/${data.inpCode}`, data, false)
}
// 出院预检
export function outPreCheck(data) {
  return post('/residentAdvice/leaveHospital', data, false)
}


// 结算清单 页面 费用明细接口
export function getTotalItemDetails(inpCode) {
  return get(`/inpChargeDetail/leaveHosTotalItemDetails/${inpCode}`, {}, false)
}

// 结算清单 页面 费用明细类型
export function getItemDetailsKeys() {
  return get('/cnfFieldValue/datas', { id: 4095, pageSize: 200, page: 1 }, false)
}

// 出院结算页面 预交金信息
export function getOverPay(data) {
  return get(`inpPrepay/detail/${data.inpCode}`, data, false)
}

// 出院结算页面 费用清单
export function getItemDetails(data) {
  return get('/inpChargeDetail/itemDetails', data, false)
}

// 出院结算按钮
export function postCharge(data) {
  return post('inpDischarge/discharge-reg', data, false)
}
