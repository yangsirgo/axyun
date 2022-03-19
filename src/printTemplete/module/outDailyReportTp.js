import {
  deepClone
} from "@/utils/index";
import utils from "@/views/finance/reportForms/utils/utils.js";

let outDailyReportStr0 = `
LODOP.PRINT_INITA("0.26mm","0mm","147.64mm","210.08mm","");
LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE",1);
LODOP.ADD_PRINT_TEXT("9mm","54.77mm","46.04mm","9.26mm","罗湖医院集团(租户)");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("18.52mm","38.63mm","81.49mm","9.26mm","长岭社康中心 收费汇总");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("30.45mm","7.14mm","30.74mm","146.34mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("196.4mm","7.14mm","196.11mm","146.55mm",0,1);
LODOP.ADD_PRINT_LINE(116,26,742,27,0,1);
LODOP.ADD_PRINT_LINE(116,553,742,554,0,1);
LODOP.ADD_PRINT_LINE(142,156,198,157,0,1);
LODOP.ADD_PRINT_LINE("37.89mm","7.14mm","37.6mm","146.55mm",0,1);
LODOP.ADD_PRINT_LINE(336,352,390,353,0,1);
LODOP.ADD_PRINT_TEXT(116,225,136,20,"门诊收费员日报表");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_LINE("44.74mm","7.14mm","45.03mm","146.55mm",0,1);
LODOP.ADD_PRINT_TEXT(144,40,100,20,"收费员");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(143,167,371,20,"chargeUserName");
LODOP.ADD_PRINT_LINE("132.85mm","7.14mm","133.14mm","146.34mm",0,1);
LODOP.ADD_PRINT_LINE("125.44mm","7.14mm","125.73mm","146.34mm",0,1);
LODOP.ADD_PRINT_LINE("117.77mm","7.14mm","118.06mm","146.34mm",0,1);
LODOP.ADD_PRINT_LINE("110.62mm","7.14mm","110.91mm","146.34mm",0,1);
LODOP.ADD_PRINT_LINE("103.21mm","7.14mm","103.51mm","146.34mm",0,1);
LODOP.ADD_PRINT_LINE("96.6mm","7.14mm","96.89mm","146.34mm",0,1);
LODOP.ADD_PRINT_LINE("89.19mm","7.14mm","89.48mm","146.34mm",0,1);
LODOP.ADD_PRINT_LINE("51.88mm","6.88mm","52.18mm","146.08mm",0,1);
LODOP.ADD_PRINT_TEXT(175,39,100,20,"收款日期");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(175,168,366,20,"date");
LODOP.ADD_PRINT_HTM(213,38,500,110,"(超文本24的HTML代码内容)");
LODOP.ADD_PRINT_TEXT(341,45,100,20,"outTypes");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(343,209,115,20,"参保类别");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(341,381,148,20,"金额");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(393,49,100,20,"划价合计");
LODOP.ADD_PRINT_TEXT(393,177,367,20,"totalFeeAmt");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(420,45,105,20,"大写金额");
LODOP.ADD_PRINT_TEXT(425,213,256,20,"totalFeeAmtRMB");
LODOP.ADD_PRINT_LINE("147.66mm","7.14mm","147.96mm","146.34mm",0,1);
LODOP.ADD_PRINT_LINE("141.05mm","7.14mm","141.34mm","146.34mm",0,1);
LODOP.ADD_PRINT_LINE(445,431,642,432,0,1);
LODOP.ADD_PRINT_LINE(445,300,558,301,0,1);
LODOP.ADD_PRINT_TEXT(450,49,100,20,"现金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(451,185,100,20,"POS机");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(453,320,100,20,"支票");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(449,441,110,20,"货币误差");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(510,50,100,20,"微信支付");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(505,194,100,20,"支付宝支付");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(508,321,100,20,"医疗保险");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(511,441,100,20,"记账");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(477,56,100,20,"cash");
LODOP.ADD_PRINT_TEXT(478,185,100,20,"POS machine");
LODOP.ADD_PRINT_TEXT(479,319,100,20,"cheque");
LODOP.ADD_PRINT_TEXT(480,445,100,20,"currencyBalance");
LODOP.ADD_PRINT_TEXT(538,48,100,20,"wxpay");
LODOP.ADD_PRINT_TEXT(536,323,100,20,"totalSiAmt");
LODOP.ADD_PRINT_TEXT(538,187,100,20,"alipay");
LODOP.ADD_PRINT_TEXT(535,445,100,20,"keepAccountAmt");
LODOP.ADD_PRINT_LINE(643,139,741,140,0,1);
LODOP.ADD_PRINT_LINE("169.89mm","7.14mm","170.18mm","146.34mm",0,1);
LODOP.ADD_PRINT_LINE(338,168,558,169,0,1);
LODOP.ADD_PRINT_TEXT(569,43,374,64,"receiptNumList1");
LODOP.ADD_PRINT_TEXT(589,436,111,20,"共             张");
LODOP.ADD_PRINT_TEXT(674,34,100,20,"作废发票");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_LINE("180.23mm","36.99mm","180.53mm","146.29mm",0,1);
LODOP.ADD_PRINT_TEXT(651,195,45,20,"张数：");
LODOP.ADD_PRINT_TEXT(651,243,292,20,"obsoleteRecepitQuantity");
LODOP.ADD_PRINT_TEXT(589,454,63,20,"receiptQuantity");
LODOP.ADD_PRINT_TEXT(688,145,401,46,"receiptNumList2");
LODOP.ADD_PRINT_TEXT(754,30,50,20,"制表：");
LODOP.ADD_PRINT_TEXT(754,194,55,20,"审核：");
LODOP.ADD_PRINT_TEXT(754,364,70,20,"制表日期：");
LODOP.ADD_PRINT_TEXT(754,72,100,20,"Tabulation");
LODOP.ADD_PRINT_TEXT(754,237,100,20,"to examine");
LODOP.ADD_PRINT_TEXT(754,425,100,20,"date");
LODOP.ADD_PRINT_TEXT(367,36,126,20,"inHosType");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(368,177,165,20,"");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(367,361,183,20,"");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
`;
let outDailyReportStr = `
LODOP.PRINT_INITA("0.26mm","0mm","210.08mm","295.28mm","");
LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE",1);
LODOP.ADD_PRINT_TEXT(8,115,564,35,"orgName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",15);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(32,115,561,30,"hosName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",14);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_HTM(60,36,722,998,"tableCont");
LODOP.ADD_PRINT_TEXT(1060,40,257,30,"turnInOperatorName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(1060,300,180,30,"审核：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(1060,481,264,30,"turnInTime");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
`
let commonStyle = `text-align: center;font-size:12px;border-right:1px solid #6b6767;border-bottom:1px solid #6b6767;height:20px;line-height:20px;padding:0 2px;`;
let listInit = [{
    prop: "title",
    data: "",
    isTree: false,
    style: `${commonStyle}width:100%;height:20px;line-height:20px;font-size:14px;`
  },
  {
    prop: "chargeUserNameList",
    data: "",
    isTree: true,
    style: `height:auto;display: -webkit-box;border-bottom:1px solid #6b6767;`,
    list: [{
        prop: "chargeUserNameTitle",
        data: "收费员",
        isTree: false,
        style: `${commonStyle}height:auto;width: 30%;border-right:none;border-bottom:none;float:none;display: inline-block;vertical-align:middle;`
      },
      {
        prop: "chargeUserName",
        data: "",
        isTree: false,
        style: `${commonStyle}height:auto;width:70%;border-bottom:none;border-left:1px solid #6b6767;float:none;display: inline-block;vertical-align:middle;`
      }
    ]
  },
  {
    prop: "dateList",
    data: "",
    isTree: true,
    style: `clear: both;`,
    list: [{
        prop: "dateTitle",
        data: "收款日期",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "date",
        data: "",
        isTree: false,
        style: `${commonStyle}width: 70%;`
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    style: `clear: both;`,
    list: [{
        prop: "",
        data: "项目名称",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "",
        data: "金额",
        isTree: false,
        style: `${commonStyle}width: 20%;`
      },
      {
        prop: "",
        data: "项目名称",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "",
        data: "金额",
        isTree: false,
        style: `${commonStyle}width: 20%;`
      }
    ]
  },
  {
    prop: "turnInFeeFeeClassSumDTOList",
    data: "",
    isTree: true,
    style: `clear: both;`,
    list: [{
        prop: "feeClassName",
        data: "",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "totalFeeClassAmt",
        data: "",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 20%;`
      },
      {
        prop: "feeClassName1",
        data: "",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "totalFeeClassAmt1",
        data: "",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 20%;`
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    style: `clear: both;`,
    list: [{
        prop: "outTypes",
        data: "类别",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "",
        data: "参保类别",
        isTree: false,
        style: `${commonStyle}width: 40%;`
      },
      {
        prop: "",
        data: "金额",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      }
    ]
  },
  {
    prop: "turnInFeePersonClassSumDTOList",
    data: "",
    isTree: true,
    style: `clear: both;`,
    list: [{
        prop: "clinicName",
        data: "",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "finClassName",
        data: "",
        isTree: false,
        style: `${commonStyle}width: 40%;`
      },
      {
        prop: "totalAmt",
        data: "",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 30%;`
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    style: `clear: both;`,
    list: [{
        prop: "",
        data: "划价合计",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "totalFeeAmt",
        data: "",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 70%;`
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    style: `clear: both;`,
    list: [{
        prop: "",
        data: "大写金额",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "totalFeeAmtRMB",
        data: "",
        isTree: false,
        style: `${commonStyle}width: 70%;`
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    style: `clear: both;`,
    list: [{
        prop: "",
        data: "现金",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "",
        data: "POS机",
        isTree: false,
        style: `${commonStyle}width: 20%;`
      },
      {
        prop: "",
        data: "支票",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "",
        data: "货币误差",
        isTree: false,
        style: `${commonStyle}width: 20%;`
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    style: `clear: both;`,
    list: [{
        prop: "cash",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 20%;`
      },
      {
        prop: "cheque",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "currencyBalance",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 20%;`
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    style: `clear: both;`,
    list: [{
        prop: "",
        data: "微信支付",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "",
        data: "支付宝支付",
        isTree: false,
        style: `${commonStyle}width: 20%;`
      },
      {
        prop: "",
        data: "医疗保险",
        isTree: false,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "",
        data: "记账",
        isTree: false,
        style: `${commonStyle}width: 20%;`
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    style: `clear: both;`,
    list: [{
        prop: "wxpay",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "alipay",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 20%;`
      },
      {
        prop: "totalSiAmt",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 30%;`
      },
      {
        prop: "keepAccountAmt",
        data: "0.00",
        isTree: false,
        isMoney: true,
        style: `${commonStyle}width: 20%;`
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    style: `display: -webkit-box;border-right:1px solid #6b6767;border-bottom:1px solid #6b6767;`,
    list: [{
        prop: "receiptNumList1",
        data: "",
        isTree: false,
        style: `${commonStyle}height:auto;width: 80%;text-align:left;border-bottom:none;word-break: break-all;float:none;display: inline-block;vertical-align:middle;`
      },
      {
        prop: "receiptQuantity",
        data: "",
        isTree: false,
        style: `${commonStyle}height:auto;width: 20%;border-bottom:none;border-right:none;float:none;display: inline-block;vertical-align:middle;`
      }
    ]
  },
  {
    prop: "",
    data: "",
    isTree: true,
    style: `display: -webkit-box;vertical-align:middle;border-bottom:1px solid #6b6767;`,
    list: [{
        prop: "",
        data: "作废发票",
        isTree: false,
        style: `${commonStyle}height:auto;line-height:20px;width:30%;float:none;border-right:none;border-bottom:none;display: inline-block;vertical-align:middle;`
      },
      {
        prop: "",
        data: "",
        isTree: true,
        style: `${commonStyle}height:auto;width:70%;padding:0;display: inline-block;border-bottom:none;border-left:1px solid #6b6767;border-right:none;vertical-align:middle;`,
        list: [{
            prop: "obsoleteRecepitQuantity",
            data: "",
            isTree: false,
            style: `${commonStyle}height:20px;width:100%;border-right:1px solid #6b6767;`
          },
          {
            prop: "receiptNumList2",
            data: "",
            isTree: false,
            style: `${commonStyle}height:auto;line-height:20px;width: 100%;text-align: left;word-break: break-all;border-bottom:none;`
          }
        ]
      }
    ]
  }
];

function handlePrintData(obj) {
  let list = deepClone(listInit);
  let data = deepClone(obj);
  data.title = obj.opIpFlag == "0" ? "门诊收费员日报表" : "住院收费员日报表";
  data.outTypes = obj.opIpFlag == "0" ? "门诊类别" : "住院类别";
  data.date = `${data.settleStartTime || ""} ~ ${data.settleEndTime || ""}`;
  data.receiptQuantity = `共${data.receiptQuantity || 0}张`;
  data.obsoleteRecepitQuantity = `张数：${data.obsoleteRecepitQuantity ||
        0} 作废金额：${utils.outputmoney(data.totalObsoleteRecepitAmt || 0)}`;
  data.totalFeeAmtRMB = utils.changeRMB(data.totalFeeAmt);
  // 遍历支付
  for (let i in data.turnInSettleAmtSumDTOList) {
    data[data.turnInSettleAmtSumDTOList[i]["payTypeCode"]] =
      data.turnInSettleAmtSumDTOList[i].totalSettleAmt;
  }

  // 遍历发票
  let receiptNumList1 = [];
  let receiptNumList2 = [];
  for (let i in data.turnInReceiptSumDTOList) {
    if (data.turnInReceiptSumDTOList[i].statisticsReceiptType == "0") {
      receiptNumList1.push(data.turnInReceiptSumDTOList[i].receiptNum);
    } else if (
      data.turnInReceiptSumDTOList[i].statisticsReceiptType == "1" ||
      data.turnInReceiptSumDTOList[i].statisticsReceiptType == "2"
    ) {
      receiptNumList2.push(data.turnInReceiptSumDTOList[i].receiptNum);
    }
  }
  data.receiptNumList1 = "发票号：" + receiptNumList1.join(",");
  data.receiptNumList2 = receiptNumList2.join(",");

  // 遍历项目
  let arr = data.turnInFeeFeeClassSumDTOList;
  let newArr = [];
  for (let i in arr) {
    let obj = {};
    let a = Math.floor(parseFloat(i / 2));
    var b = parseInt(i % 2);
    if (b == 0) {
      obj = {
        ...arr[i]
      };
      newArr.push({
        ...obj,
        feeClassName1: "",
        totalFeeClassAmt1: ""
      });
    } else if (Number(i) - 1 >= -1) {
      for (let j in arr[i]) {
        newArr[a][j + "1"] = arr[i][j];
      }
    }
  }

  let exampleObj = list[4];
  let num = 4;
  for (let i in newArr) {
    let exObj = deepClone(exampleObj);
    // if(i < newArr.length - 1) {
    for (let j in exObj.list) {
      if (
        exObj.list[j].hasOwnProperty("isMoney") &&
        exObj.list[j].isMoney
      ) {
        exObj.list[j].data = newArr[i][exObj.list[j]["prop"]] === "" ? "" : utils.outputmoney(
          newArr[i][exObj.list[j]["prop"]]
        );
      } else {
        exObj.list[j].data = newArr[i][exObj.list[j]["prop"]];
      }
    }
    list.splice(num, 0, exObj);
    num++;
    // }
  }
  if (num > 4) {
    list.splice(num, 1);
  }

  // 遍历类别
  let turnInPersonList = data.turnInFeePersonClassSumDTOList;
  let num0 = 6 + newArr.length - 1;
  let exampleObj0 = list[num0];
  for (let i in turnInPersonList) {
    let exObj = deepClone(exampleObj0);
    // if(i < turnInPersonList.length - 1) {
    for (let j in exObj.list) {
      if (
        exObj.list[j].hasOwnProperty("isMoney") &&
        exObj.list[j].isMoney
      ) {
        exObj.list[j].data = utils.outputmoney(
          turnInPersonList[i][exObj.list[j]["prop"]]
        );
      } else {
        exObj.list[j].data = turnInPersonList[i][exObj.list[j]["prop"]];
      }
    }
    list.splice(num0, 0, exObj);
    num0++;
    // }
  }
  if (num0 > 6 + newArr.length - 1) {
    list.splice(num0, 1);
  }
  console.log("listlist", list)

  // 填充数据
  for (let i in list) {
    let item = list[i];
    if (item.prop && data.hasOwnProperty(item.prop)) {
      if (item.hasOwnProperty("isMoney") && item.isMoney) {
        item.data = utils.outputmoney(data[item.prop] || 0);
      } else {
        item.data = data[item.prop] || "";
      }
    }
    if (!item.hasOwnProperty("list")) {
      continue;
    }
    for (let j in item.list) {
      let value = item.list[j];
      if (value.prop && data.hasOwnProperty(value.prop)) {
        if (value.hasOwnProperty("isMoney") && value.isMoney) {
          value.data = utils.outputmoney(data[value.prop] || 0);
        } else {
          value.data = data[value.prop] || "";
        }
      }
      if (!value.hasOwnProperty("list")) {
        continue;
      }
      for (let k in value.list) {
        let vv = value.list[k];
        if (vv.prop && data.hasOwnProperty(vv.prop)) {
          if (vv.hasOwnProperty("isMoney") && vv.isMoney) {
            vv.data = utils.outputmoney(data[vv.prop] || 0);
          } else {
            vv.data = data[vv.prop] || "";
          }
        }
      }
    }
  }
  return list;
};

function generateTable(printData) {
  let list = handlePrintData(printData);
  let str = `<div style='width:100%;box-sizing:border-box;border-left: 1px solid #6b6767;border-top: 1px solid #6b6767;'>`;
  for (let a in list) {
    let item = list[a];
    if (!item.isTree) {
      str += `<span style='box-sizing:border-box;display:block;${item.style}'>${item.data || "&nbsp;"}</span>`;
    } else {
      str += `<div style='box-sizing:border-box;${item.style}'>`;
      for (let b in item.list) {
        let val = item.list[b];
        if (!val.isTree) {
          str += `<span style='box-sizing:border-box;display:block;float:left;${val.style}'>${val.data || "&nbsp;"}</span>`;
        } else {
          str += `<div style='box-sizing:border-box;display:block;${val.style}'>`;
          for (let c in val.list) {
            let v = val.list[c];
            str += `<div style='box-sizing:border-box;display:block;${v.style}'>${v.data || "&nbsp;"}</div>`;
          }
          str += `</div>`
          /* str += `<span style='box-sizing:border-box;display: flex;${val.style}'>`;
          for (let c in val.list) {
            let v = val.list[c];
            str += `<div style='box-sizing:border-box;display:block;${v.style}'>${v.data || "&nbsp;"}</div>`;
          }
          str += `</span>` */

        }
      }
      str += `</div>`
    }
  }
  let printEnd = `<div style='height:30px;margin-top:10px;font-size:14px;'><span style='width:260px;display:inline-block;'>制表：${printData.turnInOperatorName}</span><span style='width:180px;display:inline-block;'>审核：</span><span style='width:260px;display:inline-block;'>制表日期：${printData.turnInTime}</span></div>`;
  str = str + "</div>" + printEnd;
  return str;
}
export {
  outDailyReportStr,
  generateTable
};
