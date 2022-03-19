import { get, post, del, put } from "@/utils/request";
export default {
  async getDeshboardData() {
    return get('/home/statistics');
  }
}
