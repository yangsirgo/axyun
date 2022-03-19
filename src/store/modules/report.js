// 报告指标解读
const state = {
  // 需要解读的指标
  indexData: {}
};

const mutations = {
  SET_DATA: (state, data) => {
    state.indexData = data;
  }
};

const actions = {
  changeData({
    commit
  }, data) {
    commit('SET_DATA', data);
  }
};

const getters = {
  indexData: state => state.indexData
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
