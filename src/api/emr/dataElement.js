import {post,get,put,del} from '@/utils/request'

//数据元维护分页查询
export function getPageByCondition(data) {
  return get('/dataElement/getPageByCondition', data, true)
}

//数据元维护批量删除
export function batchRemove(data) {
  return del('/dataElement/remove', data, true)
}

//数据元维护批量启用停用
export function startupShutdown(data, flag) {
  return put('/dataElement/startupShutdown/' + flag, data, true)
}

//获取数据元标准下拉列表
export function getDataElementStandard (data) {
  return get('/dataElementStandard/all', data, true)
}

//获取数据元明细
export function getDetail (data) {
  return get('/dataElement/detailQuery', data, true)
}

//获取数据元值域列表
export function getDataElementValueCatelog (data) {
  return get('/dataElementValueCatalog/params', data, true)
}

//数据元维护新增
export function saveDateElement(data) {
  return post('/dataElement/save', data, true)
}

//获取某个单级值域列表
export function getValueSingleStages(data){
  return get('/valueSingleStage/params', data, true)
}
//数据元维护修改
export function modifyDateElement(data) {
  return put('dataElement/modify', data, true)
}
//检查数据元值域是否修改
export function valueChange(data){
  return post('dataElement/checkDataElementValue/' + data.id, data.valueSingleStagePOLst, true)
}
//获取自定义值域code和name
export function getCustomizeValue(data){
  return get('dataElement/getValueCodeAndName/' + data.name, data, true)
}

