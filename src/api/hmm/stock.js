import {
  post,
  get,
  put,
  del
} from '@/utils/request'

export default {

  //----------------------- 药库入库 ------------------------------
  async addInInventory(params) {
    const {
      data
    } = await post("/hmm-stock/inInventory", params, true);
    return data || {};
  },
  async listInInventory(params) {
    return await get("/hmm-stock/inInventory/forPage", params, true);
  },
  async delInInventory(ids) {
    const {
      data
    } = await del("/hmm-stock/inInventory/logic-batch", ids, true);
    return data || {};
  },
  async updateInInventory(params) {
    const {
      data
    } = await put("/hmm-stock/inInventory/update", params, true);
    return data || {};
  },
  async getDetail(id) {
    const {
      data
    } = await get("/hmm-stock/inInventory/" + id);
    return data || {};
  },
  async updateInInventoryById(id) {
    const {
      data
    } = await put("/hmm-stock/inInventory/submit/" + id);
    return data || {};
  },

  //----------------------- 药库出库 ------------------------------
  async saveOutStockList(params) { //出库单及明细数据保存或修改数据
    return await post("/hmm-stock/outInventory/saveOrUpdateMulti", params);
  },
  async submitOutStockList(id) { //提交出库单
    return await put("/hmm-stock/outInventory/submit/" + id);
  },
  async deleteOutStockList(id) { //删除出库单
    return await del(
      "/hmm-stock/outInventory/" + id
    );
  },
  async getOutStockModeList(params) { //根据出库方式不同,自动补全申请单列表
    return await get(`/hmm-stock/outInventory/quickOutboundForApply/${params.applyId}/${params.type}`);
  },

  async saveBatch(params) { //申请出库时，修改批次时候保证申请列表的批次数据跟修改的一样
    return await post('/hmm-stock/outInventoryD/saveBatch', params);
  },

  //药库出库 申请出库类型下申请单提交
  async outApplySubmit(applyPO) { //出库单及明细数据保存或修改数据
    return await put("/hmm-stock/outInventory/applySubmit", applyPO);
  },
  //----------------------- 药房出库 ------------------------------
  //查询出库单，查询出库单
  async getOutStockList(params) {
    return await get("/hmm-stock/outInventory/forPage/", params);
  },
  // 根据出库id 拿到详细列表 带分页
  async getOutStockListDetail(id) {
    return await get("/hmm-stock/outInventoryD/detail/" + id);
  },
  //药库出库 申请出库类型下申请单保存
  async postApplyListSave(params) {
    const data = await post("/hmm-stock/outInventory/updateapplySubmitApply", params);
    return data || {};
  },
  //药库出库 申请出库类型下申请单提交
  async putApplyListSubmit(id) {
    const data = await put("/hmm-stock/outInventory/applySubmit/" + id);
    return data || {};
  },

  //药房退货处理 保存
  async postapplyDSave(params) {
    return await put("/hmm-stock/applyD/update", params);
  },

  //----------------------- 库房调价 ------------------------------

  //调价单左侧列表
  async getAdjustPriceList(queryData) {
    return await get("/hmm-stock/adjustPrice/forPage/", queryData);
  },

  //调价单左侧删除
  async delAdjustPrice(id) {
    return await del("/hmm-stock/adjustPrice/" + id);
  },

  // 根据请领单id 拿到详细列表 带分页
  async getAdjustPriceDetail(id) {
    return await get("/hmm-stock/adjustPriceD/list?id=" + id);
  },

  //调价单保存
  async addadjustPrice(saveData) {
    return await post("/hmm-stock/adjustPrice/saveOrUpdateMulti", saveData);
  },

  //调价单提交
  async submitAdjustPrice(id) {
    return await put("/hmm-stock/adjustPrice/submit/" + id);
  },
  //----------------------- 药房申请 ------------------------------
  async getCurrPharmacy(params) { //判断当前登陆库房是否可申请药品
    return await get("/hmm-stock/pharmacy/getCurrPharmacy", params);
  },
  async batchApplyList(params) { //获取批量采购数据
    return await get("/hmm-stock/apply/forApply", params);
  },

  // 查询 请领单列表
  async getApplyList(params) {
    return await get("/hmm-stock/apply/forPage", params);
  },
  // 根据请领单id 拿到详细列表 带分页
  async getApplyDetailList(id, applyType) {
    return await get("/hmm-stock/apply/detail/" + id + "/" + applyType);
  },
  // 根据请领单id 拿到详细列表
  async getApplyDetail(id) {
    return await get("/hmm-stock/apply/detail/" + id + "/0");
  },

  // 根据退药申请单id 拿到详细列表
  async getApplyDetails(id) {
    return await get("/hmm-stock/apply/detail/" + id + "/1");
  },

  // 保存申请单
  async addApply(params) {
    return await post("/hmm-stock/apply/saveOrUpdateMulti", params);
  },
  // 更新请领单 及详情
  async updateApply(params) {
    const {
      data
    } = await put("/hmm-stock/apply/updateApplyDto", params);
    return data || {};
  },
  // 逻辑删除请领单
  async delApply(id) {
    return await del("/hmm-stock/apply/" + id);
  },
  // 提交申请单
  async submitApply(id) {
    return await put("/hmm-stock/apply/submit/" + id);
  },


  //药房退货保存outInventory/saveOrUpdateMultiForBack
  async addrenDis(params) {
    return await post("/hmm-stock/outInventory/saveOrUpdateMultiForBack", params);
  },
  //药房退货提交
  async submitrenDis(id) {
    return await put("/hmm-stock/outInventory/submitForBack/" + id);
  },

  //----------------------- 入库确认 ------------------------------
  //查询出库单，查询出库单明细 getWareConfimList
  async getWareConfimList(params) {
    const data = await get("/hmm-stock/outInventory/forPage/", params);
    return data || {};
  },
  // 根据请领单id 拿到详细列表 带分页
  async getWareConfimDetail(id) {
    return await get("/hmm-stock/outInventoryD/params?outInventoryId=" + id);
  },
  async putConfirm(id) { //入库确认
    return await put("/hmm-stock/outInventory/confirm/" + id);
  },
  //----------------------- 药房出库 ------------------------------
  //查询出库单，查询出库单明细 getWareConfimList
  async getOutPharmacyList(params) {
    const data = await get("/hmm-stock/outInventory/forPage/", params);
    return data || {};
  },
  // 根据请领单id 拿到详细列表 带分页
  async getOutPharmacyDetail(id) {
    const {
      data
    } = await get("/hmm-stock/outInventoryD/params?outInventoryId=" + id);
    return data || {};
  },
  async getStockList(params) {
    return await get("/hmm-stock/stock/forPage", params);
  },
  async getStockDList(params) {
    return await get("/hmm-stock/stockD/forPage", params);
  },
  async updateStock(params) {
    return await put("/hmm-stock/stock/update", params);
  },
  async getInStorage(params) {
    return await get("/hmm-stock/inStorageD/forPage", params);
  },
  async getOutStorage(params) {
    return await get("/hmm-stock/outStorageD/forPage", params);
  },
  async getAdjustPrice(params) {
    return await get("/hmm-stock/adjustPriceD/forPage", params);
  },

  //药品搜索联想数据
  async getAssociation(params) {
    const {
      data
    } = await get("/hmm-stock/drug/listForDrug", params);
    return data || {};
  },

  //----------------------- 药品位置维护 ------------------------------
  //大类 通用字典表 eg .../wdata/dic/single/locationSort

  //药品位置维护 查询
  async getPharmacyPositionList(pharmacyPositionQueryVO) {
    const {
      data
    } = await get("/hmm-stock/drugPosition/forPage", pharmacyPositionQueryVO);
    return data || {};
  },
  //药品位置维护 详情
  async getPharmacyPositionDetail(pharmacyPositionQueryVO) {
    const {
      data
    } = await get("/hmm-stock/drugPosition/detail", pharmacyPositionQueryVO);
    return data || {};
  },
  //药品位置维护 新增
  async addPharmacyPosition(pharmacyPositionVO) {
    return await post("/hmm-stock/drugPosition/save", pharmacyPositionVO);
  },

  //----------------------- 工作时间维护 ------------------------------
  //工作时间维护查询
  async getWorkTimeList(workTimeQueryVO) {
    return await get("/hmm-stock/workTime/forPage", workTimeQueryVO);

  },
  //工作时间维护新增
  async addWorkTime(workTimeVO) {
    return await post("/hmm-stock/workTime/save", workTimeVO);
  },
  //工作时间维护批量删除
  async delWorkTime(ids) {
    return await del("/hmm-stock/workTime/batch", ids);
  },
  //----------------------- 工作时间维护 ------------------------------
  // 位置大类维护-保存
  async locationSortSave(data) {
    return await post("/hmm-stock/locationSort/save", data);
  },
  // 位置大类维护-删除
  async locationSortDelete(data) {
    return await del("/hmm-stock/locationSort/delete", data);
  },
  // 位置大类维护-列表
  async locationSortList(data) {
    return await get("/hmm-stock/locationSort/forPage", data);
  },
  //----------------------- 盘存设定------------------------------
  async getSetList(queryData) { //盘存设定左侧列表数据查询
    return await get("/hmm-stock/takeStockTemplate/forPage", queryData);
  },
  async getSetDetail(queryData) { //盘存设定左侧列表数据查询
    return await get("/hmm-stock/takeStockTemplateD/list", queryData);
  },
  async saveTemplate(params) {
    return await post("/hmm-stock/takeStockTemplate/saveOrUpdateMulti", params);
  },
  async startInventory(params) {
    return await post("/hmm-stock/takeStock/saveAndStart", params, false, 30000);
  },
  async deleteList(params) { //根据id删除盘存模板
    return await del("/hmm-stock/takeStockTemplate/" + params);
  },
  async changeTemFre(params) { // 修改模板状态，frequencyStatus  1常用 0不常用
    return await put('/hmm-stock/takeStockTemplate/updateFrequencyStatus', params)
  },
  async getPlDrugList(params) {
    return await get('/hmm-stock/drug/listForDrugPosition', params)
  },
  // 盘存设定，全部药品
  async getAllDrugList(params) {
    return await get('/hmm-stock/stock/currStorageDrug', params)
  },
  // 盘存详细信息
  async getTakeStockDetail(params) {
    return await get('/hmm-stock/takeStock/getTakeStockDetail', params)
  },
  //----------------------- 盘存窗口输入------------------------------
  /* async getAllWindow() { //获取所有窗口
    return await get("/takeStockWindow/all");
  }, */
  async getAllWindow() { //获取所有窗口
    return await get("/hmm-stock/takeStockWindow/listForDropDown");
  },
  async getDrugsList(params) { //获取药品
    return await get("/hmm-stock/takeStockWindowD/params", params);
  },
  async lockWindow(params) { //锁定窗口
    return await post(`/hmm-stock/takeStockWindowD/lock/${params}`);
  },
  async saveDrugsList(params) { //锁定窗口
    return await post("/hmm-stock/takeStockWindowD/save", params);
  },
  //----------------------- 盘存汇总输入------------------------------
  async sumData() { //获取当前库房正在盘存中的信息
    return await post("/hmm-stock/takeStock/activiTakeStock");
  },
  async getSumDataList(params) { //获取药品
    return await get(`/hmm-stock/takeStock/detail/${params}`);
  },
  async inventoryLock() { //盘存锁定
    return await post("/hmm-stock/takeStock/lock");
  },
  async inventoryUnlock() { //盘存解锁
    return await post("/hmm-stock/takeStock/unLock");
  },
  async inventoryCort(params) { //盘存校正
    return await post("/hmm-stock/takeStock/correction", params);
  },
  async inventoryEnd() { //盘存结束
    return await post("/hmm-stock/takeStock/end");
  },
  async inventoryInvalid() { //盘存作废
    return await post("/hmm-stock/takeStock/invalid");
  },
  async inventoryDel(id) { //盘存删除
    return await del("/hmm-stock/takeStock/delete/" + id);
  },
  async isOpenDialog() { // 当前盘存是否是精细盘存（获取当前药房）
    return await get('/hmm-stock/drgstrg/getCurDrugStorage')
  },
  async listByDrugId(params) { // 根据drugId获取校正弹窗数据
    return await get('/hmm-stock/takeStockBatchD/listByDrugId', params)
  },
  async saveCor(params) {
    return await put('/hmm-stock/takeStockBatchD/updateTakeStock', params)
  },
  // 保存
  saveEntry(params) {
    return post('/hmm-stock/takeStock/entry', params)
  },
  //----------------------- 盘存结果查询 ------------------------------
  async getInventoryList(params) { // 获取盘存结果列表
    return await get('/hmm-stock/takeStock/forPage', params)
  },
  async getInventoryDetail(params) { // 获取盘存结果详细信息
    return await get('/hmm-stock/takeStock/detail/' + params)
  },
  //----------------------- 工具箱 ------------------------------
  async getDrugStockInfo(params) { // 根据drugId获取药品库存信息
    return await get('/hmm-stock/inInventory/drugStorageStock', params)
  },
  async getDrugPurchaserHistory(params) { // 根据drugId获取药品历史采购
    return await get('/hmm-stock/inInventory/drugPurchaserHistory', params)
  },
  async getDrugOutInventoryHistory(params) { // 根据drugId获取药品历史出库明细
    return await get('/hmm-stock/outStorageD/drugOutInventoryHistory/' + params)
  },
  async getDrugInInventoryHistory(params) { // 根据drugId获取药品历史入库明细
    return await get('/hmm-stock/inInventory/drugInInventoryHistory/' + params)
  },
  async getDrugOutStorageHistory(params) { // 根据drugId获取药品历史出库情况
    return await get('/hmm-stock/outInventory/drugOutStorageHistory/' + params)
  },
  async getDrugReturnFlow(params) { // 退货流程
    return await get('/hmm-stock/inInventory/drugReturnFlow/' + params)
  },
  async getDrugPriceHistory(params) { // 价格走向
    return await get('/hmm-stock/adjustPriceD/drugPriceHistory/' + params)
  },
  async getDrugSalesAmount(params) { // 销售情况
    return await get('/hmm-stock/inInventory/drugSalesAmount/' + params.drugId, params)
  },
  async getDrugRefundFlow(params) { // 退药流程
    return await get('/finance-outp/refundApplyNew/drugRefundFlow/' + params.refundApplyOrderChargeDetailId + '/' + params.recipeCode)
  },
  async getDrugApplyFlow(params) { // 申请流程
    return await get('/hmm-stock/inInventory/drugApplyFlow/' + params)
  },
  // 获取当前库房信息
  async getCurDrugStorage() {
    return await get('/hmm-stock/strgPharRela/getCurDrugStorage')
  },
  async saveStockUpdate(params) { // 库存查询维护，药房信息保存批次可收费量
    return await post('/hmm-stock/stockD/update', params)
  }
};
