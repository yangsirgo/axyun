import { post, get, patch } from '@/utils/requestEmr'

export function getTypeTree(data) {
  return get('/cnfparams/tree', data, true)
}

export function addTypeTree(data) {
  return post('/cnfparams', data, true)
}

export function putTypeTree(data) {
  return post(`/cnfparams/upd/${data.id}`, data, true)
}

export function deleteTypeTree(data) {
  return patch(`/cnfparams/delparamssub/${data.id}`, {}, true)
}

export function getCnfanTypeTree(id) {
  return get(`/cnfparams/cnf-type-tree/${id}`, {}, true)
}

export function getCnfTypeL1s(data) {
  return get('/cnfparams/getcnftypel1s', data, true)
}
export function getParamsTree(data) {
  return get(`/cnfparams/tree/${data.id}`, {}, true)
}

export function getCnfId(data) {
  return get(`/cnfparams/tree/${data.id}`, {}, true)
}

export function getTypeTreeId(data) {
  return get(`/cnfparams/${data.id}/has/child`, {}, true)
}

export function getCnfTypes(data) {
  return get('/cnfparams/getcnftypes', data, true)
}

export function putParent(data) {
  return post(`/cnfparams/upd-parent/`, data, true)
}

//#### cnfFieldDefine #####//

export function getCnfanTypeTable(data) {
  return get(`/cnfFieldDefine/defines/${data.type}`, {}, true)
}

export function addCnfanType(data) {
  return post('/cnfFieldDefine', data, true)
}

export function putCnfanType(data) {
  return post(`/cnfFieldDefine/${data.id}`, data, true)
}

export function deleteCnfanType(data) {
  return patch('/cnfFieldDefine/batch', data, true)
}

export function getColumns(data) {
  return get(`/cnfFieldValue/columns/${data.id}`, {}, true)
}

export function getDatas(data) {
  return get(`/cnfFieldValue/datas`, data, true)
}

//#### cnf #####//

export function addCnf(data) {
  return post('/cnf/add-cnf', data, true)
}

export function getCnfTree(pid, id) {
  let treeid = id || -1
  return get(`/cnf/cnf-tree/${pid}/${treeid}`, {}, true)
}
export function getCnfMultiTree(pid, id) {
  let treeid = id || -1
  return get(`/cnf/cnf-tree/multi/${pid}/${treeid}`, {}, true)
}

export function deleteCnfTree(id) {
  return patch(`/cnf/delcnfsub/${id}`, true)
}

export function getCnfItem(data) {
  return get('/cnf/cnf-data', data, true)
}

export function putCnfItem(data) {
  return post('/cnf/upd-cnf', data, true)
}

export function getCnfTreeSingle(pid) {
  return get(`/cnf/cnf-tree/single/${pid}`, {}, true)
}

//#### cnfFieldValue #####//

export function delRowVal(bid) {
  return patch(`/cnfFieldValue/del-rowval/${bid}`, {}, true)
}

export function getArrayList(data) {
  return post(`/wdata/dic/singles`, data, true)
}

export function searchType(data) {
  return get(`/cnfFieldValue/cnftype/${data.id}`, {}, true)
}
