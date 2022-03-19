import {
  post,
  get,
  put,
  del
} from '@/utils/request'

const url = '/admin'

export default {

  // 查询目录列表
  async getDictionaryCatalogPOsByPage(data) {
    return await get(url+'/cnfdiccatalog/getDictionaryCatalogByPage', data, false);
  },
  // 新增目录
  async addDictionaryCatalogPO(data) {
    return await post(url+'/cnfdiccatalog/addDictionaryCatalog', data, false);
  },
  // 修改目录
  async updateDictionaryCatalogPO(data) {
    return await put(url+'/cnfdiccatalog/updateDictionaryCatalog', data, false);
  },
  // 删除目录
  async delDictionaryCatalogPO(data) {
    return await del(url+'/cnfdiccatalog/delDictionaryCatalog/'+ data.cataLogId, data, false);
  },
  // 查询字典列表
  async getDictionaryPOsByPage(data) {
    return await get(url+'/cnfdic/getDictionaryByPage', data, false);
  },
  // 新增字典
  async addDictionaryPO(data) {
    return await post(url+'/cnfdic/addDictionary', data, false);
  },
  // 修改字典
  async updateDictionaryPO(data) {
    return await put(url+'/cnfdic/updateDictionary', data, false);
  },
  // 删除字典
  async delDictionaryPO(data) {
    return await del(url+'/cnfdic/delDictionary/' + data.id, data, false);
  },
  // 查询字典详情
  async getDictionaryInfo(data) {
    return await get(url+`/cloud-conf/bizdic-one/${data.catalogCode}/${data.dicCode}/${data.hosId}`, {}, false);
  },
  // 查询字典详情
  async getDictionaryPOs(data) {
    return await get(url+`/cloud-conf/bizdic-list/${data.catalogCode}/${data.hosId}`, {}, false);
  }

}
