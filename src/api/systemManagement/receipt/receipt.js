import {post, get, put, del} from '@/utils/request'
const urlD = '/admin'
export default {

  // 查询票据入库信息
  async getReceiptList(params) {
    return await get("/finance-pub/receiptIn/selectIn", params);
  },
  // 票据入库
  async addReceipt(params){
    return await post("/finance-pub/receiptIn/in",params);
  },
  // 票据出库 （退回来源地。。。报废。。。）
  async receiptback(params){
    return await post("/finance-pub/receiptOut/out",params)
  },
  // 票据出库查询
  async getReceiptOutList(params){
    return await get("/finance-pub/receiptOut/getReceiptOut",params);
  },
  // 获取所有收费员
  async getMoneyUserList(){
    return await get(urlD+"/wadmin/dept-user/119/2");
  },
  // 更新出库状态 启用 停用
  async updateReceiptOut(params){
    return await put("/finance-pub/receiptOut/updateReceiptOut",params);
  },
  // 跳号
  async jumpNum(params){
    return await post("/finance-pub/receiptJumpNum/jumpNum",params);
  },
  // 票据退还
  async receiptBack(params){
    return await post("/finance-pub/receiptOut/back",params);
  },
  // 获取本院所有用户
  async getAllUser(data) {
    return await get('/finance-pub/dictionaryCatalog/getAllUserByHos', data, false);
  },
   // 获取字典值
   async getDictionaryPO(data) {
    return await get('/finance-pub/dictionary/getDictionaryPO', data, false);
  }

};
