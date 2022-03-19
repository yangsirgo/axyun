<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      :editor="editor"
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
        <!-- <emr
          :showTree="true"
          dnFlag="1"
          :showMrHomepage="true"
          @showStructureTree="showStructureTree"
        ></emr> -->
      </template>
    </l-layout>
  </div>
</template>

<script>
import leftBar from "@/views/ipnw/medicalAdvice/components/leftBar.vue";
import { mapGetters } from "vuex";
// import emr from "@/views/emr/opEmr.vue";

export default {
  name: "",
  components: {
    leftBar,
    // emr
  },
  data() {
    return {
      tableLoading: false,
      toolBoxs: [],
      editor: null,
      showTreeFlag: true
    };
  },
  methods: {
    messageHandler() {
      console.log("工具箱消息");
    },
    showStructureTree(instance) {
      this.editor = instance;
      this.showTreeFlag = false;
      this.showTreeFlag = true;
      this.toolBoxs = [
        "MrTemplate",
        "Phrase",
        "StructureTree",
        "AuxiliaryDiagnosis",
        "InspectionResults",
        "CheckResult",
        "HistoricalDiagnosis",
        "PreviousPrescriptions",
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

<style lang='scss' scoped>
</style>


