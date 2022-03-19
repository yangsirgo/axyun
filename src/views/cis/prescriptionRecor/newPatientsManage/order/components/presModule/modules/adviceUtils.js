import {
  colDisabledText,
  relationDisabledList_cis,
  frequencyObjKeys,
  zancunStatus
} from "./variable.js";
import {
  amtCalculatFunc,
  drugCalculatFunc
} from "@/components/adviceCommon/drugCalculatFunc.js";
import {
  setComponentFocusFunc,
  setNextComponentFocus,
  setGroupNoList,
  getGroupList,
  fiteredMajorNoData,
  getUnitFlag,
  numToPrecision,
  getPharmacyData
} from "@/components/adviceCommon/adviceUtils.js";

import {
  getOrder,
  getPageItemList,
  submitOrders,
  bunching,
  unbunching,
  batchRemoveOrders,
  saveOrdersMould,
  getRecipeCode,
  saveOrder,
  saveOrders,
  getRecipeNo,
  validAntibacterialAuth,
  getAdviceItem,
  validAdviceItem,
  outpatientNonDrugOrderSave,
  getExecResult,
  getPrintDataAjax,
  handleFreeCharge
} from "@/api/cis/order/order";

import {
  getArrayList
} from "@/api/wconf/wparam";
import {
  deepClone,
  Throttle
} from "@/utils/index.js";
import { getEffectiveRecord } from "@/api/common/allergy";
import { getDiaByClinicType } from "@/api/cis/visit/visit";
import { getDataIdDom } from "@/utils/util.js";
import vueObj from "vue";
let newVueObj = new vueObj();

export function configToData(config = [], row, Vue = false) {
  config.forEach(item => {
    if (isInputFalse(item)) {
      row[item.prop + colDisabledText] = true;
      if (Vue) {
        Vue.$set(row, item.prop + colDisabledText, true);
      }
    }

    if (isInputTrue(item)) {
      row[item.prop + colDisabledText] = false;
      if (Vue) {
        Vue.$set(row, item.prop + colDisabledText, false);
      }
    }


  });

  return row;
}
// 清空当前行数据    //清空当前行
function clearCurrentRow(currentRow, Vue) {
  let addRowEmpty = resetCurrentData(Vue, {
    recipeCode: currentRow.recipeCode, 
    recipeId: currentRow.recipeId,
    no: currentRow.no,
    freeDrug: currentRow.freeDrug,
    freeReason: currentRow.freeReason,
    row_id: currentRow.row_id,
    freeRecipe: currentRow.freeRecipe,
    ...Vue.disSelectInfo // 病种选择
  });
  // console.log("覆盖前的rowId", addRowEmpty.row_id);
  // let { row_id } = Vue.tableRuleForm.tableData[Vue.currentRowIndex];
  // addRowEmpty = {
  //   ...addRowEmpty,
  //   ...{
  //     row_id
  //   }
  // }
  Vue.$set(
    Vue.tableRuleForm.tableData,
    Vue.currentRowIndex,
    addRowEmpty
  );
  // console.log("覆盖后的rowId", Vue.tableRuleForm.tableData[Vue.currentRowIndex].row_id);
  // console.log("clearCurrentRow", "clearCurrentRow");
  clearLInputTable(currentRow, Vue);
}

//当前行初始化数据
function resetCurrentData(Vue, extendObj = {}) {
  let addRowEmpty = {};
  Vue.tableColumn.forEach(item => {
    addRowEmpty[item.prop] = "";
  });
  // try {
  //   console.log("row_id:::::", Vue.tableRuleForm.tableData[
  //     Vue.currentRowIndex
  //   ].row_id);
  //   addRowEmpty["row_id"] = Vue.tableRuleForm.tableData[
  //     Vue.currentRowIndex
  //   ].row_id;
  // } catch (error) {
    
    addRowEmpty["row_id"] = +new Date();

  //   console.log("row_id:::::error", addRowEmpty["row_id"]);
  // }
  // try {
    // addRowEmpty["freeRecipe"] = Vue.tableRuleForm.tableData[
    //   Vue.currentRowIndex
    // ].freeRecipe;
    // addRowEmpty["freeReason"] = Vue.tableRuleForm.tableData[
    //   Vue.currentRowIndex
    // ].freeReason;
    // addRowEmpty["freeDrug"] = Vue.tableRuleForm.tableData[
    //   Vue.currentRowIndex
    // ].freeDrug;
    // addRowEmpty["recipeCode"] = Vue.tableRuleForm.tableData[
    //   Vue.currentRowIndex
    // ].recipeCode;
    // addRowEmpty["no"] = Vue.tableRuleForm.tableData[Vue.currentRowIndex].no; 
  // } catch (error) {
    addRowEmpty["freeRecipe"] = "";
    addRowEmpty["freeReason"] = "";
    addRowEmpty["freeDrug"] = "";
    addRowEmpty["no"] = "";
    addRowEmpty["recipeCode"] = "";
  // }
  addRowEmpty["unqualifiedComment"] = "";
  addRowEmpty["price"] = 0;
  addRowEmpty["amt"] = 0;

  // 用药天数 数量 初始值设置为 undefined 因为 数字组件为空 不为0
  addRowEmpty["useDay"] = undefined;
  addRowEmpty["orderItemName"] = "";
  addRowEmpty["qty"] = undefined;
  addRowEmpty["relation"] = undefined;
  // addRowEmpty["qty"] = undefined;
  addRowEmpty["skinTestDisabled"] = true;
  addRowEmpty["overReasonShow"] = false;
  addRowEmpty["limitResultCode"] = null;
  addRowEmpty["chronicDisease"] = null;
  addRowEmpty["chronicDiseaseName"] = null;
  //自备药 重置
  addRowEmpty["selfProvided"] = "1";

  //医嘱状态
  addRowEmpty["orderStatus"] = "";
  // 频次 清空
  addRowEmpty["frequencyCode"] = "";
  addRowEmpty["frequencyTimes"] = null;
  addRowEmpty["frequencyUnit"] = null;


  // debugger
  return {
    ...addRowEmpty,
    ...extendObj
  };
}

