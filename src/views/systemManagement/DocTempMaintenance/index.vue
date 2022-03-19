<template>
  <div class="height100" style="background-color: #fff" v-loading="loading">
    <l-editor :path="jumpPath" ref="lEditor" @messageHandler="messageHandler" />
  </div>
</template>

<script type="text/ecmascript-6">
import LEditor from "@/components/LEditor.vue";
import {
  getPamars,
  getToken,
  getRoles,
  getRole,
  getUserName,
  getUserId,
} from "@/utils/auth";
import { getServerConfig } from "@/utils/config";
import { requestFullScreen, exitFullscreen } from "@/utils/util.js";

export default {
  data() {
    let urlData = this.getUrlData();
    let jumpPathConfig = this.getJumpPath();
    // let jumpPathConfig = "http://192.168.198.225:9528/#/jumpPage?env=yun_dev";

    let hash = window.location.hash;
    let jumpPath = null;
    try {
      jumpPath = hash.split(/#\/mrMgr\//)[1];
    } catch (error) {}
    console.log("jumpPath:::", jumpPath);
    return {
      loading: false,
      jumpPath: jumpPathConfig + "&params=" + urlData + "&jumpPath=" + jumpPath,
    };
  },
  components: {
    LEditor,
  },
  created() {},
  methods: {
    getJumpPath() {
      return getServerConfig("EDITOR_JUMPPATH");
    },
    messageHandler(data) {
      if (data.type === "ax-editor") {
        console.log(data, "data");
      }
      this.loading = false;
    },
    // eslint-disable-next-line consistent-return
    getUrlData() {
      try {
        var params = JSON.parse(getPamars());
        var token = getToken();
        var roles = getRoles();
        var role = getRole();
        var name = getUserName();
        var userId = getUserId();
        return encodeURIComponent(
          JSON.stringify({
            token,
            roles,
            role,
            name,
            userId,
            ...params,
          })
        );
      } catch (error) {
        console.log("提取数据失败", error);
      }
    },
  },
};
</script>

<style scoped lang="scss">
</style>
