import {
  post,
  get,
  put,
  del
} from '@/utils/request'
const urlD = '/admin'
export default {
  // 保存排班列表
  async saveScheduleList(params) {
    return await post("/appointment/doctorSchedule/saveByList", params);
  },
  // 删除排班列表
  async delScheduleById(params) {
    return await del("/appointment/doctorSchedule/delScheduleById/" + params);
  },
  // 查询排班列表
  async getScheduleList(params) {
    return await get("/appointment/doctorSchedule/list", params, true);
  },
  // 发布排班列表
  async releaseScheduleList(params) {
    return await put("/appointment/doctorSchedule/updateByList", params);
  },
  // 根据科室ID查询其下的医生
  async getDeptDoctorList(id) {
    return await get(`/wadmin/dept-doctor/${id}`);
  },
  async getAllRoomsList(data) {
    return await get("/appointment/doctorSchedule/getRoom", data)
  },
  //  新增诊区列表
  async insertRoomStation(data) {
    return await post("/appointment/roomStation/insertRoomStation", data)
  },
  //  查询诊区列表
  async selectRoomStation(data) {
    return await get("/appointment/roomStation/selectRoomStation", data)
  },
  //  删除诊区列表
  async deleteRoomStation(data) {
    return await del("/appointment/roomStation/deleteRoomStation/" + data.id)
  },
  //  修改诊区列表
  async updateRoomStation(data) {
    return await put("/appointment/roomStation/updateRoomStation", data)
  },
  //  获取班次列表
  async getCalss(data) {
    return await get("/appointment/class/selectCalss", data)
  },
  //  新增班次
  async addCalss(data) {
    return await post("/appointment/class/addCalss", data)
  },
  //  更新班次
  async updateCalss(data) {
    return await put("/appointment/class/updateCalss", data)
  },
  //  删除班次
  async delCalss(data) {
    return await del("/appointment/class/delCalss/" + data)
  },
  //  查询号源列表
  async getCalssNum(data) {
    return await get("/appointment/num/selectNumPO", data)
  },
  //  新增班次号源
  async addCalssNum(data) {
    return await post("/appointment/num/addNumPO", data)
  },
  //  修改班次号源
  async updateNum(data) {
    return await put("/appointment/num/updateNumPO", data)
  },
  //  删除班次号源
  async delNum(data) {
    return await del("/appointment/num/delNumPO/" + data)
  },
  //  查询渠道
  async getSelectNumPercentageDict(data) {
    return await get("/appointment/numPercentageDict/selectNumPercentageDict", data)
  },
  //  新增渠道
  async addNumPercentageDict(data) {
    return await post("/appointment/numPercentageDict/addNumPercentageDict", data)
  },
  //  修改渠道
  async updateNumPercentageDict(data) {
    return await put("/appointment/numPercentageDict/updateNumPercentageDict", data)
  },
  //  删除渠道
  async delNumPercentageDict(data) {
    return await del("/appointment/numPercentageDict/delNumPercentageDict/" + data)
  },
  //  查询诊疗类型
  async getDiagTreatType(data) {
    return await get("/appointment/diagTreatType/selectDiagTreatTypePO", data)
  },
  //  新增诊疗类型
  async addDiagTreatTypePO(data) {
    return await post("/appointment/diagTreatType/addDiagTreatTypePO", data)
  },
  //  更新诊疗类型
  async updateDiagTreatTypePO(data) {
    return await put("/appointment/diagTreatType/updateDiagTreatTypePO", data)
  },
  //  删除诊疗类型
  async delDiagTreatTypePO(data) {
    return await del("/appointment/diagTreatType/delDiagTreatTypePO/" + data)
  },
  //  查询排班数据
  async getScheduleAndPercentage(data) {
    return await get("/appointment/doctorSchedule/getScheduleAndPercentage", data)
  },
  //  查询排班数据带分页
  async getScheduleByPage(data) {
    return await get("/appointment/doctorSchedule/getScheduleByPage", data)
  },

  //  查询排班数据--父子两级结构
  async getScheduleAndSon(data) {
    return await get("/appointment/doctorSchedule/getScheduleAndSon", data)
  },
  //  新增排班数据
  async addScheduleAndPercentage(data) {
    return await post("/appointment/doctorSchedule/addScheduleAndPercentage", data)
  },
  //  更新排班数据
  async updateScheduleAndPercentage(data) {
    return await put("/appointment/doctorSchedule/saveOrUpdateScheduleAndPercentage", data)
  },
  //   根据诊疗类型code 查询所有渠道比例
  async getNumPercentage(data) {
    return await get("/appointment/numPercentage/getNumPercentage", data)
  },
  //   根据班次查询开诊时间结束时间
  async getTimeByclassId(data) {
    return await get("/appointment/class/" + data.classId)
  },
  //  根据班次与诊疗类型查询号源数
  async getNumByclassIdTypeCode(data) {
    return await get("/appointment/num/selectNumPO", data)
  },
  //  新增或者更新排班
  async saveSchheduling(data) {
    return await post("/appointment/doctorSchedule/saveOrUpdateScheduleAndPercentage", data)
  },
  //  新增或者更新排班(支持父子两级)
  async AddScheduleAndPercentage(data) {
    return await post("/appointment/doctorSchedule/AddScheduleAndPercentage", data)
  },
  //  清空本周排班
  async removeSchheduling(data) {
    return await del("/appointment/doctorSchedule/deleteScheduleAndPercentage", data)
  },
  //  发布本周排班
  async releaseSchheduling(data) {
    return await put("/appointment/doctorSchedule/releaseScheduleAndPercentage", data)
  },
  // 发布排班 新 （生成预约信息）
  async releaseScheduleNew(data) {
    return await post("/appointment/doctorSchedule/releaseScheduleNew", data)
  },
  // 排班  停诊
  async stopSchedule(data) {
    return await post("/appointment/doctorSchedule/stopSchedule", data)
  },
  //  发布为模板
  async saveSchhedulingTemp(data) {
    return await post("/appointment/scheduleTemplate/addScheduleTemplate", data)
  },
  //  查询排班模板
  async getScheduleTemplate(data) {
    return await get("/appointment/scheduleTemplate/getScheduleTemplate", data)
  },
  //  引用排版模板
  async getScheDetail(data) {
    return await get("/appointment/scheduleTemplate/getScheduleTemplateAndDetail", data)
  },
  //  删除排版模板
  async deleteSche(data) {
    return await del("/appointment/scheduleTemplate/delScheduleTemplateAndDetail/" + data.templateId)
  },
  //  修改排版模板
  async updateSche(data) {
    return await put("/appointment/scheduleTemplate/updateScheduleTemplateAndDetail", data)
  },
  //  查询发布排班
  async selectScheduleByStatus(data) {
    return await get("/appointment/doctorSchedule/selectScheduleByStatus", data)
  },
  //  查询排班模板明细
  async selectScheduleDetail(data) {
    return await get("/appointment/scheduleTemplateDetail/getScheduleTemplateDetail", data)
  },
  //发布所有科室
  async releaseAllSchedule(data) {
    return await get("/appointment/doctorSchedule/releaseAllSchedule", data)
  },
  // 加号
  async addNum(data) {
    return await post("/appointment/doctorSchedule/addNum", data)
  },
  // 查询排班科室
  async queryDept(data) {
    return await get("/appointment/doctorSchedule/getDept", data)
  },
  // 查询所属诊区recordStatus=1&deletedStatus=0
  async selAreaList(data) {
    return await get("/appointment/area/selAreaList", data)
  },
  // 所属分诊站 ?recordStatus=1&deletedStatus=0
  async selStationPOList(data) {
    return await get("/appointment/station/selStationPOList", data)
  },
  // 根据id集合更新排班状态
  async updateScheduleByIds(data) {
    return await put("/appointment/doctorSchedule/updateScheduleByIds", data)
  },
  // 班次列表
  async selectCalss(data) {
    return await get("/appointment/class/selectCalss", data)
  },
  // 诊疗类型列表
  async selectDiagTreatTypePO(data) {
    return await get("/appointment/diagTreatType/selectDiagTreatTypePO", data)
  },
  //lhd
  // 根据模板名称查询模板列表
  async selectTemplateNew(data) {
    return await get("/appointment/scheduleTemplate/selectTemplateNew", data)
  },
  // 根据模板id查询模板明细
  async getScheduleTemplateDetailNew(data) {
    return await get("/appointment/scheduleTemplateDetail/getScheduleTemplateDetailNew", data)
  },
  // 模板明细保存
  async saveScheduleTemplateDetail(data) {
    return await post("/appointment/scheduleTemplateDetail/saveScheduleTemplateDetail", data)
  },
  // 新增模板
  async addTemplateNew(data) {
    return await post("/appointment/scheduleTemplate/addTemplateNew", data)
  },
  // 修改模板
  async updateTemplateNew(data) {
    return await put("/appointment/scheduleTemplate/updateTemplateNew", data)
  },
  // 删除模板
  async delTemplateNew(data) {
    return await del("/appointment/scheduleTemplate/delTemplateNew/"+data.templateId)
  },
  // 排班维护新版保存接口
  async saveScheduleNew(data) {
    return await post("/appointment/doctorSchedule/saveScheduleNew", data)
  },
  // 加号接口
  // async addNum(data) {
  //   return await post("/appointment/doctorSchedule/addNum", data)
  // },
  /* 诊区 */
  // 诊区查询
  getAreaList(data) {
    return get("/appointment/area/getAreaList", data)
  },
  // 新增诊区
  addArea(data) {
    return post("/appointment/area/addArea", data)
  },
  // 修改诊区
  updateArea(data) {
    return put("/appointment/area/updateArea", data)
  },
  // 删除诊区
  delArea(data) {
    return del("/appointment/area/delArea/" + data)
  },
  /* 分诊站 */
  // 分诊站查询
  getStationList(data) {
    return get("/appointment/station/getStationPOList", data)
  },
  // 新增分诊站
  addStation(data) {
    return post("/appointment/station/addStationPO", data)
  },
  // 修改分诊站
  updateStation(data) {
    return put("/appointment/station/updateStationPO", data)
  },
  // 删除分诊站
  delStation(data) {
    return del("/appointment/station/delStationPO/" + data)
  },
  /* 诊室 */
  // 诊室查询
  getRoomList(data) {
    return get("/appointment/room/getRoomPOList", data)
  },
  // 新增诊室
  addRoom(data) {
    return post("/appointment/room/addRoomPO", data)
  },
  // 修改诊室
  updateRoom(data) {
    return put("/appointment/room/updateRoomPO", data)
  },
  // 删除诊室
  delRoom(data) {
    return del("/appointment/room/delRoomPO/" + data)
  },
  // 查询科室
  selectDeptByName(data){
    return get(urlD+"/wadmin/hos/dept/", data)
  },
  // 预约号处理右侧查询部分
  getScheduleByApptParam(data){
    return get("/appointment/doctorSchedule/getScheduleByApptParam", data)
  },
  // 查询左侧列表的接口
  selectApptList(data){
    return get("/appointment/outpAppt/params", data)
    },
    // 查询医生列表的接口
    getDoctorInfo(data){
      return get("/appointment/doctorSchedule/getDoctorInfo", data)
      },
  //保存重新预约的
  reApptSchedule(data) {
    return post("/appointment/doctorSchedule/reApptSchedule", data)
  },
};
