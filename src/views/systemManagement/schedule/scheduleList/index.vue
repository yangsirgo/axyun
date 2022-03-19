<template>
  <div class="scheduleList">
    <el-card class="list-card">
      <list-search />
      <table-list />
    </el-card>
  </div>
</template>

<script>
import listSearch from "./components/ListSearch";
import tableList from "./components/TableList";
export default {
  name: "scheduleList",
  components: {
    listSearch,
    tableList
  },
  data() {
    return {};
  },

  methods: {}
};
</script>

<style lang='scss' scoped>
.scheduleList{
  height: 100%;
  .list-card{
    height: 100%;
  }
}
</style>
