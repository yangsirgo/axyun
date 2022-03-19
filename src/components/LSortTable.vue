<template>
  <div class="sort-table width100 height100">
    <vxe-grid
      :align="tableAlign"
      :data="tableData"
      :loading="loading"
      v-bind="$attrs"
      v-on="$listeners"
      resizable
      style="width: 100%"
      height="100%"
      empty-text="没有更多数据了！"
      border
      highlight-hover-row
    >
    </vxe-grid>
  </div>
</template>

<script>
export default {
  name: "LSortTable",
  components: {},
  props: {
    tableAlign: {
      type: String,
      default: "center"
    },
    loading: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      required: true,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
</style>
