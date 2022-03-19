<template>
  <div class="reportForms height100">
    <el-tabs v-model="activeName" type="border-card" class="height100">
      <el-tab-pane v-for="(item,index) in lists" :key="index" :label="item.label" :name="item.name">
        <div class="height100">
          <component :is="activeName" v-if="activeName===item.name"></component>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import outpatientDailyReport from "./components/outpatientDailyReport";
import outpPrestoreBalanceReport from "./components/outpPrestoreBalanceReport";
import outpIncomeReport from "./components/outpIncomeReport";
import outpOperatorDailyReport from "./components/outpOperatorDailyReport";
import outQuantityReport from "./components/outQuantityReport";
import outDailyReportTurnIn from "./components/outDailyReportTurnIn";
export default {
  name: "reportForms",
  components: {
    outpatientDailyReport,
    outpPrestoreBalanceReport,
    outpIncomeReport,
    outpOperatorDailyReport,
    outQuantityReport,
    outDailyReportTurnIn
  },
  data() {
    return {
      lists: [
        /* {
          label: "门诊收费员现金日报表",
          name: "outpatientDailyReport"
        },
        {
          label: "门诊预存款平衡报表",
          name: "outpPrestoreBalanceReport"
        },
        {
          label: "门诊收入报表",
          name: "outpIncomeReport"
        },
        {
          label: "门诊收费员日报表",
          name: "outpOperatorDailyReport"
        }, */
        {
          label: "日结汇总表",
          name: "outDailyReportTurnIn"
        },
        {
          label: "门诊工作量报表",
          name: "outQuantityReport"
        }
      ],
      activeName: "outDailyReportTurnIn"
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
