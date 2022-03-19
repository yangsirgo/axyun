<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="default"
      @message="messageHandler"
      hosType="1"
    >
      <template #topSlot>
        <l-patient-details></l-patient-details>
      </template>
      <template #list>
        <left-bar></left-bar>
      </template>
      <template #content>
        <iframe
          src="http://43.240.130.80:8001/#/?param=%7B%22caseNo%22%3A%2218101019947%22,%22mrNo%22%3A%22176049%22,%22admType%22%3A%22O%22%7D"
          style="border:0;"  
          title="内嵌页面"
          class="width100 height100"
        ></iframe>
      </template>
    </l-layout>
  </div>
</template>

<script>
import leftBar from "../../../components/leftBar.vue";
import mainCard from "@/views/public/allergy/index.vue";
import { mapGetters } from "vuex";

export default {
  name: "",
  components: {
    leftBar,
    mainCard
  },
  data() {
    return {
      tableLoading: false,
      toolBoxs: [
        "AuxiliaryDiagnosis",
        "InspectionResults",
        "CheckResult",
        "HistoricalDiagnosis",
        "commonDiag",
        "PreviousPrescriptions"
      ]
    };
  },
  methods: {
    messageHandler() {
      console.log("工具箱消息");
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        console.log(val); // 监听 患者 ID 变化 触发事件 reload table 数据
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
