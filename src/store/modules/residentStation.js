//住院醫生站医嘱 废弃 receivePatientData

import { set_param } from "@/utils/util.js";

const state = {
  receivePatientData: {}, // 住院号 (没有)   visitId 门诊号 triageAppointmentId  废弃 放到 base.js 里了
  multipleSelections: []//住院醫生站医嘱模板选择的项
};

const mutations = {
  RECEPTIONIST_SETTING: (state, dataObj) => {
    state.receivePatientData = dataObj;
  },
  SET_MULTIPLE_SELECTIONS: (state, data) => {
    //console.log('vuex:',data);
    state.multipleSelections = data;
  },

};

const actions = {
  changeRecPatientData({ commit }, data) {
    commit("RECEPTIONIST_SETTING", data);
    //设置url 中的参数信息
    // set_param  ('item',data.patientNum);
  },
  setMultipleSelections({ commit }, data){
    commit("SET_MULTIPLE_SELECTIONS", data);
  }
};

const getters = {
  receivePatientData: state => state.receivePatientData,
  multipleSelections: state =>state.multipleSelections
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
