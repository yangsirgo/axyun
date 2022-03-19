<template>
  <div class="preMoney">
    <div class="patient-info">
      <div class="title">{{patientInfo.patientName}} {{patientInfo.patientGender}} {{patientInfo.patientAge}}</div>
      <div class="cont">
        <el-row style="margin-bottom: 14px">
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">住院号</el-col>
              <el-col :span="17">{{patientInfo.patientCode}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">病案号</el-col>
              <el-col :span="17">{{patientInfo.nedRecNo}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">患者类型</el-col>
              <el-col :span="17">{{patientInfo.patientType}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">科室</el-col>
              <el-col :span="17">{{patientInfo.depart}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 14px">
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">病区</el-col>
              <el-col :span="17">{{patientInfo.inpatientWard}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">床号</el-col>
              <el-col :span="17">{{patientInfo.bedNum}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">入院日期</el-col>
              <el-col :span="17">{{patientInfo.inDate}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">联系电话</el-col>
              <el-col :span="17">{{patientInfo.phone}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 14px">
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">住院号</el-col>
              <el-col :span="17">{{patientInfo.totalMoney}}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="preMoner-cont">
      <l-card-title>
        <template slot="left">已交预交金</template>
      </l-card-title>
      <div class="cont">
        <el-table
          :data="preMoneyData"
          border
          stripe
          width="100%"
          height="150"
          highlight-current-row
          show-summary
        >
          <el-table-column
            v-for="(item,index) in preMoneyParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="payment-cont">
      <l-card-title>
        <template slot="left">缴费信息</template>
      </l-card-title>
      <el-form ref="payMoneyForm" :model="payMoneyForm" :rules="rules">
        <div class="cont">
          <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="8">
              <el-row class="radio-item">
                <el-col :span="22">
                  <span style="display:inline-block;vertical-align: sub;margin-right:10px">
                    <svg t="1568712240954" class="icon" viewBox="0 0 1137 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="8446" width="20" height="20"><path
                      d="M113.777778 0h910.222222a113.777778 113.777778 0 0 1 113.777778 113.777778v796.444444a113.777778 113.777778 0 0 1-113.777778 113.777778H113.777778a113.777778 113.777778 0 0 1-113.777778-113.777778V113.777778a113.777778 113.777778 0 0 1 113.777778-113.777778z m512 341.333333H512V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777778H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777777a56.888889 56.888889 0 0 0 113.777778 0v-113.777777h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-170.666666V455.111111h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-56.888888V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777z"
                      fill="#38A79C" p-id="8447"></path></svg>

                  </span>
                  现金支付
                </el-col>
                <el-col :span="2" style="margin-top: 5px;">
                  <el-form-item label="" label-width="" prop="payType">
                    <el-radio v-model="payMoneyForm.payType" label="1"></el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="radio-item">
                <el-col :span="22">
                  <span style="display:inline-block;vertical-align: sub;margin-right:10px">
                   <svg t="1568712498724" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="8602" width="20" height="20"><path
                     d="M0 481.848889h481.848889V0H0v481.848889z m120.490667-361.358222h240.924444v240.924444H120.490667V120.490667zM542.094222 0v481.848889H1024V0H542.151111z m361.415111 361.415111h-240.924444V120.490667h240.924444v240.924444zM0 1024h481.848889V542.151111H0V1024z m120.490667-361.415111h240.924444v240.924444H120.490667v-240.924444zM542.094222 1024h120.490667v-120.490667H542.094222V1024z m120.490667-361.415111v240.924444h120.490667v-240.924444h-120.490667z m240.924444 240.924444h-120.433777V1024H1024v-240.924444h-120.490667v120.433777z m0-240.924444H1024V542.151111h-120.490667v120.490667zM542.151111 542.151111v120.490667h120.490667V542.151111H542.094222z"
                     fill="#2E323A" p-id="8603"></path></svg>
                  </span>
                  扫码支付
                </el-col>
                <el-col :span="2" style="margin-top: 5px;">
                  <el-form-item label="" label-width="" prop="payType">
                    <el-radio v-model="payMoneyForm.payType" label="2"></el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="radio-item">
                <el-col :span="22">
                  <span style="display:inline-block;vertical-align: sub;margin-right:10px">
                    <svg t="1568712620167" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="8758" width="20" height="20"><path
                      d="M455.111111 512H227.555556v113.777778h227.555555v227.555555h113.777778v-227.555555h227.555555V512h-227.555555V398.222222h227.555555V284.444444H227.555556v113.777778h227.555555v113.777778zM0 0h1024v1024H0V0z m341.333333 170.666667v113.777777h113.777778V170.666667H341.333333z m227.555556 0v113.777777h113.777778V170.666667h-113.777778z"
                      fill="#ff5300" p-id="8759"></path></svg>
                  </span>
                  支票支付
                </el-col>
                <el-col :span="2" style="margin-top: 5px;">
                  <el-form-item label="" label-width="" prop="payType">
                    <el-radio v-model="payMoneyForm.payType" label="3"></el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-bottom: 20px">
            <el-col :span="8">
              <el-row class="radio-item">
                <el-col :span="22">
                  <span style="display:inline-block;vertical-align: sub;margin-right:10px">
                    <svg t="1568713403337" class="icon" viewBox="0 0 1137 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="8956" width="20" height="20"><path
                      d="M113.777778 0h910.222222a113.777778 113.777778 0 0 1 113.777778 113.777778v796.444444a113.777778 113.777778 0 0 1-113.777778 113.777778H113.777778a113.777778 113.777778 0 0 1-113.777778-113.777778V113.777778a113.777778 113.777778 0 0 1 113.777778-113.777778z m227.555555 512a113.777778 113.777778 0 1 0 0-227.555556 113.777778 113.777778 0 0 0 0 227.555556z m-113.777777 56.888889a56.888889 56.888889 0 0 0-56.888889 56.888889v56.888889a56.888889 56.888889 0 0 0 56.888889 56.888889h227.555555a56.888889 56.888889 0 0 0 56.888889-56.888889v-56.888889a56.888889 56.888889 0 0 0-56.888889-56.888889H227.555556z m455.111111-227.555556a56.888889 56.888889 0 0 0 0 113.777778h227.555555a56.888889 56.888889 0 0 0 0-113.777778h-227.555555z m0 227.555556a56.888889 56.888889 0 0 0 0 113.777778h227.555555a56.888889 56.888889 0 0 0 0-113.777778h-227.555555z"
                      fill="#3D7DFB" p-id="8957"></path></svg>
                  </span>
                  账户支付 <i class="balance">余额：{{patientInfo.accountBalance}}</i>
                </el-col>
                <el-col :span="2" style="margin-top: 5px;">
                  <el-form-item label="" label-width="" prop="payType">
                    <el-radio v-model="payMoneyForm.payType" label="4"></el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="radio-item">
                <el-col :span="22">
                  <span style="display:inline-block;vertical-align: sub;margin-right:10px">
                    <svg t="1568712620167" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="8758" width="20" height="20"><path
                      d="M455.111111 512H227.555556v113.777778h227.555555v227.555555h113.777778v-227.555555h227.555555V512h-227.555555V398.222222h227.555555V284.444444H227.555556v113.777778h227.555555v113.777778zM0 0h1024v1024H0V0z m341.333333 170.666667v113.777777h113.777778V170.666667H341.333333z m227.555556 0v113.777777h113.777778V170.666667h-113.777778z"
                      fill="#ff5300" p-id="8759"></path></svg>
                  </span>
                  银联支付
                </el-col>
                <el-col :span="2" style="margin-top: 5px;">
                  <el-form-item label="" label-width="" prop="payType">
                    <el-radio v-model="payMoneyForm.payType" label="5"></el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8"></el-col>
          </el-row>
          <div class="money-input">
            <el-row :gutter="10" style="margin-bottom: 10px">
              <el-col :span="7">
                <LFormtTitle label="实收金额" required>
                  <el-form-item label="" label-width="" prop="payNum">
                    <el-input v-model.number="payMoneyForm.payNum" style="line-height: 34px;"
                              placeholder="单位：元"></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="7" v-if="payMoneyForm.payType == 3">
                <LFormtTitle label="出票人名称" required>
                  <el-form-item label="" label-width="" prop="drawer">
                    <el-input v-model.number="payMoneyForm.drawer" style="line-height: 34px;"
                              placeholder="请输入"></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="7" v-if="payMoneyForm.payType == 3">
                <LFormtTitle label="票据号" required>
                  <el-form-item label="" label-width="" prop="billNo">
                    <el-input v-model.number="payMoneyForm.billNo" style="line-height: 34px;"
                              placeholder="请输入"></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="payMoneyForm.payType == 3">
              <el-col :span="7">
                <LFormtTitle label="付款行名称" required>
                  <el-form-item label="" label-width="" prop="payingBank">
                    <el-input v-model.number="payMoneyForm.payingBank" style="line-height: 34px;"
                              placeholder="单位：元"></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="7">
                <LFormtTitle label="出票人账号" required>
                  <el-form-item label="" label-width="" prop="drawerAccount">
                    <el-input v-model.number="payMoneyForm.drawerAccount" style="line-height: 34px;"
                              placeholder="请输入"></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="7">
                <LFormtTitle label="备注">
                  <el-form-item label="" label-width="" prop="note">
                    <el-input v-model.number="payMoneyForm.note" style="line-height: 34px;"
                              placeholder="请输入"></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <div class="buttons clearfix">
      <el-button class="plain-button float-right" style="margin-left: 10px" @click="cancel">取消</el-button>
      <el-button class="primary-button float-right" @click="register">缴存</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "preMoney",
    props: ['isClose3'],
    data() {
      return {
        //患者基本信息
        patientInfo: {},
        preMoneyParams: [
          {
            prop: "receiptNum",
            label: "收据号",
            align: "left",
            width: "195",
            fixed: 'left'
          }, {
            prop: "money",
            label: "金额",
            align: "right",
            headerAlign: 'right',
            width: "200",
            fixed: false
          }, {
            prop: "payType",
            label: "支付方式",
            align: "left",
            width: "215",
            fixed: false
          }, {
            prop: "chargeDate",
            label: "交费时间",
            align: "left",
            width: "225",
            fixed: false
          }, {
            prop: "operateHuman",
            label: "操作人",
            align: "left",
            width: "95",
            fixed: false
          }
        ],
        //表单
        preMoneyData: [],
        //表单
        payMoneyForm: {
          payType: '',
          payNum: '',
          drawer: '',
          billNo: '',
          payingBank: '',
          drawerAccount: '',
          note: ''
        },
        //规则
        rules: {
          payType: [{required: true, message: '请选择支付方式', trigger: 'change'}],
          payNum: [
            {required: true, message: '请输入实收金额', trigger: 'blur'},
            {validator: this.checkMaxVal, trigger: 'blur'}
          ],
          drawer: [{required: true, message: '请输入出票人名称', trigger: 'blur'}],
          billNo: [{required: true, message: '请输入票据号', trigger: 'blur'}],
          payingBank: [{required: true, message: '请输入付款行名称', trigger: 'blur'}],
          drawerAccount: [{required: true, message: '请输入出票人账号', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getPatientInfo();
      this.getPreMoneyData();
    },
    watch: {
      isClose3() {
        if (this.isClose3 == false) {
          this.reset();
        }
      }
    },
    methods: {
      //获取患者信息
      getPatientInfo() {
        this.$showLoading();
        try {
          //获取数据接口
          let res = {
            patientName: '111',
            patientGender: 1,
            patientAge: '23岁',
            patientCode: '12',//住院号
            nedRecNo: '47577',//病案号
            patientType: '1',//患者类型
            depart: '泌尿外科',
            inpatientWard: '1',//病区
            bedNum: '142727',//床号
            inDate: '2019-06-06', // 入院时间
            phone: '123569874',//联系电话
            totalMoney: '52437',//费用总额
            accountBalance: '100'//账户余额
          };
          this.patientInfo = {...res};
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //获取患者缴存预交金记录信息
      getPreMoneyData() {
        this.$showLoading();
        try {
          //获取数据接口
          let res = [
            {
              receiptNum: '4356875',
              money: '1090.30',
              payType: '现金',
              chargeDate: '2019-03-23 10:20:34',
              operateHuman: '李坤'
            }, {
              receiptNum: '4356875',
              money: '1090.30',
              payType: '现金',
              chargeDate: '2019-03-23 10:20:34',
              operateHuman: '李坤'
            }
          ];
          this.preMoneyData = [...res];
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //重置表单
      reset() {
        this.$refs['payMoneyForm'].resetFields();
      },
      //缴存接口
      async register() {
        this.$refs['payMoneyForm'].validate(async (valid) => {
          console.log(this.payMoneyForm);
          if (valid) {
            this.$showLoading();
            try {
              //缴存接口
              // let res = await register(this.payMoneyForm);
              this.$message({message: '缴存成功', type: 'success'});
              this.$hideLoading();
              await this.reset();
              this.$emit('changeDialog', false);
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "标准错误提示");
            }
          } else {
            this.$message.error("标准错误提示");
          }
        });
      },
      //取消
      cancel() {
        this.$emit('changeDialog', false);
        this.reset();
      },
      //校验缴存金额
      checkMaxVal(rule, value, callback) {
        if (value <= 0) {
          this.$message({message: '缴存金额应大于0', type: 'warning'});
          callback(new Error('缴存金额应大于0'));
        } else {
          callback();
        }
      }
    }
  }
</script>

<style lang="scss">
  .preMoney {
    max-height: 700px;
    padding: 30px 20px 20px 20px;
    overflow-y: auto;

    .patient-info {
      margin: 0 14px 20px 14px;

      .title {
        margin-bottom: 20px;
        font-size: $l-font-size-max;
        
        font-weight: $l-font-weight;
        color: $l-color-fontcolor-3;
      }

      .cont {
        font-size: $l-font-size;
        
        font-weight: 400;
        color: $l-color-fontcolor-3;

        .cont-key {
          color: $l-color-fontcolor-4;
        }
      }
    }

    .preMoner-cont {
      .cont {
        margin: 0 0 20px 14px;
      }
    }

    .payment-cont {
      .cont {
        margin: 0 0 30px 34px;

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

        .money-input {
          padding: 20px 0 20px 20px;
          background: $l-color-bgcolor-18;
          border-radius: 2px;
        }
      }
    }

    .buttons {
      padding: 20px 20px 0 0;
      border-top: 1px solid $l-color-bgcolor-11;
    }

    .primary-button {
      width: 80px;
      height: 36px;
      padding: 0 12px;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: $l-font-size;
      
      font-weight: 400;
      color: $l-color-white;
      border: none;
    }

    .plain-button {
      width: 80px;
      height: 36px;
      padding: 0 12px;
      background: $l-color-white;
      border-radius: 2px;
      font-size: $l-font-size;
      
      font-weight: 400;
      color: $l-color-primary;
      border: 1px solid $l-color-primary;
    }
  }
</style>
