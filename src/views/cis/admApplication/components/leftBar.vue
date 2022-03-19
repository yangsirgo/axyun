<template>
  <div class="leftTabsWrapper height100">
    <leftTabs
      @tabs-change="handleClick"
      @read-card="readCard"
      @query="search"
      :form-list="formParams">
      <template #firstBottom>
        <!--填入 第一个 tabs 的 搜索条件下部 内容-->
        <patients-tree></patients-tree>
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

  // 目前form 表单有
  //院区：CourtyardArea
  // 科室：technicalOffices
  // 渠道：channelWay
  // 时间：timeRange
  // 搜索：search

  import leftTabs from "@/components/LSideTabs.vue";
  import patientsTree from "./patientsTable.vue";

  //console.log(leftTabs);
  export default {
    name: "leftBar",
    data() {
      return {
        formParams: ['technicalOffices','timeRange', 'search'],
      }
    },
    methods: {
      handleClick() {// tab 的切换方法

      },
      search(form) {// 查询方法
        console.log('form:',form);
      },
      readCard() {// 读卡方法

      }
    },
    components: {
      leftTabs, patientsTree
    },
  }
</script>

<style scoped lang="scss">
  .leftTabsWrapper {
    /*height: calc(100% - 230px);*/
  }
  /deep/ .el-tabs__content {
    overflow: unset !important;
  }
</style>
