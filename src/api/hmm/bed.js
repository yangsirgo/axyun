import { post, get, put, del } from "@/utils/request";

// 家床发药
export function delivery(data) {
  return post("/hmm-stock/inptExeDetail/delivery", data);
}
// 家床发药退回
export function reject(data) {
  return post("/hmm-stock/inptExeDetail/reject", data);
}