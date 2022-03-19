<template>
  <div class="l-cell cursor-pointer" @click="$emit('click')">
    <span class="l-label">{{label}}</span>
    <span class="l-caret-wrapper" v-if="state !== 3">
      <i class="l-sort-caret ascending el-icon-caret-top" v-if="state == 0 || state == 2"></i>
      <i class="l-sort-caret descending el-icon-caret-bottom" v-if="state == 1 || state == 2"></i>
    </span>
  </div>
</template>

<script>
import { oneOf } from "@/utils/util.js";

export default {
  name: "LSortLabel",
  props: {
    label: {
      require: true
    },
    state: {
      validator(value) {
        //0 ascending
        //1 descending
        //2 all
        //3 none
        return oneOf(value, ["0", "1", "2", "3"]);
      },
      default: 2
    }
  }
};
</script>

<style scoped lang="scss">
.l-cell {
  position: relative;
  word-wrap: normal;
  vertical-align: middle;
  line-height: 1;
  display: inline-block;
  box-sizing: border-box;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  word-break: break-all;
  .l-caret-wrapper {
    height: 34px;
    width: 15px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
    display: inline-block;
    .l-sort-caret {
      position: absolute;
      left: 0;
      width: 6px;
      height: 6px;
    }
    .ascending {
      top: calc(50% - 14px);
    }
    .descending {
      top: calc(50% - 5px);
    }
  }
}
</style>
