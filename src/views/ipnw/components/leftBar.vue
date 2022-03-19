<template>
  <div class="leftTabsWrapper height100">
    <leftTabs
      @tabs-change="handleClick"
      @read-card="readCard"
      @query="search"
      v-model="formValue"
      hosp-state
      :form-list="formParams"
    >
      <template #firstBottom>
        <!--填入 第一个 tabs 的 搜索条件下部 内容-->
        <patients ref="patients" :form="formValue"></patients>
      </template>
      <template #second>
        <!--填入 第二个 tabs 的  内容-->
        第二卡片内容
      </template>
      <template #third>
        <!--填入 第三个 tabs 的 内容-->
        第三卡片内容
      </template>
    </leftTabs>
  </div>
</template>

<script>
//备注： hosp-state  属性 增加住院的人员状态包括 新入院 在院 预撤床 撤床 。 目前默认选择在院状态
// 目前form 表单有
//院区：CourtyardArea
// 科室：technicalOffices
// 渠道：channelWay
// 时间：timeRange
// 搜索：search

import leftTabs from "@/components/LSideTabs.vue";
import patients from "./Patient";

export default {
  name: "leftBar",
  components: {
    leftTabs,
    patients
  },
  data() {
    return {
      formValue: {}, //查询的form 的值
      formParams: [
        "CourtyardArea",
        "technicalOffices",
        "illnessArea",
        "patientsType",
        "patientsState",
        "search"
      ]
    };
  },
  methods: {
    handleClick() {
      // tab 的切换方法
    },
    search(form) {
      // 查询方法
      this.$refs.patients.getPatientList(form); //查询列表
    },
    readCard() {
      // 读卡方法
    }
  }
};
</script>

<style scoped lang="scss">
</style>
