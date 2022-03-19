// 财务票据统一打印处理

import { compile } from '../utils';

const minimize = raw => raw.join().split('\n').map(i => i.trim()).join('')

export let inFinanceTpl = `
LODOP.PRINT_INITA(0,0,700,382,"");
LODOP.ADD_PRINT_TEXT(32,91,151,20,"receiptNum");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(32,209,151,20,"socialSecurityNum");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(35,419,132,20,"emrCode");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(56,90,100,20,"chargeUnitName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(55,208,120,20,"emrCode");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(53,419,72,21," ");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(49,497,34,20,"year");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(49,546,41,20,"mouth");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(49,599,32,20,"day");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(81,89,104,20,"patientName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(73,462,72,20,"startTime");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(74,549,79,18,"endTime");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_HTML(73,238,23,40,"clinicType1");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_HTML(73,288,21,41,"clinicType2");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_HTML(73,338,21,38,"clinicType3");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_HTML(99,84,19,40,"patientGender1");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_HTML(99,117,20,40,"patientGender2");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(103,566,84,20,"companyName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_HTM(152,36,57,76,"drugOutp");
LODOP.ADD_PRINT_HTM(151,97,76,82,"drugOutpAmt");
LODOP.ADD_PRINT_HTM(152,176,77,77,"examOutp");
LODOP.ADD_PRINT_HTM(152,259,81,74,"examOutpAmt");
LODOP.ADD_PRINT_HTM(153,345,78,75,"treatOutp");
LODOP.ADD_PRINT_HTM(152,425,98,74,"treatOutpAmt");
LODOP.ADD_PRINT_HTM(152,524,78,74,"otherOutp");
LODOP.ADD_PRINT_HTM(153,605,85,73,"otherOutpAmt");
LODOP.ADD_PRINT_TEXT(228,96,73,21,"selfPayPrepay");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(228,258,86,19,"paymentAmount");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(229,424,91,20,"refundAmount");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(229,603,90,20,"");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(256,175,29,22,"price1");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(256,215,28,22,"price2");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(256,255,28,22,"price3");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(256,293,29,22,"price4");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(255,332,28,22,"price5");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(255,370,27,22,"price6");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(255,409,28,22,"price7");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(255,448,24,22,"price8");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(276,253,144,23,"cashChangeAmtStr");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(255,519,144,22,"actualTotalPayMoney");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(329,121,102,23,"chargeUnitName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(329,260,86,22,"reCheckUserName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(329,345,73,22,"chargeUserName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_HTM(275,410,303,99,"outpChargeDetailNewPOsStr");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(101,251,65,20,"IC卡支付:");
LODOP.ADD_PRINT_TEXT(101,306,100,20,"siSelfAccountMoney");
LODOP.ADD_PRINT_TEXT(120,251,63,20,"统筹基金:");
LODOP.ADD_PRINT_TEXT(120,305,100,20,"siFundPayMoney");
LODOP.ADD_PRINT_TEXT(101,416,147,20,"payTypeNm1");
LODOP.ADD_PRINT_TEXT(120,416,146,20,"payTypeNm2");
LODOP.ADD_PRINT_TEXT(74,625,63,18,"inDays");
LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
LODOP.ADD_PRINT_TEXT(73,530,19,20,"-");
`;

const svgIcon = "<svg t='1617605864317' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2227' width='16' height='16'><path d='M378.410667 850.450963C364.491852 850.450963 350.610963 845.293037 340.02963 834.939259L20.920889 523.529481C-0.279704 502.821926-0.279704 469.295407 20.920889 448.587852 42.121481 427.880296 76.48237 427.880296 97.682963 448.587852L378.410667 722.526815 925.75763 188.491852C946.958222 167.784296 981.319111 167.784296 1002.519704 188.491852 1023.720296 209.161481 1023.720296 242.688 1002.519704 263.395556L416.791704 834.939259C406.172444 845.293037 392.291556 850.450963 378.410667 850.450963L378.410667 850.450963Z' p-id='2228' fill='#1296db'></path></svg>"

