<template>
  <el-card class="width100 height100 performance">
    <div style="margin-left: 20px">
      <l-card-title>
        <template slot="left">个人绩效</template>
      </l-card-title>
    </div>

    <el-row class="performance-body">
      <el-col :span="5" class="charts height100">
        <div>
          <div class="top-part">
            <span class="title">累计门诊人次</span>
            <span class="content">23人</span>
          </div>
          <el-divider></el-divider>
          <div class="center-part">
            <span class="title">科室内占比</span>
            <span class="content">40%</span>
          </div>
        </div>
        <div style="height: calc(100% - 221px)">
          <cis-chart></cis-chart>
        </div>
      </el-col>
      <el-col :span="5" class="charts height100">
        <div>
          <div class="top-part">
            <span class="title">平均接诊时长</span>
            <span class="content">13分钟</span>
          </div>
          <el-divider></el-divider>
          <div class="center-part">
            <span class="title">科室均值对比</span>
          </div>
        </div>
        <div style="height: calc(100% - 173px)">
          <admission-chart></admission-chart>
        </div>
      </el-col>

      <!--3-->
      <el-col :span="5" class="charts height100">
        <div>
          <div class="top-part">
            <span class="title">诊间结算率</span>
            <span class="content">24%</span>
          </div>
          <el-divider></el-divider>
          <div class="center-part">
            <span class="title">科室均值对比</span>
          </div>
        </div>
        <div style="height: calc(100% - 173px)">
          <settlement-chart></settlement-chart>
        </div>
      </el-col>

      <!--4-->
      <el-col :span="5" class="charts height100">
        <div>
          <div class="top-part">
            <span class="title">病历质控分数</span>
            <span class="content">65分</span>
          </div>
          <el-divider></el-divider>
          <div class="center-part">
            <span class="title">科室均值对比</span>
          </div>
        </div>
        <div style="height: calc(100% - 173px)">
          <grade-chart></grade-chart>
        </div>
      </el-col>

      <!--5-->
      <el-col :span="5" class="charts height100">
        <div>
          <div class="top-part">
            <span class="title">满意度调查反馈</span>
            <span class="content">80分</span>
          </div>
          <el-divider></el-divider>
          <div class="center-part">
            <span class="title">反馈结果分布</span>
          </div>
        </div>
        <div style="height: calc(100% - 173px)">
          <satisfaction></satisfaction>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import cisChart from '@/views/dashboard/components/charts/cisChart.vue';
  import satisfaction from '@/views/dashboard/components/charts/satisfaction.vue';
  import admissionChart from '@/views/dashboard/components/charts/admissionChart.vue';
  import settlementChart from '@/views/dashboard/components/charts/settlementChart.vue';
  import gradeChart from '@/views/dashboard/components/charts/gradeChart.vue';

  export default {
    name: "performance",
    components: {
      cisChart,satisfaction,admissionChart,settlementChart,gradeChart
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">
  .performance {

    .performance-body {
      height: calc(100% - 63px);
      padding-bottom: 20px;

      .el-col-5 {
        width: 20%;
      }
      .charts {
        padding: 0 40px;
        padding-left: 40px !important;
        border-right: 1px solid rgba(228,228,228,1);
        .top-part,.center-part {
          padding: 14px 0;
          > span {
            display: block;
            color:rgba(46,50,58,1);
            font-weight:bold;
          }
          .title {
            font-size:16px;
            
            line-height:26px;
          }
          .content {
            font-size:28px;
            line-height:44px;
          }
        }
        /deep/ .el-divider--horizontal {
          margin: 10px 0;
        }

      }
    }
  }
</style>