//清空药品搜索框
function clearLInputTable(currentRow, Vue) {
  // let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
  // refs 方式 如果有fixed列会失效，直接用操作DOM处理
  Vue.$nextTick(() => {
    // debugger
    console.log(currentRow.row_id);
    let targetDataId = "lInputTable" + currentRow.row_id;
    let nodeList = getDataIdDom("div", "data-id", targetDataId);
    if (nodeList.length > 0) {
      nodeList.forEach(element => {
        element.getElementsByClassName("el-input__inner")[0].value = "";
      });
    }
  });
}

// 多条 未编辑 的医嘱
export function isGreaterThanOne(tableData) {
  // console.log("this.tableRuleForm.tableData", Vue.tableRuleForm.tableData);
  let list = tableData;
  let number = 0;
  for (var i = 0; i < list.length; i++) {
    // console.log("list[i].row_id", list[i].row_id);
    if (list[i].row_id) {
      number++;
    }
  }
  if (number >= 1) {
    return true;
  }
  return false;
}

// 相同的成组no
export function isSameGroup(multipleSelection) {
  let groupNo = null;
  return multipleSelection.every((item, index) => {
    if (index === 0) {
      groupNo = item.groupNo;
    }
    return item.groupNo === groupNo;
  });
}

//判断同一处方
//同一处方
export function isSameRp(multipleSelection) {
  let rpName = null;
  return multipleSelection.every((item, index) => {
    if (index === 0) {
      rpName = item.recipeCode;
    }
    return item.recipeCode === rpName;
  });
}

//判断是相同的 row
export function isSameRowById(aRow = {}, bRow = {}) {
  return aRow.id === bRow.id;
} 

//成组或者取消成组 成员中是否全部暂存状态
export function isZanCunStatus(list = []) {
  return list.every(item => {
    return item.orderStatus === "0"; //只有暂存状态能提交
  });
}

function isInputFalse(item) {
  return typeof item.input != "undefined" && !item.input;
}

function isInputTrue(item) {
  return typeof item.input != "undefined" && item.input;
}

//副医嘱数据设定
export function setNotMajorRowData(adviceItem = {}, Vue, id, groupNo) {
  // let {id, groupNo} = majorRow;
  // isMajor等于0 是主医嘱; 
  // majorId 是成组的非主医嘱才有
  let setObject = {
    isMajor: undefined,
    majorId: id,
    // groupNo
  };
  for (const key in setObject) {
    if (setObject.hasOwnProperty(key)) {
      const element = setObject[key];
      Vue.$set(adviceItem, key, element);
    }
  }
  // console.log("setNotMajorRowData", adviceItem);
}



//不是主医嘱也不是副医嘱数据设定
export function setNormalRowData(adviceItem = {}, Vue) {
  // isMajor等于0 是主医嘱; 
  // majorId 是成组的非主医嘱才有
  let setObject = {
    isMajor: undefined,
    majorId: undefined,
    // groupNo: undefined
  };
  

  for (const key in setObject) {
    if (setObject.hasOwnProperty(key)) {
      const element = setObject[key];
      Vue.$set(adviceItem, key, element);
    }
  }
  // console.log("setNormalRowData", adviceItem);
}

//关联到的主医嘱 数据设定
export function setRelationToRowData(adviceItem = {}, Vue) {
  if (isFreeRow(adviceItem)) {
    // isMajor等于0 是主医嘱; 
    let setObject = {
      isMajor: 0,
      // groupNo: + new Date(),
      majorId: undefined
    };
    console.log("setObject",setObject);
    for (const key in setObject) {
      if (setObject.hasOwnProperty(key)) {
        const element = setObject[key];
        Vue.$set(adviceItem, key, element);
      }
    }
  }

}

//没有成组的 row
function isFreeRow(row) {
  let { isMajor, majorId } = row;
  return isMajor != 0 && typeof majorId == "undefined";
}

//是否有关联的
export function isRowInRelationed(row) {
  return typeof row.relation != undefined && row.relation != "" && row.relation != null;
}

// 副医嘱判断
export function isNotMajorRow(adviceItem = {}) {
  const {
    isMajor,
    majorId,
    id
  } = adviceItem;

  // isMajor等于0 是主医嘱; 
  // majorId 是成组的非主医嘱才有
  return isMajor != "0" && (typeof majorId != "undefined" && majorId != id);
}

// 主医嘱判断
export function isMajorRow(adviceItem = {}) {
  const {
    isMajor,
    majorId,
    id
  } = adviceItem;

  // isMajor等于0 是主医嘱; 
  // majorId 是成组的非主医嘱才有
  return typeof isMajor != "undefined" && isMajor == "0";
}

// 是否在组中
export function isInGroup(adviceItem = {}, groupNoList = []) {
  const {
    isMajor,
    majorId,
    id
  } = adviceItem;

  // isMajor等于0 是主医嘱; 
  let isMajorRow = typeof isMajor !== "undefined" && isMajor == "0";
  
  // majorId 是成组的非主医嘱才有
  let isNotMajorRow = typeof majorId !== "undefined" && majorId !== "" && majorId !== null;

  // 成组后，删除副医嘱， 主医嘱还存在 isMajor:0
  // 成组后，删除主医嘱， 副医嘱还存在 majorId
  // 修复这个问题
  let isInGroup = groupNoList.some(item => item.key === id || item.key === majorId);
  //console.log(isInGroup, isMajorRow, isNotMajorRow);
  return (isMajorRow || isNotMajorRow) && isInGroup;
}

