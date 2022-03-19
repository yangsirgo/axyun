/**
 * 药品数量，散装->整装
 * @param {number} sum 散装总数
 * @param {number} unit 单位数量
 * @returns {object} 返回整装总数，剩余散装数量
 */
export function blukToOutfit(sum = 0, unit = 1) {
  const Sum = sum || 0;
  const s = parseInt(Sum);
  const u = parseInt(unit);
  return {
    out: parseInt(s / u),
    bl: s % u
  };
}
export function blukToOutfitFirst(sum = 0, unit = 1) {
  const Sum = sum || 0;
  const s = Number(Sum);
  const u = Number(unit);
  const blnum = s % u
  return {
    out: parseInt(s / u),
    bl: blnum.toFixed(1),
  };
}
/**
 * 药品数量，整装->散装
 * @param {number} out 整装总数
 * @param {number} bl 散装总数
 * @param {number} unit 单位数量
 * @returns {number} 返回散装总数
 */

export function outfitToBluk(out = 0, bl = 0, unit = 1) {
  const Out = out || 0;
  const Bl = bl || 0;
  let o = parseInt(Out);
  let b = parseInt(Bl);
  let u = parseInt(unit);
  return o * u + b;
}

/**
 * 处方配药、发药，根据roleId保存选择的窗口到localStorage，
 * 方面下次进来自动锁定窗口
 */
// 存储窗口
export function saveWindowCode(data) {
  localStorage.setItem("windowCode", JSON.stringify(data));
}

// 获取窗口
export function getWindowCode() {
  const codeJson = localStorage.getItem("windowCode");
  const code = JSON.parse(codeJson);
  return code;
}

// setTimeout模拟setInterval
export function loopSendDrug() {
  let flag = null;
  const loopFun = (fn, time) => {
    flag = setTimeout(() => {
      fn(() => loopFun(fn, time));
    }, time);
  };
  const clearFun = () => {
    if (flag) {
      clearTimeout(flag);
    }
  };
  return {
    setFun: loopFun,
    clearFun: clearFun
  };
}

// 计算两个日期的差,并返回相差天数
export function tiemDiff(date1, date2) {
  if (date1 && date2) {
    let time1 = date1.replace(/-/g, "/");
    let time2 = date2.replace(/-/g, "/");
    time1 = new Date(time1).getTime();
    time2 = new Date(time2).getTime();
    const time = Math.abs(time2 - time1);
    const days = Math.ceil(time / (24 * 60 * 60 * 1000));
    return days;
  }
  return 0;
}
