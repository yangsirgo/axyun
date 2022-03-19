import {post,get} from '@/utils/request'

export function getMarkInfo(data) {
  return get('/mr/queryMrMark', data,true)
}

export function saveMarkInfo(data) {
  return post('/mr/saveMrMark', data,true)
}
