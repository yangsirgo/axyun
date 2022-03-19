import { post, get, put, del } from "@/utils/request";
const url = "/phss";
export function onSaveDocCheckup(data) {
  return post(url + "/docCheckup/onSaveDocCheckup", data, true);
}
export function onQueryOneDocCheckup(data) {
  return get(url + "/docCheckup/onQueryOneDocCheckup", data, true);
}
