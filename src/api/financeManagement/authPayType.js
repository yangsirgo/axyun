import {
    post,
    get,
    put,
    del
  } from '@/utils/request'
  
  
  
  export default {
    
    // 删除支付方式授权
    async delAuthPayTypeById(data) {
      return await del('/finance-pub/authPayType/deleteAuthPayTypeById/'+data);
    },
    // 获取支付方式授权
    async listPageAuthPayType(data) {
      return await get('/finance-pub/authPayType/listPageAuthPayType', data, false);
    },
    // 新增支付方式授权
    async addAuthPayType(data) {
      return await post('/finance-pub/authPayType/addAuthPayType', data, false);
    },
    // 新增支付方式授权
    async updateAuthPayType(data) {
      return await put('/finance-pub/authPayType/updateAuthPayType', data, false);
    },
    
  }