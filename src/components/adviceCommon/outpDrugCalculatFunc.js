import { numToPrecision } from './adviceUtils.js'
/**
 * 门诊
 * useDay 用药天数
 * freqTimes 每日次数
 * onceDosage 一次剂量
 * dosageMeasure 药品剂量
 * pkgMeasure 包装单位所含的数量
 * unitFlag  此时的单位是大单位0，小单位1
 * roundingMode 取整方式
 * unitSaleFlag 拆零（1-可拆零 0-不可拆零）
 */
export function drugOutpCalculatFunc(
  useDay = 1,
  freqTimes = 1,
  onceDosage = 0,
  dosageMeasure = 1,
  pkgMeasure = 1,
  unitFlag = "0",
  roundingMode = "3",
  unitSaleFlag = "1") {
  let quantity = 0;
  //药品剂量值 不可为0
  if (dosageMeasure == 0) {
    window.alert("药品的剂量值不可为0!");
    console.error("药品的剂量值不可为0!");
    return undefined;
  }
  console.log("onceDosage", onceDosage);
  console.log("freqTimes", freqTimes);
  console.log("useDay", useDay);
  console.log("unitFlag", unitFlag);
  console.log("pkgMeasure", pkgMeasure);
  console.log("dosageMeasure", dosageMeasure);
  console.log("roundingMode", roundingMode);
  console.log("unitSaleFlag", unitSaleFlag);

  let onceQty = onceDosage / dosageMeasure; //一次数量（小单位）

  switch (roundingMode) {
    case "1":
      // 核心算法
      quantity = onceQty * freqTimes * useDay;
      // 总量向上取整
      quantity = Math.ceil(quantity); //向上取整
      break;
    case "2":
      // 按次向上取整
      onceQty = Math.ceil(onceQty); //向上取整
      // 核心算法
      quantity = onceQty * freqTimes * useDay;
      break;
    case "3":
      // 核心算法
      quantity = onceQty * freqTimes * useDay;
      quantity = new Number(quantity).rewToFixed(2); //小数取两位
      break;
  }

  if (unitSaleFlag == "0" && unitFlag == "0") {
    //不可拆零，且选择大单位
    quantity = Math.ceil(quantity / pkgMeasure)
  } else if (unitSaleFlag == "1" && unitFlag == "0") {
    //可拆零，且选择大单位
    quantity = new Number(quantity / pkgMeasure).rewToFixed(2)
  }

  console.log("quantity", quantity);
  return numToPrecision(quantity);
};


// 一，不可拆零时：单位只能为大单位，大单位下数量必须为整数（不可为小数）；
// 二，可拆零时：可切换大单位和小单位。
// 2.1  选择大单位时：数量可为小数；
// 2.2  选择小单位时：若取整标识为单次取整和总量取整，则小单位数量必须为整数，不可为小数；
// 2.3  若取整标识为不取整，小单位数量可为小数；
/**
 * 门诊
 * useDay 用药天数
 * freqTimes 每日次数
 * onceDosage 一次剂量
 * dosageMeasure 药品剂量
 * pkgMeasure 包装单位所含的数量
 * unitFlag  此时的单位是大单位0，小单位1
 * roundingMode  1.总量取整；2.单次取整；3.不取整
 * unitSaleFlag 拆零（1-可拆零 0-不可拆零）
 */


// eslint-disable-next-line complexity
export function outCheckQuantity(item, qty, unitKey){

  let { roundingMode = 2, unitSaleFlg, packUnit, limitUnit } = item;
  console.log("unitSaleFlg", unitSaleFlg, "roundingMode", roundingMode, "unitKey", unitKey, "limitUnit",limitUnit, "packUnit", packUnit, "qty", qty, item);
  if( isNull(packUnit) || isNull(limitUnit) ){return;}
  if( isNull(qty) ){return;}
  if( isNull(packUnit) && isNull(limitUnit) ){throw new Error('医嘱项目单位没有维护，需要重新维护基础数据');}
  if( isNull(unitSaleFlg) ){throw new Error('医嘱项目拆零没有维护，需要重新维护基础数据');}
  if( isNull(unitKey) ){throw new Error('请选择药品单位');}

  if (unitSaleFlg == "1") {
      if(unitKey == limitUnit) {
        if (roundingMode == 1 || roundingMode == 2) {
          //必须为整数
          if (!isWholeNumber (qty)) {
            throw new Error('选择小单位，药品为[单次取整]或[总量取整]，数量必须为整数');
          }
        }
      }
  } else if (unitSaleFlg == "0"){
     //必须为整数
     if (!isWholeNumber (qty)) {
      throw new Error('药品[不可拆零]，数量必须为整数');
    }
  }
}



function isNull(param, name, cb) {
  return param === null || typeof param == "undefined" || param === "";
}

//整数正则
function isWholeNumber (qty){
  let re = /^\d+$/;
  return re.test(qty);
}
