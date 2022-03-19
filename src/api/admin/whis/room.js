import {post,get,put,del} from '@/utils/request'
const url = "/admin";
// 房间分页查询
export function getRoomAll(data) {
    return get(url + '/wroom/page', data, true)
}
// 已经关联的病区
export function getSelectRoom(data) {
    return get(url + `/wroom/${data.roomId}/ward`, data, true)
} 
// 保存数据
export function addRoom(data) {
    return post(url + '/wroom',data,true)
} 
// 修改数据
export function editRoom(data) {
    return put(url + `/wroom/${data.id}`, data, true)
  } 
   // 删除数据
export function removeRoom(data) {
    return del(url + `/wroom/batch`, data,true)
}
// 保存关联
export function addRoomRelation(data) {
    return post(url + '/wroom/relation/ward', data, true)
}