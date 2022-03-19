<template>
  <div class="height100">
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
  </div>
</template>

<script>
// 目前form 表单有
// 院区：CourtyardArea
// 科室：technicalOffices
// 渠道：channelWay
// 时间：timeRange
// 搜索：search

import leftTabs from "@/components/LSideTabs.vue";
import patientsTable from "./patientsTable.vue";
export default {
  name: "leftBar",
  data() {
    return {
      formParams: ["technicalOffices", "timeRange", "search"]
    };
  },
  methods: {
    handleTabChange() {
      // tab 的切换方法
    },
    search(form) {
      // 查询方法
      // this.$refs.patientsTable.getToCharge({
      //   dateTime: form.timeRange || []
      // });
      this.$refs.patientsTable.getToCharge(form);
    },
    readCard(val) {
      // 读卡方法
      this.$refs.patientsTable.readCard(val);
    }
  },
  components: {
    leftTabs,
    patientsTable
  }
};
</script>

<style lang="scss" scoped>
</style>
