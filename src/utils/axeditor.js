/* eslint-disable complexity */
import { getMacroValues } from "@/api/emrRecord/emr/element";
import { transformCode, getTableData } from "@/api/directive/directiveRequest";
import { saveMarkInfo, getMarkInfo } from "@/api/emrRecord/emr/mark";
import { getWardName } from "@/api/admin/role";
import { deepClone } from './index'
import dayjs from "dayjs"

/**
 * 保存留痕信息
 * @param {String} params {editor:编辑器实例,mrId:文书id}
 * @returns {Promise} 保存后返回的结果
 */
let saveMarks = function (params) {
  let { editor, mrId, opLogId } = params;
  if (editor && editor.options.editorModel == "mark") {
    let markInfoArr = editor.execCommand("getmarkinfo");
    markInfoArr = markInfoArr.map(item => {
      let {
        id: controlId,
        optType: operationType,
        html: formatCode,
        plainText: formatText,
        text: pureText
      } = item;
      return {
        mrId,
        controlId,
        operationType,
        formatCode,
        formatText,
        pureText,
        opLogId
      };
    });
    return saveMarkInfo(markInfoArr);
  }
  return new Promise((resolve, reject) => {
    resolve();
  });
};

/**
 * 获取留痕信息
 * @param {JSON} params {editor:编辑器实例,mrId:文书id,controlId:控件id}，控件id为空时查询文书下所有控件的留痕信息
 * @returns {Null} 无返回信息
 */
let getMarks = function (params) {
  let { editor, mrId, controlId } = params;
  if (editor && editor.options.editorModel == "mark") {
    getMarkInfo({ mrId, controlId }).then(res => {
      if (res.code == 1) {
        let [markArr, markInfo] = [res.data, {}];
        markArr.map(item => {
          let types = { "1": "增加", "2": "删除", "3": "增加+删除" };
          let { updatedByName: modifyUser, updateTime, operationType } = item;
          if (!markInfo[item.controlId]) {
            markInfo[item.controlId] = [];
          }
          markInfo[item.controlId].push({
            modifyUser,
            updateTime,
            optType: types[operationType]
          });
          return item;
        });

        editor.execCommand("showmarkinfo", { markInfo });
      }
    });
  }
};

let handlerDiagnoseInfo = function (list) {
  let m = new Map();
  list.forEach((item) => {
    let beforeDiag = item.beforeDiag || "";
    let afterDiag = item.afterDiag || "";
    let titleStr = `${beforeDiag + (item.diagNm || item.diagName) + afterDiag}`;
    if (m.has(item.diagTpCd)) {
      m.get(item.diagTpCd).push({
        name: titleStr,
        cwDiagName: (item.cwDiagF || item.cwFlag) === "1" ? "西" : "中", // 兼容 模板维护时，增加的诊断
        mainFlag: (item.mainF || item.diagMain) === "1",
        tcmSyndromeNm: item.tcmSyndromeNm || item.tcmSyndrome,
        diagCd: item.diagCd
      });
    } else {
      let arr = [];
      arr.push({
        name: titleStr,
        cwDiagName: (item.cwDiagF || item.cwFlag) === "1" ? "西" : "中",
        mainFlag: (item.mainF || item.diagMain) === "1",
        tcmSyndromeNm: item.tcmSyndromeNm || item.tcmSyndrome,
        diagCd: item.diagCd
      });
      m.set(item.diagTpCd, arr);
    }
  });

  let diagnoseInfo = [];

  m.forEach((value, key) => {
    let item = {
      type: key,
      resultList: value,
    };
    diagnoseInfo.push(item);
  });
  return diagnoseInfo;
}

/**
 * 插入诊断信息，可编辑
 * @param {*} editor
 * @param {*} results
 */
let insertDiagnose = function (editor, results) {
  console.log(results);
  if (!editor) return;

  let html = "";
  for (let j = 0; j < results.length; j++) {
    for (let i = 0; i < results[j].resultList.length; i++) {
      let item = results[j].resultList[i];
      let mainF = item.mainFlag ? "(主)" : ''
      html += `<span>${i + 1}、(${item.cwDiagName})${item.name} ${mainF}</span>`
      if (i < results[j].resultList.length - 1) html += "<br>"
    }
  }
  editor.execCommand("insertHtml", html);
}

