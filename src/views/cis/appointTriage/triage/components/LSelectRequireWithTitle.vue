<template>
  <div class="l-select-wrap">
    <el-form-item v-bind="$attrs" :label="title" :rules="rules">
      <el-select
        @change="change"
        v-bind="$attrs"
        v-model="selectValue"
        v-on="$listeners"
      >
        <slot></slot>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "LSelectRequireWithTitle",
  props: {
    propItem: {
      type: String,
      require: false
    },
    title: {
      type: String,
      require: true
    },
    value: {
      type: String
    },
    rules: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      selectValue: ""
    };
  },
  watch: {
    value(newValue) {
      this.selectValue = newValue;
    }
  },
  methods: {
    change() {
      this.$emit("update:value", { value: this.selectValue });
    }
  }
};
</script>

<style lang="scss" scoped>
$titleColor: rgba(148, 157, 163, 1);

.l-select-wrap {
  display: inline-block;
  white-space: nowrap;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  box-sizing: border-box;
  transition: 0.1s;
  font-weight: 500;
  padding-left: 10px;
  font-size: 14px;
  border-radius: 4px;
  line-height: 36px;
  width: 190px;

  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-form-item__label {
    position: relative;
  }
  /deep/
    .el-form-item.is-required:not(.is-no-asterisk)
    > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk)
    .el-form-item__label-wrap
    > .el-form-item__label:before {
    font-size: 20px;
    position: absolute;
    right: 0;
    top: 2px;
    margin-right: 0px;
  }
  /deep/ .el-select {
    width: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    border-right: 1px solid #e4e4e4;
  }
  /deep/ .el-select > .el-input {
    width: calc(100% - 10px);

    position: relative;
  }
  /deep/ .el-select > .el-input:before {
    content: "";
    position: absolute;
    left: 0;
    top: 11px;
    width: 1px;
    height: 15px;
    background-color: #e4e4e4;
  }
  /deep/ .el-input__inner {
    border: 0;
    vertical-align: 0;
    padding-left: 8px;
    line-height: 1;
  }

  /deep/ .el-input--medium .el-input__inner {
    font-size: 14px;
    
    font-weight: 400;
    line-height: 34px;
    height: 34px;
  }
  /deep/.el-input--suffix .el-input__inner {
    padding-right: 10px;
  }
  /deep/.el-input__suffix {
    right: -6px;
  }
}
</style>
