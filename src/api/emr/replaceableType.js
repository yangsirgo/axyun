import {post,get,put,del} from '@/utils/request'

export function getPageByCondition(data) {
  return get('replaceableTypeGroup/getPageByCondition', data, false)
}

export function save(data){
  return post('replaceableTypeGroup/save',data,true)
}

export function detailQuery(id) {
  return get('replaceableTypeGroup/detailQuery/' + id,{},true)
}

export function modify(data) {
  return put('replaceableTypeGroup/modify',data,true)
}

export function remove(data) {
  return del('replaceableTypeGroup/remove',data,true)
}
