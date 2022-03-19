import {post,get,put,del} from '@/utils/request'

const url = '/resident';

export function getHospitalization (params){ // 入科安排列表
  return get(url+'/patient/prelist',params)
}

// 入出记录
export function getHospitalizationRecord (params){ // 家床记录
  return get('/ipnw/outInRecord/hospitalizationRecord', params)
}
export function getDepartmentRecord (params){ // 转科记录
  return get('/ipnw/outInRecord/DepartmentRecord', params)
}
export function getbedRecord (params){ // 转床记录
  return get('/ipnw/outInRecord/bedRecord', params)
}

export function getOutRecord (params){ // 转床记录
  return get('/ipnw/outManager', params)
}
