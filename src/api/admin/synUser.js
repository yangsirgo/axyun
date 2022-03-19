import {post,get,put,del} from '@/utils/request'

export function synUser(data){
  return post(`/inhDoctor/synUser`,data,true)
}

export function getIMUserID(data){
  return post(`/inhDoctor/getIMID`,data,true)
}
