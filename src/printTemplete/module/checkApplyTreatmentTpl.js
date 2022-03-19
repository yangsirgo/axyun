let checkApplyTreatmentTpl = `
LODOP.PRINT_INITA("0mm",0,"147.64mm","210.08mm","");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A5");
LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE",1);
LODOP.ADD_PRINT_TEXT("3.7mm","1.59mm","144.73mm","9.26mm","orgName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("11.64mm","1.32mm","145.52mm","9.26mm","hosName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("20.11mm","7.14mm","13.49mm","5.29mm","费别：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("20.11mm","15.35mm","57.41mm","5.29mm","settlemetnType");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("20.11mm","72.76mm","16.67mm","5.29mm","电脑号：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("20.11mm","86.25mm","55.83mm","5.29mm","miComputeNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("24.1mm","3.7mm","23.81mm","137.8mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("25.14mm","7.14mm","12.96mm","5.29mm","姓名：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("25.14mm","16.14mm","23.81mm","5.29mm","patientName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("25.14mm","38.63mm","13.49mm","5.29mm","性别：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("25.14mm","47.36mm","21.17mm","5.29mm","patientGender");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("25.14mm","68mm","13.23mm","5.29mm","年龄：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("25.14mm","77.52mm","16.14mm","5.29mm","age");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("25.14mm","94.19mm","19.58mm","5.29mm","开单日期：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("29.9mm","7.14mm","20.11mm","5.29mm","门诊号码：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(113,"22.75mm","41.01mm","5.29mm","visitCode");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE("56.09mm","8.73mm","127.05mm","133.09mm","part3");
LODOP.ADD_PRINT_TEXT(113,"63.24mm","22.49mm","5.29mm","就诊科室：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(113,"79.11mm","50.8mm","5.29mm","outpDeptName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(132,27,49,20,"地址：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("34.93mm","17.2mm","77.79mm","6.88mm","relateAddress");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_HTM(161,"24.34mm","115.89mm","11.91mm","diagnosises");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("53.18mm","3.7mm","53.47mm","137.8mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(750,186,47,20,"金额：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(750,17,50,20,"医生：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(750,222,106,20,"totalFee");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(750,54,133,20,"doctorName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(95,414,125,20,"diagTime");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("43.39mm",27,"21.17mm","5.29mm","临床诊断：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(135,360,50,20,"电话：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(135,394,141,20,"relateNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(741,14,740,521,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(750,329,59,20,"收费员：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(750,374,178,20,"chargeName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
`
// 画诊断
function generateDialog(data) {
  let str = "<div>";
  for (let i in data) {
    str += `<div><span style='font-size:12px;'>${data[i].diagType}:</span>`;
    for (let j in data[i].diagList) {
      str += `<span style='font-size:12px;'>${data[i].diagList[j].diagCat}:${data[i].diagList[j].diagName}</span>`
    }
    str += `</div>`;
  }
  return str + "</div>";
}

function generateTable(data) {
  let commonStyle =
    "border:none;";
  let trCommonStyle = "height:25px;text-align:left;font-size:12px;line-height:25px;";
  /* let header = [
    {
      label: "",
      prop: "itemName",
      style: commonStyle + trCommonStyle + "display:flex;justify-content:space-between;",
      children: [
        {
          label: "",
          prop: "chargeItemName",
          style: commonStyle + trCommonStyle + "width:280px;overflow:hidden;"
        }, {
          label: "",
          labelAfter: "元",
          prop: "amt",
          style: commonStyle + trCommonStyle + "width:80px;text-align:right;"
        },
        {
          label: "",
          labelAfter: "项",
          prop: "quantity",
          style: commonStyle + trCommonStyle + "width:75px;text-align:right;"
        }
      ]
    }
  ];
  let str = "<table border='0' style='width:100%;border-collapse: collapse;" + commonStyle + "'>";
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    str += "<tr>";
    for (let j = 0; j < header.length; j++) {
      const h = header[j];
      if (h.hasOwnProperty("children")) {
        str += `<td>`;
        for (let p in data[i].chargeDetailList) {
          let pd = data[i].chargeDetailList[p];
          str += `<div style='${h.style}'><div style='width:25px;line-height:25px;'>${p == 0 ? item.no : '&nbsp;'}</div>`;
          for (let k in h.children) {
            let hk = h.children[k];
            if(hk.prop == "quantity") {
              str += `<div style='${hk.style}'>${pd[hk.prop] || '&nbsp;'}${pd['unit'] || '&nbsp;'}</div>`;
            } else {
              str += `<div style='${hk.style}'>${pd[hk.prop] || '&nbsp;'}${hk.labelAfter || '&nbsp;'}</div>`;
            }
          }
          str += `</div>`;
        }
        str += `</td>`;
      } else {
        str += `<td style='${h.style}'>${i}</td>`;
      }
    }
    str += "</tr>";
  } */
  let arr = [];
  for (let i in data) {
    for(let j in data[i].chargeDetailList) {
      let item = data[i].chargeDetailList[j];
      arr.push({
        ...data[i],
        ...item,
        no: j == 0 ? data[i].no : "",
        amts: (Number(data[i].quantity) * Number(item.amt)).toFixed(2),
        quantitys: (Number(data[i].quantity) * Number(item.quantity)).toFixed(2)
      })
    }
  }
  let header = [{
      label: "",
      prop: "no",
      style: commonStyle + trCommonStyle + "display:flex;justify-content:space-between;",
    }, {
      label: "",
      prop: "chargeItemName",
      style: commonStyle + trCommonStyle + "width:280px;overflow:hidden;"
    }, {
      label: "",
      labelAfter: "元",
      prop: "amts",
      style: commonStyle + trCommonStyle + "width:80px;text-align:right;"
    },
    {
      label: "",
      labelAfter: "",
      prop: "quantitys",
      style: commonStyle + trCommonStyle + "width:75px;text-align:right;"
    }
  ];
  let str = "<table border='0' style='width:100%;border-collapse: collapse;" + commonStyle + "'>";
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    str += "<tr>";
    for (let j = 0; j < header.length; j++) {
      const h = header[j];
      let value = h.prop === "quantitys" ? (item[h.prop] || '&nbsp;') + item["unit"] : (item[h.prop] || "&nbsp;") + (h.labelAfter || '');
      str += `<td style='${h.style}'>${value}</td>`;
    }
    str += "</tr>";
  }
  // console.log("wwwwwwwwwwwwwwwwwwwwwwwwww", str += "</tr></table>")
  return str + "</table>";
}

function handlePrintData(resData) {
  let printData = {
    orgName: "",
    hosName: "",
    settlemetnType: "",
    miComputeNum: "",
    patientName: "",
    patientGender: "",
    age: "",
    visitCode: "",
    outpDeptName: "",
    relateAddress: "",
    totalFee: "",
    doctorName: "",
    diagTime: "",
    relateNum: "",
    chargeName: "",
    part3: "",
    diagnosises: ""
  };
  let obj = {
    ...printData,
    ...resData
  };
  obj.orgName = JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团";
  obj.hosName = (JSON.parse(localStorage.getItem("pamars")).hosName || "") + "门诊治疗单";
  let part3 = generateTable(resData.part3);
  obj.part3 = part3;
  let diagnosises = generateDialog(resData.diagList);
  obj.diagnosises = diagnosises;
  return obj;
}
export {
  checkApplyTreatmentTpl,
  handlePrintData
};