/**
 * 反显诊断信息
 * @param {axEditor} editor 编辑器实例
 * @param {Array} results 诊断结果，数据格式：[{title: '初步诊断',resultList: ['脑外伤后综合征']},{title: '家床诊断',resultList: ['高血压病','2型糖尿病','左侧顶骨骨折','全身多处软组织损伤']}]
 * @returns {Null} 无返回值
 */
let showDiagnoseInfo = function (editor, results) {
  console.log(editor, results, "诊断--results");
  if (!editor) {
    return;
  }


  if (results && results.length > 0) {
    for (let i = 0; i < results.length; i++) {
      let str =
        '<span class="diagnoseTable table" cellspacing="0" cellpadding="0">';
      let resultList = results[i].resultList;

      for (let j = 0; j < resultList.length; j++) {

        let diagItem = resultList[j];
        let mainF = diagItem.mainFlag ? "(主)" : ''
        str +=
          '<span class="tr"><span class="hasdata" align="right" valign="top"></span><span class="">' +
          (j + 1) +
          "." + "( " + diagItem.cwDiagName + " )" +
          diagItem.name +
          mainF + '  ' +
          (diagItem.tcmSyndromeNm || '') +
          "</span></span>";
      }
      str += "</span>";
      editor.execCommand("showdiagnose", str, results[i].type);
    }
  } else {
    let str =
      '<span class="diagnoseTable table" cellspacing="0" cellpadding="0">';
    str +=
      '<span class="tr"><span class="" align="center">暂无诊断信息</span></span>';
    str += "</span>";
    editor.execCommand("showdiagnose", str);
  }
};
/**
 * // 插入处方，可编辑
 * @param {*} editor
 * @param {*} medicines
 */
let insertPrescription = function (editor, medicines) {
  if (!editor) return;

  let { medicineList = [], chinaMedicineList = {}, otherPreviousList = [] } = medicines;

  // 分三种情况处理

  let medicineLen = medicineList.length;
  let medicineStr = '';


  let chinaMedicineLen = Object.keys(chinaMedicineList).length;
  let chinaMedicineStr = '';

  let otherPreviousStr = '';

  for (let i = 0; i < medicineList.length; i++) {
    medicineStr += `
      <span>${i + 1}、${medicineList[i].selfProvidedFlag ? "（自备）" : ""} ${medicineList[i].svNm} ${medicineList[i].spec} ${medicineList[i].qty} ${medicineList[i].useNumStr} ${medicineList[i].freqAndUsreage};</span><br/>
    `;
  }

  if (chinaMedicineLen) {
    Object.values(chinaMedicineList).forEach((chineseList, index) => {
      let nameList = chineseList.map(item => `${item.svNm} ${item.useNumStr}`)
      chinaMedicineStr += `<span style="line-height: 16px">${medicineLen + index + 1} ${nameList.join('、 ')}</span><br/>`
      chinaMedicineStr += `<span style="line-height: 16px">付数: ${chineseList[0].crtDosage}</span><br/>`
      chinaMedicineStr += `<span style="line-height: 16px">用法: ${chineseList[0].freqAndUsreage}</span><br/>`
    })
  }


  for (let i = 0; i < otherPreviousList.length; i++) {
    otherPreviousStr += `<span style="line-height: 16px">${(medicineLen + chinaMedicineLen + i + 1)}、${otherPreviousList[i].svNm}  ${otherPreviousList[i].useNumStr}</span><br/>`
  }


  let html = medicineStr + chinaMedicineStr + otherPreviousStr;
  editor.execCommand("insertHtml", html);
}
/**
 * 反显处方信息
 * @param {axEditor} editor 编辑器实例
 * @param {Array} medicines 药物清单，数据格式：{rejections: [{medicines: [{name: '葡萄糖注射液',spec: '5% 500.0ml/袋',qty: '1.0袋'},{name: '丹参注射液',spec: '10ml/支',qty: '1.0袋'},{name: '乳糖酸阿奇霉素注射液',spec: '0.125g 2.5ml/支',qty: '1.0支'}],usageMode: '静滴 qdx1天'},{medicines: [{name: '葡萄糖氯化钠注射液',spec: '5% 500.0ml/袋',qty: '1.0袋'},{name: '注射用头孢曲松钠粉针剂',spec: '2g/瓶',qty: '2.0瓶'},{name: '23价肺炎球菌多糖疫苗',spec: '0.5ml/支',qty: '1.0支'}],usageMode: '静滴 qdx1天'},{medicines: [{name: '23价肺炎球菌多糖疫苗',spec: '0.5ml/支',qty: '1.0支'}],usageMode: '肌注 alwaysx1天'}],orals: [{name: '三金片(薄衣片)',spec: '3.5gx72片/盒x1盒',usageMode: '10.5g tidx1天 口服'},{name: '云南白药胶囊',spec: '0.25gx16粒/盒x1盒',usageMode: '0.25g qidx1天 口服'}]}
 * @returns {Null} 无返回值
 */


