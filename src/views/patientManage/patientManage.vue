<template>
  <div class="patientManage width100 height100 clearfix" ref="page">
    <div class="patient-list height100">
      <patient-list @getPatientInfo="getPatientInfo"></patient-list>
    </div>
    <div class="content height100">
      <div class="patient-info width100">
        <patient-info :patientInfo="patientInfo"></patient-info>
      </div>
      <!--人体图-->
      <div class="patient-body width100">
        <el-card class="width100 height100" style="padding: 20px">
          <patient-model></patient-model>
        </el-card>
      </div>
      <div class="patient-center clearfix">
        <div class="patient-left height100">
          <!--就诊记录-->
          <div class="record width100">
            <el-card class="width100 height100">
              <time-line></time-line>
            </el-card>
          </div>
        </div>
        <div class="patient-right height100">
          <div class="patient-detail width100">
            <patient-detail :patientInfo="patientInfo"></patient-detail>
          </div>
          <div class="family-info width100">
            <family-info :patientInfo="patientInfo"></family-info>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import adHeight from "@/mixins/adHeight";
  import patientList from './components/patientList';
  import patientInfo from './components/patientInfo';
  import familyInfo from './components/familyInfo';
  import patientDetail from './components/patientDetail';
  import PatientModel from './components/PatientModel.vue';
  import timeLine from './components/timeLine.vue';

  export default {
    name: "patientManage",
    mixins: [adHeight],
    components: {
      patientList,
      patientInfo,
      familyInfo,
      patientDetail,
      PatientModel,
      timeLine
    },
    data() {
      return {
        patientInfo: {}
      }
    },
    methods: {
      getPatientInfo(data) {
        this.patientInfo = data;
      }
    }
  }
</script>

<style scoped lang="scss">
  .patientManage {
    .patient-list {
      width: 300px;
      float: left;
    }

    .content {
      width: calc(100% - 320px);
      margin-left: 20px;
      float: right;

      .patient-info {
        height: 80px;
        margin-bottom: 20px;
      }

      .patient-body {
        height: 200px;
        margin-bottom: 20px;
      }

      .patient-center {
        width: 100%;
        height: calc(100% - 320px);

        .patient-left {
          width: 400px;
          float: left;

          .record {
            height: 100%;
          }
        }

        .patient-right {
          width: calc(100% - 420px);
          margin-left: 20px;
          float: right;

          .patient-detail {
            height: calc(100% - 220px);
            margin-bottom: 20px;
          }

          .family-info {
            height: 200px;
            background-color: #ccc;
          }
        }
      }
    }
  }
</style>
