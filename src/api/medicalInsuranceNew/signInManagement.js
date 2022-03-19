import {
  post,
  get,
  put,
  del
} from '@/utils/request'
let url = "/finance-si"
export default {
  // 查询签到数据
  async getPageOperatorSignList(params) {
    return await get(url + "/operatorSign/getPageOperatorSignList", params, true);
  },
  // 签到接口
  async signIn(params) {
    return await post(url + "/si-pub-one-stop-biz/sign-in", params, true);
  },
  // 签退接口
  async signOut(params) {
    return await post(url + "/si-pub-one-stop-biz/sign-out", params, true);
  },
}