let showPrescriptionInfo = function (editor, object, orderShowStyle = "1") {

  if (!editor) {
    return;
  }

  let { medicines = {}, chineseHerbalMedicine = {}, usageMedicine = [] } = object;

  let str = '';

  // 西药和中成药
  let medicineStr = medicineHtml(medicines, orderShowStyle);
  // 中草药
  let chineseHerbalMedicineStr = chineseMedHtml(chineseHerbalMedicine);
  // 非药品
  let usageMedicineStr = makeOralHtml(usageMedicine);

  if (Object.keys(medicines).length === 0
    && Object.keys(chineseHerbalMedicine).length === 0 && usageMedicine.length === 0) {
    str +=
      '<span><span align="center">暂无处方信息</span></span></span>';
  } else {
    if (Object.keys(medicines).length > 0) {
      str += medicineStr;
    }
    if (Object.keys(chineseHerbalMedicine).length !== 0) {
      str += chineseHerbalMedicineStr;

    }
    if (usageMedicine.length !== 0) {
      str += usageMedicineStr;
    }
  }
  editor.execCommand("showprescription", str);
}

/**
 * 刷新基本信息
 * @param {axEditor} editor 编辑器实例
 * @param {String} patientId 病人id
 * @param {String} enId 门诊或住院流水号
 * @param {Boolean} hideConfirmTip 是否隐藏confirm提示，体征过滤时直接隐藏敏感词
 * @returns {Null} 无返回值
 */
