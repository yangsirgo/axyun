import {post,get,put,del} from '@/utils/request'

const urlA = '/admin'

export function getTypeTree(data) {
    return get(urlA+'/cnfparams/tree',data,true)
}

export function addTypeTree(data) {
    return post(urlA+'/cnfparams', data, true)
}

export function putTypeTree(data) {
    return put(urlA+`/cnfparams/upd/${data.id}`, data,true)
}

export function deleteTypeTree(data) {
    return del(urlA+`/cnfparams/delparamssub/${data.id}`, {},true)
}

export function getCnfanTypeTree(id) {
    return get(urlA+`/cnfparams/cnf-type-tree/${id}`, {},true)
}

export function getCnfTypeL1s(data) {
  return get(urlA+'/cnfparams/getcnftypel1s', data, true)
}
export function getParamsTree(data){
  return get (urlA+`/cnfparams/tree/${data.id}`, {},true)
}

export function getCnfId(data){
  return get(urlA+`/cnfparams/tree/${data.id}`,{},true)
}

export function getTypeTreeId(data) {
  return get(urlA+`/cnfparams/${data.id}/has/child`,{},true)
}

export function getCnfTypes(data) {
  return get(urlA+'/cnfparams/getcnftypes', data, true)
}

export function putParent(data){
  return put(urlA+`/cnfparams/upd-parent/`,data,true)
}

export function serchMoudle(data) {
  return get(urlA+`/cnfparams/cnf-type-val-tree/${data.val}`, {}, true)
}

//#### cnfFieldDefine #####//

export function getCnfanTypeTable(data) {
  return get(`/cnfFieldDefine/defines/${data.type}`,{},true )
}

export function addCnfanType(data) {
  return post('/cnfFieldDefine', data, true)
}

export function putCnfanType(data) {
  return put(`/cnfFieldDefine/${data.id}`, data, true)
}

export function deleteCnfanType(data) {
  return del('/cnfFieldDefine/batch', data, true)
}

export function getColumns(data){
  return get (urlA+`/cnfFieldValue/columns/${data.id}`,{},true)
}

export function getDatas(data){
  return get (urlA+`/cnfFieldValue/datas`,data,true)
}

//#### cnf #####//

export function addCnf(data) {
    return post(urlA+'/cnf/add-cnf', data,true)
}

export function getCnfTree(pid, id) {
    let treeid = id || -1
    return get(urlA+`/cnf/cnf-tree/${pid}/${treeid}`,{}, true)
}
export function getCnfMultiTree(pid, id) {
    let treeid = id || -1
    return get(urlA+`/cnf/cnf-tree/multi/${pid}/${treeid}`,{}, true)
}

export function deleteCnfTree(id) {
    return del(urlA+`/cnf/delcnfsub/${id}`,true)
}

export function getCnfItem(data) {
    return get(urlA+'/cnf/cnf-data', data, true)
}

export function putCnfItem(data) {
    return put( urlA+'/cnf/upd-cnf', data, true)
}

export function getCnfTreeSingle(pid) {
  return get(urlA+`/cnf/cnf-tree/single/${pid}`,{}, true)
}

//#### cnfFieldValue #####//

export function delRowVal(bid) {
  return del(urlA+`/cnfFieldValue/del-rowval/${bid}`, {}, true)
}

export function getArrayList(data){
  return post(urlA+`/wdata/dic/singles`,data)
}

export function searchType(data) {
  return get(urlA+`/cnfFieldValue/cnftype/${data.id}`, {}, true)
}



export default {
  // 根据条件查询短信模版
  async getSmsTemplateList(params) {
    return await post("/finance-pub/smsTemplate/getSmsTemplateList", params, false);
  },
   // 删除短信模版
   async delSmsTemplate(data) {
    return await del('/finance-pub/smsTemplate/delSmsTemplate'+'/'+data.id, data, false);
  },
   // 新增短信模版
   async addSmsTemplate(data) {
    return await post('/finance-pub/smsTemplate/addSmsTemplate', data, false);
  },
 // 修改短信模版
 async updateSmsTemplate(data) {
  return await put('/finance-pub/smsTemplate/updateSmsTemplate', data, false);
},
 // 根据条件查询短信日志
 async getSmsRecordList(params) {
  return await post("/finance-pub/smsRecord/getSmsRecordList", params, false);
}

}

