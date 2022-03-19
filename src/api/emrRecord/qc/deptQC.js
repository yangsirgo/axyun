import { post, get } from '@/utils/requestEmr'

//getList
export function getManageList(data) {
  return get('/qcSore/score-page', data, false)
}
//获取评分的明细列表
export function getChkFltList(enNo, qcLvlCd) {
  return get('/chkFlt/deduct-itm-list/' + enNo + '/' + qcLvlCd)
}
// 增加扣分项目
export function addItem(data) {
  return post('/chkFlt/add-deduct-itm', data, false)
}
// 删除扣分项目
export function deleteItem(data) {
  return post('/chkFlt/del-deduct-itm', data, false)
}
//计算并按评分和病案评级
export function getGrade(enNo, qcLvlCd, data) {
  return get('/qcSore/score-grade/' + enNo + '/' + qcLvlCd, data, false)
  // return del('/qcSysGroup/{id}/' + id)
}
//完成评级
export function complete(data) {
  return post('/qcSore/comp', data, false)
}

//个人质控
export function getSelfScoreList(data) {
  // return get('/chk/mr-main-page', data, false)
  return get('/qcSore/score-page', data, false)
}
// 个人质控已有的扣分项目，
export function getSelfScoreItemList(data) {
  return get('/chkFlt/deduct-itm-list/' + data.enNo + '/' + data.qcLvlCd, data.params, false)
}
//个人质控评分
export function getSelfScoreGrade(data) {
  return get('/qcSore/score-grade/' + data.enNo + '/' + data.qcLvlCd, data.params, false)
}
//个人质控评分明细 增加
export function addDeductItem(data) {
  return post('/chkFlt/add-deduct-itm', data, false)
}
//个人质控评分明细 删除
export function delDeductItem(data) {
  return post('/chkFlt/del-deduct-itm', data, false)
}
