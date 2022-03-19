<template>
  <div class="wrapper">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "flow-menu",
};
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
</style>
