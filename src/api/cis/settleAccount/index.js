import {
  post,
  get,
  put,
  del
} from "@/utils/request";

export default {
  getTradeDetailInfo(data) { // 交易信息查询
    return post('/finance-outp/outpTradeDetailNew/trade-detail-info', data)
  },
  getOrderChargeDetailInfo(data) { // 查询可退费医嘱明细
    return post('/finance-outp/outpOrderChargeDetail/order-charge-detail-refund', data)
  },
  getOrderChargeDetailInfoAll(data) { // 查询可退费医嘱明细
    return get('/finance-outp/outpOrderChargeDetail/order-charge-detail-all-page', data)
  },
  getTradeDetailNewInfo(data) { // 查询可退费交易明细
    return get('/finance-outp/outpTradeDetailNew/getTradeDetailByRefund', data)
  },
  listOutpChargeDetailNew(data) { // 查询项目收费明细
    return get('/finance-outp/outpChargeDetailNew/listPageOutpChargeDetailNew', data)
  },
  applyRefundCharge(data) { // 退费申请
    return post('/finance-outp/refundApplyNew/applyRefundCharge', data)
  },
  refundPreSettlement(data) { // 退费申请预结算
    return get('/finance-outp/outpRefund/refund-pre-settlement/' + data)
  },
  refundCancelSettlement(data) { // 撤销结算
    return get('/finance-outp/outpRefund/cancel-settlement/' + data)
  },
  getRefundStepInfo(data) { // 退费进度
    return get('/finance-outp/refundApplyNew/refund-step-info/' + data)
  },
  cancalRefundApply(data) { // 撤销退费
    return post('/finance-outp/refundApplyNew/cancalRefundApply', data)
  }
}
