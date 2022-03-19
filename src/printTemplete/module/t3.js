import {
  getLodop
} from "@/utils/LodopFuncs";

let t3A5 = `
LODOP.SET_PRINT_PAGESIZE(1, 0, 0,"A5");
LODOP.NEWPAGEA();
LODOP.ADD_PRINT_TEXT(4,3,551,30,"title");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Horient",2);
LODOP.ADD_PRINT_TEXT(37,2,45,25,"姓名：");
LODOP.ADD_PRINT_TEXT(37,39,148,25,"patientName");
LODOP.ADD_PRINT_TEXT(37,180,65,25,"发票号：");
LODOP.ADD_PRINT_TEXT(37,230,104,25,"receiptNum");
LODOP.ADD_PRINT_TEXT(37,330,71,25,"收费日期：");
LODOP.ADD_PRINT_TEXT(37,389,166,25,"chargeTime");
LODOP.ADD_PRINT_TEXT(60,2,95,25,"统筹支付金额：");
LODOP.ADD_PRINT_TEXT(60,179,100,25,"医保个人账户：");
LODOP.ADD_PRINT_TEXT(60,378,73,25,"自负金额：");
LODOP.ADD_PRINT_TEXT(60,262,120,25,"siSelfAccountMoney");
LODOP.ADD_PRINT_TEXT(60,85,95,25,"siFundPayMoney");
LODOP.ADD_PRINT_TEXT(60,437,115,25,"selfPayAmount");
LODOP.ADD_PRINT_TABLE(98,14,530,624,"tableContent");
LODOP.ADD_PRINT_TEXT(747,2,57,25,"收费员：");
LODOP.ADD_PRINT_TEXT(747,46,128,25,"chargeUserName");
LODOP.ADD_PRINT_TEXT(747,342,73,25,"打印时间：");
LODOP.ADD_PRINT_TEXT(747,401,156,25,"printTimes");
LODOP.ADD_PRINT_TEXT(747,170,60,25,"打印人：");
LODOP.ADD_PRINT_TEXT(747,216,129,25,"printName");
`;
let t3A4 = `
LODOP.SET_PRINT_PAGESIZE(1, 0, 0,"A4");
LODOP.NEWPAGEA();
LODOP.ADD_PRINT_TEXT(4,3,786,30,"title");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Horient",2);
LODOP.ADD_PRINT_TEXT(37,2,45,25,"姓名：");
LODOP.ADD_PRINT_TEXT(37,39,234,25,"patientName");
LODOP.ADD_PRINT_TEXT(37,273,65,25,"发票号：");
LODOP.ADD_PRINT_TEXT(37,323,222,25,"receiptNum");
LODOP.ADD_PRINT_TEXT(37,544,71,25,"收费日期：");
LODOP.ADD_PRINT_TEXT(37,603,166,25,"chargeTime");
LODOP.ADD_PRINT_TEXT(60,2,95,25,"统筹支付金额：");
LODOP.ADD_PRINT_TEXT(60,272,100,25,"医保个人账户：");
LODOP.ADD_PRINT_TEXT(60,542,70,25,"自负金额：");
LODOP.ADD_PRINT_TEXT(60,355,185,25,"siSelfAccountMoney");
LODOP.ADD_PRINT_TEXT(60,85,185,25,"siFundPayMoney");
LODOP.ADD_PRINT_TEXT(60,600,166,25,"selfPayAmount");
LODOP.ADD_PRINT_TABLE(98,34,698,916,"tableContent");
LODOP.ADD_PRINT_TEXT(1049,16,57,25,"收费员：");
LODOP.ADD_PRINT_TEXT(1049,60,171,25,"chargeUserName");
LODOP.ADD_PRINT_TEXT(1049,450,162,25,"打印时间：");
LODOP.ADD_PRINT_TEXT(1049,509,245,25,"printTimes");
LODOP.ADD_PRINT_TEXT(1049,229,103,25,"打印人：");
LODOP.ADD_PRINT_TEXT(1049,275,172,25,"printName");
`;
let t3A5Old = `
LODOP.PRINT_INITA(0, 0, 558, 794, "");
LODOP.SET_PRINT_PAGESIZE(1, 0, 0,"A5");
LODOP.ADD_PRINT_TEXT(4,3,551,30,"title");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Horient",2);
LODOP.ADD_PRINT_TEXT(37,2,45,25,"姓名：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(37,39,148,25,"patientName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(37,180,65,25,"发票号：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(37,230,104,25,"receiptNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(37,330,71,25,"收费日期：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(37,389,166,25,"chargeTime");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,2,95,25,"统筹支付金额：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,179,100,25,"医保个人账户：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,378,73,25,"自负金额：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,262,120,25,"siSelfAccountMoney");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,85,95,25,"siFundPayMoney");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,437,115,25,"selfPayAmount");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE(98,14,530,624,"tableContent");
LODOP.ADD_PRINT_TEXT(747,2,57,25,"收费员：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(747,46,128,25,"chargeUserName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(747,342,73,25,"打印时间：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(747,401,156,25,"printTimes");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(747,170,60,25,"打印人：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(747,216,129,25,"printName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
`;
let t3A4Old = `
LODOP.PRINT_INITA(0,0,794,1116,"");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A4");
LODOP.ADD_PRINT_TEXT(4,3,786,30,"title");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Horient",2);
LODOP.ADD_PRINT_TEXT(37,12,45,25,"姓名：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(37,49,234,25,"patientName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(37,283,65,25,"发票号：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(37,333,222,25,"receiptNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(37,554,71,25,"收费日期：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(37,613,166,25,"chargeTime");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,12,95,25,"统筹支付金额：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,282,100,25,"医保个人账户：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,552,70,25,"自负金额：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,365,185,25,"siSelfAccountMoney");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,95,185,25,"siFundPayMoney");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,610,166,25,"selfPayAmount");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE(87,34,713,937,"tableContent");
LODOP.ADD_PRINT_TEXT(1049,16,57,25,"收费员：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(1049,60,171,25,"chargeUserName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(1049,450,162,25,"打印时间：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(1049,509,245,25,"printTimes");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(1049,229,103,25,"打印人：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(1049,275,172,25,"printName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
`;

