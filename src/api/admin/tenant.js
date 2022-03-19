
import {post,get,put,del} from '@/utils/request'

const url = "/admin";//url+

export function getTenantData(data){
  return get(url+`/org/tenant`,data,true)
}
