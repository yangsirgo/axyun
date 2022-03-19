import {
  get,
  post,
  put,
  del
} from '@/utils/request'

/**
 * 获取病人列表
 * @param data
 * @returns {*}
 */
export function getPatients(data, flag) {
    return post("/advice/treatment/search/" + data.pageNo + "/" + data.pageSize, data)
  }
