const state = {
  receivePatientData: {},
  treatId:{},// 医嘱类型  长期1  临时2
  publicHealthData: {},
  // 刷新家床的左侧列表
  theRefreshLeftLIst:{},
  //当前选中的 tabsWrapper
  currentTabsWrapper: "",
  //家床中草药用户选中的处方列表
  chmCurrentRow: {}
};

const mutations = {
  RECEPTIONIST_SETTING: (state, dataObj) => {
    state.receivePatientData = dataObj;
  },
  TREA_TID: (state, dataObj) => {
    state.treatId = dataObj;
  },
  PUBLICHEALTH_SETTING: (state, dataObj) => {
    state.publicHealthData = dataObj;
  },
  THE_REFRESH_LEFT_LIST: (state, dataObj) => {
    state.theRefreshLeftLIst = dataObj;
  },
  CURRENTTABSWRAPPER_SETTING: (state, dataObj) => {
    state.currentTabsWrapper = dataObj;
  },
  CHMCURRENTROW_SETTING: (state, dataObj) => {
    state.chmCurrentRow = dataObj;
  }
};

const actions = {
  changeRecPatientData({
    commit
  }, data) {
    commit("RECEPTIONIST_SETTING", data);
  },
  changeTreatId({
    commit
  }, data) {
    commit("TREA_TID", data);
  },
  changePublicHealthData({ commit }, data) {
    commit("PUBLICHEALTH_SETTING", data);
  },
  changeTheRefreshLeftLIst({ commit }, data) {
    commit("THE_REFRESH_LEFT_LIST", data);
  },
  changeCurrentTabsWrapper({ commit }, data) {
    commit("CURRENTTABSWRAPPER_SETTING", data);
  },
  changeChmCurrentRow({ commit }, data) {
    commit("CHMCURRENTROW_SETTING", data);
  }
};

const getters = {
  receivePatientData: state => state.receivePatientData,
  treatId: state => state.treatId,
  publicHealthData: state => state.publicHealthData,
  theRefreshLeftLIst: state => state.theRefreshLeftLIst,
  chmCurrentRow: state => state.chmCurrentRow,
  currentTabsWrapper: state => state.currentTabsWrapper
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
