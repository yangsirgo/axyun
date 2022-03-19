<template>
  <el-card class="box-card height100">
    <div slot="header" class="clearfix">
      <span class="titleBefore"></span>
      <span class="title">时间线视图</span>

    </div>

  </el-card>
</template>

<script>
  export default {
    name: "timer"
  }
</script>

<style scoped lang="scss">
  .box-card {
    position: relative;
    text-align: left;

    .clearfix {
      line-height: 50px;
    }

    /deep/.el-card__header {
      padding: 0 !important;

    }

    .titleBefore {
      vertical-align: middle;
      margin-right: 5px;
      height: 20px;
      background: $l-color-primary;
      display: inline-block;
      width: 4px;
      margin-left: 15px;
    }

    .title {
      font-size: 16px;
      
      font-weight: 500;
      color: rgba(46, 50, 58, 1);
      vertical-align: -2px;
    }
  }
</style>
