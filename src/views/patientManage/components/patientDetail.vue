<template>
  <div class="patientDetail width100 height100">
    <el-card class="width100 height100 card-cont">
      <el-row style="margin-bottom: 10px">
        <el-col :span="8">
          <el-col :span="6">姓名：</el-col>
          <el-col :span="18">{{patientDetail.patientName}}</el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7">真实姓名：</el-col>
          <el-col :span="17">{{patientDetail.patientFullName}}</el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="8">性别：</el-col>
          <el-col :span="16">{{ patientDetail.patientGender==1?'男':'女'}}</el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="7">年龄：</el-col>
          <el-col :span="17">{{patientDetail.patientAge}}</el-col>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="8">
          <el-col :span="6">出生日期：</el-col>
          <el-col :span="18">{{patientDetail.birthDate}}</el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7">出生时间：</el-col>
          <el-col :span="17">{{patientDetail.birthTime}}</el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="8">婚姻状况：</el-col>
          <el-col :span="16">{{ patientDetail.marry==0?'未婚':'已婚'}}</el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="7">血型：</el-col>
          <el-col :span="17">{{patientDetail.bloodType}}</el-col>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px;padding-bottom:10px;border-bottom:1px solid #e4e4e4">
        <el-col :span="8">
          <el-col :span="6">护照：</el-col>
          <el-col :span="18">{{patientDetail.passport}}</el-col>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="8">
          <el-col :span="6">籍贯：</el-col>
          <el-col :span="18">{{patientDetail.nativePlace}}</el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7">民族：</el-col>
          <el-col :span="17">{{patientDetail.nationality}}</el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="8">职业：</el-col>
          <el-col :span="16">{{ patientDetail.job}}</el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="7">邮编：</el-col>
          <el-col :span="17">{{patientDetail.postCode}}</el-col>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="8">
          <el-col :span="6">联系地址：</el-col>
          <el-col :span="18">{{patientDetail.address}}</el-col>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px;padding-bottom:10px;border-bottom:1px solid #e4e4e4">
        <el-col :span="8">
          <el-col :span="6">详细地址：</el-col>
          <el-col :span="18">{{patientDetail.detailAddress}}</el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7">联系方式：</el-col>
          <el-col :span="17">{{patientDetail.phone}}</el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="8">邮箱：</el-col>
          <el-col :span="16">{{ patientDetail.email}}</el-col>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="8">
          <el-col :span="6">监护人：</el-col>
          <el-col :span="18">{{patientDetail.guardianName}}</el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7">监护人：</el-col>
          <el-col :span="17">{{patientDetail.guardianIdentityNum}}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6">监护人单位：</el-col>
          <el-col :span="18">{{ patientDetail.guardianCompanyAdress}}</el-col>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "patientDetail",
    props: ['patientInfo'],
    data() {
      return {
        patientDetail: {}
      }
    },
    watch: {
      patientInfo() {
        this.patientDetail = JSON.parse(this.patientInfo);
      }
    }
  }
</script>

<style scoped lang="scss">
  .patientDetail {
    .card-cont {
      padding: 20px;
    }
  }
</style>
