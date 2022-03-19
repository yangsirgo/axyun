<template>
  <div class="root" ref="page" id="main">
    <div class="top">
      <top :patients-data="top.patientsList"
           @selectChange="selectChange"
           :patient-details="top.patientInfo"></top>
    </div>
    <div class="height100 wrapper">
      <el-row :gutter="20"  class="height100">
        <el-col :span="12"  class="height100">
          <div class="medicalOrder">
            <medicalOrder></medicalOrder>
          </div>
          <div class="application">
            <apply></apply>
          </div>
        </el-col>
        <el-col :span="12"   class="height100">
          <div class="timer">
            <timer></timer>
          </div>
          <div class="descriptions">
            <disease-course></disease-course>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

  import adHeight from '@/mixins/adHeight.js';
  import top from "../../components/patientDetails.vue";
  import medicalOrder from './medicalOrderSign.vue';
  import timer from './timer.vue';
  import apply from './applycation.vue';
  import diseaseCourse from './diseaseCourse.vue';

  export default {
    name: "IllnessDescription",
    components: {
      top,medicalOrder,timer,apply,diseaseCourse
    },
    mixins: [adHeight],
    data() {
      return {
        top : {
          patientsList :[{
            value: '0',
            bedNum: '05',
            patientName: '小芬',
            adNum: '01',
            gender: '女',
            age: '21'
          }, {
            value: '1',
            bedNum: '04',
            patientName: '小芬',
            gender: '女',
            adNum: '02',
            age: '21'
          }, {
            value: '2',
            adNum: '02',
            bedNum: '03',
            patientName: '小芬',
            gender: '女',
            age: '21'
          }, {
            value: '3',
            adNum: '03',
            bedNum: '02',
            patientName: '小芬',
            gender: '女',
            age: '21'
          }, {
            value: '4',
            adNum: '04',
            bedNum: '01',
            patientName: '小芬',
            gender: '女',
            age: '21'
          }],
          patientInfo: { // 患者基本信息
            adNum: '0235148',//就诊号
            bedNum: '01', // 床号
            patientName: '小芬', // 患者姓名
            age: 22, // 年龄
            gender: '女', // 性别
            IDNumber: '1203920394747333', // 身份证号
            finAdmissionTime: '2019-07-17', // 入院日期
            days: '30', // 入院天数
            finAdmissionDiagnosis: '肾结石', // 入院诊断
            doctor: '杨阳洋', // 主治医生
            allergyHistory: '紫外线过敏', // 过敏史
          }
        }
      }
    },
    methods: {
      selectChange (value){
        console.log(value);
      }
    }
  }

</script>

<style scoped lang="scss">
  .root {
    .top {
      height: 65px;
      width: 100%;
      position: absolute;
      padding-bottom: 20px;
    }
    .wrapper {
      padding-top: 85px;
      .medicalOrder {
        height: 40%;
        padding-bottom: 10px;

        /deep/ .el-card__body {
          padding: 0px;
          overflow: auto;
          height: calc(100% - 52px);
        }
      }

      .application {
        height: 60%;
        padding-top: 10px;

        /deep/ .el-card__body {
          padding: 0px;
          overflow: auto;
          height: calc(100% - 52px);
        }
      }

      .descriptions {
        height: 55%;
        padding-top: 10px;

        /deep/ .el-card__body {
          padding: 0px;
          overflow: auto;
          height: calc(100% - 52px);
        }
      }

      .timer {
        height: 45%;
        padding-bottom: 10px;
      }
    }
  }



</style>
