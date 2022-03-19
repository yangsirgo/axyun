import {
    post,
    get,
    put,
    del
} from '@/utils/request'
const url = '/patient'

export default {
    // 根据时间区间拿到待收费列表(旧)
    async getToCharge(params) {
        return await get("/appointment/outpAppt/getToCharge", params, false);
    },
    // 拿到收费数据(旧)
    async getChargeInfo(patientId, startTime) {
        return await get("/finance-outp/outpSettlement/listByPatientId/" + patientId + "/" + startTime, true)
    },
    // 根据id拿到患者数据
    async getPatientInfoById(patientId) {
        return await get(url + "/archInfo/" + patientId, true)
    },
    // 拿到历史收费列表
    async getHisList(params) {
        return await get("/appointment/outpAppt/getHisList", params, true)
    },
    // 代收费明细
    async getlistWaitChargeDetail(params) {
        return await post("/finance-outp/outpSettlement/listWaitChargeDetail", params)
    },

};