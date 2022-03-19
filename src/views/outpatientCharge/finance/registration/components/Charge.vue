<template>
  <div class="width100 height100 padding10">
    <el-table :data="charge.chargeObj.finClassVOList" style="width: 100%" border>
      <el-table-column prop="className" label="收费项目" header-align="center"></el-table-column>
      <el-table-column prop="quantity" label="数量" width="130px;" header-align="center"></el-table-column>
      <el-table-column
        prop="totalMoney"
        label="金额"
        width="125px;"
        header-align="center"
        align="right"
      ></el-table-column>
    </el-table>
    <br />
    <span class="payTitle">请选择支付信息</span>
    <div>
      <el-row :gutter="10" class="width100 mar-top-10">
        <el-col :span="12">
          <el-radio v-model="charge.payType" label="1" border class="payType">现金支付</el-radio>
        </el-col>
        <el-col :span="12">
          <el-radio v-model="charge.payType" label="2" border class="payType">扫码支付</el-radio>
        </el-col>
        <el-col :span="12" class="mar-top-10">
          <el-radio v-model="charge.payType" label="3" border class="payType">账户支付
            <span class="margin-left-10">
              卡余额
              <span class="font" v-if="charge.chargeObj.balanceMoney">{{charge.chargeObj.balanceMoney.toFixed(2) || '0.00'}}</span>
            </span>
          </el-radio>
        </el-col>
        <el-col :span="12" class="mar-top-10">
          <el-radio v-model="charge.payType" label="4" border class="payType">银联支付</el-radio>
        </el-col>
      </el-row>
      <div class="bottom-info">
        <el-row>
          <el-col :span="6" class="mar-top-10">
            <span>
              总费用
              <span class="font">{{charge.chargeObj.totalMoney.toFixed(2) || '0.00'}}</span>
            </span>
          </el-col>
          <el-col :span="6" class="mar-top-10">
            <span>
              应收
              <span class="font">{{charge.chargeObj.cashPay.toFixed(2) || '0.00'}}</span>
            </span>
          </el-col>
          <el-col :span="6" class="mar-top-10">
            <span>
              医保报销
              <span class="font">{{charge.chargeObj.derateAmount.toFixed(2) || '0.00'}}</span>
            </span>
          </el-col>
          <el-col :span="6" class="mar-top-10">
            <span>
              自费
              <span class="font">{{charge.chargeObj.selfPayMoney.toFixed(2) || '0.00'}}</span>
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="mar-top-10" style="padding-left:5px;text-align:left;">
            <span style="margin-left:55px;">实收</span>
            <el-input v-model="charge.realGet" class="margin-left-6" :change="getBackMoney()"
              :disabled="charge.chargeObj.totalMoney<=charge.chargeObj.prestoreBalance"
            ></el-input>
            <span style="color:#F05A23;" class="margin-left-6 font">{{charge.warning}}</span>
          </el-col>
          <el-col :span="5" class="mar-top-20" style="padding-left:5px;text-align:left;">
            <span>
              找零
              <span style="color:#F05A23" class="font">{{charge.backMoney.toFixed(2) || '0.00'}}</span>
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
      warning:''
    };
  },
  watch: {
    charge(val) {
      this.charge = val;
      this.$emit('update:charge', val)
    }
  },
  mounted() {
    this.charge.backMoney = 0;
    this.chargrType();
  },
  methods:{
    // 计算找零
    getBackMoney(){
      // 验证
      if(this.charge.realGet<this.charge.chargeObj.cashPay){
        this.charge.warning = '金额不足';
      }else{
        let rule = /^(\d*)(\d*)(\.\d{1,2})?$/;
        if(rule.test(this.charge.realGet) === false){
          this.charge.warning = '只能输入数字或两位小数';
        }else{
          this.charge.warning = '';
        }
      }

      if(this.charge.realGet == 0 || this.charge.realGet<this.charge.chargeObj.cashPay){
        this.charge.backMoney = 0;
        return ;
      }
      else if(this.charge.chargeObj.totalMoney > this.charge.chargeObj.prestoreBalance){
        this.charge.backMoney = this.charge.realGet - this.charge.chargeObj.cashPay || 0;
      }else{
        this.charge.backMoney = 0;
      }
    },
    // 判断付款方式
    chargrType(){
      if(this.charge.chargeObj.prestoreBalance && this.charge.chargeObj.prestoreBalance>0){
        this.charge.payType = '3';
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
</style>