// 设置关联组 的值
export function setRelateGroupNo(groupNoList, row, Vue) {
  let {
    key,
    value
  } = getGroupListBygroupNo(groupNoList, row);
  //console.log(key, value);
  setRelateGroupNoFunc(value, row, Vue);
}

//更新 成组列表
//  成组 只在一个处方中 
export function updateGroupNoList(tableData) {
  let allRpList = updateAllRecipe(tableData);// 处方列表  key value
  let groupedList = []; // 成组的数组
  for (let index = 0; index < allRpList.length; index++) {
    const { value } = allRpList[index];
    // const { value } = element;
    if (value.length > 1) {
      let uMajorIdList = getUniqueMajorIdList(value);
      let itemGroupedList = groupedListByMajorId(uMajorIdList, value);
      // 合并 单处方的成组数据
      groupedList = groupedList.concat(itemGroupedList);
    }
  }

  // 去重
  // allUniqueMajorId = Array.from(new Set(allUniqueMajorId));

  // let uMajorIdList = getUniqueMajorIdList(tableData);
  // console.log("uMajorIdList", uMajorIdList);
  // let LIST = groupedListByMajorId(allUniqueMajorId, tableData);
  console.log("groupedList", groupedList);
  return groupedList;
}

//去重之后的 MajorId 列表 变成成组格式
function groupedListByMajorId(uMajorIdList, tableData) {
  let groupList = [];
  // 主医嘱 isMajor：0， id：123
  // 副医嘱 majorId：123
  let groupKeys = ["majorId", "id"];
  uMajorIdList.forEach((item, index) => {
    //遍历 成map结构
    let filterList = tableData.filter((sonItem, sonIde) => {
      return groupKeys.some(gKey => item === sonItem[gKey]);
    });
    // 解决 成组后， 删除主医嘱，副医嘱还存在 majorId 的问题，所以成组的数组需要大于1
    if (filterList.length > 1) {
      groupList.push({
        key: item,
        value: filterList
      });
    }
  });
  return groupList;
}


//更新 整处方列表
function updateAllRecipe(tableData) {
  let receipIdList = getUniqueRecipeIdList(tableData);
  let LIST = orgnazatReceipIdList(receipIdList, tableData);
  // console.log("LIST", LIST);
  return LIST;
}


//去重之后的  recipeId 列表 变成整处方格式
function orgnazatReceipIdList(uMajorIdList, tableData) {
  let allReceiptList = [];
  uMajorIdList.forEach((item, index) => {
    //遍历 成map结构
    let filterList = tableData.filter((sonItem, sonIde) => {
      return item === sonItem.recipeId;
    });
    allReceiptList.push({
      key: item,
      value: filterList
    });
  });
  return allReceiptList;
}


//获取去重之后的 MajorId (uniqKey) 列表
function getUniqueMajorIdList(tableData, uniqKey = "majorId") {
  let majorIdList = tableData.map(item => {
    return item[uniqKey];
  });
  majorIdList = majorIdList.filter((item) => {
    return typeof item != "undefined" && item != "" && item != null;
  });
  return Array.from(new Set(majorIdList));
}

//获取去重之后的 recipeId 列表
function getUniqueRecipeIdList(tableData) {
  let receipIdList = tableData.map(item => {
    return item.recipeId;
  });
  receipIdList = receipIdList.filter((item) => {
    return typeof item != "undefined" && item != "" && item != null;
  });
  return Array.from(new Set(receipIdList));
}


function setRelateGroupNoFunc(value = [], row = {}, Vue) {
  // console.log("value", value);
  value.forEach((notMajorRow) => {
    // 主医嘱不处理
    if (notMajorRow.id == row.id) return;

    // 对关联项(副医嘱) 进行赋值
    relationDisabledList_cis.forEach(prop => {
      if (prop == "frequencyCode") {
        frequencyObjKeys.forEach(key => {
          //console.log(notMajorRow.orderItemName,notMajorRow.price, key, row[key]);
          Vue.$set(notMajorRow, key, row[key]);
        })
      } else {
        //console.log(notMajorRow.orderItemName,notMajorRow.price, prop, row[prop]);
        Vue.$set(notMajorRow, prop, row[prop]);
      }
    });
    let {
      qty
    } = calculatAmtAndQty(notMajorRow, Vue);

    // console.log("notMajorRow", notMajorRow, qty);
    overReasonShowControlFunc(qty, notMajorRow, Vue);
  });
}
//控制超量提醒
function overReasonShowControlFunc(qty = 0, currentRow = {}, Vue) {
  // let usedDay = calculatDayUsedOverReason(qty, currentRow.dosage, currentRow.onceDosage, currentRow.packQuantity, currentRow.unitKey, currentRow.packUnit, currentRow);
  let usedDay = currentRow.useDay;
  // console.log("用药天数day", usedDay);
  Vue.$set(currentRow, "day", usedDay);
  if (usedDay > 7) {
    Vue.$set(currentRow, "overReasonShow", true);
  } else {
    Vue.$set(currentRow, "overReasonShow", false);
  }
  //显示超量提醒
  if (!(usedDay > 7)) {
    // currentRow.excessReason = "";
    Vue.$set(currentRow, "excessReason", "");
  }

  // console.log("用药天数currentRow", currentRow.orderItemName, currentRow);
}

