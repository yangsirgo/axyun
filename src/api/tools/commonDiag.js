import {
  post,
  get,
  put,
  del
} from '@/utils/request'

const url = '/common'

export function getCountCommonUseDiag(data) {
  return get(url+'/patDiag/getCountCommonUseDiag', data)
}
export function getCommonUseDiag(data) {
  return get(url+'/patDiag/getCommonUseDiag', data)
}
