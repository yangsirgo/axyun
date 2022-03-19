import {
  getArrayList
} from "@/api/wconf/wparam";
import {
  getHospDefaultUnit,
  hospCheckUnit,
  isNull
} from "@/components/adviceCommon/hospDrugCalculatFunc_new.js";
import {
  authorityVerif,
  getDiaByPatientCode
} from "@/api/homeSickbeds/hsDiagTreat/hsOrder.js";
import {
  getDataIdDom
} from "@/utils/util.js";
import {
  getGroupList,
  getUnitFlag,
  setComponentFocusFunc
} from "@/components/adviceCommon/adviceUtils.js";
import {
  defaultAddStatusValue,
  zanCunStatusValue
} from "./variable.js";
import { doctorPsReviewLimit } from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/presModule/modules/adviceUtils.js"

import vueObject from 'vue'
let vObject = new vueObject();

//设置 unitFlag
export function unitFlagRelatedUnit(drugItem, currentRow = {}, Vue) {
  Vue.$set(
    currentRow,
    "unitFlag",
    getUnitFlag(drugItem.pkgUnit, currentRow.unit)
  );
}

//成组判断
function isGroup(row, groupNoList) {
  let groupList = getGroupList(groupNoList, row);
  return groupList.length > 1;
}

function hasClass(obj, cls) {
  return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
  if (!hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
  if (hasClass(obj, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    obj.className = obj.className.replace(reg, ' ');
  }
}

export function toggleClass(obj, cls) {
  if (hasClass(obj, cls)) {
    removeClass(obj, cls);
  } else {
    addClass(obj, cls);
  }
}

//成组校验
export function bunchingValidate(multipleSelection) {
  let flag = true;
  if (!isZanCunStatus(multipleSelection, zanCunStatusValue)) {
    vObject.$message.warning("只有暂存的医嘱可以成组");
    return false;
  }
  if (multipleSelection.length > 1) {
    // 成组最少两个成员
    flag = true;
  } else {
    flag = false;
    vObject.$message.warning("成组最少两个医嘱");
    return false;
  }
  if (isSameGroup(multipleSelection)) {
    vObject.$message.warning("不可重复成组");
    return false;
  }
  return flag;
}

// 当前行在服务端返回的数据里是否成组
function initServerGrouped(row) {
  let {
    groupNoCls = ""
  } = row;
  let clsList = ["bunchingUp", "bunchingDown", "bunchingCenter"];
  return clsList.indexOf(row.groupNoCls) > -1;
}

export function addClassClone(obj, cls) {
  addClass(obj, cls)
}

// table 滚动到底
export function setTableScrollBottom(Vue) {
  Vue.$nextTick(async () => {
    // await this.$refs.xTable.clearScroll();
    const el = Vue.$refs.xTable.$el.querySelector('.vxe-table--body-wrapper')
    // console.log(el);
    // await this.$refs.xTable.scrollTo(0, el.scrollHeight)
    setTimeout(() => {
      if (el) {
        el.scrollLeft = 0;
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  });
}

//清空药品搜索框
function clearLInputTable(Vue) {
  let currentRow = Vue.getActiveRow();
  // refs 方式 如果有fixed列会失效，直接用操作DOM处理
  Vue.$nextTick(() => {
    let targetDataId = "lInputTable" + currentRow.row_id;
    let nodeList = getDataIdDom("div", "data-id", targetDataId);
    if (nodeList.length > 0) {
      nodeList.forEach(element => {
        element.getElementsByClassName("el-input__inner")[0].value = "";
      });
    }
  });
}

// 清空药品行
function clearRow(tableRow, Vue) {
  let currentRow = tableRow;
  let originObj = getAddRowOriginObj(Vue);
  for (const key in originObj) {
    currentRow[key] = originObj[key];
  }
  clearLInputTable(Vue);
}


// 新增table row 的初始化对象
function getAddRowOriginObj(Vue) {
  let expectStartTime = Vue.dayjs().format("YYYY-MM-DD HH:mm:ss");
  console.log("expectStartTime", expectStartTime);
  return {
    status: defaultAddStatusValue,
    // id: 4,
    // no: "--",
    _primary_id: 3,
    isNew: true,
    itemName: "", // 医嘱名称
    itemId: "", // 医嘱名称ID
    spec: "", // 规格
    onceDosage: 0, // 单次剂量
    quantity: undefined, //数量
    firstDayUse: 0, //首日次数
    useWay: "", // 用法
    useDay: Vue.searchForm.type == 2 ? 1 : undefined, //用药天数  备注： 临时医嘱：用药天数非必填 默认1 不让改.长期： 用药天数 默认是空 不必须填，
    freqCode: "", // 频次
    normal_time: "", // 常规时间
    adv_people: "", // 开嘱人
    deptId: "", // 开嘱科室
    end_date: "", // 停止日期
    end_time: "", // 结束时间
    expectStartTime, //开始时间
    end_doctor: "", // 结束医生
    end_nurse: "", // 结束护士
    execute_depart: "", // 执行科室
    exeDeptName: "", //接受科室
    group_num: "", // 分组号
    isEditingNum: true,
    expectStopTime: "", //预停时间
    type: Vue.searchForm.type, //默认是长期医嘱
    unitOptions: [], //单位列表
    stSolutionType: "", //免试
    unit: "", //单位
    urgent: false, //紧急
    selfPay: false, //自费
    selfProvidedDisabled: false,
    row_id: +new Date(),
    selfProvided: 0,
    amt: "0",
    treatId: Vue.receivePatientData.id,
    treatNo: Vue.receivePatientData.treatNo
  };
}


//过滤没有药品的行
export function getTableDataByItemId(Vue) {
  let tableData = Vue.getTableData();
  return tableDataByFilter(tableData, "itemId");
}

export function removeClassClone(obj, cls) {
  removeClass(obj, cls)
}


export function validRulesHandler(value, validList = []) {
  return validList.every(item => {
    if (item.pattern) {
      return item.pattern.test(value);
    } else if (item.required) {
      return typeof value !== "undefined" && value !== null && value !== "";
    }
    return true;
  });
}

//判断是主医嘱
function isMajorRow(row) {
  return typeof row.majorId != "undefined" && row.majorId === row.id;
}

//判断是副医嘱
function isNotMajorRow(row) {
  return typeof row.majorId != "undefined" && row.majorId !== row.id;
}

//副医嘱数据设定
function setNotMajorRowData(adviceItem = {}, Vue, id) {
  // majorId 是成组的非主医嘱才有
  let setObject = {
    majorId: id
  };
  for (const key in setObject) {
    if (setObject.hasOwnProperty(key)) {
      const element = setObject[key];
      Vue.$set(adviceItem, key, element);
    }
  }
  // console.log("setNotMajorRowData", adviceItem);
}

//关联到的主医嘱 数据设定
function setRelationToRowData(adviceItem = {}, Vue) {
  // if (isFreeRow(adviceItem)) {
  // isMajor等于0 是主医嘱;
  let setObject = {
    majorId: adviceItem.id
  };
  // console.log("setObject",setObject);
  for (const key in setObject) {
    if (setObject.hasOwnProperty(key)) {
      const element = setObject[key];
      Vue.$set(adviceItem, key, element);
    }
  }
  // }

}

// 获取默认单位
export function getHospDefaultUnitFunc(item, type) {
  let {
    limitUnit,
    pkgUnit
  } = item;
  if (isNull(limitUnit) && isNull(pkgUnit)) {
    return "";
  }
  return getHospDefaultUnit(item, type);
}

// 设置单位状态
export function getUnitStateFunc(item, type) {
  let {
    disable
  } = hospCheckUnit(item, type);
  return !disable;
}

// code 获取单位 中文
export async function getQtyUnitAjax(data) {
  // 获取单位数据
  let param = [];
  let shows = [];
  let unitOptions = [];
  if (data.pkgUnit === data.limitUnit) {
    shows.push(data.pkgUnit);
  } else {
    shows.push(data.pkgUnit);
    shows.push(data.limitUnit);
  }
  param.push({
    code: "DrugUnit",
    field: "code",
    shows: shows
  });
  return new Promise(async (resolve, reject) => {
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
        resolve(unitOptions);
        // eslint-disable-next-line no-else-return
      } else {

        this.$message.error(
          rep.msg ? rep.msg : "获取药品单位有误，请确认无误后再选择！"
        );
        reject(false);
      }
    } catch (e) {

      this.$message.error("获取药品单位有误，请确认无误后再选择！");
      reject(false);
    }
  });
}

//单位 大单位小单位禁用的处理
export function setUnitItemState(advice = {}, type, unitList = []) {
  let list = unitList.map(item => {
    let unit = item.value;
    let isDisabled = false;
    try {
      hospCheckUnit(advice, unit, type);
    } catch (error) {
      isDisabled = true;
    }
    return {
      label: item.label,
      value: item.value,
      isDisabled
    }
  });
  return list;
}

//成组或者取消成组 成员中是否全部暂存状态
function isZanCunStatus(list = [], zancunStatus) {
  return list.every(item => {
    return item.status == zancunStatus; //只有暂存状态能提交
  });
}

function isSameGroup(list = []) {
  let majorId = null;
  return list.every((item, index) => {
    if (index === 0) {
      majorId = item.majorId;
    }
    return item.majorId === majorId;
  });
}



export function grouping(list1) {
  // 将list 分组
  return new Promise((resolve, reject) => {
    let list = [];
    let groupList = [];
    let filterList = [];
    let tableList = [];
    groupList = list1.map(item => {
      // 获取所有组
      return item.majorId;
    });

    groupList = Array.from(new Set(groupList));
    groupList = groupList.filter((item, index) => {
      // 数组去undefind
      return item !== undefined && item != "";
    });
    groupList.forEach((item, index) => {
      //遍历 成map结构 分组
      // list = [];
      filterList = list1.filter((sonItem, sonIde) => {
        return item === sonItem.majorId;
      });
      list.push({
        key: item,
        value: filterList
      });
    });
    list.forEach(item => {
      // 将有组item添加class
      let itemList = item.value;
      if (itemList.length == 1) {
        return;
      }
      itemList.forEach((sonItem, sonIndex) => {
        if (sonIndex === 0) {
          sonItem.groupNoCls = "bunchingUp";
        } else if (sonIndex === itemList.length - 1) {
          sonItem.groupNoCls = "bunchingDown";
        } else {
          sonItem.groupNoCls = "bunchingCenter";
        }
      });
    });
    list.map(item => {
      // 更改list格式
      item.value.map(val => {
        tableList.push(val);
      });
    });
    list1.map(item => {
      // 补充未成组项
      if (!item.majorId) {
        tableList.push(item);
      }
    });

    // console.log(tableList);
    resolve(tableList);
  });
}
//只能有一个新增
export function isOnlyOneEdit(data = [], defaultAddStatusValue) {
  return data.some(item => {
    return item.status == defaultAddStatusValue;
  });
}

// 触发 relate 方法
export function setTableColumnRelateDefault(fireKey, tableColumn = [], currentRow, Vue) {
  if (typeof fireKey === 'undefined') return;
  let fireCol = tableColumn.find((item) => {
    return item.prop === fireKey;
  });
  if (fireCol === null) {
    console.error("fireCol", fireCol);
  }
  //console.log("fireCol", fireCol);
  fireCol["relate"].forEach(item => {
    //设置 值 或者默认值
    setObjectValueToCurrent(item, currentRow, Vue);
    setMaxToCurrent(item, currentRow, Vue);
  });
  // console.log("defaultRow", currentRow);
}

// 默认最大值 最小值的处理
function setMaxToCurrent(item, currentRow, Vue) {

  let value = item["max"];
  let defaultValue = item["defaultMax"];
  if (isEmpty(value) && isEmpty(defaultValue)) return;
  Vue.$set(currentRow, item["maxKey"], value || defaultValue);
}

// default  value 是对象的情况
function setObjectValueToCurrent(item, currentRow, Vue) {
  let value = item["value"];
  let defaultValue = item["default"];
  let convertObj = {};
  //console.log("value:", value, "defaultValue:", defaultValue);
  if (isNullOrUndefined(value) && isNullOrUndefined(defaultValue)) return;
  // 值如果是对象  有值给值 没有给默认值
  if (isObject(value)) {
    convertObj = value;
  } else {
    //值是空的 走默认值
    if (isNullOrUndefined(value)) {
      //默认值如果是对象
      if (isObject(defaultValue)) {
        convertObj = defaultValue;
      } else { //默认值不是对象
        convertObj = {
          [item["relateKey"]]: defaultValue
        }
      }

    } else { //值不是空的
      convertObj = {
        [item["relateKey"]]: value
      }
    }
  }

  ObjectToCurrent(convertObj, currentRow, Vue);
}

function ObjectToCurrent(Obj, currentRow, Vue) {
  for (const key in Obj) {
    // if (Obj.hasOwnProperty(key)) {
    if (!isNullOrUndefined(Obj[key])) { //有值才会赋值
      Vue.$set(currentRow, key, Obj[key]);
    }
    // }
  }
}

// 值是否为空
function isEmpty(obj) {
  return typeof obj === "undefined" || obj == null || obj == "";
}

// 值是否为undefined 或者 null 除去 ""
function isNullOrUndefined(obj) {
  return typeof obj === "undefined" || obj == null;
}

export {
  isEmpty
};

// 值是否为对象
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function setColumnModel(newTableColumn = [], tableColumn = [], Vue) {
  newTableColumn.forEach((element, index) => {
    if (element["prop"] == tableColumn[index]["prop"]) {
      Vue.$set(tableColumn[index], "input", element["input"]);
      Vue.$set(tableColumn[index], "edit", element["edit"]);
      Vue.$set(tableColumn[index], "shotcut", element["shotcut"]);
      Vue.$set(tableColumn[index], "endSubmit", element["endSubmit"]);
      Vue.$set(tableColumn[index], "relate", element["relate"] || []);
    }
  });
}

export function showTipAlertWrapper(tipList = [], Vue) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await showTipAlert(tipList);
      resolve(true);
    } catch (error) {
      resolve(true);
    }
  })
}

