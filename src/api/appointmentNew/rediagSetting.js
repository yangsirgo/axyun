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
  // 删除回诊配置信息
  async delRediagSettingById(data) {
    return await del('/appointment/rediagSetting/deleteRediagSettingById/'+data);
  },
  // 获取回诊配置信息
  async listPageRediagSetting(data) {
    return await get('/appointment/rediagSetting/listPageRediagSetting', data, false);
  },
  // 新增回诊配置信息
  async addRediagSetting(data) {
    return await post('/appointment/rediagSetting/addRediagSetting', data, false);
  },
  // 新增回诊配置信息
  async updateRediagSetting(data) {
    return await put('/appointment/rediagSetting/updateRediagSetting', data, false);
  },
}
