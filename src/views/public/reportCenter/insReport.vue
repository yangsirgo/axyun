<template>
  <div class="width100 height100 position-relative">
    <div class="list-container height100">
      <list :patien="receivePatientData.patientId" @detail="showDetail"></list>
    </div>
    <div class="detail-container height100">
      <ins-report-detail :itemdata="info" v-bind="$attrs"></ins-report-detail>
    </div>
  </div>
</template>
<script>
import List from "./component/insList";
import insReportDetail from "./component/insReportDetail";
import { mapGetters } from "vuex";

export default {
  components: {
    List,
    insReportDetail
  },
  data() {
    return {
      // 报告ID
      info: ""
    };
  },
  computed: {
    ...mapGetters("cis", ["receivePatientData"])
  },
  methods: {
    showDetail(data) {
      this.info = data;
    }
  }
};
</script>
<style lang="scss" scoped>
.position-relative {
  background-color: $l-color-white;
}
.list-container {
  float: left;
  padding: 20px;
}
.detail-container {
  margin-left: 368px;
  border-left: 1px solid $l-color-bgcolor-11;
}
</style>
