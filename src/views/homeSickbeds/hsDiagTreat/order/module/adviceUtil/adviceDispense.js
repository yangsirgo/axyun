/* eslint-disable consistent-return */

import {
  tableColumn,
  maxKeyText,
  freqStObj,
  relationDisabledList
} from "./variable.js";
import {
  deepClone
} from "@/utils/index.js";
import {
  getHospDefaultUnitFunc,
  defaultFreqObj,
  getUnitStateFunc
} from "./util.js";
// 材料医嘱 = "1";
// 西药 = "10";
// 中草药 = "11";
// 中成药 = "12";
// 嘱托医嘱 = "13";
// 处置类医嘱 = "2";
// 床位 = "3";
// 挂号诊查 = "4";
// 检查类医嘱 = "5";
// 检验类医嘱 = "6";
// 其他医嘱 = "7";
// 手术类医嘱 = "8";
// 输血类医嘱 = "9";
// 撤床 = "13001";

export function getConfig(adviceItem = {}, type = 1) {
  return getAdviceConfig(adviceItem, type);
}

/*******************************************   动态值处理动态值 不是默认值   *******************************************/
//当前行的 A 改变 B的 变化
// relation  relationObj关联式例外 外行控制当前行 比如说 主医嘱数据变化 控制 非主医嘱的数值。
//currentRow 只读的当前行
// type 长期还是临时医嘱
// isRelation 设置频次 用法  首日次数的状态
// isReadonly  关联相关项的状态
// relationColName 关联的列的名称
// export function getCurrentRowConfig(adviceItem = {}, type = 1, currentRow = {}, isRelation = false, relationColName, isReadonly = false) {
export function getCurrentRowConfig(adviceItem = {}, type = 1, fireColName, relationObj) {
  //console.log("adviceItem", JSON.stringify(adviceItem));
  let defConfigList = getAdviceConfig(adviceItem, type);

  // console.log("defConfigList", JSON.stringify(defConfigList));
  let defConfig = {};
  defConfigList.forEach(item => {
    defConfig[item.prop] = item;
  });

  let config = {};


  // 长期医嘱状态下 更改频次，首日次数的最大值会变化
  // if (type == 1) {
  //   config["freqCode"] = {
  //     ...defConfig["freqCode"],
  //     ...{
  //       relate: [{
  //         relateKey: "firstDayUse", //关联的列
  //         maxKey: "firstDayUse" + maxKeyText, //
  //         max: currentRow["freqTimes"], //默认的最大值
  //         value: currentRow["freqTimes"] //默认的值 依据字段
  //       }]
  //     }
  //   };
  // }

  // 不同的触发列获取不同的配置
  let configObj = getConfigByColName(fireColName, fireColName == "relation" ? relationObj["relationToRow"] : adviceItem, type);
  config[configObj.key] = {
    ...defConfig[configObj.key],
    ...{
      relate: configObj.relate
    }
  };

  // if (fireColName == "relation") {
    // console.log(JSON.stringify(defConfig));

    // 关联 relation 需要 改变输入状态
    // if (relationObj.key === "relation") {
      // relationDisabledList.forEach(item => {
      //   if (!isDisabledCol(defConfig[item])) {
      //     config[item] = {
      //       ...defConfig[item],
      //       ...{
      //         // input: !isReadonly,
      //         // shotcut: !isReadonly
      //       }
      //     };
      //   }
      // })

      // if (isReadonly) {
      //   config["relation"] = {
      //     ...defConfig["relation"],
      //     ...{
      //       endSubmit: true
      //     }
      //   };
      // }
    // }

    // console.log(JSON.stringify(config));
  // } 

  config = {
    ...defConfig,
    ...config
  }

  return Object.values(config);
}

function isDisabledCol(itemConfig) {
  return typeof itemConfig["input"] != "undefined" && !itemConfig["input"];
}



