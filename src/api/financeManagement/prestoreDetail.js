import {
    post,
    get,
    put,
    del
  } from '@/utils/request'
  
  
  
  export default {
    
    // 根据条件查询门诊预存明细
    async getListPagePrestoreDetail(data) {
      return await get('/finance-outp/prestoreDetail/getPrestore', data, false);
    },
    // 获取预存代码信息 不分页
    async listPrestoreCode(data) {
      return await get('/finance-outp/prestoreCode/listPrestoreCode', data, false);
    },
    // 查询可退款的预存充值记录
    async selectChargeByPatType(data){
      return await get('/finance-outp/prestoreDetail/selectChargeByPatType', data, false);
    },
    // 退款接口  支持原渠道退款（新）
    async refundPrestore(data){
      return await post('/finance-outp/prestoreDetail/refundprestore', data, false);
    },
    // 统计渠道可退款金额
    async refundMoneyByPayType(data){
      return await get('/finance-outp/prestoreDetail/refundMoneyByPayType', data, false);
    }
  }