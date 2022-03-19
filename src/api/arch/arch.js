import {post, get, put, del} from '@/utils/request'
const url = '/common';
const urlA = '/outpatient';
const urlB = '/patient'
//获取档案列表
export function getArchList(params) {
  return get(urlB+"/archInfo/patientList", params);
}

export function getArchListNew(params) {
  return get(urlB+"/archInfo/outAppt/patientList", params);
}

//门诊预存
export function prestore(params) {
  return post("/finance-outp/prestoreDetail/prestore", params);
}

//门诊预存--祥森
export function prestore_or_refund(params) {
  return post("/finance-outp/prestoreDetail/prestore-or-refund", params);
}

//门诊预存退款
export function fefund(params) {
  return post("/finance-outp/prestoreDetail/fefund", params);
}

//获取账户信息
export function getAccountInfo(params) {
  return get("/finance-outp/prestoreAccount/account/" + params);
}

//获取账户充退列表(旧)
export function getPrestoreRefundListOld(params) {
  return get("/finance-outp/prestoreDetail/page", params);
}

//获取账户充退列表
export function getPrestoreRefundList(params) {
  return get("/finance-outp/prestoreDetail/getPrestore", params);
}

//冻结账户
export function freeze(params) {
  return put("/finance-outp/prestoreAccount/update", params);
}

// //获取消费记录列表  (废弃)
// export function prestoreConsume(params) {
//   return get("/prestoreConsumeDetail/page", params);
// }

//获取消费明细
export function prestoreDetail(params) {
  return get("/finance-outp/prestoreConsumeDetail/getPrestoreConsumeDetail", params);
}

//根据患者编号获取卡片列表
export function getArchCardListByPatientNum(params) {
  return get(urlB+"/archCard/params", params);
}

//新增
export function addArchCard(params) {
  return post(urlB+"/archCard", params);
}

//解绑
export function delArchCard(params) {
  return del(urlB+"/archCard/" + params);
}


export function addArchive(data) {
  return post('/archive', data, true);
}

export function getArchive(id) {
  return get(urlB+'/archive/' + id, {}, true);
}

export function updateArchive(data) {
  return put(urlB+'/archive', data, true);
}


export function getArchInfoByCardNum(data) {
  return get(urlB+"/archInfo/list-patient-by-cardnum", data)
}

//读卡
export function swipe(data) {
  return get(urlB+"/archInfo/swipe", data)
}

export function patientSilimarList(data) {
  return get(urlB+"/archInfo/similarity", data)

}

export function getApptByVisitCode(data) {
  return get("/appointment/outpAppt/getApptByVisitCode", data)
}

export function merger(data) {
  return post(urlB+"/archRelation/arch-merger", data, true)
}

export function verification(data) {
  return post(urlB+"/archInfo/verification", data)
}

export function getMedicalRecord(data) {
  return get(urlA+'/outpatientList/visitHistoryList', data);
}

export function getAgeByBirthDate(data) {
  return get(urlB+'/archInfo/get-age-by-birthDate', data);
}

//获取手机号验证码
export function sendMsg(data) {
  return post(urlB+'/archMsg/sendMsg/' + data.patientCode + '/' + data.phoneNum);
}

//获取历史就诊记录
export function archInfoHistory(data) {
  return get(urlB+'/archInfo/outAppt/history', data);
}

//工具箱-患者诊疗信息
export function patDiagAuxiliaryInf(data) {
  return get(url+'patDiagAuxiliaryInformation/get-patDiagAuxiliaryInf/' + data.visitCode + '/' + data.patientType);
}

//获取账户类型
export function getPrestoreCodeAll(data) {
  return get('/finance-outp/prestoreCode/all', data,false)
}