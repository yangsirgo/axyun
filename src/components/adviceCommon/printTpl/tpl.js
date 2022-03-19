const minimize = raw => raw.join().split('\n').map(i => i.trim()).join('')

// 处方 费别
let settlementTpl = minimize`
<div style='font-size:14px'>
  <font style='font-weight:bold;'>费别：</font>
  <font style='white-space:nowrap;'><%= settlemetnType %></font>
</div>
`;

// 门诊诊断 模板
let diagNameTpl = minimize`
<table  align='left' border= '0'  style='text-align: left; font-size:12px;margin-top:-12px; margin-left:-8px;' >
  <% for(let i=0; i < rDiagList.length; i++) { %> 
    <tr>
      <th align='left' nowrap='nowrap'>
      <% if (i == 0) { %> 
      门诊诊断：
      <% } %> 
      </th>
      <th  nowrap='nowrap' align='left'><%= rDiagList[i].diagCat %></th>
      <th nowrap='nowrap' align='left'> <div style='width:390px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'><%= rDiagList[i].diagName %></div></th>
    </tr>
  <% } %>
</table>
`;

// 中草药打印 诊断模板  西药打印
let diagnoseTplChm = minimize`
      <div style='font-size: 10pt; line-height:14pt; font-family:'宋体';'> 
        <div><%= diagNameObj.eslipseWstr %></div> 
        <div><%= diagNameObj.eslipseCstr %></div> 
      </div>
`;

// style='overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'
// margin-top:-10px; margin-left:-8px; padding:0;
// <div style=''></div>


// 家床诊断 模板
let hWContentTpl = minimize`
<table  align='left' border= '0' width='100%'  style='text-align: left; font-size:12px; margin-top:-10px; margin-left:-8px; padding:0;' >
  <% for(let i=0; i < rDiagList.length; i++) { %> 
    <tr>
      <th align='left' width='66'>
      <% if (i == 0) { %> 
       家床诊断
      <% } %> 
      </th>
      <th align='left' width='66'><%= rDiagList[i].diagCat %></th>
      <th align='left'><%= rDiagList[i].diagName %></th>
    </tr>
  <% } %>
</table>
`;

/* <TR>
<TD colspan='10'>

    <div style='font-size: 10pt;'>
      <div style='max-height: 56pt; overflow:hidden;'> 
      <% for(let i=0; i < data.diagList[0].diagList.length; i++) { %>
        <div>
            <% if (i == 0) {%>
                <span>门诊诊断:</span> 
            <% } %>
            <span  style='margin-left: 5pt'>
              <%= data.diagList[0].diagList[i].diagCat %>
            </span>
            <span  style='margin-left: 5pt'>
                <%= data.diagList[0].diagList[i].diagName %>
            </span>
        </div>
    <% } %>
      </div>
      <div style='position:relative; left: -16pt; width:380pt; border-top: 1px solid black; height: 5pt;  margin: 5pt 0 0 0;'></div> 
    </div> 
  </TD>
</TR> */

