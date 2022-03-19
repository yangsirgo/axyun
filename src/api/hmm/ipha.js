import { post, get, put, del } from "@/utils/request";
const urlA = "/admin";
export default {
  async getDeliveryBatch(params) {
    return await get("/hmm-stock/deliveryBatch/listForDropDown", params, true);
  },
  async getWardList(params) {
    //病区列表数据
    return await get(urlA + "/wadmin/ward-hos", params, true);
  },
  async getWardListByName(params) {
    //病区列表数据
    return await get(urlA + "/wadmin/ward/name", params, true);
  },
  getWardData(params) {
    return get("/hmm-stock/inptExeDetail/listWard", params, true);
  },
  async list(params, load = true) {
    return await get("/hmm-stock/inptExeDetail/list", params, load);
  },
  async dispense(param) {
    return await post("/hmm-stock/inptExeDetail/dispense", param, true);
  },
  async delivery(id, param) {
    return await post("/hmm-stock/inptExeDetail/delivery/" + id, param, true);
  },
  async printLabel(param) {
    return await post("/hmm-stock/inptExeDetail/printLabel", param, true);
  },
  async sumList(params) {
    return await get("/hmm-stock/inptSumExe/list", params, true);
  },
  async getInptSumExe(id) {
    return await get("/hmm-stock/inptSumExe/getSumExeDetail/" + id, "", true);
  },
  getAllInpPatientInfo(data) {
    return post("/hmm-stock/inptExeDetail/getAllInpPatientInfo", data);
  }
};
