<template>
  <div class="height100">
    <div
      class="lEditorHeight"
      v-loading="loading"
    >
    <emr-record
      ref="emrRecord"
      @updateDiagnoseList="updateDiagnoseList"
      @openDiagnoseHandler="openDiagnoseHandler"
      @closeDiagnoseHandler="closeDiagnoseFunc"
      @jumpElePrescription="jumpElePrescription"
    />
    <div class="position-relative slideBar">
      <diagnostic
        ref="diagnostic"
        class="diagnosticCls"
        :diagnosticData="diagnosticData"
        :hosType="1"
        @save="saveHandler"
      ></diagnostic>
    </div>
  </div>
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">


      <el-tab-pane label="模板列表" name="first">
        <create-emr-tab
          ref="createEmr"
          :isHome="isHome"
          :visitType="modeType === 'zhuyuan' ? '04' : '01'"
          :dnFlag="dnFlag"
          :classValMsg="classValMsg"
          @updateEditor="updateEditor"
        ></create-emr-tab>
      </el-tab-pane>
      <el-tab-pane label="文书书写" name="second">
        <div
          class="lEditorHeight"
          v-click-outside="onClickOutside"
          v-loading="loading"
        >
          <emr-record
            ref="emrRecord"
            @updateDiagnoseList="updateDiagnoseList"
            @openDiagnoseHandler="openDiagnoseHandler"
            @closeDiagnoseHandler="closeDiagnoseFunc"
            @jumpElePrescription="jumpElePrescription"
          />
          <div class="position-relative slideBar">
            <diagnostic
              ref="diagnostic"
              class="diagnosticCls"
              :diagnosticData="diagnosticData"
              :hosType="1"
              @save="saveHandler"
            ></diagnostic>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs> -->


    <!-- <el-dialog
      title="传染性疾病报卡"
      :visible.sync="dialogVisibleBK"
      width="80%"
      :before-close="handleClose"
    >
      <infectious-card
        :baokaData="baokaData"
        @submitBK="submitBK"
        ref="infectiousCard"
      ></infectious-card>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog> -->
    <el-dialog
      width="80%"
      top="10px"
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="handleClose"
      title="传染性疾病报卡"
      :visible.sync="dialogVisibleBK"
    >
      <baokaForm
        ref="infectiousCard"
        :baokaFormData="baokaFormData"
        @submitBK="submitBK"
      ></baokaForm>
    </el-dialog>
    <el-dialog
      title="食源性疾病报卡"
      :visible.sync="dialogVisibleBKStyle"
      width="80%"
      :before-close="handleCloseStyle"
    >
      <mainA
        :baokaData="baokaData"
        @submitBK="submitBKStyle"
        ref="mainA"
        style="height: 600px"
      ></mainA>
      <!-- <span slot="footer" class="dialog-footer"> </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import createEmrTab from "@/views/emrRecord/emr/component/createEmrTab";
import diagnostic from "@/views/cis/prescriptionRecor/newPatientsManage/record/components/diagnostic.vue";
import emrRecord from "@/views/emrRecord/iframePage/record.vue";
import infectiousCard from "@/views/public/infectious/dialogMain.vue"; //报卡弹窗
import mainA from "@/views/public/infectious/mainA.vue"; //食原型报卡弹窗
import baokaForm from "@/views/public/infectious/module/baokaForm.vue";
import baokaMixin from "@/views/public/infectious/mixins/baokaMixin.js";

