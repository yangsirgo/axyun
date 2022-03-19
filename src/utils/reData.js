const STR_DOM = "domStr";
const STR_D = "$D[";//表格标题
const STR_B = "$B[";//表格边框
const STR_A = "$A[";//竖向合计
const STR_VA = "$VA[";//横向合计
const STR_AD = "$AD[";//横向平均值
const STR_AAD = "$AAD[";//平均数竖向合计
const STR_CHECK = "$CHECK[";//多选
const STR_RADIO = "$RADIO[";//单选框
const STR_CF = "$CF["
const STR_CL = "$CL["
const STR_S = "$S[";
const STR_N = "$N["
const STR_C = "$C["
const STR_BC = "$BC["
const STR_Bar = "$R[";
const STR_T = "$T[";
const STR_TE = "$TE[";
const STR_M = "$M[";
const STR_L = "$L[";
const STR_R = "$R[";
const STR_E = "$E[";
const STR_F = "$F[";
const STR_FM = "$FM[";
const STR_CM = "$CM[";
const STR_H = "$H[";
const STR_K = "$V[";
const STR_KM = "$VM[";
const STR_W = "$W[";//标题行标题列字体是否加粗设置，设置所有
const STR_TW = "$TW["//某个th里面是否加粗
const STR_PV = "$PV["
const STR_P = "$P["
const STR_CP = "$CP["
const STR_M_E = "]";
const STR_TR = "tr";
const STR_TH = "th";
const STR_TD = "td";
const STR_REGEX_HTML = "(?<=\\>)(?:\\s*\r?\n?)(?=\\<)";
const STR_BLANK = "";

import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
let commonArr = [];
let tableStatic = {
  sliceLength: 0,
  tableName: ""
}

// 调用横向分页
export function reReuse(domValue, domSS, typeData) {
  if (!domSS) {
    domSS = domValue;
  }
  let domS = domSS.domStr;
  let domV = domSS;
  let str = reRatas(domSS, typeData);
  if (tableStatic.sliceLength > 0) {
    domV[tableStatic.tableName] = domV[tableStatic.tableName].slice(tableStatic.sliceLength);
    domV.domStr = str + domS;
    return reReuse(domValue, domV, typeData);
  } else {
    return str;
  }
}

// 不用横向分页
/**
 * 
 * @param {*} domResult 
 * @param {*} typeData 
 */
