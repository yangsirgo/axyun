<template>
  <div class="width100 height100 padding10">
    <el-table :data="charge.chargeObj.finClassVOList" style="width: 100%" border>
      <el-table-column prop="className" label="收费项目" header-align="center">
        <template slot-scope="scope">
          <span :val="scope.row['classCode']" code="FinClassCode" v-codeTransform></span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="quantity" label="数量" width="130px;" header-align="center"></el-table-column> -->
      <el-table-column
        prop="totalMoney"
        label="金额"
        width="125px;"
        header-align="center"
        align="right"
      >
        <template slot-scope="scope">
          <span>{{ scope.row["totalMoney"].toFixed(2) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <span class="payTitle">请选择支付信息</span>
    <div>
      <!-- <el-row :gutter="10" class="width100 mar-top-10">
        <el-col :span="12">
          <el-radio v-model="charge.payType" label="1" border class="payType">
            <i
              class="iconfont icon-menzhenshoufeidankuang2"
              style="color: #38A79C;"
            ></i>
            现金支付</el-radio>
        </el-col>
        <el-col :span="12">
          <el-radio v-model="charge.payType" label="2" border class="payType">
            <i class="iconfont icon-menzhenshoufeidankuang"></i>
            扫码支付</el-radio>
        </el-col>
        <el-col :span="12" class="mar-top-10">
          <el-radio v-model="charge.payType" label="3" border class="payType">
            <i
              class="iconfont icon-menzhenshoufeidankuang1"
              style="color: #3D7DFB"
            ></i>
            账户支付
            <span class="margin-left-10">
              卡余额
              <span class="font">{{charge.chargeObj.balanceMoney.toFixed(2) || '0.00'}}</span>
            </span>
          </el-radio>
        </el-col>
        <el-col :span="12" class="mar-top-10">
          <el-radio v-model="charge.payType" label="4" border class="payType">
            <i class="iconfont iconjiaoyujiaojin"></i>
            银联支付</el-radio>
        </el-col>
      </el-row>-->
      <el-form class="mar-top-10">
        <el-form-item label label-width="0">
          <el-row :gutter="10">
            <el-col :span="12" class="margin10">
              <!--<el-radio v-model="accountRechargeForm.payTypeId" label="1" border style="width:100%;">现金支付</el-radio>-->
              <el-row class="radio-item">
                <el-col :span="22">
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
                  现金支付
                </el-col>
                <el-col :span="2">
                  <el-radio
                    v-model="charge.payType"
                    label="1"
                    style="width:100%;"
                    :disabled="
                      charge.chargeObj.balanceMoney > charge.chargeObj.cashPay
                    "
                  >{{ "" }}</el-radio>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" class="margin10">
              <!--<el-radio v-model="accountRechargeForm.payTypeId" label="2" border style="width:100%">扫码支付</el-radio>-->
              <el-row class="radio-item">
                <el-col :span="22">
                  <span style="display:inline-block;vertical-align: sub;margin-right:10px">
                    <svg
                      t="1568712498724"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="8602"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M0 481.848889h481.848889V0H0v481.848889z m120.490667-361.358222h240.924444v240.924444H120.490667V120.490667zM542.094222 0v481.848889H1024V0H542.151111z m361.415111 361.415111h-240.924444V120.490667h240.924444v240.924444zM0 1024h481.848889V542.151111H0V1024z m120.490667-361.415111h240.924444v240.924444H120.490667v-240.924444zM542.094222 1024h120.490667v-120.490667H542.094222V1024z m120.490667-361.415111v240.924444h120.490667v-240.924444h-120.490667z m240.924444 240.924444h-120.433777V1024H1024v-240.924444h-120.490667v120.433777z m0-240.924444H1024V542.151111h-120.490667v120.490667zM542.151111 542.151111v120.490667h120.490667V542.151111H542.094222z"
                        fill="#2E323A"
                        p-id="8603"
                      />
                    </svg>
                  </span>
                  扫码支付
                </el-col>
                <el-col :span="2">
                  <el-radio
                    v-model="charge.payType"
                    label="2"
                    style="width:100%;"
                    :disabled="
                      charge.chargeObj.balanceMoney > charge.chargeObj.cashPay
                    "
                  >{{ "" }}</el-radio>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12" class="margin10">
              <!-- <el-radio v-model="accountRechargeForm.payTypeId" label="3" border style="width:100%">账户支付</el-radio>-->
              <el-row class="radio-item">
                <el-col :span="22">
                  <span style="display:inline-block;vertical-align: sub;margin-right:10px">
                    <svg
                      t="1571973057805"
                      class="icon"
                      viewBox="0 0 1228 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="11397"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M102.4 0h1024a102.4 102.4 0 0 1 102.4 102.4v819.2a102.4 102.4 0 0 1-102.4 102.4H102.4a102.4 102.4 0 0 1-102.4-102.4V102.4a102.4 102.4 0 0 1 102.4-102.4z m716.8 256a51.2 51.2 0 0 0 0 102.4h204.8a51.2 51.2 0 0 0 0-102.4h-204.8z m0 204.8a51.2 51.2 0 0 0 0 102.4h204.8a51.2 51.2 0 0 0 0-102.4h-204.8z m0 204.8a51.2 51.2 0 0 0 0 102.4h204.8a51.2 51.2 0 0 0 0-102.4h-204.8zM227.328 563.2A73.728 73.728 0 0 0 153.6 636.928v106.496c0 13.568 11.008 24.576 24.576 24.576h411.648a24.576 24.576 0 0 0 24.576-24.576v-106.496A73.728 73.728 0 0 0 540.672 563.2H227.328z m152.7296-51.2a128 128 0 1 0 0-256 128 128 0 0 0 0 256z"
                        p-id="11398"
                        fill="#3D7DFB"
                      />
                    </svg>
                  </span>
                  账户支付
                  <span>
                    卡余额
                    <span class="font">{{ charge.chargeObj.balanceMoney.toFixed(2) || "0.00" }}</span>
                  </span>
                </el-col>
                <el-col :span="2">
                  <el-radio v-model="charge.payType" label="3" style="width:100%;">{{ "" }}</el-radio>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" class="margin10">
              <!--<el-radio v-model="accountRechargeForm.payTypeId" label="4" border style="width:100%">银联支付</el-radio>-->
              <el-row class="radio-item">
                <el-col :span="22">
                  <span style="display:inline-block;vertical-align: sub;margin-right:10px">
                    <svg
                      t="1568712620167"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="8758"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M455.111111 512H227.555556v113.777778h227.555555v227.555555h113.777778v-227.555555h227.555555V512h-227.555555V398.222222h227.555555V284.444444H227.555556v113.777778h227.555555v113.777778zM0 0h1024v1024H0V0z m341.333333 170.666667v113.777777h113.777778V170.666667H341.333333z m227.555556 0v113.777777h113.777778V170.666667h-113.777778z"
                        fill="#ff5300"
                        p-id="8759"
                      />
                    </svg>
                  </span>
                  银联支付
                </el-col>
                <el-col :span="2">
                  <el-radio
                    v-model="charge.payType"
                    label="4"
                    style="width:100%;"
                    :disabled="
                      charge.chargeObj.balanceMoney > charge.chargeObj.cashPay
                    "
                  >{{ "" }}</el-radio>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="bottom-info">
        <el-row>
          <el-col :span="6" class="mar-top-10">
            <span>
              总费用
              <span class="font">
                {{
                charge.chargeObj.totalMoney.toFixed(2) || "0.00"
                }}
              </span>
            </span>
          </el-col>
          <el-col :span="6" class="mar-top-10">
            <span>
              应收
              <span class="font">{{ charge.chargeObj.cashPay.toFixed(2) || "0.00" }}</span>
            </span>
          </el-col>
          <el-col :span="6" class="mar-top-10">
            <span>
              医保报销
              <span class="font">
                {{
                charge.chargeObj.derateAmount.toFixed(2) || "0.00"
                }}
              </span>
            </span>
          </el-col>
          <el-col :span="6" class="mar-top-10">
            <span>
              自费
              <span class="font">
                {{
                charge.chargeObj.selfPayMoney.toFixed(2) || "0.00"
                }}
              </span>
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" class="mar-top-10" style="padding-left:5px;text-align:left;">
            <span style="margin-left:25px;">实收</span>
            <el-input
              v-model="charge.realGet"
              class="margin-left-6"
              :change="getBackMoney()"
              :disabled="
                charge.chargeObj.totalMoney <= charge.chargeObj.prestoreBalance
              "
            ></el-input>
            <span class="special-color margin-left-6 font">
              {{
              charge.warning
              }}
            </span>
          </el-col>
          <el-col :span="10" class="mar-top-20" style="padding-left:5px;text-align:left;">
            <span>
              找零
              <span class="special-color font">
                {{
                charge.backMoney.toFixed(2) || "0.00"
                }}
              </span>
            </span>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    charge: {
      type: Object,
      defalut: {}
    }
  },
  data() {
    return {
      // 实收提示
      warning: ""
    };
  },
  watch: {
    charge(val) {
      this.charge = val;
      this.$emit("update:charge", val);
    }
  },
  mounted() {
    this.charge.backMoney = 0;
    this.charge.realGet = 0;
    this.chargrType();
  },
  methods: {
    // 计算找零
    getBackMoney() {
      // 验证
      // if (this.charge.realGet < this.charge.chargeObj.cashPay) {
      //   this.charge.warning = "金额不足";
      // } else {
      //   let rule = /^(\d*)(\d*)(\.\d{1,2})?$/;
      //   if (rule.test(this.charge.realGet) === false) {
      //     this.charge.warning = "只能输入数字或两位小数";
      //   } else {
      //     this.charge.warning = "";
      //   }
      // }
      let rule = /^(\d*)(\d*)(\.\d{1,2})?$/;
      if (rule.test(this.charge.realGet) === false) {
        this.charge.warning = "只能输入数字或两位小数";
      } else if (this.charge.realGet.toString().length > 10) {
        this.charge.warning = "只能输入十位数字";
      } else if (this.charge.realGet && this.charge.realGet.indexOf(".") == 0) {
        this.charge.warning = "只能输入数字或两位小数";
      } else if (this.charge.realGet < this.charge.chargeObj.cashPay) {
        this.charge.warning = "金额不足";
      } else {
        this.charge.warning = "";
      }
      if (
        this.charge.realGet == 0 ||
        this.charge.realGet < this.charge.chargeObj.cashPay ||
        this.charge.warning != ""
      ) {
        this.charge.backMoney = 0;
        return;
      } else if (
        this.charge.chargeObj.totalMoney > this.charge.chargeObj.prestoreBalance
      ) {
        this.charge.backMoney =
          this.charge.realGet - this.charge.chargeObj.cashPay || 0;
      } else {
        this.charge.backMoney = 0;
      }
    },
    // 判断付款方式
    chargrType() {
      if (
        this.charge.chargeObj.balanceMoney &&
        this.charge.chargeObj.balanceMoney > this.charge.chargeObj.cashPay
      ) {
        this.charge.payType = "3";
      } else {
        this.charge.payType = "1";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.bottom-info {
  width: 100%;
  height: 90px;
  background: rgba(246, 246, 246, 1);
  border-radius: 2px;
  margin-top: 10px;
  font-size: $l-font-size;
  color: #949da3;
  text-align: center;
  span:not(.font)  {
    margin-left: 10px;
    .font {
      font-weight: $l-font-weight;
      color: #2e323a;
      
      font-size: 16px;
      margin-left: 5px;
    }
  }
  .el-input {
    width: 100px;
  }
}
.payTitle {
  font-weight: $l-font-weight;
}
.payType {
  width: 100%;
}
.mar-top-10 {
  margin-top: 10px;
}
.mar-top-20 {
  margin-top: 20px;
}
.special-color {
  color: $l-color-primary;
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

  .el-radio__label {
    display: none;
  }
}
</style>
