<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    top="0"
    class="dialog-style"
    :close-on-click-modal="false"
    append-to-body
  >
    <div class="dialog-content">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <div class="itemArea">
          <el-col class="moneyTitleWrap" v-if="nextReceiptNumOutPO">
            <div class="moneyTitle">
              预缴总额：
              <span class="money">{{
                formatNumber(patientInfo ? patientInfo.selfPayPrepay : 0)
              }}</span>
            </div>
            <div class="moneyTitle">
              冻结总额：
              <span class="money">{{
                formatNumber(patientInfo ? patientInfo.freezePrepayAmount : 0)
              }}</span>
            </div>
            <div class="moneyTitle">
              可用余额：
              <span class="money">{{
                formatNumber(patientInfo ? patientInfo.prepayBalance : 0)
              }}</span>
            </div>
          </el-col>
          <!-- <el-col class="moneyTitleWrap" v-if="nextReceiptNumOutPO">
            <span style="font-size:16px;margin-right:32px;">下一张票号：<span>{{nextReceiptNumOutPO.receiptNum || '无'}}</span></span>
            <span>
              <el-button type="primary" @click="getNextReceiptNum">刷新</el-button>
              <el-button @click="jumpNum">跳号</el-button>
            </span>
          </el-col> -->
          <el-form-item
            style="width: 250px; margin-right: 8px; margin-bottom: 4px"
          >
            <LFormtTitle label="患者姓名" style="width: 250px" disabled>
              <el-input disabled v-model="patientInfo.patientName"></el-input>
            </LFormtTitle>
          </el-form-item>
          <el-form-item
            prop="prepayMoney"
            style="width: 250px; margin-right: 8px; margin-bottom: 4px"
          >
            <LFormtTitle required label="预缴金额">
              <el-input
                v-model="form.prepayMoney"
                placeholder="请输入预缴金额"
                type="number"
              ></el-input>
            </LFormtTitle>
          </el-form-item>

          <!-- <el-form-item style="width:250px;margin-right:8px;margin-bottom:4px;">
            <LFormtTitle required label="支付方式" style="width:250px;">
              <el-select v-model="form.payTypeClassCode" placeholder="请选择">
                <el-option v-for="(item,index) in payTypeList" :key="index" :label="item.payTypeName" :value="item.payTypeClassCode"></el-option>
              </el-select>
            </LFormtTitle>
          </el-form-item> -->

          <!-- 添加新的支付方式   start -->
          <el-col :span="24">
            <el-form-item>
              <span class="payTitle">请选择支付方式</span>
              <div class="pay-type-list">
                <el-form class="mar-top-10" :model="form" ref="ruleForm">
                  <el-form-item label-width="0">
                    <el-row class="pay-type">
                      <el-col
                        :span="12"
                        class="margin10"
                        v-for="item in payTypeList"
                        :key="item.payTypeId"
                      >
                        <el-row class="radio-item">
                          <el-col :span="24">
                            <el-radio
                              class="pay-radio"
                              v-model="form.payTypeClassCode"
                              :label="item.payTypeClassCode"
                              style="width: 100%"
                              @change="payTypeChange"
                            >
                              <span
                                style="
                                  display: inline-block;
                                  vertical-align: sub;
                                  margin-right: 10px;
                                "
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
                </el-form>
                <div style="margin-top: 10px">
                  <el-form-item prop="authCode">
                    <LFormtTitle
                      label="付款码"
                      :disabled="judgeFunStyle"
                      :required="!judgeFunStyle"
                    >
                      <el-input
                        v-model="form.authCode"
                        :disabled="judgeFunStyle"
                      ></el-input>
                    </LFormtTitle>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <!-- 添加新的支付方式 end -->

          <!-- <el-form-item prop="code" v-if="form.payTypeClassCode=='wxpay'||form.payTypeClassCode=='alipay'" style="width:250px;margin-right:8px;margin-bottom:4px;">
            <LFormtTitle required label="授权码">
              <el-input v-model="form.code" placeholder="请输入授权码"></el-input>
            </LFormtTitle> -->
          <!-- </el-form-item> -->
          <el-form-item
            prop="depositBank"
            v-if="form.payTypeClassCode == 'cheque'"
            style="width: 250px; margin-right: 8px; margin-bottom: 4px"
          >
            <LFormtTitle required label="开户行">
              <el-input
                v-model="form.depositBank"
                placeholder="请输入开户行"
              ></el-input>
            </LFormtTitle>
          </el-form-item>
          <el-form-item
            prop="bankAccount"
            v-if="form.payTypeClassCode == 'cheque'"
            style="width: 250px; margin-right: 8px; margin-bottom: 4px"
          >
            <LFormtTitle required label="银行账号">
              <el-input
                v-model="form.bankAccount"
                placeholder="请输入银行账号"
              ></el-input>
            </LFormtTitle>
          </el-form-item>
          <el-form-item
            prop="companyName"
            v-if="form.payTypeClassCode == 'cheque'"
            style="width: 250px; margin-right: 8px; margin-bottom: 4px"
          >
            <LFormtTitle required label="单位名称">
              <el-input
                v-model="form.companyName"
                placeholder="请输入单位名称"
              ></el-input>
            </LFormtTitle>
          </el-form-item>
          <el-form-item
            prop="checkNum"
            v-if="form.payTypeClassCode == 'cheque'"
            style="width: 250px; margin-right: 8px; margin-bottom: 4px"
          >
            <LFormtTitle required label="票号">
              <el-input
                v-model="form.checkNum"
                placeholder="请输入票号"
              ></el-input>
            </LFormtTitle>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span slot="footer">
      <template>
        <el-button class="footer-btn" type="primary" @click="confirm"
          >确认</el-button
        >
        <el-button class="footer-btn" type="primary" plain @click="cancel"
          >关闭</el-button
        >
      </template>
    </span>
  </el-dialog>
