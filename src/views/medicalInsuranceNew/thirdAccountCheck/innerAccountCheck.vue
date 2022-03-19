<template>
  <div class="innerAccountCheck height100">
    <div class="innerAccountCheck-navBar">
      <el-row :gutter="10">
        <el-col :span="5"
          ><LFormtTitle label="请求时间" required>
            <el-date-picker
              v-model="searchValue.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker></LFormtTitle
        ></el-col>
        <el-col :span="4"
          ><LFormtTitle label="处理状态">
            <el-select v-model="searchValue.dealFlag" placeholder="请选择">
              <el-option
                v-for="item in dealFlagOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> </LFormtTitle
        ></el-col>
        <el-col :span="4"
          ><LFormtTitle label="业务类型">
            <el-select v-model="searchValue.bizType" placeholder="请选择">
              <el-option
                v-for="item in bizTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> </LFormtTitle
        ></el-col>
        <el-col :span="4"
          ><LFormtTitle label="支付方式">
            <el-select v-model="searchValue.payType" placeholder="请选择">
              <el-option
                v-for="item in payTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> </LFormtTitle
        ></el-col>
        <el-col :span="4"
          ><LFormtTitle label="支付状态"
            ><el-select v-model="searchValue.recordStatus" placeholder="请选择">
              <el-option
                v-for="item in recordStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> </LFormtTitle
        ></el-col>
        <el-col :span="3"
          ><el-button
            type="primary"
            class="float-right"
            style="margin-right: 6px"
            @click="getListCheckDetail"
            >查询</el-button
          ></el-col
        >
      </el-row>
    </div>
    <div class="innerAccountCheck-center">
      <el-table
        ref="tableData"
        :data="tableData"
        height="100%"
        v-loading="loading"
        border
        stripe
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
              <!-- <el-button
                type="text"
                @click="syncAccount(scope.row)"
                :disabled="
                  scope.row.recordStatus !== '0' &&
                  scope.row.recordStatus !== '3'
                "
                >同步</el-button
              > -->
              <el-button
                type="text"
                @click="returnAccount(scope.row)"
                :disabled="scope.row.permitRefundFlag !== '1'"
                >退款</el-button
              >
            </template>
            <template v-else-if="item.prop === 'bizType'">
              {{
                transformFuc(
                  scope.row[item.prop],
                  "value",
                  "label",
                  "bizTypeOptions"
                )
              }}
            </template>
            <template v-else-if="item.prop === 'recordStatus'">
              {{
                transformFuc(
                  scope.row[item.prop],
                  "value",
                  "label",
                  "recordStatusOptions"
                )
              }}
            </template>
            <template v-else-if="item.prop === 'hisInAccountStatus'">
              {{
                transformFuc(
                  scope.row[item.prop],
                  "value",
                  "label",
                  "hisInAccountStatusOptions"
                )
              }}
            </template>
            <template v-else-if="item.type === 'money'">
              {{ Number(scope.row[item.prop] || 0).toFixed(2) }}
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import service from "@/api/medicalInsuranceNew/thirdAccountCheck.js";