//计算可用天数
function calculatDayUsedOverReason(qty = 0, dosage = 1, onceDosage = 0, packQuantity, unitKey, packUnit, row) {
  let day = 0;
  let times = calculatTimesByFreq(row);
  let unitFlag = getCisUnitFlag(unitKey, packUnit);
  let limitQty =
    unitFlag == "0" ?
    qty * packQuantity * 1 :
    qty * 1;
  if (onceDosage !== 0) {
    day = (limitQty * dosage) / onceDosage / times;
    day = Math.ceil(day); //向上取整  可用天数字段
    return day;
  }
  return day;
}

function getCisUnitFlag(unitKey = 1000, packUnit = 1000) {
  return unitKey == packUnit ? "0" : "1";
}

function calculatTimesByFreq(freq = {}) {
  let times = 1;
  // console.log("frequencyUnit", freq.frequencyUnit);
  // console.log("frequencyTimes", freq.frequencyTimes);
  if (freq.frequencyUnit === "天") {
    times = freq.frequencyTimes;
  }
  return times;
}

//计算金额和数量
function calculatAmtAndQty(setRow, Vue) {
  let freqObj = {
    frequencyUnit: setRow.frequencyUnit,
    frequencyTimes: setRow.frequencyTimes
  };
  let unitFlag = getUnitFlag(setRow.packUnit, setRow.unitKey);
  let { packQuantity } = setRow;
  let qty = Vue.handleQtyUtil(setRow.useDay, freqObj, setRow.onceDosage, setRow.dosage, setRow, unitFlag);
  Vue.$set(setRow, "qty", qty);
  let amt = amtCalculatFunc(setRow.qty, setRow.price, packQuantity, unitFlag);
  Vue.$set(setRow, "amt", amt);
  return {
    qty
  }
}

//获取同组的数据
function getGroupListBygroupNo(groupNoList = [], row = {}) {
  // let id = row.id;
  // if (isHasNewRow(row)){ // 新增数据处理
  //   id = row.majorId;
  // }
  // 主医嘱 格式 isMajor:0, 
  // 副医嘱 格式 majorId: 主医嘱的id; isMajor: undefined
  let findKeys = ["majorId", "id"];
  let fiteredObj = groupNoList.find(groupItem => {
    // return groupItem.key === row.groupNo || groupItem.key === id;
    // return groupItem.key === row.groupNo;
    return findKeys.some(keyItem => groupItem.key === row[keyItem]);
  })
  return fiteredObj || {
    value: [],
    key: ""
  }
}

//过滤 暂存的数据
function getZanCunRow(tableData) {
  return tableData.filter(item => {
    return item.orderStatus == zancunStatus;
  })
}

//过滤 暂存的数据
export function getZanCunAndNewRow(tableData) {
  return tableData.filter(item => {
    return isZanCunAddNewStatus(item);
  })
}

function isZanCunAddNewStatus(item) {
  return item.orderStatus == zancunStatus || item.orderStatus == '' || typeof item.orderStatus == 'undefined';
}

//数据计算 根据unitFlag 
// 0 是小单位
// unitFlag 大单位 小单位标识
// quantity 当前数量\
// packQuantity 包装量
// type 类型insert 存  
//type 类型save 取  
function getQtyByUnitFlag(unitFlag, quantity, packQuantity, type) {
  // console.log(unitFlag, quantity, packQuantity, type);
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
  return numToPrecision(qty);
}

//处理 提交的数据 quantity unitFlag  skinTest  urgent no
export function handleSubmitRow(submitRow, patientInfo, pharmacyId, disSelectInfo = {}, Vue) {
  //console.log("deepClone之前", submitRow);
  let submitRowClone = deepClone(submitRow);
  // let submitRowClone = submitRow;
  //console.log("deepClone之后", submitRow);
  submitRowClone.forEach(item => {
    //console.log("item.qty", item.qty);
    //数量换算 换算最小单位数量
    // 医生选择单位标识 0-小包装单位  1-大包装单位
    let flag = item.unitKey === item.packUnit ? "1" : "0";
    item.unitFlag = flag;
    // Vue.$set(item, "quantity", item.qty);
    //数量计算
    item.quantity = getQtyByUnitFlag(item.unitFlag, item.qty, item.packQuantity, "save");
    //console.log("item.qty", item.qty, "item.quantity", item.quantity);
    item.skinTest = item.skinTest === "" ? "0" : item.skinTest;
    item.urgent = item.urgent === "" ? "0" : item.urgent;
    item.selfProvided = item.selfProvided === "" ? "1" : item.selfProvided;
    item.no = item.relation === "undefined" ? "" : item.relation;
    item.patientAge = patientInfo.patientAge;
    item.execDeptCode = pharmacyId;
    item.receiveDept = pharmacyId;
    item.no = item.relation === "undefined" ? "" : item.relation;
    item.unit = item.limitUnit; // 后端返回的 unit 是小单位,存储的时候变成小单位
    // console.log(item.useDay, item.qty);
    //// 新增的处方增加病种选择 字段
    if (!item.id && item.row_id) {
      item.chronicDisease = disSelectInfo.chronicDisease;
      item.chronicDiseaseName = disSelectInfo.chronicDiseaseName;
      item.diseaseType = disSelectInfo.diseaseType;
      // this.$set(item, "ChronicDisease", disSelectInfo.ChronicDisease);
      // this.$set(item, "ChronicDiseaseName", disSelectInfo.ChronicDiseaseName);
    }
  });
  return submitRowClone;
}


