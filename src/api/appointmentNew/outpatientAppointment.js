import {
  post,
  get,
  put,
  del
} from '@/utils/request'

export default {
  //获取门诊部门列表
  async getDeptAndNum(params) {
    return await get("/appointment/doctorSchedule/getDeptAndNum", params, true);
  },
  //根据门诊部门查询排班列表
  async getScheduleByApptDept(params) {
    return await get("/appointment/doctorSchedule/getScheduleByApptDept", params, false);
  },
  //挂号记录查询 包含取消
  async getRegisteredList(params) {
    return await get("/appointment/outpAppt/getApptByTime", params, false);
  },
  //根据选中的排班查询挂号记录
  async getApptByScheduleId(params) {
    return await get("/appointment/outpAppt/getApptByScheduleId", params, false);
  },
  //创建预约信息
  async createAppt(params) {
    return await post("/appointment/outpAppt/createAppt", params, true);
  },
  //取消预约
  async appointCancel(params) {
    return await post("/appointment/outpAppt/appointCancel", params, true);
  },
  //分诊
  async appointTriage(params) {
    return await post("/appointment/outpAppt/appointTriage", params, true);
  },
  //换诊
  async appointChangeTriage(params) {
    return await post("/appointment/outpAppt/appointChangeTriage", params, true);
  },
  //根据日期 查询门诊部门及科室信息
  async getApptAndDeptByDate(params) {
    return await get("/appointment/doctorSchedule/getApptAndDeptByDate", params);
  },
  //根据日期 门诊部门 科室 查询诊疗类型
  async getDiagTreatTypeByParam(params) {
    return await get("/appointment/doctorSchedule/getDiagTreatTypeByParam", params);
  },
  //根据条件 查询排班信息 带号源信息
  async getScheduleByApptParam(params) {
    return await get("/appointment/doctorSchedule/getScheduleByApptParam", params, true);
  },
  // //排班
  // async getApptByScheduleId(params) {
  //   return await get("/appointment/outpAppt/getApptByScheduleId", params, true);
  // },
  
}