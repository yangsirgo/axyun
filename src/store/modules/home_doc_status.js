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
  status: '',
  //选中的数据
   choose:{}

};

const mutations = {
  SET_STATUS: (state, data) => {
    state.status = data;
  },
  SET_CHOOSE: (state, data) => {
    state.choose = data;
  }


};

const actions = {
  setStatus({commit}, data) {
    commit("SET_STATUS", data)
  },
  setChoose({commit}, data) {
    commit("SET_CHOOSE", data)
  }

};

const getters = {
  status: state => state.status,
  choose: state => state.choose
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
