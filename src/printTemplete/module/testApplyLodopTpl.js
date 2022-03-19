import {compile} from '../utils';

const minimize = raw => raw.join().split('\n').map(i => i.trim()).join('')

export let applyPrintTpl = `
LODOP.PRINT_INITA("0mm",-14,"148.01mm","210mm","");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A5");
LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE",1);
LODOP.ADD_PRINT_TEXT("7.94mm","25.93mm","73.03mm","9.26mm","orgName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("17.2mm","3.18mm","135.47mm","9.26mm","hosName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","10.05mm","13.49mm","5.29mm","费别：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","18.26mm","27.78mm","5.29mm","settlemetnType");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","45.77mm","25.14mm","5.29mm","医保电脑号：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","94.46mm","21.96mm","5.29mm","患者编号：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","62.71mm","35.19mm","5.29mm","miComputeNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","109.01mm","35.72mm","5.29mm","patientNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("30.98mm","6.61mm","30.69mm","140.71mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","10.05mm","12.7mm","5.29mm","姓名：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","45.77mm","15.35mm","5.29mm","性别：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","54.24mm","39.42mm","5.29mm","patientGender");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","93.93mm","11.91mm","5.29mm","年龄：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","102.39mm","42.6mm","5.29mm","age");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","10.05mm","17.2mm","5.29mm","科室:");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","45.77mm","22.49mm","5.29mm","医师：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","18.52mm","27.52mm","5.29mm","outpDeptName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("48.42mm","10.05mm","19.31mm","5.29mm","联系方式：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("48.42mm","24.87mm","120.39mm","5.29mm","relateNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","93.93mm","20.11mm","5.29mm","开嘱时间：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","108.74mm","37.04mm","5.29mm","diagTime");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.86mm","10.05mm","28.84mm","5.29mm","联系地址：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.86mm","24.87mm","120.91mm","5.29mm","relateAddress");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_HTM("diagHtmlTop","9.35mm","130.7mm","diagHtmlHeight","diagnoseHtml");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_LINE("cHtmlLineTop","6.61mm","cHtmlLineTop","140.71mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("187.88mm","6.35mm","187.59mm","140.44mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("180.71mm","70.91mm","25.4mm","5.29mm","申请医师签名：");
LODOP.SET_PRINT_STYLEA(0,"PageIndex","last");
LODOP.ADD_PRINT_TEXT("180.71mm",348,207,20,"doctorName");
LODOP.SET_PRINT_STYLEA(0,"PageIndex","last");
LODOP.ADD_PRINT_TEXT("189.44mm","10.05mm","21.17mm","6.88mm","注意事项：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_BARCODE(19,379,163,45,"128B","applyNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(141,204,151,20,"doctorName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,69,106,20,"patientName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE("contentHtmlTop",34,497,406,"contentHtml");
LODOP.ADD_PRINT_RECT(30,31,68,30,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(36,33,63,20,"门诊");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("189.44mm","28.97mm",417,"6.88mm","note");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(738,36,84,20,"采血人签名：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(738,328,69,20,"合计金额：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(738,387,149,20,"totalFee");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);



`;


