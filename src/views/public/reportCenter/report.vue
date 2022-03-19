<template>
  <div class="width100 height100 position-relative">
    <div class="list-container height100">
      <list v-bind="$attrs" @detail="showDetail"></list>
    </div>
    <div class="detail-container height100">
      <report-detail :itemdata="info" v-bind="$attrs"></report-detail>
    </div>
  </div>
</template>
<script>
import List from "./component/List";
import ReportDetail from "./component/ReportDetail";

export default {
  components: {
    List,
    ReportDetail
  },
  data() {
    return {
      // 报告ID
      info: ""
    };
  },
  methods: {
    showDetail(data) {
      this.info = data;
    }
  }
};
</script>
<style lang="scss" scoped>
.list-container {
  float: left;
  padding: 20px;
}
.detail-container {
  margin-left: 368px;
  border-left: 1px solid $l-color-bgcolor-11;
}
</style>
