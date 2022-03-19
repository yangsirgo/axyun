<template>
  <div class="stopDialog">
    <el-dialog :visible.sync="isVisible" width="460px" :show-close="false">
      <div class="dialog-main">
        <div class="icon-box">
          <i style="font-size:24px;color:#F7A820" class="el-icon-warning"></i>
        </div>
        <div class="message-box">
          <p>停诊操作</p>
          <p>{{doctorinfo}}</p>
          <p>停诊后，挂号时无法选择此班次</p>
          <p>你要继续吗？</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="stop-button" @click="handleStop">停诊</el-button>
        <el-button class="cancle-button" @click="handleCancle">取消</el-button>
      </span>
    </el-dialog>
    <success-message ref="success" :message="message" />
  </div>
</template>

<script>
import successMessage from "@/views/systemManagement/components/SuccessMessage";
import { setTimeout } from "timers";
export default {
  name: "stopDialog",
  components: {
    successMessage
  },
  props: {
    doctorinfo: String
  },
  data() {
    return { isVisible: false, message: "停诊成功" };
  },
  methods: {
    openDialog() {
      this.isVisible = true;
    },
    handleStop() {
      this.isVisible = false;
      this.$refs.success.isOpen = true;
      setTimeout(() => {
        this.$refs.success.isOpen = false;
      }, 1000);
      // this.$message({
      //   message: "排班发布成功!",
      //   type: "success"
      // });
    },
    handleCancle() {
      this.isVisible = false;
      this.$message("停诊取消!");
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/.stopDialog {
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
          p:nth-of-type(1) {
            font-size: $l-font-size-max;
            line-height: 24px;
            color: $l-color-fontcolor-3;
          }
          p:nth-of-type(2) {
            margin: 10px 0;
            font-size: $l-font-size-max;
            line-height: 24px;
            color: $l-color-fontcolor-3;
            font-weight: $l-font-weight;
          }
          p:nth-of-type(3) {
            color: $l-color-fontcolor-2;
          }
          p:nth-of-type(4) {
            color: $l-color-fontcolor-4;
          }
        }
      }
    }
    .dialog-footer {
      .stop-button,
      .cancle-button {
        width: 80px;
        height: 36px;
        border-radius: 2px;
        border: 1px solid $l-color-primary;
        color: $l-color-primary;
      }
      .stop-button {
        width: auto;
        color: #fff;
      }
    }
  }
}
</style>
