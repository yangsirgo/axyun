import { getLodop } from "@/utils/LodopFuncs";
import templates from "@/printTemplete";

let LODOP;

// header: [{
//   label: "姓名",
//   prop: "name"
// }]
// data: [{
//   name: "张三"
// },{
//   name: "李四"
// }]
function generateTable(header, data) {
  let str = "<table><tr>";
  for (let i = 0; i < header.length; i++) {
    const item = header[i];
    str += "<th>" + item.label + "</th>";
  }
  str += "</tr>";
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    str += "<tr>";
    for (let j = 0; j < header.length; j++) {
      const h = header[j];
      str += "<th>" + item[h.prop] + "</th>";
    }
    str += "</tr>";
  }
  return str + "</table>";
}

// config: {
//   printer: "",// 打印机序号
//   angle: "" // 打印角度
// }
// template: ""
// data: [{
//   org: "安想",
//   age: "12",
//   table: {
//     header: [],
//     data: []
//   }
// }]
// let localMacNo = localStorage.getItem("currentMacNo");
export function print(moduleKey, tid, config, data, directPrint) {
  if (!LODOP) {
    LODOP = getLodop();
  }
  LODOP.SET_LICENSES(
    "北京联想智慧医疗信息技术有限公司",
    "BEBE8A01D6D982EB566A294D4D199065",
    "",
    ""
  );
  let content = tid.length < 20 ? templates[tid] : tid;
  for (const key in data) {
    const value = data[key];
    if (value && value.header) {
      value = generateTable(value.header, value.data);
    }
    let re = new RegExp('"' + key + '"', "g");
    content = content.replace(re, '"' + value + '"');
  }
  eval(content);
  LODOP.SET_PRINT_MODE("TRYLINKPRINTER_NOALERT", true);

  // 制定打印机
  let printIndex = localStorage.getItem("printer_index_" + moduleKey);
  if (config.printerName) {
    LODOP.SET_PRINTER_INDEX(config.printerName);
  } else if (!isNaN(printIndex - 0)) {
    LODOP.SET_PRINTER_INDEX(printIndex);
  } else if (!isNaN(config.printer - 0)) {
    LODOP.SET_PRINTER_INDEX(config.printer);
  }

  // 打印旋转角度
  LODOP.SET_PRINT_STYLEA(0, "Angle", config.angle || 0);

  if (directPrint) {
    LODOP.PRINT();
  } else {
    LODOP.PREVIEW();
    // LODOP.PRINT_DESIGN();
  }
}

export function getPrinterList() {
  if (!LODOP) {
    LODOP = getLodop();
  }
  let list = [];
  let iPrinterCount = LODOP.GET_PRINTER_COUNT();
  for (let i = 0; i < iPrinterCount; i++) {
    list.push(LODOP.GET_PRINTER_NAME(i));
  }
  return list;
}

export function cachePrintIndex(moduleKey, index) {
  return localStorage.setItem("printer_index_" + moduleKey, index);
}

export function getPrintIndex(moduleKey) {
  return localStorage.getItem("printer_index_" + moduleKey);
}
