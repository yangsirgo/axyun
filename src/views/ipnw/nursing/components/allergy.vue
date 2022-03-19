<template>
  <div class="height100 drug">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <allergy-component hosType="3"></allergy-component>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LeftBar from "../../components/nursingLeftBar";
import AllergyComponent from "@/views/public/allergy/index.vue";
export default {
  name: "allergy", // 过敏
  components: {
    LeftBar,
    AllergyComponent
  },
  data() {
    return {
      formParams: [
        "technicalOffices",
        "illnessArea",
        "patientsType",
        "patientsState",
        "search"
      ], // 左侧搜索条件
      toolBoxs: ["allergyDrugInfo", "templateQuote"]
    };
  },
  methods: {
    handleClick() {
      // tab 的切换方法
    },
    search(form) {
      // 查询方法
      this.$refs.patients.search(form);
    },
    readCard() {
      // 读卡方法
    },
    messageHandler() {},
    toolBoxMessage(moduleName, data) {
      if (moduleName != "PreviousPrescriptions") {
        return;
      }
    }
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        console.log(val); // 监听 患者 ID 变化 触发事件
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped></style>
