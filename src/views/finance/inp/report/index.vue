<template>
  <div class="reportForms height100">
    <el-tabs v-model="activeName" type="border-card" class="height100">
      <el-tab-pane v-for="(item,index) in lists" :key="index" :label="item.label" :name="item.name">
        <div style="height:calc(100% - 39px);width:1200px;margin-left:calc(50% - 600px)">
          <component :is="activeName" :reportData="activeName == 'inpChargeDayReport'?reportData:activeName == 'inpChargeCollect'?reportData2:reportData1" v-if="activeName===item.name"></component>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import inpChargeDayReport from "./components/inpChargeCollect";
import inpChargeCollect from "./components/inpChargeCollect";
import inpOperatorDailyReport from "./components/inpOperatorDailyReport";
export default {
  name: "reportForms",
  components: {
    inpChargeDayReport,
    inpChargeCollect,
    inpOperatorDailyReport
  },
  data() {
    return {
      lists: [
        {
          label: "住院费用清单日报表",
          name: "inpChargeDayReport"
        },
        {
          label: "住院费用清单汇总",
          name: "inpChargeCollect"
        },
        /* {
          label: "收费员日结报表",
          name: "inpOperatorDailyReport"
        } */
      ],
      activeName: "inpChargeDayReport",
      reportData:{
        inpCode: '',
        flag:'1'
      },
      reportData2:{
        inpCode: '',
        flag:'2'
      },
      reportData1:{
        inpCode: '',
        flag:'2'
      },

    };
  }
};
</script>
<style lang="scss" scoped>
</style>
