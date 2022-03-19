<template>
  <div ref="page">
    <router-view></router-view>
  </div>
</template>

<script>
  import adHeight from "@/mixins/adHeight";
  export default {
    name: "index",
    mixins: [adHeight],
  }
</script>

<style scoped>

</style>
