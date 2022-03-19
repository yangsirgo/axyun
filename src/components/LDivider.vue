<template>
  <div class="width100 container">
    <div class="line"></div>
    <span class="title">{{title}}</span>
  </div>
</template>
<script>
export default {
  props: ["title"],
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  margin: 10px 0;
}
.title {
  color: $l-color-text-regular;
  font-size: $l-font-size;
  margin-left: 10px;
}
.divider {
  width: 100%;
  height: 1px;
  background-color: $l-color-text-regular;
  margin: 5px 0;
  float: right;
}
.line {
  position: absolute;
  width: 5px;
  height: 90%;
  top: 10%;
  background-color: $l-color-primary;
  display: inline-block;
}
</style>
