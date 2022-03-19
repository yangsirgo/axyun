<template>
  <div class="height100 drug">
    <l-layout
      isLeftShowMode="expand"
      visitType="04"
      dnFlag="2"
      isHome="1"
      displayMode="expand"
      patientCardType="hospital"
      class="recordPage"
      toolBoxName="emr"
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      :isLargeWidth="isLargeWidth"
      :isLeftExpand="isLeftExpandFlag"
      :editor="editor"
      @message="messageHandler"
    >
      <template #list>
        <left-bar ref="leftBar"></left-bar>
      </template>
      <!-- <template #topSlot>
        <l-patient-details />
      </template> -->
      <template #content>
        <!-- <docRecord
          @showStructureTree="showStructureTree"
          class="width100 height100"
          :toolsQuote="toolsQuote"
        ></docRecord>-->

        <div class="bg-contain width100 height100">
          <div class="patient-card">
            <patientDetail
              :patientData="patientInfoShow"
              :detailList="detailList"
            ></patientDetail>
          </div>
          <div class="m-contain">
            <treeListComponent
              class="width100 height100"
              ref="treeListComponent"
              :toolsQuote="toolsQuote"
              @showStructureTree="showStructureTree"
            ></treeListComponent>
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
// import leftBar from "@/views/cis/prescriptionRecor/newPatientsManage/record/components/leftBar";
import docRecord from "@/views/nursingRecord/docRecord";
import treeListComponent from "@/views/nursingRecord/maintenanceDocument/components/treeListComponent";
export default {
  name: "nursingDocuments",
  components: {
    leftBar,
    patientDetail,
    docRecord,
    treeListComponent
  },
  data() {
    return {
      isLargeWidth: false,
      showTreeFlag: true,
      editor: {
        type: "nursingRecord"
      },
      isLeftExpandFlag: true,
      toolBoxs: [
        "abnormal",
        "SpecialSymbol",
        "inpwPhrase",
        "inpwAdvice",
        "CheckResult",
        "InspectionResults"
      ],
      toolsQuote: {
        current: "",
        data: {
          symbol: ""
        }
      },
      patientInfoShow: {},
      detailList: []
    };
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    ...mapGetters("user", ["role"])
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
  },
  created() {
    console.log(this.role, "rolerole");
    this.changeRecPatientData({});
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    messageHandler(name, value) {
      // debugger
      console.log(name, value, "kslsksl");
      // 用来给文书组件传递参数
      // console.log(this.$refs.treeListComponent, "this.$refs.treeListComponent");
      try {
        this.$refs.treeListComponent.$refs.analyComponent.$refs.recordEditorRander.messageHandler(
          name,
          value
        );
      } catch (e) {
        console.log(e);
      }

      this.toolsQuote.current = name;
      this.toolsQuote.isFind = false;
      this.toolsQuote.date = new Date();
      this.toolsQuote.data = {};
      if (name === "insertCheck") {
        let contents = "";
        for (let i in value.selectItem) {
          if (value.selectItem[i] === "表现") {
            contents += value.selectItem[i] + ": " + value.obFndg + "; ";
          } else if (value.selectItem[i] === "结论") {
            contents += value.selectItem[i] + ": " + value.obDi + "; ";
          }
        }
        this.toolsQuote.data[name] = contents;
        return;
      } else if (name === "insertCheckRes") {
        let data = value.multipleSelection;
        let str = "";
        for (let i in data) {
          str += data[i]["assayName"] + " ： " + data[i]["assayResult"] + "；";
        }
        this.toolsQuote.data[name] = str;
        return;
      } else if (name === "insertPreviousFunc") {
        //医嘱引用
        let data1 = value.chinaMedicineList;
        let data2 = value.medicineList;
        let data3 = value.otherPreviousList;
        let str = "";
        for (let i in data1) {
          for (let j in data1[i]) {
            if (data1[i][j].hasOwnProperty("chinaMedicineId")) {
              str +=
                data1[i][j]["svNm"] +
                data1[i][j]["useNumStr"] +
                "，" +
                data1[i][j]["freqAndUsreage"] +
                "； ";
            }
          }
        }
        for (let i in data2) {
          str +=
            data2[i]["svNm"] +
            "(" +
            data2[i]["spec"] +
            ")" +
            data2[i]["useNumStr"] +
            "，" +
            data2[i]["freqAndUsreage"] +
            "； ";
        }
        for (let i in data3) {
          str += data3[i]["svNm"] + "； ";
        }
        this.toolsQuote.data[name] = str;
        return;
      }
      this.toolsQuote.data[name] = value;
    },
    showStructureTree(instance) {
      // this.editor = instance;
    }
  }
};
</script>

<style scoped lang='scss'>
.recordPage {
  .width100.position-relative.content-180 {
    min-width: 810px;
  }
}

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
