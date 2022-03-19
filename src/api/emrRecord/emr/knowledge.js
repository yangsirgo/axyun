// 知识库相关接口

import { post, get, patch } from '@/utils/requestEmr'

//知识库分类接口
// 获取知识库树分类
export function getKLibTpTree(data, loading = false) {
  return get('/knowledgeLibTp/getKLibTpTree', data, loading)
}
// 获取知识库树
export function getKLibTree(data, loading = false) {
  return get('/knowledgeLibTp/getKLibTree', data, loading)
}
// 新增知识库
export function knowledgeLibTpInsert(data, loading = false) {
  return post('/knowledgeLibTp/insert', data, loading)
}


// 自动生成知识库编码
export function knowledgeLibTpSeq(data, loading = false) {
  return get('/knowledgeLibTp/seq_no', data, loading)
}

// 删除指定数据
export function deleteKnowledgeLibTp(id, loading = false) {
  return patch(`/knowledgeLibTp/${id}`, {}, loading)
}


// 获取指定tree
export function getKnowledgeLibTp(id, loading = false) {
  return get(`/knowledgeLibTp/${id}`, {}, loading)
}


// 修改指定知识库分类
export function updateKnowledgeLibTp(data, loading = false) {
  return post(`/knowledgeLibTp/update`, data, loading)
}

//知识库接口
// 分页查询
export function getList(data, loading = false) {
  return get('/knowledgeLib/page', data, loading)
}
export function multiUpdate(data) {
  return post('/knowledgeLib/updEnableF', data, false)
}
export function getDetail(id, data) {
  return get('/knowledgeLib/getDetail/' + id, data, false)
}
export function save(data) {
  return post('/knowledgeLib/insert', data, false)
}
export function update(data) {
  return post('/knowledgeLib/update', data, false)
}
export function updateVersion(data) {
  return post('/knowledgeLib/updateEx', data, false)
}
export function removeBatch(data) {
  return del('/knowledgeLib/batch', data, false)
}
// 分页查询
export function getListByParams(data, loading = false) {
  return get('/knowledgeLib/getByParamsInPage', data, loading)
}

