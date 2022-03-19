import { getLodop } from '@/utils/LodopFuncs';
import { reRatas } from '@/utils/reData';
import { selReportByName } from '@/api/admin/print/print';

var LODOP;
let indexRepeat = 0;
// 获取本机主网卡MAC地址
export function getMacLoaction(obj) {
  return new Promise((reslove, reject) => {
    try {
      //从 localStorage 取 currentMacNo
      let localMacNo = localStorage.getItem("currentMacNo");
      if (localMacNo) {
        // console.log("取存储的Mac地址：：：：", localMacNo);
        reslove(localMacNo);
        return;
      }
      
      LODOP = getLodop();

      if (LODOP.CVERSION) CLODOP.On_Return = function (TaskID, Value) {
        if (obj) { obj.value = Value; } 
        // console.log("第一次取设备的currentMacNo 111", Value);
        reslove(Value)
      };
      var strResult = LODOP.GET_SYSTEM_INFO("NetworkAdapter.1.PhysicalAddress");
      if (!LODOP.CVERSION) {
        // console.log("第一次取设备的currentMacNo 222", strResult);
        // reslove(strResult);
      }
    } catch (err) {
      reject(err)
    }
  })

}
// 获取ip地址
export function getIp(strINFOType,oResultOB) {
  return new Promise((reslove, reject) => {
    try {
      LODOP = getLodop();
       if (LODOP.CVERSION) CLODOP.On_Return=function(TaskID,Value){
         if (oResultOB) {oResultOB.value=Value;}
         reslove(Value)
        }; 
       var strResult=LODOP.GET_SYSTEM_INFO(strINFOType);
      // if (!LODOP.CVERSION) {
      //   reslove(strResult);
      // } else {
      //   reject()
      // }
    } catch (err) {
      reject(err)
    }
  })

}

export async function onPrint(dataR, reportName) {
  try {

    let qqq = await dealPrintData(dataR, reportName)
    // console.log("~~~~~~~~~~~~~~ ",qqq.str)
    print(qqq.str, qqq.report, reportName)
    return true

  } catch (err) {

    alert(err)
    return false

  }
}

export async function onPreview(dataR, reportName) {
  try {

    let qqq = await dealPrintData(dataR, reportName)
    preview(qqq.str, qqq.report, reportName)
    return true;

  } catch (err) {
    alert(err)
    return false

  }
}

export async function onPreviewData(dataR, reportName) {
  // console.log("dataR$$$$$", dataR, reportName)
  let data = [];
  let form = {};
  for (let i = 0; i < dataR.length; i++) {
    let qqq = await dealPrintData(dataR[i], reportName);
    data.push(qqq.str)
    if (i == 0) {
      form = qqq.report;
    }
  }

  onPreviewRepeat(data, form, reportName);
}



export function onPreviewRepeat(domStr, form, title) {
  try {
    LODOP = getLodop();
    for(let i=0;i<domStr.length;i++){
      createOneFormPage(domStr[i],form,title,LODOP,"isPreview")
    }
    LODOP.PREVIEW();
  } catch (error) {
    alert("请本地安装C-Lodop,刷新后,在使用打印功能");
  }
}


export async function onPreviewStr(dataR, reportName) {
  try {
    let qqq = await dealPrintData(dataR, reportName)
    return Promise.resolve(qqq);

  } catch (err) {
    alert(err)
    return false
  }
}

export function dealPrintData(dataR, reportName) {
  let _r = selReportByName(reportName).then(res => {
    let report = res.data;
    // console.log(report);
    if (res.code === 1) {
      dataR.domStr = report.editorContent;
      //为表头添加<thead>用于打印出现分页时每页显示表头
      if (report.tpicked) {
        dataR.tpicked = report.tpicked;
      } else {
        dataR.tpicked = "One"
      }
      let str = reRatas(dataR);
      let soMap = new Object();
      soMap["str"] = str;
      soMap["report"] = report;
      // console.log("22fffffffffffffffffffffff22");
      // console.log("ffffff",soMap);

      // func(soMap,reportName)
      return soMap

    } else {
      throw new Error("报表名称不存在");

    }

  }).catch(function (error) {
    console.log(error);
    throw error;
  })

  return _r
}

export function print(domStr, form, title) {
  try {
    LODOP = getLodop();
    createOneFormPage(domStr, form, title, LODOP);
    LODOP.PRINT();
    // LODOP.PRINT_DESIGN();
  } catch (err) {
    alert("请本地安装C-Lodop,刷新后,在使用打印功能，")
  }
}

export function preview(domStr, form, title) {
  try {
    LODOP = getLodop();
    createOneFormPage(domStr, form, title, LODOP);
    LODOP.PREVIEW();
  } catch (error) {
    alert("请本地安装C-Lodop，刷新后,在使用打印功能")
  }

}

