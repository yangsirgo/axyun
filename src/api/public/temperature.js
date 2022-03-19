import {post, get, put, del} from "@/utils/request";
const url = "/ipnw";//url+
const urlD = '/admin'
// 体温单类型
// ===============
// 获取体温单列表
export function getTypeListData(params) {
  return get("/vitalStyle/getVitalStyleList", params);
}

// 新增或更新体温单
export function createOrUpdateTypeListData(params) {
  return post("/vitalStyle/saveOrUpdateVitalStyle", params);
}

// 删除
export function delTypeListData(params) {
  return del("/vitalStyle/batchDeleteVitalStyle", params);
}

// 体温单项目
// ===============
// 获取体温单列表
export function getItemListData(params) {
  return get("/vitalItems/getVitalItemList", params);
}

// 新增或更新体温单
export function createOrUpdateItemListData(params) {
  return post("/vitalItems/saveOrUpdateVitalItem", params);
}

// 删除
export function delItemListData0(params) {
  return del("/vitalItems/batchDeleteVitalStyle", params);
}

// 删除
export function delItemListData(params) {
  return del("vitalItems/batchDeleteVitalItem", params);
}

//查询体温单样式与项目关系
export function getVitalStyleItemsList(params) {
  return get("/vitalStyleItems/getVitalStyleItemsList", params);
}

//更新体温单样式与项目关系
export function saveOrUpdateStyleItemRelation(params) {
  return post("/vitalStyleItems/saveOrUpdateStyleItemRelation", params);
}

//获取图章列表
export function getVitalStampList(params) {
  return get(url+"/vitalStamps/getVitalStampList", params);
}

//删除图章列表
export function batchDeleteVitalStyle(params) {
  return del(url+"/vitalStamps/batchDeleteVitalStamp", params);
}

//新建或更新图章
export function saveOrUpdateVitalStamp(params) {
  return post(url+"/vitalStamps/saveOrUpdateVitalStamp", params);
}

// 查询科室列表
export function getDepList(query) {
  return get(urlD+'/wadmin/hos/dept', query);
}

// 新建体温单科室关系
export function addVitalDept(params) {
  return post('/vitalDepartRight/addVitalDept', params);
}

//通过体温单样式获取体温单科室关系列表
export function getVitalDepartRightByStyleCode(params) {
  return get('/vitalDepartRight/getVitalDepartRightByStyleCode/' + params);
}

// 获取体温单选项列表
export function getOptionListData(params) {
  return get("/vitalOption/getVitalOptionList", params);
}

// 新增或更新体温单选项
export function createOrUpdateOptionListData(params) {
  return post("/vitalOption/saveOrUpdateVitalOption", params);
}

//删除体温单选项
export function delOptionListData(params) {
  return del("/vitalOption/batchDeleteVitalOption", params);
}

//体温单项目选项维护
//根据项目代码获取选项列表
export function getItemOptionByItemCodeList(params) {
  return get("/vitalItemOption/getItemOptionByItemCode/" + params);
}

//新增或修改项目选项关系
export function addOrUpdate(params) {
  return post("/vitalItemOption/addOrUpdate", params);
}

/*录入*/

//根据科室查询项目
export function getVitalItemListByDeptCode(params) {
  return get("/vitalItems/getVitalItemListByDeptCode", params);
}

//根据患者记录
export function selectDataRecords(params) {
  return get("/vitalSignRecords/selectDataRecords", params);
}

//查询体征项目记录
export function selectVitalSignRecords(params) {
  return get("/vitalSignRecords/selectVitalSignRecords", params);
}

//查询一般/自定义项目记录
export function selectVitalItemRecords(params) {
  return get("/vitalItemsRecords/selectVitalItemRecords", params);
}

//查询图章项目记录
export function selectVitalStampsRecords(params) {
  return get("/vitalStampsRecords/selectVitalStampsRecords", params);
}

//保存体征项目记录
export function saveVitalSignRecords(params) {
  return post("/vitalSignRecords/addVitalSignRecords", params);
}

//保存一般/自定义项目记录
export function saveVitalItemRecords(params) {
  return post("/vitalItemsRecords/addVitalItemsRecords", params);
}

//保存图章记录
export function saveVitalStampsRecords(params) {
  return post("/vitalStampsRecords/addVitalStampsRecords", params);
}

//删除体征项目记录(批量)
export function deleteVitalSignRecords(params) {
  return del("/vitalSignRecords/batch", params);
}

//删除一般、自定义项目记录(批量)
export function deleteVitalItemRecords(params) {
  return del("/vitalItemsRecords/batch", params);
}

//删除一般、自定义项目记录(单个)
export function deleteVitalItemRecord(params) {
  return del("/vitalItemsRecords/" + params.id);
}

//删除图章(单个)
export function deleteVitalStampRecords(params) {
  return del("/vitalStampsRecords/" + params.id);
}

//批量查询体温
export function getVitalSignRecords(params) {
  return get("/vitalSignRecords/selectVitalSignRecordsBatch", params);
}

//查询体征项目
export function getSignRecords(params) {
  return get("/vitalSignRecords/selectDataTimeVitalSignRecords", params);
}

//批量录入保存
export function saveRecords(params) {
  return post("/vitalSignRecords/addOrUpdateVitalSignAndItemRecords", params);
}

//批量删除
export function deleteRecords(params) {
  return del("/vitalSignRecords/batchDeleteSignOrItemRecords", params);
}

//查询体温单样式配置
export function getConfiguration(params) {
  return get("/vitalConfiguration/all", params);
}

//查询体温单样式配置选项
export function getConfigOptiontion(params) {
  return get("/vitalConfigurationOption/params", params);
}

//查询体温单样式配置
export function getVitalStyleConfig(params) {
  return get("/vitalStyleConfiguration/selectVitalStyleConfig", params);
}

//保存体温单样式配置
export function saveVitalStyleConfig(params) {
  return post("/vitalStyleConfiguration/saveVitalStyleConfig", params);
}
