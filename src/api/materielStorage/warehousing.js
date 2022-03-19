import {
  post,
  get,
  put,
  del
} from '@/utils/request'

export default {
  //物资管理-物资字典-物资项目
  async getGoodsList(params) {
    return await get("/hmm-stock/goods/forPage", params);
  },
  //物资字典保存
  async addGoods(params) {
    return await post("/hmm-stock/goods/save", params, true);
  },
  //物资字典右侧数据drug/get
  async getGoodsId(id) {
    return await get("/hmm-stock/goods/get/" + id);
  },

  async getWarehousingList(queryData) { //入库单列表数据查询
    return await get("/hmm-stock/inbound/forPage", queryData);
  },

  async getInInventoryD(id) { //查询入库单的药品明细
    return await get("/hmm-stock/inbound/multi/" + id);
  },

  async saveWarehousingList(params) { //入库单及明细数据保存或修改数据
    return await post("/hmm-stock/inbound/saveOrUpdateMulti", params);
  },

  async deleteWarehousingList(params) { //删除入库单
    return await post("/hmm-stock/inbound/delete/", params);
  },

  async getWarehousingCheck(queryData) { //物资库存查询
    return await get("/hmm-stock/inboundD/forPage", queryData);
  },

  async getOutboundList(queryData) { //出库单列表数据查询
    return await get("/hmm-stock/outbound/forPage", queryData);
  },

  async getOutboundMulti(id) { //查询出库单的药品明细
    return await get("/hmm-stock/outbound/multi/" + id);
  },

  async getDeptList() { //查询部门
    return await get("/admin/org/dept-list");
  },

  async getReceiver (queryData) { //查询领用人
    return await get("/admin/wadmin/hos-user-name", queryData);
  },

  async getAssociation(params) {
    //搜索联想数据-查询物资库存
    return await get("/hmm-stock/inboundD/forStock", params);
  },
  async getAssociationList(params) {
    //搜索联想数据-查询物资批次库存
    return await get("/hmm-stock/inboundD/forPage", params);
  },
  async saveOutWarehousingList(params) { //出库单及明细数据保存或修改数据
    return await post("/hmm-stock/outbound/saveOrUpdateMulti", params);
  },
  async deleteOutboundList(params) { //删除出库单
    return await post("/hmm-stock/outbound/delete/", params);
  },

};
