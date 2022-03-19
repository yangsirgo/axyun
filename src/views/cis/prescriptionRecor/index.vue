<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="layoutObjec.toolBoxs"
      :defaultToolName="layoutObjec.toolBoxs[0]"
      :isToolBox="layoutObjec.isToolBox"
      :boxExpanded="false"
      patientCardType="default"
      :pageName="layoutObjec.pageName"
      :templateType="temType"
      @message="messageHandler"
      :ele-type="1"
      hosType="1"
    >
      <template #list>
        <left-bar ref="leftBar"></left-bar>
      </template>

      <template #content>
        <div class="bg-contain width100 height100">
          <div class="patient-card">
            <!-- <l-patient-card
              :patientName="receivePatientData.patientName"
              :patientAge="receivePatientData.patientAge"
              :patientGender="receivePatientData.patientGender"
            >
              <patient-basic-info :patientInfo="patientInfoShow"></patient-basic-info>
              <div class="patientInfo-left padding-left-16">
                <div class="patientInfo-left-a">
                <span class="diagName overflowEllipsis" :title="patientInfoShow.diagName">{{ patientInfoShow.diagName }}</span>
                <span class="allergyName margin-left-8 overflowEllipsis" :title="patientInfoShow.allergyName">{{ patientInfoShow.allergyName }}</span>
                </div>
                <div  class="patientInfo-left-b">
                <el-button
                  class="button"
                  round
                  @click="getHealthRecords"
                  v-if="patientInfoShow.patientAge"
                >调阅健康档案</el-button>
                </div>
              </div>
            </l-patient-card> -->
            <patientDetail
              ref="patientDetail"
              :patientData="patientInfoShow"
              :detailList="detailList"
              @changeTabName="changeTabName()"
            ></patientDetail>
          </div>
          <div class="m-contain">
            <div class="top-con height100">
              <div class="top-con-tab height100">
                <tab-wrapper
                  @updateBaseInfo="updateBaseInfo"
                  @tab-change="tabChange"
                  @toolBoxsChange="toolBoxsChange"
                  @loadPatientData="loadPatientData"
                  ref="tabWrapper"
                ></tab-wrapper>
              </div>
            </div>
          </div>
        </div>
      </template>
    </l-layout>
    <!-- 新建档案 start -->
    <el-dialog
      title="查看健康档案"
      width="85%"
      height="95%"
      :visible.sync="readTheStyle"
      v-if="readTheStyle"
      @open="openstyle"
      :close-on-click-modal="false"
    >
      <fillingAndChangeEhr
        ref="readTheStyleRef"
        :readTheDataList="receivePatientData"
        v-if="readTheStyle"
      >
      </fillingAndChangeEhr>
      <span slot="footer" class="dialog-footer">
        <el-button @click="readTheStyle = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 新建档案 end refsChild -->
  </div>
</template>

<script>
import patientDetail from "./components/patientDetail";
import tabWrapper from "@/views/cis/prescriptionRecor/tabWrapper.vue";
import leftBar from "@/views/cis/components/newLeftBarNew.vue";
import fillingAndChangeEhr from "@/views/eHrArchives/eHrArchivesindex/fillingAndChangeEhr.vue";
import { mapActions, mapGetters } from "vuex";
import { deepClone } from "@/utils";
import {
  getPatients,
  receive,
  findAllergy,
  finish,
  getDiaByClinicType,
  selectPatientBySth,
  cardReading
} from "@/api/cis/visit/visit";