let refreshMacros = async function ({
  editor,
  patientId,
  enId,
  enTpCd,
  hideConfirmTip,
  isHome,
  mrId
}) {
  if (!editor) {
    return;
  }
  hideConfirmTip = !!hideConfirmTip;
  let response = await getMacroValues({ patientId, enId, enTpCd, isHome, mrId });

  if (response.code == 1) {
    let macros = response.data;
    let [
      genderIndex,
      maritalIndex,
      nationalIndex,
      jobIndex,
      departmentIndex,
      WardIndex,
      payWayIndex,
      settlementWayIndex,
    ] = [-1, -1, -1, -1, -1, -1, -1, -1];

    macros = macros.map((item, key) => {
      let val = item.elementValue;
      if (item.elementCode == "M0002") {
        //性别
        genderIndex = key;
      }
      if (item.elementCode == "M0004") {
        //婚姻状态
        maritalIndex = key;
      }
      if (item.elementCode == "M0005") {
        //民族
        nationalIndex = key;
      }
      if (item.elementCode == "M0006") {
        //职业
        jobIndex = key;
      }
      if (item.elementCode == "M0019") {
        //科室
        departmentIndex = key;
      }
      if (item.elementCode == "M0020") {
        // 病区
        WardIndex = key;
      }


      if (item.elementCode == "M0030") {
        // 就诊时间 处理
        let timeList = val.length > 0 ? val.split(" ") : [];
        let lastIndx = timeList.length > 0 ? timeList[1].lastIndexOf(":") : 0;
        val =
          timeList.length > 0
            ? `${timeList[0]} ${timeList[1].slice(0, lastIndx)}`
            : "";
      }
      if (item.elementCode == "M0031") {

        try {
          val = dayjs(val).format('YYYY-MM-DD');
        } catch (e) {
          console.log(e)
        }
      }
      if (item.elementCode == "M0032") {

        try {
          val = val === "" ? "" : dayjs(val).format('YYYY-MM-DD');
        } catch (e) {
          console.log(e)
        }
      }

      if (item.elementCode === 'M0040') {
        // 付费方式
        // payWayIndex = key
        settlementWayIndex = key
      }

      return { id: item.elementId, val: val, isSecret: item.securityF == 1 };
    });



    let data = [];
    if (needTransform(genderIndex, macros)) {
      data.push({
        field: "name",
        code: "GENDER_CODE",
        val: macros[genderIndex].val
      });
    }
    if (needTransform(maritalIndex, macros)) {
      data.push({
        field: "name",
        code: "MARITAL_STATUS_CODE",
        val: macros[maritalIndex].val
      });
    }
    if (needTransform(nationalIndex, macros)) {
      data.push({
        field: "name",
        code: "NATIONAL_NAME_CODE",
        val: macros[nationalIndex].val
      });
    }
    if (needTransform(jobIndex, macros)) {
      data.push({
        field: "name",
        code: "OCCUPATIONAL_CLASSIFICATION_CODE",
        val: macros[jobIndex].val
      });
    }

    // if (needTransform(payWayIndex, macros)) {
    //   data.push({
    //     field: "name",
    //     code: "settlementType",
    //     val: macros[payWayIndex].val
    //   });
    // }

    // 执行科室反显
    if (needTransform(departmentIndex, macros)) {
      transformTable(
        "org_nm",
        {
          org_type: "_DEPT_",
          id: macros[departmentIndex].val
        },
        "sys_org"
      ).then(data => {
        macros[departmentIndex].val = data;
        editor.execCommand("updatemacros", {
          macros,
          hideConfirmTip,
          isTranformData: true
        });
      });
    }
    // 执行付费方式反显
    if (needTransform(settlementWayIndex, macros)) {
      transformTable(
        "company_name",
        {
          deleted_status: 0,
          record_status: 1,
          company_code: macros[settlementWayIndex].val
        },
        "fin_company"
      ).then(data => {
        macros[settlementWayIndex].val = data;
        editor.execCommand("updatemacros", {
          macros,
          hideConfirmTip,
          isTranformData: true
        });
      });
    }

    if (data.length > 0) {
      try {
        // code 反显
        transformCode(data).then(data => {
          if (data.code == 1) {
            if (genderIndex != -1) {
              macros[genderIndex].val = data.data["GENDER_CODE"];
            }
            if (maritalIndex != -1) {
              macros[maritalIndex].val = data.data["MARITAL_STATUS_CODE"];
            }
            if (nationalIndex != -1) {
              macros[nationalIndex].val = data.data["NATIONAL_NAME_CODE"];
            }
            if (jobIndex != -1) {
              macros[jobIndex].val =
                data.data["OCCUPATIONAL_CLASSIFICATION_CODE"];
            }

            // if (payWayIndex != -1) {
            //   macros[payWayIndex].val = data.data["settlementType"];
            // }

            editor.execCommand("updatemacros", {
              macros,
              hideConfirmTip,
              isTranformData: true
            });
          }
        });

        if (needTransform(WardIndex, macros)) {
          // 病区反显
          getWardName(macros[WardIndex].val).then(data => {
            macros[WardIndex].val = data.data[0].ward_name;
            editor.execCommand("updatemacros", {
              macros,
              hideConfirmTip,
              isTranformData: true
            });
          });
        }
      } catch (e) {
        editor.execCommand("updatemacros", {
          macros,
          hideConfirmTip,
          isTranformData: true
        });
      }
    } else {

      editor.execCommand("updatemacros", {
        macros,
        hideConfirmTip,
        isTranformData: true
      });
    }
  } else {
    // this.$message({
    //   type: "error",
    //   message: "网络繁忙，请重试！"
    // });
    console.log(response);
    alert("网络繁忙，请重试！");
  }
};

/**
 * 判断宏元素是否需要转码
 * @param {Number} index 索引号
 * @param {Array} macros 宏元素集合
 * @returns {Boolean} 是否需要转码
 */
function needTransform(index, macros) {
  return (
    index != -1 && macros[index].val != undefined && macros[index].val != ""
  );
}

/**
 * 计算年龄
 * @param {Array} ageArr 年龄数组[1,2,0]标识1年2个月0天
 * @returns {String} 计算后的年龄
 */
function calcAge(ageArr) {
  if (!Array.isArray(ageArr)) {
    ageArr = ageArr.split(",");
  }
  for (let i = 0; i < ageArr.length; i++) {
    ageArr[i] -= 0;
  }
  let [year, month, day, hour, minute, second] = ageArr;
  let calcVal = "未知";

  if (year) {
    calcVal = year + "岁";
  } else if (month) {
    calcVal = (month + day / 30).toFixed(1) + "月";
  } else if (day) {
    calcVal = day + "天";
  } else if (hour > 0) {
    calcVal = hour + "小时";
  }

  return calcVal;
}

