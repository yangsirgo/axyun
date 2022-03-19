import {
    post,
    get,
    put,
    del
} from '@/utils/request'
const url = '/patient'
const urlA = '/admin'
export default {
    // 根据时间区间拿到排班信息
    async getScheduleList(params) {
        return await get("/appointment/doctorSchedule/list", params, true);
    },
    // 查询挂号费收费（旧）
    async getChargesItem(params) {
        return await get("/finance-pub/chargeItem/listByTreatType", params, true);
    },
    // 查询挂号费收费（新）
    async getChargeRegDetail(params) {
        return await post("/finance-outp/regDetail/reg-detail/list", params, true);
    },
    // 查询患者档案
    async getPatientInfo(params) {
        return await get(url + "archInfo/list-patient-by-cardnum", params, true);
    },
    // 根据id查询患者基本信息
    async getPatientBaseInfo(patientId) {
        return await get(`/archive/${patientId}`, {}, false)
    },
    // 门诊预结算(旧)
    async preSettlement(params) {
        return await post("/finance-outp/outpSettlement/preSettlement", params, false)
    },
    // 门诊结算(旧)
    async settlement(params) {
        return await post("/finance-outp/outpSettlement/settlement", params, true)
    },
    // 充值接口
    async prestore(params) {
        return await post("/finance-outp/prestoreDetail/prestore", params, true)
    },
    // 获取账户信息
    async getAccountInfo(params) {
        return await get("/finance-outp/prestoreAccount/account/" + params, true);
    },
    // 预约挂号(旧)
    async createOutp(params) {
        return await post("/appointment/outpAppt/create", params, true);
    },
    // 删除预约信息(旧)
    async delOutp(params) {
        return await del("/appointment/outpAppt/supportVersion", params, true);
    },
    // 获取挂号即收
    async getItem(params) {
        return await get("/finance-pub/chargeItem/getRegDisplay", params, false);
    },
    // 查询患者预约列表
    async getOutpList(params) {
        return await get("/appointment/outpAppt/getOutpList", params, false);
    },
    // 查询患者档案信息，左侧列表查询
    async getRecordList(params) {
        return await get(url + "/archInfo/patientList", params, false);
    },
    // 左侧读卡接口
    async getCardDetailInfo(params) {
        return await get(url + "/archInfo/swipe", params, false);
    },
    // 患者历史挂号记录
    async getHisList(params) {
        return await get("/appointment/outpAppt/getHisList", params, false)
    },
    // 患者预约挂号记录
    async getApptByTime(params) {
        return await get("/appointment/outpAppt/getApptByTime", params, false)
    },
    // 患者预约挂号记录
    async getOutpApptList(params) {
        return await get("/appointment/outpAppt/list", params, false)
    },
    // 根据时间 科室 模糊查询 查询未签到和签到的预约信息
    async getOutpListBySelect(params) {
        return get("/appointment/outpAppt/getOutpListBySelect", params, true);
    },
    // 根据patientId 查询未签到和签到的预约信息
    async getApptList(params) {
        return get("/appointment/outpAppt/getApptByStatus", params, true);
    },

    // 签到 确认或取消
    async signIn(params) {
        return put("/appointment/outpAppt/updateSign", params, false)
    },
    // 分诊
    async apptTriage(params) {
        // return put("/appointment/outpAppt/apptTriage", params, false)
        return put("/outpAppt/appointTriage", params, false)
    },


    // 查询当前科室，诊疗类型号源情况
    async getCurrentOfficeInfo(params) {
        return get("/appointment/outpAppt/getApptNum", params);
    },

    // 查询科室列表及预约量
    async getOfficeOrderList(params) {
        return get('/appointment/outpAppt/getAllNum', params);
    },

    // 查询科室列表及预约总量和预约量
    async getOrderNumList(params) {
        return get('/appointment/doctorSchedule/getScheduleList', params);
    },

    // 得到某病区下医生
    async getDoctorListByDeptId(id) {
        return get(urlA + `/wadmin/dept-doctor/${id}`);
    },

    // 获取不同时段的预约数据
    async getCurrentDateList(data) {
        return get('/appointment/outpAppt/getApptNumByTime', data);
    },
    // 加号接口
    async getAddNum(data) {
        return put('/appointment/doctorSchedule/addNum', data);
    },
    // 近一月统计
    async getApptInfo(params) {
        return get('/appointment/outpAppt/apptInfo', params);
    },
    // 查询诊疗类型
    async getDiagTreatType(params) {
        return get('/appointment/diagTreatType/selectDiagTreatTypePO', params);
    },







    /* --------- 财务收费重构 接口 ------------*/
    // 门诊挂号费预结算
    async regPresettlement(params) {
        return await post("/finance-outp/outpSettlement/reg-presettlement", params, false, 130000);
    },
    // 门诊结算
    async settlementNew(params) {
        return await post("/finance-outp/outpSettlement/settlement2", params, false, 130000);
    },
    // 门诊预结算
    async preSettlementNew(params) {
        return await post("/finance-outp/outpSettlement/preSettlement2", params, false, 130000);
    },

    // 取消医生分诊
    async cancelChildAppt(params) {
        return post("/appointment/outpAppt/cancelChildAppt", params, true);
    },


    //获取医保疾病列表
    async getDiseaseDirectoryList(params) {
        return get("/finance-si/diseaseDirectory/getPageDiseaseDirectoryList", params, false);
    },
    //获取医疗类别，大病类别，特检类别，列表
    async getDictListBySiDictCatalogId(params) {
        return get("/finance-si/dict/getDictListBySiDictCatalogId", params, true);
    },
    // 获取患者医保信息
    async YBRegInfo(data) {
        return get('/finance-si/si-inp-one-stop-biz/reg-info', data)
    },
    // 医保住院登记-新建
    async postYBReg(data) {
        return post('/finance-si/si-inp-one-stop-biz/reg', data, false, 130000)
    },
    // 医保住院登记-修改
    async putYBReg(data) {
        return post('/finance-si/si-inp-one-stop-biz/reg-modify', data, false, 130000)
    },
    // 医保明细-查询
    async getFullTradeChargeDetailList(data) {
        return post('/finance-si/tradeChargeDetail/getFullTradeChargeDetailList', data, false, 130000)
    },
    // 打印用药标签
    async printLabelByRecipeId(data) {
        return get('/hmm-stock/recipe/printLabelByRecipeId/' + data, {}, false)
    },

};
// 查询已签到患者列表
export function getArrivedList(params) {
    console.log("=====request======");
    return post("/appointment/outpAppt/getOutpApptByRoomIds", params, true);
};
// 查询未签到患者列表
export function getNotArrivedList(params) {
    return post("/appointment/outpAppt/getNotArrivedOutpApptByRoomIds", params, true);
};