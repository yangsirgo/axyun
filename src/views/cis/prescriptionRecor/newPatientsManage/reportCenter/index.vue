<template>
  <report hosType="1"></report>
</template>

<script>
  import report from "@/views/public/reportCenter/index.vue";


  export default {
    name: "",
    components: {
      report
    },
    data() {
      return {
      };
    },
    methods: {
      messageHandler() {
        console.log("工具箱消息")
      }
    },
    computed : {
    },
    watch: {
    },
    mounted() {

    }
  };
</script>

<style scoped lang="scss">

</style>
