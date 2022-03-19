
import {post,get,put,del} from '@/utils/request'

export function getDataList(data){
  return get(`/scheduler-cnf/page`,data,true)
}
export function getAddTasks(data){
  return post(`/scheduler-cnf`,data,true)
}
export function getEditTasks(data){
  return put(`/scheduler-cnf/${data.id}`,data,true)
}
export function getDeleteTasks(data){
  return del(`/scheduler-cnf/${data.id}`,data,true)
}
export function changeStatus(data){
  return put(`/scheduler-cnf/on-off`,data,true)
}
export function usableTest(data){
  return put(`/scheduler-cnf/usable`,data,true)
}

