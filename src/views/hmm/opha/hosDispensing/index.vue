<template>
  <div class="three-column" ref="page">
    <div id="center" class="column">
      <div class="box">
        <router-view></router-view>
      </div>
    </div>
    <div id="left" class="column" ref="left">
      <div class="box">
        <left-list :timer="isOpen"></left-list>
      </div>
    </div>
    <div id="right" class="column" ref="right">
      <div class="box">
        我是工具箱
      </div>
    </div>
  </div>
</template>

<script>
  import adHeight from '@/mixins/adHeight.js'
  import LeftList from './components/leftList'
  export default {
    mixins:[adHeight],
    components: {
      LeftList
    },
    data() {
      return {
        isOpen: false, // 是否显示定时器
      }
    },
    created() {

    },
    methods: {

    }
  };
</script>
<style lang="scss">
  $leftWidth:287px;
  $rightWidth:287px;
  .three-column{
    min-width: 1024px;
    padding-left: $leftWidth;
    padding-right: $rightWidth;
    .column{
      float: left;
      height: 100%;
      .box{
        height: 100%;
        box-sizing: border-box;
        border-radius: 4px;
        text-align: center;
      }
    }
    #left{
      width: $leftWidth;
      margin-left: -100%;
      position: relative;
      right: $leftWidth;
      padding-left: 0;
    }
    #center{
      width: 100%;
      padding: 0 20px;
    }
    #right{
      margin-right:-$rightWidth;
      width: $rightWidth;
      padding-right: 0;
    }
  }
</style>

