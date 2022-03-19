<template>
  <div class="layout-lab">

    <el-tabs tab-position="left">
      <el-tab-pane label="检验申请">
          <lab></lab>
      </el-tab-pane>
      <el-tab-pane label="检查申请">


      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import lab from "./lab";
    export default {
        name: "applyLab",
        components: {lab}
    }
</script>

<style lang="scss" scoped>
  .layout-lab {
    float: left;
    width: 50%;
    padding-top: 10px;
    border-right: 1px solid #ccc;

  }


</style>
