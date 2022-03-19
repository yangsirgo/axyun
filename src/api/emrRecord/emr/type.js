import { post, get, patch } from '@/utils/requestEmr'

export function getTypes(data) {
  return get('/type/getTypeSelectByCondition', data, true)
}

export function getTypeList(data) {
  return get('/type/list', data)
}
export function getTypeListPage(data) {
  return get('/type/type-page', data)
}
export function createType(data) {
  return post('/type/default', data, true)
}

export function getTypeInfoById(data) {
  return get('/type/' + data.id, {}, true)
}

export function modifyTypeInfoById(data) {
  return post('/type/' + data.typeId, data, true)
}

export function deleteTypeById(data) {
  return patch('/type/' + data.id, {}, true)
}

export function deleteForBatch(data) {
  return patch('/type/batchTypePOList', data)

}

export function getTypeByCode(data) {
  return get('/type/by-code', data, true)
}

export function getTypeNextSeqNo(data) {
  return get('/type/seq_no', data, true)
}

export function getNextTypeNum(data) {
  return get('/type/next-num', data, true)
}
