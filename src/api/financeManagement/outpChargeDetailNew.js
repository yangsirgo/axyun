import {
    post,
    get,
    put,
    del
  } from '@/utils/request'



  export default {

    // 根据条件查询账户信息数据接口
    async getListPageOutpChargeDetailNew(data) {
      return await get('/finance-outp/outpChargeDetailNew/listPageOutpChargeDetailNew', data, false);
    },
    // 查询分类码
    async getClassCodePO(data) {
      return await get('/finance-pub/classCode/getClassCodePO', data, false);
    }
  }
