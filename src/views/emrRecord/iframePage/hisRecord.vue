<template>
  <div class="width100 height100">
    <LIframe
      displayMode="expand"
      :boxExpanded="true"
      :toolBoxs="toolBoxs"
      :editor="editor"
      visitType="01"
      @message="messageHandler"
      :defaultToolName="toolBoxs[0]"
      @parentMessage="parentMessageHandler"
    >
      <template #content>
        <div class="lEditorHeight" style="background-color: #fff;">
          <emr
            :showTree="true"
            :mode="modeType"
            @showStructureTree="showStructureTree"
            dnFlag="1"
            ref="emr"
          ></emr>
        </div>

        <div class="position-relative slideBar">
          <diagnostic
            class="diagnosticCls"
            @save="saveHandler"
            :diagnosticData="diagnosticData"
          ></diagnostic>
        </div>
      </template>
    </LIframe>
  </div>
</template>

<script>
import emr from "@/views/emr/opEmr.vue";
import { getPatientList } from "@/api/cis/patientList/index.js";
import { mapGetters, mapActions } from "vuex";
import diagnostic from "@/views/cis/prescriptionRecor/newPatientsManage/record/components/diagnostic.vue";
export default {
  name: "",
  components: {
    emr,
    diagnostic
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    modeType() {
      let path = this.$route.path;
      let code = "";
      if (path === "/his/record/") {
        // 门诊
        code = "menzhen";
      } else {
        // 家床
        code = "zhuyuan";
      }
      this.setVisitType(code);
      return code;
    }
  },
  create() {},
  data() {
    return {
      editor: null,
      diagnosticData: {},
      toolBoxs: [
        "MrTemplate",
        "Phrase",
        "StructureTree",
        "HistoricalDiagnosis",
        "PreviousOrder",
        "PastDocument",
        "InspectionResults",
        "CheckResult",
        "MedicalExpression",
        "SpecialSymbol"
        //"knowledgeBase"
      ]
    };
  },
  created() {
    this.$emit("message", {
      type: "ax-editor",
      data: {
        test: 123
      }
    });
    this.requestPatientData();
  },
  methods: {
    ...mapActions({
      setVisitType: "cis/setVisitType",
      changeRecPatientData: "base/changeRecPatientData"
    }),
    saveHandler() {},
    showStructureTree(instance) {
      this.editor = instance;
    },
    requestPatientData() {
      let data = {
        nm: "",
        visitingNumber: "",
        department: this.$store.getters.role.deptId || "",
        enTpCd: this.modeType
      };
      getPatientList(data)
        .then(resp => {
          if (resp.code === 1) {
            let patientObj = resp.data[0];
            if (patientObj) {
              let patientMsg = {
                patientId: patientObj.paId,
                patientName: patientObj.nm,
                visitCode: patientObj.visitingNumber,
                visitingTime: patientObj.visitingTime,
                triageStatus: patientObj.triageStatus,
                patientGender: patientObj.sexCd,
                patientAge: patientObj.age,
                ...patientObj
              };
              console.log(1221112);
              this.changeRecPatientData(patientMsg);
            }
          }
        })
        .catch(error => {
          this.$message.error(error.msg || error);
        });
    },
    messageHandler(data, res) {
      if (data === "insertCheckRes") {
        // 检验
        this.$refs.emr.insertinspection(res);
      } else if (data === "insertCheck") {
        // 检查
        this.$refs.emr.insertCheckRes(res);
      } else if (data === "insertPrevious") {
        this.$refs.emr.insertPrevious(res);
      } else if (data === "insertHistorical") {
        this.$refs.emr.insertHistorical(res);
      } else if (data === "pastDocumentClick") {
        this.$refs.emr.$refs.insTree.handleNodeClick(res);
        this.$refs.emr.$refs.insTree.pickUp();
      }
    },
    parentMessageHandler(res) {
      console.log("接受父组件传递的参数1122", res);
      let data = {
        nm: res.data.patientName,
        visitingNumber: res.data.visitingNumber
      };
      getPatientList(data)
        .then(resp => {
          this.changeRecPatientData(res.data);
        })
        .catch(error => {
          this.$message.error(error.msg || error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.recordPage {
  .width100.position-relative.content-180 {
    min-width: 810px;
  }
}

.lEditorHeight {
  height: calc(100% - 42px);
}
.slideBar {
  top: 42px;
}
</style>
