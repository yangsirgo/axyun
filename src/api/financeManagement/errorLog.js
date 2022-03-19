import {
    post,
    get,
    put,
    del
  } from '@/utils/request'
  
  
  
  export default {
    
    // 获取财务错误日志
    async getListPageErrorLog(data) {
      return await get('/finance-pub/errorLog/listPageErrorLog', data, false);
    },
    
  }