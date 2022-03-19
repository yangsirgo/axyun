import {
  post,
  get,
  put,
  del
} from '@/utils/request'

export default {

  async batchApplyList(params) { //获取批量采购数据
    return await get("/hmm-stock/apply/forApply", params);
  },

  async getPurchaseList(queryData) { //采购单列表数据查询
    return await get("/hmm-stock/purchase/forPage", queryData);
  },

  async getPurchaserDetail(purchaserId) { //查询采购单的药品明细
    return await get("/hmm-stock/purchaseD/detail/" + purchaserId);
  },

  async savePurchaseList(params) { //采购单及明细数据保存或修改数据
    return await post("/hmm-stock/purchase/saveOrUpdateMulti", params);
  },

  async modifyPurchaseList(params) { //修改采购单数据
    return await put(
      "/hmm-stock/purchase/update", params
    );
  },

  async submitPurchaseList(id) { //提交采购单
    return await put("/hmm-stock/purchase/submit/" + id);
  },

  async deletePurchaseList(id) { //删除采购单
    return await del("/hmm-stock/purchase/" + id);
  },

  async checkPurchaseList(params) { //审核采购单
    return await post("/hmm-stock/purchase/review", params);
  },
  async savePurchaseTem(params) { // 采购单模板保存
    return await post("/hmm-stock/purchaseTemplate/saveMulti", params);
  },
  async getPurchaseTemList(params) { // 采购单模板列表
    return await get("/hmm-stock/purchaseTemplate/forPage", params);
  },
  async getPurchaseTemDrugList(params) { // 采购单模板列表药片列表
    return await get("/hmm-stock/purchaseTemplate/multi/" + params);
  },
  async deletePurchaseTemplate(params) { // 删除采购单模板
    return await del("/hmm-stock/purchaseTemplate/" + params);
  }
};
