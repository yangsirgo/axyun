<template>
  <div class="recharge width100 height100" style="padding:20px">
    <!--<hr style="border:1 dashed #E4E4E4" width="100%" color="#E4E4E4" size="1" />-->
    <el-row class="baseInfo">
      <el-col :span="10">
        <span>{{patient.patientName}}</span>
        <span>{{patient.patientGender}}</span>
        <span>{{patient.age}}</span>
      </el-col>
    </el-row>
    <el-row class="accountInfo">
      <el-col :span="8">
        <span>
          充值类型
          <span class="font">预存账户</span>
        </span>
      </el-col>
      <el-col :span="8">
        <span>
          印刷发票
          <span class="font">Fn1231</span>
        </span>
      </el-col>
      <el-col :span="8">
        <span>
          账户余额
          <span style="font-weight:bold;" class="main-color font">{{patient.balanceMoney}}</span>
        </span>
      </el-col>
    </el-row>
    <el-row class="rechargeInfo" :gutter="10">
      <!-- <el-col :span="12">
        <l-select-with-title :title="'充值人'" v-model="patient.payName" class="in-width">
          <el-option :label="'张娜'" :value="'1'"></el-option>
          <el-option :label="'张娜'" :value="'2'"></el-option>
        </l-select-with-title>
        <LFormtTitle label="充值人" labelWidth="62">
          <el-select v-model="patient.payName" placeholder>
            <el-option :label="'张娜'" :value="'1'"></el-option>
            <el-option :label="'张娜'" :value="'2'"></el-option>
          </el-select>
        </LFormtTitle>
      </el-col>-->
      <el-col :span="12">
        <!--<l-inputwith-title :title="'姓名'" v-model="patient.patientFullName" class="in-width"></l-inputwith-title>-->
        <LFormtTitle label="姓名">
          <el-input v-model="patient.patientName" style="line-height: 34px;"></el-input>
        </LFormtTitle>
      </el-col>
      <el-col :span="12">
        <!--<l-inputwith-title :title="'联系方式'" v-model="patient.mobileNum" class="in-width"></l-inputwith-title>-->
        <LFormtTitle label="联系方式">
          <el-input v-model="patient.mobileNum" style="line-height: 34px;"></el-input>
        </LFormtTitle>
      </el-col>
    </el-row>
    <el-row class="rechargeInfo" :gutter="10">
      <el-col :span="12">
        <!-- <el-input placeholder="请输入内容" v-model="patient.identificationNum" class="in-width">
            <el-select v-model="identificationType" slot="prepend" style="width:90px;">
              <el-option
                v-for="item in identificationTypes"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
        </el-input>-->
        <LFormtTitle label="身份证">
          <el-input v-model="patient.identificationNum" style="line-height: 34px;"></el-input>
        </LFormtTitle>
      </el-col>
    </el-row>
    <br />
    <span class="payTypeTitle">选择支付方式</span>
    <el-row class="payType" :gutter="10">
      <el-col :span="12">
        <el-radio v-model="patient.payTypeId" label="1" border class="pay-type">现金支付</el-radio>
      </el-col>
      <el-col :span="12">
        <el-radio v-model="patient.payTypeId" label="2" border class="pay-type">扫码支付</el-radio>
      </el-col>
    </el-row>
    <el-row class="payType" :gutter="10">
      <!-- <el-col :span="12">
        <el-radio v-model="patient.payTypeId" label="3" border class="pay-type">账户支付</el-radio>
      </el-col>-->
      <el-col :span="12">
        <el-radio v-model="patient.payTypeId" label="4" border class="pay-type">银联支付</el-radio>
      </el-col>
    </el-row>
    <el-row class="payMoney">
      <!--<l-inputwith-title :title="'充值金额'" v-model="patient.prestoreMoney" class="money"></l-inputwith-title>-->
      <div style="width:231px">
        <LFormtTitle label="充值金额" labelWidth="76">
          <el-input v-model="patient.prestoreMoney" style="line-height: 34px;"></el-input>
        </LFormtTitle>
      </div>
    </el-row>
    <hr style="border:1 dashed #E4E4E4" width="100%" color="#E4E4E4" class="mar-top-20" size="1" />
  </div>
</template>
<script>
export default {
  props: {
    patient: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // 证件类型集合
      identificationTypes: [
        {
          key: 1,
          value: "身份证"
        },
        {
          key: 2,
          value: "护照"
        },
        {
          key: 3,
          value: "..."
        }
      ],
      // 证件类型
      identificationType: 1
    };
  },
  watch: {
    patient(val) {
      this.$emit("update:patient", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.main-color {
  color: $l-color-primary;
}
.recharge {
  .baseInfo {
    span {
      margin-right: 10px;
      font-size: 16px;
      font-weight: bold;
      color: rgba(46, 50, 58, 1);
      line-height: 24px;
    }
  }

  .accountInfo {
    margin-top: 10px;
    font-size: $l-font-size;
    font-weight: 400;
    color: rgba(148, 157, 163, 1);
    line-height: 20px;

    .font {
      margin-left: 10px;
      color: rgba(46, 50, 58, 1);
    }
  }

  .rechargeInfo {
    margin-top: 10px;
    // width: 100%;
  }

  .payTypeTitle {
    font-size: 16px;
    font-weight: bold;
    color: rgba(46, 50, 58, 1);
  }

  .payType {
    margin-top: 10px;
  }

  .pay-type {
    width: 100%;
  }

  .mar-top-10 {
    margin-top: 10px;
  }

  .mar-top-20 {
    margin-top: 20px;
  }

  .payMoney {
    margin-top: 20px;
    height: 76px;
    background: rgba(246, 246, 246, 1);
    border-radius: 2px;
    padding: 20px;

    .money {
      margin-left: 30px;
      margin-top: 20px;
      width: 230px;
    }
  }

  .in-width {
    width: 100%;
  }
}
</style>
