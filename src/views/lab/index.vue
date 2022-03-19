<template>
  <div class="container">

    <el-card class="clearfix">
      <apply></apply>
      <lab-history></lab-history>
    </el-card>
  </div>
</template>

<script>
    import apply from './components/apply.vue';
    import labHistory from "./components/labHistory";
    export default {
        name: "index",
        components: {apply,labHistory}
    }
</script>

<style scoped>

</style>
