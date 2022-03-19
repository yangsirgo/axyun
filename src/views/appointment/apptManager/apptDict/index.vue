<template>
  <div class="height100">
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
      <keep-alive>
        <component @getCatalog="getCatalog" :is="curComponent" :cataData="curCatalog"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import apptDictCatalog from "./components/apptDictCatalog";
import apptDictManagement from "./components/apptDictManagement";

export default {
  name: "apptDict",
  data() {
    return {
      activeName: "catalog",
      tabParams: [
        {
          label: "预约字典目录",
          cont: "1",
          name: "catalog",
          component: apptDictCatalog,
          disabled: false
        },
        {
          label: "预约字典",
          cont: "2",
          name: "dictionary",
          component: apptDictManagement,
          disabled: true
        }
      ],
      curComponent: apptDictCatalog,
      curCatalog: {}
    };
  },
  methods: {
    handleClick(tab, event) {
      this.curComponent = tab.$attrs.component;
    },
    // 医保字典目录触发emit
    getCatalog(data) {
      this.curCatalog = data;
      const index = 1;
      let name = this.$options.data().tabParams[index].label;
      let flag = true;
      /* 传过来data则把医保字典tab栏名称加上医保字典目录名称，并允许医保字典tab点击
       * 如果传过来的是空对象，则反之
       */
      if (JSON.stringify(data) !== "{}") {
        flag = false;
        name = `${name}-${data.dictName}`;
      }
      this.$set(this.tabParams, index, {
        ...this.tabParams[index],
        disabled: flag,
        label: name
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tabs-new-style /deep/ .el-tabs__item.is-disabled {
  cursor: not-allowed;
}
.tab-cont {
  height: calc(100% - 30px);
}
</style>