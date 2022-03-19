<template>
  <div class="contain">
    <div class="tip">
      非磁条卡请对应读卡，磁条卡请对应刷卡
    </div>
    <el-form :model="cardForm"
             :rules="rules"
             ref="cardForm">
      <el-row style="margin-bottom: 20px">
        <LFormtTitle label="卡类型" required>
          <el-form-item label="" prop="cardType">
            <el-radio-group v-model="cardForm.cardType" style="line-height: 44px;">
              <el-radio :label="20">院内就诊卡</el-radio>
              <el-radio :label="21">医保卡</el-radio>
              <el-radio :label="1">身份证</el-radio>
            </el-radio-group>
          </el-form-item>
        </LFormtTitle>

      </el-row>
      <el-row style="margin-bottom: 20px">


        <el-col :span="24">
          <LFormtTitle label="卡号" required>
            <el-form-item label="" prop="cardData">
              <el-input v-model="cardForm.cardData" style="line-height: 34px;">
              </el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>


        <!--<el-col :span="6">
          <el-button type="primary" class="duka-button" style="width:100%" @click="readCard"><i
            class="iconfont iconduka"></i>读卡
          </el-button>
        </el-col>-->


      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" class="duka-button" style="width:100%" @click="readCard"><i
            class="iconfont iconduka"></i>读卡
          </el-button>
        </el-col>
      </el-row>

      <!-- <el-row style="margin-bottom: 30px" :gutter="10">
         <el-col :span="12">
           <LFormtTitle label="状态" required>
             <el-form-item label="" prop="cardStatus">
               <el-select v-model="cardForm.cardStatus" placeholder="请选择">
                 <el-option label="有效" value="1"></el-option>
                 <el-option label="失效" value="0"></el-option>
               </el-select>
             </el-form-item>
           </LFormtTitle>
         </el-col>

         <el-col :span="12">
           <LFormtTitle label="结算" required>
             <el-form-item label="" prop="settlementType">
               <el-select v-model="cardForm.settlementType" placeholder="请选择">
                 <el-option label="本地自费" value="1"></el-option>
                 <el-option label="医保结算" value="2"></el-option>
               </el-select>
             </el-form-item>
           </LFormtTitle>
         </el-col>
       </el-row>-->
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
  import {mapActions, mapGetters} from 'vuex';
  import {addArchCard, swipe} from '@/api/arch/arch.js';

  export default {
    name: "createCard",
    data() {
      return {
        cardForm: {
          cardData: '',
          cardType: 1
          // cardStatus: '1',
          // settlementType: '2'
          // validity: ''
        },
        rules: {
          cardType: [{required: true, message: '请选择卡类型', trigger: 'blur'}],
          /*  cardStatus:
              [{required: true, message: '请选择状态', trigger: 'blur'}],*/
          cardData:
            [{required: true, message: "卡号不能为空", trigger: "blur"}]
          /*settlementType:
            [{required: true, message: '请选择结算方式', trigger: 'blur'}]*/
        }
      }
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData"])
    },
    watch: {
      "receivePatientData": {
        handler(n) {
          if (!n.patientId) {
            // this.$message("该患者未建档，请开始建档");
            // this.$router.push('/patientMaster/recordCreate');
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      cancel() {
        this.$emit('changeCardDisable', false);
        this.$refs['cardForm'].resetFields();
      },
      async confirm() {
        /*绑定卡片接口*/
        if (this.receivePatientData.patientId) {
          this.$refs['cardForm'].validate(async (valid) => {
            if (valid) {
              this.loading = true;
              try {
                this.cardForm.patientId = this.receivePatientData.patientId || '';
                let result = await addArchCard(this.cardForm);
                if (result.code == 1) {
                  await this.$emit('cardSave', false);
                  this.$refs['cardForm'].resetFields();
                } else {
                  this.$message.error(result.msg || "绑卡失败");
                }

              } catch (error) {
                this.loading = false;
                this.$message.error(error.message || '绑卡失败');
              }
            } else {
              this.loading = false;
              this.$message.error('绑卡失败');
            }
          });
        } else {
          this.$message("该患者未建档，请开始建档");
          this.$router.push('/patientMaster/recordCreate');
        }
      },
      async readCard() {
        /*this.loading = true;
        try {
          let result = await swipe({cardNum: this.param.cardId});
          if (result.data.patientId != '') {
            this.$message.error("此卡以及绑定档案!");
            return false;
          }
          this.cardForm.cardType = parseInt(result.data.cardType);
          console.log(result)
        } catch (error) {
          this.$message.error(error.message || "标准错误提示");
        }
        this.loading = false;*/

      },
      /*卡类型发生变化时候*/
      cardTypeChange(val) {
        // if (val != 2) {
        //   this.cardForm.settlementType = '1';
        // } else {
        //   this.cardForm.settlementType = '2';
        // }
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
      /*border-top: 1px solid rgba(228, 228, 228, 1);*/
    }

  }
</style>
