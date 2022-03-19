let thermosensitiveTpl = `
LODOP.PRINT_INITA("0mm","0mm","80mm","210mm","");
LODOP.SET_PRINT_PAGESIZE(1,800,2100,"CreateCustomPage");
LODOP.ADD_PRINT_TEXT(5,5,289,20,"- - - - - - - - - - 电子票据 - - - - - - - - -");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(19,5,100,20,"查验网站");
LODOP.ADD_PRINT_TEXT(35,5,289,25,"http://dzpj.czt.gd.gov.cn/billcheck/html/index.html");
LODOP.SET_PRINT_STYLEA(0,"LineSpacing",-4);
LODOP.ADD_PRINT_TEXT(62,5,72,20,"票据代码：");
LODOP.ADD_PRINT_TEXT(62,63,232,20,"billBatchCode");
LODOP.ADD_PRINT_TEXT(80,5,69,20,"票据号码：");
LODOP.ADD_PRINT_TEXT(81,62,232,20,"billNo");
LODOP.ADD_PRINT_TEXT(99,5,62,20,"检验码：");
LODOP.ADD_PRINT_TEXT(100,51,244,20,"random");
LODOP.ADD_PRINT_TEXT(118,5,289,20,"微信扫一扫，领取电子票据到微信卡包，安全又快捷");
LODOP.ADD_PRINT_IMAGE(136,76,160,160,"billQRCode");
LODOP.ADD_PRINT_TEXT(303,5,289,20,"温馨提示：※电子票据和纸质票据具有同等法律效力");
LODOP.ADD_PRINT_TEXT(323,5,287,20,"- - - - - - - - - - 电子票据 - - - - - - - - -");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(341,5,70,20,"患者姓名：");
LODOP.ADD_PRINT_TEXT(341,63,229,20,"patientName");
LODOP.ADD_PRINT_TEXT(362,5,47,20,"性别：");
LODOP.ADD_PRINT_TEXT(362,40,253,20,"patientGender");
LODOP.ADD_PRINT_TEXT(382,5,72,20,"就诊科室：");
LODOP.ADD_PRINT_TEXT(382,61,230,20,"sdeptName");
LODOP.ADD_PRINT_TEXT(402,5,69,20,"就诊医生：");
LODOP.ADD_PRINT_TEXT(402,62,228,20,"doctorName");
LODOP.ADD_PRINT_TEXT(420,5,59,20,"电脑号：");
LODOP.ADD_PRINT_TEXT(420,50,240,20,"siPersonPcNum");
LODOP.ADD_PRINT_TEXT(441,5,69,20,"医疗证号：");
LODOP.ADD_PRINT_TEXT(441,61,232,20,"socialSecurityNum");
LODOP.ADD_PRINT_TEXT(459,5,72,20,"支付方式：");
LODOP.ADD_PRINT_TEXT(459,62,228,20,"companyName");
LODOP.ADD_PRINT_TEXT(480,5,79,20,"缴费金额：");
LODOP.ADD_PRINT_TEXT(480,63,227,20,"totalAmount");
LODOP.ADD_PRINT_TEXT(500,5,70,20,"统筹基金：");
LODOP.ADD_PRINT_TEXT(500,62,227,20,"siFundPayMoney");
LODOP.ADD_PRINT_TEXT(521,5,79,20,"个账支付：");
LODOP.ADD_PRINT_TEXT(521,63,229,20,"siSelfAccountMoney");
LODOP.ADD_PRINT_TEXT(542,5,74,20,"企业记账：");
LODOP.ADD_PRINT_TEXT(542,62,230,20,"ef");
LODOP.ADD_PRINT_TEXT(562,5,75,20,"自负金额：");
LODOP.ADD_PRINT_TEXT(562,61,232,20,"selfPayAmount");
LODOP.ADD_PRINT_TEXT(581,5,79,20,"货币误差：");
LODOP.ADD_PRINT_TEXT(581,64,230,20,"cashChangeAmt");
LODOP.ADD_PRINT_TEXT(599,5,95,20,"医保账户余额：");
LODOP.ADD_PRINT_TEXT(599,90,204,20,"siAccountBalanceAfterPay");
LODOP.ADD_PRINT_TEXT(616,5,70,20,"交易日期：");
LODOP.ADD_PRINT_TEXT(616,62,232,20,"chargeTime");
LODOP.ADD_PRINT_TEXT(634,5,288,20,"- - - - - - - - - - - - - - - - - - - - - - -");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(649,5,45,20,"单位：");
LODOP.ADD_PRINT_TEXT(648,33,261,25,"chargeUnitName");
LODOP.ADD_PRINT_TEXT(675,5,69,20,"打印日期：");
LODOP.ADD_PRINT_TEXT(675,65,231,20,"printTime");
LODOP.ADD_PRINT_TEXT(691,5,59,20,"收费员：");
LODOP.ADD_PRINT_TEXT(691,51,244,20,"chargeUserName");
LODOP.ADD_PRINT_TEXT(709,5,290,20,"温馨提示：缴费成功，如有药品，请前往窗口领取！");
LODOP.ADD_PRINT_TEXT(727,5,290,40,"缴费时请核对好处方，交费后妥善保管好单据，如需退费时，请携带已交费单据和个人证件");`;

