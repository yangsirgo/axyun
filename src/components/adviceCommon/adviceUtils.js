import {
  getDataIdDom
} from "@/utils/util.js";
import {
  getPharmacyList
} from "@/api/homeSickbeds/hsDiagTreat/hsOrder.js";
import { getPrintTpl } from "@/api/admin/print/print";
import {
  batchCancelSubmitByRecipe
} from "@/api/cis/order/order";
import { print } from "@/utils/print_new.js";
import Big from 'big.js';

const shotReadyText = "_shotIsReady";
import vueObj from "vue";
import {hWContentTpl} from "./printTpl/tpl";
let newVueObj = new vueObj();

export function setNextComponentFocus(refName, targetId) {
  console.log("________________________测试 新 enter 组件dispatchEvent(new Event('goNext'))________________________");
  setTimeout(() => {
    let targetDataId = refName + targetId;
    let nodeList = getDataIdDom("div", "data-id", targetDataId);
    if (nodeList.length > 0) {
      nodeList.forEach(element => {
        if (getComputedStyle(element)["visibility"] === "visible") {
          let enteredDom = element.getElementsByClassName("el-input__inner")[0];
          console.log("________________________测试 新 enter 组件dom元素", enteredDom);
          enteredDom.dispatchEvent(new Event('goNext'));
        }
      });
    }
  }, 100);
}


export function setComponentFocusFunc(refName = "", targetId = "") {
  // let refs = this.$refs[refName] ? this.$refs[refName] : [];
  // let List = Array.isArray() ? refs : [refs];
  // console.log(refs, List, this.$refs);
  // List.forEach(item => {
  //   console.log(item.$el.getAttribute("data-id"));
  //   if (item.$el.getAttribute("data-id") == targetId) {
  //     setTimeout(() => {
  //       item.focus();
  //     }, 50);
  //   }
  // });
  // refs 方式 如果有fixed列会失效，直接用操作DOM处理
  setTimeout(() => {
    let targetDataId = refName + targetId;
    let nodeList = getDataIdDom("div", "data-id", targetDataId);
    if (nodeList.length > 0) {
      nodeList.forEach(element => {
        if (getComputedStyle(element)["visibility"] === "visible") {
          element.getElementsByClassName("el-input__inner")[0].focus();
        }
      });
    }
  }, 100);
}


// 光标定位聚焦到错误的表单
export function setFocusOnError() {
  // 错误 表单聚焦
  setTimeout(() => {
    let isError = document.getElementsByClassName("is-error");
    isError[0].querySelector("input").focus();
  }, 100);
}

// pkgUnit 包装单位
// limitUnit 小单位
// 当前单位
// 0 是大单位  1是小单位
// 与数量计算配套的
export function getUnitFlag(pkgUnit, unit) {
  return unit == pkgUnit ? "0" : "1";
}

// pharmacyType "wPharmacy" 是西药  cPharmacy 是中药
// vuex 设置药房选中数据
export function getPharmacyObjectFunc(selectObjId = 0, pharmacyObject) {

  if (selectObjId == 0) {
    console.error("changePharmacyObjectFunc请传入selectObjId");
    return false;
  }
  let selectObj = pharmacyObject.list.find(item => {
    return item.deptId == selectObjId;
  });
  console.log("selectObj", selectObj.deptId);
  pharmacyObject["selected"] = selectObj;
  return pharmacyObject;
}

//药房数据
export function getPharmacyData() {
  return new Promise(async (resolve, reject) => {
    let ajaxData = {
      pageSize: 20,
      pageNo: 1,
      status: 1
    }
    try {
      let result = await getPharmacyList(ajaxData);
      if (result.code == 1) {
        let {
          data
        } = result;
        let cList = data.filter((item) => {
          return item.cmedicinePermit;
        });
        let wlist = data.filter((item) => {
          return item.wmedicinePermit;
        });
        console.log(cList, wlist);
        resolve({
          cList,
          wlist
        });
      } else {
        reject(result);
      }
    } catch (error) {
      reject({
        msg: "取药药房数据获取错误！"
      });
    }

  })

}

