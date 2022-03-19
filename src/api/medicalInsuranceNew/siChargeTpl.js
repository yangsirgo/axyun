import {
  get,
  post,
  put,
  patch
} from '@/utils/request';

export function settleCostFind(data) {
  return post(`/finance-si/si02-medfind/settle_cost_find`, data)
}