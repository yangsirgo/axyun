import {
  post,
  get,
  put,
  del
} from '@/utils/request'

const url = '/patient'
// 概要信息 start
// /ehr/selectOrderItemDrugTypeCount  医嘱药方每种药品数量
export function selectOrderItemDrugTypeCount(params) {
  return post(url+"/ehr/selectOrderItemDrugTypeCount", params, true);
}
// /ehr/selectOrderItemDrugTypeDetail    医嘱药方每类药品详情
export function selectOrderItemDrugTypeDetail(params) {
  return post(url+"/ehr/selectOrderItemDrugTypeDetail", params, true);
}
// 获取概要信息/ehr/getPatientInformation
export function getPatientInformation(params) {
  return post(url+"/ehr/getPatientInformation", params, true);
}
// 概要信息里面的检验报告的左边的部分接口 /ehr/selectEasApplyAssay
export function selectEasApplyAssay(params) {
  return post(url+"/ehr/selectPatientInspectReport", params, true);
}
// 概要信息里面的检验报告的右边的部分接口 /ehr/selectEasApplyAssayDetail
export function selectEasApplyAssayDetail(params) {
  return post(url+"/ehr/selectPatientInspectReportDetail", params, true);
}
// 概要信息里面的检查报告的左边的部分接口 /ehr/selectEasApplyExam
export function selectEasApplyExam(params) {
  return post(url+"/ehr/selectPatientCheckReport", params, true);
}
// 概要信息里面的检查报告的右边的部分接口 /ehr/selectEasApplyExamDetail
export function selectEasApplyExamDetail(params) {
  return post(url+"/ehr/selectPatientCheckReportDetail", params, true);
}
// 疾病接口/ehr/selectPatientDisease
export function selectPatientDisease(params) {
  return post(url+"/ehr/selectPatientDisease", params, true);
}



// 概要信息 end

// 历次就诊 start
// 检查
export function selectFinInp(params) {
  return post("/ehr/selectDiagByVo", params, true);
}
export function selectAdviceByHospitalNo(params) {
  return post("/ehr/selectAdviceByHospitalNo", params, true);
}
// 历次就诊 end


//健康主题 start

// ehr/selectMedication  用药情况
export function selectMedication(params) {
  return post("/ehr/selectMedication", params, true);
}

//健康主题 end

//门诊预存
// export function prestore(params) {
//   return post("/finance-outp/prestoreDetail/prestore", params);
// }
