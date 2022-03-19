import { get, post, patch } from '@/utils/requestEmr'

// 查询文书信息列表
export function getDocInfo(query) {
  return get('/docInfo/getDocInfoByPage', query)
}

// 查询文书信息列表(无分页)
export function getDocInfoNoPage(query) {
  return get('/docInfo/getDocInfo', query)
}

// 新增修改文书信息列表
export function saveOrUpdateDocInfo(query) {
  return post('/docInfo/saveOrUpdateDocInfo', query)
}

// 删除文书信息列表
export function batchDeleteDocInfo(query) {
  return patch('/docInfo/batchDeleteDocInfo', query)
}

// 查询文书分类、文书信息、文书版本（返回层级结构）
export function getDocClassVersionInfo(query, isLoading = false) {
  return get('/docVersion/getDocClassVersionInfo', query, isLoading)
}

// 新增草稿版本或更新版本状态
export function saveOrUpdateDocVersionInfo(query, isLoading = false) {
  return post('/docVersion/saveOrUpdateDocVersionInfo', query, isLoading)
}

// 删除草稿
export function deleteDocVersionInfo(query, isLoading = false) {
  return post('/docVersion/deleteDocVersionInfo', query, isLoading)
}

// 查询某一版本的文书
export function getDocVersionInfo(query, isLoading = false) {
  return get('/docVersion/getDocVersionInfo', query, isLoading)
}

// 改造--查询某一版本的文书
export function getDocVersionInfoGZ(query) {
  return get('/template/content/' + query.id)
}

//改造--更新文书元素结构
export function saveOrUpdateDocVersionInfoGZ(query, isLoading = false) {
  return post('/template/content', query, isLoading)
}

