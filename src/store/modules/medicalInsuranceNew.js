const state = {
    dictInfoNew: [],
    commonData: {}
};

const mutations = {
    DICTINFONEW_SETTING: (state, id) => {
        state.dictInfoNew = id;
    },
    COMMONDATA_SETTING: (state, id) => {
        state.commonData = id;
    }
};

const actions = {
    changeDictInfoNew({ commit }, data) {
        commit("DICTINFONEW_SETTING", data);
    },
    changeCommonData({ commit }, data) {
        commit("COMMONDATA_SETTING", data);
    }
};

const getters = {
    dictInfoNew: state => state.dictInfoNew,
    commonData: state => state.commonData,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};