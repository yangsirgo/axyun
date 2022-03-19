<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      pageName="diagnosis"
      patientCardType="default"
      @load-diag-table="messageHandler"
      :commdiagQuote="true"
      :diagTemplateQuote="true"
      hosType="1"
    >
      <template #topSlot>
        <l-patient-details></l-patient-details>
      </template>
      <template #list>
        <left-bar></left-bar>
      </template>
      <template #content>
        <diagnosis
          hosType="1"
          :patientId="receivePatientData.patientId"
          :inpCode="receivePatientData.patientCode"
          :visitId="receivePatientData.visitId"
          :diagReloadData="diagReload"
        ></diagnosis>
      </template>
    </l-layout>
  </div>
</template>

<script>
import leftBar from "../../../components/leftBar.vue";
import { mapGetters } from "vuex";
import diagnosis from "@/views/public/diagnosis/index.vue";

export default {
  name: "",
  components: {
    leftBar,
    diagnosis
  },
  data() {
    return {
      tableLoading: false,
      toolBoxs: [
        "AuxiliaryDiagnosis",
        "patientFullAngle",
        "InspectionResults",
        "CheckResult",
        "HistoricalDiagnosis",
        "commonDiag",
        "diagTemplate",
        "PreviousPrescriptions",
        "Hotkey"
      ],
      tableData: [
        {
          orderNo: "12",
          OutpatientNo: "12121",
          name: "yangsir",
          moneyType: "自费",
          date: "2019-02-12",
          orderType: "专家门诊",
          doctor: "王医生",
          stateOn: "就诊",
          info: "紫外线过敏",
          state: "肾结石"
        }
      ],
      tableParams: [
        {
          prop: "orderNo",
          label: "排队号"
        },
        {
          prop: "OutpatientNo",
          label: "门诊号"
        },
        {
          prop: "name",
          label: "患者"
        },
        {
          prop: "moneyType",
          label: "费用类型"
        },
        {
          prop: "date",
          label: "挂号时间"
        },
        {
          prop: "orderType",
          label: "挂号类别"
        },
        {
          prop: "doctor",
          label: "就诊医生"
        },
        {
          prop: "stateOn",
          label: "就诊状态"
        },
        {
          prop: "info",
          label: "过敏信息"
        }
        /* {
            prop : 'state',
            label : '到诊状态'
          }*/
      ],
      // 诊断表格重新请求数据
      diagReload: true
    };
  },
  methods: {
    messageHandler() {
      this.diagReload = !this.diagReload;
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(n) {
        //数据变化 回调
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped></style>
