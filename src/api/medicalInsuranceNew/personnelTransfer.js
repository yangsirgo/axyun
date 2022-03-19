import {
  post,
  get,
  put,
  del
} from '@/utils/request'
let url = "/finance-si"
export default {
  // 查询人员转案
  async changeHosFind(params) {
    return await post(url + "/si02/personRecord/change_hos_find", params, true);
  },
  // 新增人员转案
  async changeHosRecord(params) {
    return await post(url + "/si02/personRecord/change_hos_record", params, true);
  },
  // 撤销人员转案
  async cancalChangeRecord(params) {
    return await post(url + "/si02/personRecord/cancal_change_record", params, true);
  }
}