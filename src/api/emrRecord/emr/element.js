import { post, get, patch } from '@/utils/requestEmr'

export function getPageByCondition(data) {
  return get('/element/getPageByCondition', data, true)
}

// 工具箱元素库分页接口
export function getLibraryPageByCondition(data) {
  return get('/element/getLibraryPageByCondition', data, true)
}

// 工具箱获取宏元素接口
export function getMacros(data, loading = false) {
  return get('/shareEle/getByCondition', data, loading)
}

// 工具箱查询宏元素值接口
export function getMacroValues(data, loading = false) {
  return get('/shareEle/getMacroElements', data, loading)
}

export function getAll(data) {
  return get('/basic/all', data)
}

export function insertEle(data) {
  return post('/element/save', data, true)
}

export function detailQuery(data) {
  return get('/element/detailQuery', data, true)
}

export function modifyEle(data) {
  return post('/element/modify', data, true)
}

export function removeEle(data) {
  return patch('/element/remove', data, true)
}

export function getUuid(data) {
  return get('/element/getUUID', data, true)
}

export function getSeqNo() {
  return get('/element/seq_no', {}, false)
}
