<template>
  <div class="applicat width100 height100">
    <consultation />
  </div>
</template>

<script>
import consultation from "./components/consultation";

export default {
  name: "consultationManagement",
  // patientId:病患id
  props: ["patientId"],
  components: { consultation }
};
</script>

<style lang="scss" scoped>
.applicat {
  overflow: hidden;
  padding: 0 0px;
  background: #fff;
  border-radius: 4px;
  /deep/ .contleft {
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