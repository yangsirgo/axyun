import {
    post,
    get,
    put,
    del
  } from '@/utils/request';
  
  export default {
    
    
    // 获取签到数据信息
    async listPageCheckInData(data) {
      return await get('/finance-si/operatorSign/getPageOperatorSignList', data, false);
    },
    // 签到接口
    async sign(data) {
      return await post('/finance-si/operatorSign/sign', data, false);
    },
    // 签退接口
    async signOut(data) {
      return await post('/finance-si/operatorSign/signOut', data, false);
    },
    // 获取医保类别
    async getPagemd(data) {
        return await get('/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000', data, false);
      },
  } 

  