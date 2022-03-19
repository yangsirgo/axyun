import { get, post, del, put } from "@/utils/request";
const url = "";
// 取得html
export function getReportHtml(data) {
  return post(url+'/ureport2/getReportHtml', data, true)
}