export function reRatas(domResult, typeData) {
  const domHtml = JSON.parse(JSON.stringify(domResult))
  let domStr = domResult.domStr.toString();
  let arrAll = [];
  let length = 0;
  commonArr = [];
  // 符合条件合并数据
  if (typeData == 'typeData') {
    Object.keys(domResult).forEach((key) => {
      if (domResult[key] instanceof Array) {
        arrAll.push(domResult[key]);
        if (domResult[key].length > length) {
          length = domResult[key].length;
        }
      }
    })
    for (var i = 0; i < length; i++) {
      arrAll.map(val => {
        if (!commonArr[i]) {
          commonArr[i] = {}
        }
        if (!val[i]) {
          val[i] = {}
        }
        commonArr[i] = Object.assign(val[i], commonArr[i])
      })
    }

  }


  //判断每页是否有表头
  let tpicked = domResult.tpicked;

  //Document doc = Jsoup.parse(domStr);
  let doc = document.createElement("div");
  doc.innerHTML = domStr;

  let titleList = getTableName(domStr, STR_D);//含$D表格
  let borderList = getTableName(domStr, STR_B);
  let bordertypeList = getTableName(domStr, STR_S);
  let weightList = getTableName(domStr, STR_W);//标题行标题列是否加粗

  let index1 = 0;//表格边框$B++
  let index2 = 0;//表格名称$D++
  let index3 = 0;//表格边框样式$S++
  let indexWe = 0;//所有th是否加粗 $W++
  let indexTd = 0;
  let capName = doc.getElementsByTagName("caption");//表格名称
  let tdss = doc.getElementsByTagName("td");
  // let ths = doc.getElementsByTagName('th')
  if (capName[0]) {
    capName[0].parentElement.style.borderCollapse = "collapse";
  }
  for (let j = 0; j < capName.length; j++) {
    if (capName[j].innerHTML.indexOf(STR_D) > -1) {
      // capName[j].parentElement.attr("id",titleList[index2]);
      capName[j].parentElement.id = titleList[index2];
      capName[j].parentElement.cellspacing = "0";
      index2++;
    }
    // 标题行标题列字体是否加粗设置(设置表格中所有th)
    if (capName[j].innerHTML.indexOf(STR_W) > -1) {
      let ths = capName[j].parentElement.getElementsByTagName('th')
      for (var th = 0; th < ths.length; th++) {
        ths[th].style.fontWeight = weightList[indexWe];
      }
      indexWe++;
    }
    // if(capName[j].innerHTML.indexOf(STR_S) == -1){
    //   borderList[index1]='solid';
    // }

    capName[j].parentElement.border = '0';
    // capName[j].parentElement.style.border = "1px solid #000";

    let arr1 = capName[j].nextElementSibling.getElementsByTagName('tr');
    let arr = [];
    for (let n = 0; n < arr1.length; n++) {
      for (let p = 0; p < arr1[n].children.length; p++) {
        arr.push(arr1[n].children[p])
      }
    }
    for (let i = 0; i < arr.length; i++) {
      arr[i].style.border = "1px solid #000";
    }
    if (capName[j].innerHTML.indexOf(STR_B) > -1) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].style.border = borderList[index1] + "px solid #000";
        // capName[j].parentElement.style.borderWidth = borderList[index1] + 'px';
      }
      index1++;
    }
    if (capName[j].innerHTML.indexOf(STR_S) > -1) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].style.borderStyle = bordertypeList[index3];
        capName[j].parentElement.style.borderStyle = bordertypeList[index3];
      }
      index3++;
    }
    //修改capName属性，隐藏capName
    capName[j].style = "display:none";
  }

  // 设置content等于总dom
  let content = domStr;
  //为表头添加<thead>用于打印出现分页时每页显示表头
  if ("One" == tpicked) {
    for (let i = 0; i < titleList.length; i++) {

      content = addTitle(doc, titleList[i]);
    }
  }

  //获取表格外面图片内容
  let imgList = getTableName(content, STR_M)

  for (let ji = 0; ji < imgList.length; ji++) {
    var value = "";
    if (domResult[imgList[ji]] == undefined) {
      value = "";
    } else {
      value = "<img src=" + domResult[imgList[ji]] + "></img>";
    }
    content = content.replace(STR_M + imgList[ji] + STR_M_E, value);
  }


  //ͨ获取$T[]中内容
  let textList = getTableName(content, STR_T);
  //System.out.println(textList);
  for (let jt = 0; jt < textList.length; jt++) {
    var value = "";
    if (domResult[textList[jt]] == undefined) {
      value = "";
    } else {
      value = domResult[textList[jt]];
    }
    content = content.replace(STR_T + textList[jt] + STR_M_E, value);
  }
  doc.innerHTML = content;


  let teList = getTableName(content, STR_TE);
  //System.out.println(textList);
  for (let te = 0; te < teList.length; te++) {
    var value = "";
    let teCondition=teList[te].slice(1).split(",")
    if (domResult[teCondition[0]] == undefined) {
      value = "";
    } else {
      let ton=domResult[teCondition[0]];
      console.log('object', teList[te].slice(1))
      value = eval(teCondition[teCondition.length-1]);
      console.log('value', value)
    }
    content = content.replace(STR_TE + teList[te].slice(1) + STR_M_E, value);
  }
  doc.innerHTML = content;


  // 获取$CHECK[]数组
  let checkList = getTableName(content, STR_CHECK);
  for (let c = 0; c < checkList.length; c++) {
    var value = "";
    let check = domHtml[checkList[c].slice(4)] || ''
    for (let ck = 0; ck < check.length; ck++) {
      if (check[ck].content == undefined) {
        value = "";
      } else if (check[ck].check == 'checked') {
        value += "<input type='checkbox' checked style='margin-left:10px'>" + check[ck].content
      } else {
        value += "<input type='checkbox'  style='margin-left:10px'>" + check[ck].content
      }
    }
    content = content.replace(STR_CHECK + checkList[c].slice(4) + STR_M_E, value);
  }
  doc.innerHTML = content;

  // radio $RADIO[]数组
  let radioList = getTableName(content, STR_RADIO);
  // console.log('radioList', radioList)
  for (let ra = 0; ra < radioList.length; ra++) {
    var value = "";
    let radio = domHtml[radioList[ra].slice(4)] || '';
    // console.log('radio', radio)
    for (let ro = 0; ro < radio.length; ro++) {
      if (radio[ro].content == undefined) {
        value = "";
      } else if (radio[ro].select == 'checked') {
        value += "<input type='radio' checked>" + radio[ro].content
      } else {
        value += "<input type='radio'>" + radio[ro].content
      }
    }
    content = content.replace(STR_RADIO + radioList[ra].slice(4) + STR_M_E, value);
  }
  doc.innerHTML = content;

  // $N 设置整行边框
  let tdBorderLists = getTableName(content, STR_N);
  let trArrs = doc.getElementsByTagName("tr");
  for (let tr = 0; tr < trArrs.length; tr++) {
    let trs = trArrs[tr].childNodes;
    for (let t = 0; t < trs.length; t++) {
      if (trs[t].innerHTML.indexOf(STR_N) > -1) {

        for (let l = 0; l < trs.length; l++) {
          let val = trs[l]
          val.style.borderLeft = '0px solid transparent';
          val.style.borderRight = '0px solid transparent';
          val.style.borderTop = '0px solid transparent';
          val.style.borderBottom = '0px solid transparent';
          if (tdBorderLists[indexTd].indexOf("m") == -1) {
            if (tr > 0) {
              trArrs[tr - 1].childNodes[l].style.borderBottom = '0px solid transparent';
            }
            if (tr < trArrs.length - 1) {
              trArrs[tr + 1].childNodes[l].style.borderTop = '0px solid transparent';
            }
          }
          if (tdBorderLists[indexTd].indexOf("t") > -1) {
            val.style.borderTop = '1px solid #000';
          }
          if (tdBorderLists[indexTd].indexOf("b") > -1) {
            val.style.borderBottom = '1px solid #000'
          }
          if (tdBorderLists[indexTd].indexOf("l") > -1) {
            trs[0].style.borderLeft = '1px solid #000'
          }
          if (tdBorderLists[indexTd].indexOf("r") > -1) {
            trs[trs.length - 1].style.borderRight = '1px solid #000'
          }
        }
        indexTd++;
      }
    }
  }


  //某个单元格上下左右边框不显示
  let indexTDH = 0;
  let tBorderHiddenList = getTableName(content, STR_C);
  for (let tr = 0; tr < trArrs.length; tr++) {
    let trs = trArrs[tr].childNodes;
    for (let t = 0; t < trs.length; t++) {
      if (trs[t].innerHTML.indexOf(STR_C) > -1) {
        let val = trs[t]
        let tdh = tBorderHiddenList[indexTDH];
        if (tdh.indexOf("l") > -1) {
          val.style.borderLeft = "0px solid transparent";
          if (t > 0) {
            trs[t - 1].style.borderRight = "0px solid transparent"
          }
        }
        if (tdh.indexOf("r") > -1) {
          val.style.borderRight = "0px solid transparent";
          if (t < trs.length - 1) {
            trs[t + 1].style.borderLeft = "0px solid transparent"
          }
        }
        if (tdh.indexOf("t") > -1) {
          val.style.borderTop = "0px solid transparent";
          if (tr > 0) {
            trArrs[tr - 1].childNodes[t].style.borderBottom = "0px solid transparent";
          }
        }
        if (tdh.indexOf("b") > -1) {
          val.style.borderBottom = "0px solid transparent";
          if (tr < trArrs.length - 1) {
            trArrs[tr + 1].childNodes[t].style.borderTop = "0px solid transparent"
          }
        }
        indexTDH++;
      }

    }
  }

  //某个单元格上下左右边框显示
  let indexBC = 0;
  let tBorderShowList = getTableName(content, STR_BC);
  for (let tr = 0; tr < trArrs.length; tr++) {
    let trs = trArrs[tr].childNodes;
    for (let t = 0; t < trs.length; t++) {
      if (trs[t].innerHTML.indexOf(STR_BC) > -1) {
        let val = trs[t]
        let tdh = tBorderShowList[indexBC];
        if (tdh.indexOf("l") > -1) {
          val.style.borderLeft = "1px solid #000";
        }
        if (tdh.indexOf("r") > -1) {
          val.style.borderRight = "1px solid #000";

        }
        if (tdh.indexOf("t") > -1) {
          val.style.borderTop = "1px solid #000";
        }
        if (tdh.indexOf("b") > -1) {
          val.style.borderBottom = "1px solid #000";
        }
        indexBC++;
      }
    }
  }


  //某个TH字体是否加粗
  let indexTHW = 0;
  let thArrs = doc.getElementsByTagName("th")
  let tWeightList = getTableName(content, STR_TW);
  for (let tw = 0; tw < thArrs.length; tw++) {
    if (thArrs[tw].innerHTML.indexOf(STR_TW) > -1) {
      thArrs[tw].style.fontWeight = tWeightList[indexTHW].slice(1);
      indexTHW++;
    }
  }


  //加载表格中的数据
  for (let k = 0; k < titleList.length; k++) {
    content = getTable(doc, titleList[k], domResult, typeData);
    doc.innerHTML = content;
  }
  /**
   * 空白替代标签/或者内容替代标签
   */
  // 空白替代$N[]
  indexTd = 0;
  let tdBorderList = getTableName(content, STR_N);
  let trs = doc.getElementsByTagName("tr");
  for (let r = 0; r < trs.length; r++) {
    let tds = trs[r].childNodes;
    for (let td = 0; td < tds.length; td++) {
      if (tds[td].innerHTML.indexOf(STR_N) > -1) {
        content = content.replace(STR_N + tdBorderList[indexTd] + STR_M_E, "");
        indexTd++;
      }
    }

  }


  indexTHW = 0;
  let thArrss = doc.getElementsByTagName("th")
  let tWeightLists = getTableName(content, STR_TW);
  for (let tws = 0; tws < thArrss.length; tws++) {
    if (thArrss[tws].innerHTML.indexOf(STR_TW) > -1) {
      content = content.replace(STR_TW + tWeightLists[indexTHW].slice(1) + STR_M_E, "");
      indexTHW++;
    }
  }



  indexTDH = 0;
  let tBorderHiddenLists = getTableName(content, STR_C);
  let trss = doc.getElementsByTagName("tr");
  for (let rs = 0; rs < trss.length; rs++) {
    let tdss = trss[rs].childNodes;
    for (let td = 0; td < tdss.length; td++) {
      if (tdss[td].innerHTML.indexOf(STR_C) > -1) {
        content = content.replace(STR_C + tBorderHiddenLists[indexTDH] + STR_M_E, "");
        indexTDH++;
      }
    }
  }

  indexBC = 0;
  let tdBorderShowList = getTableName(content, STR_BC);
  let trsss = doc.getElementsByTagName("tr");
  for (let rs = 0; rs < trsss.length; rs++) {
    let tdss = trss[rs].childNodes;
    for (let td = 0; td < tdss.length; td++) {
      if (tdss[td].innerHTML.indexOf(STR_BC) > -1) {
        content = content.replace(STR_BC + tdBorderShowList[indexTDH].slice(1) + STR_M_E, "");
        indexBC++;
      }
    }
  }


  // 竖向合计数据
  let amountList = getTableName(content, STR_A)
  for (let m = 0; m < amountList.length; m++) {
    for (let jh = 0; jh < titleList.length; jh++) {
      var value = 0;
      for (let k = 0; k < domResult[titleList[jh]].length; k++) {
        let amountArr = amountList[m].split(',')
        let amountNum = 0;
        for (let p = 0; p < amountArr.length; p++) {

          amountNum += parseFloat(domResult[titleList[jh]][k][amountArr[p]])
        }
        value += amountNum;
      }
      if (!value && value != 0) {
        value = ""
      }
      content = content.replace(STR_A + amountList[m] + STR_M_E, value);
    }
  }

  //平均数竖向合计
  let aadList = getTableName(content, STR_AAD)
  for (let m = 0; m < aadList.length; m++) {
    for (let jv = 0; jv < titleList.length; jv++) {
      var value = 0;
      let aadLength = 0;
      for (let k = 0; k < domResult[titleList[jv]].length; k++) {
        let amountArr1 = aadList[m].slice(2).split(',')
        let amountNum1 = 0;
        aadLength = amountArr1.length;
        for (let p = 0; p < amountArr1.length; p++) {

          amountNum1 += parseFloat(domResult[titleList[jv]][k][amountArr1[p]])
        }
        value += amountNum1;
      }
      value = value / aadLength;
      if (!value) {
        value = ""
      }
      content = content.replace(STR_AAD + aadList[m].slice(2) + STR_M_E, value);
    }
  }

  //加载斜线
  let litem = getTableName(content, STR_L);
  let ritem = getTableName(content, STR_R);
  for (let p = 0; p < titleList.length; p++) {
    content = addtemplate(doc, titleList[p], content);
  }


  //加载二维码(若果传的是链接值，则扫码后会跳到相应链接)

  let qrList = getTableName(content, STR_E);
  if (qrList.length > 0) {
    for (let qr = 0; qr < qrList.length; qr++) {
      if (!domResult[qrList[qr].toString()]) {
        content = content.replace(STR_E + qrList[qr].toString() + STR_M_E, "");
      } else {
        content = content.replace(STR_E + qrList[qr].toString() + STR_M_E, "<canvas id='" + qrList[qr].toString() + "'></canvas>");
      }
    }
  }
  let barList = getTableName(content, STR_Bar);
  if (barList.length > 0) {

    for (let bar = 0; bar < barList.length; bar++) {
      let barArr;
      let strStr = barList[bar]
      if (strStr.indexOf(",") > 0) {
        let bArr = barList[bar].split(",");
        barArr = bArr[0]
      } else {
        barArr = barList[bar];
      }
      if (!domResult[barArr.toString()]) {
        content = content.replace(STR_Bar + barList[bar].toString() + STR_M_E, "");
      } else {
        content = content.replace(STR_Bar + barList[bar].toString() + STR_M_E, "<canvas id='" + barArr.toString() + "'></canvas>");

      }

    }
  };
  let soMap = new Object();
  soMap[STR_DOM] = content;
  soMap["qrList"] = qrList;
  soMap["barList"] = barList;

  if (litem.length > 0) {
    soMap["litem"] = litem;
    soMap["ritem"] = ritem;
  }
  return handleStr(soMap, domResult, domHtml);
}

