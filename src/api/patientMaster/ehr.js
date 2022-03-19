import {
  get,
  post,
  put,
  del
} from '@/utils/request'

const url = '/common';
const urlA = '/outpatient';

export function getDiaByParam(query) { // 查询诊断信息
  return get(url+'/patDiag/getDiaByParam', query)
}

export function getAllergyPatientInfo(query) { // 查询过敏记录
  return post(url+'/allergyPatientInfo/page', query)
}

export function getMryPatient0(query) { // 查询就诊记录
  return get('/mr/by-patient/', query, )
}
export function getMryPatient(query) { // 查询就诊记录
  return get(urlA+'/outpatientList/visitHistoryList', query, )
}
export function getDistinctEffectiveRecord(data) {
  return get(url+'allergyPatientInfo/getDistinctEffectiveRecord', data);
}

export function getHistoryHospitalized(query) {
  return get('/patient/history/', query, ) 
}
