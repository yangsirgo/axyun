import {
    get,
    post,
    put,
    del
} from '@/utils/request'

const url = "/ipnw";//url+
const urlA = '/common'

/*
 *   *************  医嘱审核  *******************
 * */
// 医嘱列表
export function queryListAdvice(query) {
    return get(urlA+'/residentAdvice/queryNurseListAdvice', query, false)
}
export function queryListAdviceYzsh(query) {
    return get(urlA+'/residentAdvice/queryNurseListAdviceYzsh', query, false)
}
export function querySelectAdvName(query) {
    return get("/finance-inp/inp/chargeItems", query, false)
}
// 退回医嘱(暂时通用)
export function recallAdvice(query) {
    return post(url+'/advice/rejectAdvice', query, false)
}
// 审核医嘱
export function adviceExamine(data) {
    return post(url+'/advice/approveAdvice', data, false)
}

/*
 *   *************  医嘱编辑  *******************
 * */

// 医嘱列表
export function fetchAdviceList(data) {
    return get(url+"/advice/getAdviceList", data, false)
}
// 选定名称之后查询项目
export function fetchAdvDetailItem(data) {
    return get("/finance-inp/inp/subChargeItems", data, false)
}
// 新增医嘱
export function addAdvice(data) {
    return post(url+"/advice/addAdvice", data, false)
}
// 点击医嘱查看详情
export function fetchAdvDetail(data) {
    return get(url+"/adviceExtraItem/getAdviceExtraitemList", data, false)
}

// 提交/删除 医嘱
export function upDataAdvice(data) {
    return put(url+"/advice/updateStatus", data, false)
}

/*
 *   **************  医嘱执行  *******************
 * */
// 皮试执行 医嘱列表
export function skinTestList(data) {
    return post(url+"/advice/skinTestList", data, false)
}
// 皮试执行 医嘱列表 新
export function skinTestList2(data) {
    return get(urlA+"/skinInfo/getSkinInfoList", data, false)
}
// 输液执行 医嘱列表
export function infusionList(data) {
    return post(url+"/advice/infusionList", data, false)
}
// 肌注执行 医嘱列表
export function injectionList(data) {
    return post(url+"/advice/injectionList", data, false)
}
// 费用执行 医嘱列表
export function drugList(data) {
    return post(url+"/advice/drugList", data, false)
}

// 费用执行 待执行医嘱数量
export function stayAdviceCount(data) {
    return post(url+"/advice/getAdviceCountByInpcode", data, false)
}

// 费用执行 执行医嘱
export function executeAdvice(data) {
    return post(url+"/advice/execAdvice", data, false)
}

// 皮试执行 审核医嘱

// 皮试执行 退回医嘱

// 皮试执行 执行皮试
export function executeTest(data) {
    return post(urlA+"/allergyPatientInfo/executeTest", data, false)
}
// 皮试执行 执行皮试 新
export function executeTest2(data) {
    return post(urlA+"/skinInfo/executeSkinTest", data, false)
}
// 皮试执行 保存皮试结果
export function saveTestRes(data) {
    return put(urlA+"/allergyPatientInfo/updateTestResult", data, false)
}
// 皮试执行 保存皮试结果 新
export function saveTestRes2(data) {
    return post(urlA+"/skinInfo/updateSkinInfoResult", data, false)
}
// 皮试执行 审核皮试结果



/*
 *   **************  转科转床  *******************
 * */

// 家床记录
export function turnApply(data) {
    return get(url+"/turnApply", data, false);
}
//获取对应病区下的空床位
export function emptyBed(data) {
    return get(url+"/bedInfo/empty", data, false);
}
// 转科记录

// 转床记录
export function changeBed(data) {
    return post(url+"/turnApply/transferBed", data, false)
}

// 转床
export function bedChange(data) {
    return post(url+"/bedInfo/rotating", data, false)
}
// 转科
export function changeDept(data) {
    return post(url+"/applyDeptWard/addApplyDeptWard", data, false)
}
// 住院轨迹
export function getLogRecordList(data) {
    return get(url+"/logRecord/getLogRecordList", data, false)
}

/*
 *   **************  用药申请  *******************
 * */

// 申请列表
export function fetchApplyDrugList(data) {
    return post(url+"/advice/getDrugRequestList", data, false)
}
// 药房列表
export function fetchDrugStorage(data) {
    return get("/hmm-stock/drgstrg/listForDropDown/1", data, false)
}
// 待申领药品
export function requestDrug(data) {
    return post(url+"/advice/requestDrug", data, false)
}
// 取消申领

//已申领药品
export function getHistoryDrugRequestList(data) {
    return post(url+"/advice/getHistoryDrugRequestList", data, false)
}

/*
 *   **************  交接班  *******************
 * */

//  查询新家床登记，出院人数等及交接班信息接口
export function fetchShiftsMessage(query) {
    return get(url+"/reliefRecord/getFinInpRelief", query, false)
}
//  查询某一班次交接班详情接口
export function fetchShiftsDetail(query) {
    return get(url+"/reliefRecordDetail/getRelieRecordDetail", query, false)
}
//  根据类型查询住院患者信息接口
export function fetchPatientMessage(query) {
    return get(url+"/reliefRecordDetail/getInpByStatus", query, false)
}
//  住院交班接口
export function handOverShifts(data) {
    return post(url+"/reliefRecord/addReliefRec", data, false)
}
//  住院接班接口
export function succession(data) {
    return post(url+"/reliefRecord/addReliefUpd", data, false)
}
//  添加模板接口
export function addTemp(data) {
    return post(url+"reliefTemplate/addTemp", data, false)
}
