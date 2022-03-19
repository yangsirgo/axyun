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
      <patientList ref="patientList" @listItemClick="listItemClickHandler"></patientList>
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
          </l-patient-card>
        </div>
        <div class="m-contain">
          <lmain></lmain>
        </div>
      </div>
    </template>
  </l-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import patientList from "./components/patientList.vue"
import lmain from "./components/main.vue"
import service from "@/api/financeManagement/inp.js";
export default {
  watch: {
    receivePatientData: {
      handler(n) {
        this.changeRecPatientData(n);
        this.listItemClickHandler(n);
      },
      immediate: true,
      deep: true,
    },
  },
  components:{
    patientList,
    lmain
  },
  data() {
    return {
      toolBoxs: [],
      mainTableData: {},
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
    },
  },
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