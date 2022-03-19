import {post, get, put, del} from '@/utils/request'
const url = "/common";

//查询列表
export function page(data) {
  return post(url + '/allergyPatientInfo/page', data, true)
}

export function executeTest(data) {
  return post(url + '/allergyPatientInfo/executeTest', data, true)
}

//新增过敏记录
export function add(data) {
  return post(url + '/allergyPatientInfo', data, true)
}

//修改过敏记录
export function update(data) {
  return put(url + '/allergyPatientInfo/' + data.id, data, true)
}

// 获取皮试结果有效记录
export function getEffectiveRecord(data) {
  return get(url + '/allergyPatientInfo/getEffectiveRecord', data)
}
