import {
  get
} from '@/utils/requestEmr'
export default {
  // 家床
  // 病历医嘱
  // 获取患者信息
  async getPatientInfo(params) {
    return await get('/advice/getInpMes', params, true);
  }
}
