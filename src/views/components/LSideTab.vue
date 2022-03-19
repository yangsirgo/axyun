<template>
  <div class="LSideTab width100 height100">
    <div class="padding-left-8" style="background: #fff">
      <l-card-title>
        <template #left>就诊患者查询</template>
      </l-card-title>
    </div>

    <LSideList @sideEvent="sideEvent">
      <template #formList>
        <slot name="formList"></slot>
      </template>
      <template #mainCont>
        <slot name="mainCont"></slot>
      </template>
    </LSideList>
  </div>
</template>

<script>
import LSideList from "@/views/components/LSideList";

export default {
  name: "LSideTab",
  components: {
    LSideList,
  },
  data() {
    return {
      activityName: "LSideList",
      tabList: [
        {
          label: "患者列表",
          name: "LSideList",
        },
        {
          label: "业务待办",
          name: "LSideOperation",
        },
      ],
    };
  },
  methods: {
    tabClick(tabs) {
      this.$emit("tabClick", tabs);
    },
    sideEvent(sideEvent, form) {
      this.$emit("sideEvent", sideEvent, form);
    },
  },
};
</script>

<style scoped lang="scss">
.LSideTab {
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
}
</style>
