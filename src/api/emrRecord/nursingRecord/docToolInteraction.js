import { get, post } from '@/utils/requestEmr';

//获取患者基本信息
export function queryPatientInfoByInpCode(data) {
  return get('/archInfo/queryPatientInfoByInpCode/' + data.inpCode);
}

//获取患者基本信息
export function getBaseInfo() {
  return get('/docInfo/getBaseInfo');
}

//获取表
export function getDbTables(data) {
  return get('/docInfo/getDbTables/', data);
}

//获取表字段
export function getTableColumn(data) {
  return get('/docInfo/getTableColumn/', data);
}

//获取患者基本引用信息
export function initDocEle(data) {
  return post('/docInfo/initDocEle/', data);
}
