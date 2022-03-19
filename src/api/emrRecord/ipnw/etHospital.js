import {
  get,
  post
} from '@/utils/requestEmr'

// 获取空床信息
export function fetchEmptyBedInfo(query) {
  return get('/bedInfo/empty', query)
}

// 获取入院申请患者列表
export function fetchApplyPatientsList(query) {
  return get("/applyRecord/getListByParam", query, false)
}

// 获取某一患者入院申请详情
export function fetchPatientApplyDetail(id) {
  return get(`/applyRecord/${id}`, {}, false)
}

// 读卡获取患者接口
export function getCardReading(data) {
  return get('/patient/cardReading', data, false);
}

// 获取待入院患者列表
export function fetchPatientsList(query) {
  return get('/patient/list', query, false)
}

// 获取科室医生或护士
export function fetchUserByDept(query) {
  return get('/usercommon/getUserByDept', query, false)
}

// 分配床位
export function assingnBed(query) {
  return post('/bedInfo/assingn', query, true)
}
//获取病历模板列表
export function getTemplateList(query) {
  return get('/adviceFormwork/listTree', query, true)
}
//获取病历模板列表
export function queryId(query) {
  return post('/adviceFormwork/judgeFormwork', query, true)
}

// 入院登记
export function admRegistration(query) {
  return post('/inp/fin-hos-reg', query, true)
}

// 根据入院申请id获取病患信息
export function getPatientInfo(query) {
  return get('applyRecord/' + query.id)
}

export function getBedInfList(data) {

  return get("/bedInfo/list", data)
}

export function doctorList(data) {

  return get("/wadmin/dept-doctor/" + data, {});
}

export function nurseList(data) {
  return get("/wadmin/dept-nurse/" + data, {});

}
// 入院预交金充值
export function payMent(data) {
  return post('/inp/finInp/prepay', data)
}

export function rotating(data) {
  return post("/bedInfo/rotating", data, true);
}

//根据科室获取医生列表
export function getDeptDoctorList(data) {
  return get('/wadmin/dept-doctor/' + data)
}

// 根据住院号（inpCode）查询已住院病人信息
export function getInpPatientInfo(data) {
  return get('inp/patient/' + data)
}


//获取今日入院登记人列表
export function getAdmitRegistrState(query) {
  return get('/inp/inpAccount', query, true)
}