/**
 * 
 * @param {*} domVal dom 元素
 * @param {*} header STR_N类似
 */
export function getTableName(domVal, header) {
  let content = domVal;
  let index = 0;
  let textList = [];
  while (index > -1) {
    index = content.indexOf(header);
    if (index > -1) {
      content = content.substring(index);
      let lastIndex = content.indexOf(STR_M_E) + 1;
      let textItem = content.substring(0, lastIndex);
      textList.push(textItem);
      content = content.substring(lastIndex);
    }
    else {
      break;
    }
  }
  for (let i = 0; i < textList.length; i++) {
    let str = textList[i].substring(3, textList[i].length - 1);
    textList[i] = str;
  }

  return textList;
}

/**
 * 
 * @param {*} doc 
 * @param {*} tableName 
 */
export function addTitle(doc, tableName) {
  var content = doc.innerHTML;
  let table = doc.getElementsByTagName("table");
  let trsStr = STR_BLANK;
  let newTrsStr = STR_BLANK;
  for (let k = 0; k < table.length; k++) {
    if (table[k].getAttribute("id") == tableName) {
      let trs = table[k].querySelectorAll(STR_TR);
      for (let i = 0; i < trs.length; i++) {
        let ths = trs[i].querySelectorAll(STR_TH);
        if (ths.length > 0) {
          trsStr = trsStr + trs[i].outerHTML;
          // trsStr = trsStr.replaceAll(STR_REGEX_HTML, STR_BLANK);
          //System.out.println(trsStr);

        }
      }
      newTrsStr = "<thead>" + trsStr + "</thead>";
      break;
    }
  }
  content = content.replace(trsStr, newTrsStr);

  return content;
}

