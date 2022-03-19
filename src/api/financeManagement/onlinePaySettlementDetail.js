import {
    post,
    get,
    put,
    del
  } from '@/utils/request'
  
  
  
  export default {
    
    // 获取线上支付结算信息明细
    async getListPageOnlinePaySettlementDetail(data) {
      return await get('/finance-pub/onlinePaySettlementDetail/listPageOnlinePaySettlementDetail', data, false);
    },
    
  }