/*************************************       处理默认值 默认值 默认值       **********************************/
// 选择不同的医嘱  状态 和默认值 （列的默认值 默认最大值 最小值等）
// 默认药品 和 长期医嘱
//这个文件只处理列的状态（input edit等）和 默认值（默认最大值，默认最小值，默认值）
// eslint-disable-next-line complexity
function getAdviceConfig(adviceItem = {}, type = 1) {
  // console.log("adviceItem:::::", adviceItem);
  if (Object.keys(adviceItem).length === 0 || typeof adviceItem.majorClass === 'undefined') {
    adviceItem.majorClass = "10"; // 默认药品
  }


  const {
    majorClass,
    id,
    no,
    majorId
  } = adviceItem;
  // console.log("majorClass:::::::::::", majorClass);
  var defConfig = getDefConfig();

  var config = {};

  let defaultUnit = getHospDefaultUnitFunc(adviceItem, type);

  if (majorClass == "10" || majorClass == "12") { //西药 中成药
    if (type == 1) {
      config["itemName"] = {
        ...defConfig["itemName"],
        ...{
          relate: [{
            relateKey: "useWay", //关联的列
            default: adviceItem["defaultUseWay"] //默认的值 依据字段
          }, {
            relateKey: "onceDosage",
            default: adviceItem["defaultOnceDosage"]
          }, {
            relateKey: "freqCode", //关联的列
            default: defaultFreqObj(adviceItem)
          }, {
            relateKey: "firstDayUse", //关联的列
            maxKey: "firstDayUse" + maxKeyText, //currentRow里面的 字段 defaultMax从这里面取值
            defaultMax: adviceItem["defaultFreqTimes"], //默认的最大值
            default: adviceItem["defaultFreqTimes"] //默认的值 依据字段
          }, {
            relateKey: "unit", //关联的列
            default: defaultUnit
          }]
        }
      };
    } else if (type == 2) {
      config["itemName"] = {
        ...defConfig["itemName"],
        ...{
          relate: [{
            relateKey: "useWay", //关联的列
            default: adviceItem["defaultUseWay"] //默认的值 依据字段
          }, {
            relateKey: "onceDosage",
            default: adviceItem["defaultOnceDosage"]
          }, {
            relateKey: "freqCode", //关联的列
            default: defaultFreqObj(adviceItem)
          }, {
            relateKey: "unit", //关联的列
            default: defaultUnit
          }]
        }
      };
    }


    // dismountable 拆零与单位的逻辑
    // 0 不可拆零  1 可拆零
    // 药品可拆零逻辑：
    //1. 单位可选，选项最大或者最小
    //2. 不可拆零，单位不可选，默认最小
    config["unit"] = {
      ...defConfig["unit"],
      ...{
        // input: getUnitStateFunc(adviceItem, type),
        input: true,
        edit: true,
        required: false
      }
    };


    if (type == 1) { // 长嘱
      config["useWay"] = {
        ...defConfig["useWay"],
        ...{
          input: true,
          edit: true,
          required: true,
          shotcut: true
        }
      };
      config["freqCode"] = {
        ...defConfig["freqCode"],
        ...{
          input: true,
          edit: true,
          required: true,
          shotcut: true
        }
      };

      config["onceDosage"] = {
        ...defConfig["onceDosage"],
        ...{
          input: true,
          edit: true,
          required: true,
          shotcut: true
        }
      };

      config["quantity"] = {
        ...defConfig["quantity"],
        ...{
          input: false,
          edit: true,
          required: false
        }
      };

      config["useDay"] = {
        ...defConfig["useDay"],
        ...{
          input: false,
          edit: true,
          required: false,
          default: ""
        }
      };

      config["firstDayUse"] = {
        ...defConfig["firstDayUse"],
        ...{
          input: true,
          edit: true,
          shotcut: true,
          endSubmit: true,
          relate: [{
            relateKey: "firstDayUse", //关联的列
            maxKey: "firstDayUse" + maxKeyText, //
            max: adviceItem["freqTimes"] //默认的最大值
          }]
        }
      };


    } else if (type == 2) { //临嘱

      config["useWay"] = {
        ...defConfig["useWay"],
        ...{
          input: true,
          edit: true,
          required: true,
          shotcut: true
        }
      };
      config["freqCode"] = {
        ...defConfig["freqCode"],
        ...{
          input: true,
          edit: true,
          required: true,
          shotcut: true
        }
      };
      config["quantity"] = {
        ...defConfig["quantity"],
        ...{
          input: true,
          edit: true,
          required: false,
          shotcut: true,
          endSubmit: true
        }
      };
      config["onceDosage"] = {
        ...defConfig["onceDosage"],
        ...{
          input: true,
          edit: true,
          required: true,
          shotcut: true
        }
      };
      //临时医嘱 默认用药天数为1
      config["useDay"] = {
        ...defConfig["useDay"],
        ...{
          input: true,
          edit: true,
          required: false
        }
      };
      config["firstDayUse"] = {
        ...defConfig["firstDayUse"],
        ...{
          input: false,
          edit: false,
          required: false
        }
      };
    }

    // config["relation"] = {
    //   ...defConfig["relation"],
    //   ...{
    //     shotcut: true
    //   }
    // };

  } else if (majorClass == "11") { //中草药
  } else { //非药品
    config["itemName"] = {
      ...defConfig["itemName"],
      ...{
        relate: [{
          relateKey: "onceDosage",
          default: adviceItem["defaultOnceDosage"] == 0 ? "1" : adviceItem["defaultOnceDosage"]
        }, {
          relateKey: "freqCode", //关联的列
          default: defaultFreqObj(adviceItem)
        }, {
          relateKey: "unit", //关联的列
          default: defaultUnit
        }]
      }
    };
    config["onceDosage"] = {
      ...defConfig["onceDosage"],
      ...{
        input: true,
        edit: true,
        required: true,
        shotcut: true
      }
    };
    config["useWay"] = {
      ...defConfig["useWay"],
      ...{
        input: false,
        edit: false,
        required: false,
        shotcut: false,
        endSubmit: false
      }
    }; // 不可输入
    config["freqCode"] = {
      ...defConfig["freqCode"],
      ...{
        input: true,
        edit: true,
        shotcut: true,
        required: true,
        endSubmit: true
      }
    }; // 不可输入
    config["relation"] = {
      ...defConfig["relation"],
      ...{
        input: false,
        edit: false,
        shotcut: false,
        required: false,
        endSubmit: false
      }
    };

    // 非药品长期医嘱 禁用 用药天数和数量
    if (type == 1) {
      config["useDay"] = {
        ...defConfig["useDay"],
        ...{
          input: false,
          edit: true,
          required: false,
          default: ""
        }
      };

      config["quantity"] = {
        ...defConfig["quantity"],
        ...{
          input: false,
          edit: true,
          required: false
        }
      };
    }
    // if (majorClass == "2") { //处置类医嘱
    //   config["freqCode"] = {
    //     ...defConfig["freqCode"],
    //     ...{
    //       input: true,
    //       edit: true,
    //       shotcut: true,
    //       required: true,
    //       endSubmit: true
    //     }
    //   }; // 可输入
    // }

    if (majorClass == "5" || majorClass == "6") { //检验检查类医嘱  次用量默认为1，频次默认1次，首日不可编辑

      config["itemName"] = {
        ...defConfig["itemName"],
        ...{
          relate: [{
            relateKey: "onceDosage",
            default: 1
          }, {
            relateKey: "freqCode", //关联的列
            default: freqStObj 
          }, {
            relateKey: "unit", //关联的列
            default: defaultUnit
          }]
        }
      };

      config["firstDayUse"] = {
        ...defConfig["firstDayUse"],
        ...{
          input: false,
          edit: false,
          required: false,
          default: "" // 默认为空，并且禁用 不可编辑
        }
      };
    }

  }

  //console.log("id && !(id == majorId)", id && !(id == majorId), "majorId", majorId, "id", id);
  if (majorId && !(id == majorId)) { //非主医嘱 
    //开始时间，用法、频次、首日次数、天数、预停时间、紧急
    config["useWay"] = {
      ...defConfig["useWay"],
      ...{
        input: false,
        edit: true,
        required: true
      }
    }; // 不可编辑
    config["freqCode"] = {
      ...defConfig["freqCode"],
      ...{
        input: false,
        edit: true,
        required: true
      }
    }; // 不可编辑
    config["firstDayUse"] = {
      ...defConfig["firstDayUse"],
      ...{
        input: false,
        edit: true,
        required: false
      }
    }; //不可编辑
    config["useDay"] = {
      ...defConfig["useDay"],
      ...{
        input: false,
        edit: true,
        required: false
      }
    }; //不可编辑
    config["expectStopTime"] = {
      ...defConfig["expectStopTime"],
      ...{
        input: false,
        edit: true,
        required: false
      }
    }; //不可编辑
    // config["urgent"] = {
    //   ...defConfig["urgent"],
    //   ...{
    //     input: false,
    //     edit: true,
    //     required: false
    //   }
    // }; //不可编辑
  }


  config = {
    ...defConfig,
    ...config
  }
  //console.log(JSON.stringify(config));
  return Object.values(config);
}