/**
 * 加载斜线
 * @param doc
 * @param tableName
 * @param tableContext
 * @return
 */
export function addtemplate(doc, tableName, tableContext) {

  let table = doc.getElementsByTagName("table");

  for (let k = 0; k < table.length; k++) {
    if (table[k].getAttribute("id") == tableName) {
      let trs = table[k].querySelectorAll(STR_TR);

      let flag = 0;
      let rowIndex = 0;
      let cellIndex = 0;
      for (let i = 0; i < trs.length; i++) {
        let tds = trs[i].querySelectorAll(STR_TH);

        for (let j = 0; j < tds.length; j++) {
          let tableInfo = tds[j].innerHTML;
          if (tableInfo.indexOf(STR_L) > -1) {
            rowIndex = i;
            cellIndex = j;
            flag = 1;
            break;
          }
        }
        if (flag > 0) {
          break;
        }
      }

      if (flag > 0) {

        let row = table[k].querySelectorAll(STR_TR)[rowIndex].querySelectorAll(STR_TH)[cellIndex];
        let row2 = row.outerHTML;
        row.setAttribute("id", "lineTd");
        let height = setHight(doc, tableName);
        row.setAttribute("height", height + STR_BLANK);
        let items = row.outerHTML;
        let newRow = "<canvas id=\"myCanvas\" style=\"width: 90px;height: 60px;\"></canvas>";
        items = items.replace(row.innerHTML, newRow);
        tableContext = tableContext.replace(row2, items);
      }
    }
  }

  return tableContext;

}

/**
 * 斜线格高度的获取
 * @param doc
 * @param tableName
 * @return
 */