</template>

<script>
import service from "@/api/financeManagement/inp.js";
export default {
  name: "LDialog",
  props: {
    patientInfo: {
      type: Object
    },
    nextReceiptNumOutPO: {
      type: Object
    },
    payTypeData: {
      type: String
    },
    payTypeobj: {
      type: String
    }
  },
  data() {
    var valPrepayMoney = (rule, value, callback) => {
      let rules = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (value === "") {
        callback(new Error("请输入预缴金额"));
      } else if (rules.test(value) === false) {
        callback(new Error("请输入正确格式的金额"));
      } else if (value <= 0) {
        callback(new Error("预缴金额不能为负或等于0"));
      } else if (value > 1000000) {
        callback(new Error("最大额度:1000000"));
      } else {
        callback();
      }
    };
    var valAuthCode = (rule, value, callback) => {
      if (value === "" && !this.judgeFunStyle) {
        callback(new Error("请输入预缴金额"));
      } else {
        callback();
      }
    };
    return {
      payTypeList: [],
      value: "",
      judgeFunStyle: true,
      payTypeClassCodeStyle: true,
      form: {
        prepayMoney: this.payTypeobj || "", //预缴金额
        payTypeClassCode: this.payTypeData || "",
        //
        authCode: "",
        code: "", //授权码
        checkNum: "", //票号
        bankAccount: "", //银行账号
        companyName: "", //单位名称
        depositBank: "" //开户银行
      },
      rules: {
        prepayMoney: [
          {
            required: true,
            message: "请输入预缴金额",
            trigger: "blur"
          },
          {
            validator: valPrepayMoney,
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "授权码不能为空",
            trigger: "blur"
          }
        ],
        companyName: [
          {
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }
        ],
        depositBank: [
          {
            required: true,
            message: "开户银行不能为空",
            trigger: "blur"
          }
        ],
        bankAccount: [
          {
            required: true,
            message: "银行账号不能为空",
            trigger: "blur"
          }
        ],
        checkNum: [
          {
            required: true,
            message: "票号不能为空",
            trigger: "blur"
          }
        ],
        authCode: [
          {
            validator: valAuthCode,
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    nextReceiptNumOutPO: {
      handler(n) {},
      immediate: true,
      deep: true
    },
    payTypeData: {
      handler(n) {
        this.judgeFun();
        this.payTypeChange();
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.getPayTypeByAuth();
  },
  methods: {
    payTypeClassCode() {
      let a = true;
      if (this.form.payTypeClassCode == "cheque") {
        a = false;
      }
      return a;
    },
    // 判断付款吗是否显示
    judgeFun() {
      let a = true;
      if (this.form.payTypeClassCode == "wxpay") {
        a = false;
      }
      if (this.form.payTypeClassCode == "alipay") {
        a = false;
      }
      return a;
    },
    // payTypeChange 选择单选款
    payTypeChange(a) {
      this.judgeFunStyle = this.judgeFun();
      this.payTypeClassCodeStyle = this.payTypeClassCode();
      if (this.judgeFunStyle) {
        this.form.authCode = "";
      }
      console.log(this.form.payTypeClassCode);
    },
    // 刷新号
    getNextReceiptNum() {
      this.$emit("getNextReceiptNum");
    },
    // 跳转
    jumpNum() {
      this.$emit("jumpNum");
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
    // 查询支付方式
    async getPayTypeByAuth() {
      try {
        this.$showLoading();
        let res = await service.getPayTypeByAuth({
          businessCode: "03"
        });
        this.payTypeList = res.data;
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "获取支付方式失败");
      }
    },
    // 充值
    async prepay() {
      if (!this.patientInfo.inpCode) {
        this.$message.error("请查询患者信息");
        return;
      }
      if (!this.form.payTypeClassCode) {
        this.$message.error("请选择支付方式");
        return;
      }
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          try {
            this.$showLoading();

            let payTypeId = "";
            let payTypeName = "";
            for (let i = 0; i < this.payTypeList.length; i++) {
              if (
                this.payTypeList[i].payTypeClassCode ==
                this.form.payTypeClassCode
              ) {
                payTypeId = this.payTypeList[i].payTypeId;
                payTypeName = this.payTypeList[i].payTypeName;
                break;
              }
            }
            let res = await service.prepay({
              ...this.form,
              payTypeId,
              payTypeName,
              finAdId: this.patientInfo.finAdId,
              inpCode: this.patientInfo.inpCode,
              businessType: "0" // 普通预缴
            });

            if (res.code == "1") {
              this.$message({
                type: "success",
                message: "充值成功"
              });
              this.$emit("confirm");
            }
          } catch (error) {
            console.info(error);

            this.$message.error(error.msg || "预缴金充值失败");
          } finally {
            this.$hideLoading();
          }
        }
      });
    },
    // 确定
    confirm() {
      this.prepay();
    },
    // 取消
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-style {
  text-align: center;

  .dialog-content {
    padding: 16px;

    .patientInfo {
      padding-bottom: 16px;
    }
  }

  // 新修改的样式
  .payTitle {
    font-weight: $l-font-weight;
  }

  .mar-top-10 {
    margin-top: 10px;
  }

  .mar-top-20 {
    margin-top: 20px;
  }

  .button-footer {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    padding-right: 10px;
    text-align: right;
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
      font-family: $l-font-familySC-regular;
      font-weight: 400;
      color: $l-color-fontcolor-4;
    }

    .el-radio__label {
      display: none;
    }
  }

  .pay-type {
    .el-col {
      padding: 0 5px !important;
    }
  }

  .pay-zp {
    margin-top: 10px;

    .l-input-wrap {
      margin-bottom: 20px;
    }
  }

  .pay-radio {
    /deep/ .el-radio__input {
      float: right;
      margin-top: 4px;
    }
  }

  // 新修改样式
  .moneyTitleWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;

    .moneyTitle {
      font-size: 14px;
      font-family: SourceHanSansSC, SourceHanSansSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #2e323a;
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    .money {
      font-size: 14px;
      font-family: DINPro, DINPro-Medium;
      font-weight: 500;
      text-align: left;
      color: #ef0f0f;
    }
  }

  k &::after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
  }

  /deep/ .el-dialog {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }

  /deep/ .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid $l-color-bgcolor-11;
  }

  .footer-btn {
    width: 80px;
  }

  .itemArea {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
