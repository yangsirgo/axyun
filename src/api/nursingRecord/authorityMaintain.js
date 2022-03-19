import { get, post, put, del } from '@/utils/request'
const urlD = '/admin'
// 查询科室列表
export function getDepList(query) {
  return get(urlD + '/wadmin/hos/dept', query)
}

// 查询文书科室权限列表
export function getDocDeptRightByDocCode(query) {
  return get('/docDepartRight/getDocDeptRightByDocCode', query)
}

// 新增修改文书列表
export function saveOrUpdateDocDepartRight(query) {
  return post('/docDepartRight/saveOrUpdateDocDepartRight', query)
}

// 获取角色列表
export function getRoleList(data) {
  return get('/role/page', data, true)
}

//获取角色权限列表
export function getDocRoleRightByDocRoleCode(data) {
  return get('/docRoleRight/getDocRoleRightByDocRoleCode', data)
}

//更新角色权限接口（弃用）
export function saveOrUpdateDocRoleRight(data) {
  return post('/docRoleRight/saveOrUpdateDocRoleRight', data)
}

//更新角色权限接口
export function saveDocRoleRight(data) {
  return post('/docRoleRight/saveDocRoleRight', data)
}

//获取用户列表
export function queryUsers(data) {
  return get('/user/page', data, true)
}

//获取用户权限列表
export function getDocUserRightByUserId(data) {
  return get('/docUserRight/getDocUserRightByUserId', data)
}

//更新用户权限列表（弃用）
export function saveOrUpdateDocUserRight(data) {
  return post('/docUserRight/saveOrUpdateDocUserRight', data)
}
//更新用户权限接口
export function saveDocUserRight(data) {
  return post('/docUserRight/saveDocUserRight', data)
}
