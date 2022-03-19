const state = {
  retreatData: {},
  rechargeData: {},
  currentReceipt: {}
};

const mutations = {
  RETREAT_SETTING: (state, dataObj) => {
    state.retreatData = dataObj;
  },
  RECHARGE_SETTING: (state, dataObj) => {
    state.rechargeData = dataObj;
  },
  CURRENT_RECEIPT_SETTING: (state, dataObj) => {
    state.currentReceipt = dataObj;
  }
};

const actions = {
  changeRetreatData({ commit }, data) {
    commit("RETREAT_SETTING", data);
  },
  changeRechargeData({ commit }, data) {
    commit("RECHARGE_SETTING", data);
  },
  currentReceiptData({ commit }, data) {
    commit("CURRENT_RECEIPT_SETTING", data);
  }
};

const getters = {
  retreatData: state => state.retreatData,
  rechargeData: state => state.rechargeData,
  currentReceipt: state => state.currentReceipt
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
