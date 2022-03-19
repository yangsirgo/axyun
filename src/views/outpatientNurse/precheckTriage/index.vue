<template>
  <div class="precheck-triage-con clearfix">
    <el-card class="left-area height100">
      <leftCheckArea></leftCheckArea>
    </el-card>
    <el-card class="center-area height100">
      <patientInfoArea></patientInfoArea>
    </el-card>
  </div>
</template>

<script>
import leftCheckArea from "./components/leftCheckArea";
import patientInfoArea from "./components/patientInfoArea";
export default {
  name: "",
  methods: {},
  components: {
    leftCheckArea,
    patientInfoArea
  },
  data() {
    return {};
  }
};
</script>

<style lang='scss' scoped>
$bgc: rgba(255, 255, 255, 1);
$shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
.precheck-triage-con {
  height: 100%;
  // font-size: 0;
  .left-area {
    width: 393px;
    height: 100%;
    float: left;
    background-color: $bgc;
    box-shadow: $shadow;
    border-radius: 4px;
  }
  .center-area {
    height: 100%;
    margin-left: 413px;
    background-color: $bgc;
    box-shadow: $shadow;
    border-radius: 4px;
  }
}
</style>