let thermosensitiveErrorTpl = `
LODOP.PRINT_INITA("0mm","0mm","80.01mm","210mm","");
LODOP.SET_PRINT_PAGESIZE(1,800,2100,"CreateCustomPage");
LODOP.ADD_PRINT_TEXT(5,5,289,20,"- - - - - - - - - - 电子票据 - - - - - - - - -");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(25,5,289,46,"无电子票据信息，请咨询工作人员。");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.ADD_PRINT_TEXT(53,5,287,20,"- - - - - - - - - - 电子票据 - - - - - - - - -");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(72,5,70,20,"患者姓名：");
LODOP.ADD_PRINT_TEXT(72,63,229,20,"patientName");
LODOP.ADD_PRINT_TEXT(93,5,47,20,"性别：");
LODOP.ADD_PRINT_TEXT(93,40,253,20,"patientGender");
LODOP.ADD_PRINT_TEXT(113,5,72,20,"就诊科室：");
LODOP.ADD_PRINT_TEXT(113,61,230,20,"sdeptName");
LODOP.ADD_PRINT_TEXT(133,5,69,20,"就诊医生：");
LODOP.ADD_PRINT_TEXT(133,62,228,20,"doctorName");
LODOP.ADD_PRINT_TEXT(151,5,59,20,"电脑号：");
LODOP.ADD_PRINT_TEXT(151,50,240,20,"siPersonPcNum");
LODOP.ADD_PRINT_TEXT(172,5,69,20,"医疗证号：");
LODOP.ADD_PRINT_TEXT(172,61,232,20,"socialSecurityNum");
LODOP.ADD_PRINT_TEXT(190,5,72,20,"支付方式：");
LODOP.ADD_PRINT_TEXT(190,62,228,20,"companyName");
LODOP.ADD_PRINT_TEXT(211,5,79,20,"缴费金额：");
LODOP.ADD_PRINT_TEXT(211,63,227,20,"totalAmount");
LODOP.ADD_PRINT_TEXT(231,5,70,20,"统筹基金：");
LODOP.ADD_PRINT_TEXT(231,62,227,20,"siFundPayMoney");
LODOP.ADD_PRINT_TEXT(252,5,79,20,"个账支付：");
LODOP.ADD_PRINT_TEXT(252,63,229,20,"siSelfAccountMoney");
LODOP.ADD_PRINT_TEXT(273,5,74,20,"企业记账：");
LODOP.ADD_PRINT_TEXT(273,62,230,20,"ef");
LODOP.ADD_PRINT_TEXT(293,5,75,20,"自负金额：");
LODOP.ADD_PRINT_TEXT(293,61,232,20,"selfPayAmount");
LODOP.ADD_PRINT_TEXT(312,5,79,20,"货币误差：");
LODOP.ADD_PRINT_TEXT(312,64,230,20,"cashChangeAmt");
LODOP.ADD_PRINT_TEXT(330,5,95,20,"医保账户余额：");
LODOP.ADD_PRINT_TEXT(330,90,204,20,"siAccountBalanceAfterPay");
LODOP.ADD_PRINT_TEXT(347,5,70,20,"交易日期：");
LODOP.ADD_PRINT_TEXT(347,62,232,20,"chargeTime");
LODOP.ADD_PRINT_TEXT(365,5,288,20,"- - - - - - - - - - - - - - - - - - - - - - -");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(380,5,45,20,"单位：");
LODOP.ADD_PRINT_TEXT(379,33,261,25,"chargeUnitName");
LODOP.ADD_PRINT_TEXT(406,5,69,20,"打印日期：");
LODOP.ADD_PRINT_TEXT(406,65,231,20,"printTime");
LODOP.ADD_PRINT_TEXT(422,5,59,20,"收费员：");
LODOP.ADD_PRINT_TEXT(422,51,244,20,"chargeUserName");
LODOP.ADD_PRINT_TEXT(440,5,290,20,"温馨提示：缴费成功，如有药品，请前往窗口领取！");
LODOP.ADD_PRINT_TEXT(458,5,290,40,"缴费时请核对好处方，交费后妥善保管好单据，如需退费时，请携带已交费单据和个人证件");`;

function handleThermosensiPrintData(resData) {
  let obj = {
    billNo: "",
    billBatchCode: "",
    random: "",
    billQRCode: "",
    patientName: "",
    patientGender: "",
    sdeptName: "",
    doctorName: "",
    siPersonPcNum: "",
    socialSecurityNum: "",
    companyName: "",
    totalAmount: "0.00",
    siFundPayMoney: "0.00",
    siSelfAccountMoney: "0.00",
    ef: "0.00",
    selfPayAmount: "0.00",
    cashChangeAmt: "0.00",
    siAccountBalanceAfterPay: "0.00",
    chargeTime: "",
    chargeUnitName: "",
    printTime: "",
    chargeUserName: ""
  };
  obj = {
    ...obj,
    ...resData,
    totalAmount: (resData.totalAmount || 0).toFixed(2),
    siFundPayMoney: (resData.siFundPayMoney || 0).toFixed(2),
    siSelfAccountMoney: (resData.siSelfAccountMoney || 0).toFixed(2),
    selfPayAmount: (resData.selfPayAmount || 0).toFixed(2),
    cashChangeAmt: (resData.cashChangeAmt || 0).toFixed(2),
    siAccountBalanceAfterPay: (resData.siAccountBalanceAfterPay || 0).toFixed(2),
    billQRCode: resData.billQRCode ? `<img src='data:image/png;base64,${resData.billQRCode}' style='width:160px;height:160px'/>` : ``
  }
  return obj;
}

export {
  thermosensitiveTpl,
  thermosensitiveErrorTpl,
  handleThermosensiPrintData
};
