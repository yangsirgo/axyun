import { post, get, put, del } from '@/utils/request'

const url = "/admin";//url+

export function login(data) {
  return post(url + '/user/login', data, true)
}

export function getInfo(token) {
  return get(url + '/user/info', { token: token })
}

export function logout(data) {
  return get(url + '/user/logout', data, true)
}

export function getList(data) {
  return get(url + '/user/list', data, true)
}

export function queryUsers(data) {
  return get(url + '/user/page', data, true)
}

export function addUsers(data) {
  return post(url + '/user', data, true)
}

export function editUsers(data) {
  return put(url + `/user/${data.id}`, data, true)
}

export function getUsers(data) {
  return get(url + `/user/sign/${data.id}`, data, true)
}
export function deletSign(data) {
  return del(url + `/user/sign/${data.id}`, data, true)
}
export function addSign(data) {
  return post(url + `/user/sign/`, data, true)
}

export function deleteUsers(data) {
  return del(url + '/user/batch', data, true)
}


export function queryAccounts(data) {
  return get(url + '/account/params', data, true)
}

export function addAccounts(data) {
  return post(url + '/account', data, true)
}

export function editAccounts(data) {
  return put(url + `/account/${data.id}`, data, true)
}

export function deleteAccounts(data) {
  return del(url + `/account/${data.id}`, data, true)
}
export function getOrgTree() {
  return get(url + '/org/hos-tree', {}, true)
}
export function getHosTree() {
  return get(url + '/org/hos', {}, true)
}
// export function getOrgDeptList(data){
//     return get(`/org/user-dept-list/${data.id}`,{},true)
// }
export function getOrgDeptList(data) {
  return get(url + `/org/user-hos-dept`, data, true)
}

export function deletedept(data) {
  return del(url + '/user-role/delete', data, true)
}

export function addUserRes(data) {
  return post(url + '/user-res/add', data, true)
}
export function UserResList(data) {
  return get(url + "/user-res/get/userres", data, true)
}

export function DelUserRes(data) {
  return del(url + '/user-res/params', data, true)
}

export function fetchTags(data) {
  return get(url + "/user-res/get/user-dept-res", data, true)
}

export function editUserRes(data) {
  return put(url + "user-res/update/time", data, true)
}
export function deleteUserRes(data) {
  return del(url + "user-res/delete", data, true)
}
export function getDelHos(data) {
  return del(url + "/user-hos/params", data, true)
}
export function getAddHos(data) {
  return post(url + "/user-hos/list", data, true)
}
export function getHosData(data) {
  return get(url + `/user-hos/user/${data.userId}`, {}, true)
}
export function changePass(data) {
  return put(url + `/user/passwd`, data, true)
}
