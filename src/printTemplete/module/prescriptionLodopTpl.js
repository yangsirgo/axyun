import {compile} from '../utils';

const minimize = raw => raw.join().split('\n').map(i => i.trim()).join('')


export let prescriptionTpl = `


LODOP.PRINT_INITA("0mm",0,"147.64mm","210.08mm","");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A5");
LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);
LODOP.ADD_PRINT_TEXT(34,191,174,35,"orgName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(65,39,505,35,"hosName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(98,38,61,20,"费别：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(98,80,133,20,"settlemetnType");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(102,207,95,20,"医保电脑号：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(102,412,68,20,"门诊号：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(102,285,129,20,"miComputeNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(102,464,100,20,"visitCode");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(117,25,116,532,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,38,49,20,"姓名：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,77,120,20,"patientName");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,199,46,20,"性别：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,237,70,20,"patientGender");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,313,45,20,"年龄：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,351,83,20,"age");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,440,48,20,"体重：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(141,38,65,20,"开单科室:");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(141,199,73,20,"医嘱时间：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(141,98,100,20,"outpDeptName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(141,261,145,20,"diagTime");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(160,38,73,20,"联系方式：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(160,97,155,20,"relateNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_LINE("cHtmlLineTop",24,"cHtmlLineTop",531,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_TABLE("contentHtmlTop",24,508,400,"contentHtml");

LODOP.ADD_PRINT_TEXT(160,260,59,20,"证件号：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(160,310,208,20,"identificationNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(179,38,69,20,"联系地址：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(179,98,421,20,"relateAddress");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_HTM("diagHtmlTop",37,483,"diagHtmlHeight","diagnoseHtml");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_LINE(687,24,686,531,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(702,37,77,20,"开单医生：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(702,106,100,20,"doctorName");
LODOP.SET_PRINT_STYLEA(0,"Underline",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(702,381,63,20,"收费人：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(702,435,100,20,"chargpeople");
LODOP.SET_PRINT_STYLEA(0,"Underline",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(702,222,63,20,"总金额：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(702,273,105,20,"totalFee");
LODOP.SET_PRINT_STYLEA(0,"Underline",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,474,100,20,"weight");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

`;
// <% for(let i=0; i < data.length; i++) { %>
//   <div>
//     <% if (i == 0) {%>
//       <span>门诊诊断：</span>
//     <% } %>
//     <span>
//       <%= data[i].diagCat %>
//     </span>
//     <span>
//         <%= data[i].diagName %>
//     </span>
//   </div>
// <% } %>
// `overflow:hidden; 
let diagnoseTpl = minimize`
      <div style='font-size: 10pt; line-height:14pt; font-family:'宋体';'> 
        <div><%= data.eslipseWstr %></div> 
        <div><%= data.eslipseCstr %></div> 
      </div>
`;

// hideKongBai  一个处方达成很多页，
let contentTpl = minimize`

<table border= '0' width='500pt' cellspacing='0' style='font-size: 12pt; textAlign: left; margin:0; padding:0; table-layout:fixed;font-family: '宋体' !important;'>
<col style='width:auto'/>  
<col style='width:auto'/>  
<col style='width:auto'/>  
<col style='width:auto'/>  
<col style='width:auto'/>   
<col style='width:auto'/>   
<col style='width:auto'/>   
<col style='width:auto'/>   
<col style='width:60pt'/>     
<thead>
</thead> 
<TBODY> 
  <% for(let i=0; i < data.part3.length;i++) { %> 
    <tr >
      <td  align='left' colspan='4' height='40pt'><%= data.part3[0].PageNo * data.part3[0].PageSize + i + 1 %>、<%= data.part3[i].drugName %></td>
      <td align='left' colspan='2' nowrap='nowrap' height='40pt'><%= data.part3[i].frequencyName || "&nbsp;" %></td>
      <td align='left'  height='40pt' nowrap='nowrap'> <%= data.part3[i].day || "&nbsp;" %> 天</td>
      <td align='left'  height='40pt' nowrap='nowrap'><%= data.part3[i].quantity || "&nbsp;" %> </td>
      <td align='left' nowrap='nowrap' height='40pt'><%= Number(data.part3[i].price).toFixed(2) %> 元 </td>
    </tr>
    <% } %>
    <tr>
    <TD  colspan='9' align='center'  height='10pt'  > 以下处方空白 </TD>    
    </tr>
      </TBODY>
</table>
`;


export function complierTreat(data) { // 检查申请相关打印样式
  let htmlStr = "";
  let diagnoseStr = "";
  let bParse = eval(compile(contentTpl));
  htmlStr = bParse(data);
  let bParse1 = eval(compile(diagnoseTpl));
  if(data.diagList && data.diagList.length > 0) {
      // diagnoseStr = bParse1(data.diagList[0].diagList);
      diagnoseStr = bParse1(data.diagNameObj);
  }else{
      diagnoseStr = "";
  }
  console.log(htmlStr)
  return {htmlStr, diagnoseStr}
}


export function complier(data) { // 检查申请相关打印样式
    let htmlStr = "";
    let diagnoseStr = "";
    let bParse = eval(compile(contentTpl));
    htmlStr = bParse(data);
    let bParse1 = eval(compile(diagnoseTpl));
    if(data.diagList && data.diagList.length > 0) {
        diagnoseStr = bParse1(data.diagList[0].diagList);
    }else{
        diagnoseStr = "";
    }
    console.log(htmlStr)
    return {htmlStr, diagnoseStr}
}

export { diagnoseTpl };