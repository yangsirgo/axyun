const getters = {
    sidebar: state => state.app.sidebar,
    language: state => state.app.language,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    errorLogs: state => state.errorLog.logs,
    receivePatientData: state => state.base.receivePatientData,
    receivePatientDatas: state => state.base.receivePatientDatas,
    currentPrescription: state => state.ipnw.currentPrescription,
    entryHosId: state => state.ipnw.entryHosId,
    illnessArea: state => state.ipnw.illnessArea
}
export default getters