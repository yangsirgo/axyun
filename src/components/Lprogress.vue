<template>
  <div class="progress">
    <div class="bar" :style="{width:barwhid + '%'}"></div>
    <!-- <div class="barround"></div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
   props: ["barwhid"]
};
</script>
<style lang="scss" scoped>
.progress {
  width: 100%;
  height: 4px;
  margin: 5px 0;
  background: #ffc8b6;
  .bar {
    float: left;
    height: 4px;
    background: $l-color-primary;
  }
//   .barround {
//     float: left;
//     width: 8px;
//     height: 8px;
//     margin-top: -3px;
//     border-radius: 4px;
//     background: $l-color-primary;
//   }
}
</style>