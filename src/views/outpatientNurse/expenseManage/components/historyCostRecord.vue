<template>
  <div class="history-cost-record">
    <l-card-title class="clearfix card-header" ref="header">
      <span slot="left">{{ patientName }}历史收费记录</span>
    </l-card-title>
    <LFormtTitle label="时间" labelWidth="38" style="width: 300px">
      <el-date-picker
        v-model="chooseDate"
        type="daterange"
        prefix-icon="icon iconfont iconriqi"
        range-separator="—"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </LFormtTitle>
    <div class="table-con">
      <el-table
        ref="singleTable"
        :data="tabsList"
        highlight-current-row
        style="width: 100%"
        height="100%"
        border
        element-loading-text="加载中..."
      >
        <el-table-column
          v-for="item in tableColumn"
          :key="item.label"
          :label="item.label"
          :prop="item.prop"
          align="left"
          show-overflow-tooltip
          header-align="left"
          :min-width="item.width"
        >
          <template slot-scope="scope">
            <span class="amount-detail">{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "historyCostRecord",
  components: {
    
  },
  data() {
    return {
      patientName: "刘明海",
      chooseDate: [], // 已选时间
      tableColumn: [
        {
          prop: "date",
          label: "时间",
          width: "40"
        },
        {
          prop: "office",
          label: "科室",
          width: "50"
        },
        {
          prop: "amount",
          label: "金额",
          width: "30"
        }
      ],
      // 表格的数据源
      tabsList: [
        {
          date: "2019-06-11 13:22",
          office: "普外科",
          amount: "36.30"
        },
        {
          date: "2019-06-11 13:22",
          office: "普外科",
          amount: "36.30"
        },
        {
          date: "2019-06-11 13:22",
          office: "普外科",
          amount: "36.30"
        },
        {
          date: "2019-06-11 13:22",
          office: "普外科",
          amount: "36.30"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.history-cost-record {
  padding: 0 20px 0 10px;
  .table-con {
    margin-top: 10px;
    height: 100%;
    .amount-detail {
      float: right;
    }
  }
}
</style>
