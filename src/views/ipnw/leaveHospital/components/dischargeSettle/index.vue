<template>
  <l-layout
    :boxExpanded="false"
    :isToolBox="true"
    :hasThreeRouterFlag="false"
    :patientListShow="true"
    displayMode="expand"
  >
    <template #list>
      <left @listItemClick="listItemClickHandler"></left>
    </template>
    <template #content>
      <div class="bg-contain width100 height100">
        <div class="patient-card">
          <!-- <l-patient-card :patientName="mainTableData&&mainTableData.patientName" :patientAge="mainTableData&&mainTableData.patientAge"
            :patientGender="mainTableData&&mainTableData.patientGender">
            <patient-basic-info :patientInfo="mainTableData"></patient-basic-info>
            <div class="patientInfo">
              <div>
                床位号：{{mainTableData.bedCode||'--'}}
              </div> -->
          <!-- <div>
                专科：{{mainTableData.wardName||'--'}}
              </div>
              <div>
                病区：{{mainTableData.inpSdeptName||'--'}}
              </div> -->
          <!-- <div>
                患者状态：<span :val="mainTableData.recordStatus" code="InpStatus" v-codeTransform></span><span v-show="mainTableData.recordStatus==undefined">--</span>
              </div>
            </div>

          </l-patient-card> -->
          <patientDetail
            :patientData="patientInfoShow"
            :detailList="detailList"
          >
            <template #rightSlot>
              <div
                style="
                  font-size: 14px;
                  font-family: DINPro-Medium;
                  font-weight: 500;
                  text-align: left;
                  color: rgb(46, 50, 58);
                  display:flex;
                  align-items:center;
                "
              >
                <span
                  style="
                    font-size: 14px;
                    font-family: SourceHanSansSC-Medium;
                    font-weight: 500;
                    text-align: left;
                    color: rgb(148, 157, 163);
                    display: flex;
                    align-items: center;
                    padding-right: 4px;
                  "
                  >状态:</span
                >
                <span
                  v-if="mainTableData.tabStatus != 4"
                  :val="mainTableData.recordStatus"
                  code="InpStatus"
                  v-codeTransform
                ></span>
                <span v-else>
                  <span v-if="mainTableData.recordStatus == 1">财务出院</span>
                  <span v-if="mainTableData.recordStatus == 2"
                    >撤销财务出院</span
                  >
                  <span v-if="mainTableData.recordStatus == 9">回归</span>
                </span>
              </div>
            </template></patientDetail
          >
        </div>
        <div class="m-contain">
          <l-main :sendData="mainTableData"></l-main>
        </div>
      </div>
    </template>
  </l-layout>
</template>
<script>
import left from "./components/left.vue";
import main from "./components/main.vue";
import patientDetail from "@/views/homeSickbeds/hsDiagTreat/components/patientDetail.vue";
import { deepClone } from "@/utils";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    left,
    "l-main": main,
    patientDetail,
  },
  data() {
    return {
      mainTableData: {},
      recordStatus: "3",
      patientInfoShow: {},
      //患者信息条右侧区域
      detailList: [],
    };
  },
  watch: {
    mainTableData: {
      handler(a) {
        this.patientInfoShow = {};
        let data = deepClone(a);
        this.detailList = [];
        if (!a.patientId) {
          return;
        }
        // 出生年月日 去掉时分秒，只保留年月日
        data.birthDate = data.birthDate && data.birthDate.split(" ")[0];
        data.phoneNum = data.mobileNum;
        data.medicareCard = data.patientCode;
        // if (data.hasOwnProperty("addrCode") && data.addrCode.length === 3) {
        //   data.address = data.addrCode ? JSON.parse(data.addrCode) : [];
        // }
        data.address = data.addrCode ? JSON.parse(data.addrCode) : [];
        data.predictTreatStartTime = data.predictTreatStartTime
          ? data.predictTreatStartTime.split(" ")[0]
          : "";
        data.predictTreatEndTime = data.predictTreatEndTime
          ? data.predictTreatEndTime.split(" ")[0]
          : "";
        data.doctorName = data.manageDoctorName;
        data.nurseName = data.manageNurseName;
        this.patientInfoShow = data;
        console.log(data,"最总合成数据");
        let nameStyle = {
          fontSize: "14px",
          fontFamily: "DINPro-Medium",
          fontWeight: 500,
          textAlign: "left",
          color: "#2e323a",
        };
        let labelStyle = {
          fontSize: "14px",
          fontFamily: "SourceHanSansSC-Medium",
          fontWeight: 500,
          textAlign: "left",
          color: "#949da3",
          display: "flex",
          alignItems: "center",
          paddingRight: "4px",
        };
        this.$set(this.detailList, this.detailList.length, {
          name: this.mainTableData.bedCode,
          style: nameStyle,
          label: "床位号:",
          labelStyle,
        });
        // this.$set(this.detailList, this.detailList.length, {
        //   name: this.mainTableData.recordStatus,
        //   code: "InpStatus",
        //   style: nameStyle,
        //   label: "患者状态:",
        //   labelStyle,
        //   from: "leavePay",
        // });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    listItemClickHandler(data) {
      this.mainTableData = data;
    },
    // 金额格式化，千位分割，小数点2位
    formatNumber(a, num = 2) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(num)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: $l-bg-radius-max;
  font-size: 0;
  box-sizing: border-box;

  /deep/ .patient-card-right {
    display: flex;
  }

  .moneyTitle {
    font-size: 16px;
    font-family: SourceHanSansSC, SourceHanSansSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #2e323a;
    display: flex;
    align-items: center;
    padding: 0 24px;
  }

  .money {
    font-size: 16px;
    font-family: DINPro, DINPro-Medium;
    font-weight: 500;
    text-align: left;
    color: #ef0f0f;
  }

  .m-contain {
    height: calc(100% - 56px);
    box-sizing: border-box;
  }

  .patientInfo {
    font-size: 12px;
    display: flex;
    padding: 4px 16px;
    color: #949da3;
    div {
      margin-right: 24px;
    }
  }
}
</style>
