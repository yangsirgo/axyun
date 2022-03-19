import {
  getConfig
} from "./adviceDispense.js";

// 获取校验项
export function getValidRules(adviceItem = {}, type = 1) {
  // const {
  //   majorClass,
  //   id,
  //   majorId
  // } = adviceItem;

  let config = getConfig(adviceItem, type);
  let validRulsClone = {};
  config.forEach(item => {
    if (item.required && typeof item.required !== "undefined") {
      let vList = [{
        required: true,
        message: item.label + '必须填写',
        trigger: 'change'
      }];
      // 单词用量 数字的校验
      if (item.prop === "onceDosage") {
        vList.push({
          pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
          message: "请输入正确的单次用量！"
        })
      }
      validRulsClone[item.prop] = vList;
    }

  })

  return validRulsClone;
}
