<template>
  <div class="catalogue width100 height100 clearfix padding16">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <LFormtTitle label="病案号" style="width: 300px">
            <el-input
              v-model="mrCode"
              placeholder="请输入病案号"
              clearable
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="住院号" style="width: 300px">
            <el-input
              v-model="inpCode"
              placeholder="请输入住院号"
              clearable
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="门诊号" style="width: 300px">
            <el-input
              v-model="visitCode"
              placeholder="请输入门诊号"
              clearable
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="支付结算明细ID" style="width: 400px">
            <el-input
              v-model="paySettlementDetailId"
              placeholder="请输入支付结算明细ID"
              clearable
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="支付交易流水号" style="width: 400px">
            <el-input
              v-model="payTradeSerialNum"
              placeholder="请输入支付结算明细ID"
              clearable
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="业务类型" style="width: 220px">
            <l-value-domain
              code="ONLINE_PAY_BIZ_TYPE"
              :value.sync="bizType"
              placeholder="请选择业务类型"
              key="key1"
            ></l-value-domain>
          </LFormtTitle>
          <LFormtTitle label="状态" style="width: 200px">
            <el-select v-model="recordStatus" placeholder="请选择状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="日期" style="width: 380px">
            <el-date-picker
              v-model="date"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </LFormtTitle>
          <el-button style="margin-left:8px;" type="primary" @click="search">查询</el-button>
        </div>
      </div>
      <div class="table-cont">
        <el-table
          :data="tableData"
          width="100%"
          height="100%"
          stripe
          border
          v-loading="loading"
          :element-loading-text="$t('retreat.loadInfo')"
          highlight-current-row
          @row-click="rowClick"
        >
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width || item.label.length * 18 + 24"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'bizType'">
                <span :val="scope.row[item.prop]" code="ONLINE_PAY_BIZ_TYPE" v-codeTransform></span>
              </template>
              <template v-else-if="item.prop == 'recordStatus'">
                <span v-if="scope.row[item.prop] == '0'">初始</span>
                <span v-else-if="scope.row[item.prop] == '1'">成功</span>
                <span v-else-if="scope.row[item.prop] == '2'">失败</span>
                <span v-else-if="scope.row[item.prop] == '3'">异常</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
              <template
                v-else-if="
                  item.prop == 'platformPayStatus' ||
                  item.prop == 'bizCallbackStatus'
                "
              >
                <span v-if="scope.row[item.prop] == '0'">未返回</span>
                <span v-else-if="scope.row[item.prop] == '1'">成功</span>
                <span v-else-if="scope.row[item.prop] == '2'">失败</span>
                <span v-else-if="scope.row[item.prop] == '9'">异常</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
              <span v-else class="overflow-point">{{
                scope.row[item.prop]
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[20, 40, 60, 100, 300, 500, 1000, 3000, 5000, 10000]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>  
  </div>
</template>
<script>
import service from "@/api/financeManagement/onlinePaySettlementDetail";
export default {
  components: {},
  data() {
    return {
      mrCode:'',
      inpCode:'',
      visitCode:'',
      paySettlementDetailId:'',
      payTradeSerialNum:'',
      bizType:'',
      recordStatus:'',
      date:[],
      options: [
        {
          value: "0",
          label: "初始",
        },
        {
          value: "1",
          label: "成功",
        },
        {
          value: "2",
          label: "失败",
        },
        {
          value: "3",
          label: "异常",
        },
      ],
      addStatus: false,
      loading: false,
      deptList: {},
      prestoreCodeShow: {},
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "bizType",
          label: "业务类型",
          align: "center",
          headerAlign: "center",
          width: "80",
        },
        {
          prop: "mrCode",
          label: "病案号",
          align: "center",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "inpCode",
          label: "住院号",
          align: "center",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "visitCode",
          label: "门诊号",
          align: "center",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "patientCode",
          label: "档案号",
          align: "center",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "center",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "payAmt",
          label: "实付金额",
          align: "right",
          headerAlign: "center",
          width: "80",
        },
        {
          prop: "refundedMoney",
          label: "已退金额",
          align: "right",
          headerAlign: "center",
          width: "80",
        },
        {
          prop: "bizTime",
          label: "支付时间",
          align: "center",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "payTypeName",
          label: "支付方式",
          align: "center",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "center",
          headerAlign: "center",
          width: "60",
        },
        {
          prop: "paySettlementDetailId",
          label: "支付结算明细ID",
          align: "center",
          headerAlign: "center",
          width: "300",
        },
        {
          prop: "payTradeSerialNum",
          label: "支付交易流水号",
          align: "center",
          headerAlign: "center",
          width: "300",
        },
        {
          prop: "oldPaySettlementDetailId",
          label: "原支付结算明细ID",
          align: "center",
          headerAlign: "center",
          width: "300",
        },
        {
          prop: "oldPayTradeSerialNum",
          label: "原支付交易流水号",
          align: "center",
          headerAlign: "center",
          width: "300",
        },
        
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        paySettlementDetailId: "",
        payTradeSerialNum: "",
        bizType: "",
        bizNum: "",
        bizTime: "",
        payAmt: "",
        requestePayerId: "",
        requestePayerName: "",
        requestePayTime: "",
        payTypeId: "",
        payTypeCode: "",
        payTypeName: "",
        recordStatus: "1",
        appCode: "",
        appType: "",
        payerAccount: "",
        refundedMoney: "",
        oldPaySettlementDetailId: "",
        oldPayTradeSerialNum: "",
        checkStatus: "",
        checkTime: "",
        platformPayStatus: "",
        platformPayMsg: "",
        bizCallbackUrl: "",
        bizCallbackStatus: "",
        bizCallbackMsg: "",
      },
      rules: {
        payTradeSerialNum: [
          { required: true, message: "请输入支付交易流水号", trigger: "blur" },
        ],
        bizType: [
          { required: true, message: "请输入业务类型", trigger: "blur" },
        ],
      },
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 100,
      },
    };
  },

  mounted() {
    this.getListPageOnlinePaySettlementDetail();
  },
  methods: {
    async getListPageOnlinePaySettlementDetail() {
      this.loading = true;
      let res = await service.getListPageOnlinePaySettlementDetail({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        mrCode: this.mrCode,
        inpCode: this.inpCode,
        visitCode: this.visitCode,
        paySettlementDetailId: this.paySettlementDetailId,
        payTradeSerialNum: this.payTradeSerialNum,
        bizType: this.bizType,
        recordStatus: this.recordStatus,
        startDate:this.date[0],
        endDate:this.date[1]
      });
      this.loading = false;
      this.tableData = res.data.map((item) => {
        item.payAmt = item.payAmt.toFixed(2);
        item.refundedMoney = item.refundedMoney.toFixed(2);
        return item;
      });
      this.pageParams.total = res.total;
      if (typeof tableData !== "undefined") {
        this.currentData = this.tableData[0];
        this.$emit("currentData", this.currentData);
        this.form = { ...this.currentData };
      } else {
        this.currentData = [];
      }
    },
    search() {
      this.pageParams.pageNo = 1;
      this.getListPageOnlinePaySettlementDetail();
    },
    rowClick(row) {
      this.currentData = row;
      this.$emit("currentData", this.currentData);
      this.form = { ...this.currentData };
      this.addStatus = false;
      // this.form.grantDepartmentId = parseInt(row.grantDepartmentId);
    },
    async add() {
      this.form = {
        paySettlementDetailId: "",
        payTradeSerialNum: "",
        bizType: "",
        bizNum: "",
        bizTime: "",
        payAmt: "",
        requestePayerId: "",
        requestePayerName: "",
        requestePayTime: "",
        payTypeId: "",
        payTypeCode: "",
        payTypeName: "",
        recordStatus: "1",
        appCode: "",
        appType: "",
        payerAccount: "",
        refundedMoney: "",
        oldPaySettlementDetailId: "",
        oldPayTradeSerialNum: "",
        checkStatus: "",
        checkTime: "",
        platformPayStatus: "",
        platformPayMsg: "",
        bizCallbackUrl: "",
        bizCallbackStatus: "",
        bizCallbackMsg: "",
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.OnlinePaySettlementDetailId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delOnlinePaySettlementDetailById(
          this.form.OnlinePaySettlementDetailId
        );
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.getListPageOnlinePaySettlementDetail();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "删除失败");
      }
    },
    async save() {
      if (this.addStatus) {
        try {
          this.$showLoading();
          console.log(this.form);
          let res = await service.addOnlinePaySettlementDetail(this.form);
          this.$hideLoading();
          if (res.code === 1) {
            this.$message({ type: "success", message: "新增成功" });
            this.getListPageOnlinePaySettlementDetail();
          } else {
            this.$message({ type: "flag", message: "新增失败" });
          }
        } catch (error) {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "新增失败");
        }
      } else {
        try {
          this.$showLoading();
          let res = await service.updateOnlinePaySettlementDetail(this.form);
          this.$hideLoading();
          this.$message({ type: "success", message: "保存成功" });
          this.getListPageOnlinePaySettlementDetail();
        } catch (error) {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "保存失败");
        }
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getListPageOnlinePaySettlementDetail();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getListPageOnlinePaySettlementDetail();
    },
  },
};
</script>
<style lang="scss" scoped>
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-20 {
  margin-top: 20px;
}
.l-input-wrap{
  margin-bottom:8px;
}
.catalogue {
  background-color: #fff;
  .catalogue-left {
    width: 100%;
    display: flex;
    flex-direction: column;
    .search-area {
      display: flex;
      .search-input {
        flex: 1;
      }
    }
    .table-cont {
      flex:1;
      margin-bottom:16px;
    }
    .page {
      text-align: right;
      padding: 0 8px;
      .el-pagination {
        padding: 0;
        /deep/ .el-pagination__editor.el-input .el-input__inner {
          height: 100% !important;
        }
      }
    }
  }
  .catalogue-right {
    width: 300px;
    padding: 10px;
    overflow-y: scroll;
    .catalogue-right-form {
      // height: calc(100% - 46px);
      border-bottom: 1px solid $l-color-bgcolor-11;
    }
    .catalogue-right-btn {
      margin-top: 10px;
    }
  }
}
</style>