function showTipAlert(tipList = []) {
  if (tipList.length == 0) return;
  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    let showText = "";
    tipList.forEach(tip => {
      showText +=
        "<p style='text-align:center'>" +
        tip +
        "</p>";
    });

    vObject.$confirm(showText, "提示", {
        confirmButtonText: "确定",
        closeOnClickModal: false,
        showCancelButton: false,
        dangerouslyUseHTMLString: true,
        type: "warning"
      }).then(() => {
        //继续选中操作
        resolve(true);
      })
      .catch(() => {
        reject("取消了");
      })
  })
}

function authorityVerifFunc(ajaxData) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await authorityVerif(ajaxData);
      if (data.code == 1) {
        if (data.tips.length > 0) {
          try {
            await showTipAlert(data.tips);
            resolve(data);
          } catch (error) {
            resolve(data);
          }
        }
      }
      resolve(data);
    } catch (error) {

      reject("权限校验没有通过");
    }
  });
}

//过滤数据
export function tableDataByFilter(list = [], filterKey) {
  return list.filter(item => {
    return item[filterKey] != "" && typeof item[filterKey] != "undefined";
  });
}

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
          vObject.$message.warning("该患者没有开诊断，请先开诊断！");
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

// 设置关联成组的模拟数据 MajorId
export function setSimulateGroupedData (relationToRow, relationRow, Vue){
  //关联的主医嘱是 成组的
  if (isGroup(relationToRow, Vue.groupNoList)) {
    //关联的主医嘱是 组中的主医嘱
    if (isMajorRow(relationToRow)) {
      // 副医嘱 设置
      setNotMajorRowData(relationRow, Vue, relationToRow.id);
    }
    // 关联的主医嘱是 组中的副医嘱
    if (isNotMajorRow(relationToRow)){
      setNotMajorRowData(relationRow, Vue, relationToRow.majorId);
    }

  } else {//关联的主医嘱是 白身
    // 主医嘱设置
    setRelationToRowData(relationToRow, Vue);
    // 副医嘱 设置
    setNotMajorRowData(relationRow, Vue, relationToRow.id);
  }
  // console.log("relationRow", JSON.stringify(relationRow), "relationToRow", JSON.stringify(relationToRow));
}

