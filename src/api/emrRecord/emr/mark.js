import { post, get } from '@/utils/requestEmr'

export function getMarkInfo(data) {
  return get('/mr/queryMrMark', data, false)
}

export function saveMarkInfo(data) {
  return post('/mr/saveMrMark', data, false)
}
