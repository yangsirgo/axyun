import { post, get, patch } from '@/utils/requestEmr'

// 健康处方新增
export function postHealthPrescription(data, loading = false) {
  return post('/healthPrescription', data, loading)
}

// 获取管理计划流水号
export function gethealthPrescriptionSeq_no(data, loading = false) {
  return get(`/healthPrescription/seq_no`, data, loading)
}

// 健康处方修改
export function putHealthPrescription(data, loading = false) {
  return post(`/healthPrescription/${data.hpId}`, data, loading)
}

// 删除健康处方
export function delHealthPrescription(data, loading = false) {
  return patch(`/healthPrescription/batch`, data, loading)
}

// 查询健康处方-字典管理使用
export function getHealthPrescription(data, loading = false) {
  return get(`/healthPrescription/hp-page`, data, loading)
}

// 工具栏查询健康处方
export function getHealthPrescriptionPage(data, loading = false) {
  return get(`/healthPrescription/hp-use-page`, data, loading)
}
