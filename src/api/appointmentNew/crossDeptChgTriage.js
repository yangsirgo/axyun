import {
  post,
  get,
  put,
  del
} from '@/utils/request';
const urlA = '/admin'
export default {
  // 获取科室信息
  async getDeptList() {
    return await get(urlA+'/wadmin/hos/dept');
  },
  // 科室类型
  async getDeptType() {
    return await get('/appointment/dictValue/getPageDictValueList?dictItemCode=A0006');
  },
  // 删除跨部门换诊信息
  async delCrossDeptChgTriageById(data) {
    return await del('/appointment/crossDeptChgTriage/deleteCrossDeptChgTriageById/'+data);
  },
  // 获取跨部门换诊信息
  async listPageCrossDeptChgTriage(data) {
    return await get('/appointment/crossDeptChgTriage/listPageCrossDeptChgTriage', data, false);
  },
  // 新增跨部门换诊信息
  async addCrossDeptChgTriage(data) {
    return await post('/appointment/crossDeptChgTriage/addCrossDeptChgTriage', data, false);
  },
  // 新增跨部门换诊信息
  async updateCrossDeptChgTriage(data) {
    return await put('/appointment/crossDeptChgTriage/updateCrossDeptChgTriage', data, false);
  },
}
