import {post,get,put,del} from '@/utils/request'

const url = '/common';

// 分页查询数据
export function getAntibacterialAuthPage(data) {
    return post(url+'/antibacterialAuth/page', data, true)
}
// 获取数据
export function getAntibacterialAuth(data) {
  return get(url+`/antibacterialAuth/${data.id}`, data, false)
}
// 保存数据
export function saveAntibacterialAuth(data) {
    return post(url+'/antibacterialAuth/save',data,true)
}
