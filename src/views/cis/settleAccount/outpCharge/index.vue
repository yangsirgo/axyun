
<template>
  <l-layout
    :toolBoxs="toolBoxs"
    :defaultToolName="toolBoxs[0]"
    :boxExpanded="false"
    :isToolBox="true"
    :hasThreeRouterFlag="false"
    :patientListShow="true"
    displayMode="expand"
    @message="messageHandler"
  >
    <template #list>
      <PatientList @listItemClick="listItemClickHandler" ref="patientList"></PatientList>
    </template>
    <template #content>
      <div class="bg-contain width100 height100">
        <div class="patient-card">
          <!-- <l-patient-card
            :patientName="mainTableData&&mainTableData.patientName"
            :patientAge="mainTableData&&mainTableData.age"
            :patientGender="mainTableData&&mainTableData.patientGender"
          >
            <patient-basic-info :patientInfo="mainTableData"></patient-basic-info>
            <div class="moneyTitle">
              待缴费金额合计：
              <span class="money">{{formatNumber(allWaitPrice)}}元</span>
            </div>
          </l-patient-card> -->
          <!-- docType="1"：收费类型 -->
          <patientDetail
            :patientData="patientInfoShow"
            :detailList="detailList"
            docType="1"
          ></patientDetail>
        </div>
        <div class="m-contain">
          <l-main :sendData="mainTableData" @allWaitPrice="allWaitPriceHandler" @updatePatientList="updatePatientList"></l-main>
        </div>
      </div>
    </template>
  </l-layout>
</template>

<script>
import PatientList from "./components/patientList.vue";
import lMain from "./components/mainNew.vue";
import PatientInfoTop from "@/components/PatientInfoTop.vue";
import patientDetail from "@/views/cis/prescriptionRecor/components/patientDetail.vue";
import { deepClone } from "@/utils";

export default {
  name: "outpCharge",
  components: {
    PatientList,
    lMain,
    patientDetail
  },
  data() {
    return {
      toolBoxExpanded: false,
      toolBarExpanded: true,
      contentStyle: "289px",
      tableLoading: false,
      // toolBoxs: ["billManage", "receiptJump", "Hotkey"],
      toolBoxs: ["Hotkey"],
      mainTableData: {},
      isToolBox: true,
      allWaitPrice: 0,
      patientInfoShow: {},
      //患者信息条右侧区域
      detailList: []
    };
  },
  watch: {
    boxExpanded: {
      handler(v) {
        this.toolBoxExpanded = v;
      },
      immediate: true,
    },
    isToolBox: {
      handler(v) {
        if (v === true) {
          if (this.toolBoxExpanded === true) {
            this.contentStyle = "298px";
          } else {
            this.contentStyle = "56px";
          }
        } else {
          this.contentStyle = "0";
        }
      },
      immediate: true,
    },
    toolBoxExpanded: {
      handler(v) {
        if (this.isToolBox === true) {
          if (v === true) {
            this.contentStyle = "298px";
          } else {
            this.contentStyle = "56px";
          }
        }
      },
      immediate: true,
    },
    mainTableData: {
      immediate: true,
      deep: true,
      handler(a) {
        let data = deepClone(a);
        // 出生年月日 去掉时分秒，只保留年月日
        data.birthDate = data.birthDate && data.birthDate.split(" ")[0];
        data.phoneNum = data.mobileNum;
        data.medicareCard = data.patientCode;
        try {
          let addressInfo = data.addressInfo || {};
          if(addressInfo.hasOwnProperty("currentAddress") && JSON.parse(addressInfo.currentAddress).length) {
              data.address = JSON.parse(addressInfo.currentAddress)
          }
          if(a.currentProvinceCode && a.currentCityCode && a.currentRegionCode) {
            data.address = [Number(a.currentProvinceCode), Number(a.currentCityCode), Number(a.currentRegionCode)];
          }
        } catch (error) {
          
        }
        
        this.$delete(data, "settlementType");
        this.patientInfoShow = data;
      }
    }
  },
  methods: {
    messageHandler() {},
    // 患者选中回调
    listItemClickHandler(data) {
      this.mainTableData = data;
    },
    // 待收费金额计算回调
    allWaitPriceHandler(data) {
      this.allWaitPrice = data;
      // this.handlePrice();
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
    //退费金额数据=》患者信息条
    handlePrice(){
      this.detailList = [];
      let allWaitPrice = this.formatNumber(this.allWaitPrice) + "元";
      this.$set(this.detailList, this.detailList.length, {
        name: allWaitPrice,
        style: {
          fontSize: "16px",
          fontFamily: "DINPro-Medium",
          fontWeight: 500,
          textAlign: "left",
          color: "#ef0f0f"
        },
        label: "待缴费金额合计：",
        labelStyle: {
          fontSize: "16px",
          fontFamily: "SourceHanSansSC-Medium",
          fontWeight: 500,
          textAlign: "left",
          color: "#2e323a",
          display: "flex",
          alignItems: "center",
          paddingRight: "4px"
        }
      });
    },
    updatePatientList(patientId) {
      this.$refs.patientList.choosePenetrateItem(this.$refs.patientList.currentPenetrate);
    }
  },
};
</script>
<style lang='scss' scoped>
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
}
</style>
