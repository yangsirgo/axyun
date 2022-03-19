const state = {
  size: 1,
  tabName: "",
  mainComplaint: "",
  hisPresent: "",
  testList: [],
  checkList: [],
  diagnosisList: [],
  drugConflictList: [],
  // 1 就放到第一位  否则就放到第二位
  CdssCode: 0
};

const getters = {
  size: state => state.size,
  mainComplaint: state => state.mainComplaint,
  hisPresent: state => state.hisPresent,
  testList: state => state.testList,
  checkList: state => state.checkList,
  diagnosisList: state => state.diagnosisList,
  drugConflictList: state => state.drugConflictList,
  tabName: state => state.tabName,
  CdssCode: state => state.CdssCode,
};
const actions = {
  clearCDSSData({ commit }) {
    console.log("clearCDSSData---------");
    commit("SET_TESTLIST", []);
    commit("SET_CHECKLIST", []);
    commit("SET_DRUGCONFLICTLIST", []);
    commit("SET_DIAGNOSISLIST", []);
    commit("SETHISPRESENT", "");
    commit("SETMAINCOMPLAINT", "");
  },
  setSize({ commit }, size) {
    commit("SET_SIZE", size);
  },
  setCdssCode({ commit }, data) {
    commit("SET_CDSS_CODE", data);
  },
  setHisPresent({ commit }, data) {
    console.log("现病史---- :>> ", data);
    commit("SETHISPRESENT", data);
  },
  setMainComplaint({ commit }, data) {
    console.log("主诉---- :>> ", data);
    commit("SETMAINCOMPLAINT", data);
  },
  setTestList({ commit }, val) {
    commit("SET_TESTLIST", val);
  },
  setCheckList({ commit, state }, val) {
    let temp = state.checkList;
    temp.push(val);
    commit("SET_CHECKLIST", temp);
  },
  setDrugConflictList({ commit }, val) {
    commit("SET_DRUGCONFLICTLIST", val);
  },
  setTabName({ commit }, val) {
    console.log(`setTabName-----------`, val);
    commit("SET_TABNAME", val);
  },
  setDiagnosisList({ commit }, val) {
    let temp = [];
    val.forEach(el => {
      temp.push(el.diagName);
    });
    console.log(`setDiagnosisList`, temp);
    commit("SET_DIAGNOSISLIST", temp);
  }
};
const mutations = {
  SET_SIZE: (state, size) => {
    state.size = size;
  },
  SET_CDSS_CODE: (state, data) => {
    state.CdssCode = data;
  },
  SETMAINCOMPLAINT: (state, val) => {
    console.log("val :>> ", val);
    state.mainComplaint = val;
  },
  SETHISPRESENT: (state, val) => {
    console.log("val :>> ", val);
    state.hisPresent = val;
  },
  SET_TESTLIST: (state, val) => {
    state.testList = val;
  },
  SET_CHECKLIST: (state, val) => {
    state.checkList = val;
  },
  SET_DRUGCONFLICTLIST: (state, val) => {
    state.drugConflictList = val;
  },
  SET_DIAGNOSISLIST: (state, val) => {
    state.diagnosisList = val;
  },
  SET_TABNAME: (state, val) => {
    state.tabName = val;
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