export default {
  name: "index",
  components: {
    leftBar,
    fillingAndChangeEhr,
    tabWrapper,
    patientDetail
  },
  data() {
    return {
      readTheStyle: false,
      patientInfoShow: {},
      temType: "",
      layoutObjec: {
        //默认 诊断病历页面
        toolBoxs: [],
        pageName: "record",
        boxExpanded: false,
        isToolBox: false
      },
      //患者信息条右侧区域
      detailList: []
    };
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      seteHrData: "ehr/seteHrData",
      setReloadKey: "base/changeSearchAgainKey", //刷新左侧患者列表
      changeChangeTabsShowQuote: "cis/changeChangeTabsShowQuote" // 切换为诊断tab时，要更新右侧工具箱诊断模板的"引用"按钮显示出来
    }),
    updateBaseInfo() {
      console.log("健康档案-----", this.$refs.patientDetail);
      this.$refs.patientDetail.updateBaseInfo();
    },
    toolBoxsChange(pageName, boxsList) {
      this.layoutObjec.toolBoxs = boxsList;
    },
    changeTabName() {
      console.log(this.$refs.tabWrapper);
      this.$refs.tabWrapper.changeIframeUrl();
    },
    async loadPatientData() {
      if (this.$refs.leftBar.activeName != "third") {
        this.$refs.leftBar.activeName = "third";
        await this.$refs.leftBar.loadData();
        // console.log("选中患者了而乐乐乐乐饿了乐乐");
        this.$refs.leftBar.chsePtrateWrapperHandler(this.receivePatientData);
      }
    },
    messageHandler(val) {
      this.$nextTick(() => {
        // console.log("父组件 messageHandler");
        this.$refs.tabWrapper.messageHandler(val);
      });
    },
    openstyle() {},
    getHealthRecords() {
      let eHrData = {
        patientArchiveInfoVO: this.receivePatientData
      };
      this.seteHrData(eHrData).then(() => {
        this.readTheStyle = true;
      });
    },
    async finishClinic() {
      // 是否有诊断校验
      let rep = await getDiaByClinicType({
        visitCode: this.receivePatientData.visitCode
      });
      if (rep.code === 1 && rep.data.length === 0) {
        this.$confirm("", "", {
          showClose: "false",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: "true",
          message: "未填写诊断，是否继续？",
          type: "warning"
        })
          .then(() => {
            finish(this.receivePatientData)
              .then(res => {
                this.changeRecPatientData(res.data);
                this.$message.success("结束就诊成功");
                this.setReloadKey(+new Date()); // 更新 vuex 里的 ReloadKey  使最下测 模块刷新
              })
              .catch(() => {
                this.$message.error("结束就诊失败");
              });
          })
          .catch(() => {
            this.$message.warning("已取消");
          });
      } else {
        finish(this.receivePatientData)
          .then(res => {
            this.changeRecPatientData(res.data);
            this.$message.success("结束就诊成功");
            this.setReloadKey(+new Date()); // 更新 vuex 里的 ReloadKey  使最下测 模块刷新
          })
          .catch(() => {
            this.$message.error("结束就诊失败");
          });
      }
    },
    tabChange(tab) {
      let pageName = tab.name;
      // console.log('this.changeChangeTabsShowQuote============')
      this.changeChangeTabsShowQuote(pageName);
      switch (pageName) {
        case "record":
          this.layoutObjec = {
            //默认 诊断病历页面
            toolBoxs: [],
            pageName: tab.name,
            boxExpanded: false,
            isToolBox: false
          };
          break;
        case "rightTreat":
          this.layoutObjec = {
            //默认 诊断病历页面
            toolBoxs: [
              "AuxiliaryDiagnosis",
              "InspectionResults",
              "CheckResult",
              "HistoricalDiagnosis",
              "commonDiag",
              "PreviousPrescriptions"
            ],
            pageName: tab.name,
            boxExpanded: false,
            isToolBox: true
          };
          break;
        case "order":
          this.layoutObjec = {
            //默认 诊断病历页面
            toolBoxs: [
              // "drugInfo",
              "commonDrug",
              "prescriptionTemp",
              // "PreviousPrescriptions",
              // "HistoricalDiagnosis",
              "Hotkey"
            ],
            pageName: tab.name,
            boxExpanded: false,
            isToolBox: true
          };
          let flagTemp = false;
          if (this.CdssCode == 0) {
            return;
          }
          for (let i = 0; i < this.layoutObjec.toolBoxs.length; i++) {
            const el = this.layoutObjec.toolBoxs[i];
            if (el === "CDSSComponent") {
              flagTemp = false;
              break;
            } else {
              flagTemp = true;
            }
          }
          console.log(`this.CdssCode --- order`, this.CdssCode);
          if (flagTemp) {
            if (this.CdssCode == 1) {
              this.layoutObjec.toolBoxs.unshift("CDSSComponent");
            } else {
              this.layoutObjec.toolBoxs.splice(1, 0, "CDSSComponent");
            }
          }

          break;
        case "electronApply":
          this.layoutObjec = {
            //默认 诊断病历页面
            toolBoxs: ["HistoricalDiagnosis", "Hotkey"],
            pageName: tab.name,
            boxExpanded: false,
            isToolBox: true
          };
          if (this.CdssCode == 0) {
            return;
          }
          let flagTemp2 = false;
          for (let i = 0; i < this.layoutObjec.toolBoxs.length; i++) {
            const el = this.layoutObjec.toolBoxs[i];
            if (el === "CDSSComponent") {
              flagTemp2 = false;
              break;
            } else {
              flagTemp2 = true;
            }
          }
          console.log(`this.CdssCode --- electronApply`, this.CdssCode);
          if (flagTemp2) {
            if (this.CdssCode == 1) {
              this.layoutObjec.toolBoxs.unshift("CDSSComponent");
            } else {
              this.layoutObjec.toolBoxs.splice(1, 0, "CDSSComponent");
            }
          }
          break;
        case "consultation":
          this.layoutObjec = {
            //默认 诊断病历页面
            toolBoxs: [
              "AuxiliaryDiagnosis",
              // "patientFullAngle",
              "InspectionResults",
              "CheckResult",
              "commonDiag"
            ],
            pageName: tab.name,
            boxExpanded: false,
            isToolBox: true
          };
          break;
        case "diagnosis":
          this.layoutObjec = {
            //默认 诊断病历页面
            toolBoxs: [
              // "AuxiliaryDiagnosis",
              // "patientFullAngle",
              // "InspectionResults",
              // "CheckResult",
              "HistoricalDiagnosis",
              "commonDiag",
              "diagTemplate",
              // "PreviousPrescriptions",
              "Hotkey"
            ],
            pageName: tab.name,
            boxExpanded: false,
            isToolBox: true
          };
          let flagTemp1 = false;
          if (this.CdssCode == 0) {
            return;
          }
          for (let i = 0; i < this.layoutObjec.toolBoxs.length; i++) {
            const el = this.layoutObjec.toolBoxs[i];
            if (el === "CDSSComponent") {
              flagTemp1 = false;
              break;
            } else {
              flagTemp1 = true;
            }
          }
          console.log(`this.CdssCode --- diagnosis`, this.CdssCode);
          if (flagTemp1) {
            if (this.CdssCode == 1) {
              this.layoutObjec.toolBoxs.unshift("CDSSComponent");
            } else {
              this.layoutObjec.toolBoxs.splice(1, 0, "CDSSComponent");
            }
          }
          break;
        case "allergy":
          this.layoutObjec = {
            //默认 诊断病历页面
            toolBoxs: [
              "allergyDrugInfo",
              // "AuxiliaryDiagnosis",
              // "patientFullAngle",
              // "InspectionResults",
              // "CheckResult",
              // "HistoricalDiagnosis",
              // "commonDiag",
              // "PreviousPrescriptions",
              "Hotkey"
            ],
            pageName: tab.name,
            boxExpanded: false,
            isToolBox: true
          };
          break;
        case "critical":
          this.layoutObjec = {
            //默认 诊断病历页面
            toolBoxs: [
              "AuxiliaryDiagnosis",
              // "patientFullAngle",
              "InspectionResults",
              "CheckResult",
              // "HistoricalDiagnosis",
              "commonDiag",
              "PreviousPrescriptions",
              "Hotkey"
            ],
            pageName: tab.name,
            boxExpanded: false,
            isToolBox: true
          };
          break;
        case "leaveCard":
          this.layoutObjec = {
            //默认 诊断病历页面
            toolBoxs: ["historicalSickLeave"],
            pageName: tab.name,
            boxExpanded: false,
            isToolBox: true
          };
          break;
        case "HealthFIleIframe":
          this.layoutObjec = {
            //默认 诊断病历页面
            toolBoxs: [],
            pageName: tab.name,
            boxExpanded: false,
            isToolBox: false
          };
          break;
      }
    },
    updateDiagName(name) {
      // this.$set(this.detailList[0], "name", name);
    }
  },
  created() {
    console.log("组件实例化之前");
    setTimeout(() => {
      this.changeRecPatientData({}); // 目的是为了进入此二级菜单后，清除之前的患者vuex信息
    }, 1000);
  },
  mounted() {
    // this.$root.$on("updateDiagName", this.updateDiagName);
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cdss", ["CdssCode"])
  },
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      handler(a) {
        console.log(a);
        let data = deepClone(a);
        // 出生年月日 去掉时分秒，只保留年月日
        data.birthDate = data.birthDate && data.birthDate.split(" ")[0];
        data.mobileNum = data.phoneNum;
        data.medicareCard = data.patientCode;
        data.address = [];
        if (a.currentProvinceCode) {
          data.address[0] = Number(a.currentProvinceCode);
        }
        if (a.currentCityCode) {
          data.address[1] = Number(a.currentCityCode);
        }
        if (a.currentRegionCode) {
          data.address[2] = Number(a.currentRegionCode);
        }
        if (a.currentStreetCode) {
          data.address[3] = Number(a.currentStreetCode);
        }
        if (a.currentCommunityCode) {
          data.address[4] = Number(a.currentCommunityCode);
        }
        this.patientInfoShow = data;
        this.detailList = [];
        /* this.$set(this.detailList, this.detailList.length, {
          name: data.diagName,
          style: {}
        }); */
        this.$set(this.detailList, this.detailList.length, {
          name: data.allergyName,
          style: {
            background: "rgba(241, 47, 47, 0.1)",
            borderRadius: "4px",
            display: "inline-block",
            fontSize: "12px",
            fontFamily: "SourceHanSansSC-Regular",
            fontWeight: 400,
            textAlign: "center",
            color: "#ef0f0f",
            margiLeft: "8px",
            paddingTop: "2px",
            paddingLeft: "4px",
            paddingRight: "4px"
          }
        });
      }
    }
  },
  beforeDestroy() {
    // this.$root.$off("updateDiagName");
  }
};
</script>

