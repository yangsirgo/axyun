import { post, get, patch } from '@/utils/requestEmr'

export function insert(data) {
  return post('/mrGrade/save', data, true)
}

export function modify(data) {
  return post('/mrGrade/modify', data, true)
}

export function multiRemove(data) {
  return patch('/mrGrade/removeLst', data, true)
}

export function getInPage(data) {
  return get('/mrGrade/getPageByCondition', data, false)
}

export function detail(data) {
  return get('/mrGrade/detailQuery', data, true)
}

export function multiModify(data) {
  return post('/mrGrade/multiModify', data, true)
}
