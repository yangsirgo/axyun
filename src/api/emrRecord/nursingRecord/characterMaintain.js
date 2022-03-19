import { get, post, patch } from '@/utils/requestEmr'
// 查询字符
export function getCharacterData(query) {
  return get('/docCharacter/getDocCharacterByParams', query)
}
// 新增字符
export function saveOrUpdateCharacter(query) {
  return post('/docCharacter/saveOrUpdateDocCharacterInfo', query)
}
// 删除字符
export function batchDeleteCharacter(query) {
  return patch('/docCharacter/batch', query)
}
