<template>
  <div class="authorityMaintain width100 height100">
    <el-card class="card-cont width100 height100">
      <el-tabs v-model="activeName">
        <!-- <el-tab-pane label="科室" name="dep">
          <dep-maintain v-if="activeName==='dep'"></dep-maintain>
        </el-tab-pane> -->
        <el-tab-pane label="角色" name="role">
          <role-maintain v-if="activeName==='role'"></role-maintain>
        </el-tab-pane>
        <el-tab-pane label="用户" name="user">
          <user-maintain v-if="activeName==='user'"></user-maintain>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import depMaintain from './components/depMaintain';
  import roleMaintain from './components/roleMaintain';
  import userMaintain from './components/userMaintain';

  export default {
    name: "index",
    components: {
      depMaintain,
      roleMaintain,
      userMaintain
    },
    data() {
      return {
        activeName: 'role'
      }
    }
  }
</script>

<style lang="scss">
  .authorityMaintain {
    .el-tabs.el-tabs--top {
      height: 100%;

      .el-tabs__content {
        height: calc(100% - 55px);
      }
    }

    .card-cont {
      padding: 20px;
    }
  }
</style>
