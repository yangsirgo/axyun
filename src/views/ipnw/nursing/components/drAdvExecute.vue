<template>
  <l-layout
    :toolBoxs="toolBoxs"
    :defaultToolName="toolBoxs[0]"
    :boxExpanded="true"
    patientCardType="hospital"
    pageName="drAdvExecute"
    @message="messageHandler"
    hosType="3"
  >
    <template #list>
      <left-bar type="hos" :Multiple="isMultiple"></left-bar>
    </template>
    <template #content>
      <div class="height100 container1">
        <el-card class="height100 main-content">
          <el-tabs v-model="activeName" class="main" @tab-click="handleClickMain">
            <el-tab-pane label="皮试执行" name="first"></el-tab-pane>
            <el-tab-pane label="输液执行" name="second"></el-tab-pane>
            <el-tab-pane label="肌注执行" name="third"></el-tab-pane>
            <el-tab-pane label="费用执行" name="fourth"></el-tab-pane>
          </el-tabs>
          <div class="component-box">
            <component :is="coms"></component>
          </div>
        </el-card>
      </div>
    </template>
  </l-layout>
</template>

<script>
import SkinTestExecute from "./skinTest";
import InfusionExecute from "./infusionExecute";
import IntramuscularExecute from "./intramuscularExecute";
import CostExecute from "./costExecute";
import Tools from "@/views/public/tools/index";
import { mapGetters } from "vuex";
import LeftBar from "../../components/nursingLeftBar";
export default {
  name: "drAdvExecute",
  components: {
    SkinTestExecute,
    InfusionExecute,
    IntramuscularExecute,
    CostExecute,
    Tools,
    LeftBar
  },
  computed: {
    ...mapGetters(["receivePatientDatas"])
  },
  data() {
    return {
      isMultiple: false,
      coms: "SkinTestExecute", // 当前显示组件
      formParams: [
        "technicalOffices",
        "illnessArea",
        "patientsType",
        "patientsState",
        "search"
      ], // 左侧搜索条件
      // 患者列表查询条件
      patientsSearchForm: {},
      toolBoxs: ["PreviousPrescriptions", "Hotkey"],

      activeName: "first",

      rightWidth: "52", // 工具栏收起显示, 工具栏收起宽度：52 放出宽度： 289
      modules: [
        "PrescriptionTemplete",
        "PreviousPrescriptions",
        "InspectionResults",
        "CheckResult",
        "HistoricalDiagnosis",
        "Knowledge"
      ]
    };
  },
  methods: {
    handleClick() {
      // tab 的切换方法
    },
    search(form) {
      // 查询方法
      this.patientsSearchForm = form;
      this.$refs.patients.getPatientList(form);
    },
    readCard() {
      // 读卡方法
    },
    handleClickMain() {
      // 切换tab
      if (this.activeName == "first") {
        this.isMultiple = false;
      } else {
        this.isMultiple = true;
      }
      if (this.activeName == "second") {
        this.toolBoxs = ["TreatmentInfoBox", "SpecialSymbol", "Hotkey"];
      } else {
        this.toolBoxs = ["TreatmentInfoBox", "Hotkey"];
      }
      switch (this.activeName) {
        case "first":
          this.coms = "SkinTestExecute";
          break;
        case "second":
          this.coms = "InfusionExecute";
          break;
        case "third":
          this.coms = "IntramuscularExecute";
          break;
        case "fourth":
          this.coms = "CostExecute";
          break;
      }
    },
    toolBoxMessage(moduleName, data) {
      if (moduleName != "PreviousPrescriptions") {
        return;
      }
    },
    toggle(val) {
      this.rightWidth = val ? "289" : "52";
    },
    messageHandler() {
      consle.log("工具箱消息");
    }
  }
};
</script>

<style lang="scss" scoped>
$rightWidth: 305px;
.container1 {
  overflow: hidden;
  /*min-width: 1024px;
    padding-right: $rightWidth;*/
}
.main-content {
  height: 100%;
  width: 100%;
  float: left;
}
/deep/ .el-tabs__content {
  height: calc(100% - 40px) !important;
}
/deep/ .main > .el-tabs__header {
  padding-left: 10px;
  margin-bottom: 0;
  // border-bottom: 1px solid $l-color-bgcolor-11;
}
/deep/ .search-box {
  .el-checkbox {
    margin-right: 10px;
  }
  .el-checkbox__label {
    padding-left: 6px;
  }
}
.component-box {
  height: calc(100% - 40px);
}
</style>
