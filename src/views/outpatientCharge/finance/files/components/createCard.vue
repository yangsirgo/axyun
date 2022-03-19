<template>

  <div class="contain">
    <div class="tip">
      非磁条卡请对应读卡，磁条卡请对应刷卡
    </div>
    <el-form :model="cardForm"
             :rules="rules"
             ref="cardForm">
      <el-row style="margin-bottom: 10px">
        <!--<el-form-item label="卡类型" :label-width="formLabelWidth" prop="cardType">-->
        <!--<el-radio-group v-model="cardForm.cardType" @change="cardTypeChange">-->
        <!--<el-radio :label="3">院内就诊卡</el-radio>-->
        <!--<el-radio :label="2">医保卡</el-radio>-->
        <!--<el-radio :label="1">身份证</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <LFormtTitle label="卡类型" labelWidth="60" prop="cardType">
          <el-radio-group v-model="cardForm.cardType" @change="cardTypeChange" style="line-height: 44px;">
            <el-radio :label="3">院内就诊卡</el-radio>
            <el-radio :label="2">医保卡</el-radio>
            <el-radio :label="1">身份证</el-radio>
          </el-radio-group>
        </LFormtTitle>

      </el-row>
      <el-row style="margin-bottom: 10px">
        <!--<el-form-item label="卡号" :label-width="formLabelWidth" prop="cardData">-->
        <!--<el-input v-model.number="cardForm.cardData"></el-input>-->
        <!--</el-form-item>-->
        <LFormtTitle label="卡号" labelWidth="48" prop="cardData">
          <el-input v-model.number="cardForm.cardData" style="line-height: 34px;">
          </el-input>
        </LFormtTitle>
      </el-row>

      <el-row style="margin-bottom: 30px" :gutter="10">
        <el-col :span="12">
          <!--<el-form-item label="状态" :label-width="formLabelWidth" prop="cardStatus">-->
          <!--<el-select v-model="cardForm.cardStatus" placeholder="请选择">-->
          <!--<el-option label="有效" value="1"></el-option>-->
          <!--<el-option label="失效" value="0"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <LFormtTitle label="状态" labelWidth="48" prop="cardStatus">
            <el-select v-model="cardForm.cardStatus" placeholder="请选择">
              <el-option label="有效" value="1"></el-option>
              <el-option label="失效" value="0"></el-option>
            </el-select>
          </LFormtTitle>
        </el-col>

        <el-col :span="12">
          <!--<el-form-item label="结算" :label-width="formLabelWidth" prop="settlementType">-->
          <!--<el-select v-model="cardForm.settlementType" placeholder="请选择">-->
          <!--<el-option label="本地自费" value="1"></el-option>-->
          <!--<el-option label="医保结算" value="2"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <LFormtTitle label="结算" labelWidth="48" prop="settlementType">
            <el-select v-model="cardForm.settlementType" placeholder="请选择">
              <el-option label="本地自费" value="1"></el-option>
              <el-option label="医保结算" value="2"></el-option>
            </el-select>
          </LFormtTitle>
        </el-col>
      </el-row>

      <!--<el-form-item label="有效期至" :label-width="formLabelWidth">
        <el-date-picker
          v-model="cardForm.validity"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer clearfix">
      <div style="float:right">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>

</template>
<script>
  import {addArchCard} from '@/api/arch/arch.js';

  export default {
    name: "createCard",
    props: ['patientInfo'],
    data() {
      return {
        cardForm: {
          cardData: '',
          cardType: 2,
          cardStatus: '1',
          settlementType: '2'
          // validity: ''
        },
        formLabelWidth: '100px',
        rules: {
          cardType: [{required: true, message: '请选择卡类型', trigger: 'blur'}],
          cardStatus:
            [{required: true, message: '请选择状态', trigger: 'blur'}],
          cardData:
            [{required: true, message: "卡号不能为空", trigger: "blur"},
              {type: 'number', message: '卡号必须为数字', trigger: "blur"}],
          settlementType:
            [{required: true, message: '请选择结算方式', trigger: 'blur'}]
        }
      }
    },
    created() {

    },
    methods: {
      cancel() {
        this.$emit('changeCardDisable', false);
        this.$refs['cardForm'].resetFields();
      },
      async confirm() {
        /*绑定卡片接口*/
        this.$refs['cardForm'].validate(async (valid) => {
          if (valid) {
            this.cardForm.patientNum = JSON.parse(this.patientInfo).patientNum;
            let data = await addArchCard(this.cardForm);
            await this.$emit('cardSave', false);
            this.$refs['cardForm'].resetFields();
          } else {

          }
        });

      },
      /*卡类型发生变化时候*/
      cardTypeChange(val) {
        if (val != 2) {
          this.cardForm.settlementType = '1';
        } else {
          this.cardForm.settlementType = '2';
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .el-row {
    height: auto;
  }

  .contain {
    width: 100%;
    border-top: 1px solid rgba(228, 228, 228, 1);
    padding: 20px 43px 0 43px;

    .tip {
      height: 38px;
      background: rgba(240, 247, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(213, 232, 255, 1);
      font-size: 14px;
      
      font-weight: 500;
      color: rgba(61, 125, 251, 1);
      line-height: 38px;
      text-align: center;
      margin-bottom: 32px;
    }

    .dialog-footer {
      /*height: 36px;*/
      padding: 20px;
      padding-right: 0;
      border-top: 1px solid rgba(228, 228, 228, 1);
    }

  }
</style>
