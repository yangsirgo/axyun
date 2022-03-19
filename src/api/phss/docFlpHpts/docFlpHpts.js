import { post, get, put, del } from "@/utils/request";
const url = "/phss";
export function onSaveDocFlpHpts(data) {
  return post(url + "/docFlpHpts/onSaveDocFlpHpts", data, true);
}

export function onQueryOneDocFlpHpts(data) {
  return get(url + "/docFlpHpts/onQueryOneDocFlpHpts", data, true);
}
