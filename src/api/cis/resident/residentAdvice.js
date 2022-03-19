import {post,get,put,del} from '@/utils/request'
const url = '/resident';
//获取住院医嘱
export function getAdvice(data,needLoading) {
  return get(url+'/residentAdvice/queryListAdvice',data, needLoading)
}
//获取住院医嘱-新
export function westAdviceGetAdvice(data,needLoading) {
  return get(url+'/westAdvice/queryListAdvice',data, needLoading)
}
export function adviceDelete(data,needLoading) {
  return put(url+'/residentAdvice/delete', data, needLoading)
}
export function westAdviceDelete(data,needLoading) {
  return put(url+'/westAdvice/delete', data, needLoading)
}
export function bunching(data,needLoading) {
  return put(url+'/residentAdvice/group', data, needLoading)
}
export function westAdviceBunching(data,needLoading) {
  return put(url+'/westAdvice/group', data, needLoading)
}
export function unbunching(data,needLoading) {
  return put(url+'/residentAdvice/deleteGroup', data, needLoading)
}
export function westAdviceUnbunching(data,needLoading) {
  return put(url+'/westAdvice/deleteGroup', data, needLoading)
}
export function stop(data,needLoading) {
  return put(url+'/residentAdvice/stop', data, needLoading)
}
export function westAdviceStop(data,needLoading) {
  return put(url+'/westAdvice/stop', data, needLoading)
}
export function allStop(data,needLoading) {
  return put(url+'/residentAdvice/allStop', data, needLoading)
}
  export function cancel(data,needLoading) {
    return put(url+'/residentAdvice/cancel', data, needLoading)
}
export function copyLong(data,needLoading) {
  return put(url+'/residentAdvice/copyLong', data, needLoading)
}
export function copyShort(data,needLoading) {
  return put(url+'/residentAdvice/copyShort', data, needLoading)
}
export function gonna(data,needLoading) {
  return put(url+'/residentAdvice/gonna', data, needLoading)
}

export function gonnaOut(data,needLoading) {
  return put(url+'/residentAdvice/gonnaOut', data, needLoading)
}
export function gonnaLeave(data,needLoading) {
  return put(url+'/residentAdvice/adviceGonnaLeave', data, needLoading)
}
export function temporary(data) {
  return post(url+'/residentAdvice/temporary', data)
}
export function temporaryList(data) {
  return post(url+'/residentAdvice/temporaryList', data)
}

export function adviceSubmit(data) {
  return post(url+'/residentAdvice/submit', data)
}
export function westAdviceSubmit(data) {
  return post(url+'/westAdvice/submit', data)
}
export function performance(data) {
  return get(url+'/residentAdvice/advicePerformance', data)
}
/**
 * 获取医嘱项目（药品）
 * @param data
 * @returns {*}
 */
export function getAdviceItem(data) {
  return get(url+'/residentAdvice/pageItemList', data)
}
export function rescind(data) {
  return put(url+'/residentAdvice/rescind', data)
}
export function westAdviceRescind(data) {
  return put(url+'/westAdvice/rescind', data)
}
export function westAdviceRecall(data) {
  return put(url+'/westAdvice/recall', data)
}
// 顶部信息卡片 出院接口
export function leaveHospital (data) {
  return post(url+'residentAdvice/leaveHospital ', data)
}
export function leaveHospitalJudge (data) {
  return get(url+'residentAdvice/leaveHospitalJudge', data)
}
export function getChmAdvice (data) {
  return get(url+'chmAdvice/chm/list', data)
}
