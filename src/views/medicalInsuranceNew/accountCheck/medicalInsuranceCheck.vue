<template>
  <div class="medicalInsuranceCheck height100">
    <div class="medicalInsuranceCheck-top">
      <l-card-title>
        <template #left
          >总账
          <!-- <el-button type="primary" @click="search" style="margin-left: 30px"
            >查询</el-button
          > -->
        </template>
        <template #right><el-button type="primary" @click="search">查询</el-button></template>
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
                <el-button type="text" @click="insuranceCheck(scope.row)"
                  >对账</el-button
                >
              </template>
              <template v-else-if="item.type === 'money'">
                {{ Number(scope.row[item.prop] || 0).toFixed(2) }}
              </template>
              <template v-else-if="item.prop === 'insuranceType'">
                {{ transformNew("insutype", scope.row[item.prop] || "") }}
              </template>
              <template v-else-if="item.prop === 'stmtRslt'">
                {{ getStmtRsltName(scope.row[item.prop] || "") }}
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="medicalInsuranceCheck-bottom">
      <l-card-title>
        <template #left
          >明细账（已对账/未对账）
          <el-button type="primary" @click="detailCheck" style="margin: 0 30px"
            >明细对账</el-button
          >
          <LFormtTitle label="对账结果" style="width: 230px"
            ><el-select v-model="searchValue1.stmtRslt" clearable>
              <el-option
                v-for="(item, index) in statesOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </LFormtTitle>
          <!-- <el-button type="primary" @click="search1" style="margin-left: 30px"
            >查询</el-button
          > -->
        </template>
        <template #right><el-button type="primary" @click="search1">查询</el-button></template>
      </l-card-title>
      <div class="tableCont">
        <el-table
          ref="tableData1"
          :data="tableData1"
          height="100%"
          v-loading="loading1"
          border
        >
          <el-table-column
            v-for="(item, index) in columns1"
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
                  >冲销</el-button
                >
              </template>
              <template v-else-if="item.type === 'money'">
                {{ Number(scope.row[item.prop] || 0).toFixed(2) }}
              </template>
              <template v-else-if="item.prop === 'refdSetlFlag'">
                {{ transformNew("refd_setl_flag", scope.row[item.prop] || "") }}
              </template>
              <template v-else-if="item.prop === 'stmtRslt'">
                {{ getStmtRsltName(scope.row[item.prop] || "") }}
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api/medicalInsuranceNew/accountCheck.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";

