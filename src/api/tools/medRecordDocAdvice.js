import {
  post,
  get,
  put,
  del
} from '@/utils/request'
const url = "/ipnw";//url+
export default {
  // 家床
  // 病历医嘱
  // 获取患者信息
  async getPatientInfo(params) {
    return await get(url+'/advice/getInpMes', params, true);
  }
}
