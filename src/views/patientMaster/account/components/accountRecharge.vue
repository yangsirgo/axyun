<template>
  <div class="contain">
    <div class="dialog-header">
      <el-form :model="accountRechargeForm" :rules="rules" ref="accountRechargeForm">
        <div class="detail">
          <div class="title">
            <span>{{patientInfo.patientName || '--'}}</span>
            <span :val="patientInfo.patientGender" code="GENDER_CODE" v-codeTransform></span>
            <span>{{patientInfo.age || '--'}}</span>
            <!-- <span>账户类型：预存账户</span> -->
            <span>账户余额：{{formatNumber(accountDetailInfoData.balanceMoney)}}元</span>
          </div>
          <div>
            <el-row style="margin-bottom: 20px">
              <el-col :span="14">
                <LFormtTitle label="代办人姓名">
                  <el-form-item prop="agentName">
                    <el-input
                      v-model="accountRechargeForm.agentName"
                      style="line-height: 34px;width:100%"
                      placeholder="请输入代办人姓名"
                    ></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 20px">
              <el-col :span="14">
                <LFormtTitle label="代办人身份证号">
                  <el-form-item prop="agentIdentificationNum">
                    <el-input
                      v-model="accountRechargeForm.agentIdentificationNum"
                      style="line-height: 34px;width:100%"
                      placeholder="请输入代办人身份证号"
                    ></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 20px">
              <el-col :span="14">
                <LFormtTitle label="联系电话">
                  <el-form-item prop="agentTelNum">
                    <el-input
                      v-model="accountRechargeForm.agentTelNum"
                      style="line-height: 34px;width:100%"
                      placeholder="请输入联系电话"
                    ></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="rechargeMethod">
          <div class="title">请选择充值方式</div>
          <div class="clearfix" style="margin-bottom: 30px">
            <el-form-item label-width="0" prop="payTypeId">
              <el-row class="pay-type">
                <el-col
                  :span="12"
                  class="margin10"
                  v-for="item in payTypeListShow"
                  :key="item.payTypeId"
                >
                  <el-row class="radio-item">
                    <el-col :span="24">
                      <el-radio
                        v-model="accountRechargeForm.payTypeId"
                        :label="item.payTypeId"
                        style="width:100%;"
                      >
                        <span style="display:inline-block;vertical-align: sub;margin-right:10px">
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
          <div class="sum">
            <div style="width:50%;">
              <LFormtTitle label="充值金额" required>
                <el-form-item prop="prestoreAmt">
                  <el-input
                    v-model="accountRechargeForm.prestoreAmt"
                    style="line-height: 34px;width:100%"
                  ></el-input>
                </el-form-item>
              </LFormtTitle>
            </div>
            <div style="width:50%" class="margin-top-10">
              <LFormtTitle label="备注">
                <el-form-item prop="remark">
                  <el-input
                    v-model="accountRechargeForm.remark"
                    style="line-height: 34px;width:100%"
                  ></el-input>
                </el-form-item>
              </LFormtTitle>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer clearfix" slot="footer">
      <div style="float:right">
        <el-button type="primary" @click="confirm">确定充值</el-button>
        <el-button @click="cancel" class="el-button-cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { prestore, prestore_or_refund } from "@/api/arch/arch.js";
