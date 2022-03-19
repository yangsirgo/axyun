import {post,get,put,del} from '@/utils/request'
const urlA = '/outpatient';
const urlB = '/patient'
const urlC = '/resident'
const urlD = "/admin";//url+
//获取住院患者列表
export function getPatients(data,needLoading) {
  return get(urlC+'/patient/list',data, needLoading)
}

//获取患者状态及状态对应数据
export function getPatientsState(data,needLoading) {
  return get(urlC+'/patient/statistics',data, needLoading)
}

//获取患者变动
export function getPatientChange(data) {
  return get(urlC+'/residentPatient/patientChange',data, true)
}
//获取过敏信息
export function findAllergy(data) {
  return get(urlA+'/outpatientSign/findAllergy',data, false)
}
//初诊
export function first(data) {
  return put('/appointment/outpAppt/triageStatus/first',data, true)
}

//复诊
export function repeat(data) {
  return put('/appointment/outpAppt/triageStatus/repeat',data, true)
}

//根据检索字段查询患者编号
export function selectPatientBySth(data) {
  return get(urlB+'/archInfo/list-patientnum-by-params',data, false)
}

//根据预约分诊id获取po
export function findByTriageAppointmentId(data) {
  return get('/appointment/outpAppt/findByTriageAppointmentId',data, true)
}

// 获取医护等级 接口
export function getNursingLevel(data) {
  return get(urlD+'/wdata/dic/single/nursingLevel',data, true);
}

// 获取病情情况 接口
export function getEntranceCode(data) {
  return get(urlD+'/wdata/dic/single/EntranceCode',data, true);
}

// 获取病情情况数量 接口
export function getEntranceCodeNum(data) {
  return get(urlC+'/patient/patientSituation',data, true);
}

// 获取医护等级数量 接口
export function getNursingLevelNum(data) {
  return get(urlC+'/patient/patientNursingLevel',data, true);
}

// 读卡获取患者接口
export function getCardReading(data) {
  return get(urlC+'/patient/cardReading',data, true);
}
