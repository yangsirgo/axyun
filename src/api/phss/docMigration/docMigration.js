import { post, get, put, del } from "@/utils/request";
const url = "/phss";
// 获取档案列表接口
export function queryDocMigrationManagement(data) {
  return post(
    url + "/docMigrationManagement/onQueryDocMigrationManagement",
    data,
    true
  );
}
