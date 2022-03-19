import { get, post, put, del } from "@/utils/request";

const url = "/ipnw";//url+

// 医嘱列表
export async function getWeekData(inpCode, admissionDate, selectedDate) {
  // let resp = await get("http://192.168.199.136:8762/vitalSigns/getVitalDataByPidAndDate", query)
  let resp = await get(
    url+`/vitalSigns/getVitalDataByPidAndDate/${inpCode}/${admissionDate}/${selectedDate}`
  );
  return {
    ...resp,
    data: JSON.parse(resp.data)
  };
}

//体温单项目列表
export function getItemListData(params) {
  console.log('科室关系',params);
  return get("/vitalItems/getVitalItemList", params);
}

// 更新上传体征项目
export async function updateSignData(params) {
  return post(url+"/vitalSigns/saveOrUpdateSignData", params);
}

// 删除体征项目
export async function delSignData(params) {
  return del(url+"/vitalSigns/deleteSignDataById", params);
}

// 更新上传其他项目
export async function updateOtherData(params) {
  return post(url+"/vitalOther/saveByList", params);
}

// 删除其他项目
export async function delOtherData(params) {
  return del(url+"/vitalOther/deleteOtherDataById", params);
}

// 更新上传图章项目
export async function updateStampData(params) {
  return post(url+"/vitalStamp/savePatientStamp", params);
}

// 分页获取图章数据
export async function getStampData(params) {
  return get(url+"/vitalStamp/getStampListByPage", params);
}

export async function delStampData(params) {
  return del(url+"/vitalStamp/batch", params);
}
