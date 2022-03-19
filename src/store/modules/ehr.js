import {set_param} from "@/utils/util.js";
import Vue from 'vue'

const state = {
  //患者ID字段patient_num    住院号 (没有)   visitId 门诊号 triageAppointmentId
  eHrleftData: {},

};

const mutations = {

  EHRLEFT_DATA_: (state, dataArr) => {
    state.eHrleftData = dataArr;
    console.log(state.eHrleftData,'state.eHrleftDatastate.eHrleftDatastate.eHrleftData')
  },
};

const actions = {

  seteHrData({commit}, data) {
    commit("EHRLEFT_DATA_", data);
  },

};

const getters = {
  eHrleftData: state => state.eHrleftData,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
