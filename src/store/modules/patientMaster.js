import {set_param} from "@/utils/util.js";
import Vue from 'vue'

const state = {
  //患者ID字段patient_num    住院号 (没有)   visitId 门诊号 triageAppointmentId
  receivePatientData: {},
  //刷新左侧列表关键字
  searchAgainKey: 0,
  //存储 多个患者信息
  receivePatientDatas: [],
  //档案字段
  recordData: {},
  //左侧table数据暂存
  patientListData: {},
  //相似档案触发条件
  similarRecordData: {},
  currentTitle: {},// 预约 右侧工具箱 默认是科室
  //患者主索引历史就诊记录
  hisRecordData: {},
  //患者主索引历史住院记录
  hisRecordInData: {},
  sDept: {},
  //排班模板数据
  scheTemplate: {},
  //护理文书树data
  nursingTreeData: [],
  inData: {},
  outData: {},
  currentIndexInit: '',
  reloadPatient: {}
};

const mutations = {
  SET_ACTION: (state, data) => {
    state.currentTitle = data;
  },
  RECEPTIONIST_SETTING: (state, dataObj) => {
    state.receivePatientData = dataObj;

    console.log();
    // 需要在 receivePatientData 加入一个字段 diagName， 使之双向绑定，担心引起别的问题，只为演示需要，所以增加了页面判断 只在门诊医生站 病历处方 诊断中使用
    if (window.location.href.indexOf('cisOne/cisThree/record') > -1 && state.receivePatientData.diagName === undefined) {
      Vue.set(state.receivePatientData, 'diagName', '');
    }

  },
  RECEPTIONISTS_SETTING: (state, dataArr) => {
    state.receivePatientDatas = dataArr;
  },
  RECORD_SETTING: (state, dataObj) => {
    state.recordData = dataObj;
  },
  PATIENTLIST_SETTING: (state, dataObj) => {
    state.patientListData = dataObj;
  },
  SIMILARRECORD_SETTING: (state, dataObj) => {
    state.similarRecordData = dataObj;
  },
  SEARCHAGAINKEY_SETTING: (state, dataObj) => {
    //debugger
    state.searchAgainKey = dataObj;
  },
  CLEAR: (state) => {
    // state.receivePatientData = {};
    state.receivePatientDatas = [];
    state.recordData = {};
    state.patientListData = {};
    state.similarRecordData = {};
  },
  CLEAR_HISRECORD: (state) => {
    state.hisRecordData = {};
    state.hisRecordInData = {};
  },
  HISRECORD_SETTING: (state, dataObj) => {
    state.hisRecordData = dataObj;
  },
  HISRECORDIN_SETTING: (state, dataObj) => {
    state.hisRecordInData = dataObj;
  },
  SDEPT_SETTING: (state, dataObj) => {
    state.sDept = dataObj;
  },
  SCHETEMPLATE_SETTING: (state, dataObj) => {
    state.scheTemplate = dataObj;
  },
  NURSINGTREEDATA_SETTING: (state, dataObj) => {
    state.nursingTreeData = dataObj;
  },
  INDATA_SETTING: (state, dataObj) => {
    state.inData = dataObj;
  },
  OUTDATA_SETTING: (state, dataObj) => {
    state.outData = dataObj;
  },
  CURRENTINDEX_SETTING: (state, dataObj) => {
    state.currentIndexInit = dataObj;
  },
  RELOADPATIENT_SETTING: (state, dataObj) => {
    state.reloadPatient = dataObj;
  }
};

const actions = {
  setCurrentTitle({commit}, data) {
    commit("SET_ACTION", data)
  },
  changeRecPatientData({commit}, data) {
    commit("RECEPTIONIST_SETTING", data);
  },
  changeRecPatientDatas({commit}, data) {
    commit("RECEPTIONISTS_SETTING", data);
  },
  changeRecordData({commit}, data) {
    commit("RECORD_SETTING", data);
  },
  changePatientListData({commit}, data) {
    commit("PATIENTLIST_SETTING", data);
  },
  changeSimilarRecordData({commit}, data) {
    commit("SIMILARRECORD_SETTING", data);
  },
  changeSearchAgainKey({commit}, data) {
    commit("SEARCHAGAINKEY_SETTING", data);
  },
  changeHisRecordData({commit}, data) {
    commit("HISRECORD_SETTING", data);
  },
  changeHisRecordInData({commit}, data) {
    commit("HISRECORDIN_SETTING", data);
  },
  changeSdept({commit}, data) {
    commit("SDEPT_SETTING", data);
  },
  changeScheTemlate({commit}, data) {
    commit("SCHETEMPLATE_SETTING", data);
  },
  changeNursingTreeData({commit}, data) {
    commit("NURSINGTREEDATA_SETTING", data);
  },
  changeInData({commit}, data) {
    commit("INDATA_SETTING", data);
  },
  changeOutData({commit}, data) {
    commit("OUTDATA_SETTING", data);
  },
  changeCurrentIndex({commit}, data) {
    commit("CURRENTINDEX_SETTING", data);
  },
  changeReloadPatient({commit}, data) {
    commit("RELOADPATIENT_SETTING", data);
  }
  
};

const getters = {
  currentTitle: state => state.currentTitle,
  receivePatientData: state => state.receivePatientData,
  receivePatientDatas: state => state.receivePatientDatas,
  recordData: state => state.recordData,
  patientListData: state => state.patientListData,
  similarRecordData: state => state.similarRecordData,
  searchAgainKey: state => state.searchAgainKey,
  hisRecordData: state => state.hisRecordData,
  hisRecordInData: state => state.hisRecordInData,
  sDept: state => state.sDept,
  scheTemplate: state => state.scheTemplate,
  nursingTreeData: state => state.nursingTreeData,
  inData: state => state.inData,
  outData: state => state.outData,
  currentIndexInit: state => state.currentIndexInit,
  reloadPatient: state => state.reloadPatient
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
