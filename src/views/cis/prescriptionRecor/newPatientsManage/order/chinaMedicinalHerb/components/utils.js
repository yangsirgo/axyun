import { validQuoteHerbal } from "@/api/tools/commonDrug.js";
import {
  numToPrecision
} from "@/components/adviceCommon/adviceUtils.js";

import {
  singleTdNum
} from "./variable.js";



export async function validQuoteHerbalChnDrug(params, msg) {
  try{
    let res = await validQuoteHerbal(params);
    if (res.code != 1) {
        this.$message.error(res.msg || msg);
        return false;
    }
    return true;
  }catch(e){
    this.$message.error(e.msg || msg);
    return false;
  }
}

//limitUnit 包装小单位
//pakUnit 包装大单位
//unitKey 选中单位
function getChmUnitFlag (limitUnit = "", pakUnit = "", unitKey = ""){
  if(limitUnit == pakUnit) return "0";
  return unitKey === pakUnit ? "1" : "0";
}


//数据计算 根据unitFlag 
// 0 是小单位
// unitFlag 大单位 小单位标识
// quantity 当前数量\
// packQuantity 包装量
// type 类型insert 存  
//type 类型save 取  
function getQtyByUnitFlag(unitFlag, quantity, packQuantity, type) {
 
  let qty = 0;
  if (type == "insert") {
    qty =
      unitFlag === "0" ?
      quantity :
      quantity / packQuantity;
  } else if (type == "save") {
    qty =
      unitFlag === "0" ?
      quantity :
      quantity * packQuantity;
  } else {
    console.error("数量计算的type 值没有传");
  }
  // console.log(unitFlag, quantity, packQuantity, type, numToPrecision(qty));
  return numToPrecision(qty);
}

// getList 获取数据时 字段的处理 转换
export function convertFieldFromGetList (item){
  item.limitUnit = item.unit;
  let unitKey = item.unitFlag === "0" ? item.limitUnit : item.packUnit;
  let qty = getQtyByUnitFlag(
    item.unitFlag,
    item.quantity,
    item.packQuantity,
    "insert"
  );
  item.qty = qty;
  item.unitKey = unitKey;
} 

// submit 
export function convertFieldToSubmit (item){
  // let unitFlag = getChmUnitFlag(item.limitUnit, item.packUnit, item.unitKey);
  //数量换算
  // 换算最小单位数量
  // let qty =
  // unitFlag == "1" ?
  // item.qty * 1 * item.packQuantity :
  // item.qty;
  // console.log("unitFlag::::::", unitFlag);
  // let qty = getQtyByUnitFlag(
  //   unitFlag,
  //   item.qty,
  //   item.packQuantity,
  //   "save"
  // );
  
  item.quantity = item.qty;
  // console.log(item.limitUnit, item.packUnit, item.unitKey);
  // item.unitFlag = unitFlag;
  item.unit = item.limitUnit;
  // console.log("item.unitKey", item.unitKey);
  // console.log("item.unit", item.unit);
  // console.log("item.packUnit", item.packUnit);
} 

 
function getRecipeCodeList (dataList = []){
  let recipeCodeList = dataList.map(item => {
    // 数量单位转换
    // let qty =
    //   item.unitFlag == "0" ?
    //   item.quantity :
    //   item.quantity / item.packQuantity;
    // item.limitUnit = item.unit;
    
    //unitFlag 0 小单位 1 大单位
    // let unitKey = item.unitFlag == "0" ? item.limitUnit : item.packUnit;
    // item.qty = qty;
    // item.unitKey = unitKey;

    convertFieldFromGetList(item);
    item.unitOptions = [];
    return item.recipeCode;
  });
  recipeCodeList = Array.from(new Set(recipeCodeList));
  return recipeCodeList;
}


export function getRecipeIdByCode (dataList, code = "-1"){
  if (code == "-1") {return;}
  // console.log(dataList, code);
  let findObj = dataList.find(item => item.recipeCode == code);
  // console.log(findObj);
  // eslint-disable-next-line consistent-return
  return findObj.recipeId;
}

// 设置病种选择
function setDisSelectInfo (rowData){
  let { chronicDisease, diseaseType } = rowData;
  return {
    chronicDisease,
    diseaseType
  }
}


// let obj = {
//   recipeCode: recipeCode,
//   orderStatus: "",
//   recipeStatus: "",
//   drugList: []
// };
//整理数据格式  [obj]
export function organizeData (dataList = []){
  let recipeCodeList = getRecipeCodeList(dataList);
  let tableChuFangList = [];
  recipeCodeList.forEach(recipeCode => {
    let obj = {
      recipeCode: recipeCode,
      orderStatus: "",
      recipeStatus: "",
      drugList: []
    };
    dataList.forEach(sonItem => {
      if (sonItem.recipeCode === recipeCode) {
        obj.drugList.push(sonItem);
        obj.orderStatus = sonItem.orderStatus;
        obj.recipeStatus = sonItem.recipeStatus;
        // 病种选择
        obj.disSelectInfo = setDisSelectInfo(sonItem);
      }
    });
    tableChuFangList.push(obj);
  });
  return tableChuFangList;
}





export function getPushNo(n = 0) {
  // 0  push 4个
  if (n == 0) {
    return singleTdNum;
  }
  //除去0以外的取余为0, push 0
  if (n % singleTdNum == 0) {
    return 0;
  }
  //其余 push 减法
  return singleTdNum - n % singleTdNum;
}

export function drugsPushNo(pushNo = singleTdNum, drugs = []) {
  for (let index = 0; index < pushNo; index++) {
    drugs.push({});
  }
  return drugs;
}

export { getQtyByUnitFlag, getChmUnitFlag, setDisSelectInfo };
