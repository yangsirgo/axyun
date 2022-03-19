<template>
  <div class="contain">
    <div class="dialog-header">
      <slot name="top"></slot>
    </div>
    <div class="dialog-footer" slot="footer">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "conLayout"
};
</script>

<style lang="scss" scoped>
.contain {
  .dialog-header {
    padding: 0 20px;
  }
  .cardtitle {
    height: 14px;
    line-height: 14px;
    padding: 20px 0;
    overflow: hidden;
    /deep/ .titleleft {
      margin-right: 0;
      .report-cont-title {
        font-weight: bold;
        font-size: $l-font-size;
      }
      &::before {
        height: 14px;
        margin-top: 0;
      }
    }
  }
  /deep/ .cardtitle {
    height: auto;
    line-height: 1;
    padding: 20px 0;
    overflow: hidden;
    .titleleft {
      margin-right: 0;
      .report-cont-title {
        font-weight: bold;
        font-size: $l-font-size;
      }
      &::before {
        height: 14px;
        margin-top: 0;
      }
    }
  }
  .patient-info {
    .patient-item {
      display: inline-block;
      margin-right: 50px;
      margin-bottom: 20px;
      &:last-child {
        margin-right: 0;
      }
      span {
        color: $l-color-fontcolor-4;
      }
      em {
        font-style: normal;
        color: $l-color-fontcolor-3;
        &.link-word {
          color: $l-color-fontcolor-2;
          font-weight: bold;
        }
      }
    }
  }
  /deep/ .item-box {
    font-size: 0;
    .el-form-item {
      display: inline-block;
      width: 170px;
      margin-left: 10px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .text-box {
    margin-bottom: 20px;
    color: $l-color-fontcolor-3;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .ptb20 {
    padding: 20px 0;
  }

  .dialog-footer {
    padding: 20px;
    text-align: right;
  }
}
</style>
