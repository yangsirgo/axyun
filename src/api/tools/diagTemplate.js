import {
  post,
  get,
  put,
  del
} from '@/utils/request'
const url = '/common';
export function getTempNameList(data) {
  return get(url+'/tempName/getTempTool', data)
}
export function getTempNameList1(data) {
  return get(url+'/tempName/getTempNameList', data)
}
export function getTempDoctorDiagByTempId(data) {
  return get(url+'/tempDoctorDiag/getTempDoctorDiagByTempId', data)
}
