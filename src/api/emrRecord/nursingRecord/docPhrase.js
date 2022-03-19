import { post, get, patch } from "@/utils/requestEmr";

//删除维护短语
export function deletePhrase(params) {
  return patch("/docPhrase/batch", params);
}

//获取维护短语
export function getPhraseAll(params) {
  return get("/docPhrase/getDocPhraseByParams", params);
}

//新增维护短语
/*export function createPhrase(params) {
  return post("/docPhrase", params);
}*/

//修改维护短语
export function addOrUpdatePhrase(params) {
  return post("/docPhrase/saveOrUpdateDocPhraseInfo", params);
}
