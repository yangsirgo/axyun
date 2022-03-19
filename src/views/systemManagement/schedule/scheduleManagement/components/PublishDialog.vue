<template>
  <div class="publishDialog">
    <el-dialog :visible.sync="isVisible" width="460px" :show-close="false">
      <div class="dialog-main">
        <div class="icon-box">
          <i style="font-size:24px;color:#F7A820" class="el-icon-warning"></i>
        </div>
        <div class="message-box">
          <p>发布排班信息</p>
          <p>排班发布后，挂号信息将会更新</p>
          <p>确定发布吗？</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="publish-button" @click="handlePublish">发布</el-button>
        <el-button class="cancle-button" @click="handleCancle">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "publishDialog",
  data() {
    return { 
      isVisible: false,
    };
  },
  methods: {
    openDialog() {
      this.isVisible = true;
    },
    handlePublish() {
      this.isVisible = false;
      this.$emit("publishSchedule");
    },
    handleCancle() {
      this.isVisible = false;
      this.$message("排班发布取消!");
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/.publishDialog {
  .el-dialog {
    border-radius: 4px;
    .el-dialog__header {
      border: none;
    }
    .el-dialog__body {
      position: relative;
      .dialog-main {
        .icon-box {
          position: absolute;
          left: 53px;
        }
        .message-box {
          margin-left: 87px;
          font-size: $l-font-size;
          line-height: 20px;
          font-weight: 400;
          p:first-of-type {
            font-size: $l-font-size-max;
            line-height: 24px;
            margin-bottom: 10px;
            color: $l-color-fontcolor-3;
          }
          p:nth-of-type(2) {
            color: $l-color-fontcolor-2;
          }
          p:nth-of-type(3) {
            color: $l-color-fontcolor-4;
          }
        }
      }
    }
    .dialog-footer {
      .publish-button,
      .cancle-button {
        width: 80px;
        height: 36px;
        border-radius: 2px;
        border: 1px solid $l-color-primary;
        color: $l-color-primary;
      }
      .publish-button {
        color: #fff;
      }
    }
  }
}
</style>
