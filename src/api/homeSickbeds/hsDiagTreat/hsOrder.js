import {
  get,
  post,
  put,
  del
} from '@/utils/request'

//获取处方药品
export function getAdviceItem(data) {
  return get("/advice/adviceItem/search/" + data.pageNo + "/" + data.pageSize , data)
}

// 暂存 医嘱
export function temporary(data) {
  return post("/advice/advice/create", data)
}

// 暂存 医嘱
export function temporaryAll(data) {
  return post("/advice/advice/batchSave", data)
}

//提交医嘱
export function westAdviceSubmit(data) {
  return post("/advice/advice/submitByType/" + data.treatNo + "?type=" + data.type, data);
}

//查询暂存列表
export function westAdviceGetAdvice(data) {
  return get("/advice/advice/tempPage/" + data.pageNo + "/" + data.pageSize, data)
}

//查询提交后的暂存列表
export function westAdviceGetAfterAdvice(data) {
  return get("/advice/advice/effectPage/" + data.pageNo + "/" + data.pageSize, data)
}

//删除暂存列表
export function westAdviceDelete(data) {
  return post("/advice/advice/removeAll", data)
}



//成组
export function westAdviceBunching(data) {
  return post("/advice/advice/makeGroup", data)
}

//取消成组
export function westAdviceUnbunching(data) {
  return post("/advice/advice/cancelGroups", data)
}

//停止医嘱
export function stopAdvice(data) {
  return post("/advice/advice/stop", data)
}

//停止医嘱
export function invalidAdvice(data) {
  return post("/advice/advice/invalid", data);
}

//复制医嘱
export function copyToAdvice(data) {
  return post("/advice/advice/copyTo/" + data.treatId + "?type=" + data.type + "&pharmacyId=" + data.pharmacyId, data.list);
}


//选择医嘱权限校验
export function authorityVerif(data) {
  return get("/advice/advice/select/" + data.treatId + "?type=" + data.type + "&itemId=" + data.itemId + "&pharmacyId=" + data.pharmacyId);
}

//获取药房
export function getPharmacyList(data) {
  return get("/hmm-stock/pharmacy/forPage", data);
}

//获取诊断
export function getDiaByPatientCode(data) {
  return get("/common/patDiag/getDiaByPatientCode", data);
}