<template>
  <div class="l-input-wrap" ref="inputWrap">
    <div class="l-input-body">
      <span class="l-input-title" ref="title">{{ title }}</span>
      <span class="l-input-gap" ref="gap"></span>
      <el-input
        v-bind="$attrs"
        v-model="selectValue"
        v-on="$listeners"
        ref="inputInner"
      >
        <template slot="append" v-if="appendUnit">{{ appendUnit }}</template>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "LInputwithTitle",
  props: {
    title: {
      type: String,
      require: true
    },
    appendUnit: {
      type: String,
      require: false,
      default: ""
    },
    value: {
      type: String
    }
  },
  data() {
    return {
      selectValue: this.value
    };
  },
  methods: {
    setInnerInputWidth() {
      let wrapper = this.$refs.inputWrap;
      let title = this.$refs.title;
      let gap = this.$refs.gap;
      let inputInner = this.$refs.inputInner.$el;
      let inputInnerWith =
        wrapper.clientWidth - title.clientWidth - gap.clientWidth - 12;
      inputInner.style.width = inputInnerWith + "px";
    }
  },
  watch: {
    value() {
      this.selectValue = this.value;
    }
  },
  mounted() {
    var _this = this;
    this.$nextTick(() => {
      _this.setInnerInputWidth();
    });

    window.addEventListener("resize", function() {
      _this.setInnerInputWidth();
    });
  }
};
</script>

<style lang="scss" scoped>
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
  height: 38px;
  width: 240px;
  text-align: left;
  .l-input-body {
    width: 100%;
    height: 100%;
    position: relative;
    display: inline-block;
    font-size: 0;
    .l-input-title {
      font-size: 14px;
      font-family: SourceHanSansSC-Regular, serif;
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

    /deep/ .el-input--medium .el-input__inner {
      height: 100%;
      border: 0;
      width: 100%;
      padding-left: 1px;
      padding-right: 4px;
      color: #2e323a;
      line-height: 1;
    }
    /deep/ .el-input {
      width: 69%;
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
