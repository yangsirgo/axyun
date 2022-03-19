import {post, get, put, del} from "@/utils/request";
const url = '/resident';
//中草药医嘱暂存
export function temporaryAdvice(data) {
  return post(url+'/chmAdvice/chm',data)
}

//查询处方列表信息
export function getChmMessage(data) {
  return get(url+'/chmAdvice/chm/list',data)
}


// export function leaveHospital (data) {
//   return post('residentAdvice/leaveHospital ', data)
// }

//查询处方打印信息
export function hOrderPrint(data) {
  return get('/advice/recipe/herbal/recipe/print/' + data)
}


