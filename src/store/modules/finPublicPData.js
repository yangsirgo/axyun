const state = {
  finPatientInfo: {} // 财务患者信息
};

const mutations = {
  FIN_PATIENT_INFO: (state, dataObj) => {
    state.finPatientInfo = dataObj;
  }
};

const actions = {
  changeFinPatientInfo({ commit }, data) {
    commit("FIN_PATIENT_INFO", data);
  }
};

const getters = {
  finPatientInfo: state => state.finPatientInfo
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
