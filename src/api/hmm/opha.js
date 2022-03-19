import { post, get, put, del } from "@/utils/request";

export default {
  async batchDelivery(params) {
    return await post("/hmm-stock/recipe/batchDelivery", params, false, 180000);
  },
  async list(params) {
    return await get("/hmm-stock/recipe/list", params);
  },
  async listD(params) {
    return await get("/hmm-stock/recipeD/list", params);
  },
  async listForRecipe(params) {
    return await get("/hmm-stock/recipe/listForRecipe", params);
  },

  //读卡
  async swipe(data) {
    return await get("/hmm-stock/recipe/swipe", data);
  },
  async dispense(id) {
    return await post("/hmm-stock/recipe/dispense/" + id, {});
  },
  async dispenseWithParam(id, param) {
    return await post("/hmm-stock/recipe/dispense/" + id, param);
  },
  async cancelDelivery(id) {
    return await post("/hmm-stock/recipe/cancelDelivery/" + id, {});
  },
  async delivery(id, param) {
    return await post("/hmm-stock/recipe/delivery/" + id, param);
  },
  async get(id) {
    return await get("/hmm-stock/recipe/get/" + id, {});
  },
  async getByBatch(id) {
    return await get("/hmm-stock/recipe/getByBatch/" + id);
  },
  async listForRefund(params) {
    return await get("/hmm-stock/recipe/listForRefund", params);
  },
  async getRefund(params) {
    return await get("/hmm-stock/recipe/getRefund", params);
  },
  async refund(params) {
    return await post("/hmm-stock/recipe/refund", params);
  },
  async printDispense(id) {
    return await get("/hmm-stock/recipe/printDispense/" + id);
  },
  async printLabel(id) {
    return await get("/hmm-stock/recipe/printLabel/" + id);
  },
  async rpCheckGet(params) {
    // 审方详情
    return await get("/hmm-stock/recipe/get/" + params);
  },
  async rpCheck(id, params) {
    // 审方接口
    return await post("/hmm-stock/recipe/check/" + id, params);
  },
  async rpFeedback(id, params) {
    // 审核反馈接口
    return await post("/hmm-stock/recipe/feedback/" + id, params);
  },
  async getFirstRecipe() {
    // 获取待审处方
    return await get("/hmm-stock/recipe/getFirstRecipe");
  },
  async listForCheck(params) {
    return await get("/hmm-stock/recipe/listForCheck", params);
  },
  async listForSkin(params) {
    // 皮试结果工具箱列表
    return await get("/hmm-stock/recipeD/listForSkin", params);
  },
  async recipeInspection(params) {
    // 处方抽查处方列表
    return await get("/hmm-stock/recipeInspection/forPage", params);
  },
  async recipeIn(params) {
    // 处方抽查右侧表格
    return await get("/hmm-stock/recipeInspection/inspection", params);
  },
  async saveMulti(params) {
    // 处方抽查保存
    return await post("/hmm-stock/recipeInspection/saveMulti", params);
  },
  async recipeComment(id, params) {
    // 点评保存
    return await post("/hmm-stock/recipeComment/comment/" + id, params);
  },
  async getByRecipeCode(params) {
    // 点评保存
    return await get("/hmm-stock/recipeHerbReg/getByRecipeCode/" + params);
  },
  async regSave(params) {
    return await post("/hmm-stock/recipeHerbReg/save", params);
  },
  async recipeInsEnd(params) {
    // 完成点评
    return await post("/hmm-stock/recipeInspection/end/" + params);
  },
  async recipeRightData(params) {
    return await get("/hmm-stock/recipeComment/list", params);
  },
  async recipeRightDetail(params) {
    return await get("/hmm-stock/recipeComment/get/" + params);
  },
  async recipeDrugBatch(params) {
    // 处方发药批次明细
    return await get("/hmm-stock/recipeDrugBatch/list/" + params);
  },
  async getByDetailId(params) {
    // 住院医嘱汇总批次明细
    return await post("/hmm-stock/inpExeDrugBatch/getByDetailId", params);
  },
  async addOrUpDocPrintTemplate(data) {
    // 中草药-地址配送保存接口
    return await post("/hmm-stock/recipe/addOrUpDocPrintTemplate", data);
  },
  async sendToThird(data) {
    return await post("/hmm-stock/recipe/sendToThird", data);
  },
  recipeDispense() {
    return post("/hmm-stock/recipe/dispense");
  }
};
