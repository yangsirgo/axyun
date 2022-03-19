import { getReportHtml } from "@/api/admin/print/ureport";
import { getLodop } from "@/utils/LodopFuncs";
import { getPxValueByUnit } from "./print";
import { getServerConfig } from "@/utils/config";

export function pdfShow(dataR) {
  let title = dataR.name;
  let map = dataR.map;
  let value = "";
  for (var key in map) {
    value = value + "&" + key + "=" + map[key];
  }

  window.open(
    getServerConfig("BASE_API") +
      "/ureport/pdf/show?_u=mysql:" +
      title +
      ".ureport.xml" +
      value
  );
}

export function onPrint(dataR) {
  dataR.ContextPath = getServerConfig("BASE_API");
  let reportName = dataR.name;
  dataR.name = "mysql:" + reportName + ".ureport.xml";

  getReportHtml(dataR).then(res => {
    let report = res.data;
    console.log(report);
    print(report.html, reportName, dataR);
  });
}

export function print(html, title, form) {
  let LODOP = getLodop();
  //判断是否输入上边距
  let tmargins = 10;
  //判断是否输入左边距
  let lmargins = 0;
  //判断是否输入纸张的宽度
  let pageWidth = 794;
  //判断是否输入纸张的高度
  let pageHeight = 1123;
  //判断是否有页眉高度
  let header = 10;
  //判断是否有页脚高度
  let footer = 10;
  //判断页脚的显示方式
  let selected = "";
  //判断是否输入标题的高度
  let titleHeight = 88;
  //判断纸张内容的方向
  let picked = "one";
  let direction = 1;
  let tpicked = "";
  let unit = "";
  console.log("form-----", form);
  //判断是否输入上边距
  if (form.tmargins) {
    tmargins = getPxValueByUnit(form.tmargins, unit);
  }
  //判断是否输入左边距
  if (form.lmargins) {
    lmargins = getPxValueByUnit(form.lmargins, unit);
  }
  //判断是否输入纸张的宽度
  if (form.pageWidth) {
    pageWidth = getPxValueByUnit(form.pageWidth, unit);
  }
  //判断是否输入纸张的高度
  if (form.pageHeight) {
    pageHeight = getPxValueByUnit(form.pageHeight, unit);
  }
  //判断是否输入标题的高度
  if (form.theight) {
    titleHeight = getPxValueByUnit(form.theight, unit);
  }

  LODOP.PRINT_INITA(tmargins, lmargins, pageWidth, pageHeight, title); //设定偏移量，以及打印设计的宽高
  LODOP.SET_PRINT_STYLE("Bold", 1);
  // if(form.headerMsg){
  //   LODOP.ADD_PRINT_TEXT(0, 0, pageWidth-lmargins-15*2, header, form.headerMsg);
  //   //LODOP.ADD_PRINT_TEXT(0, 0, 794, header, "页眉");
  //   LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  //   LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  //   LODOP.SET_PRINT_STYLEA(0,"Horient",2);
  // }
  LODOP.SET_PRINT_PAGESIZE(
    direction,
    pageWidth + "px",
    pageHeight + "px",
    "tableData"
  ); //设定纸张大小,内容横纵向1纵2横，宽度，高度，内容
  //头高度
  let theight = header + 5;
  let tfoot = footer + 10;
  LODOP.ADD_PRINT_HTM(
    theight,
    0,
    pageWidth - lmargins - 15 * 2,
    pageHeight - 15 * 2 - tfoot - theight - titleHeight,
    html
  );

  LODOP.SET_PRINT_STYLEA(0, "Horient", 2); //设置打印内容在页面水平居中显示
  LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1); //关联上一内容打印显示
  LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1); //连接显示表格的底部内容
  if (selected != "") {
    LODOP.ADD_PRINT_TEXT(
      pageHeight - 15 * 2 - tfoot,
      0,
      pageWidth - lmargins - 15 * 2,
      10,
      selected
    );
    LODOP.SET_PRINT_STYLEA(0, "ItemType", 2);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
    LODOP.SET_PRINT_STYLEA(0, "Vorient", 1);
  }
  LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW", true); //宽度溢出缩放
  LODOP.PRINT();
}

// export function getPxValueByUnit(val, unit) {
//   let convertHandler = {
//     in: convertInToPx,
//     mm: convertMmToPx
//   }
//   return convertHandler[unit] ? convertHandler[unit](val) : val;
// }
// export function convertInToPx(val) {
//   const dpi = 96;
//   return Math.floor(val * dpi);
// }
//
// export function convertMmToPx(val) {
//   const dpi = 96;
//   return Math.floor(val * 10 * dpi / 254);
// }
