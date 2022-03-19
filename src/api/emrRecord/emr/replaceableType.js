import { post, get, patch } from '@/utils/requestEmr'

export function getPageByCondition(data) {
  return get('/replaceableTypeGroup/getPageByCondition', data, false)
}

export function save(data) {
  return post('/replaceableTypeGroup/save', data, true)
}

export function detailQuery(id) {
  return get('/replaceableTypeGroup/detailQuery/' + id, {}, true)
}

export function modify(data) {
  return post('/replaceableTypeGroup/modify', data, true)
}

export function remove(data) {
  return patch('/replaceableTypeGroup/remove', data, true)
}
//获取seq
export function getSeq() {
  return get('/replaceableTypeGroup/seq_no', {}, true)
}