//关联 清除 relationId
function clearRelationId(currentRow = {}, Vue) {
  // Vue.$set(currentRow, "relationId", "");
  Vue.$delete(currentRow, "relationId");
}

//设置关联的id 赋值到 当前行
export function setRelationId(currentRow = {}, targetRow, Vue) {
  Vue.$set(currentRow, "relationId", targetRow.id);
}

// 关联验证
export function isRelationFalse(targetRow, row, Vue) {
  if (!targetRow && row.relation != "") {
    vObject.$message.warning("关联医嘱序号有误，请核对后再填写！");
    return true;
  }
  if (targetRow && targetRow.id == row.id) {
    //不能关联自己
    vObject.$message.warning("关联医嘱序号有误，请核对后再填写！");
    return true;
  }
  if (
    targetRow &&
    targetRow.majorClass != "10" &&
    targetRow.majorClass != "12"
  ) {
    vObject.$message.warning("请查看关联项，目前仅支持关联药品！");
    return true;
  }
  // 已经成组的输入关联  提示用户取消成组，再关联
  if (initServerGrouped(row)) {
    vObject.$message.warning("请取消成组，再进行关联操作!");
    setTimeout(() => {
      row.relation = undefined;
    }, 1500);
    // clearRelationId(row, Vue);
    return true;
  }
  return false;
}


