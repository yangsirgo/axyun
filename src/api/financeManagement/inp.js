import { post, get, put, del } from '@/utils/request'


export default {
    // 2020/11/4  new add   zhangbaoheng

    /*   预存账户退款  弹窗的 右侧接口   table list 接口*/
    async getOnlinePayRefundChannelDetailInfo(data) {
        return await post('/finance-inp/inpPrepay/getOnlinePayRefundChannelDetailInfo', data, false);
    },


    // 2020/11/4  new add zhangbaoheng


    // 获取住院患者信息明细
    async getInpPatientInfo(data) {
        return await post('/finance-inp/inp/getInpPatientInfo', data, false);
    },

    // 获取撤床患者信息明细
    async getDisChargePatientInfo(data) {
        return await post('/finance-inp/inpDischarge/listDischargeInfo', data, false);
    },

    // 家床财务-家床票据打印-左侧患者列表接口
    async getLeaveHosPatient(data) {
        return await get('/finance-inp/inpDischarge/getLeaveHosPatient', data, false);
    },
    async updateStatus(data) {
        return await put('/finance-inp/inp/update-status', data, false);
    },
    // 获取本院所有用户
    async getAllUser(data) {
        return await get('/finance-pub/dictionaryCatalog/getAllUserByHos', data, false);
    },

    // 查询支付方式 根据业务界面code  和 角色权限
    async getPayTypeByAuth(data) {
        return await get('/finance-pub/payType/getPayTypeByAuth', data, false);
    },

    // 预缴金充值
    async prepay(data) {
        return await post('/finance-inp/inpPrepay/prepay', data, false, 130000);
    },

    // 查询预缴金充值明细
    async getPrepayDetail(data) {
        return await get('/finance-inp/inpPrepay/detail/' + data.inpCode, false);
    },

    // 撤销预缴金充值
    async repealPrepay(data) {
        return await post('/finance-inp/inpPrepay/prepay/repeal/', data, true, 130000);
    },

    // 查询所有预缴金明细
    async getPrepayDetailtInfo(data) {
        return await post('/finance-inp/inpPrepay/getDetail', data, false);
    },
    // 根据条件查询住院医嘱项目收费明细表数据接口 带分页
    async getListPageInpOrderItemChargeDetail(data) {
        return await post('/finance-inp/inpOrderItemChargeDetail/listPageInpOrderItemChargeDetail', data, false);
    },
    // 根据条件查询住院医嘱项目收费明细表数据接口 不分页
    async getListInpOrderItemChargeDetail(data) {
        return await post('/finance-inp/inpOrderItemChargeDetail/listInpOrderItemChargeDetail', data, false);
    },
    // 根据条件查询住院收费项目收费明细表数据接口 带分页
    async getListPageInpChargeItemChargeDetail(data) {
        return await post('/finance-inp/inpChargeItemChargeDetail/listPageInpChargeItemChargeDetail', data, false);
    },
    // 根据条件查询住院收费项目收费明细表数据接口 不分页
    async getListInpChargeItemChargeDetail(data) {
        return await post('/finance-inp/inpChargeItemChargeDetail/listInpChargeItemChargeDetail', data, false);
    },
    // 根据条件查询出院患者列表数据接口 带分页
    async getAllInpPatientInfo(data) {
        return await post('/finance-inp/inp/getAllInpPatientInfo', data, false);
    }, // 根据条件查询出院患者列表数据接口 带分页
    async getAllInpPatientInfos(data) {
        return await post('/finance-inp/inp/getAllInpPatientInfos', data, false);
    }
}
