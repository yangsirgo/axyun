import {
  post,
  get,
  put,
  del
} from '@/utils/request'
const url = '/common'
//获取预约信息
export function getCostInfo(params) {
  return get("/finance-outp/outpChargeDetail/getChargeListByVisitCode", params);
}
//门诊预结算
export function preSettlement(params) {
  return post("/finance-outp/outpSettlement/preSettlement", params);
}
//门诊结算
export function settlement(params) {
  return post("/finance-outp/outpSettlement/settlement", params);
}

// 按照收费日期查询住院患者每日清单
export function dailyDetails(params) {
  return get("/finance-inp/inpChargeDetail/dailyDetails", params);
}

// 按照收费项目类别查询住院患者每日清单
export function itemDetails(params) {
  return get("/finance-inp/inpChargeDetail/itemDetails", params);
}

//按照收费项目类别返回患者住院总费用清单
export function totalItemDetails(params) {
  return get("/finance-inp/inpChargeDetail/totalItemDetails/" + params);
}

//查询诊疗流程状态
export function getVisitLog(params) {
  return get(url+"/visiting/readLog", params);
}

// 护理-费用管理-欠费查询
export function getInpPatient(params) {
  return get("/finance-inp/inp/getInpPatient", params);
}
