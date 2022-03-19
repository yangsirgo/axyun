<template>
  <!-- <div class="page height100"> -->
  <el-tabs
    ref="sideTabs"
    :class="sideTabsCls"
    v-model="activeName"
    @tab-click="handleClick"
  >
    <el-tab-pane
      v-for="(item, index) in tabsName"
      :key="index"
      :label="item.label"
      :name="item.value"
    >
      <direct-check-left-bar
        v-if="item.value == 'first'"
        ref="directcheckleftbar"
        :activeName="activeName"
        @choosePatientFun="choosePatientFun"
        @addnew="addnewFun"
      ></direct-check-left-bar>
      <finish-check-left-bar
        v-else-if="item.value == 'second'"
        ref="finishcheckleftbar"
        :activeName="activeName"
        @choosePatientFun="choosePatientFun"
      ></finish-check-left-bar>
      <residentApplicList
        v-else-if="item.value == 'third'"
        ref="residentApplicList"
        :activeName="activeName"
        @choosePatientFunResid="choosePatientFunResid"
      ></residentApplicList>
    </el-tab-pane>
  </el-tabs>
  <!-- </div> -->
</template>

<script type="text/ecmascript-6">
import { mapActions } from "vuex";

import finishCheckLeftBar from "@/views/ipnw/etHospital/createBedApply/components/finishCheckLeftBar.vue";
import directCheckLeftBar from "@/views/ipnw/etHospital/createBedApply/components/directCheckLeftBar.vue";
import residentApplicList from "@/views/ipnw/etHospital/createBedApply/components/residentApplicList.vue";

/**
 * 设置activeName 方法（setActiveName）:
 * 1. 设置 el-tabs 组件选中 tabs 页签。
 * 2. 向父组件派发tabsChange事件。
 *
 *
 * handleClick 方法：
 * 1. 向父组件派发tabsChange事件。
 * 1. 向父组件传递当前页签。
 *
 * finishcheckleftbarSearch 方法：
 * 1. 触发 finishcheckleftbar 组件 的 search 方法。
 * 2. 如果存在入参 selectedItem，会设置 selectedItem 患者的状态为选中。
 * 1. 触发患者查询。
 * 2. 选中目标患者
 *
 * directcheckleftbarSearch 方法：
 * 1. 触发 directcheckleftbar 组件 的 search 方法。
 * 2. 如果存在入参 selectedItem，会设置 selectedItem 患者的状态为选中。
 * 1. 触发历史患者查询。
 * 2. 选中目标患者
 *
 * choosePatientFun 方法：
 * 1. 患者选中的事件，并向父组件派发
 *
 * addnewFun  方法：
 * 1. 新建档案的方法。
 *
 *
 *
 */

export default {
  name: "leftBar",
  data() {
    return {
      activeName: "first",
      tabsName: [
        {
          label: "患者查询",
          value: "first"
        },
        {
          label: "历史申请",
          value: "second"
        },
        {
          label: "居民申请",
          value: "third"
        }
      ]
    };
  },
  components: {
    finishCheckLeftBar,
    residentApplicList,
    directCheckLeftBar
  },
  computed: {
    sideTabsCls() {
      return {
        height100: true,
        "penetrate-tabs": true,
        "son-padding-left": true,
        sideTabs: true,
        singleTabCls: this.tabsName.length === 1
      };
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    setActiveName(name) {
      this.activeName = name;
      this.handleClick(this.activeName);
    },
    finishcheckleftbarSearch(selectedItem) {
      this.$refs.finishcheckleftbar &&
        this.$refs.finishcheckleftbar[0].search(selectedItem);
    },
    directcheckleftbarSearch(selectedItem, isSelectPatient = true) {
      this.$refs.directcheckleftbar &&
        this.$refs.directcheckleftbar[0].search(selectedItem, isSelectPatient);
    },
    residentApplicListSearch(selectedItem, isSelectPatient = true) {
      this.$refs.residentApplicList &&
        this.$refs.residentApplicList[0].search(selectedItem, isSelectPatient);
    },
    //左侧列表转换tab
    handleClick(tab) {
      this.$emit("tabsChange", this.activeName);
      if (tab.name == "second") {
        this.finishcheckleftbarSearch();
      } else if(tab.name == "third") {
        this.residentApplicListSearch({}, false);
      } else {
        this.directcheckleftbarSearch(null, false);
      }
    },
    choosePatientFun(item) {
      this.$emit("choosePatientFun", item);
    },
    choosePatientFunResid (item){
      this.$emit("choosePatientFunResid", item);
    },
    // 新建档案
    addnewFun(inputnum, a) {
      this.$emit("addnewFun");
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .son-padding-left > .el-tabs__header {
  padding-left: 10px;
}

/deep/ .l-table .l-table-total {
  z-index: 10;
}
</style>
