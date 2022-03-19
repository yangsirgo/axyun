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
    async personEnjoyCheck(params) {
        return await post("/finance-si/si02/trtinfo/person_enjoy_check", params, true);
    },
}