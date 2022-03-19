import {
  post,
  get,
  put,
  del
} from '@/utils/request';

const url = '/common'


// 获取左侧危急值列表
export function getTree(data) {
  return get(url+'/assayPublishCrisisvalue/getCrisisValueList', data, false);
}

// 获取历史处理
export function getCriDetail(data) {
  return get(url+'/medicalCrisisvalueHandle/handleDetail', data, false);
}

// 危急值处理
export function submitForm(data) {
  return post(url+'/medicalCrisisvalueHandle/dealCrisisvalue', data, true);
}

// 检验类型标记已读
export function assayHaveRead(data) {
  return put(url+'/assayPublishCrisisvalue/' + data.crisisvalueId, data);
}
// 检查类型标记已读
export function examHaveRead(data) {
  return put(url+'/examCrisisvalue/' + data.crisisvalueId, data);
}

// 获取主诊断  患者id，门诊号or住院号
export function getDiagName(data) {
  return get(url+'/patDiag/getListByParamNotDelete', data)
}
