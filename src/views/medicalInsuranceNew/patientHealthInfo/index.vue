<template>
  <div class="patientHealthInfo">
    <div class="left-cont">
      <div class="between" style="margin-bottom: 16px">
        <div class="title">个人医保信息</div>
        <SZReadCard
          @cardInfo="cardInfoHandler"
          @patientInsurenceData="patientInsurenceData"
          :showPopover="false"
        ></SZReadCard>
      </div>
      <div class="sePatieentInfo-cont">
        <SZPatientInfo
          :colNum="5"
          :siPatientDto="siPatientDto"
          :tableData="tableData"
          style="flex: 1"
        ></SZPatientInfo>
      </div>
    </div>
    <div class="right-cont height100">
      <div class="title">待遇查询</div>
      <div class="right-cont-cont">
        <salaryCheck
          :siPatientDto="siPatientDto"
          :siPatientInsuranceInfoDtos="siPatientInsuranceInfoDtos"
        ></salaryCheck>
      </div>
    </div>
  </div>
</template>

<script>
import SZReadCard from "../components/SZReadCard.vue";
import SZPatientInfo from "../components/SZPatientInfo.vue";
import salaryCheck from "../components/salaryCheck.vue";

export default {
  name: "patientHealthInfo",
  components: {
    SZReadCard,
    SZPatientInfo,
    salaryCheck,
  },
  data() {
    return {
      cardInfo: {},
      // 基本信息
      siPatientDto: {},
      // 身份信息
      siPatientIdentifyDtos: [],
      // 参保信息
      siPatientInsuranceInfoDtos: [],
    };
  },
  computed: {
    tableData() {
      return {
        siPatientIdentifyDtos: this.siPatientIdentifyDtos,
        siPatientInsuranceInfoDtos: this.siPatientInsuranceInfoDtos,
      };
    },
  },
  methods: {
    cardInfoHandler(data) {
      this.cardInfo = data;
    },
    patientInsurenceData(data) {
      if (data.hasOwnProperty("siPatientDto")) {
        this.siPatientDto = {};
        this.siPatientIdentifyDtos = [];
        this.siPatientInsuranceInfoDtos = [];
        this.siPatientDto = data.siPatientDto;
        // 身份信息
        this.siPatientIdentifyDtos = data.siPatientIdentifyDtos;
        // 参保信息
        this.siPatientInsuranceInfoDtos = data.siPatientInsuranceInfoDtos;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.patientHealthInfo {
  background-color: #fff;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: row;
  .left-cont {
    width: 60%;
    padding-right: 10px;
    margin-right: 10px;
    border-right: 1px solid #ccc;
  }
  .right-cont {
    width: calc(40% - 10px);
    .right-cont-cont{
      height: calc(100% - 27px);
    }
  }
  .between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .l-input-wrap {
    margin-bottom: 8px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .sePatieentInfo-cont {
    height: calc(100% - 48px);
  }
}
</style>
