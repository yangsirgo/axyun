import {
  post,
  get,
  put,
  del
} from '@/utils/request'

const url = '/common';
const urlA = '/outpatient';
const urlB = '/opnw'
const urlC = '/patient'


/*import {
  get2
} from '@/utils/request2'*/


// 接诊接口
export function receiveVisitRecord(query, loading = false) {
  return post(urlA + '/visitRecord/receive', query, loading)
}

//获取患者列表
export function getPatients(data, needLoading) {
  return get(urlA + '/outpatientList/list', data, needLoading)
}
//获取患者列表
export function getCisNewPatients(data, needLoading) {
  return get('/appointment/outpAppt/getApptQueueByWait', data, needLoading)
}
//获取皮试患者右侧上部列表
export function skinTestList(data, needLoading) {
  return get(urlA + '/outpatientOrderQuery/skinTestList', data, needLoading)
}
//获取皮试中患者右侧上部列表
export function skiningTestList(data, needLoading) {
  return get(urlA + '/outpatientOrderQuery/skiningTestList', data, needLoading)
}
//开始皮试执行
export function saveRecord(data, needLoading) {
  return post(urlB + '/execResult/saveRecord', data, needLoading)
}
//获取-门诊医生-治疗-（0-输液  1-肌注  3-治疗）患者列表
export function findPatientListExecutoryContractByExecType(data, needLoading) {
  return get(urlA + '/outpatientOrderQuery/findPatientListExecutoryContractByExecType', data, needLoading)
}

//获取-门诊医生-治疗-（0-输液  1-肌注  3-治疗）历史患者列表
export function findPatientListExecutoryContractHisStory(data, needLoading) {
  return get(urlA + '/outpatientOrderQuery/findPatientListExecutoryContractHisStoryByExecType', data, needLoading)
}

//获取-门诊医生-皮试中-患者列表
export function findPatientTimeListExecutoryContractByExecType(data, needLoading) {
  return get(urlA + '/outpatientOrderQuery/findPatientTimeListExecutoryContractByExecType', data, needLoading)
}

//获取-门诊医生-皮试中
export function findPatientRightListExecutoryContractByExecType(data, needLoading) {
  return get(urlA + '/outpatientOrderQuery/findPatientRightListExecutoryContractByExecType', data, needLoading)
}

//获取-护士执行模块-病人列表
export function newFindPatientListExecutoryContractByExecType(data, needLoading) {
  return get(urlA + '/outpatientOrderQuery/newFindPatientListExecutoryContractByExecType', data, needLoading)
}

//获取-护士执行模块-病人列表
export function execResultRecall(data, needLoading) {
  return put(urlB + '/execResult/recall', data, needLoading)
}

//作废皮试记录
export function execResultCancel(data, needLoading) {
  return put(urlB + '/execResult/cancel/' + data.recorderId + '/' + data.resultId + '/' + data.orderId + '/' + data.patientId)
}
//未完成数量
export function outpatientTypeCount(data, needLoading) {
  return get(urlA + '/outpatientOrderQuery/outpatientTypeCount', data, needLoading)
}

//未完成数量
export function findHisStoryCount(data, needLoading) {
  return get(urlB + '/execRecord/findHisStoryCount', data, needLoading)
}

//保存皮试结果
export function execResultSave(data, needLoading) {
  return post(urlB + '/execResult/save', data, needLoading)
}

//获取患者列表2
export function getPatients2(data, needLoading) {
  return get(url + '/applyReferral/getPatients', data, needLoading)
}

// 获取预约患者列表
export function getOrderPatients(data, needLoading) {
  return get('/appointment/outpAppt/list/schedule', data, needLoading)
}
//接诊
export function receive(data) {
  return put('/appointment/outpAppt/receive', data, true)
}
//获取过敏信息
export function findAllergy(data) {
  return get(urlA + '/outpatientSign/findAllergy', data, false)
}
//初诊
export function first(data) {
  return put('/appointment/outpAppt/triageStatus/first', data, true)
}

//复诊
export function repeat(data) {
  return put('/appointment/outpAppt/triageStatus/repeat', data, true)
}

// 获取转诊患者信息
export function getByPatientId(data) {
  return get(url + '/applyReferral/getByPatientId', data, true)
}

// 新增转诊申请
export function applyReferral(data, needLoading = false) {
  return post(url + 'applyReferral/add', data, needLoading)
}
// 撤销转诊申请 转诊
export function applyReferralCancel(data, loading = false) {
  return get(url + '/applyReferral/cancel', data, loading)
}


//根据检索字段查询患者编号
export default {
  async selectPatientBySth(params) {
    const {
      data
    } = await get(urlC + '/archInfo/list-patientnum-by-params', params, false);
    return data || {};
  }
}

//根据检索字段查询患者编号 新版
export function newSelectPatientBySth(params) {
  return get('/archInfo/list-patientnum-by-params', params, false);
}

//根据预约分诊id获取po
export function findByTriageAppointmentId(data) {
  return get('/appointment/outpAppt/findByTriageAppointmentId', data, true)
}

//获取"今日挂号/今日就诊"
export function getAppointmentAndDiagNum(data) {
  return get('/appointment/outpAppt/appointmentAndDiagNum', data, true)
}

//获取病历
export function getInquiryRecord(visitCode) {
  return get(urlA + '/outpatientCisInquiryRecord/selectOneByVisitCode/' + visitCode, true)
}


//保存病历
export function saveInquiryRecord(data) {
  return post(urlA + '/outpatientCisInquiryRecord/saveOrUpdate', data, true)
}


//用于病假单获取主诊断
export function getDiaByClinicType(data) {
  return get(url + '/patDiag/getDiaByClinicType', data)
}

//完成就诊
export function finish(data) {
  return put('/appointment/outpAppt/finishClinic', data, true)
}

//获取患者列表
export function cardReading(data, needLoading) {
  return get('/outpatient/outpatientList/cardReading', data, needLoading)
}

// 获取病历状态
export function checkMrSubmitStatus(data) {
  // return get2('/mr/checkMrSubmitStatus', data, false)
  // return get('/mr/checkMrSubmitStatus', data, false)
  // let res = {
  //   data :{}
  // }
  // return res
}

// 转诊页面读卡
export function applyReferralCard(data) {
  return get(url + '/applyReferral/getPatientsByCarding', data, false)
}

// 打印皮试接口
export function getPrintData(data) {
  return post(urlA + '/outpatientOrderQuery/printDataNoPay', data, false)
}

// 打印瓶贴接口
export function printButtoData(data) {
  return post(urlA + '/outpatientOrderQuery/printButtoData', data, false)
}


// 患者暂挂
export function suspendAjax(visitId) {
  return post(urlA + `/visitRecord/suspend/${visitId}`, false);
}

// 患者结束就诊
export function stopVisitAjax(visitId) {
  return post(urlA + `/visitRecord/stopVisit/${visitId}`, false);
}


// 取消患者暂挂
export function cancelSuspendAjax(visitId) {
  return post(urlA + `/visitRecord/cancelSuspend/${visitId}`, false);
}

// 清空患者 就诊记录
export function resetPatVisitAjax(visitId) {
  return get(urlA + `/visitRecord/reset/${visitId}`, false);
}
