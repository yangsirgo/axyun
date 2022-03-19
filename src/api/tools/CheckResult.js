import {post, get, put, del} from '@/utils/request'

const url = '/common'

export function getExaList(data) {
  return get(url+'examPublishResult/getListByParamNotDelete', data)
}