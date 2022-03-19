<template>
  <l-layout :patientListShow="false" :isToolBox="false">
    <template slot="content">
      <el-tabs
        type="border-card"
        class="el-tabs-new-style width100"
        v-model="activeName"
        @tab-click="handleClick"
        tab-position="top"
      >
        <el-tab-pane
          v-for="(item, index) in tabParams"
          :key="index"
          :label="item.label"
          :name="item.name"
          :component="item.component"
          :disabled="item.disabled"
        ></el-tab-pane>
      </el-tabs>
      <div class="tab-cont">
        <component
          :is="curComponent"
          :machine="currentMachine"
          @set-machine="setCurMachine"
        ></component>
      </div>
    </template>
  </l-layout>
</template>

<script>
import machineMaintenance from "./component/machineMaintenance";
import machineDrug from "./component/machineDrug";

export default {
  name: "MachineMedicine",
  components: {
    machineMaintenance,
    machineDrug,
  },
  data() {
    return {
      activeName: "machineMaintenance",
      tabParams: [
        {
          label: "机器维护",
          name: "machineMaintenance",
          component: machineMaintenance,
        },
        {
          label: "机器药品对照",
          name: "machineDrug",
          component: machineDrug,
        },
      ],
      curComponent: machineMaintenance,
      currentMachine: {},
    };
  },
  methods: {
    handleClick(tab, event) {
      this.curComponent = tab.$attrs.component;
    },
    setCurMachine(data) {
      this.currentMachine = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tabs-new-style {
  /deep/ .el-tabs__item {
    padding: 0 8px !important;
  }
}
.tab-cont {
  height: calc(100% - 30px);
  background-color: $l-color-white;
  padding: 20px;
}
</style>