export default {
  name: "innerAccountCheck",
  props: {
    medicareType: {
      type: String,
      default: "02",
    },
  },
  data() {
    return {
      searchValue: {
        date: [
          this.dayjs(new Date()).format("YYYY-MM-DD") + " 00:00:00",
          this.dayjs(new Date()).format("YYYY-MM-DD") + " 23:59:59",
        ],
      },
      dealFlagOptions: [
        {
          value: "1",
          label: "待处理",
        },
        {
          value: "0",
          label: "无需处理",
        },
        {
          value: "",
          label: "全部",
        },
      ],
      bizTypeOptions: [
        {
          value: "02",
          label: "门诊结算",
        },
        {
          value: "03",
          label: "住院预缴",
        },
        {
          value: "",
          label: "全部",
        },
      ],
      payTypeOptions: [
        {
          value: "wxpay_barcode",
          label: "微信",
        },
        {
          value: "alipay_barcode",
          label: "支付宝",
        },
      ],
      recordStatusOptions: [
        {
          value: "0",
          label: "已申请",
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
        {
          value: "",
          label: "全部",
        },
      ],
      hisInAccountStatusOptions: [
        {
          value: "0",
          label: "未入账",
        },
        {
          value: "1",
          label: "已入账",
        },
      ],
      tableData: [],
      columns: [
        {
          label: "操作",
          prop: "oprate",
          width: 70,
        },
        {
          label: "患者姓名",
          prop: "patientName",
          width: 80,
        },
        {
          label: "患者编号",
          prop: "patientCode",
          width: 150,
        },
        {
          label: "就诊号",
          prop: "clinicCode",
          width: 130,
        },
        {
          label: "业务时间",
          prop: "bizTime",
          width: 150,
        },
        {
          label: "业务类型",
          prop: "bizType",
          width: 110,
        },
        {
          label: "支付方式",
          prop: "payTypeName",
          width: 90,
        },
        {
          label: "支付金额",
          prop: "payAmt",
          width: 90,
          type: "money",
          align: "right",
        },
        {
          label: "已退金额",
          prop: "refundedMoney",
          width: 90,
          type: "money",
          align: "right",
        },
        {
          label: "支付状态",
          prop: "recordStatus",
          width: 90,
        },
        {
          label: "HIS入账状态",
          prop: "hisInAccountStatus",
          width: 120,
        },
        {
          label: "支付申请人",
          prop: "requestePayerName",
          width: 120,
        },
        /* {
          label: "支付申请时间",
          prop: "requestePayTime",
          width: 150,
        }, */
        {
          label: "支付结果信息",
          prop: "payMsg",
          width: 120,
        },
        {
          label: "支付流水号",
          prop: "payTradeSerialNum",
          width: 150,
        },
        {
          label: "业务流水号",
          prop: "bizNum",
          width: 150,
        },
      ],
      loading: false,
    };
  },
  created() {
    this.getListCheckDetail();
  },
  methods: {
    // HIS对账-明细信息查询
    async getListCheckDetail() {
      this.loading = true;
      try {
        let date = this.searchValue.date;
        let startRequestPayTime = date && date.length === 2 ? date[0] : "";
        let endRequestPayTime = date && date.length === 2 ? date[1] : "";
        let params = {
          ...this.searchValue,
          startRequestPayTime,
          endRequestPayTime,
        };
        delete params.date;
        let res = await service.getListCheckDetail(params);
        if (res.code == 1) {
          this.tableData = res.data;
        } else {
          this.$message.error(res.msg || "明细信息查询失败！");
        }
      } catch (error) {}finally{
        this.loading = false;
      }
    },
    // 同步
    async syncAccount(row) {
      try {
        let params = {
          paySettlementDetailID: row.paySettlementDetailID
        };
        let res = await service(params);
        if (res.code == 1) {
          this.$message.success("同步成功！");
          this.getListCheckDetail();
        } else {
          this.$message.error(res.msg || "同步失败！");
        }
      } catch (error) {}
    },
    // 退款
    async returnAccount(row) {
      try {
        let params = {
          paySettlementDetailID: row.paySettlementDetailId
        };
        let res = await service.refunded(params);
        if (res.code == 1) {
          this.$message.success("退款成功！");
          this.getListCheckDetail();
        } else {
          this.$message.error(res.msg || "退款失败！");
        }
      } catch (error) {}
    },
    // 反显数据
    transformFuc(val, codeName, labelName, optionName) {
      if (val === "") {
        return "";
      }
      let options = this[optionName];
      let arr = options.filter((item) => {
        return item[codeName] === val;
      });
      if (arr.length) {
        return arr[0][labelName];
      }
      return "";
    },
  },
};
</script>
<style scoped lang="scss">
.innerAccountCheck {
  padding-top: 10px;
  .innerAccountCheck-center {
    height: calc(100% - 44px);
    margin-top: 10px;
  }
  /deep/.el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus {
    color: #c3b5b5;
}
}
</style>