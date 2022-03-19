import {
  get,
  post,
  put,
  patch
} from '@/utils/request';
import { getDataFromLocal } from "@/api/medicalInsurance/doctor.js";
// 获取医保类别
export function getPagemd() {
  return get('/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000')
}
//获取药品类型
export function getDrugType() {
  return getDataFromLocal({siDictCatalogCode: "AKA031"});
}
//获取收费项目等级
export function getChargeItemLevel() {
  return getDataFromLocal({siDictCatalogCode: "AKA065"});
}
//获取大类代码
export function getTypeCode() {
  return getDataFromLocal({siDictCatalogCode: "AKA111"});
}
//获取剂型
export function getDosageType() {
  return getDataFromLocal({siDictCatalogCode: "AKA070"});
}
// 获取
// 疾病分类
export function getDiseaseType() {
  return getDataFromLocal({siDictCatalogCode: "AKA122"});
}
// 大病类别
export function getBigDiseaseType() {
  return getDataFromLocal({siDictCatalogCode: "CKA303"});
}
// 转诊病种类型
export function getTransDiseaseType() {
  return getDataFromLocal({siDictCatalogCode: "BKM070"});
}
/******************** 疾病信息 */
// 疾病信息查询接口
export function getPageDiseaseList(params) {
  return get('/finance-si/diseaseDirectory/getPageDiseaseDirectoryList', params)
}
/******************** 行政区划 */
// 行政区划查询
export function getPageAreaList(params) {
  return get('/finance-si/area/getPageAreaList', params)
}
/******************** 医保项目信息 */
// 医保项目信息
export function getPageItemList(params) {
  return get('/finance-si/item/getPageItemList', params)
}
/******************** 医师信息 */
// 医师信息查询接口
export function getPageDoctorList(params) {
  return get('/finance-si/doctor/getPageDoctorList', params)
}
// 添加医师信息接口
export function addDoctorPO(params) {
  return get('/finance-si/doctor/addDoctorPO', params)
}
/******************** 三大目录对照 */
// 获取医院项目信息
export function getPageHosChargeList(params) {
  return get('/finance-si/itemMatch/getPageHosChargeList', params)
}

// 对照确认(旧)
export function getMatchItemOld(params) {
  return post('/finance-si/itemMatch/matchItem', params)
}

// 对照确认
export function getMatchItem(params) {
  return post('/finance-si/si-pub-one-stop-biz/itemMatch', params)
}

// 对照结果
export function getPageItemMatchDTOList(params) {
  return get('/finance-si/itemMatch/getItemMatchDTOList', params)
}

// 对照取消(旧)
export function cancelMatchByIdOld(params) {
  return patch('/finance-si/itemMatch/cancelMatchById/' + params)
}
// 对照取消
export function cancelMatchById(params) {
  return post('/finance-si/si-pub-one-stop-biz/cancelItemMatch/', params)
}
// 医保交易查询
export function getPageTradeList(params) {
  return get('/finance-si/trade/getPageTradeList', params)
}
// 查询医保字典目录-不分页
export function getDictCatalogList(params) {
  return get('/finance-si/dictCatalog/getDictCatalogList', params)
}

// 查询医保字典目录-分页
export function getPageDictCatalogList(params) {
  return get('/finance-si/dictCatalog/getPageDictCatalogList', params)
}
// 添加医保字典目录
export function addDictCatalog(params) {
  return post('/finance-si/dictCatalog/addDictCatalog', params)
}

// 删除医保字典目录
export function deleteDictCatalogById(params) {
  return patch('/finance-si/dictCatalog/deleteDictCatalogById/' + params)
}
// 修改医保字典目录
export function updateDictCatalog(params) {
  return post('/finance-si/dictCatalog/updateDictCatalog', params)
}

// 查询医保字典
export function getPageDictList(params) {
  return get('/finance-si/dict/getPageDictList', params)
}

// 添加医保字典
export function addDict(params) {
  return post('/finance-si/dict/addDict', params)
}

