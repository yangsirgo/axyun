<template>
  <div style="padding: 10px;">
    <slot></slot>
    <div class="btn-loadMore">
      <el-button type="text" style="font-size: 13px;" :loading="tL_isLoading" :disabled="tL_noMore" @click="loadMore">{{tL_noMore?'没有更多':'加载更多'}}</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LTimeLineLoadMore",
    props:{
      tL_isLoading: { // 当前请求状态
        type: Boolean,
        default: false,
        required: true
      },
      tL_noMore: { // 此属性为 按钮禁用
        type: Boolean,
        default: false
      }
    },
    methods: {
      loadMore (){
        if(!this.tL_noMore && !this.tL_isLoading) {
          this.$emit('handleLoadMore')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .el-button.is-loading:before{
    background-color: transparent;
  }
  .btn-loadMore{
    
    text-align: center
  }
</style>
