import {
  post,
  get,
  put,
  patch,
  del
} from '@/utils/request'

const url = '/common';
const urlA = '/outpatient';
const urlB = '/resident';
const urlD = "/admin"; //url+

/**
 * 获取科室
 * /appointment/room/selRoomList
 * @param data
 * @returns {*}
 */
export function selRoomList(data, flag) {
  return get('/appointment/room/selRoomList', data, flag ? true : flag)
}
// 获取字典表
export function single(code) {
  return get(urlD + "/wdata/dic/single/" + code);
}
/**
 * 刷新获取是否添加坐诊科室
 * /outpatient/visitingRoom/selectVisitRoom
 * @param data
 * @returns {*}
 */
export function selectVisitRoom(data, flag) {
  return get('/outpatient/visitingRoom/selectVisitRoom', data, flag ? true : flag)
}

/**
 * 呼叫
 * /outpatient/callPatient/call?visitCode=1&appointmentId=1
 * @param data
 * @returns {*}
 */
export function call(data, flag) {
  return get('/outpatient/callPatient/call', data, flag ? true : flag)
}

export function callNew(data) {
  // return post('/appointment/outpAppt/callPatient', data, true)
  return post('/appointment/outpAppt/callPatientNew', data, false)
}


/**
 * 保存坐诊科室
 * @param data
 * @returns {*}
 */
export function saveVisitRoom(data) {
  return post('/outpatient/visitingRoom/saveVisitRoom', data, true)
}
// 自由诊疗  start

// 获取科室诊疗医生和收费金额
export function getFreeDoctor(data) {
  return post('/appointment/outpAppt/getFreeDoctor', data, true)
}
// 自由诊疗 接口  appointment/outpAppt/freeAppt /
export function freeAppt(data) {
  return post('/appointment/outpAppt/freeAppt', data, true)
}
// 预结算 /finance-outp/outpSettlement/reg-presettlement
export function regPresettlement(data) {
  return post('/finance-outp/outpSettlement/reg-presettlement', data, true, 130000)
}
// 结算 /finance-outp/outpSettlement/settlement2
export function settlement2(data) {
  return post('/finance-outp/outpSettlement/settlement2', data, true, 130000)
}
// 分诊 /appointment/outpAppt/appointTriage
export function appointTriage(data) {
  return post('/appointment/outpAppt/freeAppointTriage', data, true)
}

// 自由诊疗  end
/**
 * 获取病人本次就诊处方信息
 * @param data
 * @returns {*}
 */
export function getOrder(data, flag) {
  return get(urlA + '/outpatientOrder/pageList', data, flag ? true : flag)
}

/**
 * 获取病人本次就诊处方信息
 * @param data
 * @returns {*}
 */
export function pageAttachOrder(data, flag) {
  return get(urlA + '/outpatientOrder/pageAttachOrder', data, flag ? true : flag)
}

/**
 * 查询相同医嘱
 * @param data
 * @returns {*}
 */
export function getSameOrders(data, flag) {
  return get(urlA + '/outpatientOrder/selectSameOrders', data)
}

/**
 * 医嘱提交
 * @param data
 * @returns {*}
 */
export function submitOrders(data) {
  return post(urlA + '/outpatientOrder/submit', data, true)
}

/**
 * 医嘱保存
 * @param data
 * @returns {*}
 */
export async function saveOrder(data) {
  return await post(urlA + '/outpatientOrder/save', data)
}

/**
 * 医嘱批量保存
 * @param data
 * @returns {*}
 */
export async function saveOrders(data) {
  return await post(urlA + '/outpatientOrder/saveOrders', data)
}

/**
 * 通过模板医嘱批量保存
 * @param data
 * @returns {*}
 */
export async function saveOrdersByTemp(data) {
  return await post(urlA + '/outpatientOrder/saveOrdersByTemp', data)
}

/**
 * 通过模板医嘱批量保存 新
 * @param data
 * @returns {*}
 */
 export async function batchSaveOrders(data) {
  return await post(urlA + '/outpatientOrder/batchSaveOrders', data)
}


/**
 * 通过模板治疗医嘱批量保存
 * @param data
 * @returns {*}
 */
export async function cisTempSave(data) {
  return await post(urlA + '/outpatientNonDrugOrder/cisTempSave', data)
}

