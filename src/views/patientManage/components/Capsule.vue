<template>
  <div class="capsule">
    <div class="icon-box">
        <slot name="icon">
            <i class="el-icon-edit"></i>
        </slot>
    </div>
    <div class="detail-box">
        <slot name="detail">
            乙肝检查
        </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "capsule",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
.capsule{
    .icon-box{
        position: relative;
        width: 36px;
        height: 36px;
        display: inline-block;
        border-radius: 50%;
        background-color: $l-color-primary;
        line-height: 36px;
        text-align: center;
        color: #fff;
        
        &::after{
        content: '';
        width: 18px;
        height: 4px;
        position: absolute;
        top: 14px;
        right: -18px;
        background-color: $l-color-primary;
        }
    }
    .detail-box{
        display: inline-block;
        margin-left: 14px;
        width: auto;
        height: 36px;
        border: 3px solid $l-color-primary;
        line-height: 30px;
        text-align: center;
        border-radius: 16px;
        padding: 0 5px;
    }
}
</style>
