import { get } from '@/utils/requestEmr'

export function getExaList(data) {
  return get('/obRp/getObRpList', data)
}
