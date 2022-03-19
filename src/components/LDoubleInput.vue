<template>
  <div :class="{'LDoubleInput':true,'width100':true}">
    <span class="left-cont" :style="{'width':widthRatio}">
      <slot name="left"></slot>
    </span>
    <span :class="{'line':true,'inputDisabled':disabled}">
      <span class="line-cont"></span>
    </span>
    <span class="right-cont" :style="{'width': 'calc(100% - 11px - '+widthRatio+')'}">
      <slot name="right"></slot>
    </span>
  </div>
</template>

<script>
  export default {
    name: "LDoubleInput",
    props: {
      widthRatio: {
        type: [String, Number],
        default: '50%'
      },
      disabled: {
        type: [Boolean],
        default: false
      }
    }
  }
</script>

<style lang="scss">
  .inputDisabled {
    background-color: $l-color-bgcolor-1 !important;
  }

  .LDoubleInput {
    height: 33px;
    border-radius: 2px;
    border: 1px solid $l-color-bgcolor-11;
    background-color: #fff;

    .line {
      float: left;
      height: 100%;
    }

    .line-cont {
      margin: 11px 0 0 10px;
      width: 1px;
      height: 14px;
      background-color: $l-color-bgcolor-11;
      display: inline-block;
      float: left;
    }

    .left-cont {
      display: inline-block;
      float: left;
      .el-input--suffix .el-input__inner {
        /*padding-right: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;*/
      }
    }

    .right-cont {
      display: inline-block;
      float: left;
    }

    .el-input__inner {
      height: 30px;
      border: none;
    }
  }

</style>
