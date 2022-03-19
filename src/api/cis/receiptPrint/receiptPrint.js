import {
    post,
    get,
    put,
    del
} from '@/utils/request'

export default {
    // 返现 费用类型
    async classCodeAll(params) {
        return await get("/finance-pub/classCode/all", params, false);
    },

    // 打印费用信息
    async receiptPrint(params) {
        return await post("/finance-outp/receiptPrint/receiptPrint", params, false);
    },
    // 查询下一张票据号
    async getNextReceiptNum(params) {
        return await get("/finance-pub/receiptOut/getNextReceipt", params, false);
    },
    // 查询交易明细
    async getOutpTradeDetailByPatient(params) {
        return await get("/finance-outp/outpTradeDetailNew/trade-detail-receipt", params, false);
    },
    // 根据交易ID集合查询收费明细
    async getOutpChargeDetail(params) {
        return await post("/finance-outp/outpChargeDetailNew/getOutpChargeDetailNewByTradeId", params, false);
    },
    // 根据交易ID集合查询收费分页明细
    async getOutpChargeDetailByPage(params) {
        return await post("/finance-outp/outpChargeDetailNew/getOutpChargeDetailNewByTradeIdPage", params, false);
    },
    // 查询票据明细
    async getReceiptDetail(params) {
        return await get("/finance-outp/outpReceiptDetail/getReceiptDByPatient", params, false);
    },
    // 查询票据明细
    async getTradeDetailByReceiptId(params) {
        return await get("/finance-outp/outpReceiptDetail/getTradeDetailByReceiptId", params, false);
    },
    // 查询票据明细分页
    async getTradeDetailByReceiptIdPage(params) {
        return await post("/finance-outp/outpReceiptDetail/getReceiptDetailByReceiptIdPage", params, false);
    },
    // 票据打印
    async printReceipt(params) {
        return await post("/finance-outp/outpReceiptDetail/printReceipt", params, false);
    },
    // 票据打印-电子发票热敏凭证
    async printInvoiceEBill(params) {
        return await get("/finance-outp/outpReceiptDetail/printInvoiceEBill", params, false);
    },
    // 原票重打 (查询票据信息)
    async getPrintReceiptInfo(params) {
        return await get("/finance-outp/receiptPrint/print", params, false);
    },
    // 新票重打
    async newPrintReceipt(params) {
        return await post("/finance-outp/receiptPrint/reprint", params, false);
    },
    // 退发票
    async retreatReceiptRrint(params) {
        return await post("/finance-outp/receiptPrint/cancalReceipt", params, false);
    },
    // 跳号
    async receiptJumpNum(params) {
        return await post("/finance-pub/receiptJumpNum/jumpNum", params, false);
    },

    // 根据条件查询交易明细
    async getTradeListByParams(params) {
        return await get("/finance-outp/outpTradeDetail/getList", params, false);
    },
    // 根据条件查询交易信息（新）
    async getTradeListNew(params) {
        return await post("/finance-outp/outpTradeDetailNew/trade-detail-info", params, false);
    },
    // 获取支付明细
    async getAccountTradeSettleAmtList(params) {
        return await post("/finance-outp/outpTradeSettleAmtDetail/in-account-trade-settle-amt/list/" + params);
    },
    // 获取结算类型列表
    async settlementType(params) {
        return await get("/admin/wdata/dic/single/settlementType");
    },
    //根据条件查询交易信息（新）（全部数据）
    async getTradeListNewAll(params) {
        return await post("/finance-outp/outpTradeDetailNew/trade-detail-info-all", params, false);
    },
    //住院预缴 新票打印
    async prepayReceiptPrint(params) {
        return await post("/finance-inp/inp-receipt/prepayReceiptPrint", params, false);
    },
    //住院预缴 原票重打
    async getPrepayReceiptDetail(params) {
        return await get("/finance-inp/inp-receipt/getPrepayReceiptDetail", params, false);
    },
    //获取票据类型
    async getDictionaryPO(params) {
        return await get("/finance-pub/dictionary/getDictionaryPO", params, false);
    },
    //获取票据类型
    async getListPayType(params) {
        return await get("/finance-pub/payType/listPayType?recordStatus=1", params, false);
    },
    // 导出接口
    async exportChargeExcel(params) {
        return await post("/finance-outp/export/exportChargeExcel", params, false, '', 'blob');
    },
};