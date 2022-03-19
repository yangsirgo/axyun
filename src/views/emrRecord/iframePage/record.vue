<template>
  <div class="width100 height100">
    <LIframe
      displayMode="expand"
      v-bind="$attrs"
      :boxExpanded="true"
      :toolBoxs="toolBoxs"
      :editor="editor"
      :editorType="editorType"
      :visitType="modeType === 'menzhen' ? '01' : '04'"
      :defaultToolName="toolBoxs[0]"
      :refrehTree.sync="refrehTreeFlag"
      :refreshTemplateFlag="refreshTemplateFlag"
      @message="messageHandler"
      @selectTemplate="handleSelectTemplate"
      @showPop="handlePop"
      @createEmrByDefaultTemp="createEmrByDefaultTemp"
    >
      <template #content>
        <emr
          dnFlag="1"
          ref="emr"
          env="yun"
          :showTree="true"
          :mode="modeType"
          :showMrHomepage="showMrHomepage"
          v-bind="$attrs"
          v-on="$listeners"
          @fullScreen="fullScreenHandler"
          @showStructureTree="showStructureTree"
          @recordDataHandler="handlerRecordTreeObj"
        ></emr>
      </template>
    </LIframe>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import cnfDictionaryService from "@/api/wconf/cnfDictionary.js";

import emr from "../emr/opEmr.vue";
import LIframe from "./components/LIframe";

export default {
  name: "",
  components: {
    emr,
    LIframe
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cdss", ["CdssCode"]),
    modeType() {
      let path = this.$route.path;
      let code = "";
      if (path === "/cisOne/cisThree") {
        // 门诊
        code = "menzhen";
      } else if (path === "/hsDiagTreat/homeBedRecord/homeBedRecordPage") {
        // 家床
        code = "zhuyuan";
        this.toolBoxs[8] = "inpwAdvice";
      }
      this.setVisitType(code);
      return code;
    }
  },
  data() {
    return {
      editor: null,
      refrehTreeFlag: false,
      refreshTemplateFlag: false,
      showMrHomepage: false,
      editorType: "",
      toolBoxs: [
        "MrTemplate",
        "Phrase",
        "oldSystemRecord",
        "PastDocument",
        "ManagePlan",
        "HealthPrescribe",
        "InspectionResults",
        "CheckResult",
        "HistoricalDiagnosis",
        "PreviousOrder",
        "StructureTree",
        "MedicalExpression",
        "SpecialSymbol"
        //"knowledgeBase",
      ]
    };
  },
  created() {
    let { path } = this.$route.query;
    if (path === "ehr") {
      this.showMrHomepage = true;
    }
    this.$root.eventHub.$on("recordResize", this.handlerRecord);
    console.log(`this.$router`, this.$router);
    console.log(`this.$route`, this.$route);
    if (this.$route.name === "家床病历" || this.$route.name === "家庭病床") {
      this.toolBoxs = [
        "MrTemplate",
        "Phrase",
        "oldSystemRecord",
        "PastDocument",
        "ManagePlan",
        "HealthPrescribe",
        "InspectionResults",
        "CheckResult",
        "HistoricalDiagnosis",
        "PreviousOrder",
        "StructureTree",
        "MedicalExpression",
        "SpecialSymbol"
      ];
    }
  },
  mounted() {
    this.getCdssCode();
  },
  watch: {
    receivePatientData: {
      handler(newVal) {
        if (newVal && newVal.patientId) {
          this.refreshTemplateFlag = true;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions({
      setVisitType: "cis/setVisitType",
      changeRecPatientData: "base/changeRecPatientData"
    }),
    ...mapActions("cdss", ["setCdssCode"]),
    async getCdssCode() {
      console.log(`getCdssCode`);
      try {
        let hosId = JSON.parse(localStorage.getItem("pamars")).hosIdNum || "";
        let res = await cnfDictionaryService.getDictionaryInfo({
          catalogCode: "CIS_OUTAPTIENT_PARAMS",
          dicCode: "CIS_OUTAPTIENT_CDSS",
          hosId
        });
        console.log(`res******`, res);
        if (res.code === 1) {
          // this.cisCheckApplyData = res.data;
          console.log(`getCdssCode----`, res.data);
          this.setCdssCode(res.data.dictionaryValue);
          console.log(`this.CdssCode --- record`, res.data.dictionaryValue);
          let flagTemp = false;
          if (res.data.dictionaryValue == 0) {
            return;
          }
          for (let i = 0; i < this.toolBoxs.length; i++) {
            const el = this.toolBoxs[i];
            if (el === "CDSSComponent") {
              flagTemp = false;
              break;
            } else {
              flagTemp = true;
            }
          }
          if (flagTemp) {
            if (res.data.dictionaryValue == 1) {
              this.toolBoxs.unshift("CDSSComponent");
            } else {
              this.toolBoxs.splice(1, 0, "CDSSComponent");
            }
          }
        }
      } catch (error) {
        console.log(`error12345678`, error);
      }
    },
    fullScreenHandler(data) {
      if (data) {
        this.$postMsgToParent("fullScreen");
      } else {
        this.$postMsgToParent("exitFullscreen");
      }
    },
    handlerRecord() {
      return;
      // 2021-7-5修改 因为在opEmr中也监听了tab切换也调用了judgeRefreshDiagAndF方法，重复了，导致添加了2次，会出问题
      let insInfo = this.$refs.emr.insInfo;
      if (insInfo && insInfo.mrStaCd) {
        this.$refs.emr.judgeRefreshDiagAndF(insInfo.mrStaCd);
      }
    },
    saveHandler() {
      this.$refs.emr.callRefreshDiagnose("diagnoseOprate");
    },
    showStructureTree(instance) {
      this.editor = instance;
    },
    handlerRecordTreeObj(data) {
      this.editorType = data.editor || "";
    },
    messageHandler(data, res) {
      if (data === "insertCheckRes") {
        // 检验
        this.$refs.emr.insertinspection(res);
      } else if (data === "insertCheck") {
        // 检查
        this.$refs.emr.insertCheckRes(res);
      } else if (data === "insertPreviousFunc") {
        this.$refs.emr.insertPreviousFunc(res);
      } else if (data === "insertPrevious") {
        this.$refs.emr.insertPrevious(res);
      } else if (data === "insertDiagnoses") {
        this.$refs.emr.insertDiagnoses(res);
      } else if (data === "insertHistorical") {
        this.$refs.emr.insertHistorical(res);
      } else if (data === "pastDocumentClick") {
        this.$refs.emr.$refs.insTree.handleNodeClick(res);
        this.$refs.emr.$refs.insTree.pickUp();
      }
    },
    handleSelectTemplate(data) {
      this.$refs.emr.createByToolbox(data);
    },
    handlePop(editorContent, docData) {
      this.$refs.emr.showPopBox(editorContent, docData);
    },
    queryPatient(data) {
      this.$refs.emr.getPatientInfo({
        enNo: data.visitingNumber
      });
    },
    createEmrByDefaultTemp(obj) {
      this.$refs.emr.updateEditorHandler(obj);
    }
  },
  beforeDestroy() {
    this.$root.eventHub.$off("recordResize", this.handlerRecord);
  }
};
</script>

<style lang="scss" scoped></style>
