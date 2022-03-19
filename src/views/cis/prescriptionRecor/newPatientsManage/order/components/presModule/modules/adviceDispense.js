import {
  tableColumn,
  relationDisabledList
} from "./variable.js";
import {
  deepClone
} from "@/utils/index.js";

import {
  isNotMajorRow,
  isZanCunAddNewStatus
} from "./adviceUtils.js";




// eslint-disable-next-line complexity
function getAdviceConfig(adviceItem = {}) {
  let defConfig = getDefConfig();
  const {
    isMajor,
    majorId,
    id
  } = adviceItem;

  let config = {};

  let isSkinTest = adviceItem.skinTest == 1 || adviceItem.useWay == '901'; // 用法 901 是皮试

  // 皮试 并且 出现超量
  // if (adviceItem.skinTest == 1 && adviceItem.overReasonShow) {
  if (isSkinTest && adviceItem.overReasonShow) {
    config["stSolutionType"] = {
      ...defConfig["stSolutionType"],
      ...{
        edit: true,
        shotcut: true,
        endSubmit: false
      }
    }; // 不可编辑

    config["excessReason"] = {
      ...defConfig["excessReason"],
      ...{
        edit: true,
        shotcut: true,
        endSubmit: true
      }
    }; // 不可编辑

    config["qty"] = {
      ...defConfig["qty"],
      ...{
        endSubmit: false
      }
    }; // 不可编辑
  } else if (isSkinTest && !adviceItem.overReasonShow) {// 皮试,并且不显示超量
    config["stSolutionType"] = {
      ...defConfig["stSolutionType"],
      ...{
        edit: true,
        shotcut: true,
        endSubmit: true
      }
    }; // 不可编辑

    config["excessReason"] = {
      ...defConfig["excessReason"],
      ...{
        edit: false,
        shotcut: false,
        endSubmit: false
      }
    }; // 不可编辑

    config["qty"] = {
      ...defConfig["qty"],
      ...{
        endSubmit: false
      }
    }; // 不可编辑
  } else if (!isSkinTest && adviceItem.overReasonShow) {// 不皮试,并且显示超量
    config["stSolutionType"] = {
      ...defConfig["stSolutionType"],
      ...{
        edit: false,
        shotcut: false,
        endSubmit: false
      }
    }; // 不可编辑

    config["excessReason"] = {
      ...defConfig["excessReason"],
      ...{
        edit: true,
        shotcut: true,
        endSubmit: true
      }
    }; // 不可编辑

    config["qty"] = {
      ...defConfig["qty"],
      ...{
        endSubmit: false
      }
    }; // 不可编辑
  } else if (!isSkinTest && !adviceItem.overReasonShow) {//不皮试,并且不显示超量
    // config["qty"] = {
    //   ...defConfig["qty"],
    //   ...{
    //     endSubmit: true
    //   }
    // }; // 不可编辑
  }


  
  if (isNotMajorRow(adviceItem)) { //非主医嘱

    config["useWay"] = {
      ...defConfig["useWay"],
      ...{
        input: false,
        shotcut: false,
        endSubmit: false
      }
    }; // 不可编辑
    config["frequencyCode"] = {
      ...defConfig["frequencyCode"],
      ...{
        input: false,
        shotcut: false,
        endSubmit: false
      }
    }; // 不可编辑

    config["useDay"] = {
      ...defConfig["useDay"],
      ...{
        input: false,
        shotcut: false,
        endSubmit: false
      }
    }; //不可编辑

    config["urgent"] = {
      ...defConfig["urgent"],
      ...{
        input: false,
        shotcut: false,
        endSubmit: false
      }
    }; //不可编辑
  }

  // console.log("config", config);
  config = {
    ...defConfig,
    ...config
  }
  // console.log(JSON.stringify(config));
  return config;
}




function ShotCutConfig(adviceItem = {}) {
  let defConfig = getAdviceConfig(adviceItem);
  let config = {};

  if (typeof adviceItem.shotCutSetterColName != "undefined" && typeof adviceItem.shotCutSetterState != "undefined") {
    config[adviceItem.shotCutSetterColName] = {
      ...defConfig[adviceItem.shotCutSetterColName],
      ...{
        shotcut: adviceItem.shotCutSetterState
      }
    }; //不可编辑
  }

  config = {
    ...defConfig,
    ...config
  }

  return config;
}

function getDefConfig() {
  let cloneTableColumn = deepClone(tableColumn);
  let obj = {};
  cloneTableColumn.forEach(item => {
    obj[item.prop] = item;
  });

  return obj;
}


export function getShotCutConfig(adviceItem = {}) {
  return Object.values(ShotCutConfig(adviceItem));
}


export function getConfig(adviceItem = {}) {
  return Object.values(getAdviceConfig(adviceItem));
}
