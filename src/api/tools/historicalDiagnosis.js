import {post, get, put, del} from '@/utils/request'

const url = '/common'
export function test(data) {
  return get('/appointment/outpAppt/triageStatus/repeat', data, true)
}

export function getDiagList(data) {
  return get(url+'/patDiag/getListByParamNotDelete', data, false)
}
