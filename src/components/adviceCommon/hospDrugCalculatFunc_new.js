/* eslint-disable complexity */
import {
  numToPrecision
} from './adviceUtils.js'


// eslint-disable-next-line valid-jsdoc
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
 * type  长期 = "1"; 临时 = "2"; 出院带药 = "3";
 * roundingMode  1.总量取整；2.单次取整；3.不取整
 * dismountable  拆零
 */
function hospDrugCalculatFunc(
  type, item, advice, cb
) {
  let {
    pkgMeasure = 1,
    dosageMeasure = 1,
    dismountable = 0,
    roundingMode = 2, 
    cutable = 0
  } = item;
  let { limitUnit, pkgUnit } = item;
  let { unit, useDay, firstDayUse = 0, freqTimes, onceDosage } = advice;

  console.log({ limitUnit, pkgUnit, unit, firstDayUse, onceDosage, freqTimes, useDay, pkgMeasure, dosageMeasure, cutable, dismountable, roundingMode, type });

  if (isNull(unit)) return null;
  if (isNull(useDay)) return null;
  if (isNull(freqTimes)) return null;
  if (isNull(onceDosage)) return null;
  if(dosageMeasure == 0 || isNull(dosageMeasure))throw new Error('剂量值不能为0');
  if(pkgMeasure == 0 || isNull(pkgMeasure))throw new Error('包装量不能为0');

  if(isNull(limitUnit) && isNull(pkgUnit)){
    throw new Error('医嘱项目单位没有维护，需要重新维护基础数据');
  }
  
  if(isNull(limitUnit))limitUnit = pkgUnit;
  if(isNull(pkgUnit))pkgUnit = limitUnit;

  dismountable = (type == 1)?'1':dismountable;//长嘱默认可拆零
  if(unit == limitUnit)pkgMeasure = 1;
  
  let quantity = 0;
  let total = 0;
  let totalCount = useDay * freqTimes + firstDayUse; //总次数
  console.log("totalCount", totalCount);

  if (roundingMode == 1) {
    if (type == 1 || type == 2) {
      total = totalCount * Math.ceil(onceDosage / dosageMeasure);
    } else if (type == 3) {
      total = Math.ceil((totalCount * onceDosage) / dosageMeasure);
    }
  } else if (roundingMode == 2) {
    total = totalCount * Math.ceil(onceDosage / dosageMeasure);
  } else if (roundingMode == 3) {
    dismountable = '1';//此模式下均可拆零
    total = totalCount * onceDosage / dosageMeasure;
  }

  quantity = total/pkgMeasure
  if( dismountable == '0' ){
    quantity =  Math.ceil(quantity);
  }
  console.log("quantity", quantity);
  return numToPrecision(quantity);
};
function isNull(param, name, cb) {
  return param === null || typeof param == "undefined" || param == "";
}

//家床药品的逻辑处理
function getHospDefaultUnit(item, type){
  let { roundingMode = 2,limitUnit,pkgUnit,dismountable } = item;
  if( isNull(pkgUnit) && isNull(limitUnit) )throw new Error('医嘱项目单位没有维护，需要重新维护基础数据');

  if( isNull(pkgUnit) ){
    pkgUnit = limitUnit;
  } 

  if( isNull(limitUnit) ) {
    limitUnit = pkgUnit;
  }

  if( type == 1 ){
    return limitUnit;
  } else if (type == 2) {
    if( roundingMode == 3) { 
      return limitUnit;
     } 
    if (dismountable == 0) {
      return pkgUnit;
    } 
    return limitUnit;
  }

  //if(!dismountable)return pkgUnit;
  return pkgUnit;
}

// 说明：
//长期医嘱： 大单位禁用。不管拆零 还是 取整方式。
// 临时医嘱： 
// 不取整，大单位禁用。
// 其他取整方式： 
// 不可拆零小单位禁用。

function hospCheckUnit(item, unit, type){

  let { roundingMode = 2,limitUnit,pkgUnit,dismountable } = item;
  //console.log(item.itemName,"roundingMode", roundingMode, "unit", unit, "limitUnit",limitUnit, "pkgUnit", pkgUnit, "type", type ,item);
  if( isNull(pkgUnit) && isNull(limitUnit) )throw new Error('医嘱项目单位没有维护，需要重新维护基础数据');
  if( limitUnit == pkgUnit || isNull(pkgUnit) || isNull(limitUnit) )return;

  if (roundingMode == 1 || roundingMode == 2) {
    if (type == 1 ) {
      if (unit == pkgUnit){
        throw new Error('按[总量取整]或者[单次取整]时，长期医嘱只允许选择最小单位');
      }
    } else{
      if (dismountable == 0 && unit == limitUnit){
        throw new Error('药品不可拆零，只能选择包装单位');;
      }
    }  
  } else if (roundingMode == 3 && unit == pkgUnit) {
    throw new Error('医嘱不取整，只允许选择最小单位');
  }
}

// true 是禁用
// false 可选
// function hospCheckUnit(item = {}, type){
//   let { roundingMode = 2,limitUnit,pkgUnit,dismountable } = item;
//   if(  isNull(pkgUnit) && isNull(limitUnit) ) {
//     return { disable:true};
//   };

//   if( limitUnit == pkgUnit || isNull(pkgUnit) || isNull(limitUnit)){
//     return { disable:true};
//   }

//   if (roundingMode == 1 || roundingMode == 2) {
//     if (type == 1  ) {
//       return { disable:true};
//     } else if ( dismountable == 0 ){
//       return { disable:true};
//     }  
//   } else if (roundingMode == 3) {
//     return { disable:true};
//   }
//   return { disable:false};
// }
export {
  hospDrugCalculatFunc,
  hospCheckUnit,
  isNull,
  getHospDefaultUnit
};
