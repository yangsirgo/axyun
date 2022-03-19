import {
  set_param
} from "@/utils/util.js";
import Configuration from "@/settings";
import Vue from 'vue'

// table 信息存储
// import { mapGetters, mapActions } from "vuex";
//  取数据：
// this.$store.state.table.tableConfiguration.status
// ...mapGetters("table", ["tableConfiguration"])
//  存数据：
//  ...mapActions({
//     setDataYear: 'table/tableConfiguration'
//  })

const state = {
  // 表格数据
  tableConfiguration: {},
  // 表格数据
  viewTableConfiguration: {},
  // 所有
  AllStepData: {},
  // 表格状态
  tableStatus: "",
  // 个人信息
  baseMesData: {},
  // 数据年份
  dataYear: "",
  // 数据ID
  dataID: "",
  // 要打开的表格名字
  tableName: ""
};

const mutations = {
  SET_CONFIGURATION: (state, data) => {
    state.tableConfiguration = data;
  },
  SET_VIEWTABLECONFIGURATION: (state, data) => {
    state.viewTableConfiguration = data;
  },
  SETALLSTEPDATA: (state, data) => {
    state.AllStepData = data;
  },
  // 个人信息
  SETBASEMESDATA: (state, data) => {
    state.baseMesData = data;
  },
  SET_DATAYEAR: (state, data) => {
    state.dataYear = data;
  },
  SET_DATAID: (state, data) => {
    state.dataID = data;
  },
  SET_TABLENAME: (state, data) => {
    state.tableName = data;
  },
  SET_TABLESTATUS: (state, data) => {
    state.tableStatus = data;
  }
};

const actions = {
  setConfiguration({
    commit
  }, data) {
    console.log('data*******', data)
    console.log('table.js 状态', data.status)
    commit("SET_TABLESTATUS", data.status)
    console.log('Configuration-------', Configuration.tableConfiguration[data.tableName].data[data.dataYear])
    let temp = {}
    if (data.editData === undefined) {
      temp.editData = ''
    }
    if (data.editChObject === undefined) {
      temp.editChObject = ''
    }
    temp = Configuration.tableConfiguration[data.tableName].data[data.dataYear];
    temp.tableName = data.tableName;
    temp.tableTitle = data.tableTitle;
    temp.editData = data.editData;
    temp.editChObject = data.editChObject;
    temp.curComponent = temp.pageList[0].menuKey;
    console.log('temp', temp)
    commit("SET_TABLESTATUS", data.status)
    if (data.status == 'view') {
      commit("SET_VIEWTABLECONFIGURATION", temp)
    } else {
      commit("SET_CONFIGURATION", temp)
    }
  },
  setViewConfiguration({
    commit
  }, data) {
    console.log('data', data)
    let temp = Configuration.tableConfiguration[data.tableName].data[data.dataYear];
    console.log('Configuration-------', Configuration.tableConfiguration[data.tableName].data[data.dataYear])
    temp.tableName = data.tableName;
    temp.tableTitle = data.tableTitle;
    temp.editData = data.editData;
    temp.editChObject = data.editChObject;
    // 组件
    temp.curComponent = temp.pageList[0].menuKey;
    // 状态
    temp.status = data.status;
    if (data.editData === undefined) {
      temp.editData = ''
    }
    if (data.editChObject === undefined) {
      temp.editChObject = ''
    }
    if (data.status === undefined) {
      temp.status = 'add'
    }
    console.log('temp', temp)
    commit("SET_VIEWTABLECONFIGURATION", temp)
  },
  setAllStepData({
    commit
  }, data) {
    console.log('setAllStepData', data)
    commit("SETALLSTEPDATA", data)
  },
  setBaseMesData({
    commit
  }, data) {
    commit("SETBASEMESDATA", data)
  },
  setDataYear({
    commit
  }, data) {
    commit("SET_DATAYEAR", data)
  },
  setDataID({
    commit
  }, data) {
    commit("SET_DATAID", data)
  },
  setTableName({
    commit
  }, data) {
    commit("SET_TABLENAME", data)
  }
};

const getters = {
  tableConfiguration: state => state.tableConfiguration,
  viewTableConfiguration: state => state.viewTableConfiguration,
  tableStatus: state => state.tableStatus,
  AllStepData: state => state.AllStepData,
  BaseMesData: state => state.baseMesData,
  dataYear: state => state.dataYear,
  dataID: state => state.dataID,
  tableName: state => state.tableName
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