//治疗 处理 提交的数据 quantity unitFlag  skinTest  urgent no
export function treatDescriptionData(submitRow, disSelectData = {}) {
  let submitRowClone = deepClone(submitRow);
  let disSelectInfo = deepClone(disSelectData);
  // console.log("disSelectInfo:::::", disSelectInfo);
  submitRowClone.forEach(item => {
    //数量计算
    item.quantity = item.qty;
    item.unit = item.unitKey; // 后端返回的 unit 是小单位,存储的时候变成小单位
    // console.log(item.useDay, item.qty);
    //// 新增的处方增加病种选择 字段
    if (!item.id && item.row_id) {
      // console.log("数据更改中。。。。");
      item.diseaseType = disSelectInfo.diseaseType;
      item.chronicDisease = disSelectInfo.chronicDisease;
      item.chronicDiseaseName = disSelectInfo.chronicDiseaseName;
      // item = {
      //   ...item,
      //   ...disSelectInfo
      // }
      // console.log("数据更改后。。。。", item);
      // this.$set(item, "ChronicDisease", disSelectInfo.ChronicDisease);
      // this.$set(item, "ChronicDiseaseName", disSelectInfo.ChronicDiseaseName);
    }
  });
  // console.log("需要提交的数据submitRowClone", submitRowClone);
  return submitRowClone;
}

export function saveOrderDraft(ajaxData, type = "adviceTable") {
  return new Promise(async (resolve, reject) => {
    try {
      let result = {};
      switch (type) {
        case "treatMedicine":
          result = await outpatientNonDrugOrderSave(ajaxData)
          break;

        default:
          result = await saveOrder(ajaxData);
          break;
      }
      let {
        data,
        code,
        msg
      } = result;
      if (code == 1) {
        resolve(true);
      } else {
        newVueObj.$message.error(msg || "暂存出错");
        reject(false);
      }
    } catch (error) {
      newVueObj.$message.error("暂存出错");
      reject(false);
    }
  })
}



//暂存全部
// export async function draftSaveAll(Vue) {
//   if (Vue.listLoading) return;
//   Vue.listLoading = true;
//   let data = getZanCunRow(Vue.tableRuleForm.tableData);
//   data = Vue.handleSubmitRowWrapper(data);
//   for (let i = 0; i < data.length; i++) {
//     const row = data[i];
//     try {
//       let result = await saveOrderDraft(row);
//       newVueObj.$message.success("第" + (i + 1) + "条，暂存成功！");
//       if (data.length == (i + 1)) {
//         Vue.listLoading = false;
//         Vue.getList();
//       }
//       continue;
//     } catch (error) {
//       console.log(row, "失败了");
//       Vue.listLoading = false;
//       break;
//     }
//   }
// }

export function getCutable(currentItem) {
  let cutable = false;
  if (currentItem.cutable == "1") {
    cutable = true;
  }
  return cutable;
}

// code 获取数量单位 中文
export function getQtyUnitAjax(data, Vue) {
  return new Promise(async (resolve, reject) => {
    // 获取单位数据
    let param = [];
    let shows = [];
    let unitOptions = [];
    shows.push(data.packUnit);
    // 判断药品是否可拆零
    if (
      data.unitSaleFlg === "1" ||
      (data.unitSaleFlg === undefined && data.limitUnit)
    ) {
      shows.push(data.limitUnit);
    }
    param.push({
      code: "DrugUnit",
      field: "code",
      shows: Array.from(new Set(shows))
    });
    // Vue.listLoading = true;
    try {
      let rep = await getArrayList(param);
      if (rep.code === 1) {
        for (let i = 0; i < rep.data.DrugUnit.length; i++) {
          if (rep.data.DrugUnit[i].name) {
            unitOptions.push({
              label: rep.data.DrugUnit[i].name,
              value: rep.data.DrugUnit[i].code
            });
          }
        }
        // Vue.listLoading = false;
        resolve(unitOptions);
        // eslint-disable-next-line no-else-return
      } else {
        // Vue.listLoading = false;
        newVueObj.$message.error(
          rep.msg ? rep.msg : "获取药品单位有误，请确认无误后再选择！"
        );
        reject(false)
      }
    } catch (e) {
      // Vue.listLoading = false;
      newVueObj.$message.error("获取药品单位有误，请确认无误后再选择！");
      reject(false)
    }
  })
}

//不同药品 皮试有不同的默认项
// 参见皮试需求
export function selectSkinTestController(data) {
  //console.log("selectSkinTestController", data);
  // 选择的时候 applicationRange  0 是全院  1是住院 2是门诊
  skinTestStatusController(data);
  // 此处没有禁用处理
  if (isInHospitalDrug(data)) {
    //住院
    //皮试不选中
    data.skinTest = "0";
  } else {
    // 全院  门诊
    if (isSkinTestDrugs(data)) {
      // 皮试药品勾选皮试
      data.skinTest = "1";
    } else {
      //非皮试药品
      data.skinTest = "0";
    }
  }

}

// getList 之后 只对状态控制 值取后端的值
function skinTestStatusController(data) {
  // console.log("data.stType", data.stType);

  if (isInHospitalDrug(data)) {
    //住院
    //皮试禁用
    //皮试不选中
    data.skinTestDisabled = true;
  } else {
    // 全院  门诊
    if (isSkinTestDrugs(data)) {
      // 皮试药品勾选皮试
      data.skinTestDisabled = false;
    } else {
      //非皮试药品
      data.skinTestDisabled = false;
    }
  }
}

// 判断是否为皮试药品
function isSkinTestDrugs(data) {
  // console.log("stType", data.stType);
  return data.stType !== "" && typeof data.stType !== "undefined";
}

