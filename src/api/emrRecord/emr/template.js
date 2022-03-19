import { post, get, patch } from '@/utils/requestEmr'

export function getUsableList(data, loading = false) {
  return get('/template/usable-page', data, loading)
}

export function getTree(data) {
  return get('/template/manage-tree-param', data, true)
}

export function save(data) {
  return post('/template/default', data, true)
}

export function saveAs(data) {
  return post('/template/saveAs', data, true)
}

export function update(data) {
  return post('/template/default/' + data.templateId, data, true)
}

export function getByParams(data, loading = false) {
  return get('/template/hos-page', data, loading)
}

export function getDeptDoctor(id, isLoading = false) {
  return get(`/wadmin/dept-doctor/${id}`, {}, isLoading)
}

export function removeTemplate(data) {
  return patch('/template/batch', data, true)
}

export function getNextSeq(data) {
  return get('/template/seq_no', data, true)
}


export function setEnable(data) {
  return post('/template/enable/batch', data, true)
}

export function setDisable(data) {
  return post('/template/disable/batch', data, true)
}

export function getDetail(id, data) {
  return get('/template/' + id, data, true)
}

export function getContent(id, data) {
  return get('/template/content/' + id, data, true)
}

export function getByCode(code, data) {
  return get('/template/code/' + code, data, true)
}

export function saveContent(data) {
  return post('/template/content', data, true)
}

export function getDiagnosisMes(data) {
  return get('/patDiag/getDiagnosisMes', data, true)
}

export function getTypeGroupSelectByCondition(data) {
  return get('/typeGroup/getTypeGroupSelectByCondition', data, true)
}

export function getTypeSelectByCondition(data) {
  return get('/type/getTypeSelectByCondition', data, true)
}

export function copyTemplates(data) {
  return post('/template/copy', data, true)
}

export function upVersion(data) {
  return post('/template/up-version/' + data.flag, data, true)
}

export function checkUpVersion(data) {
  return get('/template/check-version', data, true)
}

// 入参 enNo
export function getDefaultTemp(data, loading = false) {
  return get('/template/default-template', data, loading)
}

// 获取通用模板  不需要患者相关数据的
/**
 *
 * @param {visitType} data
 * @param {dnFlag} loading
 */
export function getDefaultTempNOPatient(data, loading = false) {
  return get('/template/default-no-en', data, loading)
}

export function postChkAuth(data, loading = false) {
  return post('/template/chk-auth', data, loading)
}

// 校验 相关权限
export function dicOprAuth(data, loading = false) {
  return post('/common/dic-opr-auth', data, loading)
}