export let testTpl = `
LODOP.PRINT_INITA("0mm","30mm","148.01mm","210mm","");
LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE",1);
LODOP.ADD_PRINT_TEXT("7.94mm","42.86mm","46.04mm","9.26mm","罗湖医院集团");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("17.2mm","7.14mm","106.1mm","9.26mm","长岭街道社区健康服务中心 检验申请单");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","10.05mm","13.49mm","5.29mm","费别：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","20.9mm","25.14mm","5.29mm","settlemetnType");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","45.77mm","25.14mm","5.29mm","医保电脑号：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","93.93mm","21.96mm","5.29mm","患者编号：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","66.41mm","25.93mm","5.29mm","miComputeNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.72mm","112.98mm","26.46mm","5.29mm","patientNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("30.98mm","6.61mm","30.69mm","140.71mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","10.05mm","12.7mm","5.29mm","姓名：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","43.39mm","15.35mm","5.29mm","性别：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","53.45mm","28.05mm","5.29mm","patientGender");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","91.02mm","11.91mm","5.29mm","年龄：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","99.48mm","21.96mm","5.29mm","age");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","10.05mm","17.2mm","5.29mm","科室:");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","43.39mm","22.49mm","5.29mm","医师：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","19.58mm","20.9mm","5.29mm","outpDeptName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.6mm","91.02mm","19.31mm","5.29mm","联系方式：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.6mm","105.04mm","41.01mm","5.29mm","relateNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","91.28mm","20.11mm","5.29mm","开嘱时间：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","107.16mm","35.72mm","5.29mm","diagTime");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("43.39mm","10.05mm","28.84mm","5.29mm","联系地址：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("43.39mm","26.72mm","60.59mm","5.29mm","relateAddress");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("51.06mm","10.05mm","18.52mm","5.03mm","临床诊断：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_HTML("53.18mm","42.86mm","97.37mm","10.85mm","diagnoseHtml");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("68.79mm","6.61mm","69.08mm","140.71mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("187.88mm","6.35mm","187.59mm","140.44mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("180.71mm","93.13mm","32.54mm","5.29mm","申请医师签名：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("189.44mm","10.05mm","21.17mm","6.88mm","注意事项：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_BARCODE(19,379,163,45,"Code39","applyNum");
LODOP.ADD_PRINT_TEXT(141,200,141,20,"doctorName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,73,81,20,"patientName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TABLE(282,34,497,355,"contentHtml");
LODOP.ADD_PRINT_RECT(30,31,68,30,0,1);
LODOP.ADD_PRINT_TEXT(36,33,63,20,"门诊");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
`

