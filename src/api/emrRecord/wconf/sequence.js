import { post, get, patch } from '@/utils/requestEmr'

export function getSeqList(data) {
  return get('/bill/metas', data, true)
}

export function addSeq(data) {
  return post('/bill/metas', data, true)
}

export function deleteSeq(data) {
  return patch('/bill/metas', data, true)
}
