import {
  get,
  post,
  put,
  del
} from '@/utils/request'

//中草药处方列表
export function herbalPage(param,pageParam) {
  const {pageNo,pageSize} = pageParam;
  return get(`/advice/recipe/herbal/page/${pageNo}/${pageSize}`,param)
}
//中草药处方基础信息暂存
export function herbalRecipeCreate(recipe) {
  return post(`/advice/recipe/herbal/create/`,recipe)
}
//中草药处方提交
export function herbalRecipeSubmit(recipeId) {
  return post(`/advice/recipe/herbal/submit/${recipeId}`)
}
//中草药医嘱项目查询
export function herbalItemPage(param) {
  const {pageNo,pageSize} = param;
  return get(`/advice/adviceItem/herbalSearch/${pageNo}/${pageSize}`,param)
}

//删除处方
export function delHerbalOrder(recipeId) {
  return post(`/advice/recipe/herbal/delete/${recipeId}`)
}

//模板存储
export function saveChmTepOrder(ajaxData) {
  let { treatId } = ajaxData;
  return post(`/advice/recipe/templateRef/${treatId}`, ajaxData)
}

// 中草药 赋值医嘱
export function getHistoryVisit(data) {
  let { pageNo, pageSize, patientId } = data;
  return get("/advice/treatment/pageByPatient/" + pageNo + "/" + pageSize, data);
}

// 中草药 历史处方列表
export function getOrdersByVisit(data) {
  let { pageNo, pageSize, treatId } = data;
  return get("/advice/recipe/herbal/history/" + pageNo + "/" + pageSize + "?treatId=" + treatId);
}

// 中草药 历史医嘱 中草药引用保存接口
export function quoteHerbalAdviceItem(data) {
  return post('/advice/recipe/herbal/historyRef', data)
}