export default {
  name: "record",
  components: {
    emrRecord,
    diagnostic,
    infectiousCard,
    mainA,
    createEmrTab,
    baokaForm
  },
  mixins: [baokaMixin],
  data() {
    return {
      dialogVisibleBK: false, // 报卡dialog
      dialogVisibleBKStyle: false, //食源性报卡
      baokaData: {},
      loading: false,
      tableLoading: false,
      diagnosticData: {},
      activeName: "second",
      isHome: "0",
      modeType: "menzhen",
      dnFlag: "1",
      classValMsg: "",
    };
  },
  inject: {
    tabName: {
      default: () => {
        return () => {};
      }
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    // 判断点击tab
    tabOldName() {
      return this.tabName();
    }
  },
  mounted() {
    this.$root.eventHub.$on("jump-template-change", this.jumpTabName);
    document.body.addEventListener('click', this.listenBodyClick)
  },
  methods: {
    listenBodyClick(e) {
      const isLEditorHeight = $(e.target).parents('.lEditorHeight') && $(e.target).parents('.lEditorHeight').length;
      if (!isLEditorHeight && e.target.tagName !== 'BODY') {
        this.closeDiagnoseHandler();
      }
    },
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    jumpTabName(name) {
      this.activeName = name;
      if (name === 'first') {
        // this.$refs.createEmr.activeName = 'template'
        this.$emit('jump-to-recordHistory')
      }
    },
    updateEditor(obj) {
      this.activeName = "second";
      this.$nextTick(() => {
        this.$refs.emrRecord.$refs.emr.updateEditorHandler(obj);
        this.$root.eventHub.$emit("recordResize");
      });
    },
    handleClick(tab) {
      if (tab.name === "second") {
        this.$nextTick(() => {
          this.$root.eventHub.$emit("recordResize");
          // 调用诊断和处方数据
          let insInfo = this.$refs.emrRecord.$refs.emr.insInfo;
          if (insInfo && insInfo.mrStaCd) {
            this.$refs.emrRecord.$refs.emr.judgeRefreshDiagAndF(
              insInfo.mrStaCd
            );
            this.$refs.emrRecord.$refs.emr.reacordModelAndToolsStatusHandler()
          }
        });
      }
    },
    onClickOutside(e) {
      if (this.tabOldName === "record") {
        this.closeDiagnoseHandler();
      }
    },
    openDiagnoseHandler(isDiagonstic) {
      this.isDiagonstic = isDiagonstic
      this.$refs.diagnostic.diagnosticHandler(true);
    },
    closeDiagnoseFunc() {
      document.getElementsByClassName("el-popper").forEach(element => {
        element.style.display = "none";
      });
      this.closeDiagnoseHandler();
    },
    closeDiagnoseHandler() {
      try {
        this.$refs.diagnostic.diagnosticHandler(false);
      } catch (error) {
        
      }
      
    },
    async updateDiagnoseList() {
      // 更新诊断组件来获取最新诊断数据
      await this.$refs.diagnostic.queryCurrentDiag();
      // 刷新文书的诊断
      this.saveHandler();
    },
    jumpElePrescription() {
      this.$emit("jumpPrescription");
    },
    //重置Diagnostic 组件
    resetDiagnostic() {
      this.$refs.diagnostic.resetAndReload();
    },
    saveHandler() {
      this.$refs.emrRecord.saveHandler();
    },
    // 报卡dialog
    dialogVisibleBKShow(data) {
      this.baokaData = data;
      this.dialogVisibleBK = true;
    },
    dialogVisibleBKShowStyle(data) {
      this.baokaData = data;
      this.dialogVisibleBKStyle = true;
    },
    handleCloseStyle(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 提交报卡
    submitBK(data, flag) {
      if(!flag) {
        this.dialogVisibleBK = false;
      }
    },
    submitBKStyle(data) {
      this.dialogVisibleBKStyle = false;
    }
  },
  beforeDestroy() {
    this.$root.eventHub.$off("jump-template-change", this.jumpTabName);
    document.body.removeEventListener('click', this.listenBodyClick)
  }
};
</script>

<style scoped lang="scss">
.lEditorHeight {
  height: calc(100% - 42px);
}

.slideBar {
  top: 42px;
}

/deep/ .el-tabs {
  height: 100%;
}
/deep/.el-tabs__header {
  padding-left: 16px;
  border-bottom: 1px solid #f0f0f0;
}
</style>
