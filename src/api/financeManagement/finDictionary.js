import {
  post,
  get,
  put,
  del
} from '@/utils/request'

export default {
  // 查询目录列表
  async getDictionaryCatalogPOsByPage(data) {
    return await get('/finance-pub/dictionaryCatalog/getDictionaryCatalogPOsByPage', data, false);
  },
  // 新增目录
  async addDictionaryCatalogPO(data) {
    return await post('/finance-pub/dictionaryCatalog/addDictionaryCatalogPO', data, false);
  },
  // 修改目录
  async updateDictionaryCatalogPO(data) {
    return await put('/finance-pub/dictionaryCatalog/updateDictionaryCatalogPO', data, false);
  },
  // 删除目录
  async delDictionaryCatalogPO(data) {
    return await del('/finance-pub/dictionaryCatalog/delDictionaryCatalogPO/' + data.cataId, data, false);
  },
  // 查询字典列表
  async getDictionaryPOsByPage(data) {
    return await get('/finance-pub/dictionary/getDictionaryPOsByPage', data, false);
  },
  // 新增字典
  async addDictionaryPO(data) {
    return await post('/finance-pub/dictionary/addDictionaryPO', data, false);
  },
  // 修改字典
  async updateDictionaryPO(data) {
    return await put('/finance-pub/dictionary/updateDictionaryPO', data, false);
  },
  // 删除字典
  async delDictionaryPO(data) {
    return await del('/finance-pub/dictionary/delDictionaryPO'+'/'+data.id, data, false);
  }
}
