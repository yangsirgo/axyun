<template>
  <div class="HisCheck">
    <div class="top">
      <div class="left">
        <h2 style="margin-right: 16px">明细账</h2>
        <l-formt-title label="对账结果" style="width: 250px; margin-right: 8px">
          <el-select v-model="checkStatus">
            <el-option
              v-for="(item, index) in accountChecking"
              :key="index"
              :value="item.code"
              :label="item.name"
            ></el-option>
          </el-select>
        </l-formt-title>
      </div>
      <el-button @click="search" type="primary">查询</el-button>
    </div>
    <el-table
      :data="tableData"
      highlight-current-row
      border
      style="flex: 1"
      width="100%"
      height="30%"
    >
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width || item.label.length * 20 + 20"
        :align="item.align || 'center'"
        :header-align="item.headerAlign || 'center'"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <template v-if="item.align === 'right'">{{
            (scope.row[item.prop] || 0).toFixed(2)
          }}</template>
          <template v-else-if="item.prop === 'recordStatus'">{{
            accountChecking[scope.row[item.prop] - 1].name
          }}</template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom">
      <div class="bottomText">
        <span style="font-size: 20px; font-weight: bold; margin-right: 16px"
          >总账</span
        >
        <div style="margin-right: 32px">HIS记账总额：{{ hisTotalAmt }}</div>
        <div>医保记账总额：{{ medicareTotalAmt }}</div>
      </div>
      <el-pagination
        style="margin-top: 8px; text-align: right"
        background
        @size-change="changeSize"
        @current-change="handleCurrentChange"
        :current-page="pageParams.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getHisList } from "@/api/medicalInsurance/hisCheck.js";
export default {
  props: {
    OpIpFlag: {},
    checkDate: {
      type:String
    },
  },
  data() {
    return {
      accountChecking: [
        { code: 1, name: "所有差异" },
        { code: 2, name: "差异：医疗机构多" },
        { code: 3, name: "差异：医保中心多" },
        { code: 4, name: "数据不一致" },
        { code: 5, name: "平" },
      ],
      checkStatus: 1,
      tableData: [],
      columns: [
        {
          prop: "patientName",
          label: "患者姓名",
          width: "150",
        },
        {
          prop: "hisTradeId",
          label: "HIS交易ID",
          width: "150",
        },
        {
          prop: "hisSiKeepAccountAmt",
          label: "HIS记账金额",
          width: "150",
          align: "right",
        },
        {
          prop: "siTradeId",
          label: "医保交易平台ID",
          width: "150",
        },
        {
          prop: "hisSettleBizSerialNum",
          label: "医保结算ID",
          width: "150",
        },
        {
          prop: "siSiKeepAccountAmt",
          label: "医保记账金额",
          width: "150",
          align: "right",
        },
        {
          prop: "skKeepAccountAmt",
          label: "差额",
          width: "150",
          align: "right",
        },
        {
          prop: "recordStatus",
          label: "对账结果",
          width: "150",
        },
      ],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      hisTotalAmt: 0,
      medicareTotalAmt: 0,
    };
  },
  mounted() {
    this.getHisList();
  },
  methods: {
    changeSize(val) {
      this.pageParams.pageNo = val;
    },
    handleCurrentChange(val) {
      this.pageParams.pageSize = val;
    },
    async getHisList() {
      this.tableData = [];
      let res = await getHisList({
        OpIpFlag: this.OpIpFlag,
        checkDate: this.checkDate,
        checkStatus: this.checkStatus,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
      });
      if (res.code === 1 && res.data.length) {
        this.tableData = res.data;
        this.hisTotalAmt = res.data[0].hisTotalAmt;
        this.medicareTotalAmt = res.data[0].medicareTotalAmt;
        this.pageParams.total = res.total;
      }
    },
    search() {
      this.getHisList();
    },
  },
};
</script>

<style lang="scss" scoped>
.HisCheck {
  display: flex;
  flex-direction: column;
  flex: 1;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .bottomText {
      display: flex;
      align-items: center;
    }
  }
}
</style>