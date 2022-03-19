import {post,get,put,del} from '@/utils/request'
	const url = '/common';
/**
 * 删除执行科室信息
 * @param data
 * @returns {*}
 */
export function removeAdviceExecRelate(data) {
  return del(url+'/adviceExecRelate/remove', data, false)
}
