import { post, get, put, del } from "@/utils/request";

export function onPost(data) {
  return post(data.url, data.data, true);
}
export function onGet(data) {
  return get(data.url, data.data, true);
}
