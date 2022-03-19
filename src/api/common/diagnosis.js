import {
  post,
  get,
  put,
  del
} from '@/utils/request'
const url = "/common";
//查询历史诊断，根据患者id
export function getHistoryDiagList(data) {
  return get(url + '/patDiag/getListByParamNotDelete', data)
}

//查询本次诊断，根据门诊或住院id
export function getCurrentDiagList(data) {
  return get(url + '/patDiag/getListByParamNotDelete', data)
}

//新增诊断
// export function addDiag(data) {
//   return post('/patDiag/', data, true)
// }

export function addDiag(data) {
  return post(url + '/patDiag/addDiagMes', data, true)
}

// 批量添加诊断  入参是数组
export function addDiags(data) {
  return post(url + '/patDiag/addDiags', data, true)
}

//修改诊断
// export function updateDiag(data) {
//   return put('/patDiag/' + data.id, data, true)
// }

export function updateDiag(data) {
  return put(url + '/patDiag/updateDiagMes', data)
}


//批量删除
export function deleteDiag(data) {
  return del(url + '/patDiag/deleteDiag', data, true)
}

//删除
export function deleteOneDiag(id) {
  return del(url + '/patDiag/' + id)
}

export function getDiaByPatientCode(data) {
  return get(url + '/patDiag/getDiaByPatientCode', data, false)
}

// 另存为-模板

export function saveTemplate(data) {
  return post(url + '/tempName/addTemp', data, true)
}

export function getDiaByClinicType(data) {
  return get(url + '/patDiag/getDiaByClinicType', data)
}

// 复制

export function listCopy(data) {
  return post(url + '/patDiag/copyDiaList', data)
}

export function getDiagNameList() {
  return get(url + '/patDiag/getIcd10Dictionary');
}

// 设置主诊断
export function setDiagMian(data) {
  return put(url + '/patDiag/setDiagDiag', data);
}

//是否添加报卡
export function getCardByICD(data) {
  return get(url + '/reportCard/getCardByICD', data);
  // return get('aa/bb', data);
}

//是否添加报卡
export function getCardByICDNew(data) {
  return get(url + '/patTcmDiag/getDiagNameCode', data);
}

//获取某诊断的诊疗信息
export function getPatDiagByIcd10(data) {
  return get(url + '/patDiagAuxiliaryInformation/get-patDiag-by-icd10/' + data.diagCode);
}

//获取诊断类型列表
export function getDiaTypeList() {
  return get('/wdata/dic/single/DiseaseDiagnosisCategoryCodeType');
}



