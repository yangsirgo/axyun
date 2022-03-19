import { get, post } from '@/utils/requestEmr';

//新增或更新文书分类
export function saveOrUpdateDocClass(query) {
  return post('/docRecords/saveOrUpdateDocRecords', query);
}

//获取病人分类文书所有记录
export function getDocRecord(query) {
  return get('/docRecords/getDocRecords', query);
}

//根据条件获取病人指定文书记录（旧的）
export function getDocRecordByDateTimeOld(query) {
  return get('/docRecords/getDocRecordByDateTime', query);
}

//根据条件获取病人指定文书记录（新的）
export function getDocRecordByDateTime(query) {
  return get('/docRecords/getDocRecordByCond', query);
}

//根据条件获取病人指定文书记录--表格
export function getTableRecordByDocCode(query) {
  return get('/docRecords/getTableRecordByDocCode', query);
}

//获取分类文书模板
export function getDocTemplate(query) {
  return get('/docRecords/getDocTemplate', query);
}

//改造--获取病人分类文书树结构
export function getDocRecordGZ(query) {
  return get('/docRecords/getDocRecordsEmr', query);
}

//改造--加载病人文书记录
export function getDocRecordByTimeGZ(query) {
  return get('/docRecords/getDocRecordByCondEmr', query);
}

//查询科室下的用户列表
export function selectUserRoleByDeptId(query) {
  return get('/docRecords/selectUserRoleByDeptId/' + query.deptId + '/' + query.roleCode);
}
