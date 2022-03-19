import {
  post,
  get,
  put,
  del
} from '@/utils/request'
const urlA = '/outpatient';
const url = '/resident';
export function getHistoryByPatient(data) {
  return get(urlA+'/outpatientOrder/getHistoryByPatient', data)
}

export function getBhHistoryByPatient(data) {
  return get(url+'residentAdvice/getHistoryByPatient', data)
}