function generateTable(printData, size) {
  return new Promise((resolve) => {
    let data = printData.outpChargeDetailNewPOs;

    let commonStyle = "";
    let trCommonStyle = "";
    let compls = "";
    let header = [];
    if (size === "A5") {
      commonStyle =
        "border: 1px solid black;border-style: solid;border-collapse: collapse;font-size:11px";
      trCommonStyle = "height:15px;line-height:15px;text-align:center;";
      compls = "100px";
      header = [{
          label: "项目编码",
          prop: "siItemCode",
          style: "width:" + compls + ";" + commonStyle + trCommonStyle,
        },
        {
          label: "费用名称",
          prop: "chargeItemName",
          style: "width:150px;" + commonStyle + trCommonStyle,
        },
        {
          label: "单位",
          prop: "chargeUnit",
          style: "width:60px;" + commonStyle + trCommonStyle,
        },
        {
          label: "单价",
          prop: "chargePrice",
          style: "width:60px;" + commonStyle + trCommonStyle,
        },
        {
          label: "总量",
          prop: "chargeQuantity",
          style: "width:60px;" + commonStyle + trCommonStyle,
        },
        {
          label: "金额",
          prop: "totalMoney",
          style: "width:60px;" + commonStyle + trCommonStyle,
        },
      ];
    } else if (size === "A4") {
      commonStyle =
        "border: 1px solid black;border-style: solid;border-collapse: collapse;font-size:14px";
      trCommonStyle = "height:20px;line-height:20px;text-align:center;";
      compls = "120px";
      header = [{
          label: "项目编码",
          prop: "siItemCode",
          style: "width:" + compls + ";" + commonStyle + trCommonStyle,
        },
        {
          label: "费用名称",
          prop: "chargeItemName",
          style: "width:230px;" + commonStyle + trCommonStyle,
        },
        {
          label: "单位",
          prop: "chargeUnit",
          style: "width:80px;" + commonStyle + trCommonStyle,
        },
        {
          label: "单价",
          prop: "chargePrice",
          style: "width:80px;" + commonStyle + trCommonStyle,
        },
        {
          label: "总量",
          prop: "chargeQuantity",
          style: "width:80px;" + commonStyle + trCommonStyle,
        },
        {
          label: "金额",
          prop: "totalMoney",
          style: "width:80px;" + commonStyle + trCommonStyle,
        },
      ];
    }
    let str =
      "<table border='1' style='" +
      commonStyle +
      "'><thead><tr style='" +
      commonStyle +
      "'>";
    for (let i in header) {
      let item = header[i];
      str += "<th style='" + item.style + "'>" + item.label + "</th>";
    }
    str += "</tr></thead>";
    for (let k in data) {
      let item = data[k];
      str += "<tr>";
      for (let j in header) {
        let h = header[j];
        str += "<td style='" + h.style + "'>" + (item[h.prop] || '') + "</td>";
      }
      str += "</tr>";
    }
    str +=
      "<tr><td style='width:100px;" +
      commonStyle +
      trCommonStyle +
      "'>合计</td><td colspan='2' style='text-align:center;" +
      commonStyle +
      trCommonStyle +
      "'> " +
      printData.totalAmount +
      " </td><td colspan='3' style='text-align:center;" +
      commonStyle +
      trCommonStyle +
      "'> " +
      printData.RMB +
      " </td></tr>";
    resolve(str + "</table>");
  });
};

function printNew(moduleKey, tid, config, content, directPrint, size) {
  if (!LODOP) {
    LODOP = getLodop();
  }
  LODOP.SET_LICENSES(
    "北京联想智慧医疗信息技术有限公司",
    "BEBE8A01D6D982EB566A294D4D199065",
    "",
    ""
  );
  if (size === "A5") {
    LODOP.PRINT_INITA(0, 0, 558, 794, "");
  } else if (size === "A4") {
    LODOP.PRINT_INITA(0, 0, 794, 1116, "");
  }

  LODOP.SET_PRINT_PAGESIZE(1, 0, 0, size);

  eval(content);
  LODOP.SET_PRINT_MODE("TRYLINKPRINTER_NOALERT", true);
  // 制定打印机
  let printIndex = localStorage.getItem("printer_index_" + moduleKey);
  if (!isNaN(printIndex - 0)) {
    LODOP.SET_PRINTER_INDEX(printIndex);
  } else if (!isNaN(config.printer - 0)) {
    LODOP.SET_PRINTER_INDEX(config.printer);
  }
  // 打印旋转角度
  LODOP.SET_PRINT_STYLEA(0, "Angle", config.angle || 0);
  LODOP.PREVIEW();
};
export {
  t3A5,
  t3A4,
  t3A5Old,
  t3A4Old,
  generateTable,
  printNew
};
