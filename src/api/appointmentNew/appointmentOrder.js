import {
  post,
  get,
  put,
  del
} from '@/utils/request'
const url = '/patient'
export default {
  //获取门诊部门与门诊部门排班数据
  async getDeptAndNum(params) {
    return await get("/appointment/doctorSchedule/getDeptAndSchedule", params,false);
  },
  //取消预约appointmentOrder
  async appointConfirm(params) {
    return await post("/appointment/outpAppt/createApptNoArch", params,false);
  },
  //获取患者档案
  async patientListByExample(params) {
    return await get(url+"/archInfo/patientListByExample", params,false);
  },
  //获取替换信息
  async updateApptNoArch(params) {
    return await get("/appointment/outpAppt/updateApptNoArch", params,false);
  }
}