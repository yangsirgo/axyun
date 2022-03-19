import {post,get,put,del} from '@/utils/request'

const url = "/admin";//url+

export function getTypeTree(data) {
    return get(url + '/params/tree', data,true)
}

export function getTypeTreeId(data){
    return get(url + `/params/${data.id}/has/child`,{},true)
}

export function addTypeTree(data) {
    return post(url + '/params', data, true)
}

export function putTypeTree(data) {
    return put(url + `/params/${data.id}`, data,true)
}

export function deleteTypeTree(data) {
    return del(url + `/params/delparamssub/${data.id}`, {},true)
}

export function getOrganTypeTree(data) {
    return get(url + '/params/org-type-tree', data,true)
}

export function getOrganTypeTable(data) {
    return get(url + `/orgFieldDefine/defines/${data.type}`,{},true )
}

export function addOrganType(data) {
    return post(url + '/orgFieldDefine', data, true)
}

export function putOrganType(data) {
    return put(url + `/orgFieldDefine/${data.id}`, data, true)
}

export function deleteOrganType(data) {
    return del(url + '/orgFieldDefine/delete/define', data, true)
}

export function getOrgTypes(data) {
    return get(url + '/params/getorgtypes', data, true)
}

export function addOrg(data) {
    return post('/org/add-org', data,true)
}

export function getOrgTree() {
    return get(url + '/org/org-tree',{}, true)
}


export function deleteOrgTree(id) {
    return del(url + `/org/delorgsub/${id}`,{},true)
}

export function getOrgItem(data) {
    return get(url + '/org/org-data', data, true)
}

export function putOrgItem(data) {
    return put(url +  '/org/upd-org', data, true)
}

export function getParamsTree(data){
    return get (url + `/params/tree/${data.id}`, {},true)
}

export function putParent(data){
    return put(url + `/params/upd-parent/`,data,true)
}

export function getArrayList(data){
  return post(url + `/wdata/dic/singles`,data,true)
}
