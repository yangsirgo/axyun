const state = {
  westPharmacyObject: {
    selected: {},
    list: [] //西药药房
  },
  chmPharmacyObject: {
    selected: {},
    list: [] //中药药房
  }
};

const mutations = {
  WESTPHARMACYOBJECT_SETTING: (state, dataObj) => {
    state.westPharmacyObject = dataObj;
  },
  CHMPHARMACYOBJECT_SETTING: (state, dataObj) => {
    state.chmPharmacyObject = dataObj;
  }
};

const actions = {
  changeWestPharmacyObject({
    commit
  }, data) {
    commit("WESTPHARMACYOBJECT_SETTING", data);
  },
  changeChmPharmacyObject({
    commit
  }, data) {
    commit("CHMPHARMACYOBJECT_SETTING", data);
  }
};

const getters = {
  westPharmacyObject: state => state.westPharmacyObject,
  chmPharmacyObject: state => state.chmPharmacyObject
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
