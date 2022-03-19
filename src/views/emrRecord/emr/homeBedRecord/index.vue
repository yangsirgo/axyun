<template>
  <div class="width100 height100">
    <l-layout
      patientCardType="default"
      hosType="1"
      :toolBoxs="layoutObjec.toolBoxs"
      :defaultToolName="layoutObjec.toolBoxs[0]"
      :isToolBox="layoutObjec.isToolBox"
      :boxExpanded="false"
      :pageName="layoutObjec.pageName"
      :templateType="temType"
      :ele-type="1"
      @message="messageHandler"
    >
      <template #list>
        <left-bar ref="leftBar"></left-bar>
      </template>

      <template #content>
        <div class="bg-contain width100 height100">
          <div class="patient-card">
            <patientDetail
              :patientData="patientInfoShow"
              :detailList="detailList"
            ></patientDetail>
          </div>
          <div class="m-contain">
            <div class="top-con height100">
              <div class="top-con-tab height100">
                <emr-record ref="emrRecord" isHome="1" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { deepClone } from "@/utils";

import leftBar from "@/views/homeSickbeds/hsDiagTreat/components/leftBar.vue";
import patientDetail from "@/views/homeSickbeds/hsDiagTreat/components/patientDetail";
import emrRecord from "@/views/emrRecord/iframePage/record.vue";

export default {
  name: "index",
  components: {
    leftBar,
    patientDetail,
    emrRecord
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
    messageHandler(val) {
      this.$nextTick(() => {
        // console.log("父组件 messageHandler");
        this.$refs.tabWrapper.messageHandler(val);
      });
    },
    getHealthRecords() {
      let eHrData = {
        patientArchiveInfoVO: this.receivePatientData
      };
      this.seteHrData(eHrData).then(() => {
        this.readTheStyle = true;
      });
    }
  },
  created() {
    setTimeout(() => {
this.changeRecPatientData({}); // 目的是为了进入此二级菜单后，清除之前的患者vuex信息
}, 1000)

  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      handler(a) {
        console.log(a);
        this.patientInfoShow = {};
        let data = deepClone(a);
        // 出生年月日 去掉时分秒，只保留年月日
        data.birthDate = data.birthDate && data.birthDate.split(" ")[0];
        data.phoneNum = data.mobileNum;
        data.medicareCard = data.patientCode;
        data.address = data.addrCode;
        data.predictTreatStartTime = data.expectTreatStartTime
          ? data.expectTreatStartTime.split(" ")[0]
          : "";
        data.predictTreatEndTime = data.expectTreatEndTime
          ? data.expectTreatEndTime.split(" ")[0]
          : "";
        data.prepayBalance = data.prepayBalance || 0;
        data.selfPayPrepay = data.prepayTotalAmt || 0;
        data.settlementType = data.settleType;
        this.patientInfoShow = data;
        this.detailList = [];
        /* if (data.firstDiagnosisContent) {
          this.$set(this.detailList, this.detailList.length, {
            name: data.firstDiagnosisContent,
            style: {}
          });
        } */
        if (data.allergyName) {
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
    }
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
