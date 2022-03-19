import { post } from '@/utils/requestEmr'


// code查询 反显使用
export function transformCode(data) {
  return post('/wdata/dics/details', data)
}
export function transformCodeList(data) {
  return post('/wdata/dics/key-details', data)
}

export function multiTransformCodeList(data) {
  return post('/wdata/dic/multis/details', data)
}

// 非主数据查询
export function getTableData(data) {
  return post('/wdata/query/table', data)
}

export function getTableDatas(data) {
  return post('/wdata/query/tables', data)
}
