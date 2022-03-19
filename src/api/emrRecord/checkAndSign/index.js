import { post, get } from '@/utils/requestEmr'


export function checkSign(params, loading = false) {
  return post("/signAuth/check-sign", params, loading);
}

// 开始审签
export function startCheckSign(id, loading = false) {
  return post(`/sign/start/${id}`, loading);
}

// 撤回审签
export function recallCheckSign(id, data, loading = false) {
  return post(`/sign/recall/${id}`, data, loading);
}

// 驳回审签
export function rejectCheckSign(id, data, loading = false) {
  return post(`/sign/reject/${id}`, data, loading);
}


// 提交时完成审签
export function compSubmit(data, loading = false) {
  return post(`/sign/comp-for-submit`, data, loading);
}
// 完成本次审签
export function compSign(data, loading = false) {
  return post(`/sign/comp`, data, loading);
}


// 获取审签等级
export function signAuthGetConfig(data) {
  return get('/signAuth/getConfig', data, false)
}

// 获取审签意见
export function getReformAdvice(data) {
  return get('/sign/page', data, false)
}


// 保存临时审签记录接口
/**
 * mrId，
 * signArr-审签列表
 * option（选填）,
 * tempF-是否临时保存审签
 * 返回值：1-正常，0-失败
 */
export function signTempSign(data) {
  return post('/sign/save-sign', data, false)
}


// 删除临时审签接口地址
/**
 *
 * userName，
 * password，
 * mrId，
 * signLevel,
 * 返回值：1-正常，0-失败
 */
export function signDelTempSign(data) {
  return post('/sign/del-temp-sign', data, false)
}
