import {post,get,put,del} from '@/utils/request'

export function getPageByCondition(data) {
  return get('/element/getPageByCondition', data, true)
}

// 工具箱元素库分页接口
export function getLibraryPageByCondition(data) {
  return get('/element/getLibraryPageByCondition', data, true)
}

// 工具箱获取基本元素接口
export function getMacros(data) {
  return get('/shareEle/getByCondition', data, true)
}

// 工具箱查询基本元素值接口
export function getMacroValues(data) {
  return get('/shareEle/getMacroElements', data, true)
}

export function getAll(data) {
  return get('/basic/all', data)
}

export function insertEle(data) {
  return post('/element/save', data,true)
}

export function detailQuery(data) {
  return get('/element/detailQuery', data,true)
}

export function modifyEle(data) {
  return put('/element/modify', data,true)
}

export function removeEle(data) {
  return del('/element/remove', data,true)
}

