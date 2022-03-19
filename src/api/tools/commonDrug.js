import {
  post,
  get,
  put,
  del
} from '@/utils/request'

const url = '/common';
const urlA = '/outpatient';

export function selectCommonMedica(data) {
  return get(urlA+'/outpatientOrder/selectCommonMedical', data)
}

// 获取药品接口
export function getViewItemDetail(data) {
  return get(url+'/adviceItem/getViewItemDetail', data)
}

// 获取药品接口(新)
export function validQuoteHerbal(data) {
  return post(urlA+'/outpatientOrder/validQuoteHerbal', data)
}
