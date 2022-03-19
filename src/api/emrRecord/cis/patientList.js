import {
  get, post
} from '@/utils/requestEmr';

//查询患者相关接口

// 查询患者列表
export function getPatientList(query, loading = false) {
  return get('/viPatient/page', query, loading)
}


// 查询患者信息根据就诊流水号
export function getPatientInfoByEnNo(query, loading = false) {
  return get('/viPatient/findByEnNo', query, loading)
}



// 清空患者就诊记录
export function resetEmrAjax(hosId, visitId) {
  return get(`/main/clear/${hosId}/${visitId}`, false);
}


export function getHistoryVisitByPage(paId, data) {
  return post('/main/getHistoryVisitByPage/' + paId, data)
}

export function getHistoryEmrList(hosId, enId) {
  return get(`/mr/en-mr-list/${hosId}/${enId}`, {})
}
