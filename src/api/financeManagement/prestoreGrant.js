import {
  post,
  get,
  put,
  del
} from '@/utils/request'


export default {

  // 获取授权明细
  async getPrestoreGrantOverdrawPOs(data) {
    return await get('/finance-outp/prestoreGrantOverdraw/getPrestoreGrantOverdrawPOs', data, false);
  },

  // 撤销授权
  async recycleGrant(data) {
    return await post('/finance-outp/prestoreGrantOverdraw/recycleGrant', data, false);
  },

  // 申请
  async apply(data) {
    return await post('/finance-outp/prestoreGrantOverdraw/apply', data, false);
  },

  // 授权
  async applyPass(data) {
    return await post('/finance-outp/prestoreGrantOverdraw/applyPass', data, false);
  },

  // 查询账户信息
  async getPatientPrestore(data) {
    return await get('/finance-outp/prestoreAccount/account/' + data.patientId, false);
  },

  // 获取验证码
  async getMsgValidCode(data){
    return await get('/finance-outp/prestoreGrantOverdraw/getMsgValidCode',data, false);
  },


  /// 家床 授权透支
  // 查询家床患者信息
  async getInpInfo(data) {
    return await get('/finance-inp/inp/getInpInfo/', data, false);
  },
  // 查询出院患者信息
  async getInpOutInfo(data) {
    return await get('/finance-inp/inpDischarge/getLeaveHosPatient/', data, false);
  },
  // 根据床位号查询家床患者信息
  async getInpPatientByBed(data) {
    return await get('/finance-inp/inp/getInpPatientByBed/', data, false);
  },
  // 查询家床授权透支明细
  async inpGrant(data) {
    return await get('/finance-inp/inpGrantOverdraw/inpGrant/', data, false);
  },
  // 新增家床授权透支明细
  async addInpGrant(data) {
    return await post('/finance-inp/inpGrantOverdraw/inpGrantPass/', data, false);
  },
  // 撤销家床授权透支明细
  async cancalGrant(data) {
    return await post('/finance-inp/inpGrantOverdraw/cancalGrant/', data, false);
  },
  async getFrequencyList(params) { // 挂号费用明细查询
    return await post("/finance-outp/regDetail/list-by-params", params);
  },
  async getDept(params) { // 科室列表
    return await get("/appointment/doctorSchedule/getDept", params);
  },
  async selectDiagTreatTypePO(params) { // 挂号类型列表
    return await get("/appointment/diagTreatType/selectDiagTreatTypePO", params);
  },
  async queryUsers(params) { // 获取用户列表
    return await get("/admin/user/page", params);
  }
}
