// 护理文书相关vuex数据

const state = {
  nursingTreeData: [],
  inData: {},
  outData: {},
  currentIndexInit: '',
  currentCtr: {
    currentControl: { eleId: "" },
    currentIndex: -1
  },
  //基础元素
  basicElement: {},
  editor: ""
};

const mutations = {
  NURSINGTREEDATA_SETTING: (state, dataObj) => {
    state.nursingTreeData = dataObj;
  },
  CURRENTCTR_SETTING: (state, dataObj) => {
    state.currentCtr = dataObj;
  },
  INDATA_SETTING: (state, dataObj) => {
    state.inData = dataObj;
  },
  OUTDATA_SETTING: (state, dataObj) => {
    state.outData = dataObj;
  },
  CURRENTINDEX_SETTING: (state, dataObj) => {
    state.currentIndexInit = dataObj;
  },
  BASICELEMENT_SETTING: (state, dataObj) => {
    state.basicElement = dataObj;
  },
  EDITOR_SETTING: (state, dataObj) => {
    state.editor = dataObj;
  }
};

const actions = {
  changeNursingTreeData({ commit }, data) {
    commit("NURSINGTREEDATA_SETTING", data);
  },
  changeInData({ commit }, data) {
    commit("INDATA_SETTING", data);
  },
  changeOutData({ commit }, data) {
    commit("OUTDATA_SETTING", data);
  },
  changeCurrentIndex({ commit }, data) {
    commit("CURRENTINDEX_SETTING", data);
  },
  changeCurrentCtr({ commit }, data) {
    commit("CURRENTCTR_SETTING", data);
  },
  changeBasicElement({ commit }, data) {
    commit("BASICELEMENT_SETTING", data);
  },
  changeEditor({ commit }, data) {
    commit("EDITOR_SETTING", data);
  }
};

const getters = {
  nursingTreeData: state => state.nursingTreeData,
  currentCtr: state => state.currentCtr,
  inData: state => state.inData,
  outData: state => state.outData,
  currentIndexInit: state => state.currentIndexInit,
  basicElement: state => state.basicElement,
  editor: state => state.editor
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
