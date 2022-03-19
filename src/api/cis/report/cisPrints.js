import {get, post, put, del} from '@/utils/request'
let urls = "/outpatient";
// 西药单处方打印
export function outpatientOrderPrint(query) {
  return get(urls + '/outpatientOrderQuery/outpatientOrderPrint', query)
}

// 西药多处方打印
export function outpatientOrderListPrint(query) {
  return get(urls + '/outpatientOrderQuery/batchOutpatientOrderPrint', query)
}