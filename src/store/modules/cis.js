import { set_param } from "@/utils/util.js";

const state = {
  count: 0,
  receivePatientData: {}, //患者ID字段patient_num    住院号 (没有)   visitId 门诊号 triageAppointmentId
  patientNum: "",
  RpTableData: [], //新增处方 vuex 存储
  multipleSelections: [],//处方模板
  currentRow: {},//处方中当前所选的 row
  // newRpNo : ''//新增处方  的 no
  commonWestDrugData: {},// 工具箱 西药常用药 对象
  commonChnDrugData: {},// 工具箱 中药常用药 对象
  commonNonDrugData: {},// 工具箱 治疗医嘱常用药 对象
  reloadKey: '', // 左下侧列表 监听的 key 值，变动会刷新 （顶部card 有结束诊断 ，成功后刷新左下侧列表）
  leaveAppLoadKey: '', // 病假条保存成功后刷新 右侧工具箱 保存模板后刷新右侧工具箱
  activeTabName: 'first', //门急诊 左下侧 患者列表切换tabs 的 tabsName；保存用户操作
  psRegorActiveTabName: 'adviceTable',//电子处方切换tabs 的 tabsName  三个标签：adviceTable， chmMedicine， treatMedicine
  chargeData: {}, // 选择退费已申请后，数据同步 右侧清单,
  diaName: {},
  additionalOrderLoadKey: "",//电子处方 医嘱开立 提交 删除 触发附加医嘱更新数据
  templateQuoteKey: "",//电子处方 治疗医嘱开立 引用模板更新数据
  chmMedicineQuote: [],//中草药处方引用数据
  changeTabsShowQuote: '',// 切换为诊断tab时，要更新右侧工具箱诊断模板的"引用"按钮显示出来
  diagnosis: {},// 诊断信息
  visitType: 'menzhen',// 就诊方式 是门诊还是住院
  docTypeCode: '',// 当前展示文书信息
  recallRecord: false,// 是否撤销了文书
  // dispTreatmentActiveTab:"skinTestExecution"//处置治疗 当前选中的 tabs 名称
  // cisPageData:{
  //   toPageName:"",
  //   pageParams:{}
  // }//电子处方下 tabs view 页签跳转 传值参数
  publicHealthData: {},
  chmDispgMethCode: ""// 中草药配送方式
};

const mutations = {
  // CISPAGEDATA_SETTING: (state, dataObj) => {
  //   state.cisPageData = dataObj;
  // },
  // CHANGETREATMENTACTIVETAB_SETTING: (state, dataObj) => {
  //   state.dispTreatmentActiveTab = dataObj;
  // },
  CHANGCHMDISPGMETHCODE_SETTING: (state, dataObj) => {
    state.chmDispgMethCode = dataObj;
  },
  CHANGETABSSHOWQUOTE_SETTING: (state, dataObj) => {
    state.changeTabsShowQuote = dataObj;
  },
  CHMMEDICINEQUOTE_SETTING: (state, dataObj) => {
    state.chmMedicineQuote = dataObj;
  },
  RECEPTIONIST_SETTING: (state, dataObj) => {
    state.receivePatientData = dataObj;
  },

  PATIENTNUM_SETTING: (state, dataObj) => {
    state.receivePatientData = dataObj;
  },
  RPTABLEDATA_SETTING: (state, dataObj) => {
    state.RpTableData = dataObj;
  },
  SET_COUNT: (state, count) => {
    state.count = count;
  },
  SET_ADDITIONALORDERLOADKEY: (state, data) => {
    state.additionalOrderLoadKey = data;
  },
  SET_MULTIPLE_SELECTIONS: (state, data) => {
    state.multipleSelections = data;
  },
  SET_RELOADKEY: (state, data) => {
    state.reloadKey = data;
  },
  SET_LEAVEAPPLOADKEY: (state, data) => {
    state.leaveAppLoadKey = data;
  },
  SET_CURRENTROW: (state, data) => {
    state.currentRow = data;
  },
  SET_COMMONDRUGROW: (state, data) => {
    state.commonWestDrugData = data;
  },
  SET_COMMONCHNDRUGROW: (state, data) => {
    state.commonChnDrugData = data;
  },
  SET_COMMONNONDRUGROW: (state, data) => {
    state.commonNonDrugData = data;
  },
  SET_CHARGEDATA: (state, data) => {
    state.chargeData = data;
  },
  SET_ACTIVETABNAME: (state, data) => {
    state.activeTabName = data;
  },
  SET_PSREGORACTIVETABNAME: (state, data) => {
    state.psRegorActiveTabName = data;
  },
  SET_DIANAME: (state, data) => {
    state.diaName = data;
  },
  SET_TEMPLATEQUOTEKEY: (state, data) => {
    state.templateQuoteKey = data;
  },
  SET_DIAGNOSIS: (state, data) => {
    state.diagnosis = data;
  },
  SET_VISITTYPE: (state, data) => {
    state.visitType = data;
  },
  SET_DOCTYPECODE: (state, data) => {
    state.docTypeCode = data
  },
  set_RECALLRECORD: (state, data) => {
    state.recallRecord = data
  },
  PUBLICHEALTH_SETTING: (state, dataObj) => {
    state.publicHealthData = dataObj;
  }
};

