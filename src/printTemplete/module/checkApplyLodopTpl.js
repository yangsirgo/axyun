import {compile} from '../utils';

const minimize = raw => raw.join().split('\n').map(i => i.trim()).join('')

export let checkTplNew = `
LODOP.PRINT_INITA("0mm",-14,"147.64mm","210.08mm","");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A5");
LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE",1);
LODOP.ADD_PRINT_TEXT("7.94mm","26.72mm","75.41mm","9.26mm","orgName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("17.2mm","4.5mm","141.82mm","9.26mm","hosName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","10.05mm","13.49mm","5.29mm","费别：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm",68,"29.1mm","5.29mm","settlemetnType");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","45.77mm","25.14mm","5.29mm","医保电脑号：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","93.93mm","21.96mm","5.29mm","患者编号：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","62.71mm","35.19mm","5.29mm","miComputeNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.72mm","109.01mm","35.72mm","5.29mm","patientNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("30.98mm","6.61mm","30.69mm","140.71mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","10.05mm","12.7mm","5.29mm","姓名：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","45.77mm","12.17mm","5.29mm","性别：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","54.5mm","39.16mm","5.29mm","patientGender");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","93.93mm","11.91mm","5.29mm","年龄：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","102.66mm","43.13mm","5.29mm","age");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","10.05mm","17.2mm","5.29mm","科室:");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","45.77mm","19.31mm","5.29mm","医师：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","18.52mm","27.78mm","5.29mm","outpDeptName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("47.36mm","10.05mm","19.31mm","5.29mm","联系方式：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("47.36mm","24.87mm","113.77mm","5.29mm","relateNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","93.93mm","20.11mm","5.29mm","开嘱时间：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","108.74mm","35.72mm","5.29mm","diagTime");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.6mm","10.05mm","28.84mm","5.29mm","联系地址：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.6mm","24.87mm","118.53mm","5.29mm","relateAddress");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_HTM("diagHtmlTop","9.95mm","112.18mm","diagHtmlHeight","diagnoseHtml");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_LINE("cHtmlLineTop","6.61mm","cHtmlLineTop","140.71mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_LINE("187.88mm","6.35mm","187.59mm","140.44mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(693,261,93,20,"申请医师签名：");
LODOP.SET_PRINT_STYLEA(0,"PageIndex","last");
LODOP.ADD_PRINT_TEXT(693,341,196,20,"doctorName");
LODOP.SET_PRINT_STYLEA(0,"PageIndex","last");
LODOP.ADD_PRINT_TEXT("189.44mm","10.05mm","21.17mm","6.88mm","注意事项：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_BARCODE(20,390,130,45,"128B","applyNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(140,207,147,20,"doctorName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,70,105,20,"patientName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_HTM("contentHtmlTop",34,497,433,"contentHtml");

LODOP.ADD_PRINT_RECT(30,31,68,30,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(36,33,63,20,"门诊");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("189.44mm",112,414,"6.88mm","note");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
`;




