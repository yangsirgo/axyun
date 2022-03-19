import { post, get, put, del } from "@/utils/request";

const url = "/common";
const urlA = "/admin";
//------------ 以上为药房药库公共方法 ---------------------

export default {
  // 药品调入
  async importDrug(params) {
    return await post(`/hmm-stock/groupDrug/importDrug`, params);
  },
  async listStockD(params) {
    return await post(`/hmm-stock/stockD/${params.id}`, params);
  },
  // 2021-06-10
  // 发药明细
  async listForDeliveryRecipe(params) {
    return await get("/hmm-stock/report/listForDeliveryRecipe", params);
  },
  // 2020/11/14
  // 特殊药品使用情况统计
  async listForPha(params) {
    return await get("/hmm-stock/outStorageD/listForPha", params);
  },
  //药品阶段性销售统计 /hmm-stock/inStorageD/listForOutIn
  async listForOutIn(params) {
    return await get("/hmm-stock/inStorageD/listForOutIn", params);
  },
  // 门诊基本药物使用情况统计
  async listBasicDrug(params) {
    return await get("/hmm-stock/recipe/listBasicDrug", params);
  },
  // 处方费别统计   http://127.0.0.1:9400/hmm-stock/recipe/listForCompany
  async listForCompany(params) {
    return await get("/hmm-stock/recipe/listForCompany", params);
  },
  // 免费药品发放量统计表 /hmm-stock/recipeD/listForFree
  async listForFree(params) {
    return await get("/hmm-stock/recipeD/listForFree", params);
  },
  // /hmm-stock/recipeD/listForCentralizedPurchasing    4+7药品使用情况统计
  async listForCentralizedPurchasing(params) {
    return await get("/hmm-stock/recipeD/listForCentralizedPurchasing", params);
  },
  // 配送统计
  async listForDecoction(params) {
    return await get("/hmm-stock/recipe/listForDecoction", params);
  },
  // 左侧数据
  async listForDelivery(params) {
    return await get("/hmm-stock/report/listForDelivery", params);
  },
  // 右侧数据
  async listForDeliveryD(params) {
    return await get("/hmm-stock/report/listForDeliveryD", params);
  },
  // 长处方统计（明细）
  async listForLongRecipeD(params) {
    return await get("/hmm-stock/recipeD/listForLongRecipeD", params);
  },
  // 长处方统计（汇总）/hmm-stock/recipeD/listForLongRecipe
  async listForLongRecipe(params) {
    return await get("/hmm-stock/recipeD/listForLongRecipe", params);
  },

  // 2020/11/14

  //数据据字典
  async getDictListForCode(code) {
    return await get(urlA + "/wdata/dic/single/" + code);
  },

  //发药人
  async getuserList(id) {
    return await get(urlA + "/wadmin/dept-user/" + id + "/8");
  },
  // 供应商支持拼音五笔搜索
  getOtherSupplier(data) {
    return post(urlA + "/wdata/dic/singles/gb/vals", data);
  },
  //供应商字典
  async getSupplier() {
    return this.getDictListForCode("DrugSupplier");
  },
  //产地--药品生产厂商
  async getOrigin() {
    return this.getDictListForCode("Manufacturer");
  },
  //产地标识--药品厂商标识
  async getOriginIdentification() {
    return this.getDictListForCode("DrugManufacturerFlag");
  },
  //源产地
  // async getOriginManufacturer() {
  //   return this.getDictListForCode("origin_manufacturer")
  // },
  //药房药库
  async getDrugStorage(params) {
    return await get("/hmm-stock/drgstrg/listForDropDown/" + params);
  },
  //药房药库 all
  async getDrugStorageA(params, a) {
    return await get(
      "/hmm-stock/drgstrg/listForDropDown/" + params + "?isAll=" + a
    );
  },
  // 获取当前药房跟库存对照药房
  async getCurDrugStorage() {
    return await get("/hmm-stock/strgPharRela/getCurDrugStorage");
  },
  // 退药申请，获取当前药房跟库存对照药房
  async getDropDown(params) {
    return await get("/hmm-stock/apply/listForDropDown/" + params);
  },
  // 发药窗口
  async pharWindowForDropDown(params) {
    const { data } = await get(
      "/hmm-stock/pharWindow/listForDropDown",
      params,
      true
    );
    return data || {};
  },
  //窗口暂停
  async pharWindowchangeStatus(params) {
    return await post("/hmm-stock/pharWindow/changeStatus", params, true);
  },

  //窗口状态
  async pharpharWindowtype(id) {
    return await get("/hmm-stock/pharWindow/get/" + id);
  },
  async getAssociation(params) {
    //药品搜索联想数据
    return await get("/hmm-stock/drug/listForDrugExt", params);
  },
  async getTakeStockWindowDrug(windowCode, params) {
    //盘存窗口输入定位药品搜索
    return await post(
      "/hmm-stock/takeStockWindowD/lock/" + windowCode + "?name=" + params
    );
  },
  async getDrugListFormSupplier(params) {
    //药品搜索联想数据（供应商）
    return await get("/hmm-stock/drug/listForInInventory", params);
  },
  async getAssociationBatch(params) {
    //药品搜索联想数据
    return await get("/hmm-stock/drug/listForDrugExtBatch", params);
  },
  async getDrugList(params) {
    return await get("/hmm-stock/drug/forPage", params, false);
  },
  async getGroupDrugList(params) {
    return await get("/hmm-stock/groupDrug/forPage", params, false);
  },
  //药品字典右侧数据drug/get
  async getDrugId(id) {
    return await get("/hmm-stock/drug/get/" + id);
  },
  //药品字典右侧数据drug/get
  async getGroupDrugId(id) {
    return await get("/hmm-stock/groupDrug/get/" + id);
  },
  //药品字典保存
  async adddrug(params) {
    return await post("/hmm-stock/drug/save", params, true);
  },
  //药品字典保存
  async addGroupDrug(params) {
    return await post("/hmm-stock/groupDrug/save", params, true);
  },

  async updatePharWindow(id, params) {
    const { data } = await put("/hmm-stock/pharWindow/update" + id, params);
    return data || {};
  },
  async pausePharWindow(params) {
    const { data } = await post("/hmm-stock/pharWindow/pause", params);
    return data || {};
  },
  // 基数数据维护-药品字典-附加属性
  async attributeType() {
    const { data } = await get("/hmm-stock/attributeType/listForDropDown");
    return data || {};
  },
  async attributeTyperight(params) {
    const { data } = await get("/hmm-stock/attributeType/listByCode", params);
    return data || {};
  },

  //招标药品列表
  async getbidDrugList(params) {
    return await get("/hmm-stock/bidDrug/forPage", params, true);
  },
  //招标保存
  async saveBidDrug(params) {
    return await post("/hmm-stock/bidDrug/save", params, true);
  },
  //招标删除
  async delbidDrug(ids) {
    return await del("/hmm-stock/bidDrug/batch", ids);
  },

  //库房对照列表
  async getstrgPharRelaList(params) {
    const data = await get("/hmm-stock/strgPharRela/forPage", params, true);
    return data || {};
  },

  //皮试药品列表
  async getstDrugList(params) {
    return await get("/hmm-stock/stDrug/forPage", params, true);
  },
  //皮试保存
  async saveStDrug(params) {
    return await post("/hmm-stock/stDrug/save", params, true);
  },
  //皮试删除
  async delestDrug(ids) {
    return await del("/hmm-stock/stDrug/batch", ids);
  },

  //药房信息
  async getPharmacy(params) {
    return await get("/hmm-stock/pharmacy/forPage", params, true);
  },
  //药房信息保存
  async addpharmacy(params) {
    return await post("/hmm-stock/pharmacy/save", params, true);
  },
  async delpharmac(ids) {
    return await del("/hmm-stock/pharmacy/delete/" + ids);
  },

  //药库信息
  async getDrgstrg(params) {
    return await get("/hmm-stock/drgstrg/forPage", params, true);
  },
  //药库信息保存
  async adddrgstrg(params) {
    return await post("/hmm-stock/drgstrg/save", params, true);
  },

  //药库信息删除
  async deldrgstrg(ids) {
    return await del("/hmm-stock/drgstrg/batch", ids);
  },

  //库房对照
  async getStrgPharRela(params) {
    return await get("/hmm-stock/strgPharRela/forPage", params, true);
  },
  //库房对照右侧数据
  async getstrgPharRelaget(pharCode) {
    return await get("/hmm-stock/strgPharRela/get/" + pharCode);
  },
  //库房对照保存
  async addStrgPharRela(params) {
    return await post("/hmm-stock/strgPharRela/save", params);
  },
  //库房对照删除
  async delsTrgPharRela(params) {
    return await del("/hmm-stock/strgPharRela/batch", params);
  },
  // 台账查询
  async forLedger(params) {
    return await get("/hmm-stock/inStorageD/forLedger", params);
  },
  async getDoctorList(params) {
    // 获取医生列表
    return await get(urlA + "/wadmin/hos-doctor", params);
  },
  async getlistForDropDown(params) {
    // 获取库房列表
    return await get("/hmm-stock/stock/listForDropDown", params);
  },
  async getListForPage(params) {
    // 获取药房库存统计
    return await get("/hmm-stock/stock/forPage", params);
  },
  async getIsOpen() {
    // 是否精确批次
    return await get("/admin/params/params", {
      paramName: "IN_ID"
    });
  },
  async getDrugExtBatch(params) {
    // 获取药品批号
    return await get("/hmm-stock/drug/listForDrugExtBatch", params);
  },
  async getFormList(params) {
    // 剂型维护列表
    return await get("/hmm-stock/form/forPage", params);
  },
  async formSave(params) {
    // 剂型维护保存
    return await post("/hmm-stock/form/save", params);
  },
  async getFrequencyPageList(params) {
    // 频率维护列表
    return await get(url + "/frequency/pageList", params);
  },
  async frequencyFormSave(params) {
    // 频率维护保存
    return await post(url + "/frequency/save", params);
  },
  async getListForUnselectedDrug(params) {
    // 可导入药品品种查询
    return {};
  },
  async getListForDrug(params) {
    // 库房药品品种查询
    return {};
  },
  async importInitDrug(params) {
    // 药品导入
    return {};
  },
  async getStockDForPage(params) {
    return await get("/hmm-stock/stockD/forPage", params);
  },
  async getStockMonthReport(params) {
    // 月明细报表
    return await get("/hmm-stock/stockMonth/getStockMonthReport", params);
  },
  async getSelectLocation(params) {
    // 位置大类下拉
    return await get("/hmm-stock/locationSort/listForDropDown/" + params);
  },
  async getDBstorageListApi(params) {
    // 获取库房调拨的药房
    return await get("/hmm-stock/drgstrg/listForDropDown/1", params);
  },
  // 机器下拉
  getMachineSelect(params) {
    return get("/hmm-stock/machine/listForDropDown", params);
  },
  // 机器维护列表
  getMachineList(params) {
    return get("/hmm-stock/machine/forPage", params);
  },
  // 添加发药机
  addMachine(params) {
    return post("/hmm-stock/machine/save", params);
  },
  // 机器药品维护列表
  getMachineDrugList(params) {
    return get("/hmm-stock/machineDrugR/forPage", params);
  },
  addMachineDrug(params) {
    return post("/hmm-stock/machineDrugR/save", params);
  },
  deleteMachineDrug(ids) {
    return del("/hmm-stock/machineDrugR/batch", ids);
  },
  // 处方发药  1  弃用 现在保存配方地址的是 中草药的，i面的保存地址
  saveDelive(params) {
    return post("/hmm-stock/recipe/save", params);
  },

  // 附加属性查询
  getAttrList(params) {
    return get("/hmm-stock/attributeType/forPage", params);
  },

  // 新增或者修改附加属性查询
  addOrModifyAttribute(params) {
    return post("/hmm-stock/attributeType/save", params);
  },

//获取高低储列表
  async getStockMaxMINForPage(params) {
    return await get("/hmm-stock/stock/forPage", params);
  },
  //高低储-导出
  async exportStockExcel (params){
    return await post("/hmm-stock/export/exportStock", params, false, '', 'blob');
  },
  //各类入库-导出
  async exportInStorageD (params){
    return await post("/hmm-stock/export/exportInStorageD", params, false, '', 'blob');
  },
  //医生站-获取等候超过十分钟待诊患者数量
  async getTimeoutPatients(params) {
    return await get("/appointment/outpAppt/getTimeoutPatients", params);
  },
  //挂号收费-获取部门患者
  async getTimeoutPatientsToCashier(params) {
    return await get("/appointment/outpAppt/getTimeoutPatientsToCashier", params);
  },
  //基础数据-药品信息-导出
  async exportDrug(params){
    return await post("/hmm-stock/export/exportDrug", params, false, '', 'blob');
  },
  //基础数据-财务项目-获取产地-分页加载方式
  async getOrginCode(params) {
    return await get(urlA + "/cnfFieldValue/datas", params);
  },
//基础数据-药品信息-导出
  async exportStockDSum(params){
    return await post("/hmm-stock/export/exportStockDSum", params, false, '', 'blob');
  },
};
