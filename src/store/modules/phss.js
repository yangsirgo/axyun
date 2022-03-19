const state = {
  mainHeight: "",
  appHeight: "",
  headerHeight: ""
};

const mutations = {
  SET_SAVE_MAIN_HEIGHT: (state, height) => {
    state.mainHeight = height;
  },
  SET_SAVE_APP_HEIGHT: (state, height) => {
    state.appHeight = height;
  },
  SET_SAVE_HEADER_HEIGHT: (state, height) => {
    state.headerHeight = height;
  }
};

const actions = {
  saveAppHeight({ commit }, height) {
    commit("SET_SAVE_APP_HEIGHT", height);
  },
  saveHeaderHeight({ commit }, height) {
    commit("SET_SAVE_HEADER_HEIGHT", height);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
