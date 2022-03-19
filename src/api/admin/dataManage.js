import { get, post, del, put } from "../../utils/request";

const url = "/admin";//url+

export default {
  loadSettings: async function() {
    let [vdResponse, dmResponse, dsResponse] = await Promise.all([
      get("/valueDomain/all"),
      get("/dictMulti/all"),
      get("/dictSingle/all")
    ]);
    let data = {
      vd: vdResponse.data,
      dm: dmResponse.data,
      ds: dsResponse.data
    };
    return data;
  },
  loadSelector: async function() {
    const { data } = await get("/cfgSelect/all");
    return data;
  },
  getCategoryList: async function({ type }) {
    const { data } = await get("/sys/module/SysModules", { type });
    return data;
  },
  getDictBox: async function({ categoryType, keyword, type }) {
    const { data } = await get("/sys/base/sysBaseConfig", {
      categoryType,
      keyword,
      type
    });
    return data;
  },
  saveSetting: async function({
    id,
    category,
    groupCode,
    groupName,
    value,
    name,
    type,
    url
  }) {
    const { data } = await post("/settings/save", {
      id,
      category,
      groupCode,
      groupName,
      value,
      name,
      type,
      url
    });
    return data;
  },
  // 查找modules查询加分页
  findSysModuleList: async function(params) {
    const data = await get("/module/forPage", params);
    return data;
  },
  // 查找modules
  getSysModuleList: async function() {
    const { data } = await get("/module/all");
    return data;
  },
  // 编辑modules
  editSysModule: async function(id, options) {
    const { data } = await put("/module/" + id, options);
    return data;
  },

  // 新增modules
  addSysModule: async function(options) {
    const { data } = await post("/module", options);
    return data;
  },

  // 删除modules
  delSysModule: async function(id) {
    const { data } = await del("/module/" + id);
    return data;
  },
  // 批量删除modules
  delSysModules: async function(ids) {
    const { data } = await del("/module/batch", ids);
    return data;
  },
  // 配置中心全局搜索某个配置项
  searchModule: async function(name) {
    const { data } = await get("/module/selectAll", {
      name: name
    });
    return data;
  },

  // 根据id获取系统值域
  getDictItem: async function(id) {
    const { data } = await get("/valueDomain/moduleId/" + id);
    return data;
  },

  // 单级字典查询
  getSingleDictItem: async function(id) {
    const { data } = await get("/dictSingle/itemId/" + id);
    return data;
  },
  // 单级字典查询带分页
  getSingleDictForPage: async function(params) {
    const data = await get("/dictSingle/forPage", params);
    return data;
  },
  // 单级字典批量删除
  delSingleDicts: async function(ids) {
    const { data } = await del("/dictSingle/logic-batch", ids);
    return data;
  },
  // 更新单级字典
  updateSingleDict: async function(entity) {
    const { data } = await put("/dictSingle/" + entity.id, entity);
    return data;
  },
  // 添加单级字典
  addSingleDict: async function(entity) {
    const { data } = await post("/dictSingle", entity);
    return data;
  },
  // 删除单级字典
  // deleteSingleDict: async function(id) {
  //   const { data } = await del("/dictSingle/" + id);
  //   return data;
  // },
  // 单级字典key值验证
  singleDictKeyPass: async function(params) {
    const { data } = await get("/dictSingle/ruleKey", params);
    return data;
  },

  // 多级字典查询
  getMulDictItems_old: async function(id) {
    const { data } = await get("/dictMulti/itemId/" + id);
    return data;
  },
  getMulDictItems: async function(itemId, parentId) {
    const { data } = await get("/dictMulti/itemId", {
      itemId,
      parentId
    });
    return data;
  },
  // 多级字典单查
  getMulDictItem: async function(id) {
    const { data } = await get("/dictMulti/" + id);
    return data;
  },
  // 多级字典新增
  addMulDictItem: async function(entity) {
    const { data } = await post("/dictMulti", entity);
    return data;
  },
  // 多级字典更新
  updateMulDictItem: async function(id, entity) {
    const { data } = await put("/dictMulti/" + id, entity);
    return data;
  },
  // 多级字典删除 逻辑删除
  delMulDictItem: async function(id) {
    const { data } = await del("/dictMulti/del/" + id);
    return data;
  },
  // 系统设置新增
  addSysSettings: async function(entity) {
    const { data } = await post("/settings", entity);
    return data;
  },
  // 系统设置根据code单查
  settingCodePass: async function(params) {
    const { data } = await get("/settings/getSetttingByCode", params);
    return data;
  },
  // 系统设置列表
  getSysSettings: async function(params) {
    const data = await get("/settings/forPage", params);
    return data;
  },
  // 系统设置更新
  updateSysSettings: async function(entity) {
    const { data } = await put("/settings/" + entity.id, entity);
    return data;
  },
  // 系统设置单删
  delSysSettings: async function(id) {
    const { data } = await del("/settings/" + id);
    return data;
  },
  // 系统设置批量删除
  delByIds: async function(ids) {
    const { data } = await del("/settings/logic-batch", ids);
    return data || {};
  },
  // 系统设置查询
  selectSetting: async function(entity) {
    const { data } = await get("/settings/getSetting", entity);
    return data;
  },
  // 系统设置 查询模块及二级分类
  getSettingClassifications: async function(entity) {
    const data = await get("/settings/getClassify", entity);
    return data;
  },
  // 系统设置 查询二级分类集合
  getClassifyList: async function() {
    const data = await get("/settings/getClassify");
    return data;
  },
  // 系统设置 根据名字搜索功能
  getFuncs: async function(params) {
    const data = await get("/function/forPage", params);
    return data;
  },
  // 获取系统设置菜单
  getSettingTreeDatas: async function(moduleId) {
    const { data } = await get(`/settings/moduleId/${moduleId}`);
    return data;
  },

  // 获取所有采用的标准
  getDataElementList: async function(params) {
    return await get("/dataElement/forPage", params);
  },
  getStandards: async function(cond) {
    const { data } = await get("/standard/fuzzyQuery/" + cond);
    return data;
  },
  // 添加数据元
  addDataElement: async function(entity) {
    const { data } = await post("/dataElement/add", entity);
    return data;
  },
  // 修改数据元
  updateDataElement: async function(entity) {
    const { data } = await put("/dataElement/update/" + entity.id, entity);
    return data;
  },
  // 删除数据元
  delDataElement: async function(ids) {
    const { data } = await del("/dataElement/logic-batch", ids);
    return data || {};
  },

  // 获取数据元列表（翻页）
  getValueDomainList: async function(params) {
    return await get("/valueDomain/forPage", params);
  },
  // 添加系统值域
  addValueDomain: async function(entity) {
    const { data } = await post("/valueDomain/add", entity);
    return data;
  },
  // 更新系统值域
  updateValueDomain: async function(entity) {
    const { data } = await put("/valueDomain/update/" + entity.id, entity);
    return data;
  },
  delValueDomain: async function(ids) {
    const { data } = await del("/valueDomain/logic-batch", ids);
    return data || {};
  },
  // 获取所有模块及二级分类
  getValueDomainClassifications: async function() {
    return await get("/valueDomain/getClassify");
  },
  // 系统参数查询带分页
  getCfgItem: async function(params) {
    const data = await get("/cfgItem/forPage", params);
    return data;
  },
  // 系统参数添加
  addCfgItem: async function(entity) {
    const { data } = await post("/cfgItem", entity);
    return data;
  },
  // 系统参数更新
  updateCfgItem: async function(entity) {
    const { data } = await put("/cfgItem/" + entity.id, entity);
    return data;
  },
  // 系统参数删除
  delCfgItem: async function(ids) {
    const { data } = await del("/cfgItem/logic-batch", ids);
    return data;
  },
  // 获取系统参数
  async getSystemParameters() {
    const { data } = await get("/cfgItem/all");
    return data;
  },
  // 更新系统参数
  async updateSystemParameter(id, params) {
    const { data } = await put(`/cfgItem/${id}`, params);
    return data;
  },
  // 根据模块ID获取模块的系统参数
  async getSystemParameterByMid(moduleId) {
    const { data } = await get(`/cfgItem/moduleId/${moduleId}`);
    return data || [];
  },
  // 获取配置中心所有配置模块的值域数量
  async getCfgStatistics() {
    const { data } = await get("/valueDomain/getCount");
    return data;
  },
  // 系统参数值域添加
  addCfgOptions: async function(entity) {
    const { data } = await post("/cfgOptions", entity);
    return data;
  },
  // 系统参数值域查询带分页
  getCfgOptions: async function(params) {
    const data = await get("/cfgOptions/forPage", params);
    return data;
  },
  // 系统参数值域更新
  updateCfgOptions: async function(entity) {
    const { data } = await put("/cfgOptions/" + entity.id, entity);
    return data;
  },
  // 系统参数值域删除
  delCfgOptions: async function(ids) {
    const { data } = await del("/cfgOptions/batch", ids);
    return data;
  },
  // 系统参数值域删除
  getCfgItemByType: async function() {
    const { data } = await del("/cfgItem/selectByType");
    return data;
  },
  // 系统参数 查询二级分类集合
  getClassList: async function() {
    const data = await get("/cfgItem/getClassify");
    return data;
  },
  // 下拉选项配置 添加
  addCfgSelect: async function(entity) {
    const data = await post("/cfgSelect", entity);
    return data;
  },
  // 下拉选项配置 查询带分页
  getCfgSelect: async function(params) {
    const data = await get("/cfgSelect/forPage", params);
    return data;
  },
  // 下拉选项配置 修改
  updateCfgSelect: async function(entity) {
    const data = await put("/cfgSelect/" + entity.id, entity);
    return data;
  },
  // 下拉选项配置 批量删除
  batchCfgSelect: async function(ids) {
    const data = await del("/cfgSelect/batch", ids);
    return data;
  }
};
