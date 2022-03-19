import { get } from '@/utils/requestEmr'

export function getHistoryByPatient(data) {
  return get('/outpatientOrder/getHistoryByPatient', data)
}

export function getBhHistoryByPatient(data) {
  return get('/residentAdvice/getHistoryByPatient', data)
}
