import { post, get, patch } from '@/utils/requestEmr'

export function insert(data) {
  return post('/imageType/insert', data, false)
}
export function getTree(data) {
  return get('/imageType/getTree', data, false)
}

export function detail(id) {
  return get('/imageType/' + id, null, false)
}

export function update(data) {
  return post('/imageType/update', data, false)
}

export function delMulti(data) {
  return patch('/imageType/batch', data, false)
}