// 默认频次处理函数
export function defaultFreqObj(adviceItem) {
  let freqObj = {
    freqCode: adviceItem["defaultFreqCode"],
    freqUnit: adviceItem["defaultFreqUnit"],
    freqTimes: adviceItem["defaultFreqTimes"]
  };
  if (isEmpty(adviceItem["defaultFreqCode"])) { // 默认的FreqCode 是空的
    freqObj = null;
  }
  return freqObj;
};

// 医嘱项目的权限校验
export function authorityVerifByItem(drugRow, tableRow, Vue) {
  let ajaxData = {
    treatId:  Vue.receivePatientData.id,
    pharmacyId: drugRow.pharmacyId,
    itemId: drugRow.id,
    type:  Vue.searchForm.type
  };
  return new Promise(async (resolve, reject) => {
    try {
      console.log("医嘱项目的权限校验");
      let { data, code, msg, limitMsg, siLimitCode } = await authorityVerifFunc(ajaxData);
      console.log(data, code, msg);
      // debugger
      if (code == 1) {
        // 医生审核弹窗
        // let {  } = data;
        console.log("limitMsg, limitCode", data.siLimitMsg, data.siLimitCode);
        if (data.siLimitCode == 1) {// 弹窗
          try {
            let { confirmCode } = await doctorPsReviewLimit(data.siLimitMsg);
            console.log("confirmCode", confirmCode);
            if (confirmCode == 1) {
              //审批通过
              console.log("是 审批通过");
            } else if(confirmCode == 0) {
              // 否（自费使用）
              console.log("否 自费使用");
            }
            resolve({siLimitCode: confirmCode});
            // this.$set(row, "limitCode", confirmCode);
          } catch (error) {
            console.log("清空当前行");
            clearRow(tableRow, Vue);
            setLInputTableFocus(Vue);
            reject("删除当前行");
            return;
          }
        }

        resolve(true);
      } else {
        setTimeout(() => {
          clearRow(tableRow,  Vue);
          setLInputTableFocus(Vue);
        }, 50);
        vObject.$message.error(msg || "权限校验失败！");
        reject("权限校验没有通过");
      }
    } catch (error) {
      setTimeout(() => {
        clearRow(tableRow,  Vue);
        setLInputTableFocus(Vue);
      }, 50);
      vObject.$message.error("权限校验失败！");
      reject("权限校验没有通过");
    }
  });
}
// 中草药医嘱项目的权限校验
export function newAuthorityVerifByItem(drugRow, Vue) {
  let ajaxData = {
    treatId:  Vue.receivePatientData.id,
    pharmacyId: drugRow.pharmacyId,
    itemId: drugRow.id,
    type:  '2'
  };
  return new Promise(async (resolve, reject) => {
    try {
      let { data, code, msg, limitMsg, siLimitCode } = await authorityVerifFunc(ajaxData);
      console.log(data, code, msg);
      // debugger
      if (code == 1) {
        // 医生审核弹窗
        // let {  } = data;
        console.log("limitMsg, limitCode", data.siLimitMsg,data.siLimitCode);
        if (data.siLimitCode == 1) {// 弹窗
          try {
            let { confirmCode } = await doctorPsReviewLimit(data.siLimitMsg);
            console.log("confirmCode", confirmCode);
            if (confirmCode == 1) {
              //审批通过
              console.log("是 审批通过");
            } else if(confirmCode == 0) {
              // 否（自费使用）
              console.log("否 自费使用");
            }
            resolve({siLimitCode: confirmCode});
            // this.$set(row, "limitCode", confirmCode);
          } catch (error) {
            console.log("清空当前行");
             Vue.clearCurrentDrugs();
            reject("删除当前行");
            return;
          }
        }

        resolve(true);
      } else {
        setTimeout(() => {
          Vue.clearCurrentDrugs();
        }, 50);

        vObject.$message.error(msg || "权限校验失败！");
        reject("权限校验没有通过");
      }
    } catch (error) {
      setTimeout(() => {
        // clearRow(tableRow,  Vue);
        // setLInputTableFocus(Vue);
        Vue.clearCurrentDrugs();
      }, 50);

      vObject.$message.error("权限校验失败！");
      reject("权限校验没有通过");
    }
  });
}