/**
 * 医嘱成组
 * @param data
 * @returns {*}
 */
export function bunching(data) {
  return put(urlA + '/outpatientOrder/bunching', data, true)
}

/**
 * 医嘱取消成组
 * @param data
 * @returns {*}
 */
export function unbunching(data) {
  return put(urlA + '/outpatientOrder/unbunching', data, true)
}

/**
 * 删除医嘱信息
 * @param data
 * @returns {*}
 */
export function batchRemoveOrders(data) {
  return put(urlA + '/outpatientOrder/batchRemoveOrders', data, true)
}

/**
 * 删除中草药处方医嘱信息
 * @param data
 * @returns {*}
 */
export function delHerbalOrder(data) {
  return put(urlA + '/outpatientOrder/delHerbalOrder', data, true)
}

/**
 * 提交中草药处方医嘱信息
 * @param data
 * @returns {*}
 */
export function submitHerbalOrder(data) {
  return post(urlA + '/outpatientOrder/submitHerbalOrder', data, true)
}

/**
 * 提交中草药处方医嘱信息 （新增直接提交）
 * @param data
 * @returns {*}
 */
 export function addAndSubmitHerbalOrder(data) {
  return post(urlA + '/outpatientOrder/addAndSubmitHerbalOrder', data, true)
}


/**
 * 删除中草药明细信息
 * @param data
 * @returns {*}
 */
export function deleteByIdWithVersion(data) {
  return del(urlA + '/outpatientOrder/supportVersion', data, true)
}

/**
 * 获取医嘱项目（药品）
 * @param data
 * @returns {*}
 */
export function getAdviceItem(data) {
  return get(urlA + '/outpatientOrder/pageItemList', data)
}

/**
 * 获取医嘱处方号
 * @param data
 * @returns {*}
 */
export async function getRecipeCode(data) {
  const result = await get(urlA + '/outpatientOrder/getRecipeCode', data);
  return result || {};
}


export function saveSign(data) {
  return post(urlA + '/outpatientSign/add', data, true)
}
/**
 * 更新体征信息
 * @param data
 * @returns {*}
 */
export function updateSign(data) {
  return post(urlA + '/outpatientSign/edit', data, true)
}
/**
 * 查询体征信息
 * @param data
 * @returns {*}
 */
export function findByPatientId(data) {
  return get(urlA + '/outpatientSign/findByPatientId', data, false)
}
/**
 * 保存医嘱模板
 * @param data
 * @returns {*}
 */
export function saveOrdersMould(data) {
  return post(urlA + '/outpatientCisTemp/insert', data, true)
}

/**
 * 获取皮试信息
 * @param data
 * @returns {*}
 */
export function getSkinTestInfo(data) {
  return post(url + '/allergyPatientInfo/getExecuteStatus', data, false)
}

/**
 * 工具箱查询处方模板
 * @param data
 * @returns {*}
 */
export function getOutpatientCisTemplate(data) {
  return get(urlA + '/outpatientCisTemp/selectByTypeOrName/' + data.type + '/' + data.pageNum + '/' + data.pageSize, data, false)
}

/**
 * 工具箱保存处方模板
 * @param data
 * @returns {*}
 */
export function saveOrUpdateCisTemplate(data) {
  return post(urlA + '/outpatientCisTemp/createOrEditTemplate/', data, false)
}

/**
 * 工具箱删除处方模板
 * @param data
 * @returns {*}
 */
export function deleteCisTemplate(data) {
  return del(urlA + '/outpatientCisTemp/deleteByTemplateId/', data, false)
}

/**
 * 工具箱查询处方模板明细
 * @param data
 * @returns {*}
 */
export function getOutpatientCisTemplateDetail(data) {
  return get(urlA + '/outpatientCisTempDetail/selectByTemplateId/' + data.templateId + '/' + data.pageNum + '/' + data.pageSize, null, true)
}

/**
 * 工具箱新增处方模板明细
 * @param data
 * @returns {*}
 */
export function batchInsertTemplateDetails(data) {
  return post(urlA + '/outpatientCisTempDetail/batchInsertTemplateDetails/', data, false)
}


/**
 * 工具箱更新处方模板明细
 * @param data
 * @returns {*}
 */
