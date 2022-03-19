import {post, get, put, del} from '@/utils/request'

const url = '/common'

//获取预约信息
export function getScheduleInfo(params) {
  return get("/appointment/outpAppt/list/schedule", params);
}
//获取就诊信息
export function getMedicalInfo(params) {
  return get("/appointment/outpAppt/list/schedule", params);
}
//获取医技信息
export function getMedicalTechInfo(params) {
  return get(url+"/applyExam/list-medical-tech/"+params,{});
}
//获取缴费信息
export function getPaymentInfo(params) {
  return get("/finance-outp/outpChargeDetail/getChargeListByVisitCode", params);
}
//获取发药信息
export function getRecipeInfo(params) {
  return get("/hmm-stock/recipe/params", params);
}

//获取医技审核流程记录
export function getApplyAuditRecordsByApplyId(params) {
  return get(url+"/applyAuditRecords/list-audit-records-by-applyId/"+params,{});
}

