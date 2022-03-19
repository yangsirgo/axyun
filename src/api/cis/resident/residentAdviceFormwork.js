import {post,get,put,del} from '@/utils/request'
const url = '/resident'
//保存医嘱
export function saveAdviceFormwork(data,needLoading) {
  return post(url+'/adviceFormwork/saveAdviceFormwork',data, needLoading)
}
//引入医嘱
export function leadAdviceFormwork(data,needLoading) {
  return post(url+'/adviceFormwork/leadFormwork',data, needLoading)
}

//引入医嘱2
export function leadAdviceFormwork2(data,needLoading) {
  return post(url+'/adviceFormwork/leadFormworkByIds',data, needLoading)
}

export function getAdviceFormwork(data,needLoading) {
  return get(url+'/adviceFormwork/listTree',data, needLoading)
}



