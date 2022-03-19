<template>
  <div class="l-card-icon">
    <i
      v-if="type=='collect'"
      class="el-icon-ali-solidheart iconfont right-icon"
      :class="[isCollect?'active-icon':'']"
      @click="collect"
    ></i>
    <i v-else class="el-icon-close iconfont right-icon" @click="del"></i>
    <slot>自定义内容</slot>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollect: false
    };
  },
  props: {
    type: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  created() {},
  methods: {
    collect() {
      this.isCollect = !this.isCollect;
      this.$emit("collect", this.infos, this.isCollect);
    },
    del() {
      this.$emit("del", this.infos);
    }
  }
};
</script>
<style lang="scss" scoped>

.l-card-icon {
  position: relative;
  overflow: hidden;
  padding: 5px 8px 10px;
  font-size: $l-font-size;
  background: $l-color-bgcolor-6;
  cursor: pointer;
  &:hover {
    background: $l-color-bgcolor-7;
  }
  .right-icon {
    position: absolute;
    top: 10px;
    right: 8px;
    color: $l-color-text-secondary;
    font-size: $l-font-size;
    z-index: 9999;
    cursor: pointer;
    &.active-icon {
      color: $l-color-primary;
    }
  }
}
</style>
