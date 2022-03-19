<template>
  <!-- <div class="height100">
    <leftTabs
      @tabs-change="handleTabChange"
      @read-card="readCard"
      @query="search"
      :form-list="formParams"
    >
      <template #firstBottom>
        <patients-table ref="patientsTable"></patients-table>
      </template>
      <template #second>第二卡片内容</template>
      <template #third>第三卡片内容</template>
    </leftTabs>
  </div> -->
  <div class="leftTabsWrapper height100">
    <LSideTab
      @tabClick="handleClick"
      @sideEvent="sideEvent"
    >
      <template #formList>
        <el-date-picker
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 100%; margin: 0 0 10px 0"
          v-model="form.timeRange"
          type="daterange"
          range-separator="至"
          @change="search"
          :default-time="['00:00:00', '23:59:59']"
          :start-placeholder="datePicker.startPlaceholder"
          :end-placeholder="datePicker.endPlaceholder"
        ></el-date-picker>
        <el-input @keyup.native.enter="sideEvent('query')"
                  v-model="form.search"
                  placeholder="姓名/手机号/身份证号/患者编号"
                  style="width: 100%"
                  @keyup.enter.native="search"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="('query')"></i>
        </el-input>
      </template>
      <template #mainCont>
        <patients-table ref="patientsTable"></patients-table>
      </template>
      <template #sideOperation></template>
    </LSideTab>
  </div>
</template>

<script>
// 目前form 表单有
// 院区：CourtyardArea
// 科室：technicalOffices
// 渠道：channelWay
// 时间：timeRange
// 搜索：search

import LSideTab from "@/views/components/LSideTab";

import leftTabs from "@/components/LSideTabs.vue";
import patientsTable from "../components/patientsTable.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "leftBar",
  data() {
    return {
      datePicker: {
        //datepicker 的 placeholder
        startPlaceholder: "预约开始日期",
        endPlaceholder: "预约结束日期"
      },
      patientInfo: {},
      patientInfoList: [],
      form: {},
      formParams: ["technicalOffices", "timeRange", "search"]
    };
  },
  methods: {
    handleClick() {
      // tab 的切换方法
    },
    //子组件抛出的方法
    sideEvent(sideEvent) {
      if (sideEvent === "query") {
        this.search();
      } else if (sideEvent === "readCard") {
        this.readCard();
      }

    },
    handleTabChange() {
      // tab 的切换方法
    },
    search(form) {
      // 查询方法
      this.$refs.patientsTable.loadData(form);
    },
    readCard(form) {
      // 读卡方法
      this.$refs.patientsTable.loadData(form);
    }
  },
  components: {
    LSideTab,
    leftTabs,
    patientsTable
  },
  provide() {
    return {
      getIsCreatRecordBtn: () => 0,// 是否建档按钮:1为有;0为无
      getPatientInfoTitle: () => '',// 患者信息名称
      getPatientInfos: () => this.receivePatientData,
      getPatientInfoList: () => this.patientInfoList
    };
  },
  computed: {
    ...mapGetters("base", ["role", "name", "reloadPatient"]),
    ...mapGetters("base", ["receivePatientData"])
  },
};
</script>

<style lang="scss" scoped></style>