// 费用信息
function contentTpl(key) {
    if (key === 'finClassName') { // 费用项目
        return minimize`
            <div style='font-size: 12px;'>
                <% for(let i=0; i<data.length;i++){ %>
                    <div style='line-height: 16px;overflow:hidden;width:200px;'>
                        <%= data[i].className %>
                    </div>
                <% } %>
            </div>
        `
    } else if (key === "totalAmt") { // 费用金额
        return minimize`
            <div style='font-size: 12px;'>
                <% for(let i=0; i<data.length;i++){ %>
                    <div style='line-height: 16px;'>
                        <%= data[i].chargeAmount %>
                    </div>
                <% } %>
            </div>
        `
    } else if (key === "siTadeAmtDetailDtos") { // 医保
        return minimize`
            <div style='font-size: 12px;'>
                <% if(data.siSelfAccountMoney && data.siSelfAccountMoney != 0){ %>
                    <div style='line-height: 16px;'>
                        IC卡支付:<%= data.siSelfAccountMoney %>
                    </div>
                <% } %>
                <% if(data.siFundPayMoney && data.siFundPayMoney != 0){ %>
                    <div style='line-height: 16px;'>
                        统筹基金:<%= data.siFundPayMoney %>
                    </div>
                <% } %>
            </div>
        `
    }else if(key === 'InpChargeItemChargeDetailVO') {
        return minimize`
        <div style='font-size: 11px;'>
            <table>
                <tr>
                    <td style='height:10px;line-height:10px;font-size: 10px;' width='120'>名称</td>
                    <td style='height:10px;line-height:10px;font-size: 10px;' width='40'>单价</td>
                    <td style='height:10px;line-height:10px;font-size: 10px;' width='40'>数量</td>
                    <td style='height:10px;line-height:10px;font-size: 10px;' width='40'>金额</td>
                </tr>
                <% for(let i=0; i<data.length;i++){ %>
                    <tr style='line-height: 10px;font-size: 11px;'>
                        <td><span style='width:120px;height:10px;overflow:hidden;display:inline-block;'>
                            <%= data[i].chargeItemName %>
                            </span>
                        </td>
                        <td style='height:10px;line-height:10px;font-size: 10px;'>
                            <%= data[i].chargePrice %>
                        </td>
                        <td style='height:10px;line-height:10px;font-size: 10px;'>
                            <%= data[i].chargeQuantity %>
                        </td>
                        <td style='height:10px;line-height:10px;font-size: 10px;'>
                            <%= data[i].totalAmt %>
                        </td>
                    </tr>
                <% } %>
            </table>
        </div>
        `
    } else { // 个人缴费
        return minimize`
            <% for(let i=0; i<data.length;i++){ %>
                <div style='line-height: 16px;font-size: 12px;'>
                    <%= data[i].payTypeName %>  <%= data[i].payAmt %>
                </div>
            <% } %>
        `
    }
}

