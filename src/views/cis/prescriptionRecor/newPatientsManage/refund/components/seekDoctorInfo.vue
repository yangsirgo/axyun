<template>
  <el-card class="card">
    <l-card-title class="clearfix card-header" ref="header">
      <span slot="left">就诊信息</span>
    </l-card-title>
    <div class="display-list first">
      <div class="display-list-item">
        <span class="title">姓名</span>
        <span class="value">{{apptInfo.patientName}}</span>
      </div>
      <div class="display-list-item">
        <span class="title">性别</span>
        <span class="value">{{apptInfo.patientGender}}</span>
      </div><div class="display-list-item">
        <span class="title">年龄</span>
        <span class="value">{{apptInfo.patientAge}}</span>
      </div><div class="display-list-item">
        <span class="title">地址</span>
        <span class="value">{{apptInfo.nativePlaceCode}}</span>
      </div><div class="display-list-item">
        <span class="title">联系方式</span>
        <span class="value">{{apptInfo.mobileNum}}</span>
      </div>
    </div>
    <div class="display-list">
      <div class="display-list-item">
        <span class="title">就诊科室</span>
        <span class="value">{{apptInfo.ouptDeptId}}</span>
      </div>
      <div class="display-list-item">
        <span class="title">诊断</span>
        <span class="value">{{apptInfo.ouptDeptId}}</span>
      </div>
      <div class="display-list-item">
        <span class="title">就诊时间</span>
        <span class="value">{{apptInfo.ouptDeptId}}</span>
      </div>
    </div>
    <div class="display-list">
      <div class="display-list-item">
        <span class="title">收费时间</span>
        <span class="value">{{apptInfo.chargeTime}}</span>
      </div>
      <div class="display-list-item">
        <span class="title">收费员</span>
        <span class="value">{{apptInfo.chargeUserName}}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import { watch } from 'fs'
  export default {
    name: "seekDoctorInfo",
    props:{
      apptInfo:{
        type:Object,
        default:{}
      }
    },
    data() {
      return {

      }
    },
    watch: {
      apptInfo(val) {
        this.apptInfo = val;
      }
    }
  }
</script>

<style scoped lang="scss">
  .card {
    height: 100%;
    padding: 0 20px 20px;
    .display-list {
      border-bottom: 1px solid rgba(228, 228, 228, 1);
      white-space: nowrap;
      .display-list-item {
        line-height: 60px;
        display: inline-block;

        .title {
          font-size: 14px;
          
          font-weight: 400;
          color: rgba(148, 157, 163, 1);
          line-height: 20px;
        }

        .value {
          padding-left: 10px;
          font-size: 14px;
          
          font-weight: 400;
          color: rgba(46, 50, 58, 1);
          line-height: 20px;
        }
      }

      .display-list-item + .display-list-item {
        margin-left: 60px;
      }
    }
    .first  .display-list-item{
      /*line-height: 30px !important;*/
      margin-top: -20px;
    }
  }

</style>
