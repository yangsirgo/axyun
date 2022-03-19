<template>
  <div class="contain">
    <div class="dialog-header">
      <div class="detail">
        <div class="title">{{JSON.parse(patientInfo).patientName}} {{JSON.parse(patientInfo).patientGender ==
          1?'男':'女'}}
          {{getAge(strSplit(JSON.parse(patientInfo).birthDate,' '))}}
        </div>
        <div class="detail-cont clearFix">
          <div class="detail-cont-item">出生日期 <i>{{JSON.parse(patientInfo).birthDate}}</i></div>
          <div class="detail-cont-item">联系方式 <i>{{JSON.parse(patientInfo).mobileNum}}</i></div>
          <div class="detail-cont-item">身份证号 <i>{{JSON.parse(patientInfo).identificationNum}}</i></div>
          <div class="detail-cont-item">联系地址 <i>{{JSON.parse(patientInfo).contactAddress}}</i></div>
          <div class="detail-cont-item" style="margin-top: 20px">账户余额 <i>{{accountDetailInfoData.prestoreMoney}}</i>
          </div>
        </div>
        <div class="balanceSum"></div>
      </div>
      <div class="sum">
        <el-form :model="accountRefundForm" :rules="rules" ref="accountRefundForm">
          <el-row :gutter="10">
            <el-col :span="12">
              <!--<el-form-item label="退款金额" label-width="80px" prop="prestoreMoney">-->
              <!--<el-input style="width:100%" v-model.number="accountRefundForm.prestoreMoney"-->
              <!--autocomplete="off"></el-input>-->
              <!--</el-form-item>-->
              <LFormtTitle label="退款金额" labelWidth="76" prop="prestoreMoney">
                <el-input v-model.number="accountRefundForm.prestoreMoney" style="line-height: 34px;">
                </el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="12">
              <!--<el-form-item label="退款方式" label-width="80px" prop="payTypeId">-->
                <!--<el-select v-model="accountRefundForm.payTypeId" placeholder="" :disabled="true">-->
                  <!--<el-option-->
                    <!--label="现金"-->
                    <!--value="1">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->
              <LFormtTitle label="退款方式" labelWidth="76" prop="payTypeId">
                <el-select v-model="accountRefundForm.payTypeId" placeholder="" :disabled="true">
                  <el-option
                    label="现金"
                    value="1">
                  </el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="dialog-footer clearFix" slot="footer">
      <div style="float:right">
        <el-button type="primary" @click="confirm">确定退款</el-button>
        <el-button @click="cancel" class="el-button-cancel">取消</el-button>
      </div>
    </div>
  </div>


</template>

<script>
  import {fefund} from '@/api/arch/arch.js';

  export default {
    name: "accountRefund",
    props: ['patientInfo', 'accountDetailInfoData'],
    data() {
      return {
        rules: {
          prestoreMoney: [{required: true, message: "退款金额不能为空", trigger: "blur"},
            {type: 'number', message: '退款金额必须为数字', trigger: "blur"}]
          // ,payTypeId: [{required: true, message: "退款方式不能为空", trigger: "blur"}]
        },
        accountRefundForm: {
          rechargeMan: '',
          patientNum: JSON.parse(this.patientInfo).patientNum,
          patientName: '',
          cardId: '',
          cardType: '身份证',
          phone: '',//联系方式
          payTypeId: '1',//支付方式id
          prestoreMoney: ''

          // ,prestoreDetailId: '',
          // prestoreCode: '',
          // prestoreType: '',
          // prestoreBalance: '',
          // businessType: '',
          // payTypeCode: '',
          // payTypeName: '',//支付方式名称
          // thirdPartyPrestoreId: '',//第三方预存人ID
          // moneySource: ''//窗口现金、银行代码、自助机现金、微信、支付宝、APP
        }
      }
    },
    created() {
    },
    methods: {
      async accountFefund(preData) {
        let data = await fefund(preData);
        // 返回成功或者失败
        //TO-DO
      },
      async confirm() {
        this.$refs['accountRefundForm'].validate(async (valid) => {
          if (valid) {
            console.log(valid);
            await this.accountFefund(this.accountRefundForm);
            this.$emit('refundConfirm', false);
            this.$refs['accountRefundForm'].resetFields();
          }
        });
      },
      cancel() {
        this.$emit('refundCancel', false);
        this.$refs['accountRefundForm'].resetFields();
      },
      /*年龄计算*/
      getAge(str) {
        if (str) {
          var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
          if (r == null) {
            return false;
          }
          var d = new Date(r[1], r[3] - 1, r[4]);
          if (d.getFullYear() == r[1] && d.getMonth() + 1 == r[3] && d.getDate() == r[4]) {
            var Y = new Date().getFullYear();
            var M = new Date().getMonth();
            var D = new Date().getDate();
            var T = new Date().getTime();
            // debugger
            if (Math.ceil((T - d.getTime()) / 86400000) <= 28) {
              return Math.ceil((T - d.getTime()) / 86400000) + '天';
            }
            if (M + 1 < r[3]) {
              if (Y - r[1] - 1 > 3) {
                return Y - r[1] - 1 + '岁';
              }
              return Y - r[1] - 1 + '岁' + (M + 13 - r[3]) + '个月';

            }
            if (Y - r[1] - 1 > 3) {
              return Y - r[1] + '岁';
            }
            return Y - r[1] + '岁' + (M + 1 - r[3]) + '个月';

          }
          return '';
        }
        return '';
      },
      /*切割字符串*/
      strSplit(data, sym) {
        if (data) {
          let str = data.split(sym)[0];
          return str;
        }
        return "";
      }
    }
  }
</script>

<style scoped lang="scss">
  .clearFix:after {
    content: "";
    display: block;
    clear: both;
  }

  .margin10 {
    margin-bottom: 10px;
  }

  .contain {
    width: 100%;
    padding: 0 20px;

    .dialog-header {
      width: 100%;
      margin-bottom: 30px;
      border-top: 1px solid rgba(228, 228, 228, 1);

      .detail {
        margin-top: 20px;
        margin-bottom: 18px;

        .title {
          height: 24px;
          margin-bottom: 20px;
          font-size: 16px;
          
          font-weight: bold;
          color: rgba(46, 50, 58, 1);
          line-height: 24px;
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
            
            font-weight: 400;
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

      .sum {
        width: 100%;
        height: 76px;
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
</style>
