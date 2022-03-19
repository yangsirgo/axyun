import {
  get,
  post,
} from '@/utils/requestEmr'
// 审签相关接口
// 待本人审签
export function waitOwnCheckSignList(query, loading = false) {
  return get("/sign/unsigned-list", query, loading);
}
// 本人已审签
export function OwnCheckedSignList(query, loading = false) {
  return get("/sign/signed_list", query, loading);
}
// 待科室审签
export function waitDeptCheckSignList(query, loading = false) {
  return get("/sign/unsigned-by-dept", query, loading);
}
// 开始审签
export function waitCheckingSign(id, loading = false) {
  return get(`/sign/start/${id}`, {}, loading);
}
// 驳回审签
export function rejectCheckSign(id, loading = false) {
  return post(`/sign/reject/${id}`, {}, loading);
}
// 完成审签
export function doneCheckSign(id, loading = false) {
  return post(`/sign/pass/${id}`, {}, loading);
}
// 撤回审签
export function recallCheckSign(id, loading = false) {
  return post(`/sign/recall/${id}`, {}, loading)
}
// 待整改
export function getChkRectify(data, loading = false) {
  return get(`/chkRectify/rectify-list`, data, loading)
}
// 已书写文书列表
export function getMrPage(data) {
  return get('/mr/mr-page', data, false)
}
// 病案完成书写
export function mainComp(data) {
  return post('/main/comp', data, false)
}
// 撤回完成书写 /main/cancle-comp/{enId}，
export function mainCancleComp(enId) {
  return post(`/main/cancle-comp/${enId}`, {}, false)
}