// 关联项 具体配置
// relationObj = {
  // key: "relation",
  // relate: [{
  //   relateKey: "freqCode",
  //   value: item["freqCode"]
  // }]
// }
function getConfigByColName(fireColName, item, type) {
  let configObj = {};
  if (fireColName == "freqCode") {
    // 长期医嘱 频次绑定 首日次数
    if (type == 1) {
      configObj = {
        key: "freqCode",
        relate: [{
            relateKey: "freqCode",
            value: {
              freqTimes: item.freqTimes,
              freqUnit: item.freqUnit,
              freqId: item.freqId,
              freqCode: item.freqCode
            }
          },
          {
            relateKey: "firstDayUse",
            value: item["freqTimes"],
            maxKey: "firstDayUse" + maxKeyText,
            max: item["freqTimes"]
          }
        ]
      };
    } else if (type == 2) {
      configObj = {
        key: "freqCode",
        relate: [{
            relateKey: "freqCode",
            value: {
              freqTimes: item.freqTimes,
              freqUnit: item.freqUnit,
              freqId: item.freqId,
              freqCode: item.freqCode
            }
          }
        ]
      };
    }
  } else if (fireColName == "relation") {
    configObj = {
      key: "relation",
      relate: []
    };

    // relation 关联 
    relationDisabledList.forEach(disabledName => {
      if (disabledName === "freqCode") {
        configObj.relate.push({
          relateKey: "freqCode",
          value: {
            freqTimes: item.freqTimes,
            freqUnit: item.freqUnit,
            freqCode: item.freqCode
          }
        });
      } else if (disabledName === "firstDayUse") {
        configObj.relate.push({
          relateKey: "firstDayUse",
          value: item["firstDayUse"],
          max: item.freqTimes,
          maxKey: "firstDayUse" + maxKeyText
        });
      } else {
        configObj.relate.push({
          relateKey: disabledName,
          value: item[disabledName]
        });
      }
    });
  } else {
    configObj = {
      key: fireColName,
      relate: [{
        relateKey: fireColName,
        value: item[fireColName]
      }]
    };
  }
  // console.log("configObj", configObj);
  return configObj;
}

function getDefConfig() {
  let cloneTableColumn = deepClone(tableColumn);
  let obj = {};
  cloneTableColumn.forEach(item => {
    obj[item.prop] = item;
  });

  return obj;
}
