import {
  getShotCutConfig
} from "./adviceDispense.js";

// 获取 enter 跳转顺序
export function getEnterJumpOrder(adviceItem = {}) {
  //   console.log(adviceItem, type);
  const {
    majorClass,
    no,
    majorNo
  } = adviceItem;
  let config = getShotCutConfig(adviceItem);
  let filtered = config.filter(item => {
    return item.shotcut && typeof item.shotcut !== 'undefined';
  });

  return filtered;

}

