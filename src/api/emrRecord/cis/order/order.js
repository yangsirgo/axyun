import { post, get, patch } from '@/utils/requestEmr'


/**
 * 获取病人本次就诊处方信息
 * @param data
 * @returns {*}
 */
export function getOrder(data, flag) {
  return get('/outpatientOrder/pageList', data, flag ? true : flag)
}

/**
 * 医嘱提交
 * @param data
 * @returns {*}
 */
export function submitOrders(data) {
  return post('/outpatientOrder/submit', data, true)
}

/**
 * 医嘱保存
 * @param data
 * @returns {*}
 */
export async function saveOrder(data) {
  return await post('/outpatientOrder/save', data)
}

/**
 * 医嘱批量保存
 * @param data
 * @returns {*}
 */
export async function saveOrders(data) {
  return await post('/outpatientOrder/saveOrders', data)
}

/**
 * 通过模板医嘱批量保存
 * @param data
 * @returns {*}
 */
export async function saveOrdersByTemp(data) {
  return await post('/outpatientOrder/saveOrdersByTemp', data)
}

/**
 * 医嘱成组
 * @param data
 * @returns {*}
 */
export function bunching(data) {
  return post('/outpatientOrder/bunching', data, true)
}

/**
 * 医嘱取消成组
 * @param data
 * @returns {*}
 */
export function unbunching(data) {
  return post('/outpatientOrder/unbunching', data, true)
}

/**
 * 删除医嘱信息
 * @param data
 * @returns {*}
 */
export function batchRemoveOrders(data) {
  return post('/outpatientOrder/batchRemoveOrders', data, true)
}

/**
 * 获取医嘱项目（药品）
 * @param data
 * @returns {*}
 */
export function getAdviceItem(data) {
  return get('/outpatientOrder/pageItemList', data)
}

/**
 * 获取医嘱处方号
 * @param data
 * @returns {*}
 */
export async function getRecipeCode(data) {
  const result = await get('/outpatientOrder/getRecipeCode', data);
  return result || {};
}


export function saveSign(data) {
  return post('/outpatientSign/add', data, true)
}
/**
 * 更新体征信息
 * @param data
 * @returns {*}
 */
export function updateSign(data) {
  return post('/outpatientSign/edit', data, true)
}
/**
 * 查询体征信息
 * @param data
 * @returns {*}
 */
export function findByPatientId(data) {
  return get('/outpatientSign/findByPatientId', data, false)
}
/**
 * 保存医嘱模板
 * @param data
 * @returns {*}
 */
export function saveOrdersMould(data) {
  return post('/outpatientCisTemp/insert', data, true)
}

/**
 * 获取皮试信息
 * @param data
 * @returns {*}
 */
export function getSkinTestInfo(data) {
  return post('/allergyPatientInfo/getExecuteStatus', data, false)
}

/**
 * 工具箱查询处方模板
 * @param data
 * @returns {*}
 */
export function getOutpatientCisTemplate(data) {
  return get('/outpatientCisTemp/selectByTypeOrName/' + data.type + '/' + data.pageNum + '/' + data.pageSize, data, false)
}

/**
 * 工具箱保存处方模板
 * @param data
 * @returns {*}
 */
export function saveOrUpdateCisTemplate(data) {
  return post('/outpatientCisTemp/createOrEditTemplate/', data, false)
}

/**
 * 工具箱删除处方模板
 * @param data
 * @returns {*}
 */
export function deleteCisTemplate(data) {
  return patch('/outpatientCisTemp/deleteByTemplateId/', data, false)
}

/**
 * 工具箱查询处方模板明细
 * @param data
 * @returns {*}
 */
export function getOutpatientCisTemplateDetail(data) {
  return get('/outpatientCisTempDetail/selectByTemplateId/' + data.templateId + '/' + data.pageNum + '/' + data.pageSize, null, true)
}

/**
 * 工具箱新增处方模板明细
 * @param data
 * @returns {*}
 */
export function batchInsertTemplateDetails(data) {
  return post('/outpatientCisTempDetail/batchInsertTemplateDetails/', data, false)
}


/**
 * 工具箱更新处方模板明细
 * @param data
 * @returns {*}
 */
export function updateTemplateDetails(data) {
  return post('/outpatientCisTempDetail/updateTemplateDetails/', data, false)
}

/**
 * 工具箱删除处方模板明细
 * @param data
 * @returns {*}
 */
export function deleteTemplateDetails(data) {
  return patch('/outpatientCisTempDetail/deleteTemplateDetails/', data, false)
}

export function getOrdersByVisit(data) {
  return get('/outpatientOrder/getOrdersByVisit/', data, false)
}

/**
 * 保存病假单
 * @param data
 * @returns {*}
 */
export function saveSickLeave(data) {
  return post('/outpatientSickLeave/createOrEdit/', data, false)
}

/**
 * 查询病假单
 * @param data
 * @returns {*}
 */
export function getSickLeave(data) {
  return get('/outpatientSickLeave/selectByPatientId/' + data.patientId + '/' + data.pageNum + '/' + data.pageSize, null, false)
}

/**
 * 获取模板登记
 * @param data
 * @returns {*}
 */
export function getClassification(data) {
  return get('/wdata/dic/single/LevelType');
}
