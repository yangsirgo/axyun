import { compile } from '../utils';
const minimize = raw => raw.join().split('\n').map(i => i.trim()).join('')

let logoHtml = minimize`
<style>
.logoWrapper {
    height: 34pt;
  }
  
  .floatLeft {
    float:left
  }
  
  .height100 {
    height: 100%;
  }
  .title {
    margin-left: 6pt;
    margin-top: 6pt;
    font-weight: bold;
  }
  
  .titleInner {
    margin: 0;
  }
  .fontSize13 {
      font-size: 12pt;
  }
  
  .fontSize8 {
    font-size: 9pt;
    margin-top: -2pt;
  }
</style>
<div class='logoWrapper'>
  <div class='floatLeft height100'>
    <img class='height100'  src='<%= data.logoSrc %>'/>
  </div>
  <div class='floatLeft title'>
    <p class='titleInner fontSize13'> 深圳市罗湖医院医疗集团 </p>
    <p class='titleInner fontSize8'> Shenzhen Luohu Hospital Group </p>
  </div>
<div>
`;

let contentHtml = minimize`
<style>
.leaveTitle {
    text-align: center;
    font-size: 16pt;
  }
  
  .mainContent {
    text-indent: 2em;
    line-height: 24pt;

  }

  .engWrap {
    word-wrap: break-word;
    word-break: keep-all;
  }

  .underline{text-decoration:underline} 
</style>
<div> 
<h1 class='leaveTitle'>
  病假证明单
</h1>
  <div class='mainContent'> 
    <span class='underline'><%= data.patientName %></span>
    同志于 
    <span><%= data.createdAtDate %> </span>
    前来就诊，诊断为：
    <span class='underline'><%= data.diagName %></span> 
    建议休息 
    <span class='underline'><%= data.days %></span> 
    ，  
    <span><%= data.startDate %><%= data.startTime %></span>
    起 
    <span><%= data.endDate %><%= data.endTime %></span>止。    
  </div>
  <p class='mainContent engWrap'>临床建议：<%= data.suguestContent %></p>
</div>
`;


let leaveCardTpl = `

LODOP.PRINT_INITA(0,15,"210mm","148.01mm","");
LODOP.SET_PRINT_PAGESIZE(2,0,0,"A5");
LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);
LODOP.SET_PREVIEW_WINDOW(0,0,0,0,0,"");	
LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);//横向时的正向显示
LODOP.ADD_PRINT_RECT(18,16,757,522,0,1);
LODOP.SET_PRINT_STYLEA(0,"Horient",2);

LODOP.ADD_PRINT_LINE(535,195,20,196,2,1);

LODOP.ADD_PRINT_TEXT(30,26,100,20,"存根");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.ADD_PRINT_TEXT(128,26,63,20,"姓名：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.ADD_PRINT_TEXT(128,65,155,20,"patientName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.ADD_PRINT_TEXT(482,26,62,20,"建议休息");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.ADD_PRINT_TEXT(499,26,100,20,"开具时间：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.ADD_PRINT_TEXT(482,85,100,20,"days");
LODOP.ADD_PRINT_TEXT(518,27,131,20,"nowDate");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.ADD_PRINT_HTM(33,214,300,51,"logoHtml");
LODOP.ADD_PRINT_HTM(98,207,545,300,"contentHtml");
LODOP.ADD_PRINT_TEXT(484,215,409,20,"注：1.本证明须盖社康中心疾病诊断章及医师签名有效。");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.ADD_PRINT_TEXT(503,242,281,20,"2.休息天数一律用大写。");

LODOP.ADD_PRINT_TEXT(419,597,120,20,"doctorName");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Underline",1);
LODOP.ADD_PRINT_TEXT(419,570,62,20,"医师");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.ADD_PRINT_TEXT(446,571,131,20,"nowDate");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
`

function complierLeave(data) { // 检查申请相关打印样式
    let htmlStr = "";
    let bParse = eval(compile(contentHtml));
    htmlStr = bParse(data);
    console.log(htmlStr)
    return {htmlStr}
  }
  

  function complierLeaveLogo(data) { // 请假单 logo
    let logoStr = "";
    let bParse = eval(compile(logoHtml));
    logoStr = bParse(data);
    console.log(logoStr)
    return {logoStr}
  }

export {
    complierLeave,
    complierLeaveLogo,
    leaveCardTpl,
    contentHtml
}
