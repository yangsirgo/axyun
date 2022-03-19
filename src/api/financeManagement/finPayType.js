import {
  post,
  get,
  put,
  del
} from '@/utils/request'



export default {
  // 获取字典值
  async getDictionaryPO(data) {
    return await get('/finance-pub/dictionary/getDictionaryPO', data, false);
  },
  // 获取字典值
  async delPayTypeById(data) {
    return await del('/finance-pub/payType/deletePayTypeById/' + data);
  },
  // 获取支付方式
  async listPagePayType(data) {
    return await get('/finance-pub/payType/listPagePayType', data, false);
  },
  // 新增支付方式
  async addPayType(data) {
    return await post('/finance-pub/payType/addPayType', data, false);
  },
  // 新增支付方式
  async updatePayType(data) {
    return await put('/finance-pub/payType/updatePayType', data, false);
  },
  // 支付渠道
  async getPayChannelCode() {
    return await get('/finance-pub/dictionary/listDictionaryByCataCode?cataCode=F0004');
  },
  // 支付金额类别
  async getPayAmtClass() {
    return await get('/finance-pub/dictionary/listDictionaryByCataCode?cataCode=F0001');
  }
}
