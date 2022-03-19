import {get, post, put, del} from '@/utils/request'

/*结算明细*/
// 查询明细列表
export function getDetailList(query) {
  return get('/finance-outp/outpChargeDetail/getListByParams', query)
}
/*挂号统计*/
// 查询统计列表
export function getListByPage(query) {
  return get('/appointment/outpAppt/listByPage', query)
}
