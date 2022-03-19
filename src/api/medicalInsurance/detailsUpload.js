import {
    post,
    get,
    put,
    del
} from '@/utils/request';

export default {
    // 获取住院医保患者列表
    async inpPatientInfo(data) {
        return await post('/finance-si/patient/inpPatientInfo', data, false);
    },
    // 获取待上传明细列表
    async waitUpoladChargeDetail(data) {
        return await post('/finance-si/his-biz/inp/waitUpoladChargeDetail', data, false);
    },
    // 获取已上传明细列表
    async getPageTradeChargeDetailList(data) {
        return await post('/finance-si/tradeChargeDetail/getPageTradeChargeDetailList', data, false);
    },
    // 获取未对照明细列表
    async unSiItemMapChargeDetail(data) {
        return await post('/finance-si/his-biz/inp/unSiItemMapChargeDetail', data, false);
    },
    // 费用明细上传
    async stepByStep(data) {
        return await post('/finance-si/si-inp-one-stop-biz/upload-charge-detail', data, false, 130000);
    },
     // 费用明细上传
     async cancelStepByStep(data) {
        return await post('/finance-si/si-inp-one-stop-biz/cancel-upload-charge-detail', data, false, 130000);
    },
    // 医保预结算
    async preSettle(data) {
        return await post('/finance-inp/inpDischarge/pre-settle', data, false);
    }
}