import { get, post, patch } from '@/utils/requestEmr'
// 查询文书分类列表
export function getClassifyData(query) {
  return get('/docClass/getDocClass', query)
}
// 新增修改文书列表
export function saveOrUpdateDocClass(query) {
  return post('/docClass/saveOrUpdateDocClass', query)
}
// 删除文书列表
export function batchDeleteDocClass(query) {
  return patch('/docClass/batchDeleteDocClass', query)
}



