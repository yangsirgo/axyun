<template>
  <div class="contain">
    <div class="dialog-header">
      <el-form :model="accountRechargeForm"
               :rules="rules"
               ref="accountRechargeForm"
      >
        <div class="detail">
          <div class="title">{{JSON.parse(patientInfo).patientName}} {{JSON.parse(patientInfo).patientGender ==
            1?'男':'女'}}
            {{getAge(strSplit(JSON.parse(patientInfo).birthDate,' '))}}
          </div>
          <div class="detail-cont">
            <div class="detail-cont-item type">充值类型 <i>预存账户</i></div>
            <div class="detail-cont-item ticket">印刷发票 <i>预存账户</i></div>
            <div class="detail-cont-item balance-sum">账户余额 <i>{{accountDetailInfoData.prestoreMoney}}</i>
            </div>
          </div>
          <div class="inputs clearfix">
            <el-row :gutter="10">
              <el-col :span="12">
                <!--<el-form-item label="充值人" label-width="80px" prop="rechargeMan">
                  <el-select class="width100" v-model="accountRechargeForm.rechargeMan" placeholder="">
                    <el-option
                      label="本人"
                      value="1">
                    </el-option>
                  </el-select>
                </el-form-item>-->
                <LFormtTitle label="充值人" labelWidth="62" prop="rechargeMan">
                  <el-select v-model="accountRechargeForm.rechargeMan" placeholder="请选择">
                    <el-option
                      label="本人"
                      value="1">
                    </el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="12">
                <!--<el-form-item label="姓名" label-width="80px" >-->
                <!--<el-input class="width100" v-model="accountRechargeForm.patientName" autocomplete="off"-->
                <!--:disabled="true"></el-input>-->
                <!--</el-form-item>-->
                <LFormtTitle label="姓名" labelWidth="48" prop="patientName">
                  <el-input v-model="accountRechargeForm.patientName" style="line-height: 34px;">
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <!-- <el-form-item label="联系方式" label-width="80px" prop="phone">
                   <el-input class="width100" v-model.number="accountRechargeForm.phone" autocomplete="off"></el-input>
                 </el-form-item>-->
                <LFormtTitle label="联系方式" labelWidth="76" prop="phone">
                  <el-input v-model.number="accountRechargeForm.phone" style="line-height: 34px;">
                  </el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="12">
                <!--<el-form-item label="" label-width="45px" prop="identificationNum">
                  <el-input class="width100" placeholder="" v-model.number="accountRechargeForm.identificationNum">
                    <el-select v-model="accountRechargeForm.cardType" slot="prepend" placeholder="">
                      <el-option label="身份证" value="身份证"></el-option>
                      <el-option label="医保卡" value="医保卡"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>-->
                <LFormtTitle label="身份证" labelWidth="62" prop="identificationNum">
                  <el-input v-model.number="accountRechargeForm.identificationNum" style="line-height: 34px;">
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="rechargeMethod">
          <div class="title">请选择支付方式</div>
          <div class="clearfix">
            <el-form-item label="" label-width="0" prop="payTypeId">
              <el-col :span="12" class="margin10">
                <el-radio v-model="accountRechargeForm.payTypeId" label="1" border style="width:80%;">现金支付</el-radio>
              </el-col>
              <el-col :span="12" class="margin10">
                <el-radio v-model="accountRechargeForm.payTypeId" label="2" border style="width:80%">扫码支付</el-radio>
              </el-col>
              <el-col :span="12" class="margin10">
                <el-radio v-model="accountRechargeForm.payTypeId" label="3" border style="width:80%">账户支付</el-radio>
              </el-col>
              <el-col :span="12" class="margin10">
                <el-radio v-model="accountRechargeForm.payTypeId" label="4" border style="width:80%">银联支付</el-radio>
              </el-col>
            </el-form-item>
          </div>
          <div class="sum">
            <!--<el-form-item label="充值金额" label-width="80px" prop="prestoreMoney">-->
            <!--<el-input style="width:50%" v-model.number="accountRechargeForm.prestoreMoney"-->
            <!--autocomplete="off"></el-input>-->
            <!--</el-form-item>-->
            <div style="width:50%">
              <LFormtTitle label="充值金额" labelWidth="76" prop="prestoreMoney">
                <el-input v-model.number="accountRechargeForm.prestoreMoney" style="line-height: 34px;">
                </el-input>
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
  import {prestore} from '@/api/arch/arch.js';

  export default {
    name: "accountRecharge",
    props: ['patientInfo', 'accountDetailInfoData'],
    data() {
      return {
        rules: {
          patientNum: [{required: true, message: "", trigger: "blur"}],
          patientName: [{required: true, message: '请输入患者名字', trigger: 'blur'}],
          prestoreMoney: [{required: true, message: "预存金额不能为空", trigger: "blur"},
            {type: 'number', message: '预存金额必须为数字', trigger: "blur"}],
          payTypeId: [{required: true, message: "支付方式不能为空", trigger: "blur"}],
          phone: [{type: 'number', message: '手机号必须为数字', trigger: "blur"}],
          identificationNum: [{type: 'number', message: '证件号必须为数字', trigger: "blur"}]
        },
        accountRechargeForm: {
          rechargeMan: '1',
          patientNum: JSON.parse(this.patientInfo).patientNum,
          patientName: JSON.parse(this.patientInfo).patientName,
          identificationNum: '',
          cardType: '1',
          phone: '',//联系方式
          prestoreMoney: 0,
          payTypeId: '',//支付方式id
          moneySource: '1'//来源

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
    methods: {
      async accountPrestore(preData) {
        let data = await prestore(preData);
        // 返回成功或者失败
        //TO-DO
      },
      async confirm() {
        //将表单对象传过去，不确定这里面是否包含所有参数信息
        this.$refs['accountRechargeForm'].validate(async (valid) => {
          if (valid) {
            await this.accountPrestore(this.accountRechargeForm);
            this.$emit('rechargeConfirm', false);
            this.$refs['accountRechargeForm'].resetFields();
          }
        });
      },
      cancel() {
        this.$emit('rechargeCancel', false);
        this.$refs['accountRechargeForm'].resetFields();
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
          height: 20px;
          margin-bottom: 20px;

          .detail-cont-item {
            width: 30%;
            height: 20px;
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
          height: 76px;
          padding: 20px;
          background: $l-color-bgcolor-18;
          border-radius: 2px;
        }
      }

    }

    .dialog-footer {
      /*height: 36px;*/
      padding: 20px;
      border-top: 1px solid rgba(228, 228, 228, 1);
    }
  }
</style>
