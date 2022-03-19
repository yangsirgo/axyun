<template>
  <el-button
    size="mini"
    @click.stop="endingClick()"
    plain
    type="primary"
    v-loading="bLoading"
  >结束</el-button>
</template>

<script type="text/ecmascript-6">
import { stopVisitAjax } from "@/api/cis/visit/visit";

export default {
  props: ["visiId"],
  data() {
    return {
      bLoading: false
    };
  },
  components: {},
  methods: {
    async endingClick() {
      this.$confirm("确认结束就诊吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        this.stopVisitAjax();
      });
    },
    async stopVisitAjax() {
      this.bLoading = true;
      try {
        let { data, msg, code } = await stopVisitAjax(this.visiId);
        if (code == 1) {
          this.$message.success(msg || "结束就诊成功");
          this.$emit("endSuccess");
        } else {
          this.$message.error(msg || "结束就诊失败");
        }
      } catch (error) {
        this.$message.error(msg || "结束就诊失败");
      } finally {
        this.bLoading = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
