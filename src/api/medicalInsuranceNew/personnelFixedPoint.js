import {
  post,
  get,
  put,
  del
} from '@/utils/request'
let url = "/finance-si"
export default {
  // 查询人员定点备案
  async specHosFind(params) {
    return await post(url + "/si02/personRecord/spec_hos_find", params, true);
  },
  // 新增人员定点备案
  async specHosRecord(params) {
    return await post(url + "/si02/personRecord/spec_hos_record", params, true);
  },
  // 撤销人员定点备案
  async cancalspecRecord(params) {
    return await post(url + "/si02/personRecord/cancal_hos_record", params, true);
  }
}