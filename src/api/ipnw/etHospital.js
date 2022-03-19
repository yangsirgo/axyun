import {
    get,
    post,
    put,
    del
} from '@/utils/request'

const url = "/ipnw"; //url+
const urlA = '/common'
const urlB = '/resident'
const urlD = '/admin'
const urlE = '/outpatient'
    // 获取空床信息
export function fetchEmptyBedInfo(query) {
    return get(url + '/bedInfo/empty', query)
}

// 获取家床申请患者列表
export function fetchApplyPatientsList(query) {
    return get(urlA + "/applyRecord/getListByParam", query, false)
}

// 获取家床申请患者列表 new
export function getAdviceMesList(query) {
    return get(urlA + "/applyRecord/getApplyRecordList", query, false)
}
// 待登记请患者列表
export function getApplyRecordList(query) {
    return get(urlA + "/applyRecord/getApplyRecordList", query, false)
}
// 已登记患者列表
export function getInpPatientInfoCopy(query) {
    return get("/finance-inp/inp/getInpPatientInfo", query, false)
}

// 直接登记患者列表
export function getPatientArchInfo(query) {
    return post("/patient/archInfo/getPatientArchInfo", query, false)
}

// 获取某一患者家床申请详情
export function fetchPatientApplyDetail(id) {
    return get(urlA + `/applyRecord/${id}`, {}, false)
}

// 读卡获取患者接口
export function getCardReading(data) {
    return get(urlB + '/patient/cardReading', data, false);
}
export function getCardReadingPc(data) {
    return get(urlB + '/patient/cardReadingPc', data, false);
}

// 获取待家床患者列表
export function fetchPatientsList(query) {
    return get(urlB + '/patient/list', query, false)
}

// 获取科室医生或护士
export function fetchUserByDept(query) {
    return get(urlA + '/usercommon/getUserByDept', query, false)
}

// 分配床位
export function assingnBed(query) {
    return post(url + '/bedInfo/assingn', query, true)
}
//获取病历模板列表
export function getTemplateList(query) {
    return get(urlB + '/adviceFormwork/listTree', query, true)
}
//获取病历模板列表
export function queryId(query) {
    return post(urlB + '/adviceFormwork/judgeFormwork', query, true)
}

// 家床登记
export function admRegistration(query) {
    return post('/finance-inp/inp/fin-hos-reg', query, true)
}
// 建床申请历史
export function createBedHistoryList(query) {
    return get('/outpatient/fbapply/historyList', query, true)
}
// 建床申请提交
export function createBedSubmit(data) {
    return post('/outpatient/fbapply/submit', data, true)
}
// 根据家床申请id获取病患信息
export function getPatientInfo(query) {
    return get(urlA + '/applyRecord/' + query.id)
}

export function getBedInfList(data) {

    return get(url + "/bedInfo/list", data)
}

export function canBeUseDoctorAndNurseList(data) {
    return get(urlD + "/wadmin/hos-user", data, true);
}
//支持拼音简写，五笔简写版本
export function canBeUseDoctorAndNurseList2(data) {
    return post("/finance-pub/sys-info/user-info", data, false);
}
export function getApplyInfo(data) {
    return get("/outpatient/fbapply/info", data, true);
}
export function applyUpdateStatus(data) {
    return put("/outpatient/fbapply/updateStatus", data, true);
}
export function putApplySave(data) {
    // return post("/outpatient/apply/save", data, true);
    return put("/outpatient/fbapply/saveApply", data, true);
}


export function doctorList(data) {

    return get(urlD + "/wadmin/dept-doctor/" + data, {});
}

export function nurseList(data) {
    return get(urlD + "/wadmin/dept-nurse/" + data, {});
}

export function bedList(data) {
    return post("/ipnws/bedinfo/getList", data, {});
}
// 家床预交金充值
export function payMent(data) {
    return post('/finance-inp/inp/finInp/prepay', data)
}

export function rotating(data) {
    return post(url + "/bedInfo/rotating", data, true);
}

//根据科室获取医生列表
export function getDeptDoctorList(data) {
    return get(urlD + '/wadmin/dept-doctor/' + data)
}

// 根据住院号（inpCode）查询已住院病人信息
export function getInpPatientInfo(data) {
    return get('/finance-inp/inp/patient/' + data)
}


//获取今日家床登记人列表
export function getAdmitRegistrState(query) {
    return get('/finance-inp/inp/inpAccount', query, true)
}

//获取床位，护理级别个数
export function getCount(query) {
    return get(url + '/bedInfo/getCount', query, true)
}

//转科转区查询患者
export function getApplyDeptWardMes(query) {
    return get(url + '/applyDeptWard/getApplyDeptWardMesByStatus', query, true)
}

//撤销转科转区
export function cancelApplyDeptWard(query) {
    return post(url + '/applyDeptWard/cancelApplyDeptWard', query, true)
}

//撤销转科转区
export function getResidentPendingInfo(query) {
    return post(urlE + '/resident/getResidentPendingInfo', query)
}

//撤销转科转区
export function getResidentPersionInfo(query) {
    return post(urlE + '/resident/getResidentPersionInfo', query)
}

//撤销转科转区
export function homeBedApplyApprove(query) {
    return post(urlE + '/resident/homeBedApplyApprove', query)
}

//撤销转科转区
export function refuseHistorySubmit(query) {
    return post(urlE + '/resident/refuseHistorySubmit', query)
}


