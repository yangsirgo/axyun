<template>
  <div class="title-box">
    <span class="title">{{ title }}</span>
    <div class="box-contain">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  methods: {},
  components: {},
  data() {
    return {};
  }
};
</script>

<style lang='scss' scoped>
.title-box {
  letter-spacing: 0;
  vertical-align: top;
  position: relative;
  display: inline-block;
  background-color: #fff;
  .title {
    display: inline-block;
    padding: 0 10px;
    background-color: #fff;
    color: #2e323a;
    font-size: 16px;
    position: absolute;
    left: 30px;
    top: -8px;
    z-index: 100;
  }
  .box-contain {
    padding: 15px;
    width: 100%;
    min-width: 240px;
    height: 100%;
    min-height: 100px;
    border: 1px solid #ebeef5;
    border-radius: 2px;
  }
}
</style>
