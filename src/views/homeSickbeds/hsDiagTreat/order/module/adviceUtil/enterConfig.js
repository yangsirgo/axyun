import {
  getConfig
} from "./adviceDispense.js";

// 获取 enter 跳转顺序
export function getEnterJumpOrder(adviceItem = {}, type = 1, setterConfig = []) {
  //   console.log(adviceItem, type);
  // const {
  //   majorClass,
  //   id,
  //   majorId
  // } = adviceItem;
  let defaultConfig = getConfig(adviceItem, type);
  // let config = setterConfig.length > 0 ? setterConfig : defaultConfig;
  let config = defaultConfig;
  return config.filter(item =>{
    return item.shotcut && typeof item.shotcut !== 'undefined';
  });

}
