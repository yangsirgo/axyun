let inpAmtAll = `
LODOP.PRINT_INITA(0,0,798,1116,"");
LODOP.SET_PRINT_PAGESIZE(1, 0, 0,"A4");
LODOP.ADD_PRINT_TEXT(7,8,781,25,"orgName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(35,151,78,25,"开始日期：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(35,220,178,25,"startDate");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(35,401,81,25,"终止日期:");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(35,468,215,25,"stopDate");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,47,85,25,"病人姓名：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,122,175,26,"patientName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,295,75,25,"病人性质：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,367,155,26,"settlementTypeName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,524,61,26,"天数：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(60,582,209,25,"inpDays");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(85,47,85,25,"床号码：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(85,122,175,26,"inpCode");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(85,295,75,25,"费用累计：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(85,367,155,26,"totalAmount");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(85,524,76,26,"费用合计：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(85,593,198,25,"totalAmount");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE(120,27,726,950,"tableContent");
`;
let inpAmtAllA5 = `
LODOP.PRINT_INITA(0,0,558,794,"");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A5");
LODOP.ADD_PRINT_TEXT(7,8,532,25,"orgName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(30,14,78,25,"开始日期：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(30,77,188,25,"startDate");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(30,266,81,25,"终止日期：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(30,327,215,25,"stopDate");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(55,12,85,25,"病人姓名：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(55,76,187,26,"patientName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(55,266,75,25,"病人性质：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(55,329,210,26,"settlementTypeName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(104,12,56,26,"天数：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(104,50,214,25,"inpDays");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(80,12,85,25,"床号码：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(80,62,203,26,"inpCode");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(80,266,75,25,"费用累计：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(80,331,209,26,"totalAmount");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(103,266,76,26,"费用合计：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(103,329,218,25,"totalAmount");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE(130,21,510,595,"tableContent");
`;

function generateTable(data, flag, size) {
  let commonStyle = "border:1px solid #000;";
  let trCommonStyle = "height:25px;text-align:center;font-size:14px;line-height:25px";
  let header = [];
  if (flag == 0) {
    if (size === "A4") {
      header = [{
          label: "项目编码",
          prop: "siItemCode",
          style: "width:100px;" + commonStyle + trCommonStyle
        }, {
          label: "费用名称",
          prop: "itemName",
          style: "width:120px;" + commonStyle + trCommonStyle
        },
        {
          label: "费用数量",
          prop: "quantity",
          style: "width:80px;" + commonStyle + trCommonStyle
        },
        {
          label: "费用单价",
          prop: "price",
          style: "width:80px;" + commonStyle + trCommonStyle
        },
        {
          label: "费用金额",
          prop: "totalMoney",
          style: "width:100px;" + commonStyle + trCommonStyle
        },
        {
          label: "自负比例",
          prop: "",
          style: "width:100px;" + commonStyle + trCommonStyle
        },
        {
          label: "备注",
          prop: "",
          style: "width:100px;" + commonStyle + trCommonStyle
        }
      ];
    } else if (size === "A5") {
      header = [{
          label: "项目编码",
          prop: "siItemCode",
          style: "width:80px;" + commonStyle + trCommonStyle
        }, {
          label: "费用名称",
          prop: "itemName",
          style: "width:120px;" + commonStyle + trCommonStyle
        },
        {
          label: "费用数量",
          prop: "quantity",
          style: "width:70px;" + commonStyle + trCommonStyle
        },
        {
          label: "费用单价",
          prop: "price",
          style: "width:70px;" + commonStyle + trCommonStyle
        },
        {
          label: "费用金额",
          prop: "totalMoney",
          style: "width:70px;" + commonStyle + trCommonStyle
        },
        {
          label: "自负比例",
          prop: "",
          style: "width:70px;" + commonStyle + trCommonStyle
        },
        {
          label: "备注",
          prop: "",
          style: "width:50px;" + commonStyle + trCommonStyle
        }
      ];
    }
  } else {
    if (size === "A4") {
      header = [{
          label: "项目编码",
          prop: "siItemCode",
          style: "width:100px;" + commonStyle + trCommonStyle
        }, {
          label: "费用日期",
          prop: "chargeTime",
          style: "width:130px;" + commonStyle + trCommonStyle
        }, {
          label: "费用名称",
          prop: "itemName",
          style: commonStyle + trCommonStyle
        },
        {
          label: "费用数量",
          prop: "quantity",
          style: "width:70px;" + commonStyle + trCommonStyle
        },
        {
          label: "费用单价",
          prop: "price",
          style: "width:70px;" + commonStyle + trCommonStyle
        },
        {
          label: "费用金额",
          prop: "totalMoney",
          style: "width:70px;" + commonStyle + trCommonStyle
        },
        {
          label: "自负比例",
          prop: "",
          style: "width:70px;" + commonStyle + trCommonStyle
        },
        /*  {
                label: "医生",
                prop: "chargeUserName",
                style: "width:90px;" + commonStyle + trCommonStyle
              }, */
        {
          label: "备注",
          prop: "",
          style: "width:60px;" + commonStyle + trCommonStyle
        }
      ];
    } else if (size === "A5") {
      trCommonStyle = "height:18px;text-align:center;font-size:12px;line-height:18px";
      header = [{
          label: "项目编码",
          prop: "siItemCode",
          style: "width:80px;" + commonStyle + trCommonStyle
        }, {
          label: "费用日期",
          prop: "chargeTime",
          style: "width:130px;" + commonStyle + trCommonStyle
        }, {
          label: "费用名称",
          prop: "itemName",
          style: "width:100px;" + commonStyle + trCommonStyle
        },
        {
          label: "费用数量",
          prop: "quantity",
          style: "width:50px;" + commonStyle + trCommonStyle
        },
        {
          label: "费用单价",
          prop: "price",
          style: "width:50px;" + commonStyle + trCommonStyle
        },
        {
          label: "费用金额",
          prop: "totalMoney",
          style: "width:50px;" + commonStyle + trCommonStyle
        },
        {
          label: "自负比例",
          prop: "",
          style: "width:50px;" + commonStyle + trCommonStyle
        },
        /*  {
                label: "医生",
                prop: "chargeUserName",
                style: "width:50px;" + commonStyle + trCommonStyle
              }, */
        {
          label: "备注",
          prop: "",
          style: "width:40px;" + commonStyle + trCommonStyle
        }
      ];
    }
  }
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
      str += `<td style='${trCommonStyle}${commonStyle}'>${item[h.prop] || ''}</td>`;
    }
    str += "</tr>";
  }
  return str + "</table>";
}

function handlePrintData(resData, flag, size) {
  let printData = {
    orgName: "病人家床费用汇总",
    startDate: "",
    stopDate: "",
    patientName: "",
    settlementTypeName: "",
    inpDays: "",
    inpCode: "",
    totalAmount: "",
    tableContent: ""
  };
  let obj = {
    ...printData,
    ...resData
  };
  let tableContent = "";
  if (flag == 0) {
    obj.orgName = (JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团") + " 病人家床费用汇总";
    tableContent = generateTable(resData.inpChargeByClassVOS, flag, size);
  } else {
    obj.orgName = (JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团") + " 病人家床费用清单";
    tableContent = generateTable(resData.inpChargeByClassVOS, flag, size);
  }
  obj.tableContent = tableContent;
  return obj;
}
export {
  inpAmtAll,
  inpAmtAllA5,
  handlePrintData
};
