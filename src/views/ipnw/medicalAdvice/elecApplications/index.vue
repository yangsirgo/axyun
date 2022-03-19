<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      pageName="electronApply"
      patientCardType="hospital"
      @message="messageHandler"
      hosType="3"
      :ele-type="2"
    >
      <template #list>
        <left-bar></left-bar>
      </template>
      <template #content>
        <electron-apply ref="electronApply" hosType="3" :ele-type="2" :choose="temShowData"></electron-apply>
      </template>
    </l-layout>
  </div>
</template>

<script>
import leftBar from "../components/leftBar.vue";
import { mapGetters } from "vuex";
import electronApply from "@/views/public/electronApply/applyindex.vue";

export default {
  name: "",
  components: {
    leftBar,
    electronApply
  },
  data() {
    return {
      tableLoading: false,
      toolBoxs: ["checkTemp", "AuxiliaryDiagnosis", "Hotkey"],
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
        },
        {
          prop: "state",
          label: "到诊状态"
        }
      ],
      temShowData: ""
    };
  },
  methods: {
    messageHandler(val) {
      this.temShowData = val;
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  // watch: {
  //   "receivePatientData":{//深度监听，可监听到对象、数组的变化
  //     handler(n){
  //       /* type:0 表示门诊*/
  //       let applyParams = {"id": n.triageAppointmentId, type: "0", "patientNum": n.patientNum};
  //       this.$refs.electronApply.setPatientInfo(applyParams);
  //     },
  //     immediate: true,
  //     deep:true
  //   }
  // },
  mounted() {
    /* type:0 表示门诊*/
    // let applyParams = {"id": "", type: "0"};
    // this.$refs.electronApply.initApply(applyParams);
  }
};
</script>

<style lang="scss" scoped></style>
