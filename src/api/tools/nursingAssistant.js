import {post, get, put, del} from '@/utils/request'

export function getList(data) {
  return post('/docAbnormalValue/getAbnormalInfo', data)
}

/*特殊字符*/
export function getCharacterList(data) {
  return get('/docCharacter/getDocCharacterGroupByType', data)
}

/*短语模板-列表*/
export function getPhraseList(data) {
  return post('/docPhrase/getDocPhraseGroupPhraseType', data)
}

/*短语模板-修改*/
export function editPhraseData(data) {
  return post('/docPhrase/saveOrUpdateDocPhraseInfo', data)
}

/*短语模板-删除*/
export function deletePhraseById(id) {
  return del('/docPhrase/'+id);
}
