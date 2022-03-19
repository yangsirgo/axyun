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
            <el-radio-group v-model="cardForm.cardType" style="margin-left: 10px;">
              <el-radio :label="20">就诊卡</el-radio>
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
              <el-input v-model.number="cardForm.cardData" style="line-height: 34px;">
              </el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>

      </el-row>
     <!-- <el-row>
        <el-col :span="24">
          <el-button type="primary" class="duka-button" style="width:100%" @click="readCard"><i
            class="iconfont iconduka"></i>读卡
          </el-button>
        </el-col>
      </el-row> -->

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
  import {bindCard} from '@/api/filingAndChange/arch';

  export default {
    name: "createCard",
     props: ['patientId'],
    data() {
      //姓名校验
      let Validate = (rule, value, callback) => {
        let numRule = /[0-9]/;
        if (value) {
          if (numRule.test(value)) {
             callback();
          } else {
            this.$message.error('请填写数字');
          }
        }else{
        this.$message.error('卡号不能为空');
        }
      };
      return {
        // 患者patientId

        cardForm: {
          cardData: '',
          cardType: 1,
          cardTime:'',
          cardStatus:'1',
        },
        rules: {
          cardType: [{required: true, message: '请选择卡类型', trigger: 'blur'}],
          cardData:
            [
              {
               validator: Validate,
              message: "请输入卡号",
              trigger: "blur",
              }
            ]

        }
      }
    },

    watch: {
       patientId(a,d){
         if(this.patientId){
           this.cardForm.patientId = this.patientId;
         }
          console.log(this.patientId,'patientId')
       }

    },
    methods: {
      cancel() {
        this.$emit('changeCardDisable', false);
        this.$refs['cardForm'].resetFields();
      },
      async confirm() {

        /*绑定卡片接口*/
        // if (this.patientId) {
          this.$refs['cardForm'].validate(async (valid) => {
            if (valid) {
              //获取当前时间
              let date = new Date();
              let year = date.getFullYear();
              let month = date.getMonth() + 1;
              let day = date.getDate();
              if (month < 10) {
                  month = "0" + month;
              }
              if (day < 10) {
                  day = "0" + day;
              }
              let nowDate = year + "-" + month + "-" + day;
              this.cardForm.cardTime = nowDate;
              if(this.cardForm.cardType == '1'){
                 let testStr = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                 if(testStr.test(this.cardForm.cardData)){
                   this.$emit('changeCardDisable', false,this.cardForm);
                 }else{
                    this.$message.error('身份证格式不对');
                 }
              }else{
                
                this.$emit('changeCardDisable', false,this.cardForm);
              }


               // this.$refs['cardForm'].resetFields();
              // this.loading = true;
              // try {
              //   this.cardForm.patientId = this.patientId || '';
              //   let result = await bindCard(this.cardForm);
              //   if (result.code == '1') {
              //     await this.$emit('cardSave', false);
              //     this.$refs['cardForm'].resetFields();
              //   } else {
              //     this.$message.error(result.msg || "绑卡失败");
              //   }

              // } catch (error) {
              //   this.loading = false;
              //   this.$message.error(error.msg || '绑卡失败');
              // }
            // } else {
            //   this.loading = false;
            //   this.$message.error('绑卡失败');
            }
          });
        // } else {
          // this.$message("该患者未建档，请开始建档");
          // this.$router.push('/patientMaster/recordCreate');
        // }
      },
      // async readCard() {


      // },
      /*卡类型发生变化时候*/
      cardTypeChange(val) {

      }
    }
  }
</script>
<style scoped lang="scss">
  .el-row {
    height: auto;
  }
  .el-form-item{
    margin-bottom: 0px;
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
