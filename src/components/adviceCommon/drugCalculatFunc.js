import {
  drugOutpCalculatFunc
} from "./outpDrugCalculatFunc";
import {
  hospDrugCalculatFunc
} from "./hospDrugCalculatFunc_new.js";

import { numToPrecision } from './adviceUtils.js'

/**
 * drugQty 药品数量
 * price 药品单价
 * pkgMeasure 包装单位所含的数量
 * unitFlag  此时的单位是大单位0，小单位1
 * toFixedNo  默认是 2
 */
export function amtCalculatFunc(
  drugQty = 0,
  price = 0,
  pkgMeasure = 1,
  unitFlag = "0",
  toFixedNo = 2) {

  console.log("drugQty", drugQty);
  console.log("price", price);
  console.log("pkgMeasure", pkgMeasure);
  console.log("unitFlag", unitFlag);
  let amt = 0;
  //药品剂量值 不可为0
  if (pkgMeasure == 0) {
    window.alert("包装单位所含的数量不可为0!");
    console.error("包装单位所含的数量不可为0!");
    return undefined;
  }

  let cumputPrice = unitFlag == "0" ? price : Number(price * 100 / pkgMeasure / 100).rewToFixed(4);
  amt = drugQty * cumputPrice;
  console.log("金额", amt);
  return new Number(amt).rewToFixed(toFixedNo);
}


/**
 * 住院
 * useDay 用药天数
 * firstDayUse 首日次数
 * freqTimes 每日次数
 * onceDosage 一次计量
 * dosageMeasure 药品剂量
 * cutable 是否可拨半
 * pkgMeasure 包装单位所含的数量
 * unitFlag  此时的单位是大单位0，小单位1
 */
// function hospDrugCalculatFunc(
//   useDay = 1,
//   firstDayUse = 0,
//   freqTimes = 1,
//   onceDosage = 0,
//   dosageMeasure = 1,
//   cutable = true,
//   pkgMeasure = 1,
//   unitFlag = "0") {
//   let quantity = 0;
//   //药品剂量值 不可为0
//   if (dosageMeasure == 0) {
//     window.alert("药品的剂量值不可为0!");
//     console.error("药品的剂量值不可为0!");
//     return undefined;
//   }
//   console.log("firstDayUse", firstDayUse);
//   console.log("onceDosage", onceDosage);
//   console.log("freqTimes", freqTimes);
//   console.log("useDay", useDay);
//   console.log("unitFlag", unitFlag);
//   console.log("pkgMeasure", pkgMeasure);
//   console.log("dosageMeasure", dosageMeasure);
//   console.log("cutable", cutable);
//   let totalCount = useDay * freqTimes + firstDayUse; //总次数
//   console.log("totalCount", totalCount);
//   if (cutable) { //可以拨半
//     dosageMeasure = unitFlag == '0' ? dosageMeasure * pkgMeasure : dosageMeasure; //选择单位的大小不同，计算的剂量不同
//     quantity = totalCount * onceDosage / dosageMeasure; //总数量 （limitUnit 小单位）
//     console.log("quantity", quantity);
//     quantity = Math.ceil(quantity); //向上取整
//   } else { //不可以拨半
//     let onceCount = Math.ceil(onceDosage / dosageMeasure);
//     quantity = unitFlag == '0' ? Math.ceil(totalCount * onceCount / pkgMeasure) : Math.ceil(totalCount * onceCount);
//     console.log("quantity", quantity);
//   }
//   return numToPrecision(quantity);
// };

// 家床  默认 先不改
// function homeBed (){

// }

export { hospDrugCalculatFunc, drugOutpCalculatFunc };