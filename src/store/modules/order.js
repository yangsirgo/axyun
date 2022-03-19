const state = {
  // 药品名称
  drugName: ''
};

const mutations = {
  SET_DRUGNAME: (state, data) => {
    state.drugName = data;
  }
};

const actions = {
  changeDrugName({
    commit
  }, data) {
    commit('SET_DRUGNAME', data);
  }
};

const getters = {
  drugName: state => state.drugName
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
