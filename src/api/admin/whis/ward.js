import {post,get,put,del} from '@/utils/request'

const url = "/admin";//url+

// 分页查询数据
export function getWardAll(data) {
    return get(url+'/ward/page', data, true)
}
// 保存数据
export function addWard(data) {
    return post(url+'/ward',data,true)
}
// 修改数据
export function editWard(data) {
    return put(url+`/ward/${data.id}`, data, true)
  }
// 删除当前行数据
export function removeWard(data) {
    return del(url+`/ward/batch`, data,true)
}
// 树形结构显示
export function getWardTree(data) {
    return get(url+`org/dept-tree`, data,true)
}

export function getResRouter(data) {
    return get(`/authres/res/${data.authId}`,{},true)
}

export function addWardRelation(data) {
    return post(url+'/ward/relation/dept', data, true)
}

// 根据病区id查询已经关联病区
export function getSelectWard(data) {
    return get(url+`/ward/${data.wardId}/dept`,{},true)
}