// LODOP.PRINT_INITA("0mm","30mm","148mm","210mm","");
// LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE",1);
// LODOP.ADD_PRINT_TEXT("7.94mm","42.86mm","46.04mm","9.26mm","罗湖医院集团");
// LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
// LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
// LODOP.SET_PRINT_STYLEA(0,"Bold",1);
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("17.2mm","7.14mm","106.1mm","9.26mm","长岭街道社区健康服务中心 检验申请单");
// LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
// LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
// LODOP.SET_PRINT_STYLEA(0,"Bold",1);
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("26.99mm","10.05mm","13.49mm","5.29mm","费别：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("26.99mm","20.9mm","25.14mm","5.29mm","settlemetnType");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("26.99mm","45.77mm","25.14mm","5.29mm","医保电脑号：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("26.99mm","93.93mm","21.96mm","5.29mm","患者编号：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("26.99mm","66.41mm","25.93mm","5.29mm","miComputeNum");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("26.72mm","112.98mm","26.46mm","5.29mm","patientNum");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_LINE("30.98mm","6.61mm","30.69mm","140.71mm",0,1);
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("32.01mm","10.05mm","12.7mm","5.29mm","姓名：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("32.01mm","49.48mm","12.17mm","5.29mm","性别：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("32.01mm","59.53mm","18.52mm","5.29mm","patientGender");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("32.01mm","88.64mm","11.91mm","5.29mm","年龄：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("32.01mm","98.69mm","21.96mm","5.29mm","age");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("37.31mm","10.05mm","17.2mm","5.29mm","科室:");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("37.31mm","49.48mm","19.31mm","5.29mm","医师：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("37.31mm","23.55mm","23.55mm","5.29mm","outpDeptName");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("42.6mm","88.64mm","19.31mm","5.29mm","联系方式：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("42.6mm","104.25mm","41.01mm","5.29mm","relateNum");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("37.31mm","88.64mm","20.11mm","5.29mm","开嘱时间：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("37.31mm","106.1mm","35.72mm","5.29mm","diagTime");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("42.6mm","10.05mm","28.84mm","5.29mm","联系地址：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("42.6mm","25.66mm","53.71mm","5.29mm","relateAddress");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT("48.15mm","10.05mm","18.52mm","5.29mm","临床诊断：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_HTML("48.95mm","31.75mm","108.48mm","14.02mm","diagnoseHtml");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_LINE("62.71mm","6.61mm","63mm","140.71mm",0,1);
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_LINE("187.88mm","6.35mm","187.59mm","140.44mm",0,1);
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.SET_PRINT_STYLEA(0,"Vorient",1);
// LODOP.ADD_PRINT_TEXT("180.71mm","93.13mm","32.54mm","5.29mm","申请医师签名：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.SET_PRINT_STYLEA(0,"Vorient",1);
// LODOP.ADD_PRINT_TEXT("189.44mm","10.05mm","21.17mm","6.88mm","注意事项：");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.SET_PRINT_STYLEA(0,"Vorient",1);
// LODOP.ADD_PRINT_BARCODE(20,421,100,45,"Code39","applyNum");
// LODOP.ADD_PRINT_TEXT(140,223,90,20,"doctorName");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TEXT(121,73,100,20,"patientName");
// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
// LODOP.ADD_PRINT_TABLE(255,34,497,382,"contentHtml");
// LODOP.ADD_PRINT_RECT(30,31,68,30,0,1);
// LODOP.ADD_PRINT_TEXT(36,33,63,20,"门诊");
// LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
// LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

// let diagnoseTpl = minimize`
// <div style='margin-top:-2px;'> 
//     <% for(let i=0; i < data.length; i++) { %>
//         <div style='font-size: 12px;line-height: 18px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'>
//             <span>
//                 <%= data[i].diagCat %>
//             </span>
//             <span style='margin-left: 20px'>
//                 <%= data[i].diagName %>
//             </span>
//         </div>
//     <% } %>
//     </div>
// `

// 新的 诊断 显示 
let diagnoseTpl = minimize`
      <div style='font-size: 10pt; line-height:14pt; font-family:'宋体';'> 
        <div><%= data.eslipseWstr %></div> 
        <div><%= data.eslipseCstr %></div> 
      </div>
`;

let contentTpl = minimize`
    <table style='line-height: 28px;font-size: 12px;width: 100%;' border='0'>
        <thead>
            <tr>
                <th align='left'></th>
                <th align='left'>项目名称</th>
                <th align='left' width='100'>标本类型</th>
                <th align='left' width='50'>数量</th>
                <th align='left' width='50'>金额</th>
            </tr>
        </thead>
        <% for(let j=0; j < data.length;j++) { %>
            <% for(let i=0; i < data[j].part3.length;i++) { %>
               <tr>
                    <td><%= data[j].part3[i].no %></td>
                    <td>
                        <% if(data[j].part3[i].urgent!=='') {%>
                            <span style='color: red;'>急</span>
                        <% } %>
                        <%= data[j].part3[i].itemName %>
                    </td>
                    <td>
                        <%= data[j].part3[i].specimenType || '--' %>
                    </td>
                    <td>
                        <%= data[j].part3[i].quantity %>
                    </td>
                    <td>
                        <%= Number(data[j].part3[i].amt).toFixed(2) %>
                    </td>
               </tr>
            <% } %>
        <% } %>
    </table>
`

export function complier(data = {}, cntData = []) { // 检查申请相关打印样式
    let htmlStr = "";
    let diagnoseStr = "";
    let bParse = eval(compile(contentTpl));
    htmlStr = bParse(cntData);

    console.log(data, data.diagList, data.diagList[0], data.diagList[0].length);
    if(data.diagList && data.diagList.length > 0) {
        let bParse1 = eval(compile(diagnoseTpl));
        // diagnoseStr = bParse1(data.diagList[0].diagList);
        diagnoseStr = bParse1(data.diagNameObj);
    }else{
        diagnoseStr = "";
    }
    // diagnoseStr = data[0].diagList.length > 0 && bParse1(data[0].diagList[0].diagList)
    
    console.log(htmlStr)
    return {htmlStr, diagnoseStr}
}