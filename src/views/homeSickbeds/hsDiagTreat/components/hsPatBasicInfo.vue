<template>
  <div class="patient-info">
    <div class="patient-info-left">
      <p class="birth-date">
        <span class="info-title width">责任医生/护士</span>
        {{ patientInfo.responsibleDoctor || '--' }}/{{ patientInfo.responsibleNurse || '--' }}
      </p>
      <p>
        <span class="info-title width">费别</span>
        {{ patientInfo.costType  || '--' }}
      </p>
    </div>
    <div class="patient-info-right">
      <p>
        <span class="info-title">建床周期</span>
        {{ patientInfo.bedBuildingDate || '--' }}
      </p>
      <p>
        <span class="info-title">余额/预交</span>
        <span class="info-money">
          {{ patientInfo.balance || '--' }}/{{ patientInfo.pay || '--' }}
        </span>

      </p>
    </div>
  </div>
</template>

<script>
// import { hideIdCardNum } from "@/utils/formatIdCard.js";

export default {
  name: "patientBasicInfo",
  props: {
    patientInfo: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    // hideCard(card) {
    //   return hideIdCardNum(card);
    // }
  }
};
</script>

<style lang="scss" scoped>
.patient-info {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  font-size: $l-font-size-min;
  color: $l-color-fontcolor-8;
  line-height: 15px;
  border-right: 1px solid $l-color-bgcolor-11;
  .patient-info-left {
    // width: 140px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    margin-right: 16px;
    .birth-date {
      // width: 116px;
      overflow: hidden;
    }
  }
  .info-title {
    display: inline-block;
    &.width {
      width: 78px;
    }
    color: $l-color-fontcolor-4;
  }
  .info-money {
      color: #EF0F0F;
  }
}
</style>