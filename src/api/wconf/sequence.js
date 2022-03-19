import {post, get, put, del} from '@/utils/request'
const url = '/admin'
export function getSeqList(data) {
  return get(url+'/bill/metas', data, true)
}

export function addSeq(data) {
  return post(url+'/bill/metas', data, true)
}

export function deleteSeq(data) {
  return del(url+'/bill/metas', data, true)
}

///
export function getSeqPageList(data) {
  return get(url+"/bill/page", data, true);
}

export function addPageSeq(data) {
  return post(url+'/bill/page-metas', data, true)
}

export function deletePageSeq(data) {
  return del(url+'/bill/page-metas', data, true)
}

export function syncDB() {
  return get(url+"/bill/syncdb", null, true);
}

export function uploadRDB() {
  return get(url+"/bill/uploadrdb", null, true);
}

export function getCurr(data) {
  return get(url+"/bill/getcurr", data, true);
}

export function deleteMetas(data) {
  return del(url+"/bill/metas", data, true);
}
export function saveCurr(data) {
  return post(url+"/bill/setcurr", data, true);
}

export function delLock(data) {
  return put(url+`/bill/dellock`,data,true)
}

