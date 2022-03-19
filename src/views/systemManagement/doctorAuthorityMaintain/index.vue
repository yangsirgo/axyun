<template>
  <div class="page height100">
    <div class="left height100">
      <leftMaintable></leftMaintable>
    </div>
    <div class="right height100">
      <rightForm></rightForm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import leftMaintable from "./module/leftMaintable.vue";
import rightForm from "./module/rightForm.vue";

export default {
  data() {
    return {};
  },
  components: {
    leftMaintable,
    rightForm
  }
};
</script>

<style scoped lang="scss">
.page {
  display: flex;
  background-color: #fff;
  .left {
    flex: 1;
    // background-color: green;
  }
  .right {
    width: 480px;
    // background-color: red;
  }
}
</style>
