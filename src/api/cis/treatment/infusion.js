import {
  post,
  get,
  put,
  del
} from '@/utils/request';

const url = '/common'
const urlA = '/outpatient'
const urlB = '/opnw'

// 查询左侧患者列表
export function getPatientList(data) {
  return get(url+'/applyExam/exec-apply-patient/', data)
}
// 根据患者id获取治疗信息列表
export function getApplyListUsing(data) {
  return get(url+'/applyExam/apply-list/' + data.patientId)
}

// 治疗申请单执行

export function examApply(data) {
  return get(url+'/applyExam/exec-apply/' + data)
}

// 输液执行-上面的表格
export function infusionList(data, needLoading = false) {
  return post(urlA+'/outpatientOrderQuery/infusionList', data, needLoading)
}


// 输液执行-下面的表格-查询执行记录
export function findExecList(data, needLoading = false) {
  return post(urlB+'/execRecord/findExecList', data, needLoading)
}

// 治疗执行-下面的表格-查询执行记录
export function nonFindExecList(data, needLoading = false) {
  return post(urlB+'/execRecord/nonFindExecList', data, needLoading)
}
// 输液执行- 下边表格-撤销
export function cancelExecRecordList(data, needLoading = false) {
  return post(urlB+'/execRecord/cancelExecRecordList', data, needLoading)
}


// 输液执行- 下边表格-执行
export function execConfirmation(data, needLoading = false) {
  return post(urlB+'/execRecord/execConfirmation', data, needLoading)
}

// 治疗执行- 下边表格-执行
export function nonExecConfirmation(data, needLoading = false) {
  return post(urlB+'/execRecord/nonExecConfirmation', data, needLoading)
}

// 输液执行- 拆分之前进行检查
export function checkDivisionOrders(data, needLoading = false) {
  return post(urlB+'/execRecord/checkDivisionOrders', data, needLoading)
}

// 输液执行- 拆分
export function divisionOrders(data, needLoading = false) {
  return post(urlB+'/execRecord/divisionOrders', data, needLoading)
}

// 治疗执行 - 拆分
export function nonDivisionOrders(data, needLoading = false) {
  return post(urlB+'/execRecord/nonDivisionOrders', data, needLoading)
}


// 输液执行- 病人输液历史列表
export function findHisStoryList(data, needLoading = false) {
  return post(urlB+'/execRecord/findHisStoryList', data, needLoading)
}

// 获取执行人的接口
export function findHisStoryDoctorList(data) {
  return post('/opnw/execRecord/findHisStoryDoctorList',data)
}
