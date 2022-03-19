<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxsDefault"
      :boxExpanded="true"
      @message="messageHandler">
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
          <!--<template #second>

          </template>-->
          <!--<template #third>
            第三卡片内容
          </template>-->
        </leftTabs>
      </template>
      <template #content>
        <top class="toptop"></top>
        <!--<costs-tabs class="costscosts"></costs-tabs>-->
        <div class="costsTabs width100 height100">
          <el-tabs type="border-card" v-model="activeName" @tab-click="changeTab">
            <el-tab-pane label="门诊" name="first">
              <visitCost v-if="activeName=='first'"></visitCost>
            </el-tab-pane>
            <el-tab-pane label="住院" name="second">
              <inpatient-cost v-if="activeName=='second'"></inpatient-cost>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import leftTabs from "@/components/LSideTabs.vue";
  import leftList from "@/views/patientMaster/cardsRecord/components/leftList.vue";
  import visitCost from "./components/costsTabs";
  import inpatientCost from './components/inpatientCost.vue';
  import top from "../recordManage/recordShow/components/top";
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "",
    components: {
      leftTabs,
      leftList,
      visitCost,
      inpatientCost,
      top
    },
    data() {
      return {
        toolBoxsDefault: 'visitTimeLine',
        activeName: 'first',
        toolBoxs: ["visitTimeLine", "inpatientTimeLine"],
        formParams: ['timeRange', 'recordStatus', 'search'],
        leftTabsValue: {},
        param: {},
        searchType: '',
        tabsName: [{
          label: '患者列表',
          value: 'first'
        }]
      };
    },
    computed: {
      ...mapGetters("patientMaster", ["patientListData"])
    },
    watch: {
      'patientListData': {
        async handler(n) {
          this.leftTabsValue = {};
          if (typeof n.patientList !== 'undefined') {
            this.leftTabsValue = n.leftTabsValue
          } else {
            this.leftTabsValue = {};
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      ...mapActions({
        changeHisRecordData: 'patientMaster/changeHisRecordData',
        changeHisRecordInData: 'patientMaster/changeHisRecordInData'
      }),
      //切换tab
      changeTab(tab, event) {
        if (tab.name == 'first') {
          this.changeHisRecordInData({});
          this.toolBoxs = ["visitTimeLine", "inpatientTimeLine"];
          this.toolBoxsDefault = this.toolBoxs[0];
        } else if (tab.name == 'second') {
          this.changeHisRecordData({});
          this.toolBoxs = ["inpatientTimeLine", "visitTimeLine"];
          this.toolBoxsDefault = this.toolBoxs[0];
        }
      },
      //左侧列表转换tab
      handleClick() {

      },
      // 查询方法
      search(form) {

        delete form["startTimeRange"];
        delete form["endTimeRange"];
        if (form.timeRange != null && form.timeRange.length > 1) {
          form["startTimeRange"] = form.timeRange[0];
          form["endTimeRange"] = form.timeRange[1];
        }
        this.param = {
          ...form,
          date: new Date()
        };
        this.searchType = 'searchButton';
      },
      // 读卡方法
      readCard(form) {
        let clearData = '1';
        if (this.patientListData.patientList.length > 0 && this.patientListData.clear == '2') {
          clearData = '2';//不清
        }
        this.param = {
          cardId: form.search,
          date: new Date(),
          clearData: clearData
        };
        this.searchType = 'readCard';
      },
      //工具箱
      messageHandler() {
        console.log('工具箱');
      }
    }
  };
</script>

<style lang='scss'>
  .card {
    float: left;
    width: 43%;
    height: 500px;
  }

  .record {
    float: right;
    width: 50%;
    height: 500px;
  }

  .costsTabs {
    .el-tabs.el-tabs--top.el-tabs--border-card {
      height: calc(100% - 110px);

      .el-tabs__content {
        height: calc(100% - 39px);
        padding: 20px 0px 20px 20px;
        overflow-y: auto;

        .el-tab-pane {
          margin-right: 20px;
        }
      }
    }
  }
</style>
