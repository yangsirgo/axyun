import localForage from "localforage";
const state = {
  // 刷新工具箱历次诊断
  diagTemRefresh: false,
  diagnosisData: {
    ChineseMedicine: getChineseMedicine(),
    WesternMedicine: getWesternMedicine()
  }
};
async function getChineseMedicine() {
  try {
    const res = await localForage.getItem("ChineseMedicineDiagnosis");
    console.log("res :>> ", res.length);
    return res;
  } catch (error) {
    return [];
  }
}
async function getWesternMedicine() {
  try {
    const res = await localForage.getItem("WesternMedicineDiagnosis");
    console.log("res :>> ", res.length);
    return res;
  } catch (error) {
    return [];
  }
}
const mutations = {
  SET_REF: state => {
    state.diagTemRefresh = !state.diagTemRefresh;
  },
  SET_DIAGNOSISDATA: (state, data) => {
    state.diagnosisData = data;
  },
  SET_DIAGNOSISDATATYPE: (state, data) => {
    console.log("data :>> ", data);
    state.diagnosisData[data.type] = data.val;
    console.log("state.diagnosisData :>> ", state.diagnosisData);
  }
};

const actions = {
  changeRef({ commit }) {
    commit("SET_REF");
  },
  setDiagnosisData({ commit }, data) {
    console.log("setDiagnosisData :>> ", data);
    commit("SET_DIAGNOSISDATA", data);
  },
  setDiagnosisDataType({ commit }, data) {
    console.log("data :>> ", data);
    commit("SET_DIAGNOSISDATATYPE", data);
  }
};

const getters = {
  diagTemRefresh: state => state.diagTemRefresh,
  diagnosisData: state => state.diagnosisData
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
