import { post, get, patch } from '@/utils/requestEmr'

/**
 *
 * 计划相关接口
 */
// 新增管理计划
export function createMngPlan(data, loading = false) {
  return post('/mngPlan', data, loading)
}


// 获取管理计划流水号
export function getmngPlanTypeSeq_no(data, loading = false) {
  return get(`/mngPlanType/seq_no`, data, loading)
}

// 修改管理计划
export function modifyMngPlan(data, loading = false) {
  return post(`/mngPlan/${data.mngPlanId}`, data, loading)
}

// 删除管理计划
export function deleteMngPlan(data, loading = false) {
  return patch(`/mngPlan/batch`, data, loading)
}

// 查询管理计划
export function getMngPlan(data, loading = false) {
  return get(`/mngPlan/plan-page`, data, loading)
}

/**
 * 类别相关接口
 */
// 新增管理类别
export function createMngPlanType(data, loading = false) {
  return post('/mngPlanType', data, loading)
}

// 获取管理计划流水号
export function getMngPlanSeq_no(data, loading = false) {
  return get(`/mngPlan/seq_no`, data, loading)
}

// 修改管理类别
export function modifyMngPlanType(data, loading = false) {
  return post(`/mngPlanType/${data.mngPlanTpId}`, data, loading)
}

// 删除管理类别批量
export function deleteMngPlanType(data, loading = false) {
  return patch(`/mngPlanType/batch`, data, loading)
}

// 查询管理计划类别
export function getMngPlanType(data, loading = false) {
  return get(`/mngPlanType/plan-tp-list`, data, loading)
}

// 管理计划类别及管理计划树查询接口
export function getMngPlanTypeTree(data, loading = false) {
  return get(`/mngPlan/plan-tree`, data, loading)
}
