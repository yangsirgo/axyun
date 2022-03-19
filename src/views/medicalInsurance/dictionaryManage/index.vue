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
        <component
          @getCatalog="getCatalog"
          @getDict="getDict"
          :is="curComponent"
          :dictData="curDict"
          :cataData="curCatalog"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import catalog from "./catalog/index";
import dictionary from "./dictionary/index";
import dictContrast from "./dictContrast/index";

export default {
  name: "dictionaryManage",
  data() {
    return {
      activeName: "catalog",
      tabParams: [
        {
          label: "医保字典目录",
          cont: "1",
          name: "catalog",
          component: catalog,
          disabled: false
        },
        {
          label: "医保字典",
          cont: "2",
          name: "dictionary",
          component: dictionary,
          disabled: true
        },
        {
          label: "医保字典对照",
          cont: "3",
          name: "dictContrast",
          component: dictContrast,
          disabled: true
        }
      ],
      curComponent: catalog,
      curCatalog: {},
      curDict: {}
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
        name = `${name}-${data.siDictCatalogName}`;
      }
      this.$set(this.tabParams, index, {
        ...this.tabParams[index],
        disabled: flag,
        label: name
      });
      // 医保字典目录发生变化，则禁止医保字典对照点击，并还原tab栏名称
      const name2 = this.$options.data().tabParams[2].label;
      this.$set(this.tabParams, 2, {
        ...this.tabParams[2],
        disabled: true,
        label: name2
      });
    },
    // 医保字典触发emit
    getDict(data) {
      this.curDict = data;
      const index = 2;
      let name = this.$options.data().tabParams[index].label;
      let flag = true;
      /* 传过来data则把医保字典对照tab栏名称加上医保字典目录名称，并允许医保字典对照tab点击
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