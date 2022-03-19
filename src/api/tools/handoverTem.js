import {
  post,
  get,
  put,
  del
} from '@/utils/request'
const url = "/ipnw";//url+
export function getTempList(data) {
  return get(url+'reliefTemplate/getTempList', data)
}
