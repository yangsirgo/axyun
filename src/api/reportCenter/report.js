import {
  post,
  get,
  put,
  del
} from '@/utils/request'

const url = '/common'
// 获取检验结果列表
export function getList(data) {
  return get(url+'/assayPublish/getList', data, false);
}
// 获取检验报告数据
export function getReportData(data) {
  return get(url+'assayPublishResult/getByAssayPublishId', data, false);
}
// 获取检验报告echarts
export function getChartData(data) {
  return get(url+'assayPublishResult/getAssayResults', data, false);
}
// 获取检查结果列表
export function getExamList(data) {
  return get(url+'/examPublish/getList', data, false);
}
// 获取检查报告数据
export function getExamData(data) {
  return get(url+'examPublishResult/getByExamPublishId', data, false);
}
// 获取检查报告数据2
export function getExamData2(data) {
  return get(url+'examPublish/getExamPublishList', data, false);
}
// 获取检验报告数据2
export function getReportData2(data) {
  return get(url+'assayPublish/getAssayPublishList', data, false);
}

// 获取检验趋势图数据
export function getAssayChartValue(data) {
  return get(url+'assayPublish/getAssayChartValue', data, false);
}