const actions = {
  // changeCisPageData({ commit }, data) {
  //   commit("CISPAGEDATA_SETTING", data);
  // },
  // changeTreatmentActiveTab({ commit }, data) {
  //   commit("CHANGETREATMENTACTIVETAB_SETTING", data);
  // },
  changeChmDispgMethCode({ commit }, data) {
    commit("CHANGCHMDISPGMETHCODE_SETTING", data);
  },
  changeChangeTabsShowQuote({ commit }, data) {
    commit("CHANGETABSSHOWQUOTE_SETTING", data);
  },
  changeChmMedicineQuote({ commit }, data) {
    commit("CHMMEDICINEQUOTE_SETTING", data);
  },
  changeRecPatientData({ commit }, data) {
    commit("RECEPTIONIST_SETTING", data);
    //设置url 中的参数信息
    // set_param  ('item',data.patientNum);
  },
  changeAdditionalOrderLoadKey({ commit }, data) {
    commit("SET_ADDITIONALORDERLOADKEY", data);
  },
  changeTemplateQuoteKey({ commit }, data) {
    commit("SET_TEMPLATEQUOTEKEY", data);
  },
  changePatientNumData({ commit }, data) {
    commit("PATIENTNUM_SETTING", data);
  },
  changeCurrentRow({ commit }, data) {
    commit("SET_CURRENTROW", data);
  },
  changeChnCommonDrug({ commit }, data) {
    commit("SET_COMMONCHNDRUGROW", data);
  },
  changeNonCommonDrug({ commit }, data) {
    commit("SET_COMMONNONDRUGROW", data);
  },
  changeWestCommonDrug({ commit }, data) {
    commit("SET_COMMONDRUGROW", data);
  },
  changeRpTableData({ commit }, data) {
    commit("RPTABLEDATA_SETTING", data);
  },
  testCount({ commit }, count) {
    commit("SET_COUNT", count);
  },
  setMultipleSelections({ commit }, data) {
    commit("SET_MULTIPLE_SELECTIONS", data);
  },
  setReloadKey({ commit }, data) {
    commit("SET_RELOADKEY", data);
  },
  setLeaveAppLoadKey({ commit }, data) {
    commit("SET_LEAVEAPPLOADKEY", data);
  },
  setChargeData({ commit }, data) {
    commit("SET_CHARGEDATA", data);
  },
  setActiveTabName({ commit }, data) {
    commit("SET_ACTIVETABNAME", data);
  },
  setPsRegorActiveTabName({ commit }, data) {
    commit("SET_PSREGORACTIVETABNAME", data);
  },
  setDiaName({ commit }, data) {
    commit("SET_DIANAME", data);
  },
  setDiagnosis({ commit }, data) {
    commit('SET_DIAGNOSIS', data)
  },
  setVisitType({ commit }, data) {
    commit('SET_VISITTYPE', data);
  },
  setDocTypeCode({ commit }, data) {
    commit('SET_DOCTYPECODE', data)
  },
  setRecallRecord({ commit }, data) {
    commit('set_RECALLRECORD', data)
  },
  changePublicHealthData({ commit }, data) {
    commit("PUBLICHEALTH_SETTING", data);
  },

};

const getters = {
  // cisPageData: state => state.cisPageData,
  chmDispgMethCode: state => state.chmDispgMethCode,
  changeTabsShowQuote: state => state.changeTabsShowQuote,
  // dispTreatmentActiveTab: state => state.dispTreatmentActiveTab,
  receivePatientData: state => state.receivePatientData,
  chmMedicineQuote: state => state.chmMedicineQuote,
  additionalOrderLoadKey: state => state.additionalOrderLoadKey,
  RpTableData: state => state.RpTableData,
  count: state => state.count,
  multipleSelections: state => state.multipleSelections,
  reloadKey: state => state.reloadKey,
  leaveAppLoadKey: state => state.leaveAppLoadKey,
  currentRow: state => state.currentRow,
  commonWestDrugData: state => state.commonWestDrugData,
  commonChnDrugData: state => state.commonChnDrugData,
  commonNonDrugData: state => state.commonNonDrugData,
  chargeData: state => state.chargeData,
  activeTabName: state => state.activeTabName,
  psRegorActiveTabName: state => state.psRegorActiveTabName,
  diaName: state => state.diaName,
  templateQuoteKey: state => state.templateQuoteKey,
  diagnosis: state => state.diagnosis,
  visitType: state => state.visitType,
  docTypeCode: state => state.docTypeCode,
  recallRecord: state => state.recallRecord,
  publicHealthData: state => state.publicHealthData
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
