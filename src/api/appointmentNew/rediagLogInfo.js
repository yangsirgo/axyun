import {
    post,
    get,
    put,
    del
  } from '@/utils/request';
  
  export default {
    
    // 获取跨部门换诊信息
    async getListPageRediagLogInfo(data) {
      return await get('/appointment/rediagLogInfo/listPageRediagLogInfo', data, false);
    }
  }
  