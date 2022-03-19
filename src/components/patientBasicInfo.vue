<template>
  <div class="patient-info">
    <div class="patient-info-left">
      <p class="birth-date">
        <span class="info-title width">出生日期</span>
        {{ patientInfo.birthDate&&new Date(patientInfo.birthDate).format("yyyy-MM-dd") || '--' }}
      </p>
      <p>
        <span class="info-title width">手机号</span>
        {{ patientInfo.mobileNum || '--' }}
      </p>
    </div>
    <div class="patient-info-right">
      <p>
        <span class="info-title">患者编号</span>
        {{ patientInfo.medicareCard || patientInfo.patientCode || '--' }}
      </p>
      <p>
        <span class="info-title">证件号</span>
        {{ patientInfo.identificationNum ? hideCard(patientInfo.identificationNum) :'--' }}
      </p>
    </div>
  </div>
</template>

<script>
import { hideIdCardNum } from "@/utils/formatIdCard.js";

export default {
  name: "patientBasicInfo",
  props: {
    patientInfo: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    hideCard(card) {
      return hideIdCardNum(card);
    }
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
      width: 50px;
    }
    color: $l-color-fontcolor-4;
  }
}
</style>