export function setHight(doc, tableName) {
  let table = doc.getElementsByTagName("table");
  let height;
  let str = STR_BLANK;
  for (let k = 0; k < table.length; k++) {
    if (table[k].getAttribute("id") == tableName) {
      let tableContext = table[k].innerHTML;
      if (tableContext.indexOf(STR_H) > -1) {
        let index = tableContext.indexOf(STR_H);
        str = tableContext.substring(index);
        str = str.substring(3, str.indexOf(STR_M_E));

      } else {
        str = 50;
      }

      break;

    }
  }

  height = str;
  return height;
}

/**
 * 加载表格中的数据
 * @param doc
 * @param tableName
 * @param dataR
 * @return
 */

export function getTable(doc, tableName, dataR, typeData) {
  let dataList = [];
  if (typeData == 'typeData') {
    dataList = commonArr;
  } else {
    dataList = dataR[tableName];
  }

  let dataLists = dataR[tableName]
  // let dataList = commonArr;
  var content = doc.innerHTML;
  let table = doc.getElementsByTagName("table");

  let kk = 0;
  let trsStr = STR_BLANK;
  let cfStr = STR_BLANK;
  let newTrsStr = STR_BLANK;
  let newImgsStr = STR_BLANK;
  let indexCf = 0;
  let indexTdCf = 0;
  for (let k = 0; k < table.length; k++) {
    if (table[k].getAttribute("id") == tableName) {
      var trs = table[k].querySelectorAll(STR_TR);
      for (let i = 0; i < trs.length; i++) {
        var tds = trs[i].querySelectorAll(STR_TD);
        if (tds.length > 0) {
          trsStr = trs[i].outerHTML;
          if (trsStr.indexOf(STR_F) > 0 || trsStr.indexOf(STR_FM) > 0 || trsStr.indexOf(STR_P) > 0) {
            break;
          } else if (trsStr.indexOf(STR_CF) >= 0 || trsStr.indexOf(STR_CM) >= 0) {
            indexTdCf = i;
            break;
          } else {
            trsStr = STR_BLANK;
          }

          // newTrsStr = trs[i].innerHTML;
        }
      }

      // 高不改变的数据
      let cfLength = 0;
      let tdIndex = [];
      let tdDom = [];
      let cStr;
      let length = 0;
      if (!dataList) {
        length = 0;
      } else {
        if (indexTdCf + dataList.length >= trs.length) {
          length = trs.length;
        } else {
          length = indexTdCf + dataList.length;
        }
      }
      if (length - indexTdCf > 0) {
        for (let cf = 0; cf < length; cf++) {
          var tds = trs[cf].querySelectorAll(STR_TD);
          if (tds.length > 0) {
            cStr = trs[cf].outerHTML;
            cfStr = cStr;
            indexCf = 0;
            for (let t = 0; t < tds.length; t++) {
              let tdStr = tds[t].outerHTML;
              let tdVal = tdStr;
              if (cf > indexTdCf && tdIndex.indexOf(t) >= 0) {
                tdVal = tdDom[tdIndex.indexOf(t)]
              }
              if (tdVal.indexOf(STR_CF) >= 0 || tdVal.indexOf(STR_CM) >= 0) {
                if (cf == indexTdCf) {
                  tdIndex.push(t);
                  tdDom.push(tds[t].outerHTML)
                }
                let tfList = getTableName(tdVal, STR_CF);
                for (let tf = 0; tf < tfList.length; tf++) {
                  let tfTd = tfList[tf].slice(1);
                  if (tfTd.indexOf(',') == -1) {
                    if (dataList[cf - indexTdCf][tfTd] == undefined) {
                      tdVal = tdVal.replace(STR_CF + tfTd + STR_M_E, "")
                    } else {
                      tdVal = tdVal.replace(STR_CF + tfTd + STR_M_E, dataList[cf - indexTdCf][tfTd])
                    }
                  } else {
                    let arr = tfTd.split(',');
                    if (arr[1] > cf - indexTdCf) {
                      if (dataList[cf - indexTdCf][arr[0]] == undefined) {
                        tdVal = tdVal.replace(STR_CF + tfTd + STR_M_E, "")
                      } else {
                        tdVal = tdVal.replace(STR_CF + tfTd + STR_M_E, dataList[cf - indexTdCf][arr[0]])
                      }
                    } else {
                      tdVal = tdVal.replace(STR_CF + tfTd + STR_M_E, "")
                    }
                  }
                  indexCf++;
                }
                let cmList = getTableName(tdVal, STR_CM);
                for (let cm = 0; cm < cmList.length; cm++) {
                  let cmTd = cmList[cm].slice(1);
                  if (cmTd.indexOf(',') == -1) {
                    if (dataList[cf - indexTdCf][cmTd] == undefined) {
                      tdVal = tdVal.replace(STR_CM + cmTd + STR_M_E, "")
                    } else {
                      let imgval = "<img src='" + dataList[cf - indexTdCf][cmTd] + "' style='width:80%;heigth:80%;margin-top:10%;margin-left:10%'></img>"
                      tdVal = tdVal.replace(STR_CM + cmTd + STR_M_E, imgval)
                    }
                  } else {
                    let arr = cmTd.split(',');
                    if (arr[1] > cf - indexTdCf) {
                      if (dataList[cf - indexTdCf][arr[0]] == undefined) {
                        tdVal = tdVal.replace(STR_CM + cmTd + STR_M_E, "")
                      } else {
                        let imgval = "<img src='" + dataList[cf - indexTdCf][arr[0]] + "' style='width:80%;heigth:80%;margin-top:10%;margin-left:10%'></img>"
                        tdVal = tdVal.replace(STR_CM + cmTd + STR_M_E, imgval)
                      }
                    } else {
                      tdVal = tdVal.replace(STR_CM + cmTd + STR_M_E, "")
                    }
                  }
                  indexCf++;
                }

                cfStr = cfStr.replace(tdStr, tdVal);
              }

            }
            content = content.replace(cStr, cfStr);
          }
        }
      } else {
        if (trsStr.indexOf(STR_CF) >= 0 || trsStr.indexOf(STR_CM) >= 0) {
          let cfLi = getTableName(trsStr, STR_CF);
          let cmLi = getTableName(trsStr, STR_CM);

          let trCtr = trsStr;
          for (let c = 0; c < cfLi.length; c++) {
            trCtr = trCtr.replace(STR_CF + cfLi[c].slice(1) + STR_M_E, "")
          }
          for (let cmc = 0; cmc < cmLi.length; cmc++) {
            trCtr = trCtr.replace(STR_CM + cmLi[cmc].slice(1) + STR_M_E, "")
          }
          content = content.replace(trsStr, trCtr)
        }

      }
      //横向赋值
      for (let i = 0; i < trs.length; i++) {
        var tds = trs[i].querySelectorAll(STR_TD);
        if (tds.length > 0 && trs[i].outerHTML.indexOf(STR_K) > 0 || tds.length > 0 && trs[i].outerHTML.indexOf(STR_KM) > 0 || tds.length > 0 && trs[i].outerHTML.indexOf(STR_PV) > 0) {
          let k = 0;
          let valueName = "";
          let isImg = false;
          let isPV = false;  //是否表达式
          // console.log('isPV', isPV);
          for (let j = 0; j < tds.length; j++) {
            if (tds[j].outerHTML.indexOf(STR_K) > 0 || tds[j].outerHTML.indexOf(STR_KM) > 0 || tds[j].outerHTML.indexOf(STR_PV) >= 0) {
              k = j;
              if (tds[j].outerHTML.indexOf(STR_KM) > 0) {
                isImg = true;
              } else if (tds[j].outerHTML.indexOf(STR_PV) >= 0) {
                isPV = true;
              }

              valueName = tds[j].outerHTML.substr(tds[j].outerHTML.indexOf("[") + 1, tds[j].outerHTML.indexOf("]") - tds[j].outerHTML.indexOf("[") - 1);
              break;
            }
          }
          let val = 0;
          let oldTrsStr = trs[i].outerHTML;
          for (let j = k; j < tds.length; j++) {
            if (dataList != null && val < dataList.length) {
              var value = "";
              // 横向表达式
              if (isPV) {
                var con = dataList[val];
                let valName = valueName.split(",")
                let str = eval(valName[valName.length - 1]);
                value = str || "";

              } else if (dataList[val][valueName] == undefined) {
                value = "";
              } else {

                if (isImg) {
                  value = "<img src='" + dataList[val][valueName] + "' style='width:80%;heigth:80%;margin-top:10%;margin-left:10%'></img>"
                } else {
                  value = dataList[val][valueName];
                }

              }
              var tt = tds[j].outerHTML.substr(0, tds[j].outerHTML.indexOf(">") + 1) + value + "</td>";
              tds[j].outerHTML = tt;
              val++;
            } else {
              var tt = tds[j].outerHTML;
              tt = tt.replace(STR_K + valueName + STR_M_E, "");
              tds[j].outerHTML = tt;
              break;
            }
          }
          content = content.replace(oldTrsStr, trs[i].outerHTML);
          if (tds.length - k < dataR[tableName].length) {
            tableStatic.sliceLength = tds.length - k;
            tableStatic.tableName = tableName;
          } else {
            tableStatic.sliceLength = 0;
            tableStatic.tableName = tableName;
          }
        }
      }
    }
  }

  let newTBody = STR_BLANK;
  let tdList = getTableName(trsStr, STR_F);


  let vaList = getTableName(trsStr, STR_VA)
  let adList = getTableName(trsStr, STR_AD)
  let tdImgList = getTableName(trsStr, STR_FM);
  let conditionList = getTableName(trsStr, STR_P);
  if (dataList != null) {
    for (let i = 0; i < dataList.length; i++) {
      newTrsStr = trsStr;
      for (let k = 0; k < tdList.length; k++) {
        if (tdList[k].indexOf('-') == -1) {
          var value = "";
          if (dataList[i][tdList[k]] == undefined) {
            value = "";
          } else {
            value = dataList[i][tdList[k]];
          }
          // console.log("tdList[k].slice(0#####111", tdList[k].slice(0));
          // console.log("#222ffffFvaluevalue", value);
          newTrsStr = newTrsStr.replace(STR_F + tdList[k] + STR_M_E, value);
          // console.log("newTrsStr###", newTrsStr);
        } else {
          var value = [];
          var val = '';
          var arrFa = tdList[k].split("-");
          var list = dataList[i][arrFa[0]];
          if (list == undefined) {
            val = ''
          } else {
            for (var fa = 0; fa < list.length; fa++) {
              if (list[fa] == undefined) {
                val += "<tr><td><br></td></tr>";
              } else {
                let height = ""
                let lHeight = "";
                let mLength;
                if (arrFa && arrFa[3] && arrFa[3].indexOf("l") >= 0) {
                  lHeight = "line-height:" + arrFa[3].slice(1) + "px;"
                } else {
                  lHeight = ""
                }
                if (arrFa && arrFa[4] && arrFa[4].indexOf("h") >= 0) {
                  height = "max-height:" + parseFloat(arrFa[4].slice(1)) + "px;"
                } else {
                  height = "height:" + parseFloat(arrFa[4]) + "px;"
                }
                if (arrFa && arrFa[5] && arrFa[5].indexOf("ml") >= 0) {
                  mLength = parseFloat(arrFa[5] && arrFa[5].slice(2))
                }
                // height = parseFloat(arrFa[3]) || 30;
                var border = parseFloat(arrFa[2]) || 0;
                var align = 'text-align:left;'
                let dataVal = ""
                if (mLength) {
                  if (arrFa[1].indexOf(",") == -1) {
                    if (list[fa] && arrFa[1] && list[fa][arrFa[1]].length > mLength) {
                      dataVal = list[fa][arrFa[1]].slice(0, mLength);
                    } else {
                      dataVal = list[fa][arrFa[1]];
                    }
                  } else {
                    let arF = arrFa[1].split(",");
                    for (let af = 0; af < arF.length; af++) {
                      if (list[fa] && arF[af] && list[fa][arF[af]].length > mLength) {
                        dataVal += list[fa][arF[af]].slice(0, mLength);
                      } else {
                        dataVal += list[fa][arF[af]];
                      }
                    }

                  }

                } else {
                  if (arrFa[1].indexOf(",") == -1) {
                    dataVal = list[fa][arrFa[1]];

                  } else {
                    let arF = arrFa[1].split(",");
                    for (let af = 0; af < arF.length; af++) {
                      dataVal += list[fa][arF[af]];
                    }
                  }
                  // dataVal = list[fa][arrFa[1]];
                }

                if (arrFa.indexOf('r') >= 0) {
                  align = "text-align:right;"
                } else if (arrFa.indexOf('c') >= 0) {
                  align = "text-align:center;"
                } else {
                  align = 'text-align:left;';
                }
                if (fa == 0) {
                  if (arrFa.indexOf('t') >= 0) {
                    val += "<tr><td style='width:100%;" + align + "border-top:" + border + "px solid #000'><div style='" + height + lHeight + "overflow:hidden'>" + dataVal + '</div></td></tr>';
                  } else {
                    val += "<tr><td style='width:100%;" + align + "'><div style='" + height + lHeight + "overflow:hidden'>" + dataVal + '</div></td></tr>';
                  }
                } else if (fa == list.length - 1) {
                  if (arrFa.indexOf('b') >= 0) {
                    val += "<tr><td  style='width:100%;" + align + "border-bottom:" + border + "px solid #000;border-top:" + border + "px solid #000'><div style='" + height + lHeight + "overflow:hidden'>" + dataVal + '</div></td></tr>';
                  } else {
                    val += "<tr><td  style='width:100%;" + align + "border-top:" + border + "px solid #000'><div style='" + height + lHeight + "overflow:hidden'>" + dataVal + '</div></td></tr>';
                  }
                } else {
                  val += "<tr><td style='width:100%;" + align + "border-top:" + border + "px solid #000'><div style='" + height + lHeight + "overflow:hidden'>" + dataVal + '</div></td></tr>';
                }
              }
            }
          }

          var vall = '<table style="width:100%"  border="0">' + val + '</table>'
          // console.log("tdList[k].slice(0#####22222", tdList[k].slice(0));

          newTrsStr = newTrsStr.replace(STR_F + tdList[k].slice(0) + STR_M_E, vall);
        }
      }





      //横向合计
      for (let v = 0; v < vaList.length; v++) {
        let str = vaList[v].slice(1)
        if (str.indexOf(",*") >= 0) {
          let arr = str.split(",*")
          let val = 1;
          for (let a = 0; a < arr.length; a++) {
            if (dataList[i][arr[a]] == undefined) {
              val = val;
            } else {
              let num = parseFloat(dataList[i][arr[a]]);
              if (num) {
                val = val * num;
              } else {
                val = ""
              }
            }
          }
          newTrsStr = newTrsStr.replace(STR_VA + vaList[v].slice(1) + STR_M_E, val);
        } else if (str.indexOf(",/") >= 0) {
          let arr = str.split(",/")
          let val;
          for (let a = 0; a < arr.length; a++) {
            if (dataList[i][arr[a]] == undefined) {
              val = val;
            } else {
              let num = parseFloat(dataList[i][arr[a]]);
              if (a == 0) {
                val = num;
              } else {
                if (num) {
                  val = val / num;
                } else {
                  val = ""
                }
              }
            }
          }
          newTrsStr = newTrsStr.replace(STR_VA + vaList[v].slice(1) + STR_M_E, val);
        } else if (str.indexOf(",-") >= 0) {//减法
          let arr = str.split(",-")
          let val;
          for (let a = 0; a < arr.length; a++) {
            if (dataList[i][arr[a]] == undefined) {
              val = val;
            } else {
              let num = parseFloat(dataList[i][arr[a]]);
              if (a == 0) {
                val = num;
              } else {
                if (num) {
                  val = val - num;
                } else {
                  val = ""
                }
              }
            }
          }
          newTrsStr = newTrsStr.replace(STR_VA + vaList[v].slice(1) + STR_M_E, val);
        } else if (str.indexOf(",+") >= 0) {
          let arr = str.split(",+")
          let val = 0;
          for (let a = 0; a < arr.length; a++) {
            if (dataList[i][arr[a]] == undefined) {
              val += 0;
            } else {
              let num = parseFloat(dataList[i][arr[a]]);
              if (num) {
                val += num;
              } else {
                val = ""
              }

            }
          }
          newTrsStr = newTrsStr.replace(STR_VA + vaList[v].slice(1) + STR_M_E, val);
        } else {
          newTrsStr = newTrsStr.replace(STR_VA + vaList[v].slice(1) + STR_M_E, "");
        }

      }
      //横向平均数
      let adlength = 0;
      for (let v = 0; v < adList.length; v++) {
        let str = adList[v].slice(1)
        let arr = str.split(",")
        adlength = arr.length;
        let val = 0;
        for (let a = 0; a < arr.length; a++) {
          if (dataList[i][arr[a]] == undefined) {
            val += 0;
          } else {
            let num = parseFloat(dataList[i][arr[a]]);
            if (num) {
              val += num;
            } else {
              val = ""
            }

          }
        }
        if (val) {
          val = val / adlength;
        }
        newTrsStr = newTrsStr.replace(STR_AD + adList[v].slice(1) + STR_M_E, val);
      }


      for (let p = 0; p < tdImgList.length; p++) {
        var value = "";
        if (dataList[i][tdImgList[p].slice(1)] == undefined) {
          value = "";
        } else {
          value = "<img src='" + dataList[i][tdImgList[p].slice(1)] + "' style='width:80%;heigth:80%;margin-top:10%;margin-left:10%'></img>"
        }
        newTrsStr = newTrsStr.replace(STR_FM + tdImgList[p].slice(1) + STR_M_E, value);

      }

      // 纵向表达式
      for (let co = 0; co < conditionList.length; co++) {
        var value = "";
        let arrCondition = conditionList[co].split(",")
        if (dataList[i][arrCondition[0]] == undefined) {
          value = "";
        } else {

          var con = dataList[i];
          // console.log('object', arrCondition[arrCondition.length - 1])
          let str = eval(arrCondition[arrCondition.length - 1]);
          value = str;
        }
        newTrsStr = newTrsStr.replace(STR_P + conditionList[co] + STR_M_E, value);
      }
      newTBody = newTBody + newTrsStr;
    }
  } else {
    newTrsStr = trsStr;
    for (let k = 0; k < tdList.length; k++) {
      newTrsStr = newTrsStr.replace(STR_F + tdList[k] + STR_M_E, "");
    }
    for (let m = 0; m < tdImgList.length; m++) {
      newTrsStr = newTrsStr.replace(STR_FM + tdImgList[m].slice(1) + STR_M_E, "");
    }
    newTBody = newTrsStr;
  }

  content = content.replace(trsStr, newTBody);

  return content;
}
/**
 * 处理表格数据
 * @param dataResult
 * @param dataR
 * @return
 */
