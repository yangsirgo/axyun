import { post, get, put, del } from '@/utils/request'
const url = '/common';
// let _api = 'http://192.168.198.244:8762'
export default {
  async getTempNameList(params) {//根据模板名称模糊查询
    const {data} = await get(url+'/tempName/getTempNameList', params);
    return data || {};
  },
  async updateTempName(params) {//修改模板名称
    const data = await put(url+'/tempName/updateTempName' , params);
    return data || {};
  },
  async deleteTempName(params) {//删除模板名称，同时删除其关联的明细
    const data = await del(url+'/tempName/deleteTemp', params);
    return data || {};
  },

  async addTempName(params) {//添加模板名称
    const data = await post(url+'/tempName/addTempName', params);
    return data || {};
  },

  async getTempDoctorDiag(params) {//查询模板明细
    const data = await get(url+'/tempDoctorDiag/getTempDoctorDiagByTempId', params);
    return data || {};
  },
  async addTempDoctorDiag(params) {//添加模板明细
    const data = await post(url+'/tempDoctorDiag/addTempDoctorDiag', params)
    return data || {};
  },
  async updateTempDoctorDiag(params) {//修改模板明细
    const data = await put(url+'/tempDoctorDiag/updateTempDoctorDiag', params)
    return data || {};
  },
  async delTempDoctorDiag(id) {//删除模板明细
    const data = await del(url+'/tempDoctorDiag/' + id)
    return data || {};
  },





}
