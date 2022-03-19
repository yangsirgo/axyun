<template>
  <el-card class="width100 card-cont">
    <div class="top-cont clearfix width100 height100">
      <div class="left">
        <img :src="patientInfo.headImg" alt=""/>
      </div>
      <div class="center">
        <el-row class="patient-name">{{ patientInfo.patientName || '--' }}</el-row>
        <el-row class="patient-gender">
          <el-col :span="12"><span :val="patientInfo.patientGender || ''" code="GENDER_CODE" v-codeTransform></span>
          </el-col>
          <el-col :span="12">{{ patientInfo.patientAge || '--'}}</el-col>
        </el-row>
      </div>
      <div class="right">
        <el-row class="patient-top">
          出生日期<i>{{patientInfo.birthDate || '--'}}</i>
        </el-row>
        <el-row class="patient-bottom">
          手机号码<i>{{patientInfo.mobileNum || '--'}}</i>
        </el-row>
      </div>
      <div class="right">
        <el-row class="patient-top"
                v-if="patientInfo.identificationType != undefined && patientInfo.identificationType != ''">
          <span :val="patientInfo.identificationType || ''" code="MARK_TYPE_CODE" v-codeTransform></span><i>{{patientInfo.identificationNum
          || '--'}}</i>
        </el-row>
        <el-row class="patient-bottom">
          医保类型<i :val="patientInfo.ssType || ''" code="socialSecurity" v-codeTransform></i>
        </el-row>
      </div>
      <div class="right">
        <el-row class="patient-top">
          籍贯<i code="AdministrativDivision" :val="patientInfo.nativePlaceCode || ''" break="/"
                v-codeTransform></i>
        </el-row>
        <el-row class="patient-bottom"></el-row>
      </div>
      <div class="right1 float-right">
        <div class="left-info float-left">
          <el-row class="empiid">EMPI ID <i>{{ patientInfo.patientCode || '--'}}</i></el-row>
          <el-row class="illness" v-if="patientInfo.chronicStatus==1">慢性病患者标识</el-row>
        </div>
        <div class="qrcode float-left">
          <img :src="patientInfo.qrcodeImg" alt="">
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {addArchive, getArchive} from '@/api/arch/arch.js';

  export default {
    name: "top",
    data() {
      return {
        patientInfo: {}
      }
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData"])
    },
    watch: {
      "receivePatientData": {
        handler(n) {
          this.patientInfo = {};
          if (JSON.stringify(n) !== "{}") {
            this.patientInfo = {...n};
          } else {
            this.patientInfo = {};
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  i {
    font-style: normal;
  }

  .card-cont {
    height: 90px;
    padding: 10px;

    .top-cont {
      overflow: hidden;

      .left {
        margin-right: 20px;
        float: left;

        img {
          width: 70px;
          height: 70px;
        }
      }

      .center {
        min-width: 173px;
        margin-right: 30px;
        padding-right: 30px;
        padding-top: 5px;
        border-right: 1px solid $l-color-bgcolor-11;
        float: left;

        .patient-name {
          height: 26px;
          margin-bottom: 10px;
          font-size: 18px;
          
          font-weight: bold;
          color: $l-color-fontcolor-3;
          line-height: 26px;
        }

        .patient-gender {
          height: 20px;
          font-size: 14px;
          
          font-weight: bold;
          color: $l-color-fontcolor-3;
          line-height: 20px;
        }
      }

      .right {
        min-width: 216px;
        padding-top: 10px;
        float: left;

        .patient-top, .patient-bottom {
          margin: 5px 0 10px 0;
          height: 17px;
          font-size: 12px;
          
          font-weight: 400;
          color: $l-color-fontcolor-4;
          line-height: 17px;

          i {
            margin-left: 10px;
            font-size: 12px;
            
            font-weight: 400;
            color: $l-color-fontcolor-3;
            display: inline-block;
          }
        }
      }

      .right1 {

        .left-info {
          height: 15px;
          margin-right: 38px;
          margin-top: 12px;
          font-size: 12px;
          
          font-weight: 400;
          color: $l-color-fontcolor-4;
          line-height: 15px;

          .empiid {
            margin-bottom: 10px;

            i {
              color: $l-color-fontcolor-3;
            }
          }

          .illness {
            min-width: 90px;
            height: 24px;
            padding: 0 15px;
            background: $l-color-white;
            border-radius: 12px;
            font-size: 12px;
            
            font-weight: 400;
            color: $l-color-fontcolor-5;
            line-height: 24px;
            text-align: center;
          }
        }

        .qrcode {
          width: 56px;
          height: 56px;
          margin-top: 7px;
          border: 1px solid $l-color-bgcolor-11;

          img {
            width: 56px;
            height: 56px;
          }
        }
      }
    }
  }
</style>
