import { get, post, patch } from '@/utils/requestEmr';

// 查询打印模板
export function getDocPrintTemplateList(query, flag = false) {
  return get('/docPrintTemplate/getDocPrintTemplateList', query, flag);
}

// 更新打印模板
export function addOrUpDocPrintTemplate(query, flag = false) {
  return post('/docPrintTemplate/addOrUpDocPrintTemplate', query, flag);
}

// 删除打印模板
export function deleteDocPrintTemplate(query, falg = false) {
  return patch(`/docPrintTemplate/${query.id}`, {}, falg);
}