export function updateTemplateDetails(data) {
  return post(urlA + '/outpatientCisTempDetail/updateTemplateDetails/', data, false)
}

/**
 * 工具箱删除处方模板明细
 * @param data
 * @returns {*}
 */
export function deleteTemplateDetails(data) {
  return del(urlA + '/outpatientCisTempDetail/deleteDetailsList', data, false)
}

export function getOrdersByVisit(data) {
  return get(urlA + '/outpatientOrder/getOrders/', data, false)
}

/**
 * 保存病假单
 * @param data
 * @returns {*}
 */
export function saveSickLeave(data) {
  return post(urlA + '/outpatientSickLeave/createOrEdit/', data, false)
}

/**
 * 查询病假单
 * @param data
 * @returns {*}
 */
export function getSickLeave(data) {
  return get(urlA + '/outpatientSickLeave/selectByPatientId/' + data.patientId + '/' + data.pageNum + '/' + data.pageSize, null, false)
}

/**
 * 获取模板登记
 * @param data
 * @returns {*}
 */
export function getClassification(data) {
  return get(urlD + '/wdata/dic/single/LevelType');
}

/**
 * 获取首日次数
 */
export function getFirstDayCount(data) {
  return get(urlB + '/residentAdvice/firstDayCount', data);
}
export function getWestAdviceFirstDayCount(data) {
  return get(urlB + '/westAdvice/firstDayCount', data);
}

// 处方模板
/**
 * 获取数据
 */
export function getListByTypeAndName(data) {
  return get(urlA + "/outpatientCisTemp/getTemplateList", data);
}

/**
 * 新增tabs 页签
 */
export function createEditTemplate(data) {
  return post(urlA + '/outpatientCisTemp/createEditTemplate', data);
}


/**
 * 删除tabs 页签
 */
export function deleteByTemplateId(data) {
  return del(urlA + '/outpatientCisTemp/deleteByTemplateId', data);
}

/**
 * 医嘱明细
 */
export function updateDetails(data) {
  return post(urlA + '/outpatientCisTempDetail/updateDetails', data);
}

/**
 * 医嘱明细
 */
export function selectByTemplateId(url, data, flag) {
  return get(url, data);
}

/**
 * 模板维护成组
 */
export function tempDetailBunching(data) {
  return put(urlA + "/outpatientCisTempDetail/bunching", data);
}

/**
 * 模板维护取消成组
 */
export function tempDetailUngroup(data) {
  return put(urlA + "/outpatientCisTempDetail/ungroup", data);
}

/**
 * 复制医嘱明细
 */
export function copyTemplate(data, flag) {
  return post(urlA + "/outpatientCisTemp/copyTemplate", data);
}




/**
 * 治疗医嘱开立保存接口
 */
export function outpatientNonDrugOrderSave(data, flag) {
  return post(urlA + "/outpatientNonDrugOrder/save", data);
}

/**
 * 取药药房接口
 */
export function getTakingRoomList(data, flag) {
  return get("/hmm-stock/pharmacy/forPage", data);
}

/**
 * 治疗医嘱开立提交接口
 */
export function outpatientNonDrugOrderSubmit(data, flag) {
  return post(urlA + "/outpatientNonDrugOrder/submit", data);
}

/**
 * 治疗医嘱开立删除接口
 */
export function outpatientNonDrugRemoveOrders(data, flag) {
  return put(urlA + "/outpatientNonDrugOrder/batchRemoveOrders", data);
}

/**
 * 治疗医嘱开立获取列表接口
 */
export function outpatientNonDrugPageList(data, flag) {
  return get(urlA + "/outpatientNonDrugOrder/pageList", data);
}


/**
 * 保存中草药接口
 */
export function saveHerbalOrder(data, flag) {
  return post(urlA + "/outpatientOrder/saveHerbalOrder", data);
}

/**
 * 开医嘱权限接口
 */
export function validAntibacterialAuth(data, flag) {
  return post(urlA + "/outpatientOrder/validAntibacterial", data);
}

// code 转 text 接口
export function getTextFromCode(data, code) {
  return get(urlD + "/wdata/dic/single/" + code, data);
}

//  权限校验接口
export function validAdviceItem(data) {
  return post(urlA + "/outpatientOrder/validAdviceItem", data);
}