//设置 groupNoList
export function setGroupNoList(tableData = [], ) {
  var list = [];
  var filterList = [];
  let groupList = tableData.map(item => {
    return item.majorId;
  });
  groupList = unique(groupList); //数组去重
  groupList = groupList.filter((item, index) => {
    // 数组去undefind
    return item !== undefined;
  });

  function unique(arr) {
    return Array.from(new Set(arr));
  }

  groupList.forEach((item, index) => {
    //遍历 成map结构
    // list = [];
    filterList = tableData.filter((sonItem, sonIde) => {
      return item === sonItem.majorId;
    });
    list.push({
      key: item,
      value: filterList
    });
  });
  return list;
}

//获取 成组列表
export function getGroupList(groupNoList, currentRow) {
  let majorNoList = [];
  groupNoList.forEach(row => {
    if (row.key === currentRow.majorId) {
      majorNoList = row.value;
    }
  });
  return majorNoList;
}

//过滤MajorNo
export function fiteredMajorNoData(list) {
  return list.filter(item => {
    return item.no !== item.majorId;
  });
}

//orderItemName shotReady 控制
export function isOrderItemNameShotReady(row) {
  return row[shotReadyText];
}

// 设置 药品下拉框 跳转的字段 控制enter 跳转
export function setLInputTableShotReady(setStatus = "off", currentRow = {}, Vue) {
  switch (setStatus) {
    case "on":
      Vue.$set(
        currentRow,
        shotReadyText,
        true
      );
      break;

    default:
      Vue.$set(
        currentRow,
        shotReadyText,
        false
      );
      break;
  }
}

//limitUnitName  小单位名称
//pakUnitName  包装单位名称
//pkgMeasure  包装量
//total  总量
export function convertStockShow(limitUnitName = "", pakUnitName = "", pkgMeasure = 1, total = 0) {

  // 库存为0 直接显示 0
  if (total == 0) {
    return "0" + pakUnitName;
  }

  //大单位小单位名字没有 显示 total
  if (limitUnitName == "" && pakUnitName == "") {
    return total;
  }

  let {
    pakNum,
    remainderNum
  } = calStock(pkgMeasure, total);


  //大单位数量没有 显示 小单位数量 + 小单位名称
  if (pakNum == 0 && remainderNum != 0) {
    return remainderNum + limitUnitName;
  }

  //小单位数量没有 显示 大单位数量 + 大单位名称
  if (pakNum != 0 && remainderNum == 0) {
    return pakNum + pakUnitName;
  }



  return pakNum + pakUnitName + remainderNum + limitUnitName;
}

//计算库存数据
function calStock(pkgMeasure = 1, total = 0) {
  let pakNum = Math.floor(Number(total) / Number(pkgMeasure));
  let remainderNum = Number(total) % Number(pkgMeasure);
  return {
    pakNum,
    remainderNum
  }
}

//浮点数取整  0.30000000000000004
export function numToPrecision(num = 0) {
  return parseFloat(new Number(num).toPrecision(12));
}


//打印 模板渲染
function compile(template){
  const evalExpr = /<%=(.+?)%>/g;
  const expr = /<%([\s\S]+?)%>/g;


  template = template
    .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
    .replace(expr, '`); \n $1 \n  echo(`');

  template = 'echo(`' + template + '`);';

  let script =
  `(function parse(data){
    let output = "";


    //调用函数
    function filterUndefined(a) {
      return a ? a : "";
    }

    function echo(html){
      output += html;
    }

    ${ template }

    return output;
  })`;

  return script;
}

export function compileToHtml (tpl, tplData){
  console.log(tpl, tplData);
  let parseFunc = eval(compile(tpl));
  return parseFunc(tplData);
}

