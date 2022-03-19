<template>
  <div class="HealthFIleIframe" ref="HealthFIleIframe">
    <div style="display:flex;">
      <el-input v-if="flag" v-model="url"></el-input>
      <el-button v-if="flag" @click="flag = false">隐藏input</el-button>
      <el-button v-if="flag" @click="init">init</el-button>
      <el-button v-if="flag" @click="updateBaseInfo">updateBaseInfo</el-button>
      <el-button v-if="flag" @click="goMedicalRecord"
        >goMedicalRecord</el-button
      >
    </div>
    <div
      v-show="isNull"
      class="center"
      :style="`width:100%;height: ${offsetHeight}px;border:none;`"
    >
      <div>
        当前患者未提供有效证件号，无健康档案数据。
      </div>
    </div>
    <iframe
      v-show="!isNull"
      ref="iframeTest"
      id="iframeTest"
      :style="`width:100%;height: ${offsetHeight}px;border:none;`"
      :src="url"
    ></iframe>
  </div>
</template>

<script>
import { getPamars } from "@/utils/auth";
import { getFrameUrlNew } from "@/api/third/third";
import { mapGetters, mapActions } from "vuex";
import { debounce } from "lodash/function";
export default {
  props: {
    iframeType: {
      type: String,
      default: ""
    },
    thirdData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      isNull: false,
      isUpdateIframe: false,
      flag: false,
      offsetHeight: 0,
      url: "",
      baseInfo: {},
      iframeDom: {},
      identificationType: "",
      identificationNum: "",
      baseUrl: ""
    };
  },
  computed: {
    ...mapGetters("base", ["PublicHealthPatientData"])
  },
  watch: {
    PublicHealthPatientData(newValue, oldValue) {
      console.log(
        `HealthFIleIframe-PublicHealthPatientData`,
        JSON.parse(JSON.stringify(newValue))
      );
      this.init();
    }
  },
  mounted() {
    this.init();
    this.iframeDom = this.$refs.iframeTest.contentWindow;
    console.log(`this.iframeDom`, this.iframeDom);
    window.addEventListener("message", this.receiveMessageFromIframePage);
  },
  methods: {
    ...mapActions({
      setPublicHealthPatientData: "base/setPublicHealthPatientData"
    }),
    reset() {
      console.log(`reset---`);
      this.url = "";
      this.init();
    },
    async init() {
      this.isNull = false;
      console.log(`this.$route`, this.$route.query.flag);
      if (this.$route.query.flag) {
        this.flag = true;
      }
      this.offsetHeight = this.$refs.HealthFIleIframe.offsetHeight;
      console.log(
        `this.PublicHealthPatientData`,
        JSON.parse(JSON.stringify(this.PublicHealthPatientData))
      );
      console.log(`object`, Object.keys(this.PublicHealthPatientData).length);
      if (Object.keys(this.PublicHealthPatientData).length === 0) {
        // this.$message.error("请先选择患者！");
        this.isNull = true;
        this.url = "";
        return;
      }
      this.identificationType = this.PublicHealthPatientData.identificationType;
      this.identificationNum = this.PublicHealthPatientData.identificationNum;
      this.patientName = this.PublicHealthPatientData.patientName;

      if (
        this.identificationNum === undefined ||
        this.identificationNum === ""
      ) {
        this.isNull = true;
        this.url = "";
        return;
      }
      console.log("HealthFIleIframe-Init");
      let postData = {
        identificationType: this.identificationType,
        identificationNum: this.identificationNum,
        identificationName: this.patientName
      };
      const res = await getFrameUrlNew(postData);
      console.log(`getFrameUrlNew`, res);
      const { url, baseInfo, hasArchive, username } = res.data;
      this.baseUrl = url;
      console.log(`baseInfo-----`, baseInfo);
      let pamars = JSON.parse(getPamars());
      let hosID = this.getHosId();
      if (baseInfo !== undefined) {
        this.baseInfo = baseInfo;
        this.baseInfo.orgCode = hosID;
        this.baseInfo.cardType = this.identificationType;
        this.baseInfo.idCard = this.identificationNum;
      }
      this.$nextTick(() => {
        if (this.iframeType === "" || this.iframeType === "healthFile") {
          console.log(`hasArchive`, hasArchive);
          if (hasArchive || this.isUpdateIframe) {
            this.url =
              url +
              `/archives?recordCode=${baseInfo.recordCode}&recordId=${baseInfo.recordId}&orgCode=${hosID}&employeeCode=${username}`;
            console.log(`公卫有档案------------`, this.url);
          } else {
            const {
              workUnit,
              mobileNum,
              contactName,
              contactMobileNum,
              houseHoldDetail,
              currentAddress,
              currentDetail
            } = this.PublicHealthPatientData;

            this.url =
              url +
              `/archives?orgCode=${hosID}&isTakeParams=${"1"}&identificationType=${
                this.identificationType
              }&identificationNum=${this.identificationNum}&name=${
                this.patientName
              }&workUnit=${workUnit}&mobileNum=${mobileNum}&contactName=${contactName}&contactMobileNum=${contactMobileNum}&houseHoldDetail=${houseHoldDetail}&currentAddress=${currentAddress}&currentDetail=${currentDetail}&employeeCode=${username}`;
            console.log(`公卫无档案------------`, this.url);
          }
        } else {
          switch (this.iframeType) {
            case "older":
              this.url =
                url +
                `/${this.iframeType}?recordCode=${baseInfo.recordCode}&orgCode=${hosID}`;
              break;
            case "hypertension":
              this.url =
                url +
                `/${this.iframeType}?cdId=${baseInfo.hypertensionCdId}&orgCode=${hosID}`;
              break;
            case "diabetics":
              this.url =
                url +
                `/${this.iframeType}?cdId=${baseInfo.diabetesCdId}&orgCode=${hosID}`;
              break;
            case "signature":
              this.url =
                url +
                `/${this.iframeType}?contractId=${baseInfo.contractId}&patientId=${baseInfo.patientId}&orgCode=${hosID}`;
              break;

            default:
              break;
          }
        }
        this.isUpdateIframe = false;
      });
      console.log(` this.url`, this.url);
    },
    receiveMessageFromIframePage(event) {
      console.log("receiveMessageFromIframePage");
      // 来自于iframe的传值
      let data = event.data;
      // console.log(`data`, data);
      //iframe已初始化
      if (event && data.eventName === "initIframe") {
        console.log("iframe已初始化");
        this.sendMsgToIframe("initIframeData", {
          baseInfo: this.baseInfo //患者基础信息
        });
      }
      // 变更iframe地址
      if (event && data.eventName === "changeIframeUrl") {
        console.log(`changeIframeUrl`, data);
        //新iframeUrl地址
        this.url = data.params.iframeUrl;
      }
      if (event && data.eventName === "updateIframe") {
        //更新 iframe
        // console.log(`data`, data);
        // let hosID = this.getHosId();
        // this.url =
        //   this.baseUrl +
        //   `/archives?recordCode=${data.data.recordCode}&recordId=${data.data.recordId}&orgCode=${hosID}`;
        // console.log(`更新 iframe------------`, this.url);
        // this.sendMsgToIframe("initIframeData", {
        //   baseInfo: this.baseInfo //患者基础信息
        // });
        // this.updateBaseInfo();
        this.updateIframe();
      }
      // 关闭iframe弹窗
      if (event && data.eventName === "closeIframeDialog") {
        this.cancelIframe();
      }
      // dom实例化
      if (event && data.eventName === "DOMInitSuccess") {
      }
      // dom实例化
      if (event && data.eventName === "hypertensionFollow") {
        this.goMedicalRecord();
      }
      // 更新baseInfo数据
      if (event && data.eventName === "updateBaseInfo") {
        console.log("updateBaseInfo", data);
        this.updateBaseInfo();
      }
    },
    getHosId() {
      let pamars = JSON.parse(getPamars());
      let hosID = "";
      if (pamars.hosId.slice(0, 1) === "H") {
        hosID = pamars.hosId.slice(20, 33);
      } else {
        hosID = pamars.hosIdNum.slice(20, 33);
      }
      return hosID;
    },
    goMedicalRecord() {
      console.log(`goMedicalRecord`);
      this.$emit("goMedicalRecord");
    },
    updateBaseInfo() {
      setTimeout(() => {
        console.log(`updateBaseInfo`);
        this.$emit("updateBaseInfo");
      }, 5000);
    },
    // updateBaseInfo: debounce(function() {
    // }, 5000),
    updateIframe: debounce(function() {
      this.init();
      this.updateBaseInfo();
    }, 5000),
    // updateBaseInfo() {},
    cancelIframe() {
      console.log(`cancelIframe`);
      this.$emit("cancelIframe");
    },
    sendMsgToIframe(eventName, params) {
      console.log(`sendMsgToIframe`);
      console.log(`eventName`, eventName);
      console.log(`params`, params);
      this.iframeDom.postMessage(
        {
          eventName: eventName,
          params: params
        },
        "*"
      );
    }
  },
  beforeDestroy() {
    this.url = "";
    this.baseInfo = {};
    this.iframeDom = {};
    this.identificationType = "";
    this.identificationNum = "";
    this.baseUrl = "";
    console.log("卸载 removeEventListener message");
    window.removeEventListener("message", this.receiveMessageFromIframePage);
  }
};
</script>

<style lang="scss" scoped>
.HealthFIleIframe {
  height: 100%;
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    font-size: 20px;
    color: #303133;
  }
}
</style>
