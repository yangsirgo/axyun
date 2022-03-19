<template>
  <div class="HealthCareCenterAll">
    <div class="top">
      <div class="left">
        <el-row style="width:100%;padding:8px 0;">
          <el-col :span="6"
            ><span>医疗费总额：{{ medicareTotalAmt || ' 无' }}</span>
            </el-col>
          <el-col :span="6">
            <span>对账结果：{{ accountChecking[checkResult-1]&&accountChecking[checkResult-1].name || ' 无' }}</span>
          </el-col>
          <el-col :span="6">
            <span>对账结果说明：{{ checkResultRemark || ' 无' }}</span>
          </el-col>
          <el-col :span="6">
            <span>最小门诊流水号：{{ startSerialNum || ' 无' }}</span>
          </el-col>
        </el-row>
        <el-row style="width:100%;padding:8px 0;">
          <el-col :span="6"
            ><span>最大门诊流水号：{{ endSerialNum || ' 无' }}</span>
            </el-col>
          <el-col :span="6">
            <span>交易次数：{{ tradeTimes || ' 无' }}</span>
          </el-col>
          <el-col :span="6">
            <span>明细条数：{{ chargeDetailNum || ' 无' }}</span>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button v-show="!accountCheckId" type="primary" @click="check">对账</el-button>
        <el-button v-show="accountCheckId" type="primary" @click="cancelCheck">撤销对账</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      highlight-current-row
      border
      style="flex: 1"
      width="100%"
      height="30%"
      @current-change="handleCurrentChange"
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
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom">
      <!-- <el-pagination
        style="margin-top: 8px; text-align: right"
        background
        @size-change="changeSize"
        @current-change="handleCurrentChange"
        :current-page="pageParams.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
      ></el-pagination> -->
    </div>
  </div>
</template>

<script>
import { getAccountCheckInfo,cancelCheck,check } from "@/api/medicalInsurance/hisCheck.js";
export default {
  props:{
    OpIpFlag:{

    },
    checkDate:{

    }
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
      value: 1,
      tableData: [],
      columns: [
        {
          prop: "payAmtCode",
          label: "支付项目代码",
          width: "150",
        },
        {
          prop: "payAmtName",
          label: "支付项目名称",
          width: "150",
        },
        {
          prop: "payAmt",
          label: "金额",
          width: "150",
          align:"right"
        },
      ],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      accountCheckId:'',//对账id
      medicareTotalAmt: "",
      checkResult: "",
      checkResultRemark: "",
      startSerialNum: "",
      endSerialNum: "",
      tradeTimes: "",
      chargeDetailNum: "",
      currentRow:{}
    };
  },
  mounted() {
    this.getAccountCheckInfo();
  },
  methods: {
    changeSize() {},
    handleCurrentChange() {},
    async getAccountCheckInfo() {
      let res = await getAccountCheckInfo({
        OpIpFlag: this.OpIpFlag,
        checkDate: this.checkDate,
      });
      if (res.code === 1) {
        this.tableData = res.data.accountCheckAmtList;
        this.accountCheckId = res.data.accountCheckId || "";
        this.medicareTotalAmt = res.data.medicareTotalAmt || "";
        this.checkResult = res.data.checkResult || "";
        this.checkResultRemark = res.data.checkResultRemark || "";
        this.startSerialNum = res.data.startSerialNum || "";
        this.endSerialNum = res.data.endSerialNum || "";
        this.tradeTimes = res.data.tradeTimes || "";
        this.chargeDetailNum = res.data.chargeDetailNum || "";
      }
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    search() {
      this.getAccountCheckInfo();
    },
    async check(){
      let res = await check({
        OpIpFlag: this.OpIpFlag,
        checkDate: this.checkDate,
        medicareType:'01',
        accountCheckAmtList:this.tableData
      });
      if(res.code === 1){
        this.$message.success("对账成功");
        this.getAccountCheckInfo();
      }
    },
    async cancelCheck(){
      let res = await cancelCheck({
        accountCheckId:this.accountCheckId
      });
      if(res.code === 1){
        this.$message.success("撤销对账成功");
        this.getAccountCheckInfo();
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.HealthCareCenterAll {
  display: flex;
  flex-direction: column;
  flex: 1;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top:8px;
    .left {
      flex:1;
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