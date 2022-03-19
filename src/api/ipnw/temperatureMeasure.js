import { get, post, put, del } from "@/utils/request";


const url = "/opnw";//url+



//发热登记列表
export function getTemperatureList(params) {
  return get(url + "/fever/forPage", params);
}
//发热登记暂存
export function saveTemperature(params) {
  return post(url + "/fever/save", params);
}
//发热登记-查看详情
export function getTemperatureDetail(params) {
  return get(url + "/fever/get/" + params);
}

// 导出接口
export function exportTemperatureExcel (params){
  return  post(url + "/exportOpnw/excelFeverData", params, false, '', 'blob');
}
