import {
  post,
  get,
  put,
  del
} from '@/utils/request'
let url = "/finance-si"
export default {
  // 查询特慢病备案数据
  async opspDiseFind(params) {
    return await post(url + "/si02/personRecord/opsp_dise_find", params, true);
  },
  // 新增特慢病备案数据
  async opspDiseRecord(params) {
    return await post(url + "/si02/personRecord/opsp_dise_record", params, true);
  },
  // 撤销特慢病备案数据
  async deleteOpspDise(params) {
    return await post(url + "/si02/personRecord/delete_opsp_dise", params, true);
  }
}