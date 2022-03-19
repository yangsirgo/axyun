import { post, get, put, del } from "@/utils/request";

const url = "/admin"; //url+

//获取全部药品数据hmm-stock/goods/deltaImportQuery?updateTime=2021-09-17
export function deltaImportGoodsQuery(data) {
  return get(`/hmm-stock/goods/deltaImportQuery`, data);
}
