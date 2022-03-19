<template>
  <div class="width100 height100">
    <l-layout
      :boxExpanded="false"
      patientCardType="settleAccount"
      pageName="cisReturnCharge"
      :key="activityName"
    >
      <template #topSlot>
        <l-patient-details v-if="activityName==='first'"></l-patient-details>
        <PatientInfoTop v-else-if="activityName==='second'" :patientInfo="mainTableData"/>
      </template>
      <template #list>
        <el-card class="height100">
           <left-bar :activityName="activityName"></left-bar>
        </el-card>
        

        <!-- <el-tabs type="border-card" class="height100 LSideTab-tabs"
                 v-model="activityName" @tab-click="handleClick"
        >
          <el-tab-pane label="按诊疗补费" name="first">
            <left-bar v-if="activityName==='first'" :activityName="activityName"></left-bar>
          </el-tab-pane>
          <el-tab-pane label="按档案补费" name="second">
            <div class="height100 padding10">
              <PatientList v-if="activityName==='second'" @listItemClick="listItemClickHandle"/>
            </div> -->
            <!--<left-bar v-if="activityName==='second'" :activityName="activityName"></left-bar>-->
          <!-- </el-tab-pane>
        </el-tabs> -->
      </template>
      <template #content>
        <l-main></l-main>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import leftBar from "./components/leftBarNew.vue";
  import lMain from "./components/chargeMain.vue";
  import {mapActions, mapGetters} from 'vuex'

  export default {
    name: "",
    components: {
      leftBar,
      lMain
    },
    data() {
      return {
        activityName: 'first',
        mainTableData: {}
      };
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        handler(n) {
          this.mainTableData = n || {};
        },
        immediate: true,
        deep: true
      },
      activityName: {
        handler(n) {
          this.changeRecPatientData({});
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      ...mapActions({
        changeRecPatientData: 'base/changeRecPatientData'
      }),
      handleClick(tabs) {
      },
      listItemClickHandle(data) {
        this.changeRecPatientData(data);
      }
    }
  };
</script>

<style lang='scss' scoped>
  /deep/ .LSideTab-tabs > .el-tabs__header .el-tabs__nav {
    width: 100%;
  }

  /deep/ .LSideTab-tabs > .el-tabs__header .el-tabs__item {
    width: 50% !important;
    text-align: center !important;
    height: 30px !important;
    font-size: $l-font-size !important;
    
    font-weight: $l-font-weight !important;
    line-height: 30px !important;
  }

  /deep/ .LSideTab-tabs > .el-tabs__header .el-tabs__item.is-active {
    color: $l-color-white !important;
  }

  /deep/ .LSideTab-tabs > .el-tabs__content {
    padding: 0;
    height: calc(100% - 29px);
  }
</style>