//获取打印模板
export function getPrintTplFunc (tplName){
  return new Promise(async (resolve, reject)=>{
    try {
      //获取打印模板
      let {code, data} = await getPrintTpl(tplName);
      if (code == 1) {
        resolve(data.value);
      } else {
        this.$message.error("获取打印模板错误");
        reject(false);
      }

    } catch (error) {
      this.$message.error("获取打印模板错误");
      reject(false);
    }
  });
}

//
export function isCStStatusPass (list = [], statusList = [], statusKey = "orderStatus"){
  console.log(list,statusList, statusKey );
  if (list.length == 0) {
    return false;
  }
  let isPass = list.every(item=> item[statusKey] && statusList.indexOf(item[statusKey]) == -1 );
  return isPass;
}

// 西药中草药撤销
export function cancelSubmitByRecipe (recipeIds){
  return new Promise(async (resolve, reject)=>{
    try {
      // console.log(cstIds);
      let { code, data, msg } = await batchCancelSubmitByRecipe(recipeIds);
      if (code == 1) {
        newVueObj.$message.success("撤销成功");
        resolve(true);
      } else {
        newVueObj.$message.error(msg || "撤销失败");
        reject(false);
      }
    } catch (error) {
      newVueObj.$message.error("撤销失败");
      reject(false);
    }
  })
}


export function confirmProFunc(msg, closeOnClickModal = true) {
  return new Promise((resolve, reject) => {
    newVueObj.$confirm(msg, "提示", {
      dangerouslyUseHTMLString: true,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      closeOnClickModal,
      type: "warning"
    })
      .then(() => {
        // console.log("点击确定了");
        resolve(true);
      })
      .catch(() => {
        // console.log("点击取消了");
        reject(false);
      });
  });
}

// 数字保留四位小数
export function numberFormatter(noValue, toFixed = 4) {
  let cloneValue = isNaN(noValue) ? "0" : noValue;
  return new Number(cloneValue).rewToFixed(toFixed);
}




// 打印数组分割函数
export function cutArrFunc (data = [], cutNo = 10){
  let result = [];
  for(var i = 0, len = data.length; i < len; i += cutNo){
    result.push(data.slice(i,i + cutNo));
  }
  return result;
}


//计算总金额
//list 需要计算的药品数组
//药品的数量 * 单价 = 单个药品合计，保留两位小数。
//药品总价 = 单个药品的合计（保留两位）+
export function computeTotalHandler (list = [], totalKey = "amt"){
  let total = 0;
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    let amt = element[totalKey] || 0;
    total = new Big(total).plus(amt)
  }
  // 取两位小数 四舍五入
  total = new Big(total).toFixed(2);
  return total;
}


// 诊断 排序 中医在前，西医在后

export function orderDiagnost (value1, value2){
  if (value1['diagCat'].indexOf("中医") > -1) {
    return -1;
  } else if (value1['diagCat'].indexOf("西医") > -1) {
    return 1;
  }

  return 0;
}


//字符计算  中文占两个， 其他占 1个
// function getCharSpaceNum (totalStrWest){
//   let cTotal = 0;
//   for (const ch of totalStrWest) {
//     var reg = /[\u4e00-\u9fa5]/g;
//     if (reg.test(ch)) {
//       cTotal += 2;
//     } else {
//       cTotal += 1;
//     }
//   }
//   return cTotal;
// }

