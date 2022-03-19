let injectionTpl = `
LODOP.PRINT_INITA("0mm",0,"147.64mm","210.08mm","");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A5");
LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE",1);
LODOP.ADD_PRINT_TEXT("2.91mm","0mm","147.37mm","9.26mm","hosName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("11.38mm","0mm","147.37mm","9.26mm","orgName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("21.17mm","4.23mm","13.49mm","5.29mm","费别：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("21.17mm","12.17mm","29.1mm","5.29mm","chargeTypeName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("21.17mm","40.22mm","23.81mm","5.29mm","医保电脑号：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("21.17mm","96.57mm","17.99mm","5.29mm","门诊号：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("21.17mm","57.94mm","39.69mm","5.29mm","computerCardNumber");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("21.17mm","109.27mm","33.07mm","5.29mm","visitCode");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("25.19mm","3.44mm","24.9mm","138.38mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.19mm","4.23mm","12.96mm","5.29mm","姓名：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.19mm","13.49mm","37.84mm","5.29mm","patientName");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.19mm","51.33mm","12.17mm","5.29mm","性别：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.19mm","59.53mm","19.84mm","5.29mm","gender");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.19mm","79.11mm","11.91mm","5.29mm","年龄：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.19mm","86.78mm","19.31mm","5.29mm","age");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.19mm","105.57mm","12.7mm","5.29mm","体重：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("31.49mm","4.23mm","17.2mm","5.29mm","开单科室:");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("31.49mm","44.45mm","19.31mm","5.29mm","医嘱时间：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("31.49mm","18.79mm","26.19mm","5.29mm","deptName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("31.49mm","59.27mm","41.01mm","5.29mm","diagTime");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("31.49mm","100.81mm","19.58mm","5.29mm","免费处方：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("31.49mm","116.42mm","25.93mm","5.29mm","freeRecipe");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("36.51mm","4.23mm","19.31mm","5.29mm","联系方式：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("36.51mm","18.79mm","46.83mm","5.29mm","tel");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE("66.49mm","9.79mm","123.83mm","46.57mm","part3");
LODOP.ADD_PRINT_TEXT("36.51mm","64.56mm","15.61mm","5.29mm","证件号：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("36.51mm","76.2mm","65.62mm","5.29mm","idCardNumber");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("41.54mm","4.23mm","18.26mm","5.29mm","联系地址：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("41.54mm","18.79mm","123.3mm","9.26mm","addr");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_HTM("50.54mm","4.23mm","131.5mm","8.73mm","diagnosises");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("60.33mm","3.97mm","60.62mm","138.91mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("121.5mm","4.5mm","121.21mm","138.59mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("126.79mm","4.5mm","126.5mm","138.59mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("132.29mm","4.23mm","132mm","138.32mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("138.09mm","4.5mm","137.8mm","138.59mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("143.99mm","4.5mm","143.7mm","138.59mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("149.78mm","4.5mm","149.49mm","138.59mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("155.89mm","4.5mm","155.6mm","138.59mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("161.98mm","4.5mm","161.69mm","138.59mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("167.98mm","4.5mm","167.69mm","138.59mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("174.1mm","4.5mm","173.8mm","138.59mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("180.98mm","4.5mm",683,524,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("187.59mm","4.5mm","187.3mm","138.59mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("115.89mm","4.5mm","115.6mm","138.59mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(438,17,708,18,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(438,106,708,107,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(458,170,708,171,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(458,238,708,239,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(458,308,708,309,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(458,382,708,383,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(458,456,708,457,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(438,523,708,524,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(437,238,458,239,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(458,382,437,383,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(442,19,82,20,"医师签名");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(441,250,125,20,"发药者签名");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(464,19,85,20,"日期");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(484,17,85,20,"组号");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(503,18,89,20,"核对签名");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(527,19,85,20,"加药签名");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(547,19,85,20,"滴速");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(569,18,85,20,"执行时间");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(592,17,85,20,"执行签名");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(617,19,90,20,"巡视时间/签名");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(639,17,90,20,"巡视时间/签名");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(663,17,90,20,"巡视时间/签名");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(688,17,90,20,"巡视时间/签名");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(547,108,62,20,"滴/分");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(547,171,65,20,"滴/分");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(547,240,70,20,"滴/分");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(547,308,72,20,"滴/分");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(547,389,69,20,"滴/分");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(547,457,65,20,"滴/分");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(711,15,483,20,"温馨提示：为保证医疗安全，请每次注射前向护士出示");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(721,353,49,20,"日期：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(742,352,50,20,"医生：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(721,399,146,20,"printDate");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(742,402,144,20,"doctorName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(97,431,105,20,"bodyWeight");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(230,15,42,25,"R");
LODOP.SET_PRINT_STYLEA(0,"FontSize",17);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(257,18,26,20,"1");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
`
const minimize = raw => raw.join().split('\n').map(i => i.trim()).join('')
// 门诊诊断 模板
let diagNameTpl = minimize `
<table  align='left' border= '0'  style='text-align: left; font-size:12px;margin-top:-12px; margin-left:-8px;' >
  <% for(let i=0; i < rDiagList.length; i++) { %> 
    <tr>
      <th align='left' nowrap='nowrap'>
      <% if (i == 0) { %> 
      门诊诊断：
      <% } %> 
      </th>
      <th nowrap='nowrap' align='left'> <div style='width:390px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'><%= rDiagList[i].diagnosisType %></div></th>
    </tr>
  <% } %>
</table>
`;