//表数据反显 （科室用）
async function transformTable(columns, conditionMap, tableName) {
  try {
    let data = {
      tableName: tableName || "",
      columns: columns || "",
      conditionMap: conditionMap || {}
    };
    let resData = await getTableData(data);
    if (resData.code === 1 && resData.data != []) {
      return Promise.resolve(resData.data[0][columns]);
    }
    return "未知";
  } catch (error) {
    return "未知";
  }
}

/**
 * 根据段落类型在病历中获取段落内容
 * @param {String} templ  病历模板内容
 * @param {String} types  段落类型，多个以英文逗号分割，为空时查询所有段落类型及内容
 * @return {Array} 段落内容集合
 */
let getParagraphContent = function (templ, types) {
  let tempNode = document.createElement("div");
  tempNode.innerHTML = templ;
  let contents = {};
  //获取指定类型段落内容
  if (types) {
    types = types.split(",");
    for (let i = 0; i < types.length; i++) {
      let pinfo = {};
      let appointp = getByClass("paragraphele-" + types[i], tempNode);
      //兼容旧模板
      if (appointp.length == 0) {
        appointp = getByTagAttr("div", "paragraphtype", types[i], tempNode);
      }

      if (appointp.length > 0) {
        appointp = appointp[0];
        pinfo = makePinfo(appointp);
      }
      contents[types[i]] = pinfo;
    }
  } else {
    //获取所有类型段落内容
    let paragraps = getByClass("paragraphele", tempNode);
    for (let i = 0; i < paragraps.length; i++) {
      contents[paragraps[i].getAttribute("paragraphtype")] = makePinfo(
        paragraps[i]
      );
    }
  }
  return contents;
};

/**
 * 构造段落信息
 * @param {DOM} appointp 段落节点
 * @returns {JSON} 段落信息
 */
function makePinfo(appointp) {
  let pinfo = {};
  let titleDom = getByClass("ctrl-value", appointp);
  if (titleDom.length > 0) {
    pinfo.title = titleDom[0].innerText;
    pinfo.plainContent = appointp.innerHTML.replace(
      new RegExp(titleDom[0].innerHTML),
      ""
    );
  } else {
    pinfo.title = "";
    pinfo.plainContent = appointp.innerHTML;
  }
  pinfo.content = getShowDomText(appointp.childNodes);
  return pinfo;
}

/**
 * 获取段落内显示元素的文本内容
 * @param {Array} pchilds 段落子节点集合
 * @returns {String} 过滤隐藏元素后的段落文本内容
 */
/* eslint-disable */
function getShowDomText(pchilds) {
  var text = "";
  for (var j = 0; j < pchilds.length; j++) {
    var child = pchilds[j],
      tagName = child.tagName ? child.tagName.toLowerCase() : "";
    if (child.childNodes.length > 0 && tagName != "select") {
      if (
        child.getAttribute("axPlugins") == "radio" ||
        child.getAttribute("axPlugins") == "checkbox"
      ) {
        text += getBoxText(child).join(",");
      } else if (
        !hasClass(child, "editor-mark-del-text") &&
        !hasClass(child, "sensitiveWords") &&
        !(tagName == "strong" && hasClass(child, "ctrl-value"))
      ) {
        text += getShowDomText(child.childNodes);
      }
    } else {
      if (tagName == "select") {
        text += child.options[child.selectedIndex].text;
      } else {
        text += child.nodeValue || child.innerText;
      }
    }
  }
  return text;
}
/* eslint-enable */

/**
 * 获取单复选框内容
 * @param {DOM} ctrl 单复选控件DOM
 * @returns {Array} 选中选项文本内容数组
 */
function getBoxText(ctrl) {
  var type = ctrl.getAttribute("type"),
    inputs = ctrl.getElementsByTagName("input"),
    checkVal = [];
  var k = 0; //用来作checkVal数组的下标
  for (var i = 0, len = inputs.length; i < len; i++) {
    if (inputs[i].checked) {
      checkVal[k] = inputs[i].getAttribute("valueStr");
      k++;
    }
  }
  return checkVal;
}

function getDomStyle(dom) {
  if (!dom || !(dom.nodeType == 1 || dom.nodeType == 9)) {
    return {};
  }
  return dom.currentStyle
    ? dom.currentStyle
    : window.getComputedStyle(dom, null);
}

