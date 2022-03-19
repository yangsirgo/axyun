import {
    post,
    get,
    put,
    del
  } from '@/utils/request'
  
  
  
  export default {
    // 获取预存类型
    async getPrestorType(data) {
        return await get('/finance-pub/dictionary/listDictionaryByCataCode?cataCode=F0008');
      },
    // 删除预存代码信息
    async delPrestoreCodeById(data) {
      return await del('/finance-outp/prestoreCode/deletePrestoreCodeById/'+data);
    },
    // 获取预存代码信息
    async listPagePrestoreCode(data) {
      return await get('/finance-outp/prestoreCode/listPagePrestoreCode', data, false);
    },
    // 新增预存代码信息
    async addPrestoreCode(data) {
      return await post('/finance-outp/prestoreCode/addPrestoreCode', data, false);
    },
    // 新增预存代码信息
    async updatePrestoreCode(data) {
      return await put('/finance-outp/prestoreCode/updatePrestoreCode', data, false);
    },
    
  }