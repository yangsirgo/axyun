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
      <PatientListHospital @listItemClick="listItemClickHandler"></PatientListHospital>
    </template>
    <template #content>
      <div class="bg-contain width100 height100">
        <div class="patient-card">
          <l-patient-card
            :patientName="mainTableData&&mainTableData.patientName"
            :patientAge="mainTableData&&mainTableData.age"
            :patientGender="mainTableData&&mainTableData.patientGender"
          >
            <patient-basic-info :patientInfo="mainTableData"></patient-basic-info>
            <div class="moneyTitle">
              预缴总额：
              <span class="money">{{formatNumber(prestoreMoney)}}</span>
            </div>
            <div class="moneyTitle">
              冻结总额：
              <span class="money">{{formatNumber(freezeMoney)}}</span>
            </div>
            <div class="moneyTitle">
              可用余额：
              <span class="money">{{formatNumber(balanceMoney)}}</span>
            </div>
          </l-patient-card>
        </div>
        <div class="m-contain">
          <l-main :sendData="mainTableData"></l-main>
        </div>
      </div>
    </template>
  </l-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import main from "./components/main.vue"
import service from "@/api/financeManagement/prestoreGrant"; //查询患者账户信息
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
    "l-main":main
  },
  data() {
    return {
      toolBoxs: [],
      mainTableData: {},
      prestoreMoney: 0, //预缴总额
      freezeMoney: 0, //冻结总额
      balanceMoney: 0, //可用余额
    };
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
    }),
    listItemClickHandler(data) {
      this.mainTableData = data;
      this.getPatientPrestore(); //查询当前患者账户信息
      this.changeRecPatientData(data);
    },
    //查询患者账户信息
    // 查询患者账户信息
    async getPatientPrestore() {
      console.log(this);
      try {
        if (!this.mainTableData || !this.mainTableData.patientId) {
          return;
        }
        let res = await service.getPatientPrestore({
          patientId: this.mainTableData.patientId,
        });
        this.prestoreMoney = res.data.prestoreMoney;
        this.freezeMoney = res.data.freezeMoney;
        this.balanceMoney = res.data.balanceMoney;
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "查询患者账户信息失败");
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