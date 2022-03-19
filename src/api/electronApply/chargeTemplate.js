import {
  post,
  get,
  put,
  del
} from '@/utils/request'

const url = '/common'
const urlA = '/outpatient';

export function getChargeTemplateList(data) {
  return get('/finance-pub/chargeTemplate/list-template-by-level-with-params', data)
}

export function getHistoryApplyList(data) {
  return get('/finance-pub/chargeTemplate/list-charge-apply-history', data)
}

// 检验查询
export function historyList(data) {
  return get(urlA+'/easApplyAssay/historyList', data)
}
// 检查查询
export function historyListExam(data) {
  return get(urlA+'/easApplyExam/historyList', data)
}
// 
export function getListByParamNotDelete(data) {
  return get(url+'/patDiag/getListByParamNotDelete', data)
}


export function saveTemplate(data) {
  return post('/finance-pub/chargeTemplate/save-charge-template', data, true)
}
export function outpatientCisTempinsert(data) {
  return post(urlA+'/outpatientCisTemp/insert', data, true)
}

export function getAilItems(data) {
  return get('/finance-pub/chargeTemplate/list-menu-all-by-params', data)
}

// 检查申请是否重复
export function checkRepeat(data) {
  return post(url+'/applyExam/check-repeat-add-apply', data)
}

// 提交编辑电子申请模板
export function saveChargeTem(data) {
  return post('/finance-pub/chargeTemplate/save-charge-template', data)
}

// 提交编辑电子申请模板
export function delChargeTem(data) {
  return post('/finance-pub/chargeTemplate/delete-charge-template/' + data)
}

// 检查检验 医保限制 提示
export function checkLimit(adviceItemId) {
  return get(urlA + `/easApplyAssay/checkLimit/${adviceItemId}`)
}