// 删除医保字典
export function deleteDict(params) {
  return patch('/finance-si/dict/deleteDictById/' + params)
}
// 修改医保字典
export function updateDict(params) {
  return post('/finance-si/dict/updateDict', params)
}

// 查询医保字典对照
export function getPageDictMatchList(params) {
  return get('/finance-si/dictMatch/getPageDictMatchList', params)
}

// 添加医保字典对照
export function addDictMatch(params) {
  return post('/finance-si/dictMatch/addDictMatch', params)
}

// 删除医保字典对照
export function deleteDictMatchById(params) {
  return patch('/finance-si/dictMatch/deleteDictMatchById/' + params)
}
// 修改医保字典对照
export function updateDictMatcht(params) {
  return post('/finance-si/dictMatch/updateDictMatcht', params)
}

// 门诊上传明细查询-交易列表
export function tardeDetailList(params) {
  return post('/finance-outp/outpTradeDetailNew/trade-detail-info', params)
}

// 门诊上传明细查询-交易明细
export function getPageTradeChargeDetailList(params) {
  return post('/finance-si/tradeChargeDetail/getPageTradeChargeDetailList', params)
}

// 门诊上传明细查询-交易明细
export function getTradeChargeDetailList(params) {
  return get('/finance-si/tradeChargeDetail/getTradeChargeDetailList', params)
}
// 门诊上传明细查询-金额明细
export function getPageTradeAmtDetail(params) {
  return get('/finance-si/tradeAmtDetail/getPageTradeAmtDetail', params)
}
// 门诊上传明细查询-金额明细
export function getTradeAmtDetail(params) {
  return get('/finance-si/tradeAmtDetail/getTradeAmtDetail', params)
}
//获取医保下载情况数据
export function getBasicDataDownloadSituationList(params) {
  return get('/finance-si/basicDataDownloadSituation/getPageBasicDataDownloadSituationList', params)
}
//删除医保下载情况数据
export function deleteBasicDataDownloadDictionaryById(params) {
  return patch('/finance-si/basicDataDownloadSituation/deleteBasicDataDownloadDictionaryById/' + params)
}
//新增医保下载情况数据
export function addBasicDataDownloadDictionary(params) {
  return post('/finance-si/basicDataDownloadSituation/addBasicDataDownloadDictionary',params)
}
//查询医保下载字典数据
export function getBasicDataDownloadDictionary(params) {
  return get('/finance-si/basicDataDownloadDictionary/getBasicDataDownloadDictionary',params)
}
//更新医保基础数据下载情况
export function updateBasicDataDownloadSituation(params) {
  return post('/finance-si/basicDataDownloadSituation/updateBasicDataDownloadSituation',params)
}
//下载医保基础数据下载情况
export function uploadBasicData(params) {
  return post('/finance-si/si01-charge-item/base-data-download',params)
}
//获取全部医保字典信息
export function getAllDictInfo(params) {
  return get('/finance-si/dict/getAllDictInfo',params)
}
//下载医保基础数据下载情况(新医保)
export function downCatelogueData(params) {
  return post('/finance-si/si02/basedata/down_catelogue_data',params)
}
//下载医保基础数据下载情况(新医保)
export function getBasicDataDownloadSituation(params) {
  return get('finance-si/basicDataDownloadSituation/getBasicDataDownloadSituation',params)
}
// [新医保]医保项目目录接口
// 西药/中成药 查询
export function westDrugFind(params) {
  return post('/finance-si/si02/singleData/west_drug_find',params)
}
// 中药饮片 查询
export function tcmDecFind(params) {
  return post('/finance-si/si02/singleData/tcm_dec_find',params)
}
// 医疗自制剂 查询
export function orgPreparationFind(params) {
  return post('/finance-si/si02/singleData/org_preparation_find',params)
}
// 民族药品查询
export function nationalDrugFind(params) {
  return post('/finance-si/si02/singleData/national_drug_find',params)
}
// 医疗服务名称 查询
export function serviceItemFind(params) {
  return post('/finance-si/si02/singleData/service_item_find',params)
}
// 医用耗材查询 
export function consumableFind(params) {
  return post('/finance-si/si02/singleData/consumable_find',params)
}

