<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" top="0" class="dialog-style" :close-on-click-modal="false" append-to-body>
    <div class="dialog-content">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <div class="itemArea">
          <el-col :span="24">
            <el-col :span="10"  class="moneyTitleWrap" v-if="nextReceiptNumOutPO">
              <div class="moneyTitle">
                预交总额：
                <span class="money">{{formatNumber(patientInfo?patientInfo.selfPayPrepay:0)}}</span>
              </div>
              <div class="moneyTitle">
                冻结总额：
                <span class="money">{{formatNumber(patientInfo?patientInfo.freezePrepayAmount:0)}}</span>
              </div>
              <div class="moneyTitle">
                可用余额：
                <span class="money">{{formatNumber(patientInfo?patientInfo.prepayBalance:0)}}</span>
              </div>
            </el-col>
            <el-col :span="14" style="font-weight: 600;padding: 8px;">
              退款渠道
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <!-- <el-col class="moneyTitleWrap" v-if="nextReceiptNumOutPO">
                <span style="font-size:16px;margin-right:32px;">下一张票号：<span>{{nextReceiptNumOutPO.receiptNum || '无'}}</span></span>
                <span>
                    <el-button type="primary" @click="getNextReceiptNum">刷新</el-button>
                    <el-button @click="jumpNum">跳号</el-button>
                </span>
              </el-col> -->

                <el-form-item style="width:265px;margin-right:5px;margin-bottom:4px;display: inline-block;">
                  <LFormtTitle label="患者姓名" disabled>
                    <el-input disabled v-model="patientInfo.patientName"></el-input>
                  </LFormtTitle>
                </el-form-item>

                <el-form-item prop="prepayMoney" style="width:265px;margin-right:3px;margin-bottom:4px;display: inline-block;">
                  <LFormtTitle required label="退款金额">
                    <el-input v-model="form.prepayMoney" placeholder="请输入预交金额" type="number"></el-input>
                  </LFormtTitle>
                </el-form-item>

              <!-- <el-form-item style="width:250px;margin-right:8px;margin-bottom:4px;">
                     <LFormtTitle required label="退款方式" style="width:250px;">
                       <el-select v-model="form.payTypeClassCode" placeholder="请选择">
                         <el-option v-for="(item,index) in payTypeList" :key="index" :label="item.payTypeName" :value="item.payTypeClassCode"></el-option>
                       </el-select>
                     </LFormtTitle>
                   </el-form-item> -->

              <!-- 添加新的支付方式   start -->
              <el-form-item>
                <el-col :span="24">
                  <span class="payTitle">请选择支付方式</span>
                  <div class="pay-type-list">
                    <el-form class="mar-top-10" :model="form" ref="ruleForm">
                      <el-form-item label-width="0">
                        <el-row class="pay-type">
                          <el-col :span="12" class="margin10" v-for="item in payTypeList" :key="item.payTypeId">
                            <el-row class="radio-item">
                              <el-col :span="24">
                                <el-radio class="pay-radio" v-model="form.payTypeClassCode" :label="item.payTypeClassCode"
                                  style="width: 100%" @change="payTypeChange">
                                  <span style="
                                           display: inline-block;
                                           vertical-align: sub;
                                           margin-right: 10px;
                                         ">
                                    <svg t="1568712240954" class="icon" viewBox="0 0 1137 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                      p-id="8446" width="20" height="20">
                                      <path d="M113.777778 0h910.222222a113.777778 113.777778 0 0 1 113.777778 113.777778v796.444444a113.777778 113.777778 0 0 1-113.777778 113.777778H113.777778a113.777778 113.777778 0 0 1-113.777778-113.777778V113.777778a113.777778 113.777778 0 0 1 113.777778-113.777778z m512 341.333333H512V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777778H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777777a56.888889 56.888889 0 0 0 113.777778 0v-113.777777h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-170.666666V455.111111h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-56.888888V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777z"
                                        fill="#38A79C" p-id="8447" />
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
                   <!-- <div style="margin-top: 10px;width: 99%;">
                      <el-form-item prop="authCode" :required="!judgeFunStyle">
                        <LFormtTitle label="付款码" :required="!judgeFunStyle">
                          <el-input v-model="form.authCode" :disabled="judgeFunStyle"></el-input>
                        </LFormtTitle>
                      </el-form-item>
                    </div> -->
                  </div>
                </el-col>
              </el-form-item>
              <!-- 添加新的支付方式 end -->
              <el-col class="moneyTitleWrapList">
                  <el-form-item :prop="payTypeClassCodeStyle ? '':'depositBank'" :required="!payTypeClassCodeStyle"  style="width:265px;margin-right:8px;margin-bottom: 4px;display: inline-block;">
                    <LFormtTitle label="开户行" :required="!payTypeClassCodeStyle">
                      <el-input v-model="form.depositBank" :disabled="payTypeClassCodeStyle" placeholder="请输入开户行"></el-input>
                    </LFormtTitle>
                  </el-form-item>
                  <el-form-item :prop="payTypeClassCodeStyle ? '':'bankAccount'" :required="!payTypeClassCodeStyle"  style="width:265px;margin-right:5px;margin-bottom: 4px; display: inline-block;">
                    <LFormtTitle label="银行账号" :required="!payTypeClassCodeStyle">
                      <el-input v-model="form.bankAccount" :disabled="payTypeClassCodeStyle" placeholder="请输入银行账号"></el-input>
                    </LFormtTitle>
                  </el-form-item>
              </el-col>
              <el-col class="moneyTitleWrapList">
                    <el-form-item :prop="payTypeClassCodeStyle ? '':'companyName'" :required="!payTypeClassCodeStyle"  style="width:265px;margin-right:8px;margin-bottom: 4px;display: inline-block;">
                      <LFormtTitle  label="单位名称" :required="!payTypeClassCodeStyle">
                        <el-input v-model="form.companyName" :disabled="payTypeClassCodeStyle" placeholder="请输入单位名称"></el-input>
                      </LFormtTitle>
                    </el-form-item>
                    <el-form-item :prop="payTypeClassCodeStyle ? '':'checkNum'"  :required="!payTypeClassCodeStyle"  style="width:265px;margin-right:5px;margin-bottom: 4px;display: inline-block;">
                      <LFormtTitle  label="票号" :required="!payTypeClassCodeStyle">
                        <el-input v-model="form.checkNum" :disabled="payTypeClassCodeStyle" placeholder="请输入票号"></el-input>
                      </LFormtTitle>
                    </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="12">
              <el-table :data="tableData" ref="multipleTable" border  height="444" @selection-change="handleSelectionChange">>
                <el-table-column label width="50" type="selection"></el-table-column>
                <el-table-column prop="bizTime" label="支付时间" width="180">
                </el-table-column>
                <el-table-column prop="payAmt" label="支付金额" align="right">
                </el-table-column>
                <el-table-column label="可退金额" width="120" align="right">
                  <template slot-scope="scope">
                    <!-- <span>{{calcFun(scope.row.payAmt,scope.row.refundedMoney)}}</span> -->
                    <span>{{scope.row.payRefundedMoney}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-col>
        </div>
      </el-form>
    </div>
    <span slot="footer">
      <template>
        <el-button class="footer-btn" type="primary" @click="confirm">确认</el-button>
        <el-button class="footer-btn" type="primary" plain @click="cancel">关闭</el-button>
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
        type: Object,
      },
      nextReceiptNumOutPO: {
        type: Object,
      },
      payTypeData:{
        type:String,
      },
      payTypeobj:{
        type:String,
      }
    },
    data() {
      var valPrepayMoney = (rule, value, callback) => {
        console.info("sss", value);
        let rules = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if (value === "") {
          this.$message.error("请输入预交金额");
          callback(new Error("请输入预交金额"));
        } else if (rules.test(value) === false) {
          this.$message.error("请输入正确格式的金额");
          callback(new Error("请输入正确格式的金额"));
        } else if (value <= 0) {
          this.$message.error("退款金额不能为负或等于0");
          callback(new Error("退款金额不能为负或等于0"));
        } else if (value > 1000000) {
          this.$message.error("最大额度:1000000");
          callback(new Error("最大额度:1000000"));
        } else if (this.sheSelectedList.length === 1 && value > this.sheSelectedList[0].payRefundedMoney) {
          this.$message.error("退款金额不可大于可退金额");
          callback(new Error("退款金额不可大于可退金额"));
        } else {
          callback();
        }
      };
      return {
        // 新添加字段
        tableData: [

        ],
        sheSelectedList:[],//选中的list
        radioId: '',
        judgeFunStyle: true,
        payTypeClassCodeStyle:true,
        // 新添加字段


        payTypeList: [],
        value: "",

        form: {
          prepayMoney: this.payTypeobj || '', //预缴金额
          payTypeClassCode: this.payTypeData || 'cash',
          code: "", //授权码
          authCode: '',
          checkNum: "", //票号
          bankAccount: "", //银行账号
          companyName: "", //单位名称
          depositBank: "", //开户银行
          oldPaySettlementDetailId:'',
        },
        paySettlementDetailId: '', //微信、支付宝传值的
        rules: {
          prepayMoney: [{
              required: true,
              message: "请输入退款金额",
              trigger: "blur"
            },
            {
              validator: valPrepayMoney,
              trigger: "blur"
            },
          ],
          authCode: [{
            required: false,
            message: "授权码不能为空",
            trigger: "blur"
          }],
          companyName: [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }, ],
          depositBank: [{
            required: true,
            message: "开户银行不能为空",
            trigger: "blur"
          }, ],
          bankAccount: [{
            required: true,
            message: "银行账号不能为空",
            trigger: "blur"
          }, ],
          checkNum: [{
            required: true,
            message: "票号不能为空",
            trigger: "blur"
          }, ],
        },
      };
    },
    async mounted() {
      await this.getPayTypeByAuth();
      console.log(this.payTypeData , "支付方式");
      await this.payTypeChange(this.payTypeData);
      this.judgeFunStyle = await this.judgeFun();
      this.payTypeClassCodeStyle = await this.payTypeClassCode();
    },
    methods: {
      handleSelectionChange(val) {
        this.sheSelectedList = [];
        this.paySettlementDetailId = "";
        if (val.length > 1) {
          let del_row = val.shift();
          this.$refs.multipleTable.toggleRowSelection(del_row, false);
        }
        if(val.length){
          this.sheSelectedList = val;
          this.paySettlementDetailId = val[0].paySettlementDetailId;
        }
      },
      // 判断付款吗是否显示
      judgeFun() {
        let a = true;
        // form.payTypeClassCode == 'wxpay' || !form.payTypeClassCode == 'alipay'
        if (this.form.payTypeClassCode == 'wxpay') {
          a = false;
        }
        if (this.form.payTypeClassCode == 'alipay') {
          a = false;
        }
        return a;
      },
      payTypeClassCode(){
        let a = true;
        if (this.form.payTypeClassCode == 'cheque') {
          a = false;
        }
        return a;
      },
      // payTypeChange 选择单选款
      payTypeChange(a) {
        console.log(a,"打印支付方式value2")
        this.form.payTypeClassCode = a;
        // console.log(this.form.payTypeClassCode,"打印支付方式value2")
        this.judgeFunStyle = this.judgeFun();
        this.payTypeClassCodeStyle = this.payTypeClassCode();
        if(!this.judgeFunStyle){
           this.getOnlinePayRefundChannelDetailInfo(this.form.payTypeClassCode);
        }else{
          this.tableData = [];
        }
        if (this.judgeFunStyle) {
          this.form.authCode = '';
        } else {
          this.paySettlementDetailId = '';
        }
      },
      // 刷新号
      getNextReceiptNum() {
        this.$emit("getNextReceiptNum");
      },
      // 跳转
      jumpNum() {
        this.$emit("jumpNum");
      },
      // 计算
      calcFun(a, b) {
        let c = 0;
        if(b != 0){
          if (a && b) {
            c = a - b
          }
        }else{
          c = a;
        }
        return c;
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
      // 查询退款明细的接口
      async getOnlinePayRefundChannelDetailInfo(a) {
        try {
          let payTypeId = '';
          let payTypeName = '';
          for (let i = 0; i < this.payTypeList.length; i++) {
            if (this.payTypeList[i].payTypeClassCode == a) {
              payTypeId = this.payTypeList[i].payTypeId;
              payTypeName = this.payTypeList[i].payTypeName;
              break;
            }
          }
          this.$showLoading();
          let res = await service.getOnlinePayRefundChannelDetailInfo({
            finAdId: this.patientInfo.finAdId,
            // finAdId: '8ae407b1757cba6701757d75a1990044',
            payTypeId: payTypeId
          });
          // this.tableData = res;
          console.log(res)
          let tableData = [];
          for(let i in res){
            if(res[i] && res[i].hasOwnProperty("payTypeId")){
                tableData.push({
                ...res[i],
                payRefundedMoney: this.calcFun(res[i].payAmt,res[i].refundedMoney)
              })
            }
          }
          this.tableData = tableData;
          this.$hideLoading();
        } catch (error) {
          console.info(error);
          this.$hideLoading();
          // this.$message.error(error.msg || "查询失败");
        }
      },
      // 查询支付方式
      async getPayTypeByAuth() {
        try {
          this.$showLoading();
          let res = await service.getPayTypeByAuth({
            businessCode: '00'
          });
          this.payTypeList = res.data;
         if(!this.judgeFunStyle){
            this.getOnlinePayRefundChannelDetailInfo(this.payTypeList[0].payTypeClassCode);
         }else{
           this.tableData = [];
         }

          this.$hideLoading();
        } catch (error) {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "获取退款方式失败");
        }
      },
      // 充值
      async prepay() {
        if (!this.patientInfo.inpCode) {
          this.$message.error("请查询患者信息");
          return;
        }
        if (!this.form.payTypeClassCode) {
          this.$message.error("请选择退款方式");
          return;
        }
        if (this.judgeFunStyle) {
          this.form.oldPaySettlementDetailId = '';
        } else {
          this.form.oldPaySettlementDetailId = this.paySettlementDetailId;
          if (this.form.oldPaySettlementDetailId == '') {
            this.$message.error("请选择右侧一条退款");
            return;
          } else{
            // calcFun(scope.row.payAmt,scope.row.payerAccount)
            let a =this.calcFun(this.sheSelectedList.payAmt,this.sheSelectedList.refundedMoney)
              if(this.form.refundedMoney > a){
                this.$message.error("退款金额不得多余可退金额,请重新输入！！！！");
                return;
              }
          }
        }

        this.$refs["ruleForm"].validate(async (valid) => {
          if (valid) {
            try {
              this.$showLoading();
              //根据当前支付方式code，给form添加id和name
              // for (item of this.payTypeList) {
              //   if (this.payTypeList[item].payTypeClassCode == this.form.payTypeClassCode) {
              //     this.form.payTypeId = this.payTypeList[item].payTypeId;
              //     this.form.payTypeName = this.payTypeList[item].payTypeName;
              //     return;
              //   }
              // }
              let payTypeId = '';
              let payTypeName = '';
              for (let i = 0; i < this.payTypeList.length; i++) {
                if (this.payTypeList[i].payTypeClassCode == this.form.payTypeClassCode) {
                  payTypeId = this.payTypeList[i].payTypeId;
                  payTypeName = this.payTypeList[i].payTypeName;
                  break;
                }
              }

              let data = {
                ...this.form,
                payTypeId,
                payTypeName,
                finAdId: this.patientInfo.finAdId,
                inpCode: this.patientInfo.inpCode,
                businessType: "0", // 普通预缴
              }
              //退款金额为负值
              if (this.form.prepayMoney > 0) {
                data.prepayMoney = -this.form.prepayMoney;
              }

              let res = await service.prepay(data);

              if (res.code == "1") {
                this.$message({
                  type: "success",
                  message: "退款成功"
                });
                this.$emit("confirm");
              } else {
                this.$message.error(res.msg || "退款失败");
              }
              this.$hideLoading();
            } catch (error) {
              console.info(error);
              this.$hideLoading();
              // this.$message.error(error.msg || "退款失败");
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
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dialog-style {
    text-align: center;
    // height: 650px;
    .dialog-content {
      padding: 16px;
      height: 524px;
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
    .moneyTitleWrapList{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    // 新修改样式
    .moneyTitleWrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px;

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

    &::after {
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
