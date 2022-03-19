import { post, get } from '@/utils/requestEmr'


// 查询打印文书列表接口
export function getPrintList(data, loading = false) {
  return get('/mr/getPrintList', data, loading)
}


//
export function getPrintContent(data, loading = false) {
  return get('/mr/getPrintContent', data, loading)
}


// 敏感词查询
export function getSensitiveWord(data, loading = false) {
  return get('/sensitiveWord/getByParams', data, loading)
}

// 敏感词查询
export function getByParamsEx(data, loading = false) {
  return get('/sensitiveWord/getByParamsEx', data, loading)
}

// 数字元素单位
export function getEleUnits(data) {
  let params = {
    speCharType: 'spc_unit',
    enabled: 1,
    visible: 1,
    ...data
  }
  return get('/speChar/getByParamsInPage', params);
}

// 获取服务器时间
// data => {pattern: 'yyyy-MM-dd'}
export function getServerDate(data = { pattern: 'yyyy-MM-dd HH:mm:ss' }, loading = false) {
  return get('/mr/getTime', data, loading)
}

export function getUuids(data, loading = false) {
  return get("/element/getUUIDByCount", { count: data }, loading)
}


// 获取文书相关段落
export function getInfoByEnId(enId, enTpCd, loading = false) {
  return get(`/en/getInfoByEnId/${enId}/${enTpCd}`, {}, loading)
}
