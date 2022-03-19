const state = {
  // 提示信息
  message: {
    type: '',
    label: ''
  },
  // 状态列表
  list: []
};

const mutations = {
  SET_MESSAGE: (state, data) => {
    state.message = data;
  },
  SET_LIST: (state, data) => {
    state.list = data;
  }
};

let timeFlag = null;

const actions = {
  changeMessage({
    commit
  }, data) {
    commit('SET_MESSAGE', data);
    if (timeFlag) {
      clearTimeout(timeFlag)
    }
    timeFlag = setTimeout(() => {
      commit('SET_MESSAGE', {
        type: '',
        label: ''
      });
    }, 5000)
  },
  changeList({
    commit
  }, data) {
    commit('SET_LIST', data);
  }
};

const getters = {
  $_top_message: state => state.message,
  $_top_list: state => state.list
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
