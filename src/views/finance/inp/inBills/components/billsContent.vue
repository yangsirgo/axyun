<template>
  <div class="billsContent">
    <div class="bill-title">住院收费票据</div>
    <div class="bill-cont">
      <el-row :gutter="20" class="bill-cont-row">
        <el-col :span="6">业务流水号：{{receiptContent.bussessTradeCode}}</el-col>
        <el-col :span="6">医疗机构类型：{{receiptContent.orgType}}</el-col>
        <el-col :span="6">病历号：{{receiptContent.emrNum}}</el-col>
        <el-col :span="6">住院号：{{receiptContent.adNum}}</el-col>
      </el-row>
      <el-row :gutter="20" class="bill-cont-row">
        <el-col :span="12">住院时间：{{receiptContent.startDate}}~{{receiptContent.endDate}}</el-col>
        <el-col :span="6">住院天数：{{receiptContent.inDays}}</el-col>
        <el-col :span="6">皖财专(2018)B N2{{receiptContent.receiptNum}}</el-col>
      </el-row>
      <el-row :gutter="20" class="bill-cont-row bill-cont-border">
        <el-col :span="6">姓名：{{receiptContent.patientName}}</el-col>
        <el-col :span="3">性别：{{receiptContent.patientGender}}</el-col>
        <el-col :span="6">医保类型：{{receiptContent.companyName}}</el-col>
        <el-col :span="9">社会保障号码：{{receiptContent.socialSecurityNum}}</el-col>
      </el-row>
      <el-row :gutter="20" class="bill-cont-row bill-cont-border">
        <el-col :span="3">收费项目</el-col>
        <el-col :span="2">金额</el-col>
        <el-col :span="3" class="bill-cont-right">个人支付金额</el-col>
        <el-col :span="3">收费项目</el-col>
        <el-col :span="2">金额</el-col>
        <el-col :span="3" class="bill-cont-right">个人支付金额</el-col>
        <el-col :span="3">收费项目</el-col>
        <el-col :span="2">金额</el-col>
        <el-col :span="3">个人支付金额</el-col>
      </el-row>
      <el-row :gutter="20" class="bill-cont-row bill-cont-border" style="height:300px"></el-row>
      <el-row :gutter="20" class="bill-cont-row bill-cont-border">
        <el-col :span="16" class="bill-cont-right">合计(大写)：</el-col>
        <el-col :span="8">￥{{receiptContent.totalAmt}}</el-col>
      </el-row>
      <el-row :gutter="20" class="bill-cont-row bill-cont-border">
        <el-col :span="8">预缴金额：{{receiptContent.totalPrepayAmt}}</el-col>
        <el-col :span="8">补缴金额：{{receiptContent.paymentAmount}}</el-col>
        <el-col :span="8">退还金额：{{receiptContent.refundAmount}}</el-col>
      </el-row>
      <el-row :gutter="20" class="bill-cont-row bill-cont-border bill-cont-bottom">
        <el-col :span="6">医保统筹支付：</el-col>
        <el-col :span="6">个人账户支付：</el-col>
        <el-col :span="6">其他医保支付：</el-col>
        <el-col :span="6">个人支付金额：</el-col>
      </el-row>
      <el-row :gutter="20" class="bill-cont-row">
        <el-col :span="9">收款单位(章)：</el-col>
        <el-col :span="10">收款人(签章)：</el-col>
        <el-col :span="2">年</el-col>
        <el-col :span="2">月</el-col>
        <el-col :span="1">日</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "billsContent",
    props: ['receiptContent'],
    data() {

    }
  }
</script>

<style scoped lang="scss">
  .billsContent {
    padding: 20px;

    .bill-title {
      height: 70px;
      font-size: 25px;
      text-align: center;
      line-height: 70px;
    }

    .bill-cont {

      .bill-cont-row {
        padding: 0 10px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
      }

      .bill-cont-border {
        border: 1px solid $l-color-bgcolor-11;
        border-bottom: none;
      }

      .bill-cont-right {
        border-right: 1px solid $l-color-bgcolor-11;
      }

      .bill-cont-bottom {
        border-bottom: 1px solid $l-color-bgcolor-11;
      }
    }
  }
</style>