import { mapActions, mapGetters } from "vuex";
import service from "@/api/financeManagement/inp.js";
export default {
  name: "accountRecharge",
  props: ["accountDetailInfoData", "accountRechargeCloseForm"],
  data() {
    //联系方式（手机或者座机）
    let concatPhone = (rule, value, callback) => {
      let rules = /0?(13|14|15|18|17)[0-9]{9}/;
      if (!value) {
        callback();
      } else if (rules.test(value) === false) {
        callback(new Error("手机号非法"));
      } else {
        callback();
      }
    };

    let concatName = (rule, value, callback) => {
      let rules = /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/;
      if (!value) {
        callback();
      } else if (rules.test(value) === false) {
        callback(new Error("姓名非法"));
      } else {
        callback();
      }
    };

    let concatIdCard = (rule, value, callback) => {
      let rules = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
      if (!value) {
        callback();
      } else if (rules.test(value) === false) {
        callback(new Error("身份证号码非法"));
      } else {
        callback();
      }
    };

    //充值金额
    let moneyValidator = (rule, value, callback) => {
      /*if (!value) {
          callback(new Error('预存金额不能为空'));
        } else if (value != parseFloat(value)) {
          callback(new Error('预存金额应该为数字'));
        } else if (value == 0) {
          callback(new Error('预存金额不能为0'));
        } else if (value.indexOf('.') == 0) {
          callback(new Error('预存金额应该为数字'));
        } else {
          callback();
        }*/
      const moneyValidatorRule = /^(\d*)(\d*)(\.\d{1,2})?$/;
      if (moneyValidatorRule.test(value) === false) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (parseInt(value).toString().length > 7) {
        callback(new Error("只能输入七位数字"));
      } else if (value && value.indexOf(".") == 0) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value && value < 0) {
        callback(new Error("只能输入正数"));
      } else {
        callback();
      }
    };
    return {
      //患者基本信息
      patientInfo: {},
      rules: {
        patientNum: [{ required: true, message: "", trigger: "blur" }],
        agentName: [{ validator: concatName, trigger: "blur" }],
        agentIdentificationNum: [{ validator: concatIdCard, trigger: "blur" }],
        prestoreAmt: [
          { required: true, message: "预存金额不能为空", trigger: "blur" },
          { validator: moneyValidator, trigger: "blur" },
        ],
        payTypeId: [
          { required: true, message: "支付方式不能为空", trigger: "blur" },
        ],
        agentTelNum: [{ validator: concatPhone, trigger: "blur" }],
      },
      payTypeListShow: [],
      //充值表单
      accountRechargeForm: {
        // rechargeMan: '1',
        // patientNum: JSON.parse(this.patientInfo).patientNum,
        patientName: "",
        identificationType: "",
        identificationNum: "",
        // cardType: '1',
        phone: "", //联系方式
        prestoreMoneyStr: "",
        payTypeId: "", //,支付方式id
        // moneySource: '1'//来源

        // ,prestoreDetailId: '',
        // prestoreCode: '',
        // prestoreType: '',
        // prestoreBalance: '',
        // businessType: '',
        // payTypeCode: '',
        // payTypeName: '',//支付方式名称
        // thirdPartyPrestoreId: '',//第三方预存人ID
        // moneySource: ''//窗口现金、银行代码、自助机现金、微信、支付宝、APP

        agentName: "", //代办人姓名
        agentIdentificationNum: "", //代办人身份证号
        agentTelNum: "", //联系电话
        remark: "", //备注
        prestoreAmt: "", //充值金额
      },
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
  },
  watch: {
    receivePatientData: {
      handler(n) {
        this.patientInfo = {};
        if (JSON.stringify(n) !== "{}" && n.patientId) {
          this.patientInfo = { ...n };
          this.accountRechargeForm.patientName = this.patientInfo.patientName;
        } else {
          // this.$message("该患者未建档，请开始建档");
          // this.$router.push('/patientMaster/recordCreate');
        }
      },
      immediate: true,
      deep: true,
    },
    accountRechargeCloseForm: {
      handler(n) {
        if (this.$refs["accountRechargeForm"]) {
          this.$refs["accountRechargeForm"].resetFields();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.getPayTypeByAuth();
  },
  methods: {
    // 查询支付方式
    getPayTypeByAuth() {
      this.$showLoading();
      service
        .getPayTypeByAuth({
          businessCode: "01", //权限暂时写死
        })
        .then((res) => {
          if (res.code === 1) {
            this.payTypeListShow = res.data;
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

    //确认充值
    confirm() {
      //将表单对象传过去，不确定这里面是否包含所有参数信息
      this.$refs["accountRechargeForm"].validate(async (valid) => {
        if (valid) {
          this.$showLoading();
          try {
            let form = {
              // ...this.accountRechargeForm,
              // patientId: this.receivePatientData.patientId,
              // dataVersion: this.accountDetailInfoData.dataVersion,
              // businessType: "0"
              patientId: this.receivePatientData.patientId,
              prestoreCode: "01",
              channel: "00",
              payTypeId: this.accountRechargeForm.payTypeId,
              prestoreAmt: this.accountRechargeForm.prestoreAmt,
              agentName: this.accountRechargeForm.agentName,
              agentIdentificationNum: this.accountRechargeForm
                .agentIdentificationNum,
              agentTelNum: this.accountRechargeForm.agentTelNum,
              remark: this.accountRechargeForm.remark,
            };
            let data = await prestore_or_refund(form);
            if (data.code == "1") {
              this.$emit("rechargeConfirm", false);
              this.$refs["accountRechargeForm"].resetFields();
              this.$message("充值成功");
            } else {
              this.$message.error(data.msg || "充值失败");
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "充值失败");
          }
        } else {
          // this.$message.error("充值表单校验失败");
        }
      });
    },
    //取消
    cancel() {
      this.$emit("rechargeCancel", false);
      this.$refs["accountRechargeForm"].resetFields();
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
  },
};
</script>

<style lang="scss" scoped>
.margin-top-10{
  margin-top: 10px;
}
.margin10 {
  margin-bottom: 10px;
}

.margin20 {
  margin-bottom: 10px;
}

.contain {
  width: 100%;
  padding: 0 40px;

  .dialog-header {
    width: 100%;
    margin-bottom: 40px;
    /*border-top: 1px solid rgba(228, 228, 228, 1);*/

    .detail {
      margin-top: 40px;
      margin-bottom: 40px;

      .title {
        height: 24px;
        margin-bottom: 20px;
        font-size: 16px;
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
        height: 20px;
        margin-bottom: 20px;

        .detail-cont-item {
          width: 30%;
          height: 20px;
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
        height: 68px;
        padding: 0 20px;
        border-radius: 2px;
        border: 1px solid $l-color-bgcolor-11;
        line-height: 68px;

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
  }

  .dialog-footer {
    /*height: 36px;*/
    padding: 20px 0 20px 20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }
  .pay-type {
    .el-col {
      padding: 0 5px !important;
    }
  }
}
/deep/ .l-input-wrap {
  overflow: initial;
}
</style>
