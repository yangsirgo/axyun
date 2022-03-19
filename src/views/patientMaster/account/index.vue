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
      <PatientListFinance @listItemClick="listItemClickHandler"></PatientListFinance>  
    </template>
    <template #content>
      <div class="bg-contain width100 height100">
        <div class="patient-card">
          <l-patient-card
            :patientName="mainTableData&&mainTableData.patientName"
            :patientAge="mainTableData&&mainTableData.age"
            :patientGender="mainTableData&&mainTableData.patientGender"
          >
            <patient-basic-info :patientInfo="mainTableData"></patient-basic-info>
            <!-- <div>
              代缴费金额合计：
              <span>899.00元</span>
            </div> -->
          </l-patient-card>
        </div>
        <div class="m-contain">
          <l-main :sendData="mainTableData"></l-main>
        </div>
      </div>
    </template>
  </l-layout>
</template>

<script>
import lMain from "./components/accountDetail.vue";
import { mapActions, mapGetters } from "vuex";
import PatientList from "@/components/PatientList.vue";
export default {
  name: "",
  components: {
    lMain,
    PatientList,
  },
  data() {
    return {
      toolBoxs: [],
      toolBoxExpanded: false,
      toolBarExpanded: true,
      contentStyle: "289px",
      isToolBox: false,
      mainTableData: {},
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
    receivePatientData: {
      handler(n) {
        this.changeRecPatientData(n);
        this.listItemClickHandler(n);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
    }),
    listItemClickHandler(data) {
      this.mainTableData = data;
      this.changeRecPatientData(data);
    },
    messageHandler() {},
    
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

  .m-contain {
    height: calc(100% - 56px);
    box-sizing: border-box;
  }
}

</style>
