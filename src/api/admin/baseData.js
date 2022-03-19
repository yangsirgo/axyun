import ajax from "@/utils/request";

const url = "admin";//url+

export default {

  // 根据id获取系统值域
  getDictItem: async function(id) {
    const { data } = await ajax.get(url+"/valueDomain/moduleId/" + id);
    return data;
  },

  // 单级字典查询带分页
  getSingleDictForPage: async function(params) {

    const data = await ajax.get(url+"/dictSingle/forPage", params);
    return data;
  },
  // 单级字典批量删除

  delSingleDicts: async function(ids) {
    const { data } = await ajax.del(url+"/dictSingle/logic-batch", ids);
    return data;
  },
  // 更新单级字典
  updateSingleDict: async function(entity) {
    const { data } = await ajax.put(url+"/dictSingle/" + entity.id, entity);
    return data;
  },
  // 添加单级字典
  addSingleDict: async function(entity) {
    const { data } = await ajax.post(url+"/dictSingle", entity);
    return data;
  },
  // 单级字典key值验证
  singleDictKeyPass: async function(params) {
    const { data } = await ajax.get(url+"/dictSingle/ruleKey", params);
    return data;
  },

  getMulDictItems: async function(itemId, parentId) {
    const { data } = await ajax.get(url+"/dictMulti/itemId", {
      itemId,
      parentId
    });
    return data;
  },
  // 多级字典单查
  getMulDictItem: async function(id) {
    const { data } = await ajax.get(url+"/dictMulti/" + id);
    return data;
  },
  // 多级字典新增
  addMulDictItem: async function(entity) {
    const { data } = await ajax.post(url+"/dictMulti", entity);
    return data;
  },
  // 多级字典更新
  updateMulDictItem: async function(id, entity) {
    const { data } = await ajax.put(url+"/dictMulti/" + id, entity);
    return data;
  },
  // 多级字典删除 逻辑删除
  delMulDictItem: async function(id) {
    const { data } = await ajax.del(url+"/dictMulti/del/" + id);
    return data;
  }
};
