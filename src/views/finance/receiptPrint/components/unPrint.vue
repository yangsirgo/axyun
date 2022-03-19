<template>
  <div class="width100 height100">
    <el-row :gutter="10" class="width100 title" style="display:flex;align-items:center;">
      <el-col style="width:200px;">
        <l-card-title class="float-left" style="padding:8px 0;">
          <span slot="left">交易记录明细</span>
        </l-card-title>
      </el-col>
      <el-col style="width:450px;" class="height100">
        <LFormtTitle label="交易时间" class="l-center-vertical">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00','23:59:59']"
            clearable
          ></el-date-picker>
        </LFormtTitle>
      </el-col>
      <el-col :span="2" class="height100">
        <el-button
          type="primary"
          plain
          class="float-left l-center-vertical"
          @click="getTradeDetailQuery"
        >查询</el-button>
      </el-col>
    </el-row>
    <div class="width100 tableDiv">
      <el-table
        :data="tableData"
        width="100%"
        height="calc(50% - 79px)"
        stripe
        border
        v-loading="loading"
        :element-loading-text="$t('retreat.loadInfo')"
        highlight-current-row
        @selection-change="getRowsIdx"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="40px" header-align="center" align="center"></el-table-column>
        <el-table-column
          v-for="(item, index) in tableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <template v-if="item.prop == 'settlementType'">
              <span :val="scope.row['settlementType']" code="settlementType" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'ouptDeptId'">
              <span
                tableName="sys_org"
                :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row[item.prop]
                    }"
                columns="org_nm"
                v-tableTransform
              ></span>
            </template>
            <template v-else-if="item.prop == 'totalMoney'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'selfPayMoney'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'freePayMoney'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'derateAmount'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'couponPay'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'bxMoney'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'ybMoney'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>

      <l-card-title class="float-left" style="padding:8px 0;">
        <span slot="left">收费项目明细</span>
      </l-card-title>
      <el-table
        :data="tableDataTwo"
        width="100%"
        height="calc(50% - 80px)"
        stripe
        border
        v-loading="loadingTwo"
        :element-loading-text="$t('retreat.loadInfo')"
        highlight-current-row
      >
        <el-table-column
          v-for="(item, index) in tableParamsTwo"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <template v-if="item.prop == 'classCode'">
              <span :val="scope.row['classCode']" code="FinClassCode" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'chargeUnit'">
              <span v-if="!isChinese(scope.row[item.prop])" :val="scope.row[item.prop]" code="DrugUnit" v-codeTransform></span>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
            <template v-else-if="item.prop == 'chargePrice'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'totalMoney'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChangeTwo"
          @current-change="handleCurrentChangeTwo"
          :current-page="pageParamsTwo.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageParamsTwo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParamsTwo.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api/cis/receiptPrint/receiptPrint";
Date.prototype.toLocaleStr = function() {
  var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
  var day = ("0" + this.getDate()).slice(-2);
  return this.getFullYear() + "-" + month + "-" + day;
};