// 判断住院
function isInHospitalDrug(data) {
  return data.applicationRange === "1";
}

function setOverReasonShow(data) {
  if (typeof data.day != "undefined" && data.day > 7) {
    data.overReasonShow = true;
  } else {
    data.overReasonShow = false;
  }
}

//关联 查找相同项
export function getRelationRow(tableData = [], curObj = {}) {
  return tableData.find(item => {
    return isSameRow(item, curObj);
  });
}

function isSameRow(aRow, bRow) {
  return aRow.recipeCode == bRow.recipeCode && aRow.no == bRow.relation
}

//判断是否有空行
export function isHasEmptyRow(tableData = []) {
  return tableData.some((item) => {
    return uneditedEmptyRow(item);
  });
}


// 真正的空行： 空行 并且 没有输入药品
function uneditedEmptyRow(row) {
  return isHasNewRow(row) && !row.orderItemId;
}

function editedEmptyRow(row) {
  return isHasNewRow(row) && row.orderItemId;
}

//判断是否有空行
export function isHasEditedEmptyRow(tableData = []) {
  return tableData.some((item) => {
    return editedEmptyRow(item);
  });
}


//删除空行
export function deleteEmptyRow(tableData = []) {

  // tableData.forEach(item => {
  //   //删除用户新增的费数据
  //   if (isEmptyRow(item)) {
  //     tableData.splice(
  //       tableData.findIndex(
  //         innerItem => innerItem.row_id === item.row_id
  //       ),
  //       1
  //     );
  //   }
  // });
  return tableData.filter((item) => {
    return !isEmptyRow(item)
  });
}

// 空数据的位置 新增明细应用
function findEmptyRowIndex(tableData) {
  return tableData.findIndex((item) => {
    return isEmptyRow(item)
  });
}

// 空数据的情况
function isEmptyRow(row) {
  return isHasNewRow(row) && typeof row.orderItemId == "undefined";
}

function isHasNewRow(row) {
  return row.row_id !== "" && row.row_id !== "undefined" && typeof row.id == "undefined";
}

//皮试自动生成的药品
export function isAutomaticallyBySkinTestDrugs(item) {
  let useWayisSkinTest = item.useWay == "901";
  let majorIdIsNotEmpty = typeof item.majorId != "undefined";
  let isChargeStatusFour = item.chargeStatus == "4";
  return useWayisSkinTest && majorIdIsNotEmpty && isChargeStatusFour;
}

// 是否有诊断校验
export function getDiaRecode(visitCode) {
  return new Promise(async (resolve, reject) => {
    try {
      // 是否有诊断校验
      let rep = await getDiaByClinicType({
        visitCode
      });
      if (rep.code === 1 && rep.data.length === 0) {
        newVueObj.$message.warning("当前患者还没有西医诊断，请开诊断之后才能开处方！");
        reject(false); 
      } else {
        resolve (true);
      }
    } catch (error) {
      newVueObj.$message.error("获取当前患者的诊断失败！");
      reject(false); 
    }
  });
}

// 获取处方号
export function getRecipeCodeFunc(visitCode) {
  return new Promise(async (resolve, reject) => {
    try {
      // 是否有诊断校验
      let { code, msg, data } = await getRecipeCode({
        visitCode
      });
      if (code === 1) {
        resolve (data);
      } else {
        newVueObj.$message.error(msg || " 获取处方号失败！");
        reject(false); 
      }
    } catch (error) {
      newVueObj.$message.error(" 获取处方号失败！");
      reject(false); 
    }
  });
}

//设置输入框 标红
function setInputFormError (dataIdName){
  let nodeList = getDataIdDom("div", "data-id", dataIdName);
  // debugger
  // console.log(nodeList);
  if (nodeList.length > 0) {
    nodeList.forEach(element => {
      if (getComputedStyle(element)["visibility"] === "visible") {
        let inner = element.getElementsByClassName("el-input__inner")[0];
        // console.log("inner", inner);
        // console.log("inner:::", $(inner).parents(".el-form-item"));
        $(inner).parents(".el-form-item").removeClass("is-success").addClass("is-error");
      }
    });
  }

}

//设置输入框 标绿
function setInputFormSuccess (dataIdName){
  let nodeList = getDataIdDom("div", "data-id", dataIdName);
  // debugger
  // console.log(nodeList);
  if (nodeList.length > 0) {
    nodeList.forEach(element => {
      if (getComputedStyle(element)["visibility"] === "visible") {
        let inner = element.getElementsByClassName("el-input__inner")[0];
        // console.log("inner", inner);
        // console.log("inner:::", $(inner).parents(".el-form-item"));
        $(inner).parents(".el-form-item").addClass("is-success").removeClass("is-error");
      }
    });
  }

}

  // 判断是否添加相同医嘱
export function checkDupFunc(val, Vue) {
  // 判断是否添加相同医嘱
  let self = Vue;
  let haveDup = Vue.tableRuleForm.tableData.find((item, index) => {
    return item.orderItemId === val.itemId && Vue.currentRowIndex != index; //当前行不做重复药品校验
  });
  return new Promise((resolve, reject) => {
    if (haveDup) {
      self
        .$confirm("已有相同医嘱, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning"
        })
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          setTimeout(() => {
            clearCurrentRow(Vue.tableRuleForm.tableData[Vue.currentRowIndex], Vue);
            Vue.setLInputTableFocus();
          }, 100);
          // self.currentRow.orderItemName = "";
          // let index =
          //   self.$refs.lInputTable.length > 2
          //     ? self.currentRowIndex * 2
          //     : 0;
          // // 清空药品搜索
          // self.$refs.lInputTable[index] &&
          //   self.$refs.lInputTable[index].clear();
          // self.$refs.lInputTable[index + 1] &&
          //   self.$refs.lInputTable[index + 1].clear();
          reject(false);
        });
    } else {
      resolve(true);
    }
  });
}

 //校验库存
