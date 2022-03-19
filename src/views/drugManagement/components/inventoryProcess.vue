<template>
  <div class="height100">
    <l-card-title class="title">
      <span slot="left">盘存流程</span>
    </l-card-title>
    <div class="process-box">
      <div class="process-info">
        <p>
          <span>盘存单号：</span>
        </p>
        <p>
          <span>盘存库房：</span>
        </p>
        <p>
          <span>盘存设定时间：</span>
        </p>
        <p>
          <span>盘存结束时间：</span>
        </p>
      </div>
      <div class="process-step">
        <el-steps direction="vertical" :active="process.listStatus" finish-status="success">
          <el-step title="流程开始" icon="filter-item iconfont icon-dianziyizhujiaohu1"></el-step>
          <el-step title="盘存设定" icon="filter-item iconfont icon-dianziyizhujiaohu1">
            <template slot="description" v-if="process.chargeUserName">
              <p>设定人员：{{ process.chargeUserName }}</p>
              <p>设定时间：{{ process.chargeTime }}</p>
            </template>
          </el-step>
          <el-step title="盘存窗口录入" icon="filter-item iconfont icon-dianziyizhujiaohu1"></el-step>
          <el-step title="盘存锁定" icon="filter-item iconfont icon-dianziyizhujiaohu1"></el-step>
          <el-step title="盘存校正" icon="filter-item iconfont icon-dianziyizhujiaohu1"></el-step>
          <el-step title="盘存结束" icon="filter-item iconfont icon-dianziyizhujiaohu1">
            <template slot="description" v-if="process.execDoctorName">
              <p>执行人员 {{ process.execDoctorName }}</p>
              <p>执行日期 {{ process.execTime }}</p>
            </template>
          </el-step>
          <el-step title="流程结束" icon="filter-item iconfont icon-dianziyizhujiaohu1"></el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "inventoryProcess",
  data() {
    return {
      process: {
        listStatus: 1
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.title {
  height: 40px;
  line-height: 40px;
  /deep/ .titleleft::before {
    margin-top: 10px;
  }
}
.process-info {
  font-size: 14px;
  p {
    position: relative;
    min-height: 30px;
    line-height: 30px;
    padding-left: 120px;
    word-break: break-all;
  }
  span {
    position: absolute;
    left: 0;
    display: inline-block;
    width: 120px;
    text-align: right;
  }
}
.process-step {
  height: 500px;
  /deep/ .el-step__description {
    font-size: $l-font-size;
  }
  /deep/ .el-step__icon {
    width: 16px;
  }
  .el-steps {
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 20px;
  }
  /deep/ .el-step__main {
    .is-success {
      color: $l-color-primary;
    }
  }
  /deep/ .el-step__head.is-success {
    border-color: $l-color-primary;

    .el-step__line {
      background-color: $l-color-primary;
    }

    .el-step__icon-inner.is-status {
      background-color: $l-color-primary;
      border-radius: 12px;
      padding: 2px;
      color: $l-color-white;
    }
  }

  /deep/ .el-step__title {
    color: $l-color-fontcolor-3;
    font-size: $l-font-size;
  }

  /deep/ .el-step__description {
    color: $l-color-fontcolor-4;
    font-size: $l-font-size;
  }

  /deep/ .el-step__head.is-process {
    color: $l-color-primary;
  }
}
</style>