async function handlerPreviousData(data) {
  let medicineType = ["10", "12"]; // 药品医嘱（包括中成药）
  let chineseHerbalMedicineType = ["11"]; // 中草药医嘱

  if (!Array.isArray(data) || data.length === 0) {
    return []
  };

  let medicinesObj = {
    // otherPresPk: [], // 没有处方主键组件的数组
  };
  let chineseHerbalMedicineObj = {}; // 中医相关数据
  let usageMedicine = [];// 非药品相关数据

  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    if (medicineType.includes(item.orTpCd)) {
      let dosageUnitNm = "";

      if (item.dosageUnitNm) {
        let param = [
          {
            field: "name",
            code: "DrugDoseUnit",
            val: item.dosageUnitNm,
          },
        ];
        try {
          let res = await transformCode(param);
          if (res.code === 1) {
            dosageUnitNm = res.data.DrugDoseUnit;
          }
        } catch (error) {
          console.log(error, "计量单位转码错误");
        }
      };


      // 对用法转码 流程
      let useage = "";
      if (item.routeCd) {
        let param = [
          {
            field: "name",
            code: "MedicationRouteCode",
            val: item.routeCd,
          },
        ];
        try {
          let res = await transformCode(param);
          if (res.code === 1) {
            useage = res.data.MedicationRouteCode;
          }
        } catch (error) {
          console.log(error, "用法转码错误");
        }
      }

      // 数量单位
      let useNumCode = '';
      if (item.takeAmountUnitNm) {
        let param = [
          {
            field: "name",
            code: "DrugUnit",
            val: item.takeAmountUnitNm,
          },
        ];
        try {
          let res = await transformCode(param);
          if (res.code === 1) {
            useNumCode = res.data.DrugUnit;
          }
        } catch (error) {
          console.log(error, "用法转码错误");
        }
      }

      let value = {
        parOrPk: item.parOrPk || '',// 父医嘱
        orPresPk: item.orPresPk || '',// 处方主键
        orId: item.orId,
        name: item.svNm, // 药品名称
        orTpCd: item.orTpCd, // 药品类型
        spec: item.spec || "", // 规格
        qty: `${item.dosage || ""}${dosageUnitNm || ""}`, // 用量
        usage: useage || "", // 用法
        freqNm: item.freqNm,// 频次
        longOrF: item.longOrF,// 是否是长期医嘱
        useNum: parseFloat(item.takeAmount) || '',// 数量
        useNumCode: useNumCode || '',// 数量单位
        selfProvidedFlag: item.selfProvided === '0'
      }

      // parOrPk代表 父医嘱主键 成组医嘱

      if (value.orPresPk) {
        if (!medicinesObj[value.orPresPk]) {
          medicinesObj[value.orPresPk] = [value];
        } else {
          medicinesObj[value.orPresPk].push(value);
        }

      } else {
        if (!medicinesObj.otherPresPk) {
          medicinesObj.otherPresPk = []
        }
        medicinesObj.otherPresPk.push(value)
      }

    } else if (chineseHerbalMedicineType.includes(item.orTpCd)) {
      // 中医
      let takeAmount = "";
      if (item.takeAmountUnitNm) {
        let param = [
          {
            field: "name",
            code: "drugUnit",
            val: item.takeAmountUnitNm,
          },
        ];
        try {
          let res = await transformCode(param);
          if (res.code === 1) {
            takeAmount = res.data.drugUnit;
          }
        } catch (error) {
          console.log(error, "计量单位转码错误");
        }
      };

      // 对用法转码 流程
      let usage = "";
      if (item.routeCd) {
        let param = [
          {
            field: "name",
            code: "usage",
            val: item.routeCd,
          },
        ];
        try {
          let res = await transformCode(param);
          if (res.code === 1) {
            usage = res.data.usage;
          }
        } catch (error) {
          console.log(error, "用法转码错误");
        }
      }

      let value = {
        orPresPk: item.orPresPk,
        svNm: item.svNm,// 名称
        amount: parseFloat(item.takeAmount) || '', // 数量
        takeAmount: takeAmount || '', // 单位
        usage: usage || '', // 用法
        longOrF: item.longOrF,// 是否是长期医嘱
        crtDosage: item.crtDosage, //  付数
        freqNm: item.freqNm,// 频次
      }
      if (chineseHerbalMedicineObj[value.orPresPk]) {
        chineseHerbalMedicineObj[value.orPresPk].push(value)
      } else {
        chineseHerbalMedicineObj[value.orPresPk] = [value]
      }
    } else {
      // 非医药  包括检验检查等
      let takeAmount = "";
      if (item.takeAmountUnitNm) {
        let param = [
          {
            field: "name",
            code: "drugUnit",
            val: item.takeAmountUnitNm,
          },
        ];
        try {
          let res = await transformCode(param);
          if (res.code === 1) {
            takeAmount = res.data.drugUnit;
          }
        } catch (error) {
          console.log(error, "单位转码错误");
        }
      }

      let value = {
        takeAmount: takeAmount || '',
        svNm: item.svNm || "",
        longOrF: item.longOrF,// 是否是长期医嘱
        amount: parseFloat(item.takeAmount || "") || ''
      }

      usageMedicine.push(value)
    }
  }

  // 西药处方进行成组 处理
  for (let k in medicinesObj) {
    let rowList = deepClone(medicinesObj[k]);
    medicinesObj[k] = {}
    rowList.forEach(list => {
      if (list.parOrPk) {
        if (!medicinesObj[k][list.parOrPk]) {
          medicinesObj[k][list.parOrPk] = [list]
        } else {
          medicinesObj[k][list.parOrPk].push(list)
        }
      } else {

        if (!medicinesObj[k][list.orId]) {
          medicinesObj[k][list.orId] = [list];
        } else {
          medicinesObj[k][list.orId].push(list);
        }
      }
    })
  }

  console.log(medicinesObj, 'medicinesObj')

  console.log(chineseHerbalMedicineObj, 'chineseHerbalMedicineObj')

  console.log(usageMedicine, 'usageMedicine')

  let previousMedicines = {
    medicines: medicinesObj, // 西药
    chineseHerbalMedicine: chineseHerbalMedicineObj, // 中药
    usageMedicine: usageMedicine, // 非药品
  };


  return previousMedicines

};

