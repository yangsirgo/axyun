<template>
  <!-- <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      @message="messageHandler"
    >
      <template #list>
        <leftTabs
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          v-model="leftTabsValue"
          :tabs-name="tabsName"
          :form-list="formParams"
          mode='patientMaster'>
          <template #first>
            <left-list :param="param" :searchType="searchType"></left-list>
          </template>

        </leftTabs>
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
        <top></top>
        <account-detail></account-detail>
      </template>
    </l-layout>
  </div>-->
  <!--<div class="wrapper width100 height100">
    <div class="float-left main">
      <div
        class="main_wrap"
        :style="{'margin-left': toolBarExpanded ? '298px' : '56px', 'margin-right': contentStyle}"
      >
        <flow-menu patientCardType="default" :patientInfo="mainTableData">
          <l-main :sendData="mainTableData"></l-main>
        </flow-menu>
      </div>
    </div>
    <div class="float-left left" :style="{'width': toolBarExpanded ? '287px' : '46px'}">
      <sidebar :open.sync="toolBarExpanded">
        <el-card class="left-cont">
          <l-card-title>
            <span slot="left">患者列表</span>
          </l-card-title>
          <div class="patient-list">
            <PatientList @listItemClick="listItemClickHandler" />
          </div>
        </el-card>
      </sidebar>
    </div>
    <div
      v-if="isToolBox"
      class="float-left right"
      :style="{'width': toolBoxExpanded ? '287px' : '46px', 'margin-left': toolBoxExpanded ? '-287px' : '-46px'}"
    >
      <tool-box
        :boxName="toolBoxs[0]"
        :modules="toolBoxs"
        :open.sync="toolBoxExpanded"
        v-bind="$attrs"
        v-on="$listeners"
      />
    </div>
  </div>-->
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
    <template #topSlot>
      <PatientInfoTop :patientInfo="mainTableData" />
    </template>
    <template #list>
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
      <l-main :sendData="mainTableData"></l-main>
    </template>
  </l-layout>
</template>

<script>
import lMain from "./components/accountDetail.vue";
import { mapActions, mapGetters } from "vuex";
// import FlowMenu from "@/views/cis/settleAccount/returnCharge/components/FlowMenu.vue";
import PatientList from "@/components/PatientList.vue";
// import Sidebar from "@/views/public/sidebar";

export default {
  name: "",
  components: {
    // FlowMenu,
    lMain,
    PatientList,
    // Sidebar
  },
  data() {
    return {
      toolBoxs: [],
      toolBoxExpanded: false,
      toolBarExpanded: true,
      contentStyle: "289px",
      isToolBox: false,
      mainTableData: {}
    };
  },
  watch: {
    boxExpanded: {
      handler(v) {
        this.toolBoxExpanded = v;
      },
      immediate: true
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
      immediate: true
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
      immediate: true
    },
     "receivePatientData": {
        handler(n) {
          this.changeRecPatientData(n);
          this.listItemClickHandler(n);
        },
        immediate: true,
        deep: true
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    listItemClickHandler(data) {
      this.mainTableData = data;
      this.changeRecPatientData(data);
    },
    messageHandler() {}
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
