import {post,get,put,del} from '@/utils/request'
const url = '/common'
/**
 * 删除收费项目信息
 * @param data
 * @returns {*}
 */
export function removeAdviceChargeRelate(data) {
  return del(url+'/adviceChargeRelation/remove', data, false)
}
/**
 * 删除收费项目信息
 * @param data
 * @returns {*}
 */
export function oWdeleteElectronicApplicationCatalogRelationById(data) {
  return get('/electronicApplicationCatalogRelation/oWdeleteElectronicApplicationCatalogRelationById', data, false)
}