export function handleStr(dataResult, dataR, allData) {
  // console.log("dataR", dataR)
  let newDiv = document.createElement("div");
  newDiv.innerHTML = dataResult.domStr;
  // console.log('dataResult.domStr######', dataResult)
  let table = newDiv.getElementsByTagName("th");
  for (let i = 0; i < table.length; i++) {
    if (table[i].getAttribute("id") == "lineTd") {

      let litem = dataResult.litem;
      let ritem = dataResult.ritem;
      let myCanvas = table[i].getElementsByTagName("canvas");

      myCanvas[0].width = table[i].getAttribute("width");
      //myCanvas[0].width = table[i].clientWidth;
      myCanvas[0].height = table[i].getAttribute("height");
      //myCanvas[0].height = table[i].clientHeight;
      let width = myCanvas[0].width;
      let height = myCanvas[0].height;

      let ctx = myCanvas[0].getContext("2d");
      ctx.moveTo(0, 0);
      ctx.lineTo(width, height);
      ctx.lineWidth = 2;
      ctx.stroke();

      let dataURL = myCanvas[0].toDataURL("image/png");
      let html = `<div style="position: relative">
                          <img src="${dataURL}" width="${width}" height="${height}" />
                          <div style="position: absolute; top: 6px; right: 6px;">${ritem}</div>
                          <div style="position: absolute; bottom: 6px; left: 6px;">${litem}</div>
                        </div>`;
      myCanvas[0].parentNode.innerHTML = html; //'<img src="'+dataURL+'" width="'+width+'" height="'+height+'" >';
    }
  }
  let canvass = newDiv.getElementsByTagName("canvas");
  console.log('object', dataResult)
  let qrList = dataResult.qrList;
  let barList = dataResult.barList;
  let index = 0;

  let ids = [];
  let barData = barList[index];
  let barWidth = 1.0;
  let barHeight = 70;
  if (barList && barList[index] && barList[index].indexOf(",") > 0) {
    let arr = barList[index].split(",");
    if (arr.length == 2) {
      barData = arr[0];
      barWidth = arr[1]
    } else if (arr.length == 3) {
      barData = arr[0];
      barWidth = arr[1];
      barHeight = arr[2];
    }
  }
  for (var i = 0; i < canvass.length; i++) {
    ids.push(canvass[i].getAttribute("id"))
  }
  for (let i = 0; i < ids.length; i++) {
    if (ids[i] == qrList[index]) {
      QRCode.toCanvas(canvass[0], dataR[qrList[index]], function (error) {

      })
    }

    if (ids[i] == barData) {
      // console.log('dataR[barList[index]]##', dataR[barList[index]])
      JsBarcode(canvass[0], dataR[barData], {
        text: "",
        format: "CODE39",
        // format:"EAN13",
        displayValue: false,
        width: parseFloat(barWidth),
        height: parseFloat(barHeight),
        margin: 0,
      })
    }
    let dataURL = canvass[0].toDataURL("image/png");
    canvass[0].parentNode.innerHTML = '<img src="' + dataURL + '">';
  }
  return newDiv.innerHTML;


}