export default {
  props: {
    patientId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // 时间
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      //
      loading: false,
      loadingTwo: false,
      // 表格数据
      tableData: [],
      chargeDetailPageList: [],
      // 表格列
      tableParams: [
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "settlementTypeName",
          label: "结算类型",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "chargeUserName",
          label: "收费员",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "chargeTime",
          label: "交易时间",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        // {
        //   prop: "userType",
        //   label: "人员类别",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        {
          prop: "ouptDeptId",
          label: "专科",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "doctorName",
          label: "医生姓名",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "totalMoney",
          label: "总金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "selfPayMoney",
          label: "自付金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "freePayMoney",
          label: "记账金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "derateAmount",
          label: "减免金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "couponPay",
          label: "优惠券金额",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "bxMoney",
          label: "报销金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          // 医保金额
          prop: "ybMoney",
          label: "账户金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        }
      ],
      // 收费项目明细
      tableDataTwo: [],
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      // 明细分页
      pageParamsTwo: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      // 收费项目明细列
      tableParamsTwo: [
        {
          prop: "classCodeName",
          label: "财务分类",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "chargeItemName",
          label: "收费项目名称",
          align: "left",
          headerAlign: "center",
          width: "140"
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          headerAlign: "center",
          width: "80"
        },
        {
          prop: "chargeQuantity",
          label: "数量",
          align: "right",
          headerAlign: "center",
          width: "70"
        },
        {
          prop: "chargeUnit",
          label: "单位",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "chargePrice",
          label: "单价",
          align: "right",
          headerAlign: "center",
          width: "70"
        },
        {
          prop: "totalMoney",
          label: "金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        }
      ]
    };
  },
  watch: {
    patientId: {
      handler(value) {
        this.patientId = value;
        // this.date = [new Date(), new Date()];
        this.getTradeDetailQuery();
      }
    }
  },
  mounted() {
    // this.date = [new Date(), new Date()];
    // this.getTradeDetail();
  },
  methods: {
    isChinese(temp) {
      var re = /[\d]+/;
      if (re.test(temp)) return false;
      return true;
    },
    // load
    load() {},
    loadTwo() {},
    async getTradeDetailQuery() {
      this.pageParams.pageNo = 1;
      this.tableData = [];
      this.getTradeDetail();
    },
    // 查询交易明细
    async getTradeDetail() {
      try {
        if (!this.patientId || this.patientId == "") {
          this.$message.error("请选择患者");
          return;
        }
        this.loading = true;
        let obj = {
          patientId: this.patientId || undefined,
          pageNo: this.pageParams.pageNo, // 页码
          pageSize: this.pageParams.pageSize, // 页码大小
          sDate: "",
          eDate: ""
        };
        if (this.date && this.date.length > 1) {
          obj.startChargeTime = this.date[0];
          obj.endChargeTime = this.date[1];
        }
        let res = await service.getOutpTradeDetailByPatient(obj);
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.info(error);
        this.$message.error(error.msg || "查询交易明细失败");
      }
    },
    // 查询收费明细
    async selectChargeDetail(tradeIds) {
      this.pageParamsTwo.pageNo = 1;
      try {
        if (tradeIds.length <= 0) {
          this.tableDataTwo = [];
          return;
        }
        let obj = {
          tradeIds: tradeIds,
          pageNo: this.pageParamsTwo.pageNo, // 页码
          pageSize: this.pageParamsTwo.pageSize // 页码大小
        };

        this.loadingTwo = true;
        let res = await service.getOutpChargeDetailByPage(obj);
        this.tableDataTwo = res.data;
        this.pageParamsTwo.total = res.total;
        this.loadingTwo = false;
      } catch (error) {
        this.loadingTwo = false;
        console.info(error);
        this.$message.error(error.msg || "查询收费明细失败");
      }
    },
    async chargeDetailPage() {
      let obj = {
        tradeIds: this.chargeDetailPageList,
        pageNo: this.pageParamsTwo.pageNo, // 页码
        pageSize: this.pageParamsTwo.pageSize // 页码大小
      };

      this.loadingTwo = true;
      let res = await service.getOutpChargeDetailByPage(obj);
      this.tableDataTwo = res.data;
      this.pageParamsTwo.total = res.total;
      this.loadingTwo = false;
    },
    getRowsIdx(rows) {
      let list = [];
      let item = rows[0];
      rows.forEach(val => {
        if (
          val.patientId != item.patientId ||
          val.settlementType != item.settlementType
        ) {
          this.$message.error("只能合并打印同一结算类型的同一患者的交易！");
          list = [];
          this.$refs.multipleTable.clearSelection();
          return;
        }

        list.push(val.tradeId);
      });
      this.chargeDetailPageList = list;
      this.selectChargeDetail(list);
      this.selectTradeDetail(list);
    },
    // 勾选交易明细
    selectTradeDetail(list) {
      this.$emit("selectTradeDetail", list);
    },
    // 千位分隔
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getTradeDetail();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getTradeDetail();
    },
    // 明细分页
    handleSizeChangeTwo(val) {
      this.pageParamsTwo.pageSize = val;
      this.chargeDetailPage();
    },
    handleCurrentChangeTwo(val) {
      this.pageParamsTwo.pageNo = val;
      this.chargeDetailPage();
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  height: 63px;
}
.tableDiv {
  height: calc(100% - 63px);
  .page {
    margin-top: 20px;
    text-align: right;
    .el-pagination {
      padding: 0;
      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }
}
</style>
