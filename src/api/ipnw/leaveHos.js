import {
  get,
  post,
  put,
  del
} from '@/utils/request'

const url = "/ipnw";//url+
const urlA = '/resident';
const urlB = '/admin'

//获取患者出院 医生填写出院医嘱同步于护士出院医嘱
export function patientLeaveInfo(params){
  return get(`leaveHospital/getLeaveHospitalInfo`,params,false)
}

// 获取出院患者信息
export function getPatientInfo(inpCode) {
  return get(`/finance-inp/inp/patient/${inpCode}`, {}, false)
}
// 确认出院
export function confirmLeaveHos(data) {
  return post(url+`/bedInfo/out/ward/${data.inpCode}`, data, false)
}
// 出院预检
export function outPreCheck(data) {
  return post('/residentAdvice/leaveHospitalCheck', data, false)
}

// 根据科室获取病区
export function getWardByDept(data) {
  return get(urlB+'/wadmin/ward-dept', data, false)
}

// 结算清单 页面 费用明细接口
export function getTotalItemDetails(inpCode) {
  return get(`/finance-inp/inpChargeDetail/leaveHosTotalItemDetails/${inpCode}`, {}, false)
}

// 结算清单 页面 费用明细类型(key-value  类别-金额)
export function getItemDetailsKeys(params) {
  return get('/finance-inp/inpChargeDetail/getHosChargeByClass', params, false)
}

// 结算清单 页面 费用明细(收费明细项)
export function getchargeItemDetail(params) {
  return get('/finance-inp/inpChargeDetail/getInpChargeDetailVO', params, false)
}

// 结算清单 页面 费用明细(收费明细项) 带小计
export function getInpChargeDetailVOAndNum(params) {
  return get('/finance-inp/inpChargeDetail/getInpChargeDetailVOAndNum', params, false)
}

// 结算清单 页面 费用明细(收费明细项) 分类返回
export function getInpChargeDetailVOByClass(params) {
  return get('/finance-inp/inpChargeDetail/getInpChargeDetailVOByClass', params, false)
}

// 结算清单 页面 费用明细 分类金额汇总
export function getInpMoneyByFinClass(params) {
  return get('/finance-inp/inpChargeDetail/getInpMoneyByFinClass', params, false)
}

// 出院结算页面 预交金信息
export function getOverPay(data) {
  return get(`/finance-inp/inpPrepay/detail/${data.inpCode}`, data, false)
}

// 出院结算页面 费用清单
export function getItemDetails(data) {
  return get('/finance-inp/inpChargeDetail/itemDetails', data, false)
}

// 出院结算按钮
export function postCharge(data) {
  return post('/finance-inp/inpDischarge/discharge-reg', data, false)
}

// 出院结算预结算
export function getPreSettle(data) {
  return post('/finance-inp/inpDischarge/pre-settle', data, false, 130000)
}
// 医保出院结算预结算
export function getMecimPreSettle(data) {
  return post('/finance-inp/inpDischarge/discharge-reg', data, false)
}

// 出院召回
export function recallPatient(data) {
  return post(url + 'bedInfo/recallPatient', data, false)
}

// 注销家床
export function logoutIn(data) {
  return post('/finance-inp/inp/repeal-reg', data, false)
}

// 查询患者出院记录
export function getLeaveHosPatient(data) {
  return get('/finance-inp/inpDischarge/getLeaveHosPatient', data, false)
}

//查询该出院记录是否有打印发票
export function getInpPatientReceipt(data) {
  return get('/finance-inp/inpDischarge/getInpPatientReceipt', data, false)
}

//出院召回
export function backPatient(data) {
  return post('/finance-inp/inpDischarge/backPatient', data, false, 130000)
}

// 查询住院患者信息（根据状态 住院号等）
export function getInpPatientList(data) {
  return get('/finance-inp/inp/getInpPatient', data, false)
}

// 查询票据信息
export function validReceiptInfo(data) {
  return get(`/finance-inp/inp-receipt/valid-receipt-info/${data.finAdId}`, {}, false)
}
