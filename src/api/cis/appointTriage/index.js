import {
  post,
  get,
  put,
  del
} from '@/utils/request'


// 预约分诊下的请求

export function getTableList(data) {
  return get('/appointment/queue/getPatientListByParam', data, true);
}

// 预约分诊 获取诊室，医生
export function getDocList(data) {
  return get('/appointment/doctorSchedule/listNow', data, false);
}

// 预约分诊 提交确认按钮
export function postConfirm(data) {
  return put('/appointment/queue/change', data, true);
}

// 签到分诊页面 根据科室查询科室及患者信息接口
export function getDeptDetailInfo(data, flag = false) {
  return get('/appointment/queue/getRoomPatientMes', data, flag);
}
