<template>
  <div class="container height100">
    <div class="left height100 float-left">
      <ul>
        <li
          v-for="(item,index) in tabs"
          :key="index"
          :class="[{active:currentTab===item.id}]"
          @click="currentTab=item.id"
        >{{item.label}}</li>
      </ul>
    </div>
    <div class="right height100 float-left">
      <component class="tab height100" :is="currentTabComponent"></component>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentTab: "inpwTemp",
      tabs: [
        // tab标签名及对应组件名
        // 新添加的模板组件 请将对应lebel和组件名添加在此数组下
        { label: "家床", id: "inpwTemp" },
        { label: "门诊", id: "outpatientTemp" },
        { label: "药房药库", id: "drugManagementTemp" }
      ]
    };
  },
  components: {
    outpatientTemp: () => import("./modules/outpatientTemp"),
    inpwTemp: () => import("./modules/inpwTemp"),
    drugManagementTemp: () => import("./modules/drugManagementTemp")
  },
  computed: {
    currentTabComponent: function() {
      return this.currentTab;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  overflow: hidden;
  .left {
    width: 195px;
    background-color: #ffffff;
    overflow-y: auto;
    padding: 40px;
    li {
      color: #949da3;
      margin-bottom: 20px;
      cursor: pointer;
    }
    li:hover,
    .active {
      color: $l-color-primary;
      font-weight: bold;
    }
  }
  .right {
    padding: 20px;
    width: calc(100% - 205px);
    margin-left: 10px;
    background-color: #ffffff;
    overflow: hidden;
  }
}
</style>
