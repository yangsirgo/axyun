import { get, post, put, patch } from '@/utils/requestEmr';

// 查询文书树（当前）
export function getDocBasicTreeList(query, flag = false) {
  return get('/docTemplate/getTreeByLv/', query, flag);
}

// 查询指定模板数据
export function getDocBasicTemplateList(query, flag = false) {
  return get('/docTemplate/getDocTemplateByParmas/', query, flag);
}

// 更新模板
export function addOrUpDocBasicTemplate(query, flag = false) {
  return post('/docTemplate/saveOrUpdateDocTemplateInfo/', query, flag);
}

// 删除打印模板
export function deleteDocBasicTemplate(query, falg = false) {
  return patch(`/docTemplate/${query.id}`, {}, falg);
}
