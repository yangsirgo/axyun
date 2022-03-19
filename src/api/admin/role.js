import { post, get, put, del } from "@/utils/request";

const url = "/admin"; //url+

// 获取全部药品数据hmm-stock/drug/deltaImportQuery?updateTime=2021-01-01
export function deltaImportQuery(data) {
  return get(`/hmm-stock/drug/deltaImportQuery`, data, false, 60000);
}
// 获取全部诊断
export function patTcmDiag(data, pageData) {
  return get(
    `/common/patTcmDiag/findPageAll/${pageData.pageNo}/${pageData.pageSize}`,
    data,
    false,
    60000
  );
}
export function icd10Dictionary(data, pageData) {
  return get(
    `/common/icd10Dictionary/findPageAll/${pageData.pageNo}/${pageData.pageSize}`,
    data,
    false,
    60000
  );
}
export function getRoutes(data) {
  return get(url + "/role/routes", data, true);
}

export function getRole() {
  return get(url + "/role", {}, true);
}

export function getRoleList(data) {
  return get(url + "/role/page", data, true);
}

export function removeRole(data) {
  return del(url + "/role/batch", data, true);
}

export function addRole(data) {
  return post(url + "/role", data, true);
}

export function editRole(data) {
  return put(url + `/role/${data.id}`, data, true);
}

export function getRoleAuth(data) {
  return get(url + `/role-auth/ids/${data.id}`, {}, true);
}

export function saveRoleAuth(data) {
  return post(url + "/role-auth/save/", data, true);
}

export function getRoleAll(data) {
  let h = data ? data.hosId : "";
  return get(url + `/role/hos/${h}`, {}, true);
}

export function getAllRole(data) {
  return get(url + "/role/all", data, true);
}

export function getTadmin(data) {
  return get(url + `/role/routes-tenant`, data, true);
}

export function getDRole(data) {
  return get(url + "/user-role/dept-role", data, true);
}

export function getCurrRole(data) {
  return get(url + `/user-role/user/${data.id}`, true);
}

export function userAddRole(data) {
  return post(url + `/user-role/add`, data, true);
}
export function getDeptTree() {
  return get(url + "/org/dept-tree", {}, true);
}

export function getDeptList() {
  return get(url + "/org/dept-list", {}, true);
}

export function getBizRes(data) {
  return get(url + "/resource/page", data, true);
}

export function addRoleRes(data) {
  return post(url + "/role-res/add", data, true);
}

export function editRoleRes(data) {
  return post(url + "/role-res/update", data, true);
}

export function RoleResList(data) {
  return get(url + "/role-res/get/roleres", data, true);
}

export function DelRoleRes(data) {
  return del(url + "/role-res/params", data, true);
}

// 获取科室名称
export function getDeptName(id) {
  return post(url + "/wdata/query/table", {
    tableName: "sys_org",
    columns: ["org_nm"],
    conditionMap: {
      org_type: "_DEPT_",
      id: id
    }
  });
}

// 获取病区名称
export function getWardName(id) {
  return post(url + "/wdata/query/table", {
    tableName: "sys_ward",
    columns: ["ward_name"],
    conditionMap: {
      ward_code: id
    }
  });
}
