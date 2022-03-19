import {post, get, put, del} from '@/utils/request'

const urlB = '/patient'

// 新的api编写出
//获取手机号验证码
export function sendMsg(data) {
  return post(urlB+'/archMsg/patientArchInfoSendMsg',data,false);
}
// 保存基本信息
export function addArchive(data) {
  return post(urlB+'/archInfo/savaPatientArchInfo', data, true);
}
// 家床登记
export function finHosReg(data) {
  return post('/finance-inp/inp/fin-hos-reg', data, true);
}

export function deptList(data) {
  return get('/appointment/doctorSchedule/getDept', data, true);
}
export function WdeptList(data) {
  return get('/wadmin/ward-hos?hosId=91', data, true);
}

// 家床登记
export function regInfo(data) {
  return put('/finance-inp/inp/reg-info', data, true);
}
// 获取列表信息
export function getPatientArchInfo(data) {
  return post(urlB+'/archInfo/getPatientArchInfo', data, false);
}
// 绑定 /archCard/bindCard
export function bindCard(params) {
  return post(urlB+"/archCard/bindCard",params);
}
//解绑
export function delArchCard(params) {
  return post(urlB+"/archCard/unbindCard",params);
}
// 年龄
export function getAgeByBirthDate(data) {
  return get(urlB+'/archInfo/get-age-by-birthDate', data);
}
// 读卡
export function getReadCard(data) {
  return get(urlB+'/archInfo/readCard', data);
}

// 获取患者所有卡
export function getCordByPatientId(data) {
  return post(urlB+'/archInfo/getCordByPatientId', data, false);
}
// 相似档案
export function similarityIndex(params) {
  return post(urlB+"/archInfo/similarityIndex",params);
}
// 校验是否有相同类的卡接口
export function checkCardNo(params) {
  return post(urlB+"/archInfo/checkCardNo",params);
}
// export function similarityIndex(data) {
//   return get('/archInfo/similarityIndex', data);
// }
//获取相似档案
export function getLikePatientArchInfo(data) {
  return post(urlB + '/archInfo/getLikePatientArchInfo', data);
}

//结算类型获取相应的结算单位
export function getSettlementCompany(settlementCode = "") {
  return get('/finance-pub/company/settlement?settlementCode=' + settlementCode);
}

//获取患者医保档案信息
export function getInitSiPatientInfo(ajaxData) {
  return post('/patient/archInfo/initSiPatientInfo', ajaxData);
}

// 通过身份证号码带出户籍地址
export function analysisAddressByIdCard(ajaxData) {
  return get('/patient/patientEmpiInfoCertificate/analysisAddressByIdCard', ajaxData);
}

export function savaHeightAndWeight(data) {
  return post('/patient/archInfo/savaHeightAndWeight', data, false)
}