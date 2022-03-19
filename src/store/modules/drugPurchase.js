const state = {
  // 采购模板工具箱列表刷新
  loadDrugList: false,
  newPurchaseData: {}
};

const mutations = {
  SET_LOAD: (state) => {
    state.loadDrugList = !state.loadDrugList;
  },
  SET_DATA: (state, data) => {
    state.newPurchaseData = data
  }
};

const actions = {
  reLoadList({
    commit
  }) {
    commit('SET_LOAD');
  },
  changeData({
    commit
  }, data) {
    commit("SET_DATA", data)
  }
};

const getters = {
  loadDrugList: state => state.loadDrugList,
  newPurchaseData: state => state.newPurchaseData
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
