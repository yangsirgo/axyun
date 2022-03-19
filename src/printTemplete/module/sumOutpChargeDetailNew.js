let sumOutpChargeDetailNewA4 = `
LODOP.PRINT_INITA(0,0,798,1116,"");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A4");
LODOP.ADD_PRINT_TEXT(7,8,781,25,"hosName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE(65,24,725,1003,"tableContent");
LODOP.ADD_PRINT_TEXT(32,12,90,22,"收费时间：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(32,87,505,22,"date");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
`;
let sumOutpChargeDetailNewA5 = `
LODOP.PRINT_INITA(0,0,794,558,"");
LODOP.SET_PRINT_PAGESIZE(2,0,0,"A5");
LODOP.ADD_PRINT_TEXT(7,8,781,25,"hosName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE(62,24,742,435,"tableContent");
LODOP.ADD_PRINT_TEXT(34,8,89,22,"收费日期：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(34,84,702,22,"date");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
`;

function generateTable(resData) {
  let data = resData.tableData;
  let commonStyle = "border:1px solid #000;";
  let trCommonStyle = "height:25px;text-align:center;font-size:14px;line-height:25px";
  let header = [];
  header = [{
    label: "序号",
    prop: "index",
    style: "width:30px;" + commonStyle + trCommonStyle
  }, {
    label: "患者姓名",
    prop: "patientName",
    style: "width:60px;" + commonStyle + trCommonStyle
  },
  {
    label: "项目名称",
    prop: "chargeItemName",
    style: "width:60px;" + commonStyle + trCommonStyle
  },
  {
    label: "单价",
    prop: "chargePrice",
    style: "width:50px;" + commonStyle + trCommonStyle
  },
  {
    label: "数量",
    prop: "chargeQuantity",
    style: "width:40px;" + commonStyle + trCommonStyle
  },
  {
    label: "金额",
    prop: "totalMoney",
    style: "width:50px;" + commonStyle + trCommonStyle
  },
  {
    label: "开单医生",
    prop: "doctorName",
    style: "width:60px;" + commonStyle + trCommonStyle
  },
  {
    label: "收费时间",
    prop: "chargeTime",
    style: "width:80px;" + commonStyle + trCommonStyle
  },
  {
    label: "开单日期",
    prop: "orderTime",
    style: "width:80px;" + commonStyle + trCommonStyle
  }
];
  let str = "<table border='1' style='width:100%;border-collapse: collapse;" + commonStyle + "'><thead><tr>";
  for (let i in header) {
    const item = header[i];
    str += `<td border='1' style='${item.style}'>${item.label}</td>`;
  }
  str += `</tr></thead>`;
  for (let i in data) {
    const item = data[i];
    str += "<tr>";
    for (let j in header) {
      const h = header[j];
      if (h.prop === 'index') {
        str += `<td style='${trCommonStyle}${commonStyle}'>${Number(i) + 1}</td>`;
      } else {
        str += `<td style='${trCommonStyle}${commonStyle}'>${item[h.prop] || ''}</td>`;
      }
    }
    str += "</tr>";
  }
  str += `<tr><td colspan='4'>数量合计：${resData.totalChargeQuantity || ''}</td><td colspan='5'>金额合计：${resData.totalChargeAmt || ''}</td></tr>`;
  return str + "</table>";
}

function handlePrintData(resData) {
  let printData = {
    hosName: "诊疗项目统计",
    date: "",
    tableContent: ""
  };
  let obj = {
    ...printData,
    ...resData
  };
  let tableContent = "";
  obj.hosName = (JSON.parse(localStorage.getItem("pamars")).hosName || "") + " 诊疗项目统计";
  tableContent = generateTable(obj);
  obj.tableContent = tableContent;
  return obj;
}
export {
  sumOutpChargeDetailNewA4,
  sumOutpChargeDetailNewA5,
  handlePrintData
}
