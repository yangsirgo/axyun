import { post, get, patch } from '@/utils/requestEmr'

export function getManageList(data) {
  return get('/sectionTemplate/manage-page', data, true)
}

export function getTree(data) {
  return get('/sectionTemplate/manage-tree-param', data, true)
}

export function getSectionTemplateList(data) {
  return get('/sectionTemplate/usable-list', data, false)
}

export function save(data) {
  return post('/sectionTemplate/save-with-content', data, true)
}

export function update(data) {
  return post('/sectionTemplate/default/' + data.sectionTemplateId, data, true)
}

export function getByParams(data) {
  return get('/sectionTemplate/hos-page', data, true)
}

export function getContent(id, data) {
  return get('/sectionTemplate/content/' + id, data, true)
}

export async function saveContent(data) {
  return await post('/sectionTemplate/content', data, true)
}


export function getDetail(id, data) {
  return get('/sectionTemplate/' + id, data, true)
}

export function removeSectionTemplate(data) {
  return patch('/sectionTemplate/batch', data, true)
}

export function setEnable(data) {
  return post('/sectionTemplate/enable/batch', data, true)
}

export function setDisable(data) {
  return post('/sectionTemplate/disable/batch', data, true)
}

export function copyTemplates(data) {
  return post('/sectionTemplate/copy', data, true)
}

export function getNextSeqNo(data) {
  return get('/sectionTemplate/seq_no', data, true)
}

