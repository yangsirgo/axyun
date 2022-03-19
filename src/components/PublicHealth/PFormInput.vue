<template>
  <div class="PFormInput">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "PFormInput",
  props: {
    // label: {
    //   type: String,
    //   require: true
    // }
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
  updated() {},
  watch: {}
};
</script>

<style scoped lang="scss">
.PFormInput {
  /deep/.el-input__inner {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    // line-height: 40px;
    outline: none;
    // padding: 0px 15px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    width: 20px;
    max-height: 20px;
    line-height: 20px;
    padding: 0px;
    text-align: center;
  }
}
</style>
