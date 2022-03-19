<template>
  <div class="width100 height100">
    <l-layout
      :boxExpanded="false"
      patientCardType="settleAccount"
      pageName="cisReturnCharge"
      :key="activityName"
      :isToolBox="false"
    >
      <!-- <template #topSlot>
        <l-patient-details v-if="activityName==='first'"></l-patient-details>
        <PatientInfoTop v-else-if="activityName==='second'" :patientInfo="mainTableData" />
      </template>-->
      <template #list>
        <left-bar :activityName="activityName"></left-bar>
      </template>
      <template #content>
        <div class="bg-contain width100 height100">
          <div class="patient-card">
            <l-patient-card
              :patientName="mainTableData&&mainTableData.patientName"
              :patientAge="mainTableData&&mainTableData.patientAge"
              :patientGender="mainTableData&&mainTableData.patientGender"
            >
              <patient-basic-info :patientInfo="mainTableData"></patient-basic-info>
            </l-patient-card>
          </div>
          <div class="m-contain">
            <l-main></l-main>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import leftBar from "./components/leftBarNew.vue";
import lMain from "./components/chargeMain.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "",
  components: {
    leftBar,
    lMain,
  },
  data() {
    return {
      activityName: "first",
      mainTableData: {},
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
  },
  watch: {
    receivePatientData: {
      handler(n) {
        this.mainTableData = n || {};
        this.mainTableData.mobileNum = n.phoneNum;
      },
      immediate: true,
      deep: true,
    },
    activityName: {
      handler(n) {
        this.changeRecPatientData({});
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
    }),
    handleClick(tabs) {},
    listItemClickHandle(data) {
      this.changeRecPatientData(data);
    },
  },
};
</script>

<style lang='scss' scoped>
/deep/ .LSideTab-tabs > .el-tabs__header .el-tabs__nav {
  width: 100%;
}

/deep/ .LSideTab-tabs > .el-tabs__header .el-tabs__item {
  width: 50% !important;
  text-align: center !important;
  height: 30px !important;
  font-size: $l-font-size !important;

  font-weight: $l-font-weight !important;
  line-height: 30px !important;
}

/deep/ .LSideTab-tabs > .el-tabs__header .el-tabs__item.is-active {
  color: $l-color-white !important;
}

/deep/ .LSideTab-tabs > .el-tabs__content {
  padding: 0;
  height: calc(100% - 29px);
}
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: $l-bg-radius-max;
  font-size: 0;
  box-sizing: border-box;
  /deep/ .patient-card-right {
    display: flex;
  }
  .moneyTitle {
    font-size: 16px;
    font-family: SourceHanSansSC, SourceHanSansSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #2e323a;
    display: flex;
    align-items: center;
    padding: 0 24px;
  }
  .money {
    font-size: 16px;
    font-family: DINPro, DINPro-Medium;
    font-weight: 500;
    text-align: left;
    color: #ef0f0f;
  }
  .m-contain {
    height: calc(100% - 56px);
    box-sizing: border-box;
  }
}
</style>
