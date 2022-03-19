<template>
  <l-layout
    :toolBoxs="toolBoxs"
    :defaultToolName="toolBoxs[0]"
    :boxExpanded="false"
    :isToolBox="true"
    :hasThreeRouterFlag="false"
    :patientListShow="true"
    displayMode="expand"
  >
    <template #list>
      <PatientListHospital ref="patientList" @listItemClick="listItemClickHandler"></PatientListHospital>
    </template>
    <template #content>
      <div class="bg-contain width100 height100">
        <div class="patient-card">
          <!-- <l-patient-card
            :patientName="mainTableData&&mainTableData.patientName"
            :patientAge="mainTableData&&mainTableData.patientAge"
            :patientGender="mainTableData&&mainTableData.patientGender"
          >
            <patient-basic-info :patientInfo="mainTableData"></patient-basic-info>
            <div class="moneyTitle">
              预缴总额：
              <span class="money">{{formatNumber(mainTableData?mainTableData.selfPayPrepay:0)}}</span>
            </div>
            <div class="moneyTitle">
              冻结总额：
              <span class="money">{{formatNumber(mainTableData?mainTableData.freezePrepayAmount:0)}}</span>
            </div>
            <div class="moneyTitle">
              可用余额：
              <span class="money">{{formatNumber(mainTableData?mainTableData.prepayBalance:0)}}</span>
            </div>
          </l-patient-card> -->
          <patientDetail
            :patientData="patientInfoShow"
            :detailList="detailList"
          ></patientDetail>
        </div>
        <div class="m-contain">
          <l-main :sendData="mainTableData" @fallBack="getInpPatient"></l-main>
        </div>
      </div>
    </template>
  </l-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import main from "./components/main.vue"
import service from "@/api/financeManagement/inp.js";
import patientDetail from "@/views/homeSickbeds/hsDiagTreat/components/patientDetail.vue";
import { deepClone } from "@/utils";

export default {
  watch: {
    receivePatientData: {
      handler(n) {
        this.changeRecPatientData(n);
        this.listItemClickHandler(n);
      },
      immediate: true,
      deep: true
    },
    mainTableData: {
      handler(a) {
        let data = deepClone(a);
        this.detailList = [];
        // 出生年月日 去掉时分秒，只保留年月日
        data.birthDate = data.birthDate && data.birthDate.split(" ")[0];
        data.phoneNum = data.mobileNum;
        data.medicareCard = data.patientCode;
        if(data.hasOwnProperty("addrCode") && data.addrCode.length) {
          data.address = data.addrCode;
        }
        data.predictTreatStartTime = data.predictTreatStartTime ? data.predictTreatStartTime.split(" ")[0] : '';
        data.predictTreatEndTime = data.predictTreatEndTime ? data.predictTreatEndTime.split(" ")[0] : '';;
        data.doctorName = data.manageDoctorName;
        data.nurseName = data.manageNurseName;
        this.patientInfoShow = data;
        
        let selfPayPrepay = data.selfPayPrepay || 0;
        let freezePrepayAmount = data.freezePrepayAmount || 0;
        let prepayBalance = data.prepayBalance || 0;
        this.$set(this.detailList, this.detailList.length, {
          name: this.formatNumber(selfPayPrepay),
          style: {
            fontSize: "16px",
            fontFamily: "DINPro-Medium",
            fontWeight: 500,
            textAlign: "left",
            color: "#ef0f0f"
          },
          label: "预缴总额：",
          labelStyle: {
            fontSize: "16px",
            fontFamily: "SourceHanSansSC-Medium",
            fontWeight: 500,
            textAlign: "left",
            color: "#2e323a",
            display: "flex",
            alignItems: "center",
            paddingRight: "4px"
          }
        });
        this.$set(this.detailList, this.detailList.length, {
          name: this.formatNumber(prepayBalance),
          style: {
            fontSize: "16px",
            fontFamily: "DINPro-Medium",
            fontWeight: 500,
            textAlign: "left",
            color: "#ef0f0f"
          },
          label: "可用余额：",
          labelStyle: {
            fontSize: "16px",
            fontFamily: "SourceHanSansSC-Medium",
            fontWeight: 500,
            textAlign: "left",
            color: "#2e323a",
            display: "flex",
            alignItems: "center",
            paddingRight: "4px"
          }
        });
      },
      immediate: true,
      deep: true
    }
  },
  components:{
    "l-main":main,
    patientDetail
  },
  data() {
    return {
      toolBoxs: [],
      mainTableData: {},
      patientInfoShow: {},
      //患者信息条右侧区域
      detailList: []
    };
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
    }),
    listItemClickHandler(data) {
      this.mainTableData = data;
      this.changeRecPatientData(data);
    },
     async getInpPatient(val){
      try {
        if(!val){
          return;
        }
        this.$showLoading();
        let res = await service.getInpPatientInfo({
          inpCode: val.inpCode || ''
        });
        this.mainTableData = res.data[0];
        this.changeRecPatientData(res.data[0]);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error("获取住院患者信息失败");
      }
    },
    // 金额格式化，千位分割，小数点2位
    formatNumber(a, num = 2) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(num)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    }
  }
};
</script>

<style lang="scss" scoped>
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
