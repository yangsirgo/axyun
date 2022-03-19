import {
  post,
  get,
  patch
} from '@/utils/requestEmr'

//查询历史诊断，根据患者id
export function getHistoryDiagList(data, loading = false) {
  return get('/patDiag/getListByParamNotDelete', data, loading)
}

//查询本次诊断，根据门诊或住院id
export function getCurrentDiagList(data) {
  return get('/patDiag/getListByParamNotDelete', data)
}

//新增诊断
// export function addDiag(data) {
//   return post('/patDiag/', data, true)
// }

export function addDiag(data) {
  return post('/patDiag/addDiagMes', data, true)
}

//修改诊断
// export function updateDiag(data) {
//   return post('/patDiag/' + data.id, data, true)
// }

export function updateDiag(data) {
  return post('/patDiag/updateDiagMes', data)
}


//批量删除
export function deleteDiag(data) {
  return patch('/patDiag/deleteDiag', data, true)
}

//删除
export function deleteOneDiag(id) {
  return patch('/patDiag/' + id)
}

export function getDiaByPatientCode(data) {
  return get('/patDiag/getDiaByPatientCode', data, false)
}

// 另存为-模板

export function saveTemplate(data) {
  return post('/tempName/addTemp', data, true)
}

export function getDiaByClinicType(data) {
  return get('/patDiag/getDiaByClinicType', data)
}

// 复制

export function listCopy(data) {
  return post('/patDiag/copyDiaList', data)
}

export function getDiagNameList() {
  return get('/patDiag/getIcd10Dictionary');
}

// 设置主诊断
export function setDiagMian(data) {
  return post('/patDiag/setDiagDiag', data);
}

//是否添加报卡
export function getCardByICD(data) {
  return get('/uploadcard/getCardByICD', data);
}



export function checkDiagStatus(paId, enId) {
  return get(`/en/check-status/${paId}/${enId}`, {}, false);
}


// 保存诊断关系：
export function saveDiagRelation(data, loading = false) {
  return post('/diagMaintainRelation/save-relation', data, loading);
}

// 查询诊断关系接口：，GET接口
export function getDelDiagList(enId, enTpCd, isHome, mrId, loading = false) {
  return get(`/diagMaintainRelation/del-diag/${enId}/${enTpCd}/${isHome}/${mrId}`, {}, loading);
}

// 删除诊断关系或文书：
export function deleteDiagRelation(data, loading) {
  return patch('/diagMaintainRelation/del-relation', data, loading)
}