/**
 * 拼接西药或中成药处方
 * @param {Array} medicines 注射药剂清单
 * @returns {String} 注射处方html
 */
function medicineHtml(medicines, orderShowStyle = '1') {
  let str = "";
  let count = 0;
  if (orderShowStyle === '2') {
    // 文本展示
    for (let k in medicines) {
      let medicine = medicines[k];
      for (let j in medicine) {
        let rowList = medicine[j];

        for (let index = 0, len = rowList.length; index < len; index++) {

          let detailStr = `${(rowList[index].selfProvidedFlag ? '(自备)' : '')} ${rowList[index].name} ${rowList[index].spec} ${rowList[index].qty} ${(rowList[index].useNum + rowList[index].useNumCode)} ${(rowList[index].freqNm + ' ' + rowList[index].usage)} `

          if (index === 0) {
            // if (!rowList[index].parOrPk) {
              str += `<p>${(count + 1)}、 ${detailStr}</p>`
              // count++
              // if (index === 0) {
              //   str += `<p>${(count + 1)}、 ${detailStr}</p>`
              //   count++
              // } else {
              //   str += `<p style="padding-left: 20px;"> ${detailStr} </p>`
              // }
            } else {
              str += `<p style="padding-left: 20px;"> ${detailStr} </p>`
            }
          // } else {
          //   str += `<p>${(count + 1)}、 ${detailStr}</p>`
          //   // count++
          // }
        }
        count++
      }
    }

    return str
  }
  str += '<span class="table" cellspacing="0" cellpadding="0">';
  let ths = ["", "药品名称", "规格", "用量", "成组", '数量', "频次用法"];
  // 表头处理
  var thstr = "<span class='tr ax-nosplit-elem'>";
  for (var i = 0; i < ths.length; i++) {
    thstr += "<span class='th'>" + ths[i] + "</span>";
  }
  thstr += "</span>";
  str += thstr;
  //内容处理


  for (let k in medicines) {
    let medicine = medicines[k]
    for (let j in medicine) {
      let rowList = medicine[j];
      let combineCls = "singleCombine";

      for (let index = 0, len = rowList.length; index < len; index++) {
        if (rowList.length > 1) {
          // 成组的医嘱处方处理样式
          if (index === 0) {
            combineCls = "topCombine";
          } else if (index === len - 1) {
            combineCls = "bottomCombine";
          } else {
            combineCls = "middleCombine";
          }
        } else {
          // combineCls = "singleCombine";
          combineCls = "";
        }
        str +=
          '<span class="tr ax-nosplit-elem">' +
          '<span class="td cirleNum">' +
          (count + 1) +
          "</span>" +
          '<span class="td" width="230">' +
          (rowList[index].selfProvidedFlag ? '(自备)' : '') +
          rowList[index].name +
          "</span>" +
          '<span class="td" width="180" align="right">' +
          rowList[index].spec +
          "</span>" +
          '<span class="td" width="100" align="right">' +
          rowList[index].qty +
          "</span>" +
          '<span width="20" class="td ' +
          combineCls +
          '"></span>' +
          '<span class="td" width="100" align="right">' +
          (rowList[index].useNum + rowList[index].useNumCode) +
          "</span>" +
          '<span class="td" width="130" rowspan="' +
          rowList.length +
          '">' +
          (rowList[index].freqNm + ' ' + rowList[index].usage) +
          "</span></span>";
        count++
      }
    }
  }
  str += '</span>'

  return str;
}