export function checkDupFunc(val, tableRow, Vue) {
  // 判断是否添加相同医嘱
  let haveDup = Vue.tableData.find((item, index) => {
    return item.itemId === val.id && Vue.currentRowIndex != index; //当前行不做重复药品校验
  });
  return new Promise((resolve, reject) => {
    if (haveDup) {
      vObject.$confirm("已有相同医嘱, 是否继续?", "提示", {
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
            clearRow(tableRow, Vue);
            setLInputTableFocus(Vue);
          }, 50);
          reject(false);
        });
    } else {
      resolve(true);
    }
  });
}

    //自备药弹窗
export function selfContMedFunc(val, tableRow, Vue) {
  let currentRow = tableRow;
  return new Promise((resolve, reject) => {
    vObject.$confirm("是否开具自备药?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      closeOnClickModal: false,
      type: "warning"
    })
      .then(() => {
        //特殊备注中选中自备药
        Vue.setSelfProvidedStatus("1", true, tableRow);
        resolve(true);
      })
      .catch(() => {
        vObject.$message.warning("此药品的库存为空，请选择其他药品！");
        setTimeout(() => {
          clearRow(tableRow, Vue);
          setLInputTableFocus(Vue);
        }, 500);
        Vue.setSelfProvidedStatus("0", false, tableRow);
        reject(false);
      });
  });
}


function setLInputTableFocus(Vue) {
  let currentRow = Vue.$refs.xTable.getActiveRecord();
  setComponentFocusFunc("lInputTable", currentRow.row_id);
}

export {
  showTipAlert,
  getAddRowOriginObj,
  initServerGrouped,
  clearRelationId,
  isSameGroup,
  isGroup,
  isMajorRow,
  clearRow,
  isNotMajorRow,
  setRelationToRowData,
  setNotMajorRowData,
  setLInputTableFocus,
  isZanCunStatus
};
