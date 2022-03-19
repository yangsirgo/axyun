import {post,get,put,del} from '@/utils/request'

const url = "/admin";//url+

export function addResource(data) {
    return post(url+'/resource',data,true)
}

export function addResNew(data) {
    return post(url+`/resource/add/${data.resId}`,data.authIds,true)
}

export function editResource(data) {
  return put(url+`/resource/${data.id}`, data, true)
}

export function removeResource(data) {
    return del(url+'/resource/batch/with/auth/res', data,true)
}
export function removeAuthor(data) {
    return del(url+'/authres/params', data,true)
}

export function delRes(data) {
    return del( url+`/resource/del/${data.authId}/`,data.list,true)
}

export function getResource(data) {
  return get(url+'/resource/params', data, true)
}

export function getResourceAll(data) {
    return get(url+'/resource/page', data, true)
}
export function addRes(data) {
    return post(url+'/auth/addres',data,true)
}

export function addReses(data) {
    return post(url+'/auth/add/reses',data,true)
}

export function getReses(data) {
    return get(url+`/authres/auth/${data.authId}`,{},true)
}

export function getResRouter(data) {
    return get(url+`/authres/res/${data.authId}`,{},true)
}

export function addAuthRes(data){
    return post (url+'/auth/add/authreses',data,true)
}
