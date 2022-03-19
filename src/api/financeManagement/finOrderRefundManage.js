import {
  post,
  get,
  put,
  del
} from '@/utils/request'



export default {
  // 删除退费医嘱信息
  async delOrderRefundManageById(data) {
    return await del('/finance-pub/orderRefundManage/deleteOrderRefundManageById/'+data);
  },
  // 获取退费医嘱信息
  async listPageOrderRefundManage(data) {
    return await get('/finance-pub/orderRefundManage/listPageOrderRefundManage', data, false);
  },
  // 新增退费医嘱信息
  async addOrderRefundManage(data) {
    return await post('/finance-pub/orderRefundManage/addOrderRefundManage', data, false);
  },
  // 新增退费医嘱信息
  async updateOrderRefundManage(data) {
    return await put('/finance-pub/orderRefundManage/updateOrderRefundManage', data, false);
  },
  
}