import {
  validQuoteHerbal
} from "@/api/tools/commonDrug.js";
import {
  totalTdNum,
  chmDrugsKey,
  chmFormKey,
  singleTdNum
} from "./variable.js";
import {
  getArrayList
} from "@/api/wconf/wparam";

import {
  amtCalculatFunc
} from "@/components/adviceCommon/drugCalculatFunc.js";

import {
  getDiaByPatientCode
} from "@/api/homeSickbeds/hsDiagTreat/hsOrder.js";

import {
  deepClone
} from "@/utils/index.js";
import vueObject from 'vue'
let vObject = new vueObject();

export async function validQuoteHerbalChnDrug(params, msg) {
  try {
    let res = await validQuoteHerbal(params);
    if (res.code != 1) {
      this.$message.error(res.msg || msg);
      return false;
    }
    return true;
  } catch (e) {
    this.$message.error(e.msg || msg);
    return false;
  }
}

// 处方列表里 中的 第一条第三方配送
export function getKuaiDiRow (list = []){
  console.log("list::::", list);
  let kdObj = list.find((item)=>{
    return item.dispendingMethod == 2;
  });
  return kdObj;
}

// 中草药处方的整体的数据结构
export function getWholeChmDataStructure(recipeCode = "", orderStatus = "", drugList = [], extendObj = {}) {
  let structure = {
    no: recipeCode,
    status: orderStatus,
    drugs: drugList,
    dispendingMethod: "1",
    row_id: +new Date()
  };

  // 表单初始化
  chmFormKey.forEach((item) => {
    structure[item.key] = item.originValue;
  });


  return {
    ...structure,
    ...extendObj
  };
}


// function emptyList() {
//   return creatSomeEmptyList(singleTdNum);
// }



export function getDiagnose(ajaxData) {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        data,
        code,
        msg
      } = await getDiaByPatientCode(ajaxData);
      if (code == 1) {
        if (data.length > 0) {
          resolve(true);
        } else {
          vObject.$message.warning("该患者没有开中医诊断，请先开诊断！");
          reject("11");
        }
      } else {
        vObject.$message.error(msg || "获取患者诊断失败！");
        reject(false);
      }
    } catch (error) {
      // vObject.$message.error("获取患者诊断失败！");
      reject(false);
    }
  })
}

export function creatEmptyList(item = {}, length = singleTdNum) {
  let list = [];
  let eleItem = deepClone(item)
  for (let i = 0; i < length; i++) {
    list.push(eleItem);
  }
  return list;
}

export function isEmpty (value){
  return typeof value == "undefined" || value == null || value == ""; 
}

// code 获取数量单位 中文
export function getUnitTextAjax(unitList = []) {
  // 获取单位数据
  let param = [];
  let shows = unitList;
  let unitOptions = [];
  // 判断药品是否可拆零
  param.push({
    code: "DrugUnit",
    field: "code",
    shows: shows
  });

  return new Promise((resolve, reject) => {
    getArrayList(param)
      .then(async res => {
        //继续选中操作
        if (res.code === 1) {
          for (let i = 0; i < res.data.DrugUnit.length; i++) {
            if (res.data.DrugUnit[i].name) {
              unitOptions.push({
                label: res.data.DrugUnit[i].name,
                value: res.data.DrugUnit[i].code
              });
            }
          }
          resolve(unitOptions);
        } else {
          this.$message.error(
            res.msg ? res.msg : "获取药品单位有误，请确认无误后再选择！"
          );
          resolve(false);
        }
      })
      .catch(() => {
        reject(false);
      });
  });
}



export function getNearNumber(n) {
  return Math.ceil(n / singleTdNum) * singleTdNum;
}

export function drugsPushNo(pushNo = singleTdNum, drugs = []) {
  for (let index = 0; index < pushNo; index++) {
    drugs.push({});
  }
  return drugs;
}

