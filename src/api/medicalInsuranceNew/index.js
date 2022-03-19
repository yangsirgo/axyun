import {
  get,
  post,
  put,
  patch
} from '@/utils/request';
// 从本地获取医保字典数据方法
export function getDataFromLocal(obj) {
  return new Promise((resolve, reject) => {
    let dictInfo = JSON.parse(localStorage.getItem("dictInfoNew"));
    let arr = [];
    dictInfo.map(item => {
      if (item.dictCatalogCode == obj.siDictCatalogCode) {
        arr = item.dictVOS;
        return;
      }
    });
    if (arr.length) {
      resolve({
        code: 1,
        data: arr
      });
    } else {
      resolve(get(`/finance-si/dict/getDictListBySiDictCatalogId?medicareType=02&siDictCatalogCode=${obj.siDictCatalogCode}`))
    }
  });
}
export function getDataFrom(code) {
  return get(`/finance-si/dict/getDictListBySiDictCatalogId?medicareType=02&siDictCatalogCode=${code}`)
}