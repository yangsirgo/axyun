<template>
  <div class="hisAccountCheck height100">
    <div class="hisAccountCheck-all">
      <l-card-title>
        <template #left>
          总账<span style="margin-left: 30px; font-weight: 500"
            >HIS记账总额：{{
              hisAccountCheckAll.hisTotalFreeTotalMoney
            }}
            医保记账总额：{{ hisAccountCheckAll.siTotalFreeTotalMoney }}</span
          >
        </template>
        <template #right
          ><el-button type="primary" @click="searchAllFuc"
            >查询</el-button
          ></template
        >
      </l-card-title>
    </div>
    <div class="hisAccountCheck-center">
      <l-card-title>
        <template #left
          >明细账
          <LFormtTitle label="对账结果" style="width: 230px; margin: 0 30px"
            ><el-select v-model="searchValue.resultCode" clearable>
              <el-option
                v-for="(item, index) in statesOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </LFormtTitle>
        </template>
        <!-- <template #right
          ><el-button type="primary" @click="search">查询</el-button></template
        > -->
      </l-card-title>
      <div class="tableCont">
        <el-table
          ref="tableData"
          :data="tableData"
          height="100%"
          v-loading="loading"
          border
        >
          <el-table-column
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'center'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'oprate'">
                <el-button type="text" @click="chargeAgainst(scope.row)"
                :disabled="scope.row.permitChargeAgainstFlag !== '1'"
                  >冲销</el-button
                >
              </template>
              <template v-else-if="item.prop === 'hisPatientName'">
                {{ scope.row["hisPatientName"] || scope.row["siPatientName"] }}
              </template>
              <template v-else-if="item.prop === 'resultCode'">
                {{ getResultName(scope.row[item.prop]) }}
              </template>
              <template v-else-if="item.type === 'money'">
                {{ Number(scope.row[item.prop] || 0).toFixed(2) }}
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @size-change="changeSize"
          @current-change="changePage"
          :current-page.sync="pageParams.pageNo"
          :page-sizes="[20, 40, 100, 200]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api/medicalInsuranceNew/accountCheck.js";

export default {
  name: "hisAccountCheck",
  props: {
    searchAll: {
      type: Object,
      default() {
        return {
          clrType: "",
          date: [],
        };
      },
    },
    medicareType: {
      type: String,
      default: "02",
    },
  },
  data() {
    return {
      searchValue: {},
      //分页数据
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      statesOptions: [
        {
          value: "1",
          label: "匹配",
        },
        {
          value: "0",
          label: "不匹配",
        },
      ],
      tableData: [],
      columns: [
        {
          label: "操作",
          prop: "oprate",
          width: 80,
        },
        {
          label: "患者姓名",
          prop: "hisPatientName",
          width: 80,
        },
        {
          label: "交易时间",
          prop: "siTradeTime",
          width: 150,
        },
        {
          label: "状态",
          prop: "resultCode",
          width: 80,
        },
        {
          label: "HIS记账金额",
          prop: "hisFreeAmt",
          width: 110,
          type: "money",
          align: "right"
        },
        {
          label: "医保记账金额",
          prop: "siFreeAmt",
          width: 110,
          type: "money",
          align: "right"
        },
        {
          label: "差额",
          prop: "freeBalance",
          width: 70,
          type: "money",
          align: "right"
        },
        {
          label: "HIS交易ID",
          prop: "hisTradeId",
          width: 200,
        },
        {
          label: "医保交易ID",
          prop: "siTradeId",
          width: 200,
        },
        {
          label: "医保结算ID",
          prop: "siSettleBizSerialNum",
          width: 200,
        },
      ],
      loading: false,
      hisAccountCheckAll: {
        hisTotalFreeTotalMoney: "0.00",
        siTotalFreeTotalMoney: "0.00",
      },
    };
  },
  computed: {
    searchAllValue() {
      let date = this.searchAll.date;
      return {
        clrType: this.searchAll.clrType,
        startTime: date.length ? date[0] + " 00:00:00" : "",
        endTime: date.length ? date[1] + " 23:59:59" : "",
      };
    },
  },
  created() {
    // this.sumAccount();
    // this.search();
  },
  methods: {
    searchAllFuc() {
      this.sumAccount();
      this.search();
    },
    // HIS对账-总账信息查询
    async sumAccount() {
      if (!this.searchAll.clrType) {
        this.$message.warning("请选择清算类别！");
        return;
      }
      if (!this.searchAll.date.length) {
        this.$message.warning("请选择日期！");
        return;
      }
      try {
        let params = {
          ...this.searchAllValue,
          medicareType: this.medicareType,
        };
        let res = await service.sumAccount(params);
        if (res.code == 1) {
          this.hisAccountCheckAll = res.data;
        } else {
          this.$message.error(res.msg || "总账信息查询失败！");
        }
      } catch (error) {}
    },
    search() {
      this.pageParams.pageNo = 1;
      this.detailAccount();
    },
    // HIS对账-明细信息查询
    async detailAccount() {
      if (!this.searchAll.clrType) {
        this.$message.warning("请选择清算类别！");
        return;
      }
      if (!this.searchAll.date.length) {
        this.$message.warning("请选择日期！");
        return;
      }
      try {
        let params = {
          ...this.searchAllValue,
          medicareType: this.medicareType,
          resultCode: this.searchValue.resultCode,
          ...this.pageParams,
        };
        let res = await service.detailAccount(params);
        if (res.code == 1) {
          this.tableData = res.data;
          this.pageParams.total = res.total;
        } else {
          this.$message.error(res.msg || "明细信息查询失败！");
        }
      } catch (error) {}
    },
    // 冲销
    async chargeAgainst(row) {
      this.$confirm("是否冲销, 请确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        // TODO   chargeDetailCheckId
        try {
          let params = {
            siTradeId: row.siTradeId,
            chargeDetailCheckId: row.chargeDetailCheckId,
          };
          let res = await service.chargeAgainst(params);
          if (res.code == 1) {
            this.searchAllFuc();
          } else {
            this.$message.error(res.msg || "冲销失败！");
          }
        } catch (error) {}
      });
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.detailAccount();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.detailAccount();
    },
    getResultName(val) {
      let list = this.statesOptions;
      let arr = list.filter((item) => {
        return item.value === val;
      });
      if (arr.length) {
        return arr[0].label;
      }
      return "";
    },
  },
};
</script>
<style scoped lang="scss">
.hisAccountCheck {
  padding: 10px 0;
  .hisAccountCheck-all {
    padding: 10px 0;
  }
  .hisAccountCheck-center {
    height: calc(100% - 65px);
    .tableCont {
      height: calc(100% - 80px);
      margin-top: 10px;
    }
    .page {
      margin-top: 7px;
      text-align: right;

      .el-pagination {
        padding: 0;

        /deep/ .el-pagination__editor.el-input .el-input__inner {
          height: 100% !important;
        }
      }
    }
  }
  /deep/.el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus {
    color: #c3b5b5;
  }
}
</style>