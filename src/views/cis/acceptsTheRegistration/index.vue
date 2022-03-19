
<template>
  <l-layout
    :boxExpanded="false"
    :isToolBox="true"
    :hasThreeRouterFlag="false"
    :patientListShow="true"
    displayMode="expand"
    @message="messageHandler"
  >
    <template #list>
      <PatientListFinance :showAdd="showAdd" user="appointmentOrder"  @listItemClick="listItemClickHandler"></PatientListFinance>
    </template>
    <template #content>
      <div class="bg-contain width100 height100">
        <div class="patient-card">
          <patientDetail
            :patientData="patientInfoShow"
            :detailList="detailList"
            docType="1"
          ></patientDetail>
        </div>
        <div class="m-contain">
          <l-main :sendData="mainTableData" @allWaitPrice="allWaitPriceHandler"></l-main>
        </div>
      </div>
    </template>
  </l-layout>
</template>

<script>
import PatientList from "@/components/PatientList.vue";
import lMain from "./components/mainNew.vue";
import PatientInfoTop from "@/components/PatientInfoTop.vue";
import patientDetail from "@/views/cis/prescriptionRecor/components/patientDetail.vue";
import { deepClone } from "@/utils";

export default {
  name: "outpCharge",
  components: {
    PatientList,
    lMain,
    patientDetail
  },
  data() {
    return {
      toolBoxExpanded: false,
      toolBarExpanded: true,
      contentStyle: "289px",
      tableLoading: false,
      showAdd:'0',
      // toolBoxs: ["billManage", "receiptJump", "Hotkey"],
      // toolBoxs: ["Hotkey"],
      mainTableData: {},
      isToolBox: true,
      allWaitPrice: 0,
      patientInfoShow: {},
      //患者信息条右侧区域
      detailList: []
    };
  },
  watch: {
    boxExpanded: {
      handler(v) {
        this.toolBoxExpanded = v;
      },
      immediate: true,
    },
    isToolBox: {
      handler(v) {
        if (v === true) {
          if (this.toolBoxExpanded === true) {
            this.contentStyle = "298px";
          } else {
            this.contentStyle = "56px";
          }
        } else {
          this.contentStyle = "0";
        }
      },
      immediate: true,
    },
    toolBoxExpanded: {
      handler(v) {
        if (this.isToolBox === true) {
          if (v === true) {
            this.contentStyle = "298px";
          } else {
            this.contentStyle = "56px";
          }
        }
      },
      immediate: true,
    },
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
    },
    allWaitPriceHandler(data) {
      this.allWaitPrice = data;

    }
  },
};
</script>
<style lang='scss' scoped>
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
