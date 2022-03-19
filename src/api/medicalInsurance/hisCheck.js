import {
  get,
  post,
  put,
  patch
} from '@/utils/request';

export function getHisList(data) {
  return get("/finance-si/accountCheck/his", data);
};
export function getAccountCheckInfo(data) {
  return get("/finance-si/accountCheck/getAccountCheckInfo", data);
};
// 医保中心总账对账
export function check(data) {
  return post("/finance-si/si-pub-account-check/check", data);
};
// 医保中心撤销对账
export function cancelCheck(data) {
  return get("/finance-si/accountCheck/cancelCheck", data);
};

// 明细下载
export function download(data) {
  return post("/finance-si/si01-trade-match/down-trade-match-data", data);
};
// 明细查询
export function search(data) {
  return get("/finance-si/tradeMatchDown/search", data);
};
// 明细查询
export function searchNew(data) {
  return get("/finance-si/tradeMatch/search", data);
};
