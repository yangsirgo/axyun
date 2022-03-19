import {post, get, put, del} from '@/utils/request'

export default {

//   async batchApplyList(params) {//获取批量采购数据
//     return await get("/apply/forApply",params);
//   },

  async getBackStockList(params) {//退回单列表数据查询
    return await get("/hmm-stock/backStock/forPage", params);
  },

  async getBackStocDetail(backId) {//查询退回单的药品明细
    return await get("/hmm-stock/backStockD/detail/" + backId);
  },

  async saveBackStockList(params) {//退回单及明细数据保存
    return await post("/hmm-stock/backStock/saveOrUpdateMulti", params);
  },

//   async modifyPurchaseList(params) {//修改采购单数据
//     return await put(
//       "/purchase/update", params
//     );
//   },
  async submitBackStockList(backId) {//提交退回单
    return await put("/hmm-stock/backStock/submit/" + backId);
  },

  async deleteBackStockList(id) {//删除退回单
    return await del("/hmm-stock/backStock/" + id);
  }

};
