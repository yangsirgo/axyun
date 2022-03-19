let sumOutpChargeDetailNewA4 = `

LODOP.PRINT_INITA(0,0,798,1116,"");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A4");
LODOP.ADD_PRINT_TEXT(7,8,781,25,"hosName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE(89,13,725,1003,"tableContent");
LODOP.ADD_PRINT_TEXT(32,12,85,22,"boundNum");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(32,87,169,22,"outboundNum");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(58,13,73,22,"录入人：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(58,88,165,22,"entryPersonName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(58,257,100,22,"录入时间：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(58,358,180,22,"entryTime");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
`;
/*LODOP.ADD_PRINT_TEXT(32,259,100,22,"状态：");
LODOP.ADD_PRINT_TEXT(32,358,180,22,"接口获取暂时显示不出来");
LODOP.ADD_PRINT_TEXT(33,543,70,22,"入库/出库库房");
LODOP.ADD_PRINT_TEXT(33,614,173,22,"接口获取暂时显示不出来");*/
/*LODOP.ADD_PRINT_TEXT(58,543,70,22,"新加文本14");
LODOP.ADD_PRINT_TEXT(58,614,173,22,"新加文本15");*/

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
    label: "物资名称",
    prop: "goodsName",
    style: "width:60px;" + commonStyle + trCommonStyle
  },
  {
    label: "规格",
    prop: "spec",
    style: "width:40px;" + commonStyle + trCommonStyle
  },
  {
    label: "进价",
    prop: "purchasePrice",
    style: "width:40px;" + commonStyle + trCommonStyle
  },
    {
      label: "售价",
      prop: "price",
      style: "width:40px;" + commonStyle + trCommonStyle
    },
  {
    label: "批号",
    prop: "batchNum",
    style: "width:60px;" + commonStyle + trCommonStyle
  },
    {
      label: "有效期",
      prop: "expDate",
      style: "width:60px;" + commonStyle + trCommonStyle
    },

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
  //str += `<tr><td colspan='4'>数量合计：${resData.totalChargeQuantity || ''}</td><td colspan='5'>金额合计：${resData.totalChargeAmt || ''}</td></tr>`;
  return str + "</table>";
}

function handlePrintData(resData) {
  let printData = {
    date: "",
    tableContent: ""
  };
  let obj = {
    ...printData,
    ...resData
  };
  let tableContent = "";
  tableContent = generateTable(obj);
  obj.tableContent = tableContent;
  return obj;
}
export {
  sumOutpChargeDetailNewA4,
  handlePrintData
}
