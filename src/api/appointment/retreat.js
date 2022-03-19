import {
    post,
    get,
    put,
    del
} from '@/utils/request'

export default {
    // 退号
    // 查询退号列表
    async getList(params) {
        return await get("/appointment/outpAppt/selectReturnMoney", params, true);
    },
    // 根据id退费明细
    async getTradeDetail(params) {
        return await get("/finance-outp/outpChargeDetail/getListByTradeId", params, true);
    },
    // 确认退号
    async outpRefund(params) {
        return await post("/finance-outp/outpRefund/reg/" + params.tradeId + "/" + params.dataVersion + "/" + params.visitId, params.outpChargeDetailList, true);
    },



    // 退费
    // 查询退费列表
    async getReturnCharge(params) {
        return await post("/finance-outp/outpTradeDetail/getReChargeListPage", params, true);
    },
    // 查询退费明细
    async getReChargeInfo(params) {
        return await get("/finance-outp/outpChargeDetail/getListByTradeId", params, true);
    },
    // 查询退费申请明细
    async getRefundInfo(params) {
        return await get("/finance-outp/outpChargeDetail/getApplyByPatientId", params, true);
    },
    // 查询退费已申请明细(新)
    async getRefundInfoNew(params) {
        return await get("/finance-outp/refundApplyNew/getApplyList", params);
    },
    // 查询退费已申请明细(新)
    async getApplyListByPage(params) {
        return await get("/finance-outp/refundApplyNew/getApplyListByPage", params);
    },
    // 退费申请
    async reChargeApply(params) {
        return await post("/finance-outp/refundApply/create", params, true)
    },
    // 确认退费
    async refundCharge(params) {
        return await post("/finance-outp/outpRefund/confirm/" + params.refundApplyId + "/" + params.applyDataVersion, {}, true)
    },
    // 撤销退费
    async callBackApply(params) {
        return await post("/finance-outp/refundApply/callBackApply/" + params.refundApplyId + "/" + params.dataVersion + "/" + params.recordStatus, {}, true)
    }
};