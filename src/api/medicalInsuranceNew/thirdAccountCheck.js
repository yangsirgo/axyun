import {
  post,
  get,
  put,
  del,
  patch
} from '@/utils/request'
let url = "/finance-pub"
export default {
  // 第三方对账内部对账明细询
  async getListCheckDetail(params) {
    return await post(url + "/payCheckOrder/listCheckDetail", params, true);
  },
  // 第三方对账内部对账退款
  async refunded(params) {
    return await get(url + "/payCheckOrder/refund", params, true);
  },
}
