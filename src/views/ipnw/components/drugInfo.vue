<template>
  <div>
    <div class="one">
      <el-row class="title">商品名</el-row>
      <el-row class="data">{{
        drugInfo.tradeName ? drugInfo.tradeName : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">通用名</el-row>
      <el-row class="data">{{
        drugInfo.commonName ? drugInfo.commonName : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">英文名</el-row>
      <el-row class="data">{{
        drugInfo.enName ? drugInfo.enName : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">药品本位码</el-row>
      <el-row class="data">{{
        drugInfo.standardCode ? drugInfo.standardCode : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">国药准字批号</el-row>
      <el-row class="data">{{
        drugInfo.batchNo ? drugInfo.batchNo : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">规格</el-row>
      <el-row class="data">{{ drugInfo.spec ? drugInfo.spec : "无" }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">储存方式</el-row>
      <el-row class="data">{{
        drugInfo.storageMethod ? drugInfo.storageMethod : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">适应症</el-row>
      <el-row class="data">{{
        drugInfo.indication ? drugInfo.indication : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">主要成分</el-row>
      <el-row class="data">{{
        drugInfo.basisPart ? drugInfo.basisPart : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">禁忌</el-row>
      <el-row class="data">{{ drugInfo.taboo ? drugInfo.taboo : "无" }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">副作用</el-row>
      <el-row class="data">{{
        drugInfo.sideEffect ? drugInfo.sideEffect : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">药物相互作用</el-row>
      <el-row class="data">{{
        drugInfo.interact ? drugInfo.interact : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">用法用量</el-row>
      <el-row class="data">{{
        drugInfo.useWay ? drugInfo.useWay : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">儿童用药</el-row>
      <el-row class="data">{{
        drugInfo.childUse ? drugInfo.childUse : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">老年用药</el-row>
      <el-row class="data">{{
        drugInfo.oldAgeUse ? drugInfo.oldAgeUse : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">哺乳期用药</el-row>
      <el-row class="data">{{
        drugInfo.lactationUse ? drugInfo.lactationUse : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">药理作用</el-row>
      <el-row class="data">{{
        drugInfo.pharAction ? drugInfo.pharAction : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">注意事项</el-row>
      <el-row class="data">{{ drugInfo.note ? drugInfo.note : "无" }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">生产厂商</el-row>
      <el-row class="data">{{
        drugInfo.vendor ? drugInfo.vendor : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">剂型</el-row>
      <el-row class="data">{{
        drugInfo.formCode ? drugInfo.formCode : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">医保信息</el-row>
      <el-row class="data">{{
        drugInfo.medicalInsurance ? drugInfo.medicalInsurance : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">药品类别</el-row>
      <el-row class="data">{{
        drugInfo.category ? drugInfo.category : "无"
      }}</el-row>
    </div>
    <div class="one">
      <el-row class="title">OTC分类</el-row>
      <el-row class="data">{{
        drugInfo.otcType ? drugInfo.otcType : "无"
      }}</el-row>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { getDrugDict } from "@/api/hmm/drugDict";
export default {
  data() {
    return {
      drugInfo: {
        /*composition:
          "本品的主要成分为七叶皂苷钠A和七叶皂苷钠B，是从七叶树科植物天师栗的干燥成熟种子中提取的一种含酯键的三萜皂苷。",
        adapt: "用于脑水肿、创伤或手术所致肿胀，也用于静脉回流障碍性疾病。",
        usage:
          "静脉注射或静脉滴注。成人按体重一日0.1～0.4mg/kg，或取本品5～10mg溶于10%葡萄糖注射液或0.9%氯化钠注射液250ml中供静脉滴注；也可取本品5～10mg溶于10～20ml 10%葡萄...",
        adrs:
          "可见注射部位局部疼痛、肿胀，经热敷可使症状消失。 偶有过敏反应，可按药物过敏处理原则治疗。" //不良反应*/
      },
      loading: false
    };
  },
  created() {},
  methods: {
    // code 获取数量单位 中文
    async loadDrug(data) {
      let param = {};
      // console.info("=========================",data);
      param.commonName = data.drugName ? data.drugName : "";
      param.hosId = this.role.hosId;
      let rep = await getDrugDict(param);
      // console.info(rep);
      if (rep.code === 1) {
        this.drugInfo = rep.data.length > 0 ? rep.data[0] : {};
        //console.info(this.drugInfo);
      }
    }
  },
  computed: {
    ...mapGetters("order", ["drugName"]),
    ...mapGetters(["role"])
  },
  watch: {
    drugName: {
      handler(n, o) {
        // console.log('aaaa',n,o);
        this.loadDrug(n);
      },
      deep: true, //深度监听
      immediate: true
    }
  }
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
