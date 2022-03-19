import {
  post,
  get,
  put,
  del
} from '@/utils/request'
let url = "/finance-si"
export default {
  // 查询科室信息数据
  async sdeptInfoFind(params) {
    return await post(url + "/si02/sdeptInfo/sdept_info_find", params, true);
  },
  // 新增科室信息数据
  async sdeptInfoUpload(params) {
    return await post(url + "/si02/sdeptInfo/sdept_info_upload", params, true);
  },
  // 变更科室信息数据
  async sdeptInfoUpdate(params) {
    return await post(url + "/si02/sdeptInfo/sdept_info_update", params, true);
  },
  // 撤销科室信息数据
  async sdeptInfoCancel(params) {
    return await post(url + "/si02/sdeptInfo/sdept_info_cancel", params, true);
  }
}