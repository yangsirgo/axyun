import {
    get,
    post,
    put,
    del
} from '@/utils/request'

//查询打印/未打印发票
export function getLeftTableData(data) {
    return post('/finance-inp/inpDischarge/select-inpdischarge-Receipt', data)
}

//发票打印
export function receiptPrint(data) {
    return post('/finance-inp/inp-receipt/receipt-print', data)
}

//获取发票内容
export function getReceiptContent(data) {
    return get('/finance-inp/inp-receipt/receipt-content/' + data.receiptNum)
}

//票据补打
export function reReceiptPrint(data) {
    return post('/finance-inp/inp-receipt/re-receipt-print', data)
}

//获取支付方式列表
export function getPayTypeByAuth(data) {
    return get('/finance-pub/payType/getPayTypeByAuth', data)
}