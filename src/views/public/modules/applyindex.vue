<template>
  <div class="applicat" ref="page" :body-style="{ padding: '0px',	border: 0 }">
    <el-tabs tab-position="left" class="contleft">
      <el-tab-pane label="检验申请">
        <applicat :dataHz="testApply"></applicat>
      </el-tab-pane>
      <el-tab-pane label="检查申请">
        <applicat :dataHz="inspectApply"></applicat>
      </el-tab-pane>
      <el-tab-pane label="病理申请">病理申请</el-tab-pane>
      <el-tab-pane label="备血申请">备血申请</el-tab-pane>
      <el-tab-pane label="用血申请">用血申请</el-tab-pane>
      <el-tab-pane label="手术申请">手术申请</el-tab-pane>
      <el-tab-pane label="治疗申请">
        <applicat :dataHz="treatmentApply"></applicat>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import adHeight from "@/mixins/adHeight";
import Applicat from "../component/Apply.vue";
export default {
  mixins: [adHeight],
  components: {
    Applicat
  },
  data() {
    return {
      testApply: {
        titlename: "检验科",
        id: "01"
      },
      inspectApply: {
        titlename: "检查科",
        id: "02"
      },
      treatmentApply: {
        titlename: "治疗申请",
        id: "03"
      }
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.applicat {
  overflow: hidden;
  padding: 0 0px;
  background: #fff;
  border-radius: 4px;
  .contleft {
    height: 100%;
    .el-tabs__header {
      height: 100%;
      background: $l-color-bgcolor-18;
    }
    .el-tabs__header.is-left {
      margin-right: 2px;
    }
    .el-tabs__content {
      height: 100%;
    }
  }
}
</style>