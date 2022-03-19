import {
  post,
  get,
  put,
  del,
  patch
} from '@/utils/request'
let url = "/finance-si"
export default {
  // HIS对账-总账信息查询
  async sumAccount(params) {
    return await post(url + "/tradeCheck/sum-account/", params, true);
  },
  // HIS对账-明细信息查询
  async detailAccount(params) {
    return await post(url + "/tradeCheck/getHisCheckAccountDetailInfo", params, true);
  },
  // 冲销
  async chargeAgainst(params) {
    return await post(url + "/charge-against/", params, true);
  },
  // 获取险种分类对账信息
  async getInsuranceInfo(params) {
    return await post(url + "/si-center-insurance-type-info/", params, true);
  },
  // 医保中心对账-险种对账
  async insuranceCheck(params) {
    return await post(url + "/si-center-insurance-check/", params, true);
  },
  // 医保中心对账-明细对账
  async detailCheck(params) {
    return await post(url + "/si-center-charge-detail-check/", params, true);
  },
  // 医保中心对账-明细对账信息查询
  async getDetailCheckInfo(params) {
    return await post(url + "/si-center-charge-detail-check-info/", params, true);
  }
}
