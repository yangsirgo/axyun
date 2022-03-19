import { get } from '@/utils/requestEmr'


// 查询处方列表接口
export function previousOrderList(data) {
  return get('/or/or-list-normal', data, false)
}

export function previousOrderListInPage(data) {
  return get('/or/or-page-normal', data, false)
}