/**
 * 拼接中草药处方
 */
function chineseMedHtml(chineseHerbalMedicineObj) {
  let index = 1;
  let str = '<span style="line-height: 28px;font-weight: 700;" >中草药:</span><br/>'
  let chineseStr = ''
  for (let k in chineseHerbalMedicineObj) {
    let chineseList = chineseHerbalMedicineObj[k];
    let nameList = chineseList.map(item => `${item.svNm} ${item.amount} ${item.takeAmount}`)
    chineseStr += `<span style="line-height: 16px; display: block;">(${index}) ${nameList.join('、 ')}</span>`
    chineseStr += `<span style="line-height: 16px; display: block;">付数: ${chineseList[0].crtDosage}</span>`
    chineseStr += `<span style="line-height: 16px; display: block;">用法: ${chineseList[0].usage} ${chineseList[0].freqNm}</span>`
    index++
  }
  return str + chineseStr;
}

/**
 * 拼接非药品处方
 */
function makeOralHtml(orals) {

  let str = `<span style="line-height: 28px;font-weight: 700;" >非药品:</span>`;
  let oralHtml = ''
  for (let i = 0; i < orals.length; i++) {
    let item = orals[i]
    oralHtml += `<span style="line-height: 16px; display: block;">${(i + 1)}.${item.svNm}  ${item.amount}  ${item.takeAmount}</span>`;
  }
  return str + oralHtml;
}

/**
 * 判断dom对象是否包含指定class样式
 * @param {DOM} elem dom对象
 * @param {String} cls 样式名称
 * @returns {Boolean} true包含，false不包含
 */
function hasClass(elem, cls) {
  if (!elem) {
    return false; //元素为空则终止
  }
  cls = cls || "";
  if (cls.replace(/\s/g, "").length == 0) {
    return false; //当cls没有参数时，返回false
  }
  return new RegExp(" " + cls + " ").test(" " + elem.className + " ");
}

/**
 * 通过class样式查找对象
 * @param {String} className  class样式
 * @param {String} domRange 查找范围
 * @return {Array} list dom集合
 */
function getByClass(className, domRange) {
  domRange = domRange || document;
  var tags = domRange.getElementsByTagName("*");
  var list = [];
  for (var k in tags) {
    var tag = tags[k];
    if (hasClass(tag, className)) {
      list.push(tag);
    }
  }
  return list;
}

/**
 * 通过标签属性查找dom
 * @param {String} tag  标签
 * @param {String} attr 属性
 * @param {String} val  属性值
 * @param {String} domRange 查找范围
 * @return {Array} list dom集合
 */
function getByTagAttr(tag, attr, val, domRange) {
  domRange = domRange || document;
  var tags = domRange.getElementsByTagName(tag);
  var list = [];
  for (var i = 0; i < tags.length; i++) {
    if (tags[i] && tags[i].getAttribute(attr) == val) {
      list.push(tags[i]);
    }
  }
  return list;
}

export {
  saveMarks,
  getMarks,
  handlerDiagnoseInfo,
  insertDiagnose,
  showDiagnoseInfo,
  showPrescriptionInfo,
  insertPrescription,
  refreshMacros,
  getParagraphContent,
  handlerPreviousData
};
