import {
    post,
    get,
    put,
    del
  } from '@/utils/request';
  
  export default {
    
    
    // 获取医保日志信息
    async listPageSiLogData(data) {
      return await get('/finance-si/log/getPageLogList', data, false);
    },
    
    // 获取医保类别
    async getPagemd(data) {
        return await get('/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000', data, false);
      },
  } 

  