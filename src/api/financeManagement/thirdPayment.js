import {
    post,
    get,
    put,
    del
  } from '@/utils/request'



  export default {

    // 根据条件查询账户信息数据接口
    async payManageController(data) {
      return await post('/finance-pub/payManageController/onlinePayList', data, false);
    },

  }