export let checkTpl = `

LODOP.PRINT_INITA("0mm","30mm","147.64mm","210.08mm","");
LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE",1);
LODOP.ADD_PRINT_TEXT("7.94mm","42.86mm","46.04mm","9.26mm","罗湖医院集团");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("17.2mm","7.14mm","106.1mm","9.26mm","长岭街道社区健康服务中心 检查申请单");
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
LODOP.ADD_PRINT_TEXT("32.01mm","44.71mm","12.17mm","5.29mm","性别：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","54.77mm","15.08mm","5.29mm","patientGender");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","88.64mm","11.91mm","5.29mm","年龄：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","98.69mm","21.96mm","5.29mm","age");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","10.05mm","17.2mm","5.29mm","科室:");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","44.71mm","19.31mm","5.29mm","医师：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","19.58mm","23.81mm","5.29mm","outpDeptName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.6mm","88.64mm","19.31mm","5.29mm","联系方式：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.6mm","104.25mm","41.01mm","5.29mm","relateNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","88.64mm","20.11mm","5.29mm","开嘱时间：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","106.1mm","35.72mm","5.29mm","diagTime");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.6mm","10.05mm","28.84mm","5.29mm","联系地址：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.6mm","25.66mm","60.59mm","5.29mm","relateAddress");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("52.39mm","10.05mm","18.52mm","5.29mm","临床诊断：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_HTML("53.18mm","31.75mm","108.48mm","14mm","diagnoseHtml");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("66.94mm","6.61mm","67.23mm","140.71mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("187.88mm","6.35mm","187.59mm","140.44mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("180.71mm","93.13mm","32.54mm","5.29mm","申请医师签名：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("189.44mm","10.05mm","21.17mm","6.88mm","注意事项：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_BARCODE(20,390,130,45,"Code39","applyNum");
LODOP.ADD_PRINT_TEXT(140,205,127,20,"doctorName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(121,73,100,20,"patientName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_HTM(281,34,497,366,"contentHtml");
LODOP.ADD_PRINT_RECT(30,31,68,30,0,1);
LODOP.ADD_PRINT_TEXT(36,33,63,20,"门诊");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

`

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
    <div style='line-height: 28px;font-size: 12px'>
    <strong>检查项目：</strong>
    <% for(let j=0; j < data.length;j++) { %>
        <% for(let i=0; i < data[j].part3.length;i++) { %>
            <div style='padding-left: 20px; display: flex;line-height: 24px;'>
                <span style='width: 30px; color: red;'>
                    <% if(data[j].part3[i].urgent !== '') {%>
                        急
                    <% } %>
                </span>
                <span style='flex: 5'>
                    <%= data[j].part3[i].no %>、<%= data[j].part3[i].itemName %>
                </span>
                <span style='flex: 1;padding-left: 10px;'>
                    <%= data[j].part3[i].quantity %> 次
                </span>
                <span style='flex: 1'>
                    <%= Number(data[j].part3[i].amt).toFixed(2) %> 元
                </span>
            </div>
        <% } %>
    <% } %>
    </div>
    <% if(data[0].checkList.indexOf('主诉') > -1) { %>
        <div style='line-height: 28px;font-size: 12px'>
        <strong>主诉：</strong>
        <%= data[0].chiefComplaint %>
        </div>
    <% } %>
    <% if(data[0].checkList.indexOf('现病史') > -1) { %>
        <div style='line-height: 28px;font-size: 12px'>
        <strong>现病史：</strong>
        <%= data[0].currentProfile %>
        </div>
    <% } %>
    <% if(data[0].checkList.indexOf('既往史') > -1) { %>
        <div style='line-height: 28px;font-size: 12px'>
        <strong>既往史：</strong>
        <%= data[0].historyProfile %>
        </div>
    <% } %> 
    <% if(data[0].checkList.indexOf('体格检查') > -1) { %>
        <div style='line-height: 28px;font-size: 12px'>
        <strong>体格检查：</strong>
        <%= data[0].physicalExam %>
        </div>
    <% } %>
    <% if(data[0].checkList.indexOf('检查目的') > -1) { %>
        <div style='line-height: 28px;font-size: 12px'>
        <strong>检查目的：</strong>
        <%= data[0].examPurpose %>
        </div>
    <% } %>
`

export function complier(dataInit, checkList, cntData = []) { // 检查申请相关打印样式
    // debugger
    let data = dataInit;
    for(let i in cntData) {
        try {
            cntData[i].checkList = checkList;
            let key = `\"`;
            let key1 = `</`;
            cntData[i].historyProfile = cntData[i].historyProfile.replace(/[\r\n]/g,"").replace(new RegExp(key,'g'),`'`).replace(new RegExp(key1,'g'),'&lt;/');
            cntData[i].physicalExam = cntData[i].physicalExam.replace(/[\r\n]/g,"").replace(new RegExp(key,'g'),`'`).replace(new RegExp(key1,'g'),'&lt;/');
            cntData[i].examPurpose = cntData[i].examPurpose.replace(/[\r\n]/g,"").replace(new RegExp(key,'g'),`'`).replace(new RegExp(key1,'g'),'&lt;/');    
        } catch (error) {
            
        }
      }
    
    let htmlStr = "";
    let diagnoseStr = "";
    let bParse = eval(compile(contentTpl));
    htmlStr = bParse(cntData);
    let bParse1 = eval(compile(diagnoseTpl));

    diagnoseStr = dataInit.hasOwnProperty("diagList") && dataInit.diagList.length > 0 ? bParse1(dataInit.diagNameObj) : ""
    console.log(htmlStr)
    return {htmlStr, diagnoseStr}
}