export function checkZeroFunc(row, Vue) {
  let self = Vue;
  return new Promise((resolve, reject) => {
    if (Number(row.stockNum) <= 0) {
      if (
        Vue.tableRuleForm.tableData[Vue.currentRowIndex].freeRecipe != 1
      ) {
        self
          .$confirm(
            "您选择的药品药房当前无库存，是否要开患者自备药?",
            "提示",
            {
              confirmButtonText: "开自备药",
              cancelButtonText: "否",
              closeOnClickModal: false,
              type: "warning"
            }
          )
          .then(() => {
            let rows = {
              ...row,
              selfProvided: "0"
            };
            resolve({ ...rows });
          })
          .catch(() => {
            setTimeout(() => {
              clearCurrentRow(Vue.tableRuleForm.tableData[Vue.currentRowIndex], Vue);
              Vue.setLInputTableFocus();
            }, 100);
            reject(false);
          });
      } else {
        //免费处方
        newVueObj.$message.error("库存不足");
        // let addRowEmpty = resetCurrentData(Vue);
        // Vue.$set(
        //   Vue.tableRuleForm.tableData,
        //   Vue.currentRowIndex,
        //   addRowEmpty
        // );
        // Vue.currentRow = {
        //   ...Vue.tableRuleForm.tableData[Vue.currentRowIndex]
        // };
        // let index =
        //   self.$refs.lInputTable.length > 2 ? self.currentRowIndex * 2 : 0;
        // // 清空药品搜索
        // self.$refs.lInputTable[index] &&
        //   self.$refs.lInputTable[index].clear();
        // self.$refs.lInputTable[index + 1] &&
        //   self.$refs.lInputTable[index + 1].clear();
        setTimeout(() => {
          clearCurrentRow(Vue.tableRuleForm.tableData[Vue.currentRowIndex], Vue);
          Vue.setLInputTableFocus();
        }, 100);
        // resolve({ ...addRowEmpty });
        reject(false);
      }
    } else {
      resolve({ ...row });
    }
  });
}
//校验权限
export function checkLimitFunc(data, Vue) {
  let self = Vue;
  return new Promise(async (resolve, reject) => {
    let {
      visitCode,
      identificationNum,
      identificationType,
      patientGender
    } = Vue.$store.state.base.receivePatientData; //获取患者信息
    let curObj = Vue.currentRow;
    let recipeCode = curObj ? curObj["recipeCode"] : ""; //获取当前处方号
    let row = {
      patientGender,
      visitCode,
      recipeCode,
      identificationNum,
      identificationType,
      manageType: data.manageType,
      orderItemName: data.orderItemName,
      orderItemId: data.itemId,
      orderId: data.relateItemId || "",
      orderItemCat: data.itemType
    };
    // Vue.listLoading = true;
    // debugger
    await validAdviceItem(row)
      .then(async res => {
        if (res.code === 1) {
          //赋值给表格选中行
          let row = {
            // ...this.tableRuleForm.tableData[this.currentRowIndex],
            ...data,
            ...res.data
          };

          resolve({ ...row });
        } else if (res.code === 0) {
          newVueObj.$message.error(res.msg || "没有抗菌药品权限");

          reject(false);
        } else if (res.code === 4) {
          newVueObj.$message.error(res.msg || "没有这个级别的权限");
          reject(false);

        } else if (res.code === 20001009) {
          newVueObj.$message.info(res.msg);
          //独立处方，新增处方号，
          let reponse = await getRecipeCode({
            visitCode: Vue.receivePatientData["visitCode"]
          });
          if (reponse.code === 1) {

            let row = {
              // ...this.tableRuleForm.tableData[this.currentRowIndex],
              ...data,
              recipeCode: reponse.data
            };
            resolve({ ...row });
          } else {
           clearCurrentRow(Vue.tableRuleForm.tableData[Vue.currentRowIndex], Vue);
           Vue.setLInputTableFocus();
            // resolve({ ...addRowEmpty });
            reject(false);
          }
        } else {
          newVueObj.$message.error(res.msg || "校验失败");
          clearCurrentRow(Vue.tableRuleForm.tableData[Vue.currentRowIndex], Vue);
          Vue.setLInputTableFocus();
          // resolve({ ...addRowEmpty });
          reject(false);
        }
        // Vue.listLoading = false;
      })
      .catch(error => {
        clearCurrentRow(Vue.tableRuleForm.tableData[Vue.currentRowIndex], Vue);
        Vue.setLInputTableFocus();
        // resolve({ ...addRowEmpty });
        // Vue.listLoading = false;
        reject(false);
      });
  });
}

