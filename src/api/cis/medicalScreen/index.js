import {
  post,
  get,
  put,
  del,
  patch
} from '@/utils/request'
let url = "/appointment"
export default {
  // 筛查列表查询
  async listHighBloodScreen(params) {
    return await post(url + "/high-blood-screen/listHighBloodScreen", params, true);
  },
  // 筛查详细信息查询
  async getDetailRecord(params) {
    return await post("/third/publicHealth/record/ref", params, true);
  },
  // 筛查身高体重腰围详细信息查询
  async getRecentRecordByPatientId(params) {
    return await get(url + "/high-blood-screen/getRecentRecordByPatientId/" + params);
  },
  // 测量结果录入
  async saveHighBloodScreen(params) {
    return await post(url + "/high-blood-screen/saveHighBloodScreen", params, true);
  },
  // 获取所有机构
  async getHosList(params) {
    return await get("/admin/org/hos-list", params, true);
  },
}