//字符计算  中文占两个， 数字占 1个  其他标点符号占两个
function eslipeCharHandler (totalStrWest, cutNo = 10000){
  let cIndex = 0;
  let charTotal = 0;
  let arr = totalStrWest.split('');
  let cutIndex = arr.length;
  for (let index = 0; index < arr.length; index++) {
    const ch = arr[index];
    var reg = /[\u4e00-\u9fa5]/g;
    var numReg = /^[0-9]*$/;// 数字
    var ziMureg = /^[A-Za-z]+$/;// 字母
    if (reg.test(ch)) {
      cIndex += 2;
      charTotal += 2;
    } else if (numReg.test(ch)) {
      // 数字占用1个字符
      cIndex += 1;
      charTotal += 1;
    } else if (ziMureg.test(ch)) {
      // 英文字母占用1个字符
      cIndex += 1;
      charTotal += 1;
    } else {
      cIndex += 2;
      charTotal += 2;
    }

    if (cIndex >= cutNo && cutNo != 10000){
      cutIndex = index;
      break;
    }
  }

  return {
    eslipeStr: totalStrWest.slice(0, cutIndex),
    charTotal
  };
}

// 固定一行 计算字符 折行后的高度
function getLineNumByChar (totalStrWest = 0, singleCharNo = 68){
  let { charTotal } = eslipeCharHandler(totalStrWest);
  let cTLineNum = Math.ceil(charTotal / singleCharNo);
  return cTLineNum;
}

// 计算诊断高度
function getDiagHtmlHeight (totalStrChm, totalStrWest, maxLineNum, lineHeight, singleCharNo){
  // 获取西医诊断的字符数量
  // let wTotal = eslipeCharHandler();
  // 获取西医总字符的 行数

  let wLineNum = getLineNumByChar(totalStrWest, singleCharNo);
  // 获取中医诊断的字符数量
  // let cTotal = eslipeCharHandler(totalStrChm);
  // 获取中医总字符的 行数
  let cLineNum = getLineNumByChar(totalStrChm, singleCharNo);

  let eslipseWstr = totalStrWest;
  let eslipseCstr = totalStrChm;

  //西医最多显示行数
  // 中医最少最多显示一行
  if (wLineNum > maxLineNum - 1) {
    wLineNum = maxLineNum - 1;
    // 截取西医字符串
    let { eslipeStr } = eslipeCharHandler(totalStrWest, singleCharNo * (maxLineNum - 1) - 3);
    eslipseWstr = eslipeStr + "...";
  }

  if (cLineNum > 1) {
    cLineNum = 1;
    // 截取中医字符串
    let { eslipeStr } = eslipeCharHandler(eslipseCstr, singleCharNo - 3);
    eslipseCstr = eslipeStr + "...";
  };

  let totalLineNum = cLineNum + wLineNum;

  // 西医和中医 都是空的 显示一行就好
  if (totalLineNum == 0) {
    totalLineNum = 1;
  }

  // 中西医加起来是 诊断的高度
  let diagHtmlHeight = totalLineNum * lineHeight;

  return {
    diagHtmlHeight,
    eslipseWstr,
    eslipseCstr
  };
}

// 诊断打印 相关参数计算
// diagHtmlTop 诊断模块 绝对 top
// diagHtmlHeight 诊断模块 高度
// cHtmlLineTop 诊断 与 药品中间的线的绝对 top
// contentHtmlTop 治疗医嘱模块的 绝对 top