//过敏药品提示
export function checkDrugAllergyFunc(row, Vue) {
  let { patientId } = Vue.$store.state.base.receivePatientData; //获取患者信息
  let self = Vue;
  // Vue.listLoading = true;
  return new Promise(async (resolve, reject) => {
  // 查找过敏记录是否有记录
  let res = await getEffectiveRecord({
    patientId: patientId,
    drugId: row.relateItemId
  });
  // Vue.listLoading = false;
  if (res.code === 1) {
      if (res.data.length > 0) {
        let allergyName = "";
        for (let i = 0; i < res.data.length; i++) {
          if (allergyName.indexOf(res.data[i].allergyName) === -1) {
            allergyName += res.data[i].allergyName + ",";
          }
        }
        allergyName = allergyName.substring(0, allergyName.length - 1);
        newVueObj.$confirm(
          "患者过敏提示：" + allergyName + ",  是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            type: "warning"
          }
        )
          .then(async () => {
            //继续选中操作
            resolve(row);
          })
          .catch(() => {
            setTimeout(() => {
              clearCurrentRow(Vue.tableRuleForm.tableData[Vue.currentRowIndex], Vue);
              Vue.setLInputTableFocus();
            }, 100);
          });
      } else {
        resolve(row);
      }
  } else {
    newVueObj.$message.error(res.msg ? res.msg : "获取数据失败");
    reject(false)
  }
  // newVueObj.$message.error(res.msg ? res.msg : "获取数据失败");
});
}


    //皮试结果查询后弹窗
    function execResultConfirm(execData) {
      return new Promise((resolve, reject) => {
        let showText = "患者于 ";
        execData.forEach(execItem => {
          let result = execItem.execResult === "1" ? "阳性" : "阴性";
          showText +=
            "<p style='text-align:center'>" +
            execItem.executeTime +
            " 进行的皮试结果为 " +
            result +
            "</p>";
        });
        showText += " 是否继续?";

        newVueObj.$confirm(showText, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          dangerouslyUseHTMLString: true,
          type: "warning"
          // eslint-disable-next-line no-loop-func
        })
          .then(async () => {
            //继续选中操作
            resolve(true);
          })
          .catch(() => {
            reject("皮试结果取消啦");
          });
      });
    }


/**
 * 查找皮试结果
 * @param row
 * @returns {Promise<any>}
 */

export async function getExecResultBySelect(row, Vue) {
  // Vue.listLoading = true;
  let { patientId } = Vue.$store.state.base.receivePatientData; //获取患者信息
  let self = Vue;
  return new Promise(async (resolve, reject) => {
    // 不是皮试药品 不走皮试接口
    if (!isSkinTestDrugs(row)) {
      console.log("不是皮试药品");
      resolve(true);
      return;
    }
    console.log("皮试药品");
    // console.log("是皮试药品");
    // 查找皮试结果记录
    let resp = await getExecResult({
      patientId: patientId,
      drugId: row.relateItemId
    });
    // Vue.listLoading = false;
    if (resp.code === 1) {
      if (resp.data.length > 0) {
        if (resp.data.length > 0) {
          try {
            let isRight = await execResultConfirm(resp.data);
            if (isRight) {
              resolve(true);
            }
          } catch (error) {
            setTimeout(() => {
              clearCurrentRow(Vue.tableRuleForm.tableData[Vue.currentRowIndex], Vue);
              Vue.setLInputTableFocus();
            }, 100);
            reject(false);
          }
        }
      } else {
        resolve(true);
      }
    } else {
      newVueObj.$message.error(resp.msg ? resp.msg : "获取数据失败");
      reject("皮试获取数据失败");
    }
  });
}

// 电子处方 电子申请 都在用
// 医保审核 弹窗 
export function doctorPsReviewLimit (showText = [], showTextTitle = ""){
  return new Promise((resolve, reject)=>{
    let confirmText = "";
    console.log("showText", showText);
    showText.forEach((item, index)=>{
      if(index == 0) {
        // confirmText += showTextTitle;
        confirmText += "<p>" + showTextTitle + item + "</p>";
      } else {
        confirmText += "<p>" + item + "</p>";
      }
      
    });
    console.log("confirmText", confirmText);
    newVueObj.$confirm(confirmText, '医生审核', {
      dangerouslyUseHTMLString: true,
      distinguishCancelAndClose: true,
      confirmButtonText: '是（审批通过）',
      cancelButtonText: '否（自费使用）'
    })
      .then(() => {
        // 审批通过
        resolve({ confirmCode: 1 });
      })
      .catch(action => {
        switch (action) {
          case 'cancel':
            // 否（自费使用）
            resolve({ confirmCode: 0 });
            break;
        
          default:
            // 关闭按钮 取消逻辑
            reject(false);
            break;
        }
      });
  });
}

// 获取执行单数据 （未收费）
// orderStatus: 99,
// orderId,
// visitCode: this.receivePatientData.visitCode,
// pageNo: 0,
// pageSize: 4,
// patientId: this.receivePatientData.patientId,
// printGroup: 3 //1.门诊皮试单、2.门诊注射单、3.输液执行单、4.门诊治疗单
export function getPrintDataFunc (params = {}){
  return new Promise(async (resolve, reject)=>{
    try {
      let { data,code, msg } = await getPrintDataAjax(params);
      if (code === 1) {
        resolve(data);
      } else {
        newVueObj.$message.error(msg || "获取打印数据失败");
        reject(false);
      } 
    } catch (error) {
      newVueObj.$message.error("获取打印数据失败");
      reject(false);
    }
  });
}

//免费处方 药品
function isFreeDrug(row){
  return row.freeRecipe == 1;
}

//自备药 药品
function isSelfProvidedDrug(row){
  return row.selfProvided == 0;
}



export {
  isSelfProvidedDrug,
  isFreeDrug,
  updateAllRecipe,
  getZanCunRow,
  getQtyByUnitFlag,
  skinTestStatusController,
  getGroupListBygroupNo,
  setOverReasonShow,
  setRelateGroupNoFunc,
  isSkinTestDrugs,
  overReasonShowControlFunc,
  isZanCunAddNewStatus,
  setInputFormError,
  resetCurrentData,
  clearLInputTable,
  clearCurrentRow,
  isFreeRow,
  getUniqueMajorIdList,
  findEmptyRowIndex,
  setInputFormSuccess
};
