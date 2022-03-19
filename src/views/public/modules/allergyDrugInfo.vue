<template>
  <div>
    <div class="one">
      <el-row class="title">成份</el-row>
      <el-row class="data">{{ drugInfo.composition }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">适应症</el-row>
      <el-row class="data">{{ drugInfo.adapt }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">用法用量</el-row>
      <el-row class="data">{{ drugInfo.usage }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">不良反应</el-row>
      <el-row class="data">{{ drugInfo.adrs }}</el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: "allergyDrugInfo",
  data() {
    return {
      drugInfo: {
        composition:
          "本品的主要成分为七叶皂苷钠A和七叶皂苷钠B，是从七叶树科植物天师栗的干燥成熟种子中提取的一种含酯键的三萜皂苷。",
        adapt: "用于脑水肿、创伤或手术所致肿胀，也用于静脉回流障碍性疾病。",
        usage:
          "静脉注射或静脉滴注。成人按体重一日0.1～0.4mg/kg，或取本品5～10mg溶于10%葡萄糖注射液或0.9%氯化钠注射液250ml中供静脉滴注；也可取本品5～10mg溶于10～20ml 10%葡萄...",
        adrs:
          "可见注射部位局部疼痛、肿胀，经热敷可使症状消失。 偶有过敏反应，可按药物过敏处理原则治疗。" //不良反应
      },
      loading: false
    };
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.one {
  margin-bottom: 20px;
  padding-left: 5px;
  padding-right: 5px;
  .el-row {
    margin-bottom: 10px;
  }
  .title {
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    margin-bottom: 6px;
  }

  .data {
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(148, 157, 163, 1);
    line-height: 22px;
  }
}
</style>
