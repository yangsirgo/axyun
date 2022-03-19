import {
  post,
  get,
  put,
  del
} from '@/utils/request';

// 获取财务分类码列表
export function getFinClassCodeList(data) {
  return get('/finance-pub/classCode/getClassCodePO', data);
}
// 新增财务分类码
export function addFinClassCode(data) {
  return post('/finance-pub/classCode/addClassCodePO', data);
}
// 更新财务分类码
export function updateFinClassCode(data) {
  return put('/finance-pub/classCode/updateClassCodePO', data);
}
// 删除财务分类码，finClassCode
export function deleteFinClassCode(data) {
  return del('/finance-pub/classCode/delClassCodePO/' + data);
}
