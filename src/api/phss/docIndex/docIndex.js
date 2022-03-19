import { post, get, put, del } from "@/utils/request";
const url = "/phss";
// const url = "";
// 获取档案综合管理列表
export function onQueryDocIndex(data) {
  return post(url + "/docIndex/onQueryDocIndex", data, true);
}
// 获取档案的详情
export function onQueryDocIndexDetail(data) {
  return get(url + "/docIndex/onQueryDocIndexDetail", data, false);
}
// 修改人群类别接口
export function onSaveRsdtType(data) {
  return post(url + "/docIndex/onSaveRsdtType  ", data, false);
}
// 健康档案综合管理的档案封存确定
export function sealDocIndex(data) {
  return post(url + "/docSeal/sealDocIndex  ", data, false);
}
// 健康档案综合管理的档案复核
export function reviewDocIndex(data) {
  return post(url + "/docIndex/onReviewDocIndex", data, false);
}
// 健康档案综合管理的档案删除
export function onDeleteDocIndex(data) {
  return post(url + "/docIndex/onDeleteDocIndex", data, false);
}

// 公卫获取待服务的查询接口
export function queryWaitForServiceDocIndex(data) {
  return post(url + "/homePage/onQueryWaitForServiceDocIndex", data, false);
}
export function docIndexAllByPage(data) {
  return post(url + "/docIndex/docIndexAllByPage", data, false);
}
