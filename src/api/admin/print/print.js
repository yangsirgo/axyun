import {post,get,put,del}from '@/utils/request'

const url = "/admin";

export function queryReportList(data) {
  return post(url +'/report/queryReportList', data, true)
}

export function page(data) {
  return post(url +'/report/page', data, true)
}

// 保存数据
export function saveReport(data) {
  return post(url +'/report/saveReport',data,true)
}

// 修改数据
export function updateReport(data) {
  return post(url +'/report/updateReport',data,true)
}

export function delReport(id) {
  return del(url + `/report/delReport/${id}` , {}, true)
}

export function selReportByName(name) {
  return post(url +`/report/selReportByName/${name}`, {}, true)
}
// 获取lodop模板
export function getPrintTpl(data) {
  return get(`/outpatient/reportTemplate/getTemplateByCode?code=${data}`)
}