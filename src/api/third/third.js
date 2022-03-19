import { post, get, put, del } from '@/utils/request'
import { check_IP } from "axcommon/src/utils/util";

const url = '/third'
const thirdUrl = 'https://lhysk.medcaastest.city.pingan.com/phos/publicHealth'

export async function getThirdUrl() {
  let res = await getThirdUrls();
  return Promise.resolve(res);
}
// 公卫url baseInfo  new 2021-8-16
export function getFrameUrlNew(data, loading = false) {
  return post(url + '/publicHealth/getFrameUrl/1', data, loading)
}

// 公卫url查询
export function getThirdUrls(loading = false) {
  return get(url + '/dictionary/getSysConfigValue', {sysConfigCode: "GW002"}, loading)
}
export function getThirdUrlsOld() {
  let urlIp = process.env.NODE_ENV;
  let flag = urlIp === 'production' ? '1' :
            urlIp === 'development' ? '2' :
            check_IP() ? '3' : '4' ;//ip3 域名4
  
  return get(url + '/publicHealth/getUrl/' + flag)
}

// 公卫人群标志
export function getGroupFlag(data, loading = false) {
  return post(url + '/publicHealth/groupFlag', data, loading)
}

// 档案信息同步
export function getBaseSync(data, loading = false) {
  return post(url + '/publicHealth/baseSync', data, loading)
}

// 患者待提醒信息
export function getListAlert(data, loading = false) {
  return post(url + '/publicHealth/listAlert', data, loading)
}

// 患者既往史
export function getListHistory(data, loading = false) {
  return post(url + '/publicHealth/listHistory', data, loading)
}

// （医生站）查询患者本次就诊费别
export function getPatientSettleByEmrNum(data, loading = false) {
  return post('/finance-outp/outpSettlement/reg-info', data, loading)
}

