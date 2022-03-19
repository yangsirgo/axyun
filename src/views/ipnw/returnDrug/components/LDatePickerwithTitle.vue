<template>
  <div class="l-input-wrap" ref="inputWrap">
    <div class="l-input-body">
      <span class="l-input-title" ref="title">{{ title }}</span>
      <span class="l-input-gap" ref="gap"></span>

      <el-date-picker
        class="date-picker"
        style="width:300px"
        @change="changeValue"
        v-bind="$attrs"
        v-model="selectValue"
        v-on="$listeners"
        ref="datePickerInner"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: "LDatePickerwithTitle",
  components: {},
  methods: {
    changeValue() {
      console.log(123);
      this.$emit("change");
    }
  },
  props: {
    title: {
      type: String,
      require: true
    },
    value: {
      type: Array
    }
  },
  watch: {
    value() {
      this.selectValue = this.value;
    }
  },
  mounted() {
    var _this = this;
  },
  data() {
    return {
      selectValue: this.value
    };
  }
};
</script>

<style lang='scss' scoped>
$titleColor: rgba(148, 157, 163, 1);

.l-input-wrap {
  display: inline-block;
  white-space: nowrap;
  background: #fff;
  border: 1px solid #e4e4e4;
  color: rgba(148, 157, 163, 1);
  box-sizing: border-box;
  transition: 0.1s;
  font-weight: 500;
  font-size: 14px;
  border-radius: 4px;
  height: 40px;
  text-align: left;
  .l-input-body {
    width: 100%;
    height: 100%;
    position: relative;
    display: inline-block;
    font-size: 0;
    .l-input-title {
      font-size: 14px;
      
      font-weight: 400;
      color: $titleColor;
      line-height: 36px;
      display: inline-block;
      padding-left: 10px;
    }

    .l-input-gap {
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
    .date-picker {
      display: inline-block;
    }
    /deep/ .el-input__inner {
      height: 100%;
      border: 0;
      width: 100%;
      padding-left: 1px;
      padding-right: 4px;
      color: #2e323a;
      line-height: 1;
    }
    /deep/ .el-range-input {
      width: 35%;
    }
    /deep/ .el-range-separator {
      width: 10%;
    }
    /deep/ .el-input {
      width: 69%;
    }
    /deep/ .el-icon-date {
      float: right;
    }

    /deep/ .el-input-group__append {
      border: 0;
      background-color: unset;
      right: 2px;
      padding: 0;
      color: #2e323a;
    }
  }
}
</style>
