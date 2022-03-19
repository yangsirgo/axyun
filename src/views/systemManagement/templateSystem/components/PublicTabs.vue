<template>
  <div class="publicTabs">
    <el-card class="tabs-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="个人模版" name="person">
          <slot name="person">个人模版</slot>
        </el-tab-pane>
        <el-tab-pane label="科室模版" name="department">
          <slot name="department">科室模版</slot>
        </el-tab-pane>
        <el-tab-pane label="全院模版" name="hospital">
          <slot name="hospital">全院模版</slot>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "publicTabs",
  data() {
    return {
      activeName: "person"
    };
  },
  methods: {
  }
};
</script>

<style lang='scss' scoped>
/deep/.publicTabs {
  height: 100%;
  .tabs-card {
    height: 100%;
    padding: 0 20px;
    .el-card__body {
      height: 100%;
      .el-tabs {
        height: 100%;
        .el-tabs__content {
          height: 100%;
          .el-tab-pane{
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
