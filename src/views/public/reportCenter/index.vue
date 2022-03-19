<template>
  <div class="applicat width100 height100">
    <report :patien="receivePatientData.patientId" class="height100"></report>
    <!-- <report patien="402845926d7febfc016d7feeea6d0010" class="height100"></report> -->
  </div>
</template>
<script>
import report from "./report.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    report
  },
  // patientId:病患id; type:报告类型（检查、检验）
  props: ["patientId", "type"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters("cis", ["receivePatientData"])
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.applicat {
  overflow: hidden;
  background: $l-color-white;
  border-radius: 4px;
  .contleft {
    height: 100%;
    .el-tabs__header {
      height: 100%;
      background: $l-color-bgcolor-18;
    }
    .el-tabs__header.is-left {
      margin-right: 2px;
    }
    .el-tabs__content {
      height: 100%;
    }
  }
}
</style>