<template>
  <div class="expense-manage-con clearfix">
    <el-card class="right-con box-card-right">
      <rightCard></rightCard>
    </el-card>
    <el-card class="left-con box-card-left">
      <leftCard></leftCard>
    </el-card>
  </div>
</template>

<script>
import leftCard from "./components/leftCard";
import rightCard from "./components/rightCard";
export default {
  name: "",
  components: {
    leftCard,
    rightCard
  },
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
$bgc: rgba(255, 255, 255, 1);
$fontSizeCommon: 14px;
.expense-manage-con {
  height: 100%;
  font-size: 0;
  .box-card-left {
    height: 100%;
    background-color: $bgc;
    font-size: $fontSizeCommon;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  .box-card-right {
    float: right;
    margin-left: 20px;
    width: 500px;
    height: 100%;
    background-color: $bgc;
    font-size: $fontSizeCommon;
  }
}
</style>
