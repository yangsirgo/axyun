import {
  post,
  get,
  put,
  del
} from '@/utils/request'

export default {

  async getWarehousingList(queryData) { //入库单列表数据查询
    return await get("/hmm-stock/inInventory/forPage", queryData);
  },

  async getInInventoryD(id) { //查询入库单的药品明细
    return await get("/hmm-stock/inInventoryD/detail/" + id);
  },

  async saveWarehousingList(params) { //入库单及明细数据保存或修改数据
    return await post("/hmm-stock/inInventory/saveOrUpdateMulti", params);
  },


  async submitWarehousingList(id) { //提交入库单
    return await put("/hmm-stock/inInventory/submit/" + id);
  },

  async deleteWarehousingList(id) { //删除入库单
    return await del("/hmm-stock/inInventory/delete/" + id);
  }


};
