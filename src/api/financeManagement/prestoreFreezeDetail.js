import {
    post,
    get,
    put,
    del
  } from '@/utils/request'
  
  
  
  export default {
   
    // 获取预存冻结信息
    async listPagePrestoreFreezeDetail(data) {
      return await get('/finance-outp/prestoreFreezeDetail/listPagePrestoreFreezeDetail', data, false);
    },// 获取预存代码信息 不分页
    async listPrestoreCode(data) {
        return await get('/finance-outp/prestoreCode/listPrestoreCode', data, false);
      }
    
  }