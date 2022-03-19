<template>
  <div ref="page">
    <router-view></router-view>
  </div>
</template>
<script>
  import adHeight from "@/mixins/adHeight";
  export default {
    mixins: [adHeight],
    data() {
      return {

      };
    },
    methods: {

    }
  };
</script>
<style lang="scss" scoped>
  .left-box {
    // background:
  }
</style>