function diagPrintModuleParams (diagList = [{}], { maxLineNum = 3, diagHtmlTop = 146.5, lineHeight = 14, singleCharNo = 68, diagTitle = '门诊诊断:'}){

  let lineMarginTop = 5;// 诊断 与 药品中间的线 上边距
  let lineMarginBottom = 5; //诊断 与 药品中间的线  下边距
  // 字符计算： 单行 31个中文字（单个两个位置），8个字符字（一个位置），一共 70个位置
  // 门诊诊断是 9 个;  【中文】是6个
  let diagNameWest = diagList[0].diagName || "";
  let diagCatWest = diagList[0].diagCat || "";
  // 西医总字符串
  let totalStrWest = diagTitle + diagCatWest + diagNameWest;

  let diagNameChm = "";
  let diagCatChm = "";
  if (diagList[1]) {
    diagNameChm = diagList[1].diagName;
    diagCatChm = diagList[1].diagCat;
  }
  // 中医总字符串
  let totalStrChm = diagCatChm + diagNameChm;

  let { diagHtmlHeight, eslipseWstr, eslipseCstr } = getDiagHtmlHeight(totalStrChm, totalStrWest, maxLineNum, lineHeight, singleCharNo);


  //诊断 与 药品中间的线 绝对 top  = 诊断模块 绝对 top + 诊断模块 高度 + lineMarginTop
  let cHtmlLineTop = diagHtmlTop + diagHtmlHeight + lineMarginTop;

  return {
    diagHtmlTop: diagHtmlTop + "pt", // 诊断模块 绝对 top
    diagHtmlHeight: diagHtmlHeight + "pt",// 诊断模块 高度
    cHtmlLineTop: cHtmlLineTop + "pt",// 诊断 与 药品中间的线的绝对 top
    contentHtmlTop: cHtmlLineTop + lineMarginBottom + "pt", // 治疗医嘱模块的 绝对 top
    diagNameObj:{
      eslipseWstr,
      eslipseCstr
    }
  }
}


// 中草药打印
// 诊断打印 相关参数计算
// diagHtmlTop 诊断模块 绝对 top
// diagHtmlHeight 诊断模块 高度
// cHtmlLineTop 诊断 与 药品中间的线的绝对 top
// contentHtmlTop 药品模块的 绝对 top
// dispendingMethTop 发药方式 的绝对 top

// export function diagPrintChmParams (diagList = [], maxLineNum = 3, diagHtmlTop = 146.5, lineHeight = 14, singleCharNo = 68, diagTitle = '门诊诊断:'){
function diagPrintChmParams (diagList = [{}], { maxLineNum = 3, diagHtmlTop = 146.5, lineHeight = 14, singleCharNo = 68, diagTitle = '门诊诊断:'} ){

  let lineMarginTop = 5;// 诊断 与 药品中间的线 上边距
  let lineMarginBottom = 5; //诊断 与 药品中间的线  下边距
  // 字符计算： 单行 31个中文字（单个两个位置），8个字符字（一个位置），一共 70个位置
  // 门诊诊断是 9 个;  【中文】是6个
  let diagNameWest = diagList[0].diagName || "";
  let diagCatWest = diagList[0].diagCat || "";
  // 西医总字符串
  let totalStrWest = diagTitle + diagCatWest + diagNameWest;

  let diagNameChm = "";
  let diagCatChm = "";
  if (diagList[1]) {
    diagNameChm = diagList[1].diagName;
    diagCatChm = diagList[1].diagCat;
  }
  // 中医总字符串
  let totalStrChm = diagCatChm + diagNameChm;

  let { diagHtmlHeight, eslipseWstr, eslipseCstr } = getDiagHtmlHeight(totalStrChm, totalStrWest, maxLineNum, lineHeight, singleCharNo);


  //诊断 与 药品中间的线 绝对 top  = 诊断模块 绝对 top + 诊断模块 高度 + lineMarginTop
  let cHtmlLineTop = diagHtmlTop + diagHtmlHeight + lineMarginTop;
  // 发药方式 的绝对 Height
  let dispMethHeight = 20;
  // 发药方式 的绝对 top
  let dispendingMethTop = cHtmlLineTop + 5;
  return {
    diagHtmlTop: diagHtmlTop + "pt", // 诊断模块 绝对 top
    diagHtmlHeight: diagHtmlHeight + "pt",// 诊断模块 高度
    cHtmlLineTop: cHtmlLineTop + "pt",// 诊断 与 药品中间的线的绝对 top
    dispendingMethTop: dispendingMethTop + "pt",// 发药方式 的绝对 top
    contentHtmlTop: cHtmlLineTop + dispMethHeight + lineMarginBottom + "pt", // 治疗医嘱模块的 绝对 top
    diagNameObj: {
      eslipseWstr,
      eslipseCstr
    }
  }
}

