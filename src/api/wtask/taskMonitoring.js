
import {post,get,put,del} from '@/utils/request'

export function getNodeData(loading){
  return get(`/scheduler-cnf/nodes`,{},loading)
}
export function getMetricsData(loading){
  return get(`/scheduler-cnf/metrics`,{},loading)
}
export function getTaskLog(data){
  return get(`/scheduler-log/pagevo`,data,true)
}