//limitUnit 包装小单位
//pakUnit 包装大单位
//unitKey 选中单位
function getChmUnitFlag (limitUnit = "", pakUnit = "", unitKey = ""){
  if(limitUnit == pakUnit) return "1";
  return unitKey === pakUnit ? "0" : "1";
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

// 20200619 待编辑状态的处方最多只能有一条，不能同时编辑多条处方
export function isGreaterThanOne(list) {

  let number = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].row_id) {
      number++;
    }
  }
  if (number >= 1) {
    return true;
  }
  return false;
}

//药品列表 drugs
//药品剂量 pharmacyDosage
export function computeAmtHandler(drugs = [], pharmacyDosage = 0) {
  let singleTotal = 0;
  let allTotal = 0;
  let no = pharmacyDosage;
  drugs.forEach(drug => {
    let unitKey = drug.unit;
    try {
      //数量是 用药剂数 no  * 药品数量
      let drugQty = typeof drug.quantity != "undefined" ? drug.quantity * no : 0;
      let drugDetails = drug.item;
      let price = typeof drugDetails.price != "undefined" ? drugDetails.price : 0;
      let packQty = drugDetails.pkgMeasure ? drugDetails.pkgMeasure * 1 : 1;
      // 只有药品计算时使用，其他不要使用这个
      let unitFlag = getChmUnitFlag(drugDetails.limitUnit, drugDetails.pkgUnit, unitKey);
      //  最终数量 * 单价 （大包装是单价除以包装量）
      drug.amt = amtCalculatFuncWrapper(drugQty, price, packQty, unitFlag);
      // 单个药品  总价 保留两位小数 
      drug.amt = Number(drug.amt).rewToFixed(2);
      console.log(drug.itemName, "amt::::::", drug.amt);
      //单条医嘱总金额相加
      allTotal = Number(allTotal) + Number(drug.amt);
    } catch (error) {
      allTotal = 0;
      singleTotal = 0;
    }
  });

  singleTotal = no != 0 ? Number(allTotal / no) : 0;
  return {
    singleTotal,
    allTotal
  };
}


function amtCalculatFuncWrapper (drugQty, price, packQty, unitFlag){
  // console.log("drugQty",drugQty, "price", price, "packQty", packQty, "unitFlag", unitFlag);
  return amtCalculatFunc(drugQty, price, packQty, unitFlag, 10);
}

export function alertFunc(text) {
  return new Promise((resolve, reject) => {
    vObject.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(async () => {
        //继续选中操作
        resolve(true);
      })
      .catch(() => {
        //取消操作
        reject(false);
      });
  });
}

export function isCurrentRowChange(newItem = {}, allData = []) {
  let {
    id
  } = newItem;
  //获取 当前行
  let oldCurRow = getCurrentRow(id, allData);
  //核对表单
  if (!isSameOnDrugForm(newItem, oldCurRow)) {
    return true;
  }

  // 核对drug列表
  return !isSameOnDrugsList(newItem, oldCurRow);
}

// 获取当前列表
function getCurrentRow(id = -1, allData = []) {
  return allData.find(item => {
    return item.id == id && typeof item.id !== "undefined";
  });
}

// 对比表单数据
function isSameOnDrugForm(newItem = {}, oldCurRow = {}) {
  let isSame = chmFormKey.every((field) => {
    return newItem[field.key] == oldCurRow[field.key]
  })
  return isSame;
}

// 药品列表对比
function isSameOnDrugsList(newItem = {}, oldCurRow = {}) {
  //过滤含有药品id的列表
  let filteredNew = filterDrugsContainId(newItem.drugs);
  let filteredOld = filterDrugsContainId(oldCurRow.drugs);
  if (filteredNew.length != filteredOld.length) return false;

  //对比 具体的项
  return isSameList (filteredNew, filteredOld);
}

// 过滤废数据
function filterDrugsContainId(data = []) {
  return data.filter(item => {
    return typeof item.itemId != "undefined";
  });
}

// 对比 药品的列表的详情
function isSameList(newList = [], oldList = []) {
  let isAllSame = newList.every((item, index)=>{
    let isSame = chmDrugsKey.every((field) => {
      return item[field] == oldList[index][field]
    })
    return isSame;
  });
  return isAllSame;
}