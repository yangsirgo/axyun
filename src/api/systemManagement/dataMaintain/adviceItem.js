import {post,get,put,del} from '@/utils/request'

const url = '/common';
const urlA = '/outpatient';

// 分页查询数据
export function adviceItemListPage(data) {
    return post(url+'/adviceItem/page', data, true)
}

// 分页查询数据
export function findFieldList(data) {
  return get(url+'/adviceMedicationRelation/findFieldList', data, true)
}

// 电子申请-目录维护-查询检验检查树结构
// export function getListByAdviceCategory(data) {
//   return get('/electronicApplicationCatalog/getListByAdviceCategory', data, true)
// }

// 添加
export function addAdviceItem(data) {
  return post(url+'/adviceItem/',data,true)
}
export function saveAdviceChargeRelation(data) {
  return post(url+'/adviceChargeRelation/save',data,true)
}

// 获取
export function getAdviceItemInfo(data) {
  return get(url+'/adviceItem/' + data.id, {}, true)
}
// 获取医嘱项目(旧)
export function getAdviceItemListOld(data) {
  return get(url+'/adviceItem/adviceItemList', data)
}
// 获取医嘱项目  中草药和西药 有单独医嘱项目接口
export function getAdviceItemList(data) {
  return get(url+'/adviceItem/adviceItemListToTable', data)
}

// 西药 中草药 获取医嘱项目接口
export function drugItemListWithStorge(data) {
  // return get(url+'/adviceItem/adviceItemListToTable', data)
  return get(url+'/adviceItem/drugItemListWithStorge', data)
}

// 获取2
export function postAdviceItemInfo(data) {
  return post(url+'/adviceItem/info',data, true)
}
// 修改
export function saveAdviceItem(data) {
  return post(url+'/adviceItem/save', data, true)
}

// 获取收费项目名称接口
export function getAdviceItemTable(data) {
  return get(url+'/adviceItem/getChargeItem', data)
}

// 获取医嘱复制 接诊列表
export function visitHistoryList(data) {
  return get(urlA+'/outpatientList/visitHistoryByPatient', data)
}

// 获取医嘱复制 中草药 医嘱历史
export function getOrdersByVisit(data) {
  return get(urlA+'/outpatientOrder/getHerbalOrdersByVisit', data)
}

// 获取医嘱复制 西药 医嘱历史
export function getWestOrdersByVisit(data) {
  return get(urlA+'/outpatientOrder/getOrders', data)
}



export function saveOrUpdateElectronicApplicationCatalog(data) {
  return post(url+'/electronicApplicationCatalog/saveOrUpdateElectronicApplicationCatalog', data, true)
}

export function getListByAdviceCategory(data) {
  return get(url+'/electronicApplicationCatalog/getListByAdviceCategory', data)
}
//检验左侧树结构详细
export function getListByAdviceCategoryDetai(data) {
  return post(url+'/adviceItem/infos', data)
}

export function deleteAdviceCategory(data) {
  return get(url+'/electronicApplicationCatalog/deleteAdviceCategory', data)
}

// 用法关联附加医嘱保存接口
export function OwSaveAdviceMedicationRelation(data) {
  return post(url+'/adviceMedicationRelation/OwSaveAdviceMedicationRelation', data)
}

// 用法关联附加医嘱查询接口
export function oWFindAdviceMedicationRelationPOList(data) {
  return post(url+'/adviceMedicationRelation/oWFindAdviceMedicationRelationPOList', data)
}

// 用法关联附加医嘱删除接口
export function deleteAdviceMedicationRelationById(data) {
  return get(url+'/adviceMedicationRelation/deleteAdviceMedicationRelationById', data)
}

//角色医嘱授权获取角色列表
export function oWQueryDoctorsAdviceRoleRelationByParams(data) {
  return get(url+'/doctorsAdviceRoleRelation/oWQueryDoctorsAdviceRoleRelationByParams', data)
}

//角色医嘱授权获取角色列表
export function oWQueryDoctorsAdviceTree(data) {
  return get(url+'/doctorsAdviceRoleRelation/oWQueryDoctorsAdviceTree', data)
}

// 保存角色医嘱授权关系
export function oWSaveDoctorsAdviceRoleRelation(data) {
  return post(url+'/doctorsAdviceRoleRelation/oWSaveDoctorsAdviceRoleRelation', data)
}

// 通过categorysId查询检查检验目录详情和医嘱项
export function oWgetElectronicApplicationCatalogRelationListByAdviceCategory(data) {
  return get('/electronicApplicationCatalogRelation/oWgetElectronicApplicationCatalogRelationListByAdviceCategory', data)
}

// 中草药 历史医嘱 中草药引用检验接口
export function quoteHerbalAdviceItem(data) {
  return post(urlA + '/outpatientOrder/quoteHerbalAdviceItem', data)
}

// 中草药引用接口
export function addHerbalOrder(data) {
  return post(urlA + '/outpatientOrder/addHerbalOrder', data)
}

// 治疗医嘱 历史医嘱  查询
export function getNoDrugOrdersByVisit(data) {
  return get(urlA + '/outpatientNonDrugOrder/getNoDrugOrdersByVisit', data)
}


// 治疗医嘱 历史医嘱  查询
export function quoteAndSave(data) {
  return post(urlA + '/outpatientNonDrugOrder/quoteAndSave', data)
}
