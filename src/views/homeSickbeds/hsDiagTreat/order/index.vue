<template>
  <div class="page height100">
    <western-medicine ref="advice"></western-medicine>
  </div>
</template>

<script type="text/ecmascript-6">
//  import westernMedicine from "./module/westernMedicine2.vue";
// import westernMedicine from "./module/hsMainTable.vue";
import westernMedicine from "./module/hsVxMainTable.vue";

export default {
  data() {
    return {};
  },
  components: {
    westernMedicine
  },
  methods: {
    //处理tabs 级页面切换逻辑
    additionHandler(addition = []) {
      this.$nextTick(() => {
        addition.forEach(item => {
          // 设置 长期 短期医嘱的选中
          if (item.name === "setAdviceType") {
            console.log(item.value);
            this.$refs.advice.setAdviceType(item.value);
          }
        });
      });
    },
    messageHandler() {
      this.$refs.advice.fetchTableList();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
