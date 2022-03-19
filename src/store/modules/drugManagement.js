const state = {
  // 表格选中的药品信息
  currentDrug: '',
  currentLeftItem: '',
  // 其他处方-》选中的处方信息
  currentPre: '',
  // 住院医嘱汇总批次明细
  orderList: [],
  // true：精确批次管理；false：非精确批次管理
  isBatchManagement: false,
  // 当前登录的库房storageCode
  currentStorageCode: ''
};

const mutations = {
  SET_DRUG: (state, data) => {
    state.currentDrug = data;
  },
  SET_ITEM: (state, data) => {
    state.currentLeftItem = data
  },
  SET_PRE: (state, data) => {
    state.currentPre = data
  },
  SET_ORDERLIST: (state, data) => {
    state.orderList = data
  },
  SET_BATCHMANAGEMENT: (state, data) => {
    state.isBatchManagement = data
  },
  SET_STORAGECODE: (state, data) => {
    state.currentStorageCode = data
  }
};

const actions = {
  changeDrug({
    commit
  }, data) {
    commit('SET_DRUG', data);
  },
  changeItem({
    commit
  }, data) {
    commit('SET_ITEM', data)
  },
  changePre({
    commit
  }, data) {
    commit('SET_PRE', data)
  },
  changeOrderList({
    commit
  }, data) {
    commit('SET_ORDERLIST', data)
  },
  changeBatchManagement({
    commit
  }, data) {
    commit('SET_BATCHMANAGEMENT', data)
  },
  changeStorageCode({
    commit
  }, data) {
    commit('SET_STORAGECODE', data)
  }
};

const getters = {
  currentDrug: state => state.currentDrug,
  currentLeftItem: state => state.currentLeftItem,
  currentPre: state => state.currentPre,
  orderList: state => state.orderList,
  isBatchManagement: state => state.isBatchManagement,
  currentStorageCode: state => state.currentStorageCode
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
