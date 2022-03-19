<template>
  <div class="width100 height100 container">
    <div class="line-container table-title">
      <slot name="title"></slot>
    </div>
    <ul
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
      class="list-wrapper scroll_content overflow-scroll-vertical"
    >
      <li v-for="(item, index) in listData" :key="'list' + index" class="list-item line-container">
        <slot name="list" :data="item"></slot>
      </li>
    </ul>
    <p v-if="loading">加载中...</p>
    <p v-if="noMore">没有更多了</p>
  </div>
</template>
<script>
export default {
  props: ["params", "listData", "loading", "noMore"],
  data() {
    return {};
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    load() {
      this.$emit("load");
    }
  }
};
</script>
<style lang="scss" scope>
.container {
  border: 1px solid #e4e4e4;
}
.line-container {
  border-bottom: 1px solid #e4e4e4;
}
.table-title {
  background: $l-color-bgcolor-18;
}
.list-wrapper {
  overflow: scroll;
  height: 100%;
}
</style>