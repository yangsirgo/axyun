<template>
  <div class="contain">
    <div class="dialog-header">
      <el-form :model="accountRefundForm" :rules="rules" ref="accountRefundForm">
        <div class="detail">
          <div class="title">
            <span>{{patientInfo.patientName || '--'}}</span>
            <span :val="patientInfo.patientGender" code="GENDER_CODE" v-codeTransform></span>
            <span>{{patientInfo.age || '--'}}</span>
            <!-- <span>账户类型：预存账户</span> -->
            <span>账户余额：{{formatNumber(accountDetailInfoData.balanceMoney)}}元</span>
          </div>
          <div class="balanceSum"></div>
        </div>
        <div class="rechargeMethod">
          <el-row class="width100 height100">
            <el-col :span="12" class="payTypeCol padding10 height100">
              <l-card-title>
                <template slot="left">请选择退款方式</template>
                <template slot="right"><span class="margin-right-10">渠道总可退：{{formatNumber(refundMoneyGroupPayType[accountRefundForm.payTypeId] || 0)}}</span></template>
              </l-card-title>
              <div class="margin-top-10 scroll-vertical divHeight">
                <el-form-item prop="payTypeId">
                  <el-row :gutter="10" class="pay-type">
                    <el-col
                      :span="12"
                      class="margin10"
                      v-for="item in returnTypeListShow"
                      :key="item.payTypeId"
                    >
                      <el-row class="radio-item">
                        <el-col :span="24">
                          <el-radio
                            v-model="accountRefundForm.payTypeId"
                            :label="item.payTypeId"
                            style="width:100%;"
                            @change="selectPayType"
                          >
                            <span
                              style="display:inline-block;vertical-align: sub;margin-right:10px"
                            >
                              <svg
                                t="1568712240954"
                                class="icon"
                                viewBox="0 0 1137 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="8446"
                                width="20"
                                height="20"
                              >
                                <path
                                  d="M113.777778 0h910.222222a113.777778 113.777778 0 0 1 113.777778 113.777778v796.444444a113.777778 113.777778 0 0 1-113.777778 113.777778H113.777778a113.777778 113.777778 0 0 1-113.777778-113.777778V113.777778a113.777778 113.777778 0 0 1 113.777778-113.777778z m512 341.333333H512V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777778H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777777a56.888889 56.888889 0 0 0 113.777778 0v-113.777777h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-170.666666V455.111111h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-56.888888V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777z"
                                  fill="#38A79C"
                                  p-id="8447"
                                />
                              </svg>
                            </span>
                            {{ item.payTypeName }}
                          </el-radio>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12" class="padding10 height100">
              <l-card-title>
                <template slot="left">请选择要退款的充值记录</template>
                <template slot="right">可退小计：{{formatNumber(tableTotalMoney)}}</template>
              </l-card-title>
              <el-table
                class="margin-top-10 width100"
                :data="tableData"
                height="90%"
                stripe
                border
                v-loading="loading"
                :element-loading-text="$t('retreat.loadInfo')"
                @selection-change="selChange"
              >
                <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
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
                    <template v-if="item.prop == 'prestoreRefund' || item.prop == 'prestoreMoney'">
                      <span>{{formatNumber(scope.row[item.prop]) || '0.00' }}</span>
                    </template>
                    <template v-else>
                      <span>{{ scope.row[item.prop] }}</span>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div class="sum margin-top-10">
          <el-row :gutter="10">
            <el-col :span="12">
              <LFormtTitle label="退款金额" required>
                <el-form-item prop="prestoreAmt">
                  <el-input
                    v-model="accountRefundForm.prestoreAmt"
                    placeholder
                    style="line-height: 34px;width:100%"
                  ></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="12">
              <LFormtTitle label="备注">
                <el-form-item prop="remark">
                  <el-input v-model="accountRefundForm.remark" style="line-height: 34px;width:100%"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer clearfix" slot="footer">
      <div style="float:right">
        <el-button type="primary" @click="confirm">确定退款</el-button>
        <el-button @click="cancel" class="el-button-cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { fefund, prestore_or_refund } from "@/api/arch/arch.js";
import { mapActions, mapGetters } from "vuex";
import service from "@/api/financeManagement/inp.js";
import prestoreDetailService from "@/api/financeManagement/prestoreDetail.js";
import NP from "number-precision";

