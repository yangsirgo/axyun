<template>
  <div class="page height100">
    <div class="left">
      <tableList></tableList>
    </div>
    <div class="right height100">
      <el-tabs  class="el-tabs-new-style height100">
        <el-tab-pane label="员工档案">
          <formList></formList>
        </el-tab-pane>
        <el-tab-pane label="简介">简介</el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import tableList from "./module/list.vue";
import formList from "./module/form.vue";

export default {
  data() {
    return {};
  },
  components: {
    tableList,
    formList
  }
};
</script>

<style scoped lang="scss">
.page {
  display: flex;
  background-color: #fff;
  .left {
  padding: 8px;
    flex: 1;
  }
  .right {
    flex: 1;
    padding: 8px;
  }
}
</style>
