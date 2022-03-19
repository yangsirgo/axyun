import { get } from '@/utils/requestEmr'

export function getTableList(data) {
  return get('/assayPublishResult/getListByParamNotDelete', data)
}
