import { post, get, patch } from '@/utils/requestEmr'

export function login(data) {
  return post('/user/login', data, true)
}

export function getInfo(token) {
  return get('/user/info', { token: token })
}

export function logout(data) {
  return get('/user/logout', data, true)
}

export function getList(data) {
  return get('/user/list', data, true)
}

export function queryUsers(data) {
  return get('/user/page', data, true)
}

export function addUsers(data) {
  return post('/user', data, true)
}

export function editUsers(data) {
  return post(`/user/${data.id}`, data, true)
}

export function getUsers(data) {
  return get(`/user/sign/${data.id}`, data, true)
}
export function deletSign(data) {
  return patch(`/user/sign/${data.id}`, data, true)
}
export function addSign(data) {
  return post(`/user/sign/`, data, true)
}

export function deleteUsers(data) {
  return patch('/user/batch', data, true)
}


export function queryAccounts(data) {
  return get('/account/params', data, true)
}

export function addAccounts(data) {
  return post('/account', data, true)
}

export function editAccounts(data) {
  return post(`/account/${data.id}`, data, true)
}

export function deleteAccounts(data) {
  return patch(`/account/${data.id}`, data, true)
}
export function getOrgTree() {
  return get('/org/hos-tree', {}, true)
}
export function getHosTree(loading = true) {
  return get('/org/hos', {}, loading)
}
export function getOrgAndDeptList(data, loading = false) {
  return get(`/wadmin/hos/dept`, data, loading)
}
export function getOrgDeptList(data) {
  return get(`/org/user-hos-dept`, data, true)
}

export function deletedept(data) {
  return patch('/user-role/delete', data, true)
}

export function addUserRes(data) {
  return post('/user-res/add', data, true)
}
export function UserResList(data) {
  return get("/user-res/get/userres", data, true)
}

export function DelUserRes(data) {
  return patch('/user-res/params', data, true)
}

export function fetchTags(data) {
  return get("/user-res/get/user-dept-res", data, true)
}

export function editUserRes(data) {
  return post("user-res/update/time", data, true)
}
export function deleteUserRes(data) {
  return patch("user-res/delete", data, true)
}
export function getDelHos(data) {
  return patch("/user-hos/params", data, true)
}
export function getAddHos(data) {
  return post("/user-hos/list", data, true)
}
export function getHosData(data) {
  return get(`/user-hos/user/${data.userId}`, {}, true)
}
export function changePass(data) {
  return post(`/user/passwd`, data, true)
}