// 门诊西药 主体模板
let drugsTpl = minimize`
  <table border= '0' width='470pt' cellspacing='0' style='table-layout: fixed; font-size: 12pt; textAlign: left; margin:0; padding:0' >
  <col style='width:3%'/>  
  <col style='width:4%'/>  
  <col style='width:auto'/>  
  <col style='width:auto'/>  
  <col style='width:auto'/>  
  <col style='width:auto'/>  
  <col style='width:auto'/>  
  <col style='width:auto'/>  
  <col style='width:auto'/>  
  <col style='width:auto'/>  
  <thead>
</thead> 
  <TBODY>   
    <tr>
      <td align='left' width='1pt'>R:</td>
      <td align='left' width='1pt'></td>
      <td colspan='8'></td>
    </tr>
    <% for(let j=0; j < data.part3.length; j++) { %> 
      <tr>
        <td align='left'  height='30pt' width='1pt' nowrap='nowrap'><%= filterUndefined(data.part3[j].goupFlag) %></td>
        <td align='left'  height='30pt' width='1pt' nowrap='nowrap'><%= j+1 %></td>
        <td align='left' height='30pt' colspan='7'><font face='宋体'><%= filterUndefined(data.part3[j].selfProvide) + data.part3[j].basicDrug + data.part3[j].collectProvide + data.part3[j].drugName %> &nbsp;&nbsp;&nbsp; <%=  data.part3[j].spec %></font></td>
        <td align='right' height='30pt'  colspan='1' nowrap='nowrap'><%= data.part3[j].quantity + data.part3[j].unit %></td>
      </tr>
      <tr>
        <td align='left' height='30pt' colspan='2' width='2pt'></td>  
        <td align='left' height='30pt' colspan='3'  nowrap='nowrap'>用法：<%= data.part3[j].useWay %></td>
        <td align='left' height='30pt' colspan='3'  nowrap='nowrap'>单次剂量：<%= data.part3[j].onceDosage + data.part3[j].dosageUnit %></td>
        <td align='right' height='30pt' colspan='2'  nowrap='nowrap'>频次：<%= filterUndefined(data.part3[j].frequencyName) %></td>
      </tr>
    <% } %>
    <tr>
      <td align='center' colspan='10'><div style='height:1px'>以下处方空白<div></td>  
    </tr>
    </TBODY>  
  </table>
  `;

//   <tr>
//   <td align='center' colspan='10'></td>  
// </tr>
// <td align='left' width='70'></td>
// 门诊中草药 主体模板
// hideKongBai  一个处方达成很多页，
let chmContenTpl = minimize`

<table  border= '0' width='100%' style='font-size: 12pt;table-layout:fixed; textAlign: left; margin:0; padding:0' cellspacing='0' cellpadding='0'>
  <tr>
    <th style='width: 20px'>Rp:</th>
    <th  colspan='7' align='left'></th>
  </tr>
  <% for(let j=0; j < part3.length; j++) { %> 
  <tr>
    <td  height='25pt'></td>
    <td align='left'  height='25pt' style='white-space: nowrap;'><%= filterUndefined(part3[j].drugName1) %></td>
     <td align='right'  height='25pt'><%= filterUndefined(part3[j].quantity1) + filterUndefined(part3[j].unit1) %></td>
     <td align='left'  height='25pt' style='white-space:nowrap;'><%= filterUndefined(part3[j].useWay1) %></td>
     <td width='10' height='25pt'></td>
     <td align='left'  height='25pt' style='white-space: nowrap;'><%= filterUndefined(part3[j].drugName2) %></td>
     <td align='right'  height='25pt' ><%= filterUndefined(part3[j].quantity2) + filterUndefined(part3[j].unit2) %></td>
     <td align='left'  height='25pt' style='white-space:nowrap;'><%= filterUndefined(part3[j].useWay2) %></td>
  </tr>
  <% } %>
  <% if (!(part3[0] && part3[0].hideKongBai)) { %> 
  <tr>
    <td align='center' colspan='8' >
      以下处方空白
    </td>   
  </tr>
  <% } %> 
</table>

  `
  // <td></td>
  // <td colspan='3' style= 'border-bottom:3px double black;'>
  //   发药方式：配送到家
  // </td>
  // <td  colspan='2'  align='center' style= 'border-bottom:3px double black;'>
  //   代煎
  // </td>
  // <td></td>

  export {
    drugsTpl,
    chmContenTpl,
    hWContentTpl,
    settlementTpl,
    diagnoseTplChm,
    diagNameTpl
  }
//   let RecipeDetailsparse = eval(compile(RecipeDetailsTpl)); 
//   printData.RecipeDetails = RecipeDetailsparse(rDiagList);

//   let Diagnosisparse = eval(compile(drugsTpl));
//   printData.Diagnosis = Diagnosisparse(part3);

