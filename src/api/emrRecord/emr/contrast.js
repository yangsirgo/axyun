
import { post, get } from '@/utils/requestEmr'

//分页查询数据元
export function getDataElePageByCondition(data) {
  return get('/contrast/getPageByCondition', data)
}

export function getDataElementValueSingleLst(data) {
  return get('/contrast/getDataElementValueSingleLst/' + data.id, data)
}

export function getDataElementValueMutiLst(data) {
  return get('/contrast/getDataElementValueMutiLst/' + data.id, data)
}