// 处方西药打印 方法
export function westOrderItemPrintHandle (printData, {printTpl, drugsTpl, diagnoseTplChm}, printDirect = false){
  let obj = {
    diagHtmlTop: "146.5pt", // 诊断模块 绝对 top
    diagHtmlHeight: "14pt",// 诊断模块 高度
    cHtmlLineTop: "165pt",// 诊断 与 药品中间的线的绝对 top
    contentHtmlTop: "170pt", // 治疗医嘱模块的 绝对 top
    MIS_ID: "",
    settlemetnType: "",
    patientNum: "",
    patientGender: "",
    age: "",
    deptId: "",
    outpDeptName: "",
    doctorName: "",
    diagTime: "",
    relateAddress: "",
    relateNum: "",
    applyNum: "",
    chargpeople: "",
    visitCode: "",
    relateCode: "",
    weight: "",
    diagList: [ { diagList: [{}] }]
  };
  printData = {
    ...obj,
    ...printData
  }
  // 获取打印诊断 相关参数
  let { diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop, diagNameObj } = diagPrintModuleParams(printData.diagList[0].diagList, { maxLineNum: 4 });

  printData = {
    ...printData,
    ...{
      diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop,diagNameObj
    }
  }



  let { diagList, part3, settlemetnType } = printData;
  let rDiagList = diagList[0].diagList;

  // 药品的模板
  let aParse = eval(compile(drugsTpl));
  //药品的模板
  printData.RecipeDetails = aParse(printData);

  // 门诊诊断的模板
  let bParse = eval(compile(diagnoseTplChm));
  //门诊诊断
  printData.diagnoseHtml = bParse(diagNameObj);

  //体重 weight
  printData.weight = printData.weight ? printData.weight : "";
  //处方类型 diseaseRecipeType
  printData.diseaseRecipeType = printData.diseaseRecipeType
    ? printData.diseaseRecipeType
    : "";
  //社康中心  处方笺
  printData.hosName = printData.hosName + "处方笺";

  // 姓名截取前八位
  printData.patientName = printData.patientName
    ? printData.patientName.substring(0, 8)
    : "";

  // 体重 加 单位 KG
  printData.weight = printData.weight
    ? printData.weight + "kg"
    : "";

  // onPreviewData(data, "门诊处方西成药11");
  // console.log("printData", printData);
  // print(null, this.printTpl, {}, printData, true);
  // console.log("print:::");


  // let printDirect = printAll ? true : dataList.length > 1;
  print(null, printTpl, {}, printData, printDirect);

}

// 中草药打印 方法
export function chmOrderItemPrintHandle (printData, {printTpl, chmContenTpl, diagnoseTplChm}, printDirect = false){
  let diagNameParams = {
    maxLineNum: 3 // 诊断的最大行数
  }
  let obj = {
    diagHtmlHeight: "14pt",// 诊断模块 高度
    cHtmlLineTop: "169pt",// 诊断 与 药品中间的线的绝对 top
    dispendingMethTop: "175pt", // 发药方式绝对 top
    contentHtmlTop: "177pt", // 中草药模块的 绝对 top
    MIS_ID: "",
    settlemetnType: "",
    patientNum: "",
    patientGender: "",
    age: "",
    deptId: "",
    outpDeptName: "",
    doctorName: "",
    diagTime: "",
    relateAddress: "",
    relateNum: "",
    applyNum: "",
    chargpeople: "",
    visitCode: "",
    relateCode: "",
    weight: "",
    diagList: [ { diagList: [{}] }]
  };

  printData = {
    ...obj,
    ...printData
  }
// 获取打印诊断 相关参数
 let { diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop, diagNameObj, dispendingMethTop } = diagPrintChmParams(printData.diagList[0].diagList, diagNameParams);


printData = {
  ...printData,
  ...{
    diagHtmlTop, dispendingMethTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop,diagNameObj
  }
}



  // useMethod 为undefined ,值处理成空
  printData.useMethod = printData.useMethod || "";

  let { diagList, part3 } = printData;
  let rDiagList = diagList[0].diagList;
  // onPreview(data, "门诊处方(草药)");
  let aParse = eval(compile(diagnoseTplChm));
  printData.Diagnosis = aParse(diagNameObj);

  let bParse = eval(compile(chmContenTpl));
  printData.RecipeDetails = bParse(part3);

  //体重 weight
  printData.weight = printData.weight ? printData.weight : "";
  //处方类型 diseaseRecipeType
  printData.diseaseRecipeType = printData.diseaseRecipeType ? printData.diseaseRecipeType : "";
  //社康中心  处方笺
  printData.hosName = printData.hosName + "处方笺";
  // 姓名截取前八位
  printData.patientName = printData.patientName ? printData.patientName.substring(0,8) : "";

  // 体重 加 单位 KG
  printData.weight = printData.weight ? printData.weight + "kg" : "";



  // console.log("printData", printData, chmLodopTpl);
  // print(null, this.printTpl, {}, printData, printDirect);
  print(null, printTpl, {}, printData, printDirect);
}


