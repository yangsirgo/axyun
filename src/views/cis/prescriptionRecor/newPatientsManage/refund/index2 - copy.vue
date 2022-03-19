<template>
  <div class="width100 height100">
    <l-layout
      :hasThreeRouterFlag="false"
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      :isToolBox="true"
      :patientListShow="true"
      @message="messageHandler"
    >
      <template #topSlot>
        <PatientInfoTop :patientInfo="mainTableData" />
      </template>
      <template #list>
        <!--列表tabs写法-->
        <el-card class="left-cont">
          <l-card-title>
            <span slot="left">患者列表</span>
          </l-card-title>
          <div class="patient-list">
            <PatientList @listItemClick="listItemClickHandler" />
          </div>
        </el-card>
      </template>
      <template #content>
        <l-main :sendData="mainTableData" :separate="false"></l-main>
      </template>
    </l-layout>
  </div>
</template>

<script>
import PatientList from "@/components/PatientList.vue";
import lMain from "./components/mainCardNew.vue";
import PatientInfoTop from "@/components/PatientInfoTop.vue";

export default {
  name: "refund",
  components: {
    PatientList,
    lMain
  },
  data() {
    return {
      toolBoxs: ["AuxiliaryDiagnosis"],
      mainTableData: {}
    };
  },
  methods: {
    messageHandler() {},
    listItemClickHandler(data) {
      this.mainTableData = data;
    }
  }
};
</script>

<style lang='scss' scoped>
.wrapper {
  overflow: hidden;
}
.main {
  width: 100%;
  height: 100%;
  .main_wrap {
    margin: 0 297px 0 297px;
    height: 100%;
  }
}
.left {
  width: 287px;
  height: 100%;
  margin-left: -100%;
}
.right {
  width: 287px;
  height: 100%;
  margin-left: -287px;
}
.left-cont {
  padding: 0 10px;
  width: 100%;
  height: 100%;
}
.patient-list {
  height: calc(100% - 63px);
}
</style>


