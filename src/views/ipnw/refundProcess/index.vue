<template>
  <div class="refund-process" ref="page">
    <div class="trigger" ref="triggerBtn" @click="shrinkHandler">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div v-if="show" class="left-con" id="left" ref="left">
      <patient :isMultiple="isMultiple"></patient>
    </div>
    <div :class="{ 'right-con-left': show }" class="right-con" ref="right">
      <rightCard></rightCard>
    </div>
  </div>
</template>

<script>
import patient from "../components/Patient";
import rightCard from "./components/rightCard";

import { addClass, removeClass, hasClass, getEleByCls } from "@/utils/util";
export default {
  name: "",
  methods: {
    shrinkHandler() {
      let tigerBen = this.$refs.triggerBtn;
      let box_content = this.$refs.page;
      if (hasClass(tigerBen, "triggerClosed")) {
        this.show = true;
        removeClass(tigerBen, "triggerClosed");
        removeClass(box_content, "centerShrieked");
      } else {
        this.show = false;
        addClass(tigerBen, "triggerClosed");
        addClass(box_content, "centerShrieked");
      }
    }
  },
  components: {
    patient,
    rightCard
  },
  data() {
    return {
      isMultiple: true,
      show: true
    };
  }
};
</script>

<style lang='scss' scoped>
$leftWidth: 287px;
$leftPartRight: 297px;

$bgc: rgba(255, 255, 255, 1);
$shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
.refund-process {
  min-width: 1024px;
  height: 100%;

  .trigger {
    position: absolute;
    top: calc(50% - 40px);
    height: 80px;
    left: 270px;
    width: 18px;
    z-index: 1000;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 2px 0px 0px 2px;
    cursor: pointer;

    > i {
      position: relative;
      color: $l-color-primary;
      top: 40%;
      left: 1px;
    }
  }
  .medicalOrderBox {
    width: 100%;
  }
  .triggerClosed {
    left: 0px;

    > i {
      transform: rotate(180deg);
    }
  }
  .centerShrieked {
    padding-left: 0;
    margin-left: 0;

    > .left {
      display: none;
    }
  }
  #left {
    width: $leftWidth;
    position: relative;
    padding-left: 0;
    display: block;
    box-sizing: content-box;
  }
  .left-con {
    float: left;
    height: 100%;
    background-color: $bgc;
    box-shadow: $shadow;
    border-radius: 4px;
  }
  .right-con {
    margin-left: 40px;
    height: 100%;
    background-color: $bgc;
    box-shadow: $shadow;
    border-radius: 4px;
  }
  .right-con-left {
    margin-left: 307px;
  }
}
</style>
