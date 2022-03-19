<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" top="0" class="dialog-style">
    <div class="dialog-content">
      <slot name="content"></slot>
    </div>
    <span slot="footer">
      <template v-if="!customBottom">
        <el-button
          v-if="showConfirmButton"
          class="footer-btn"
          type="primary"
          @click="confirm"
          >确认</el-button
        >
        <el-button
          v-if="showCancelButton"
          class="footer-btn"
          type="primary"
          plain
          @click="cancel"
          >关闭</el-button
        >
      </template>
      <slot v-else name="footerContent"></slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "LDialog",
  props: {
    // 是否显示确认按钮
    showConfirmButton: {
      type: Boolean,
      default: true,
    },
    // 是否显示关闭按钮
    showCancelButton: {
      type: Boolean,
      default: true,
    },
    // 是否自定义底部按钮
    customBottom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    // 确定
    confirm() {
      this.$emit("confirm");
    },
    // 取消
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-style {
  text-align: center;
  &::after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
  }
  /deep/ .el-dialog {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  /deep/ .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid $l-color-bgcolor-11;
  }
  .footer-btn {
    width: 80px;
  }
}
</style>
