import {
  post,
  get,
  put,
  del
} from '@/utils/request'

export default{
  // 查询排班列表
  async getScheduleByStation(params) {
    return await get("/appointment/doctorSchedule/getScheduleByStation", params, true);
  },
  // 根据排班查询队列列表
  async getApptQueueByScheduleget(params) {
    return await get("/appointment/outpAppt/getApptQueueBySchedule", params, true);
  },
  // 临时停诊
  async stopScheduleAtTime(params) {
    return await post("/appointment/doctorSchedule/stopScheduleAtTime", params, true);
  },
  // 开诊
  async openScheduleAtTime(params) {
    return await post("/appointment/doctorSchedule/openScheduleAtTime", params, true);
  },
  // 签到
  async apptSign(params) {
    return await post("/appointment/outpAppt/apptSign", params, true);
  },
  // 获取待签到列表
  async getApptByAppt(params) {
    return await get("/appointment/outpAppt/getApptByAppt", params, true);
  },
  // 过号恢复
  async recoverAppt(params) {
    return await post("/appointment/outpAppt/recoverAppt", params, true);
  },
  // 确认分诊
  async appointChangeTriage(params) {
    return await post("/appointment/outpAppt/appointChangeTriage", params, true);
  },
  // 优先就诊
  async jumpQueue(params) {
    return await post("/appointment/outpAppt/jumpQueue", params, true);
  },
  // 查询可回诊患者列表
  async getRediagAppt(params) {
    return await get("/appointment/outpAppt/getRediagAppt", params, true);
  },
  // 查询可回诊的班次
  async getReDiagSchedule(params) {
    return await get("/appointment/doctorSchedule/getReDiagSchedule", params, true);
  },
  // 确认回诊
  async rediagAppt(params) {
    return await post("/appointment/outpAppt/rediagAppt", params, true);
  }
}