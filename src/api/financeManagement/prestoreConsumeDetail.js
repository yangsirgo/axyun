import {
    post,
    get,
    put,
    del
  } from '@/utils/request'
  
  
  
  export default {
    
    // 根据条件查询账户信息数据接口
    async getListPrestoreConsumeDetail(data) {
      return await get('/finance-outp/prestoreConsumeDetail/getPrestoreConsumeDetail', data, false);
    },
    // 获取预存代码信息 不分页
    async listPrestoreCode(data) {
      return await get('/finance-outp/prestoreCode/listPrestoreCode', data, false);
    }
  }