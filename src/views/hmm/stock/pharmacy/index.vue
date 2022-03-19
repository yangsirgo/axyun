<template>
  <div class="container" ref="page">
    <div class="left">
      工具栏
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import adHeight from '@/mixins/adHeight'
  export default {
    mixins:[adHeight],
    name: 'index',
    data(){
      return{

      }
    }
  }
</script>
<style lang="scss" scoped>
  .container{
    overflow:hidden;
    margin-top: 30px;
  }
  .left{
    float: right;
    width:287px;
    height: 100%;
  }
  .right{
    margin-right:307px;
    height:100%;
  }
</style>
