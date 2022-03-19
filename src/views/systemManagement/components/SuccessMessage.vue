<template>
  <div class="publicMessage">
    <el-dialog class="success-dialog" width="186px" :visible.sync="isOpen" :show-close="false">
      <div class="dialog-main">
        <i style="font-size:24px;color:#3D7DFB" class="el-icon-success"></i>
        <span>{{message}}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "publicMessage",
  data() {
    return {
      isOpen: false
    };
  },
  props: { message: String },
  methods: {}
};
</script>

<style lang='scss' scoped>
/deep/.publicMessage {
  .success-dialog {
    border-radius: 4px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    .el-dialog__header {
      height: 0;
      padding: 0;
      border: none;
    }
    .el-dialog__body {
      height: 65px;
      padding: 20px;
      .dialog-main {
        i {
          vertical-align: middle;
        }
        span {
          font-size: $l-font-size-max;
          font-weight: 400;
          line-height: 24px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
