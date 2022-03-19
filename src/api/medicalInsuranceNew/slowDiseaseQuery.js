import {
    post,
    get,
    put,
    del
  } from '@/utils/request'
  let url = "/finance-si"
  export default {
    // 查询医保特慢病备案数据
    async getOpspDise(params) {
      return await post(url + "/si02/personRecord/getOpspDise", params, true);
    }
  }