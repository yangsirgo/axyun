import {
    post,
    get,
    put,
    del
} from '@/utils/request'
export default {
    async patientInfo(params) {
        return await post("/finance-si/si-pub-one-stop-biz/patient-info", params, true);
    },
    async getOutpSpecial(params) {
        return await post("/finance-si/si02/singleData/outpSpecial_find", params, true);
    },
    async getPayperDise(params) {
        return await post("/finance-si/si02/singleData/payperDise_find", params, true);
    },
    async getPayBySettlementType(params) {
        return await get("/finance-pub/payType/getPayBypBySettlementType", params, true);
    },
    async operationFind(params) {
        return await post("/finance-si/si02/singleData/operation_find", params, true);
    },
    async daySurgeryFind(params) {
        return await post("/finance-si/si02/singleData/daySurgery_find", params, true);
    },
    async diseandDiagFind(params) {
        return await post("/finance-si/si02/singleData/diseandDiag_find", params, true);
    },
    async fixMedinsInfo(params) {
        return await post("/finance-si/si02/fixmedins/fix_medins_info", params, true);
    },
}