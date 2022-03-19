<template>
  <div class="width100 height100 wrapper">
    <l-layout :isToolBox="false" pageName="cis_order" patientCardType="default">
      <template #topSlot>
        <l-patient-details></l-patient-details>
      </template>
      <template #list>
        <left-bar></left-bar>
      </template>
      <template #content>
        <div
          class="height100"
          style="background-color: #fff"
          v-loading="loading"
        >
          <l-editor
            :path="editorPath"
            ref="lEditor"
            @messageHandler="messageHandler"
          />
        </div>
        <div class="position-relative">
          <diagnostic
            class="diagnosticCls"
            @save="saveHandler"
            :diagnosticData="diagnosticData"
            :hosType="1"
          ></diagnostic>
        </div>
      </template>
    </l-layout>
    <el-dialog
      title="报卡"
      :visible.sync="dialogVisibleBK"
      width="80%"
      :before-close="handleClose"
    >
      <infectious-card
        :baokaData="baokaData"
        @submitBK="submitBK"
        ref="infectiousCard"
      ></infectious-card>
      <!-- <span>这是一段信息</span> -->
      <span slot="footer" class="dialog-footer">
        <!-- <el-button  @click="dialogVisibleBK = false">取 消</el-button> -->
        <!-- <el-button type="primary"  @click="submitBK">提 交</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import leftBar from "../../../components/leftBar.vue";
import diagnostic from "./components/diagnostic.vue";
import LEditor from "@/components/LEditor.vue";
import {
  getPamars,
  getToken,
  getRoles,
  getRole,
  getUserName,
  getUserId
} from "@/utils/auth";
import { getServerConfig } from "@/utils/config";
import { mapActions, mapGetters } from "vuex";

import infectiousCard from "@/views/public/infectious/dialogMain.vue"; //报卡弹窗

export default {
  name: "",
  components: {
    leftBar,
    LEditor,
    diagnostic,
    infectiousCard
  },
  data() {
    let urlData = this.getUrlData();
    let editorPath = this.getEditorPath();
    // let editorPath = "http://192.168.198.50:9528/#/record/?env=yun_dev";
    return {
      dialogVisibleBK: false, // 报卡dialog
      baokaData: {},
      hosType: "1",
      loading: false,
      tableLoading: false,
      diagnosticData: {},
      editorPath: editorPath + "&params=" + urlData // 线上代码
      // editorPath: "http://192.168.198.38:9528/#/record/?params=" + urlData
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  mounted() {
    this.$root.$on("iframe_message", this.messageHandler);
    // this.loading = true;
  },
  methods: {
    changeCallBack() {
      let pData = {
        age: this.receivePatientData.patientAge,
        allergyName: this.receivePatientData.allergyName,
        // bedNumber: this.receivePatientData.bedNumber,
        birthday: this.receivePatientData.birthDate,
        // curMainDiCd: this.receivePatientData.curMainDiCd,
        // dateOfAdmission: this.receivePatientData.dateOfAdmission,
        // deliveryTime: this.receivePatientData.deliveryTime,
        department: this.receivePatientData.ouptDeptId,
        // enType: this.receivePatientData.enType,
        // hospitalizationNumber: this.receivePatientData.hospitalizationNumber,
        idNumber: this.receivePatientData.identificationNum,
        // mainDiagnosis: this.receivePatientData.mainDiagnosis,
        nm: this.receivePatientData.patientName,
        // operationTime: this.receivePatientData.operationTime,
        paId: this.receivePatientData.patientId,
        patientAge: this.receivePatientData.patientAge,
        patientGender: this.receivePatientData.patientGender,
        patientId: this.receivePatientData.patientId,
        patientName: this.receivePatientData.patientName,
        sexCd: this.receivePatientData.patientGender,
        sexNm: "",
        triageStatus: this.receivePatientData.recordStatus,
        visitCode: this.receivePatientData.visitCode,
        visitingNumber: this.receivePatientData.visitCode,
        visitingTime: this.receivePatientData.attendTime
      };
      // let obj = {
      //   age: "20",
      //   allergyName: "花粉过敏",
      //   bedNumber: "02",
      //   birthday: "1990-01-01 15:25:20",
      //   curMainDiCd: "A00.900",
      //   dateOfAdmission: "2020-01-14 18:00:46",
      //   deliveryTime: "2020-01-14 18:00:46",
      //   department: "92",
      //   enType: "01",
      //   hospitalizationNumber: "004",
      //   id: "4028448971f321f00171f321f22a0003",
      //   idNumber: "130121199103252817",
      //   mainDiagnosis: "霍乱",
      //   nm: "徐金楠",
      //   operationTime: "2020-01-14 18:00:46",
      //   paId: "2c180866dffe9fb016e00df67f80096",
      //   patientAge: "20",
      //   patientGender: "1",
      //   patientId: "2c180866dffe9fb016e00df67f80096",
      //   patientName: "徐金楠",
      //   sexCd: "1",
      //   sexNm: "男",
      //   triageStatus: "2",
      //   visitCode: "VC19121000011",
      //   visitingNumber: "VC19121000011",
      //   visitingTime: "2020-01-16 17:14:01"
      // };
      this.$nextTick(() => {
        // setTimeout(()=>{
        this.$refs.lEditor.send(pData);
        // },2000)
      });
      // this.loading = false;
    },
    saveHandler() {
      // this.$refs.emr.refreshDiagnose1();
    },
    messageHandler(data) {
      console.log("云医院收到数据1111：", data);
      this.changeCallBack();
    },
    getEditorPath() {
      return getServerConfig("EDITOR_PATH");
    },
    getUrlData() {
      try {
        var params = JSON.parse(getPamars());
        var token = getToken();
        var roles = getRoles();
        var role = getRole();
        var name = getUserName();
        var userId = getUserId();
        return encodeURIComponent(
          JSON.stringify({
            token,
            roles,
            role,
            name,
            userId,
            ...params
          })
        );
      } catch (error) {
        console.log("提取数据失败", error);
      }
    },
    // 报卡dialog
    dialogVisibleBKShow(data) {
      console.log("dialogVisibleBKShow", data);
      this.baokaData = data;
      this.dialogVisibleBK = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 提交报卡
    submitBK(data) {
      console.log("dialogVisibleBKShow", data);
      // this.$refs.infectiousCard.submitForm('ruleForm')
      // this.baokaData = data
      this.dialogVisibleBK = false;
    }
  },
  beforeDestroy() {
    this.$root.$off("iframe_message");
  },
  watch: {
    receivePatientData: {
      handler(n) {
        this.changeCallBack();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
