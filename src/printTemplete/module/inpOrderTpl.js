let inpOrderTpl = `
LODOP.PRINT_INITA("0mm","0mm","147.64mm","210.08mm","");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A5");
LODOP.ADD_PRINT_TEXT(10,5,540,30,"项目医嘱执行单");
LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE(48,17,513,700,"list");`;

function inpOrderTplGenerateTable(data) {
  let commonStyle = "border:1px solid #000;";
  let trCommonStyle = "height:25px;text-align:center;font-size:14px;line-height:25px";
  let header = [{
      label: "家床号",
      prop: "houseBedCode",
      style: "width:100px;" + commonStyle + trCommonStyle
    },
    {
      label: "姓名",
      prop: "patientName",
      style: "width:80px;" + commonStyle + trCommonStyle
    },
    {
      label: "项目/单位",
      prop: "itemName",
      style: "width:170px;" + commonStyle + trCommonStyle
    },
    {
      label: "日次",
      prop: "frequencyName",
      style: "width:60px;" + commonStyle + trCommonStyle
    },
    {
      label: "数量",
      prop: "quantity",
      style: "width:60px;" + commonStyle + trCommonStyle
    },
    {
      label: "金额*次数",
      prop: "amount",
      style: "width:100px;" + commonStyle + trCommonStyle
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
      str += `<td style='${trCommonStyle}${commonStyle}'>${item[h.prop] || ''}</td>`;
    }
    str += "</tr>";
  }
  return str + "</table>";
}

function handlePrintData(resData) {
    let list = inpOrderTplGenerateTable(resData.list);
}

export {
    inpOrderTpl,
    inpOrderTplGenerateTable
  };
