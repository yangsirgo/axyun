const isRefreshMacrosEverytime = true;

let showSelectPatientAlert = false;

// 是否刷新诊断和处方
let refreshDiagnosisAndPreviousFlag = true;

// 是否启用身份验证
let identityConfirm = true;
// 审签配置
let signConfig = {
  mode: "sign", // 图片签字  image,ca签字 ca , 文字签字 sign
  isLoad: true
};
let setShowSelectPatientAlert = function (val) {
  showSelectPatientAlert = val;
};

export {
  isRefreshMacrosEverytime,
  showSelectPatientAlert,
  setShowSelectPatientAlert,
  refreshDiagnosisAndPreviousFlag,
  signConfig,
  identityConfirm
};
