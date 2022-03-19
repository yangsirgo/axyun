import { get, post, } from '@/utils/requestEmr'

// 病历书写次数
export function getTaskSum(data, loading = false) {
  return get('/qcTask/task-sum', data, loading)
}
