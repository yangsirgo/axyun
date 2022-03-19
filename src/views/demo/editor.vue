<template>
  <div class="wrapper">
    <l-editor :path="editorPath" />
  </div>
</template>
<script>
import LEditor from "@/components/LEditor.vue";
import { getPamars, getToken, getRoles, getRole, getUserName, getUserId } from "@/utils/auth";

export default {
  components: {
    LEditor
  },
  data() {
    var urlData = this.getUrlData();
    return {
      editorPath: "http://192.168.197.132:8001/preview/#/record/?params=" + urlData
    };
  },
  methods: {
    getUrlData() {
      try {
        var params = JSON.parse(getPamars());
        var token = getToken();
        var roles = getRoles();
        var role = getRole();
        var name = getUserName();
        var userId = getUserId();
        return encodeURIComponent(JSON.stringify({
          token,
          roles,
          role,
          name,
          userId,
          ...params
        }));
      } catch (error) {
        console.log("提取数据失败", error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
</style>