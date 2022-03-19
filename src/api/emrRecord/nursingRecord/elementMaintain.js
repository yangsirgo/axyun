import { get, post, patch } from '@/utils/requestEmr';

// 文书元素

// 单个新增或更新元素：
export function saveOrUpdateDocElement(query, flag = false) {
  return post('/docElements/saveOrUpdateDocElement', query, flag);
}

// 分页查询元素信息：
export function getDocElementByPage(query, flag = false) {
  return get('/docElements/getEleListByCond', query, flag);
}

// 批量删除元素信息：
export function batchDeleteDocInfo(query, falg = false) {
  return patch('/docElements/batchDeleteDocElement', query, falg);
}

//  改造--病历元素查询接口
export function getDocElementByPageGZ(query, flag = false) {
  return get('/element/getPageByCondition', query, flag);
}

//  改造--获取元素详情
export function detailQuery(query, flag = false) {
  return get('/element/detailQuery', query, flag);
}