export function createOneFormPage(domStr, form, title, LODOP, isPreview) {

  //LODOP.PRINT_INIT("订货单");
  let tmargins = 10;
  let lmargins = 0;
  let pageWidth = 794;
  let pageHeight = 1123;
  let header = 10;
  let footer = 10;
  let selected = ""
  // let titleHeight = 88;
  let titleHeight = 0;
  let picked = form.picked;
  let direction = 0;
  let tpicked = form.tpicked;
  let unit = form.selectunit;


  //判断纸张内容的方向
  if (picked == "Two") {
    direction = 2;
  } else {
    direction = 1;
  }
  //判断是否输入上边距
  if (form.tmargins) {
    tmargins = getPxValueByUnit(form.tmargins, unit);
  }
  //判断是否输入左边距
  if (form.lmargins) {
    lmargins = getPxValueByUnit(form.lmargins, unit);
  }
  //判断是否有页眉高度
  if (form.header) {
    header = getPxValueByUnit(form.header, unit);
  }
  //判断是否有页脚高度
  if (form.footer) {
    footer = getPxValueByUnit(form.footer, unit);
  }
  //判断是否输入纸张的宽度
  if (form.pageWidth) {
    pageWidth = getPxValueByUnit(form.pageWidth, unit);
  }
  //判断是否输入纸张的高度
  if (form.pageHeight) {
    pageHeight = getPxValueByUnit(form.pageHeight, unit);
  }
  //判断页脚的显示方式
  if (form.selected) {
    selected = form.selected;
  }
  //判断是否输入标题的高度
  if (form.theight) {
    titleHeight = getPxValueByUnit(form.theight, unit);
  }

  let pageNewWidth = "";
  let pageNewHeight = "";
  if (direction == '2') {
    pageNewHeight = pageWidth;
    pageNewWidth = pageHeight;
  } else {
    pageNewHeight = pageHeight;
    pageNewWidth = pageWidth;
  }

  // LODOP.PRINT_INITA(tmargins, lmargins, pageWidth, pageHeight, title);  //设定偏移量，以及打印设计的宽高
  // LODOP.SET_PRINT_STYLE("FontSize", 18);
  LODOP.SET_PRINT_STYLE("Bold", 1);
  if (form.headerMsg) {
    LODOP.ADD_PRINT_TEXT(tmargins, lmargins, pageNewWidth - lmargins - 15 * 2, header, form.headerMsg);
    //LODOP.ADD_PRINT_TEXT(0, 0, 794, header, "页眉");
    LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
  }

  LODOP.SET_PRINT_PAGESIZE(direction, pageNewWidth + "px", pageNewHeight + "px", 'tableData');      //设定纸张大小,内容横纵向1纵2横，宽度，高度，内容

  let dom = document.createElement("div");
  dom.innerHTML = domStr;

  domStr = dom.innerHTML;
  let tables = dom.getElementsByTagName("table");
  let tableStr = "";
  for (let i = 0; i < tables.length; i++) {
    if (tables[i].getAttribute("id")) {
      let comtable = document.createElement("div");
      let clonetable = tables[i].cloneNode(true);
      comtable.appendChild(clonetable);
      tableStr = comtable.innerHTML;
    }
  }
  
  // console.log('tablestableStrtableStr', tableStr)

  let preStr = domStr.substring(0, domStr.indexOf(tableStr));

  let tabStr = tableStr;

  let sufStr = domStr.substring(domStr.indexOf(tableStr) + tableStr.length);
  //头高度
  let theight = parseInt(header) + 5
  let tfoot = parseInt(footer) + 10
  LODOP.ADD_PRINT_HTM(theight, lmargins, pageNewWidth - lmargins - 15 * 2, pageNewHeight - tfoot - theight - titleHeight,
    preStr);
  LODOP.SET_PRINT_STYLEA(0, "Horient", 2);//设置打印内容在页面水平居中显示

  LODOP.ADD_PRINT_TABLE(0, lmargins, pageNewWidth - lmargins - 15 * 2, pageNewHeight - (15 * 2) - theight - tfoot,
    tabStr);
  LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
  //LODOP.SET_PRINT_STYLEA(0,"Vorient",0);
  LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1); //关联上一内容打印显示

  LODOP.ADD_PRINT_HTM(parseFloat(tmargins) + parseFloat(header), lmargins, pageNewWidth - lmargins - 15 * 2, 39, sufStr);
  LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1); //连接显示表格的底部内容

  //LODOP.ADD_PRINT_TEXT(pageNewHeight-15-footer, 0, 794, 10, "第#页/共&页");
  if (selected != "") {
    LODOP.ADD_PRINT_TEXT(pageNewHeight - tfoot, lmargins, pageNewWidth - lmargins - 15 * 2, tfoot, selected);
    LODOP.SET_PRINT_STYLEA(0, "ItemType", 2);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
    // LODOP.SET_PRINT_STYLEA(0, "Vorient", 1);
  }

  //LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);//设置以纸张边缘为基点
  // LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW", true);//宽度溢出缩放
  if (form.setPrinterIndex) {
    LODOP.SET_PRINTER_INDEX(form.setPrinterIndex);//指定某虚拟打印机`
    LODOP.SET_PRINT_MODE("RESELECT_PRINTER", true); //允许重选打印机 true
  }
  if (isPreview == 'isPreview') {
    LODOP.NewPage();
  }
}

export function getPxValueByUnit(val, unit) {
  let convertHandler = {
    in: convertInToPx,
    mm: convertMmToPx
  }
  return convertHandler[unit] ? convertHandler[unit](val) : val;
}

export function convertInToPx(val) {
  const dpi = 96;
  return Math.floor(val * dpi);
}

export function convertMmToPx(val) {
  const dpi = 96;
  return Math.floor(val * 10 * dpi / 254);
}
