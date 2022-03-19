<template>
  <div class="page">
      <span>统计信息：</span>   <span class="totalSpanCls"> 合计总金额：{{ total || "0.00" }}  ￥ </span>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
    props: ['total'],
  data() {
    return {

    }
  },
  components: {

  },
  methods: {
    getMyHeight (){
      return this.$el.offsetHeight;
    }
  }
}
</script>

<style scoped lang="scss">
.page {
    line-height: 30px;
    text-align: left;
    padding: 0 10px;
    font-weight: bold;
    .totalSpanCls {
      margin-left: 10px;
    }
}
</style>
