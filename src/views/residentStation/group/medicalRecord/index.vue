<template>
  <div class="height100">
    <div class="bottom-center height100" :style="{paddingRight: rightWidth + 'px'}">
      <el-card class="height100">

      </el-card>
    </div>
    <div class="bottom-tool fr height100">
      <tools
        boxName="PrescriptionTemplete"
        @show="toolToggle"
        :modules="modules"
        style="border: none"
      />
    </div>
  </div>

</template>

<script>
  import Tools from "@/views/public/tools/index";

  export default {
    name: "diagnosis",
    components: {
      Tools
    },
    data() {
      return {
        rightWidth: "72", // 工具栏收起显示, 工具栏收起宽度：52 放出宽度： 289
        modules: [
          "PrescriptionTemplete",
          "PreviousPrescriptions",
          "InspectionResults",
          "CheckResult",
          "HistoricalDiagnosis",
          "Knowledge"
        ],
      }
    },
    methods: {

      toolToggle(val) {
        this.rightWidth = val ? "309" : "72";
      }
    }
  }
</script>

<style scoped lang="scss">

  .bottom-center {
    padding-right: 62px;
    width: 100%;
  }

  .bottom-tool {
    position: absolute;
    right: 0;
    top: 0;
  }

</style>