// 免费处方调用结算接口
export function handleFreeCharge(data, flag) {
  return post(urlA + "/outpatientOrder/handleFreeCharge", data, false, 130000);
}

// 中草药-地址配送查询接口
export function getPrescriptionAddress(data, flag) {
  return get(urlA + "/prescriptionAddress/getPrescriptionAddressByVcRi", data);
}

// 中草药-地址配送保存接口
export function addOrUpDocPrintTemplate(data, flag) {
  return post(urlA + "/prescriptionAddress/addOrUpDocPrintTemplate", data);
}

// 中草药-地址配送删除接口
export function delPrescriptionAddress(id) {
  return patch(urlA + "/prescriptionAddress/" + id);
}

// 中草药-校验药品库存
export function validHerbalAdviceItem(data, flag) {
  return post(urlA + "/outpatientOrder/validHerbalAdviceItem", data);
}

// 治疗医嘱校验
export function validOrders(data, flag) {
  return post(urlA + "/outpatientNonDrugOrder/validOrders", data);
}

// 治疗暂存全部
export function saveOrdersAll(data, flag) {
  console.log(data);
  return post("/outpatient/outpatientNonDrugOrder/saveOrders", data);
}

//交接查询
export function joinRecordList(data, flag) {
  return get(urlA + "/joinRecord/pageList", data);
}

//交接出去
export function saveJoinRecord(data, flag) {
  return post(urlA + "/joinRecord/saveJoinRecord", data);
}

//接收
export function recivePatient(data, flag) {
  return post(urlA + "/joinRecord/recivePatient", data);
}

//查询已诊患者列表
export function diagnosedList(data, flag) {
  return get(urlA + "/visitRecord/diagnosedList", data);
}

//医嘱列表全部暂存
export function allDraftsSaveFunc(data) {
  return post(urlA + "/outpatientOrder/saveAllOrderList", data);
}


//医嘱列表部分暂存 用于关联和成组
export function someDraftsSaveAjax(data) {
  return post(urlA + "/outpatientOrder/saveOrders", data);
}

/**
 * 获取患者皮试结果信息
 * @param data
 * @returns {*}
 */
export function getExecResult(data) {
  return get('/opnw/execResult/info', data, false);
}

/**
 * 获取历史就诊记录列表
 * @param data
 * @returns {*}
 */
export function getHistoryVisitList(data, loading = false) {
  return get(urlA + '/visitRecord/visitList', data, loading)
}


//模板维护页面 接口
export function batchInsertDetails(data) {
    return post('/outpatient/outpatientCisTempDetail/batchInsertDetails', data);
  }


//批量引用校验接口
export function selectTemplateDetails(data) {
  return post(urlA + '/outpatientOrder/selectTemplateDetails', data);
}

//批量引用校验接口
export function quoteAdviceItem(data) {
  return post(urlA + '/outpatientOrder/quoteAdviceItem', data);
}

//批量引用校验接口 多条处方引用
export function selectHistoryRecipes(data) {
  return post(urlA + '/outpatientOrder/selectHistoryRecipes', data);
}


// 获取病种选择接口
export function patientInfo (visitCode) {
  return get("/finance-si/si-pub-one-stop-biz/patient-info/" + visitCode);
}

//撤销提交医嘱  治疗医嘱
export function batchCancelSubmit (ids) {
  return post(urlA + "/outpatientOrder/batchCancelSubmit", ids);
}

//撤销提交医嘱  西药医嘱中草药
export function batchCancelSubmitByRecipe (recipeIds) {
  return post(urlA + "/outpatientOrder/batchCancelSubmitByRecipe", recipeIds);
}


//获取执行单数据
export function getPrintDataAjax(data) {
  return post(urlA + '/outpatientOrderQuery/printDataNoPay', data)
}

//获取处方统计 列表
export function getOrdersByStatistic(data) {
  return get(urlA + '/outpatientOrderQuery/getOrdersByStatistic', data)
}

export function exportHistoryAndPrescriptionExcel(data) {
  return post(urlA + '/outExport/exportHistoryAndPrescriptionExcel', data, false, '', 'blob')
}

// 退号接口
export function backNumber(data) {
  return post('/appointment/outpAppt/backNumber', data, false)
}