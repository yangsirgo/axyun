<template>
  <div class="patientInfo">
    <!-- <div class="title-box">
      <l-card-title>
        <template #left>
          <div>患者信息</div>
        </template>
      </l-card-title>
    </div> -->
    <div class="person">
      <el-row :gutter="10">
        <el-col :span="15">
          <l-anthro-pogram :imgWidth="120" :imgHeight="173"/>
        </el-col>
        <el-col :span="9">
          <div class="index">
            <p class="item-title">体重指数</p>
            <p class="item-detail">--</p>
            <p class="item-title">尿酸</p>
            <p class="item-detail">--</p>
            <p class="item-title">空腹血糖</p>
            <p class="item-detail">--</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="detail-info">
      <p>0000789226</p>
      <el-row>
        <el-col :span="12">
          <span class="label-title">姓 名</span>
          <span style="color:#3D7DFB" class="label-item">{{patientInfo.patientName | displayEmpty}}</span></el-col>
        <el-col :span="12">
          <span class="label-title">性 别</span>
<!--          <span class="label-item">{{patientInfo.patientGender}}</span>-->
          <span :val="patientInfo.patientGender" code="GENDER_CODE" v-codeTransform></span>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="label-title">年 龄</span>
          <span class="label-item">{{patientInfo.birthDate | displayEmpty}}岁</span>
          </el-col>
        <el-col :span="12">
          <span class="label-title">科 室</span>
          <span class="label-item">{{patientInfo.ouptDeptId | displayEmpty}}</span>
          </el-col>
      </el-row>
      <p><span class="label-title label-spec">身份证号</span>{{patientInfo.identificationNum | displayEmpty}}</p>
      <p><span class="label-title label-spec">电话号码</span>{{patientInfo.phoneNum | displayEmpty}}</p>
      <p><span class="label-title label-spec">就诊日期</span>{{patientInfo.attendTime | displayEmpty}}</p>
      <p style="color:#E1140A"><span class="label-title label-spec">过 敏 史</span>{{patientInfo.symptomDescription | displayEmpty}}</p>
      <p><span class="label-title label-spec">其他情况</span>{{patientInfo.recordRemark | displayEmpty}}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "patientInfo",
  data() {
    return {
      patientInfo: {}
    };
  },
  filters: {
    displayEmpty(data) {
      return data ? data : '--';
    }
  },
  methods: {
    //计算生日
    jsGetAge(strBirthday) {
      let returnAge;
      let strBirthdayArr = strBirthday.split("-");
      let birthYear = strBirthdayArr[0];
      let birthMonth = strBirthdayArr[1];
      let birthDay = strBirthdayArr[2];
      let d = new Date();
      let nowYear = d.getFullYear();
      let nowMonth = d.getMonth() + 1;
      let nowDay = d.getDate();
      if (nowYear == birthYear) {
        returnAge = 0;
      } else {
        let ageDiff = nowYear - birthYear;
        if (ageDiff > 0) {
          if (nowMonth == birthMonth) {
            let dayDiff = nowDay - birthDay;
            if (dayDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          } else {
            let monthDiff = nowMonth - birthMonth;
            if (monthDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          }
        } else {
          returnAge = -1;
        }
      }
      return returnAge;
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    "receivePatientData": {//深度监听，可监听到对象、数组的变化
      handler(val){
        console.log(val); // 监听 患者 ID 变化 触发事件 reload table 数据
        this.patientInfo = val;
        if(this.patientInfo.hasOwnProperty('birthDate') && this.patientInfo.birthDate != ''){
          this.patientInfo.birthDate = this.jsGetAge(this.patientInfo.birthDate);
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style lang='scss' scoped>
.patientInfo {
  // width: 100%;
  width: 100%;
  height: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  padding: 0;
  overflow: auto;
  .title-box {
    width: 100%;
    height: 64px;
    padding-left: 20px;
    border-bottom: 1px solid $l-color-bgcolor-11;
  }
  .person {
    width: 100%;
    height: 233px;
    padding: 30px 20px;
    .index {
      p:nth-of-type(even){
        margin-bottom: 15px;
      }
      .item-title{
        color: $l-color-fontcolor-4;
        line-height: 20px;
      }
      .item-detail{
        color: $l-color-fontcolor-3;
        line-height:18px;
      }
/*       p::before {
        content: "";
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }
      p:nth-of-type(1)::before {
        background-color: #0099ff;
      }
      p:nth-of-type(2)::before {
        background-color: #009966;
      }
      p:nth-of-type(3)::before {
        background-color: #663333;
      } */
    }
  }
  .detail-info {
    padding: 0 20px;
    p:first-of-type{
      font-size: 18px;
      font-weight: $l-font-weight;
      color:$l-color-fontcolor-3;
      line-height: 23px;
      margin-bottom: 20px;
    }
    .label-title{
      color: $l-color-fontcolor-4;
      line-height:20px;
      margin-right: 10px;
    }
    .label-item{
      color: $l-color-fontcolor-3;
      line-height:20px;
    }
    .el-row{
      margin-bottom: 10px;
    }
    p{
      margin-bottom: 10px;
      line-height:18px;
      color: $l-color-fontcolor-3;
      .label-title.label-spec{
        display: inline-block;
        width: 56px;
        margin-right: 10px;
        line-height:20px;
      }
    }

  }
}
</style>
