<template>
  <div class="width100 height100">
    <l-layout
      v-if="showTreeFlag"
      :editor="editor"
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      visitType="04"
      dnFlag="1"
      patientCardType="hospital"
      @message="messageHandler"
      hosType="3"
    >
      <template #list>
        <left-bar></left-bar>
      </template>
      <template #content>
        <l-emr :showTree="true" @showStructureTree="showStructureTree" dnFlag="1" ref="emr"></l-emr>
      </template>
    </l-layout>
  </div>
</template>

<script>
import leftBar from "../components/leftBar.vue";
import { mapGetters } from "vuex";

export default {
  name: "",
  components: {
    leftBar,
  },
  data() {
    return {
      editor: null,
      showTreeFlag: true,
      tableLoading: false,
      toolBoxs: [
        "AuxiliaryDiagnosis",
        "InspectionResults",
        "CheckResult",
        "HistoricalDiagnosis",
        "PreviousOrder"
      ]
    };
  },
  methods: {
    messageHandler() {
      if (data === "insertCheckRes") {
        // 检验
        this.$refs.emr.insertinspection(res);
      } else if (data === "insertCheck") {
        // 检查
        this.$refs.emr.insertCheckRes(res);
      }
    },
    showStructureTree(instance) {
      this.editor = instance;
      this.showTreeFlag = false;
      this.showTreeFlag = true;
      this.toolBoxs = [
        "Phrase",
        "StructureTree",
        "AuxiliaryDiagnosis",
        "InspectionResults",
        "CheckResult",
        "HistoricalDiagnosis",
        "PreviousOrder",
        "MedicalExpression",
        "SpecialSymbol"
      ];
    }
  },
  beforeRouteLeave(to, from, next) {
    next(false);
    if (this.editor && this.editor.execCommand("ismodified")) {
      //let content = this.editor.getContent()
      this.$confirm("病历未保存，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //this.save(content)
        next();
      });
    } else {
      next();
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

<style lang="scss" scoped></style>
