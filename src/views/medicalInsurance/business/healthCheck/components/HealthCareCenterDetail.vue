<template>
  <div class="HealthCareCenterDetail">
    <div class="top">
      <div class="left">
        <h2 style="margin-right: 16px">明细账</h2>
        <l-formt-title label="对账结果" style="width: 250px; margin-right: 8px">
          <el-select v-model="checkResult">
            <el-option
              v-for="(item, index) in accountChecking"
              :key="index"
              :value="item.code"
              :label="item.name"
            ></el-option>
          </el-select>
        </l-formt-title>
        <l-formt-title
          label="门诊号/住院号"
          style="width: 250px; margin-right: 8px"
        >
          <el-input v-model="medicalNumber"></el-input>
        </l-formt-title>
        <l-formt-title label="姓名" style="width: 200px; margin-right: 8px">
          <el-input v-model="patientName"></el-input>
        </l-formt-title>
        <l-formt-title
          label="HIS交易时间"
          style="width: 450px; margin-right: 8px"
        >
          <el-date-picker
            v-model="date2"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            clearable
          ></el-date-picker>
        </l-formt-title>
      </div>
      <div>
        <el-button type="primary" @click="download">明细下载</el-button>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
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
          <template v-if="item.align === 'operate'"
            ><el-button type="text">撤销</el-button></template
          >
          <template v-else-if="item.align === 'right'">{{
            (scope.row[item.prop] || 0).toFixed(2)
          }}</template>
          <template v-else-if="item.prop === 'checkStatus'">{{
            accountChecking[scope.row[item.prop] - 1].name
          }}</template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom">
      <!-- <div class="bottomText">
        <span style="font-size: 20px; font-weight: bold;margin-right:16px;">总账</span>
        <div style="margin-right:32px;">HIS记账总额：</div>
        <div>医保记账总额：</div>
      </div> -->
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
import { search,searchNew,download } from "@/api/medicalInsurance/hisCheck.js";
export default {
  props:["checkDate","OpIpFlag"],
  data() {
    return {
      accountChecking: [
        { code: 1, name: "所有差异" },
        { code: 2, name: "差异：医疗机构多" },
        { code: 3, name: "差异：医保中心多" },
        { code: 4, name: "数据不一致" },
        { code: 5, name: "平" },
      ],
      value: 1,
      tableData: [],
      date2: [],
      columns: [
        {
          prop: "oprate",
          label: "操作",
        },
        {
          prop: "checkStatus",
          label: "对账结果",
        },
        {
          prop: "medicalNumber",
          label: "门诊号/住院号",
        },
        {
          prop: "patientName",
          label: "姓名",
          width: "100px"
        },
        {
          prop: "hisTradeTime",
          label: "HIS交易时间",
        },
        {
          prop: "hosSettleSerialNum",
          label: "医药机构结算业务序列号",
        },
        {
          prop: "settleBizSerialNum",
          label: "结算业务号",
        },
        {
          prop: "tradeChannel",
          label: "交易渠道",
        },
        {
          prop: "siCardNum",
          label: "社保卡号（医疗证号）",
        },
        {
          prop: "employInjuryCode",
          label: "工伤事故编号",
        },
        {
          prop: "medicaType",
          label: "医疗类别",
        },
        {
          prop: "settleStatus",
          label: "结算状态",
        },
        {
          prop: "medicalFeeAmount",
          label: "HIS医疗费总金额",
        },
        {
          prop: "fundPayAmount",
          label: "HIS基金支付金额",
        },
        {
          prop: "personalAccountPayAmount",
          label: "HIS个人账户支付金额",
        },
        {
          prop: "cashPayAmount ",
          label: "HIS个人支付金额",
        },
        {
          prop: "totalFeeAmt",
          label: "医保医疗费总金额",
        },
        {
          prop: "fundPayAmt",
          label: "医保基金支付金额",
        },
        {
          prop: "personalAccountPayAmt",
          label: "医保个人账户支付金额",
        },
        {
          prop: "personalPayAmt",
          label: "医保个人支付金额",
        },
      ],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      checkResult:'',
      medicalNumber:'',
      patientName:'',
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    changeSize(val) {
      this.pageParams.pageNo = val;
    },
    handleCurrentChange(val) {
      this.pageParams.pageSize = val;
    },
    async search() {
      this.tableData = [];
      let res = await searchNew({
        checkStatus:this.checkResult,
        medicalNumber:this.medicalNumber,
        patientName:this.patientName,
        hisStartTime:this.date2[0],
        hisEndTime:this.date2[1],
        pageNo:this.pageParams.pageNo,
        pageSize:this.pageParams.pageSize,
        checkDate: this.checkDate,
        OpIpFlag: this.OpIpFlag
      });
      if (res.code === 1) {
        this.tableData = res.data;
      }
    },
    async download(){
      let res = await download({
        selectDate:new Date(this.checkDate).format("yyyyMMdd")*1,
        downLoad:0,
      })
      if(res.code == 1&&res.data == 2){
        this.$confirm(`该查询日期已存在记录,是否要强制下载？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res2 = await download({
            selectDate:new Date(this.checkDate).format("yyyyMMdd")*1,
            downLoad:1,
          })
          if(res2.code === 1){
            this.$message.success("明细下载成功");
          }
          return
        }).catch(() => {
          return
        });
      }
      if(res.code == 1&&res.data != 2){
        this.$message.success("明细下载成功");
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.HealthCareCenterDetail {
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
    justify-content: flex-end;
    align-items: center;
    .bottomText {
      display: flex;
      align-items: center;
    }
  }
}
</style>