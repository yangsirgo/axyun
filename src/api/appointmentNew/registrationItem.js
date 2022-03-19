import {
  post,
  get,
  put,
  del
} from '@/utils/request'

export default {
  // 查询挂号项目
  getDiagTreatTypeRegItemList(params) {
    return get("/finance-outp/diagTreatTypeRegItem/getDiagTreatTypeRegItemVOList", params);
  },
  // 新增挂号项目
  addDiagTreatTypeRegItem(params) {
    return post("/finance-outp/diagTreatTypeRegItem/addDiagTreatTypeRegItemVO", params);
  },
  // 修改挂号项目
  updateDiagTreatTypeRegItem(params) {
    return put("/finance-outp/diagTreatTypeRegItem/updateDiagTreatTypeRegItemVO", params);
  },
  // 删除挂号项目
  delDiagTreatTypeRegItem(params) {
    return del("/finance-outp/diagTreatTypeRegItem/delDiagTreatTypeRegItem/" + params);
  },
  // 获取收费项目名称
  getChargeItemList(params) {
    return get('/finance-pub/chargeItem/getChargeItem', params);
  }
}
