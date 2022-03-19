<template>
    <div class="anthroPogram-container" ref="page" :style="{'min-height': Number(imgHeight) + 20 + 'px'}">
      <div :class="position == 'bottom'?'img bottom':'img'" :style="{'width': Number(imgWidth)+'px', 'height': Number(imgHeight) + 'px'}">
        <img src="../assets/anthropogram.png" alt="" :style="{'width': Number(imgWidth) - 50 + 'px', 'height': Number(imgHeight) - 28 + 'px'}">
        <div class="right-box" :style="{height: Number(imgHeight) - 28 + 'px'}">
          <div></div>
          <span>{{height=='0'?'--':height}}cm</span>
        </div>
        <div class="bottom-box" :style="{width: Number(imgWidth) - 50 + 'px'}">
          <div></div>
          <span>{{weight=='0'?'--':weight}}kg</span>
        </div>
      </div>
      <div class="right-slot" :style="{width: position == 'bottom'?'100%': '50%', 'text-align': position == 'bottom'?'center':'left'}">
        <slot></slot>
      </div>
    </div>
</template>

<script>
  export default {
    name: "LAnthroPogram",
    props: {
      position: {
        type: String,
        default: 'right'
      },
      imgWidth: { // 人体图总宽度
        type: [String, Number],
        default: '126'
      },
      imgHeight: { // 人体图总高度
        type: [String, Number],
        default: '173'
      },
      height: { // 身高
        default: '--'
      },
      weight: { // 体重
        default: '--'
      }
    },
    data (){
      return {}
    }
  }
</script>

<style lang="scss" scoped>
  .anthroPogram-container{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    .img{
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      float: left;
    }
    .bottom{
      position: relative;
      height: 100%;
      float: left;
      margin-left: 50%;
      transform: translateX(-50%);
    }
    .right-slot{
      float: right;
    }
    .right-box{
      position: absolute;
      right: 0px;
      top: 0;
      width: 30px;
      border-top: 1px solid $l-color-bgcolor-11;
      border-bottom: 1px solid $l-color-bgcolor-11;
      div{
        position: absolute;
        left: 50%;
        top: 0;
        height: 100%;
        border-left: 1px solid $l-color-bgcolor-11;
      }
      span{
        width: 46px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: $l-color-bgcolor-11;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-size: 12px;
        color: $l-color-fontcolor-3;
      }
    }
    .bottom-box{
      position: absolute;
      left: 0px;
      bottom: 0px;
      height: 15px;
      border-left: 1px solid $l-color-bgcolor-11;
      border-right: 1px solid $l-color-bgcolor-11;
      div{
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        border-top: 1px solid $l-color-bgcolor-11;
      }
      span{
        width: 40px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background-color: $l-color-bgcolor-11;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-size: 12px;
        color: $l-color-fontcolor-3;
      }
    }
  }
</style>
