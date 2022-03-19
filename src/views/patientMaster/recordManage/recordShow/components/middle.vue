<template>
  <div class="middle-cont width100 height100">
    <el-row style="margin-bottom: 10px">
      <el-col :span="8">
        <el-col :span="6">姓名：</el-col>
        <el-col :span="18">{{patientDetail.patientName}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="7">真实姓名：</el-col>
        <el-col :span="17">{{patientDetail.patientFullName}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8">性别：</el-col>
        <el-col :span="16">{{ patientDetail.patientGender==1?'男':'女'}}</el-col>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :span="8">
        <el-col :span="6">出生日期：</el-col>
        <el-col :span="18">{{patientDetail.birthDate}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="7">出生时间：</el-col>
        <el-col :span="17">{{patientDetail.birthTime}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8">婚姻状况：</el-col>
        <el-col :span="16">{{ patientDetail.marry==0?'未婚':'已婚'}}</el-col>
      </el-col>

    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :span="8">
        <el-col :span="6">社保卡：</el-col>
        <el-col :span="18">{{patientDetail.SINCardNo}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="7">年龄：</el-col>
        <el-col :span="17">{{patientDetail.patientAge}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8">血型：</el-col>
        <el-col :span="16">{{patientDetail.bloodType}}</el-col>
      </el-col>

    </el-row>

    <el-row style="margin-bottom: 10px">
      <el-col :span="8">
        <el-col :span="6">籍贯：</el-col>
        <el-col :span="18">{{patientDetail.nativePlaceCode}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="7">民族：</el-col>
        <el-col :span="17">{{patientDetail.nationCode}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8">其他电话：</el-col>
        <el-col :span="16">{{ patientDetail.otherMobileNum}}</el-col>
      </el-col>
      <!--<el-col :span="5">
        <el-col :span="8">职业：</el-col>
        <el-col :span="16">{{ patientDetail.careerCode}}</el-col>
      </el-col>
      <el-col :span="5">
        <el-col :span="7">邮编：</el-col>
        <el-col :span="17">{{patientDetail.postCode}}</el-col>
      </el-col>-->
    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :span="8">
        <el-col :span="6">户籍地址：</el-col>
        <el-col :span="18">{{patientDetail.domicile}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="7">邮编：</el-col>
        <el-col :span="17">{{patientDetail.domicilePostCode}}</el-col>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :span="8">
        <el-col :span="6">联系地址：</el-col>
        <el-col :span="18">{{patientDetail.address}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="7">邮编：</el-col>
        <el-col :span="17">{{patientDetail.addressPostCode}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8">邮箱：</el-col>
        <el-col :span="16">{{ patientDetail.email}}</el-col>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px;padding-bottom:10px;border-bottom:1px solid #e4e4e4">
      <el-col :span="8">
        <el-col :span="6">职业：</el-col>
        <el-col :span="18">{{ patientDetail.careerCode}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="7">单位：</el-col>
        <el-col :span="17">{{patientDetail.company}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8">单位电话：</el-col>
        <el-col :span="16">{{patientDetail.officeTel}}</el-col>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px;">
      <el-col :span="8">
        <el-col :span="6">结算类型：</el-col>
        <el-col :span="18">{{patientDetail.fiduciaryName}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="7">结算单位：</el-col>
        <el-col :span="17">{{patientDetail.settlementCompany}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8">社保类型：</el-col>
        <el-col :span="16">{{patientDetail.socialSecurity}}</el-col>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px;padding-bottom:10px;border-bottom:1px solid #e4e4e4">
      <el-col :span="8">
        <el-col :span="6">建档类型：</el-col>
        <el-col :span="18">{{patientDetail.bookbuildingType}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="7">关联卡：</el-col>
        <el-col :span="17">{{patientDetail.cardAssociated}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8">档案装填：</el-col>
        <el-col :span="16">{{patientDetail.fileLoading}}</el-col>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :span="8">
        <el-col :span="6">监护人：</el-col>
        <el-col :span="18">{{patientDetail.archFiduciaryList.fiduciaryName}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="7">关系：</el-col>
        <el-col :span="17">{{patientDetail.archFiduciaryList.relationShip}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8">监护人身份证号：</el-col>
        <el-col :span="16">{{patientDetail.archFiduciaryList.identityNumber}}</el-col>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px;padding-bottom:10px;border-bottom:1px solid #e4e4e4">
      <el-col :span="8">
        <el-col :span="6">工作单位：</el-col>
        <el-col :span="18">{{ patientDetail.archFiduciaryList.contactAddress}}</el-col>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :span="8">
        <el-col :span="6">担保人：</el-col>
        <el-col :span="18">{{patientDetail.archGuarantorList.guarantorName}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="7">担保人联系方式：</el-col>
        <el-col :span="17">{{patientDetail.archGuarantorList.guarantorPhone}}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8">监护人身份证号：</el-col>
        <el-col :span="16">{{patientDetail.archGuarantorList.guarantorIdentificationNum}}</el-col>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px;padding-bottom:10px;border-bottom:1px solid #e4e4e4">
      <el-col :span="8">
        <el-col :span="6">工作单位：</el-col>
        <el-col :span="18">{{ patientDetail.archGuarantorList.guaranteeAddress}}</el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "middle",
    props: {
      patientDetail: {
        type: Object
      }
    }
  }
</script>

<style scoped lang="scss">
  .middle-cont {
    padding: 20px;
  }
</style>
