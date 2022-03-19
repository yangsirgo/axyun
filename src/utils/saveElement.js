import { insertEle } from "@/api/emrRecord/emr/element.js";

let saveElement = function (param) {
  let dataToServer = {
    commonAttributeDto: {
      checkDeletable: param.isDel == "on" ? "1" : "0",
      checkDirectCite: param.checkDirectCite == "on" ? "1" : "0",
      checkDisplay: param.showBorder == "on" ? "1" : "0",
      checkEdit: param.isEdit == "on" ? "1" : "0",
      checkEmpty: param.isEmpty == "on" ? "1" : "0",
      checkHidden: param.isHide == "on" ? "1" : "0",
      checkPrintable: param.isPrint == "on" ? "1" : "0",
      checkReadonly: param.readonly == "on" ? "1" : "0",
      checkReference: param.quot == "on" ? "1" : "0",
      checkSecret: param.isSecret == "on" ? "1" : "0",
      checkSource: param.source == "on" ? "1" : "0",
      defaultValues: param.defaultVal,
      // "endPlaceholder": this.endBorderPlaceHolder,
      placeholderText: param.placeholderText,
      // "startPlaceholder": this.startBorderPlaceHolder,
      tooltipText: param.tipText,
      nameStyle: param.namepos,
      borderType: param.borderType,
      borderStyle: param.borderStyle,
      borderPlaceholder: param.stainholder == "on" ? "1" : "0"
    },
    dataElementId: param.metaData ? JSON.parse(param.metaData).id : "",
    dataElementName: param.metaData ? JSON.parse(param.metaData).label : "",
    elementBaseId: param.elementBaseId,
    elementBaseName: param.elementBaseName,
    elementCode: param.id,
    elementName: param.name,
    proprietaryAttributeVoLst: [],
    valueLst: []
  };
  let metaJson = param.metaData?JSON.parse(param.metaData): "";
  if (typeof param.options == "string") {
    param.options = JSON.parse(param.options);
  }

  switch (param.elementBaseName) {
    case "文本元素": {
      let array = [
        {
          proprietaryCode: "0100",
          proprietaryContent: param.maxLen,
          proprietaryName: "最大长度"
        },
        {
          proprietaryCode: "0101",
          proprietaryContent: param.minLen,
          proprietaryName: "最小长度"
        }
      ];
      dataToServer.proprietaryAttributeVoLst = [
        ...dataToServer.proprietaryAttributeVoLst,
        ...array
      ];
      break;
    }
    case "数字元素": {
      let array = [
        {
          proprietaryCode: "0300",
          proprietaryContent: param.elemUnit,
          proprietaryName: "元素单位"
        },
        {
          proprietaryCode: "0301",
          proprietaryContent: param.eleUnitContr == "on" ? "1" : "0",
          proprietaryName: "显示标记"
        },
        {
          proprietaryCode: "0302",
          proprietaryContent: param.numAccuracy,
          proprietaryName: "小数位数"
        },
        {
          proprietaryCode: "0303",
          proprietaryContent: param.valMin,
          proprietaryName: "值域范围最小值"
        },
        {
          proprietaryCode: "0304",
          proprietaryContent: param.valMax,
          proprietaryName: "值域范围最大值"
        },
        {
          proprietaryCode: "0305",
          proprietaryContent: param.normalMin,
          proprietaryName: "正常值值域范围最小值"
        },
        {
          proprietaryCode: "0306",
          proprietaryContent: param.normalMax,
          proprietaryName: "正常值值域范围最大值"
        }
      ];
      dataToServer.proprietaryAttributeVoLst = [
        ...dataToServer.proprietaryAttributeVoLst,
        ...array
      ];
      break;
    }
    case "单选元素": {
      let array = [
        {
          proprietaryCode: "0400",
          proprietaryContent: "1",
          proprietaryName: "字典/自定义值域标记"
        },
        {
          proprietaryCode: "0401",
          proprietaryContent: "",
          proprietaryName: "转为单元框元素"
        },
        {
          proprietaryCode: "0402",
          proprietaryContent: metaJson? metaJson.value: "",
          proprietaryName: "值域ID"
        },
        {
          proprietaryCode: "0403",
          proprietaryContent: metaJson? metaJson.code: "",
          proprietaryName: "值域编码"
        },
        {
          proprietaryCode: "0404",
          proprietaryContent: metaJson? metaJson.label: "",
          proprietaryName: "值域名称"
        }
      ];
      dataToServer.proprietaryAttributeVoLst = [
        ...dataToServer.proprietaryAttributeVoLst,
        ...array
      ];
      param.options.forEach(item => {
        let pair = {
          vCode: item.key,
          vMean: item.value,
          defaultSelection: item.isDefault ? "1" : "0",
          score: item.score,
          printVal: item.printValue
        };
        dataToServer.valueLst.push(pair);
      });
      break;
    }
    case "单选下拉元素": {
      let array = [
        {
          proprietaryCode: "1200",
          proprietaryContent: "1",
          proprietaryName: "字典/自定义值域标记"
        },
        {
          proprietaryCode: "1201",
          proprietaryContent: "",
          proprietaryName: "转为单元框元素"
        },
        {
          proprietaryCode: "1202",
          proprietaryContent: metaJson? metaJson.value: "",
          proprietaryName: "值域ID"
        },
        {
          proprietaryCode: "1203",
          proprietaryContent: metaJson? metaJson.code: "",
          proprietaryName: "值域编码"
        },
        {
          proprietaryCode: "1204",
          proprietaryContent: metaJson? metaJson.label: "",
          proprietaryName: "值域名称"
        }
      ];
      dataToServer.proprietaryAttributeVoLst = [
        ...dataToServer.proprietaryAttributeVoLst,
        ...array
      ];
      param.options.forEach(item => {
        let pair = {
          vCode: item.key,
          vMean: item.value,
          defaultSelection: item.isDefault ? "1" : "0",
          score: item.score,
          printVal: item.printValue
        };
        dataToServer.valueLst.push(pair);
      });
      break;
    }
    case "多选元素": {
      let array = [
        {
          proprietaryCode: "0500",
          proprietaryContent: "1",
          proprietaryName: "字典/自定义值域标记"
        },
        {
          proprietaryCode: "0501",
          proprietaryContent: "",
          proprietaryName: "转为单元框元素"
        },
        {
          proprietaryCode: "0502",
          proprietaryContent: metaJson? metaJson.value: "",
          proprietaryName: "值域ID"
        },
        {
          proprietaryCode: "0503",
          proprietaryContent: metaJson? metaJson.code: "",
          proprietaryName: "值域编码"
        },
        {
          proprietaryCode: "0504",
          proprietaryContent: metaJson? metaJson.label: "",
          proprietaryName: "值域名称"
        }
      ];
      dataToServer.proprietaryAttributeVoLst = [
        ...dataToServer.proprietaryAttributeVoLst,
        ...array
      ];
      param.options.forEach(item => {
        let pair = {
          vCode: item.key,
          vMean: item.value,
          defaultSelection: item.isDefault ? "1" : "0",
          score: item.score,
          printVal: item.printValue
        };
        dataToServer.valueLst.push(pair);
      });
      break;
    }
    case "多选下拉元素": {
      let array = [
        {
          proprietaryCode: "1300",
          proprietaryContent: "1",
          proprietaryName: "字典/自定义值域标记"
        },
        {
          proprietaryCode: "1301",
          proprietaryContent: "",
          proprietaryName: "转为单元框元素"
        },
        {
          proprietaryCode: "1302",
          proprietaryContent: metaJson? metaJson.value: "",
          proprietaryName: "值域ID"
        },
        {
          proprietaryCode: "1303",
          proprietaryContent: metaJson? metaJson.code: "",
          proprietaryName: "值域编码"
        },
        {
          proprietaryCode: "1304",
          proprietaryContent: metaJson? metaJson.label: "",
          proprietaryName: "值域名称"
        }
      ];
      dataToServer.proprietaryAttributeVoLst = [
        ...dataToServer.proprietaryAttributeVoLst,
        ...array
      ];
      param.options.forEach(item => {
        let pair = {
          vCode: item.key,
          vMean: item.value,
          defaultSelection: item.isDefault ? "1" : "0",
          score: item.score,
          printVal: item.printValue
        };
        dataToServer.valueLst.push(pair);
      });
      break;
    }
    case "日期元素": {
      let array = [
        {
          proprietaryCode: "0701",
          proprietaryContent: param.dateFormat,
          proprietaryName: "时间格式"
        },
        {
          proprietaryCode: "0700",
          proprietaryContent: param.inserCurDate == "on" ? "1" : "0",
          proprietaryName: "刷入时间"
        }
      ];
      dataToServer.proprietaryAttributeVoLst = [
        ...dataToServer.proprietaryAttributeVoLst,
        ...array
      ];
      break;
    }
    case "有无元素": {
      let array = [
        {
          proprietaryCode: "0800",
          proprietaryContent: param.notSuffix,
          proprietaryName: "阴性前缀"
        },
        {
          proprietaryCode: "0801",
          proprietaryContent: param.yesSuffix,
          proprietaryName: "阳性前缀"
        },
        {
          proprietaryCode: "0802",
          proprietaryContent: "",
          proprietaryName: "字典/自定义值域标记"
        },
        {
          proprietaryCode: "0803",
          proprietaryContent: "",
          proprietaryName: "转为单选框元素"
        },
        {
          proprietaryCode: "0804",
          proprietaryContent: "",
          proprietaryName: "转为复选框元素"
        },
        {
          proprietaryCode: "0805",
          proprietaryContent: metaJson? metaJson.value: "",
          proprietaryName: "值域ID"
        },
        {
          proprietaryCode: "0806",
          proprietaryContent: metaJson? metaJson.code: "",
          proprietaryName: "值域编码"
        },
        {
          proprietaryCode: "0807",
          proprietaryContent: metaJson? metaJson.label: "",
          proprietaryName: "值域名称"
        }
      ];
      dataToServer.proprietaryAttributeVoLst = [
        ...dataToServer.proprietaryAttributeVoLst,
        ...array
      ];
      break;
    }
    case "签名元素": {
      let signAttr = [
        {
          proprietaryCode: "1101",
          proprietaryContent: param.isCurrDoctor == "on" ? "1" : "0",
          proprietaryName: "默认当前书写医师"
        },
        {
          proprietaryCode: "1102",
          proprietaryContent: param.signtype,
          proprietaryName: "签名类型"
        }
      ];
      if (param.signtype == "textsign") { // 普通签名
        signAttr.push({
          proprietaryCode: "1103",
          proprietaryContent: param.placeholderText,
          proprietaryName: "普通签名占位文本"
        })
      } else {
        signAttr = [
          ...signAttr,
          ...[
            {
              proprietaryCode: "1104",
              proprietaryContent: param.sort,
              proprietaryName: "审签签名排版"
            },
            {
              proprietaryCode: "1105",
              proprietaryContent: JSON.stringify(param.signatureLevel),
              proprietaryName: "审签等级"
            },
            {
              proprietaryCode: "1106",
              proprietaryContent: JSON.stringify(param.placeholderTextArr),
              proprietaryName: "审签签名占位文本"
            }
          ]
        ]
      }
      dataToServer.proprietaryAttributeVoLst = [
        ...dataToServer.proprietaryAttributeVoLst,
        ...signAttr
      ];
      break;
    }
    case "组合元素": {
      let array = [
        {
          proprietaryCode: "0900",
          proprietaryContent: param.content,
          proprietaryName: "元素内容文本或地址"
        },
        {
          proprietaryCode: "0901",
          proprietaryContent: "",
          proprietaryName: "元素内容对照的MongoID"
        }
      ];
      dataToServer.proprietaryAttributeVoLst = [
        ...dataToServer.proprietaryAttributeVoLst,
        ...array
      ];
    }
  }

  return insertEle(dataToServer);
};

export { saveElement };
