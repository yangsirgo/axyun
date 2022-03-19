<template>
  <div class="width100 height100 wrapper">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      pageName="cis_order"
      patientCardType="default"
      @message="messageHandler"
    >
      <template #topSlot>
        <l-patient-details></l-patient-details>
      </template>
      <template #list>
        <left-bar></left-bar>
      </template>
      <template #content>
        <order ref="order"></order>
      </template>
    </l-layout>
  </div>
</template>

<script>
import leftBar from "../../../components/leftBar.vue";
import topCard from "@/components/LPatientDetails.vue";
// 老版的 电子处方
// import order from "@/views/cis/prescriptionRecor/patientsManage/order/components/prescriptionModule.vue";
import order from "./components/nPrescriptionModule.vue"; //新版 电子处方
import { mapGetters } from "vuex";

export default {
  name: "",
  components: {
    leftBar,
    order,
    topCard
  },
  data() {
    return {
      tableLoading: false,
      toolBoxs: [
        "drugInfo",
        "commonDrug",
        "prescriptionTemp",
        "PreviousPrescriptions",
        "HistoricalDiagnosis",
        "Hotkey"
      ]
    };
  },
  methods: {
    messageHandler() {
      this.$refs.order && this.$refs.order.saveHandle();
      // console.log('chufalalalal');
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cis", ["psRegorActiveTabName"])
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        console.log(val); // 监听 患者 ID 变化 触发事件 reload table 数据
      },
      immediate: true,
      deep: true
    },
    psRegorActiveTabName(name){
      let index = this.toolBoxs.findIndex((item)=>{
        return item === "prescriptionTemp"
      });
      if (index === null) return;
      if (name === 'treatMedicine') {
        document.querySelector(".func-container").querySelectorAll(".title-item")[index].querySelector('p').innerText = "医嘱模板";
      } else {
        document.querySelector(".func-container").querySelectorAll(".title-item")[index].querySelector('p').innerText = "处方模板";
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.wrapper {
}
</style>


