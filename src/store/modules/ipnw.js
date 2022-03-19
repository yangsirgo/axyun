const state = {
    currentPrescription: "", // 住院护理 医嘱编辑 所选处方id
    entryHosId: "", // 患者住院申请ID
    illnessArea: "", // 病区ID
};

const mutations = {
    PRESCRIPTION_SETTING: (state, id) => {
        state.currentPrescription = id;
    },
    ENTRYHOS_SETTING: (state, id) => {
        state.entryHosId = id;
    },
    ILLNESSAREA_SETTING: (state, id) => {
        state.illnessArea = id
    }
};

const actions = {
    changePrescription({ commit }, data) {
        commit("PRESCRIPTION_SETTING", data);
    },
    changeEntryHosId({ commit }, data) {
        commit("ENTRYHOS_SETTING", data)
    },
    changeIllnessArea({ commit }, data) {
        commit("ILLNESSAREA_SETTING", data)
    }
};

const getters = {
    currentPrescription: state => state.currentPrescription,
    entryHosId: state => state.entryHosId,
    illnessArea: state => state.illnessArea
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};