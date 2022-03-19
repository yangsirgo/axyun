import { post, get, patch } from '@/utils/requestEmr'



export function getSysDataList({ pageNo = 1, pageSize = 10, ...data }) {
  return get(`/hcEmrHistory/pageHistory/${pageNo}/${pageSize}`, data)
}
