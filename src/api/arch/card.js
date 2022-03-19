import {post, get, put, del} from '@/utils/request'
const url = '/patient'
export function getArchCardListByPatientNum(data){
  return get(url+"/archCard/patient/"+data,{})
}

export function disabledCard(data){
  return post(url+"/archCard/disabled/" + data,{})
}

export function enabledCard(data){
  return post(url+"/archCard/enabled/" + data,{})
}


export function deletedCard(data){
  return del(url+"/archCard/" + data,{})
}
