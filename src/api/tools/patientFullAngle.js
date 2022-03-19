import {post, get, put, del} from '@/utils/request'
const url = '/common'

export function getTableList(data) {
  return get(url+'assayPublishResult/getListByParamNotDelete', data)
}