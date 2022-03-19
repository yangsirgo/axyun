<!--
<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
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
        </leftTabs>
      </template>
      <template #content>
        <top></top>
        <el-card class="width100" style='height:calc(100% - 110px)'>
          <el-row class="width100 height100">
            <el-col class="height100" :span="12">
              <card></card>
            </el-col>
            <el-col class="height100 float-right" :span="12">
              <record @changeParam="changeParam"></record>
            </el-col>
          </el-row>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import leftTabs from "@/components/LSideTabs.vue";
  import leftList from "./components/leftList.vue";
  import card from "./components/card";
  import record from "./components/record";
  import top from "../recordManage/recordShow/components/top";
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "",
    components: {
      leftTabs,
      leftList,
      card,
      record,
      top
    },
    data() {
      return {
        toolBoxs: ["recordSource"],
        formParams: ['timeRange','recordStatus', 'search'],
        leftTabsValue: {},
        param: {},
        searchType: '',
        searchType1: '',
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
          this.searchType1 = '';
          if (typeof n.patientList !== 'undefined') {
            this.leftTabsValue = n.leftTabsValue;
            this.searchType1 = n.searchType;
          } else {
            this.leftTabsValue = {};
            this.searchType1 = '';
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      ...mapActions({
        changeSimilarRecordData: 'patientMaster/changeSimilarRecordData'
      }),
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
        if(this.patientListData.patientList.length > 0 && this.patientListData.clear == '2'){
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
      },
      //接受子组件的请求左侧列表信息
      changeParam(data) {
        /*this.param = {...this.leftTabsValue};
        if (this.searchType1 == 'readCard') {
          this.searchType = 'readCard';
          this.param.date = new Date();
          this.param.cardId = this.param.search;
        } else if (this.searchType1 == 'searchButton') {
          this.searchType = 'searchButton';
          this.param.date = new Date();
        }*/
        //清空SimilarRecordData，左侧搜索条件，默认搜索类型，更新左侧列表
        this.changeSimilarRecordData({});
        this.leftTabsValue = {};
        this.param = {};
        this.searchType = 'searchButton';
        this.param = {
          date: new Date()
        };
      }
    }
  };
</script>

<style lang='scss' scoped>
  .record {
    border-left: 1px solid #e4e4e4;
  }
</style>
-->
<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      @message="messageHandler">
      <template #topSlot>
        <top></top>
      </template>
      <template #list>
        <!--列表tabs写法-->
        <LSideTab
          @tabClick="handleClick"
          @sideEvent="sideEvent"
        >
          <template #formList>
            <div class="margin-bottom-6">
              <el-checkbox true-label="1" false-label="0" v-model="form.reservation">当日预约</el-checkbox>
            </div>
            <div class="margin-bottom-6">
              <l-value-domain
                clearable
                code="ARCH_STATUS"
                style="width: 100%"
                :value.sync="form.recordStatus"
                placeholder="请选择档案状态"
              ></l-value-domain>
            </div>
            <div class="margin-bottom-6">
              <el-date-picker
                v-model="form.timeRange"
                type="daterange"
                style="width: 100%"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="创建开始日期"
                end-placeholder="创建结束日期"
              ></el-date-picker>
            </div>
            <el-input @keyup.native.enter="sideEvent('query')"
                      v-model="form.search"
                      placeholder="姓名/身份证号/患者编号"
                      style="width: 100%"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="sideEvent('query')"></i>
            </el-input>
          </template>
          <template #mainCont>
            <left-list :param="form" ref="leftList"></left-list>
          </template>
          <template #sideOperation></template>
        </LSideTab>
        <!--列表无tabs写法-->
        <!--<LSideList @sideEvent="sideEvent">
          <template #formList>
            <el-input @keyup.native.enter="sideEvent('query')"
                      v-model="form.search"
                      placeholder="姓名/身份证号/患者编号"
                      style="width: 100%"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="sideEvent('query')"></i>
            </el-input>
          </template>
          <template #mainCont>
            <left-list :param="form" :searchType="searchType" ref="leftList"></left-list>
          </template>
        </LSideList>-->
      </template>
      <template #content>
        <el-card class="width100 height100">
          <el-row class="width100 height100">
            <el-col class="height100" :span="12">
              <card></card>
            </el-col>
            <el-col class="height100 float-right" :span="12">
              <record @changeParam="changeParam"></record>
            </el-col>
          </el-row>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import leftList from "./components/leftList.vue";
  import card from "./components/card";
  import record from "./components/record";
  import top from "../recordManage/recordShow/components/top";
  import {mapActions, mapGetters} from 'vuex';
  import LSideTab from "@/views/components/LSideTab";
  import LSideList from "@/views/components/LSideList";

  export default {
    name: "",
    components: {
      leftList,
      card,
      record,
      top,
      LSideTab,
      LSideList
    },
    data() {
      return {
        toolBoxs: ["recordSource"],
        form: {
          reservation: 0,
          recordStatus: '',
          timeRange: []
        }
      };
    },
    provide() {
      return {
        getIsCreatRecordBtn: () => 0// 是否建档按钮:1为有;0为无
      };
    },
    computed: {
      ...mapGetters("patientMaster", ["patientListData"])
    },
    watch: {},
    created() {
      this.sideEvent('query');
    },
    methods: {
      ...mapActions({
        changeSimilarRecordData: 'patientMaster/changeSimilarRecordData'
      }),
      //子组件抛出的方法
      sideEvent(sideEvent) {
        let obj = {
          query: 'getPatientList',
          readCard: 'readCard',
          createRecord: 'createRecord'
        };
        this.$nextTick(() => {
          this.$refs.leftList[obj[sideEvent]](this.form);
        });
      },
      //工具箱
      messageHandler() {
        console.log('工具箱');
      },
      //左侧列表转换tab
      handleClick(tabs) {
      },
      changeParam(data) {
        this.sideEvent('query');
        this.changeSimilarRecordData({});
      }
      /*
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
      },*/
    }
  };
</script>

<style lang='scss' scoped>
  .record {
    border-left: 1px solid $l-color-bgcolor-11;
  }

  .margin-bottom-6 {
    margin-bottom: 6px;
  }
</style>
