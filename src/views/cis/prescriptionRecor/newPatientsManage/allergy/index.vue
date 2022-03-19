<template>
  <main-card hosType="1"></main-card>
</template>

<script>
  import mainCard from "@/views/public/allergy/index.vue";

  export default {
    name: "",
    components: {
      mainCard
    },
    data() {
      return {

      };
    },
    methods: {
      messageHandler() {
        console.log("工具箱消息");
      }
    },
    computed: {
    },
    watch: {

    }
  };
</script>

<style scoped lang="scss">

</style>
