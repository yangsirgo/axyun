import {
    post,
    get,
    put,
    del
} from '@/utils/request'

const url = '/common'
const urlB = '/patient'
    // 提交家床申请
export function submitForm(data) {
    return post(url + '/applyRecord/add', data, true);
}

// 获取主诊断
export function diaInfo(data) {
    return get(url + '/patDiag/getDiaByPatientCode', data, false);
}

// 历史申请
export function getHistoryTable(data) {
    /* return get('/applyRecord/page', data, false); */
    return get(url + '/applyRecord/getListByParam', data, false);
}

// 获取患者全部信息
export function getPatintInfo(data) {
    return get(urlB + '/archive/' + data);
}

// 根据病区id查询床位 wardCode(病区或者科室id)
export function queryBed(data) {
    return get('/ipnw/bedInfo/empty', data);
}

// 根基病患id获取申请信息
export function queryApplyInfo(data) {
    return get(url + '/applyRecord/getRecord', data)
}

// 获取患者的住址信息
export function getPatientAddress(data) {
    return get(url + '/applyRecord/getPatientAddrByPatientId', data)
}



// 医保取消住院登记
export function YBCancelReg(data) {
    return post('/finance-si/si-inp-one-stop-biz/cancel-reg', data, false, 130000)
}