export default {
  name: "accountRefund",
  props: ["accountDetailInfoData", "accountRechargeCloseForm"],
  data() {
    //联系方式（手机或者座机）
    let concatPhone = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (value.length != 11 && value.length != 7) {
        callback(new Error("联系方式应该等于7位或者11位"));
      } else if (value != parseInt(value)) {
        callback(new Error("联系方式应该数字"));
      } else {
        callback();
      }
    };
    //充值金额
    let moneyValidator = (rule, value, callback) => {
      /*if (!value) {
          callback(new Error('退款金额不能为空'));
        } else if (value != parseFloat(value)) {
          callback(new Error('退款金额应该为数字'));
        } else if (value == 0) {
          callback(new Error('退款金额不能为0'));
        } else if (value.indexOf('.') == 0) {
          callback(new Error('退款金额应该为数字'));
        } else {
          callback();
        }*/
      const moneyValidatorRule = /^(\d*)(\d*)(\.\d{1,2})?$/;
      if (moneyValidatorRule.test(value) === false) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value && value.toString().split(".")[0].length > 7) {
        callback(new Error("只能输入七位数字"));
      } else if (value && value.indexOf(".") == 0) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (
        parseFloat(value) > parseFloat(this.accountDetailInfoData.balanceMoney)
      ) {
        callback(new Error("金额不足"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        prestoreAmt: [
          { required: true, message: "退款金额不能为空", trigger: "blur" },
          { validator: moneyValidator, trigger: "blur" },
        ],
        payTypeId: [
          { required: true, message: "退款方式不能为空", trigger: "blur" },
        ],
        agentTelNum: [{ validator: concatPhone, trigger: "blur" }],
      },
      accountRefundForm: {
        payTypeId: "", //支付方式id
        prestoreMoneyStr: "",
        agentName: "", //代办人姓名
        agentIdentificationNum: "", //代办人身份证号
        agentTelNum: "", //联系电话
        remark: "", //备注
        prestoreAmt: "", //充值金额
      },
      // 支付方式集合
      returnTypeListShow: [],
      // 当前选中支付方式
      currentPayType: {},
      // 可退款充值集合
      tableData: [],
      tableParams: [
        {
          prop: "payTypeName",
          label: "支付方式",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "prestoreRefund",
          label: "可退金额",
          align: "right",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "prestoreTime",
          label: "预存日期",
          align: "left",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "prestoreMoney",
          label: "预存金额",
          align: "right",
          headerAlign: "center",
          width: "100",
        },
      ],
      loading: false,
      // 表格选中金额小计
      tableTotalMoney: 0.0,
      // 表格选中id集合
      prestoreDetailIds: [],
      // 各渠道可退款金额
      refundMoneyGroupPayType:{}
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    addr() {
      if (this.patientInfo.addrProvince) {
        return (
          this.patientInfo.addrProvince +
          "," +
          this.patientInfo.addrCity +
          "," +
          this.patientInfo.addrCounty
        );
      }
      return "";
    },
  },
  watch: {
    receivePatientData: {
      handler(n) {
        this.patientInfo = {};
        // this.accountRefundForm.payTypeId = "1";
        if (JSON.stringify(n) !== "{}" && n.patientId) {
          this.patientInfo = { ...n };
        } else {
          // this.$message("该患者未建档，请开始建档");
          // this.$router.push('/patientMaster/recordCreate');
        }
      },
      immediate: true,
      deep: true,
    },
    accountRefundCloseForm: {
      handler(n) {
        if (this.$refs["accountRechargeForm"]) {
          this.$refs["accountRechargeForm"].resetFields();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // this.accountRefundForm.payTypeId = "1";
    this.getPayTypeByAuth();
    this.refundMoneyByPayType();
  },
  methods: {
    // 查询渠道可退款金额
    async refundMoneyByPayType(){
      try {
        let res = await prestoreDetailService.refundMoneyByPayType({
          patientId: this.receivePatientData.patientId
        });
        this.refundMoneyGroupPayType = res.data;
      } catch (error) {
        this.$message.error("获取渠道可退款金额失败");
      }
    },
    // 查询支付方式
    getPayTypeByAuth() {
      this.$showLoading();
      service
        .getPayTypeByAuth({
          businessCode: "02", //权限暂时写死
        })
        .then((res) => {
          if (res.code === 1) {
            this.returnTypeListShow = res.data;
          } else {
            this.$message.error(res.msg || "获取支付方式失败");
          }
          this.$hideLoading();
        })
        .catch((error) => {
          this.$hideLoading();
          this.$message.error(error.msg || "获取支付方式失败");
        });
    },
    //确定退款
    confirm() {
      this.$refs["accountRefundForm"].validate(async (valid) => {
        if (valid) {
          this.$showLoading();
          try {
            let form = {
              patientId: this.receivePatientData.patientId,
              prestoreCode: "01",
              channel: "00",
              payTypeId: this.accountRefundForm.payTypeId,
              payTypeCode: this.currentPayType.payTypeCode,
              refundMoney: this.accountRefundForm.prestoreAmt,
              prestoreDetailIds: this.prestoreDetailIds || [],
              // agentName: this.accountRefundForm.agentName,
              // agentIdentificationNum: this.accountRefundForm
              //   .agentIdentificationNum,
              // agentTelNum: this.accountRefundForm.agentTelNum,
              remark: this.accountRefundForm.remark,
            };
            if (
              this.currentPayType.payTypeCode != "cash" &&
              Number(this.tableTotalMoney) == 0
            ) {
              this.$message("非现金支付方式必须选择充值记录");
              this.$hideLoading();
              return false;
            } else if (
              this.currentPayType.payTypeCode != "cash" &&
              NP.minus(
                Number(this.tableTotalMoney),
                this.accountRefundForm.prestoreAmt
              ) < 0
            ) {
              this.$message("所选可退金额不足");
              this.$hideLoading();
              return false;
            }
            let data = await prestoreDetailService.refundPrestore(form);
            if (data.code == "1") {
              this.$emit("refundConfirm", false);
              this.$refs["accountRefundForm"].resetFields();
              this.$hideLoading();
              this.$message("退款成功");
            } else {
              this.$message.error(data.msg || "退款失败");
            }
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "退款失败");
          }
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.$emit("refundCancel", false);
      this.$refs["accountRefundForm"].resetFields();
    },
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    async selectChargeByPatType() {
      try {
        this.loading = true;
        let res = await prestoreDetailService.selectChargeByPatType({
          patientId: this.receivePatientData.patientId || undefined,
          payTypeId: this.accountRefundForm.payTypeId || undefined,
        });
        this.tableData = res.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg || "获取可退款充值明细失败");
      }
    },
    selectPayType(val) {
      this.returnTypeListShow.forEach((obj) => {
        if (obj.payTypeId == val) {
          this.currentPayType = { ...obj };
        }
      });
      if(this.currentPayType.payTypeCode == "cash"){
         this.tableData = [];
      }else{
        this.selectChargeByPatType();
      }
    },
    // 选中表格数据
    selChange(rows) {
      if (!rows || rows.length < 1) {
        this.tableTotalMoney = 0;
        return;
      }
      this.tableTotalMoney = 0;
      let ids = [];
      rows.forEach((val) => {
        ids.push(val.prestoreDetailId);
        this.tableTotalMoney = NP.plus(
          this.tableTotalMoney,
          val.prestoreRefund || 0
        );
      });
      this.prestoreDetailIds = ids;
    },
    selectable(row, index) {
      if (
        this.tableTotalMoney >= this.accountRefundForm.prestoreAmt &&
        this.prestoreDetailIds.indexOf(row.prestoreDetailId) == -1
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.divHeight {
  height: calc(100% - 20px);
}
.margin-top-10 {
  margin-top: 10px;
}
.margin10 {
  margin-bottom: 10px;
}

.contain {
  width: 100%;
  padding: 0 40px;

  .dialog-header {
    width: 100%;
    margin-bottom: 30px;
    /*border-top: 1px solid rgba(228, 228, 228, 1);*/

    .detail {
      margin-top: 20px;
      margin-bottom: 18px;

      .title {
        height: 24px;
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(46, 50, 58, 1);
        line-height: 20px;

        span {
          display: inline-block;
          min-width: 35px;
          margin-right: 20px;
        }
      }

      .detail-cont {
        width: 100%;
        height: 100px;
        margin-bottom: 10px;

        .detail-cont-item {
          width: 50%;
          height: 20px;
          margin-bottom: 10px;
          font-size: 14px;
          color: rgba(148, 157, 163, 1);
          line-height: 20px;
          float: left;

          i {
            margin-left: 10px;
            font-style: normal;
            color: rgba(46, 50, 58, 1);
          }
        }

        .balance-sum {
          i {
            height: 14px;
            font-size: 14px;
            font-weight: bold;
            color: $l-color-primary;
            line-height: 18px;
          }
        }
      }
    }

    .rechargeMethod {
      height: 250px;
      .payTypeCol {
        border-right: 1px solid $l-color-primary;
      }
      .title {
        height: 24px;
        margin-bottom: 15px;
        font-size: 16px;
        font-weight: bold;
        color: rgba(46, 50, 58, 1);
        line-height: 24px;
      }

      .sum {
        width: 100%;
        // height: 76px;
        padding: 20px;
        background: $l-color-bgcolor-18;
        border-radius: 2px;
      }

      .radio-item {
        height: 48px;
        padding: 0 20px;
        border-radius: 2px;
        border: 1px solid $l-color-bgcolor-11;
        line-height: 48px;

        .balance {
          font-style: normal;
          font-size: $l-font-size;

          font-weight: 400;
          color: $l-color-fontcolor-4;
        }

        // .el-radio__label {
        //   display: none;
        // }
      }
    }

    .sum {
      width: 100%;
      // height: 76px;
      padding: 20px;
      background: $l-color-bgcolor-18;
      border-radius: 2px;
    }
  }

  .dialog-footer {
    /*height: 36px;*/
    padding: 20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }
}

.primary-color {
  color: $l-color-primary !important;
}
.l-input-wrap {
  overflow: inherit;
}
</style>