import {
  compile
} from "@/components/adviceCommon/adviceUtils.js";

// 画诊断
function generateDialog(data) {
  let str = "<div>";
  for (let i in data) {
    str += `<div><span style='font-size:12px;'>${data[i].diagType}:</span>`;
    for (let j in data[i].diagList) {
      str += `<span style='font-size:12px;'>${data[i].diagList[j].diagnosisType}</span>`
    }
    str += `</div>`;
  }
  return str + "</div>";
}

function generateTable(data) {
  let commonStyle =
    "border:none";
  let trCommonStyle = "height:27px;text-align:center;font-size:13px;line-height:28px";
  let header = [{
      label: "",
      prop: "",
      style: "width:350px;margin-top:5px;overflow:hidden;" + commonStyle + trCommonStyle,
      children: [{
          prop: "first",
          children: [{
              label: "",
              prop: "selfProvide",
              style: "display:inline-block;" + trCommonStyle
            }, {
              label: "",
              prop: "itemName",
              style: "display:inline-block;margin-right:15px;" + trCommonStyle
            },
            {
              label: "",
              prop: "onceDosage",
              style: "display:inline-block;" + trCommonStyle
            }
          ]
        },
        {
          prop: "second",
          children: [{
              label: "用法：",
              prop: "useWay",
              style: "display:inline-block;margin-right:15px;" + trCommonStyle
            },
            {
              label: "",
              prop: "frequencyName",
              style: "display:inline-block;" + trCommonStyle
            },
            {
              label: " × ",
              labelAfter: "天",
              prop: "useDay",
              style: "display:inline-block;" + trCommonStyle
            }
          ]
        }
      ]
    },
    {
      label: "",
      prop: "",
      style: "width:100px;margin-top:5px;overflow:hidden;text-align:right;" + commonStyle + trCommonStyle,
      children: [{
          prop: "first",
          children: [{
              label: "总量：",
              prop: "quantity",
              style: "display:inline-block;" + trCommonStyle
            },
            {
              label: "",
              prop: "unit",
              style: "display:inline-block;margin-right:15px;" + trCommonStyle
            }
          ]
        },
        {
          prop: "second",
          children: [{
            label: "&nbsp;",
            prop: "",
            style: "display:inline-block;" + trCommonStyle
          }]
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
        str += "<td style=''>";
        for (let k = 0; k < h.children.length; k++) {
          const val = h.children[k];
          str += "<div style='" + val.style + "'>";
          if ((val['prop'] === 'second' && item['frequencyName']) || val['prop'] === 'first') {
            for (let key = 0; key < val.children.length; key++) {
              const vv = val.children[key];

              str += "<span style='" + vv.style + "'>" + vv.label + (item[vv.prop] || '&nbsp;') + (vv.labelAfter || '') + " </span>";
            }
          }
          str += "</div>";
        }
      } else {
        str += "<td style='" + h.style + "'>" + item[h.prop];
      }

      str += "</td>";
    }
    str += "</tr>";
  }
  // console.log(str + "</table>")
  return str + "</table>";
}

function handlePrintData(resData) {
  let printData = {
    orgName: "",
    hosName: "",
    recipeNo: "",
    chargeTypeName: "",
    computerCardNumber: "",
    visitCode: "",
    patientName: "",
    gender: "",
    age: "",
    bodyWeight: "",
    deptName: "",
    diagTime: "",
    freeRecipe: "",
    relateNum: "",
    idCardNumber: "",
    addr: "",
    drugBasicTypeString: "",
    doctorName: "",
    part3: "",
    diagnosises: ""
  };
  let obj = {
    ...printData,
    ...resData
  };
  obj.hosName = resData.hosName || JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团";
  obj.orgName = (resData.orgName || JSON.parse(localStorage.getItem("pamars")).hosName || "") + resData.orderTypeName;
  obj.patientName = obj.patientName.length > 8 ? obj.patientName.slice(0, 8) : obj.patientName;
  obj.diagTime = resData.visitTime;
  let part3 = generateTable(resData.part3);
  obj.part3 = part3;
  let rDiagList = resData.diagnosis[0].diagList;
  let aParse = eval(compile(diagNameTpl));
  obj.diagnosises = aParse(rDiagList);
  /* let diagnosises = generateDialog(resData.diagnosis);
  obj.diagnosises = diagnosises; */
  return obj;
}
export {
  injectionTpl,
  handlePrintData
};
