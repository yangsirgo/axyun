<template>
  <div class="right-pannel-con">
    <el-tabs
      tab-position="left"
      v-model="activeName"
      class="contleft"
      @tab-click="changeTab"
    >
      <el-tab-pane class="pannel-con" label="收费记录" name="costRecord">
        <historyCostRecord></historyCostRecord>
      </el-tab-pane>
      <el-tab-pane class="pannel-con" label="费用模板" name="costTemplate">
        <costTemplate></costTemplate>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import historyCostRecord from "./historyCostRecord";
import costTemplate from "./costTemplate";
export default {
  name: "rightCard",
  components: {
    historyCostRecord,
    costTemplate
  },
  data() {
    return {
      activeName: "costRecord"
    };
  },
  methods: {
    // 切换右侧tabs 触发的方法
    changeTab() {}
  }
};
</script>

<style lang="scss" scoped>
.right-pannel-con {
  height: 100%;
  .contleft {
    height: 100%;
  }

  /deep/ .el-tabs--left .el-tabs__item.is-left {
    padding: 20px 0 !important;
  }
  /deep/ .el-tabs__header.is-left {
    height: 100%;
    background: rgba(246, 246, 246, 1);
  }
}
</style>
