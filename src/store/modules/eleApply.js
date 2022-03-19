const state = {
  // 模板类型
  eleTemType: '',
  // 刷新工具箱模板
  eleTemRefresh: false
};

const mutations = {
  SET_TYPE: (state, data) => {
    state.eleTemType = data;
  },
  SET_REF: (state) => {
    state.eleTemRefresh = !state.eleTemRefresh;
  }
};

const actions = {
  changeType({ commit }, data){
    commit('SET_TYPE',data);
  },
  changeRef({ commit }) {
    commit('SET_REF');
  }
};

const getters = {
  eleTemType: state => state.eleTemType,
  eleTemRefresh: state => state.eleTemRefresh
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
