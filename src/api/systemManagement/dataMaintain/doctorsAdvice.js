import { post, get, put, del } from '@/utils/request'

const url = '/common';


// 分页查询数据
export function getDoctorsAdvicePage(data) {
  return post(url + '/doctorsAdvice/page', data, true)
}
// 获取一条数据
export function getDoctorsAdviceInfo(data) {
  return post(url + '/doctorsAdvice/info/', data, true)
}
// 获取医嘱大类列表
export function getDoctorsAdviceList(data) {
  return get(url + '/doctorsAdvice/getListOn', data, false)
}
// 保存数据
export function saveDoctorsAdvice(data) {
  return post(url + '/doctorsAdvice/save', data, true)
}
// 获取医嘱配置树形结构
export function tree(data) {
  return put(url + `/doctorsAdvice/tree/${data.id}`, data, true)
}


//获取医嘱子类列表
export function getsonDoctorAdviceList(data) {
  return get("/doctorsAdvice/list", data)
}
