<template>
  <div class="width100 height100">
    <l-layout
      :hasThreeRouterFlag="false"
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      :isToolBox="true"
      :patientListShow="true"
      @message="messageHandler"
    >
      <template #list>
        <PatientListFinance @listItemClick="listItemClickHandler"></PatientListFinance>
      </template>
      <template #content>
        <div class="bg-contain width100 height100">
          <div class="patient-card">
            <!-- <l-patient-card
              :patientName="mainTableData&&mainTableData.patientName"
              :patientAge="mainTableData&&mainTableData.age"
              :patientGender="mainTableData&&mainTableData.patientGender"
            >
              <patient-basic-info :patientInfo="mainTableData"></patient-basic-info> -->
              <!-- <div class="moneyTitle">
                代缴费金额合计：
                <span class="money">899.00元</span>
              </div> -->
            <!-- </l-patient-card> -->
            <patientDetail
              :patientData="patientInfoShow"
              :detailList="detailList"
            ></patientDetail>
          </div>
          <div class="m-contain">
            <l-main :sendData="mainTableData"></l-main>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import PatientList from "@/components/PatientList.vue";
import lMain from "./components/mainCardNew.vue";
import PatientInfoTop from "@/components/PatientInfoTop.vue";
import patientDetail from "@/views/cis/prescriptionRecor/components/patientDetail.vue";
import { deepClone } from "@/utils";

export default {
  name: "refund",
  components: {
    PatientList,
    lMain,
    patientDetail
  },
  data() {
    return {
      toolBoxs: ["AuxiliaryDiagnosis"],
      mainTableData: {},
      patientInfoShow: {},
      //患者信息条右侧区域
      detailList: []
    };
  },
  watch: {
    mainTableData: {
      immediate: true,
      deep: true,
      handler(a) {
        let data = deepClone(a);
        // 出生年月日 去掉时分秒，只保留年月日
        data.birthDate = data.birthDate && data.birthDate.split(" ")[0];
        data.phoneNum = data.mobileNum;
        data.medicareCard = data.patientCode;
        try {
          let addressInfo = data.addressInfo || {};
          if(addressInfo.hasOwnProperty("currentAddress") && JSON.parse(addressInfo.currentAddress).length) {
              data.address = JSON.parse(addressInfo.currentAddress)
          }
          if(a.currentProvinceCode && a.currentCityCode && a.currentRegionCode) {
            data.address = [Number(a.currentProvinceCode), Number(a.currentCityCode), Number(a.currentRegionCode)];
          }
        } catch (error) {

        }

        this.patientInfoShow = data;
      }
    }
  },
  methods: {
    messageHandler() {},
    listItemClickHandler(data) {
      this.mainTableData = data;
    }
  }
};
</script>

<style lang='scss' scoped>
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: $l-bg-radius-max;
  font-size: 0;
  box-sizing: border-box;

  .m-contain {
    height: calc(100% - 56px);
    box-sizing: border-box;
  }
}
</style>


