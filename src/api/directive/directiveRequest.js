import { post, get } from '@/utils/request'
const urlD = "/admin";//url+

// code查询 反显使用
export function transformCode(data) {
  return post(urlD + '/wdata/dics/details', data)
}
export function transformCodeList(data) {
  return post(urlD + '/wdata/dics/key-details', data)
}

export function multiTransformCodeList(data) {
  return post(urlD + '/wdata/dic/multis/details', data)
}

// 非主数据查询
export function getTableData(data) {
  return post(urlD + '/wdata/query/table', data)
}

export function getTableDatas(data) {
  return post(urlD + '/wdata/query/tables', data)
}


// 单级字典反显接口 带搜索查询接口
export function getSelectList({ code, key = "", existKey = "", pageNo = 1, pageSize = 20 }, loading = false) {
  return get(urlD + `/wdata/dic/singlePage/${code}/${pageNo}/${pageSize}`, { key, existKey }, loading)
}
