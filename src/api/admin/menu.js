import {post,get,put,del} from '@/utils/request'

const url = "/admin";//url+

export function getMenuTree(data) {
  return get(url+'/auth/menu-tree', data, true)
}

export function getMenuResTree(data){
    return get(url+'/auth/menu-res-tree',data,true)
}

export function updMenu(data) {
  return put(url+`/auth/${data.id}`, data,true)
}


export function addMenu(data) {
  return post(url+'/auth', data,true)
}

export function delMenu(id) {
  return del(url+`/auth/${id}`,{},true)
}

export function delMenuSub(id) {
  return del(url+`/auth/delmenusub/${id}`,{},true)
}
