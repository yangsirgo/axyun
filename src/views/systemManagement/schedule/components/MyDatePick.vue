<template>
  <div class="l-select-wrap">
    <div class="l-select-body">
      <span class="l-select-title">出诊日期</span>
      <span class="l-select-gap"></span>
      <el-date-picker
        v-model="visitDate"
        type="daterange"
        range-separator="-­­"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <i class="iconfont iconriqi"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "mySelect",
  data() {
    return {
      visitDate:''
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
$titleColor: #949DA3;

.l-select-wrap {
  display: inline-block;
  // white-space: nowrap;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  box-sizing: border-box;
  margin-right: 5px;
  transition: 0.1s;
  font-weight: 500;
  padding-left: 10px;
  font-size: 14px;
  border-radius: 2px;
  line-height: 34px;
  width: 320px;
  vertical-align: top;

  .l-select-body {
    width: 100%;
    height: 100%;
    position: relative;
    display: inline-block;

    .l-select-title {
      font-size: 14px;
      
      font-weight: 400;
      color: $titleColor;
      line-height: 34px;
    }

    .l-select-gap {
      width: 1px;
      padding: 0 8px;
      display: inline-block;
      &:before {
        content: "";
        position: absolute;
        top: calc(50% - 7px);
        width: 1px;
        height: 14px;
        background: rgba(228, 228, 228, 1);
      }
    }
    .iconriqi{
        position: absolute;
        right: 10px;
        color:$l-color-fontcolor-4;
    }
    /deep/ .el-date-editor {
      width: auto;
      height: 34px;
      padding: 1px 10px 1px 4px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 80px;
    }
    /deep/ .el-date-editor > .el-icon-date{
        display: none;
    }
    /deep/ .el-date-editor >  .el-range__close-icon{
      position: relative;
    }
    /deep/ .el-date-editor > .el-range-separator{
        padding: 0;
        text-align: center;
        color:#CECFD4;
    }
    /deep/ .el-date-editor > .el-range-input {
      width: 80px;
    }
    /deep/ .el-input__inner {
      border: 0;
      vertical-align: 0;
      padding-left: 4px;
      line-height: 1;
    }
  }
}
</style>
