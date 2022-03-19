export function hideIdCardNum(idcard) {
  // 隐藏身份证后4位
  return idcard.slice(0, idcard.length - 4) + '****'
}