export default {
  name: "medicalInsuranceCheck",
  mixins: [getDictInfoNew],
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
  },
  data() {
    return {
      searchValue: {},
      tableData: [],
      columns: [
        {
          label: "操作",
          prop: "oprate",
          width: 80,
        },
        {
          label: "险种",
          prop: "insuranceType",
          width: 100,
        },
        {
          label: "医疗总费用",
          prop: "medfeeSumamt",
          type: "money",
          align: "right",
          width: 120,
        },
        {
          label: "基金支付总额",
          prop: "fundPaySumamt",
          type: "money",
          align: "right",
          width: 120,
        },
        {
          label: "个人账户支付金额",
          prop: "acctPay",
          type: "money",
          align: "right",
          width: 120,
        },
        {
          label: "现金支付金额",
          prop: "",
          type: "money",
          align: "right",
          width: 120,
        },
        {
          label: "定点医疗机构结算笔数",
          prop: "fixmedinsSetlCnt",
          width: 180,
        },
        {
          label: "对账结果",
          prop: "stmtRslt",
          width: 120,
        },
        {
          label: "对账结果说明",
          prop: "stmtRsltDscr",
          width: 120,
        },
      ],
      loading: false,
      searchValue1: {},
      tableData1: [],
      columns1: [
        {
          label: "操作",
          prop: "oprate",
          width: 80,
        },
        {
          label: "结算ID",
          prop: "setlId",
          width: 120,
        },
        {
          label: "就诊ID",
          prop: "mdtrtId",
          width: 120,
        },
        {
          label: "患者姓名",
          prop: "patientName",
          width: 80,
        },
        {
          label: "医疗费总额",
          prop: "medfeeSumAmt",
          type: "money",
          align: "right",
          width: 120,
        },
        {
          label: "基金支付总额",
          prop: "fundPaySumAmt",
          type: "money",
          align: "right",
          width: 120,
        },
        {
          label: "个人账户支出",
          prop: "acctPay",
          type: "money",
          align: "right",
          width: 120,
        },
        {
          label: "退费结算标志",
          prop: "refdSetlFlag",
          width: 120,
        },
        {
          label: "对账结果",
          prop: "stmtRslt",
          width: 120,
        },
        {
          label: "备注",
          prop: "memo",
          width: 120,
        },
        {
          label: "发送报文ID",
          prop: "msgid",
          width: 120,
        },
        {
          label: "医保中心医疗费用总额",
          prop: "hicentMedfeeSumAmt",
          type: "money",
          width: 180,
        },
        {
          label: "医保基金支付总额",
          prop: "hifPaySumAmt",
          type: "money",
          width: 170,
        },
        {
          label: "医保中心个人账户支出",
          prop: "hicentAcctPay",
          type: "money",
          width: 180,
        },
      ],
      loading1: false,
      statesOptions: [
        {
          label: "医疗机构多",
          value: "A",
        },
        {
          label: "平",
          value: "0",
        },
        {
          label: "中心多",
          value: "1",
        },
        {
          label: "医药机构多",
          value: "2",
        },
        {
          label: "数据不椅子",
          value: "3",
        },
      ],
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
  methods: {
    // 获取险种分类对账信息
    async search() {
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
        };
        let res = await service.getInsuranceInfo(params);
        if (res.code == 1) {
          this.tableData = res.data;
        } else {
          this.$message.error(res.msg || "险种分类对账信息查询失败！");
        }
      } catch (error) {}
    },
    // 医保中心对账-明细对账信息查询
    async search1() {
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
          stmtRslt: this.searchValue1.stmtRslt,
        };
        let res = await service.getDetailCheckInfo(params);
        if (res.code == 1) {
          this.tableData1 = res.data;
        } else {
          this.$message.error(res.msg || "明细对账信息查询失败！");
        }
      } catch (error) {}
    },
    // 医保中心对账-险种对账
    async insuranceCheck() {
      try {
        let params = {};
        let res = await service.insuranceCheck(params);
        this.$message.info("正在对账，请稍后。");
        if (res.code == 1) {
        } else {
          this.$message.error(res.msg || "对账失败！");
        }
      } catch (error) {}
    },
    // 医保中心对账-明细对账
    async detailCheck() {
      try {
        let params = {
          ...this.searchAllValue,
        };
        let res = await service.detailCheck(params);
        if (res.code == 1) {
        } else {
          this.$message.error(res.msg || "对账失败！");
        }
      } catch (error) {}
    },
    // 冲销
    async chargeAgainst(row) {
      this.$confirm("是否确认删除, 是否继续?", "提示", {
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
            this.search1();
          } else {
            this.$message.error(res.msg || "冲销失败！");
          }
        } catch (error) {}
      });
    },
    // stmtRslt
    getStmtRsltName(val) {
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
.medicalInsuranceCheck {
  padding: 10px 0;
  .medicalInsuranceCheck-top {
    padding: 10px 0;
    height: 50%;
    .tableCont {
      height: calc(100% - 24px);
      margin-top: 10px;
    }
  }
  .medicalInsuranceCheck-bottom {
    padding: 10px 0;
    height: 50%;
    .tableCont {
      height: calc(100% - 24px);
      margin-top: 10px;
    }
  }
  /deep/.el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus {
    color: #c3b5b5;
  }
}
</style>