<style lang="scss" scoped>
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: $l-bg-radius-max;
  font-size: 0;
  box-sizing: border-box;

  .patient-card {
    font-size: 16px;
    /deep/.patient-card-right {
      display: flex;
    }

    .patientInfo-left {
      display: inline-flex;
      vertical-align: top;
      text-align: center;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      flex: 1;
      .patientInfo-left-a {
        .diagName {
          font-size: 16px;
          font-weight: 500;
          color: #2e323a;
          display: inline-block;
          max-width: 210px;
        }
        .allergyName {
          background: rgba(241, 47, 47, 0.1);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 400;
          color: #ef0f0f;
          display: inline-block;
          max-width: 150px;
        }
      }
      .patientInfo-left-b {
        .button + .button {
          margin-left: 8px;
        }
      }
    }
  }

  .m-contain {
    height: calc(100% - 56px);
    box-sizing: border-box;
    .top-con {
      padding-top: 8px;
      .top-con-tab {
        font-size: 12px;
        // /deep/ .el-tabs__nav-wrap {
        //   padding-left: 18px;
        //   border-bottom: 1px solid $l-color-border-8;
        // }

        .first-list {
          width: 854px;
          font-size: 0;
          .lay-item {
            display: inline-block;
            line-height: 17px;
            font-size: 12px;
            .item-title {
              display: inline-block;
              color: #949da3;
            }
            .item-contain {
              margin-left: 8px;
              display: inline-block;
              color: #2e323a;
            }
            .item-title-01 {
              width: 36px;
            }

            .item-title-02 {
              width: 48px;
            }

            .item-contain-01 {
              width: 146px;
            }

            .item-contain-02 {
              width: 101px;
            }
            .item-contain-03 {
              width: 93px;
            }
            .item-contain-04 {
              width: 270px;
            }
          }
        }

        .third-con {
          position: relative;
          font-size: 0;
          padding-left: 17px;
          .input-con {
            /deep/ .el-input {
              width: calc(100% - 56px);
            }
            /deep/ .el-button {
              margin-left: $l-margin-default-4;
            }
          }
          .third-contain {
            .show-con {
              width: 854px;
              padding: 12px $l-padding-default-6;
              line-height: 20px;
              font-size: 14px;
              background: $l-color-bgcolor-18;
              border-radius: $l-bg-radius-bg;
              .text-left {
                color: #666c70;
              }
              .text-right {
                margin-left: $l-margin-default-4;
                margin-right: 32px;
                color: #2e323a;
              }
            }
          }
          .bottom-con {
            padding: 16px;
            position: absolute;
            bottom: 0;
            left: 0;
            height: 63px;
            border-top: 1px solid #e4e4e4;
          }
        }
      }
    }
  }
}

.overflowEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