// 家床-中草药打印 方法
export function chmOrderItemPrintHandleCis (printData, {printTpl, chmContenTpl, diagnoseTplChm}, printDirect = false){
  let diagNameParams = {
    maxLineNum: 3 // 诊断的最大行数
  }
  let obj = {
    diagHtmlHeight: "14pt",// 诊断模块 高度
    cHtmlLineTop: "169pt",// 诊断 与 药品中间的线的绝对 top
    dispendingMethTop: "175pt", // 发药方式绝对 top
    contentHtmlTop: "177pt", // 中草药模块的 绝对 top
    MIS_ID: "",
    settlemetnType: "",
    patientNum: "",
    patientGender: "",
    age: "",
    deptId: "",
    outpDeptName: "",
    doctorName: "",
    diagTime: "",
    relateAddress: "",
    relateNum: "",
    applyNum: "",
    chargpeople: "",
    visitCode: "",
    relateCode: "",
    weight: "",
    diagList: [ { diagList: [{}] }]
  };

  printData = {
    ...obj,
    ...printData
  }
// 获取打印诊断 相关参数
  let { diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop, diagNameObj, dispendingMethTop } = diagPrintChmParams(printData.diagList[0].diagList,{diagTitle : '家床诊断:'}, diagNameParams);
console.log(diagNameObj)

  printData = {
    ...printData,
    ...{
      diagHtmlTop, dispendingMethTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop,diagNameObj
    }
  }



  // useMethod 为undefined ,值处理成空
  printData.useMethod = printData.useMethod || "";

  let { diagList, part3 } = printData;
  let rDiagList = diagList[0].diagList;
  // onPreview(data, "门诊处方(草药)");
  let aParse = eval(compile(diagnoseTplChm));
  printData.Diagnosis = aParse(diagNameObj);

  let bParse = eval(compile(chmContenTpl));
  printData.RecipeDetails = bParse(part3);

  //体重 weight
  printData.weight = printData.weight ? printData.weight : "";
  //处方类型 diseaseRecipeType
  printData.diseaseRecipeType = printData.diseaseRecipeType ? printData.diseaseRecipeType : "";
  //社康中心  处方笺
  printData.hosName = printData.hosName + "处方笺";
  // 姓名截取前八位
  printData.patientName = printData.patientName ? printData.patientName.substring(0,8) : "";

  // 体重 加 单位 KG
  printData.weight = printData.weight ? printData.weight + "kg" : "";



  // console.log("printData", printData, chmLodopTpl);
  // print(null, this.printTpl, {}, printData, printDirect);
  print(null, printTpl, {}, printData, printDirect);
}

export {
  compile,
  diagPrintModuleParams,
  diagPrintChmParams,
  // getCharSpaceNum,
  getLineNumByChar
}
