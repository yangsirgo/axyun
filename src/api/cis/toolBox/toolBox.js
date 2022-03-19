import { post, get, put, del } from '@/utils/request'

const urlA = '/outpatient';
export default {
    async getRecord(params) {//根据条件获取预约和挂号信息接口
    const data = await get('/appointment/outpAppt/getHisList', params);
    return data || {};
  },






  }

export function getByTypeAndName(params) {//根据条件查询处方模板接口
  return get(urlA+`/outpatientCisTemp/selectByTypeAndName/${params.type}/${params.pageNum}/${params.pageSize}/${params.itemCat}`, {name:params.name});
}

export function getMedicalRecord(data) {
  return get(urlA+'/outpatientList/visitHistoryList',data);
}
