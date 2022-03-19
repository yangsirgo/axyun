<template>
  <iframe
    v-loading="!loaded"
    @load="loaded = true"
    width="100%"
    height="100%"
    :src="path"
    style="border: 0"
    title="内嵌页面"
    ref="frame"
  ></iframe>
</template>
<script>
export default {
  name: "l-iframe",
  props: {
    // 电子病历地址
    path: {
      default: "http://localhost:9528/",
      type: String
    }
  },
  data() {
    return {
      loaded: false
    };
  },
  mounted() {
    this.$root.$on("iframe_message", this.messageHandler);
    var self = this;
  },
  methods: {
    send(data) {
      if (this.$refs["frame"]) {
        this.$refs["frame"].contentWindow.postMessage(
          {
            type: "ax-editor",
            data: data
          },
          "*"
        );
      }
    },
    messageHandler(data) {
      this.$emit("messageHandler", data);
    }
  },
  beforeDestroy() {
    this.$root.$off("iframe_message");
  }
};
</script>
