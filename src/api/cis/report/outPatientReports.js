import {get, post, put, del} from '@/utils/request'
let urls = "/outpatient";
// 查询自备药列表
export function getSelfOrdersByStatistic(query) {
  return get(urls + '/outpatientOrderQuery/getSelfOrdersByStatistic', query)
}
