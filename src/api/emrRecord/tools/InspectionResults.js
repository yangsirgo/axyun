import { get } from '@/utils/requestEmr'

export function getAssayList(data) {
  return get('/assayPublishResult/getListByParamNotDelete', data)
}

export function getPageByCondition(data) {
  return get('/labRp/getPageByCondition', data, false)
}

// 检查项目详情
export function labRpItmGetPageByCondition(data) {
  return get('/labRpItm/getPageByCondition', data, false)
}