export function createData(receiptContent, dayjs) {
    // 数据初始化，防止出现未替换代码块
    let obj = {
        actualSelfPayMoney: "",
        actualTotalPayMoney: "",
        cashChangeAmt: "",
        chargeTime: "",
        chargeUnitName: "",
        chargeUserName: "",
        clinicType: "",
        companyName: "",
        day: "",
        deratePayAmount: "",
        drugOutp: "",
        drugOutpAmt: "",
        drugFeeClassInfos: [],
        emrCode: "",
        examOutp: "",
        examOutpAmt: "",
        examFeeClassInfos: "",
        freePayAmount: "",
        hospitalType: "",
        mouth: "",
        otherOutp: "",
        otherOutpAmt: "",
        otherFeeClassInfos: "",
        InpChargeItemChargeDetailVO: "",
        outpOrderChargeDetailPOS: "",
        outpTradeDetailNewVOS: "",
        patientCode: "",
        patientGender: "",
        patientId: "",
        patientName: "",
        printTime: "",
        printUserId: "",
        printUserName: "",
        reCheckUserName: "",
        receiptNum: "",
        sdeptName: "",
        selfPayAmount: "",
        serialNumber: "",
        socialSecurityNum: "",
        totalAmount: "",
        treatOutp: "",
        treatOutpAmt: "",
        treatFeeClassInfos: "",
        year: "",
        siTadeAmtDetailDtos: [],
        siSelfAccountMoney: 0, // 个人账户
        siFunPayMoney: 0, // 统筹基金
        selfPayOutpTradeSettleAmtDetailPOS: [],
        clinicType1: "",
        clinicType2: "",
        clinicType3: "",
        patientGender1: "",
        patientGender2: "",
        price1: "", // 大写金额
        price2: "",
        price3: "",
        price4: "",
        price5: "",
        price6: "",
        price7: "",
        price8: "",
        cashChangeAmtStr: "", // 抹零
        outpChargeDetailNewPOsStr: "", // 备注
        payTypeNm1: "",//个人支付
        payTypeNm2: "",
        paymentAmount: "",//补收金额
        refundAmount: "",//退款金额
        selfPayPrepay: "",//自付预交款
        inDays: "",
        startTime: "",
        endTime: "",
        siAccountBalanceAfterPay: "",//个人账户金额
        chargeTime: "",//具体时间
    };
    let timeNew = new Date(receiptContent.printTime)
        .toLocaleDateString()
        .split("/");
    obj = {
        ...obj,
        ...receiptContent,
        ...complier(receiptContent),
        year: timeNew[0],
        mouth: Number(timeNew[1]) > 9 ? timeNew[1] : '0' + timeNew[1],
        day: Number(timeNew[2]) > 9 ? timeNew[2] : '0' + timeNew[2],
        chargeTime: receiptContent.chargeTime ? receiptContent.chargeTime.split(" ")[1] : "",
        siSelfAccountMoney: receiptContent.siSelfAccountMoney ? receiptContent.siSelfAccountMoney : "0",// IC卡支付
        siFundPayMoney: receiptContent.siFundPayMoney ? receiptContent.siFundPayMoney : "0",// 统筹基金
        siAccountBalanceAfterPay: receiptContent.siAccountBalanceAfterPay ? receiptContent.siAccountBalanceAfterPay : "0",//个人账户金额
        inDays: `(${receiptContent.inDays}天)`
    };
    // 判断性别
    if (receiptContent.patientGender === "1") {
        obj.patientGender1 = obj.svgIcon
    } else if (receiptContent.patientGender === "2") {
        obj.patientGender2 = obj.svgIcon
    }
    // 判断住院，门诊
    if (receiptContent.clinicType === "1") {
        obj.clinicType1 = obj.svgIcon
    } else if (receiptContent.clinicType === "3") {
        obj.clinicType3 = obj.svgIcon
        obj.startTime =
            dayjs(receiptContent.startTime).format("YYYY-MM-DD") || "";
        obj.endTime =
            dayjs(receiptContent.endTime).format("YYYY-MM-DD") || "";
    } else if (receiptContent.clinicType === "2") {
        obj.clinicType3 = obj.svgIcon
    }
    // 处理大写金额
    let priceArr = changeRMB(obj.actualTotalPayMoney).split("");
    for (let i in priceArr) {
        obj['price' + (Number(i) + 1)] = priceArr[i]
    }
    if (obj.cashChangeAmt && obj.cashChangeAmt != 0) {
        obj.cashChangeAmtStr = "货币误差：" + obj.cashChangeAmt
    }
    // 个人支付
    for(let i in obj.inpPrepayPayTypeClassSumDTOS) {
        let item = obj.inpPrepayPayTypeClassSumDTOS[i];
        if (i == 0) {
            obj.payTypeNm1 = `${item.payTypeClassName}:${item.totalPrepayMoney}`
        } else if (i == 1) {
            obj.payTypeNm2 = `${item.payTypeClassName}:${item.totalPrepayMoney}`
        }
    }
    console.log(obj);
    
    return obj;
}
function changeRMB(amount) {
    if (isNaN(amount) || amount >= 1000000) return "无效金额！"; //数值最大不超过100万
    let sPrefix = amount < 0 ? "(负)" : ""; //将负号‘-’显示成汉字‘(负)’
    let sAmount = Math.abs(amount).toFixed(2); //格式化成两位小数格式（两位小数对应“'角”和“分”）
    let sUnit = "拾万仟佰拾元角分";
    let sCapital = "零壹贰叁肆伍陆柒捌玖"; //10个大写数字
    sAmount = sAmount.replace(".", ""); //去除小数点（使数字与权位对应）
    let str = "";
    if (sAmount.length < sUnit.length) {
      for (let i = 0, len = sUnit.length - sAmount.length; i < len; i++) {
        //拼接数字与权位单位
        str += "" + "0";
      }
    }
    sAmount = str + sAmount;
    console.info(sAmount);
    let sOutput = "";
    for (let i = 0, len = sAmount.length; i < len; i++) {
      //拼接数字与权位单位
      sOutput +=
        sCapital.substr(sAmount.substr(i, 1), 1);//  + sUnit.substr(i, 1);
    }
    return sPrefix + sOutput;
  }
