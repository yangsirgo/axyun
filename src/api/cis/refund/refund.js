import {
  post,
  get,
  put,
  del
} from '@/utils/request'
const urlB = '/patient'
export default {
  // 查询退费申请患者列表
  async getList(params) {
    return await get("/finance-outp/outpTradeDetail/getApplyList", params, true);
  },
  // 查询申请列表
  async getApplyList(params) {
    return await get("/finance-outp/outpChargeDetail/getApplyByPatientId", params, true);
  },
  // 审批
  async passApply(params) {
    return await post("/finance-outp/refundApply/approvalApply", params, true);
  },
  // 撤回审核
  async revocationApply(params) {
    return await put("/finance-outp/refundApply/revocationApply", params);
  },
  // 读卡
  async getCardDetailInfo(params) {
    return await get(urlB+"/archInfo/swipe", params, false);
  },
  // 查询退费审核列表
  async getApplyListByPage(params) {
    return await get("/finance-outp/refundApplyNew/getApplyListByPage", params, false);
  },
  // 退费未审核->审核
  async passRefundApply(params) {
    return await post("/finance-outp/refundApplyNew/passRefundApply", params);
  }
};