function complier(data) { // 发票模板处理逻辑
    let drugOutp = "", // 药品
        drugOutpAmt = "", // 药品金额
        examOutp = "", // 检查
        examOutpAmt = "", // 检查金额
        treatOutp = "", // 治疗
        treatOutpAmt = "", // 治疗金额
        otherOutp = "", // 其他
        otherOutpAmt = ""; // 其他金额
    // let siTadeAmtDetailDtosStr = "", // 医保
        // selfPayOutpTradeSettleAmtDetailPOSStr = ""; // 个人
    let drugParse = eval(compile(contentTpl('finClassName')));
    let drugFeeClassInfos = data.hasOwnProperty("drugFeeClassInfos") ? data.drugFeeClassInfos : [];
    drugFeeClassInfos = drugFeeClassInfos <= 3 ? drugFeeClassInfos : drugFeeClassInfos.splice(0,3);
    drugOutp = drugParse(drugFeeClassInfos);
    let drugAmtParse = eval(compile(contentTpl('totalAmt')));
    drugOutpAmt = drugAmtParse(drugFeeClassInfos);

    let examParse = eval(compile(contentTpl('finClassName')));
    let examFeeClassInfos = data.hasOwnProperty("examFeeClassInfos") ? data.examFeeClassInfos : [];
    examFeeClassInfos = examFeeClassInfos <= 3 ? examFeeClassInfos : examFeeClassInfos.splice(0,3);
    examOutp = examParse(examFeeClassInfos);
    let examAmtParse = eval(compile(contentTpl('totalAmt')));
    examOutpAmt = examAmtParse(examFeeClassInfos);

    let treatParse = eval(compile(contentTpl('finClassName')));
    let treatFeeClassInfos = data.hasOwnProperty("treatFeeClassInfos") ? data.treatFeeClassInfos : [];
    treatFeeClassInfos = treatFeeClassInfos <= 3 ? treatFeeClassInfos : treatFeeClassInfos.splice(0,3);
    treatOutp = treatParse(treatFeeClassInfos);
    let treatAmtParse = eval(compile(contentTpl('totalAmt')));
    treatOutpAmt = treatAmtParse(treatFeeClassInfos);

    let otherParse = eval(compile(contentTpl('finClassName')));
    let otherFeeClassInfos = data.hasOwnProperty("otherFeeClassInfos") ? data.otherFeeClassInfos : [];
    otherFeeClassInfos = otherFeeClassInfos <= 3 ? otherFeeClassInfos :otherFeeClassInfos.splice(0,3);
    otherOutp = otherParse(otherFeeClassInfos);
    let otherAmtParse = eval(compile(contentTpl('totalAmt')));
    otherOutpAmt = otherAmtParse(otherFeeClassInfos);

    // let siParse = eval(compile(contentTpl('siTadeAmtDetailDtos')));
    // siTadeAmtDetailDtosStr = siParse(data)
    // let selfPayOutpTradeSettleAmtDetailPOS = data.selfPayOutpTradeSettleAmtDetailPOS <= 2 ? data.selfPayOutpTradeSettleAmtDetailPOS : data.selfPayOutpTradeSettleAmtDetailPOS.splice(0,2);
    // let selParse = eval(compile(contentTpl('selfPayOutpTradeSettleAmtDetailPOS')));
    // selfPayOutpTradeSettleAmtDetailPOSStr = selParse(selfPayOutpTradeSettleAmtDetailPOS || []);

    let chargeParse = eval(compile(contentTpl('InpChargeItemChargeDetailVO')));
    let InpChargeItemChargeDetailVO = data.hasOwnProperty("InpChargeItemChargeDetailVO") ? data.InpChargeItemChargeDetailVO : [];
    InpChargeItemChargeDetailVO = InpChargeItemChargeDetailVO.length <= 4 ? InpChargeItemChargeDetailVO : InpChargeItemChargeDetailVO.splice(0,4);
    let outpChargeDetailNewPOsStr = chargeParse(InpChargeItemChargeDetailVO || []);
    return {
        svgIcon,
        drugOutp,
        drugOutpAmt,
        examOutp,
        examOutpAmt,
        treatOutp,
        treatOutpAmt,
        otherOutp,
        otherOutpAmt,
        // siTadeAmtDetailDtosStr,
        // selfPayOutpTradeSettleAmtDetailPOSStr,
        outpChargeDetailNewPOsStr
    }
}