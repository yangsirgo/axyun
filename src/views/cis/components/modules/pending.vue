<template>
  <el-button
    size="mini"
    @click.stop="pendingClick()"
    type="primary"
    v-loading="bLoading"
  >暂挂</el-button>
</template>

<script type="text/ecmascript-6">
import { suspendAjax } from "@/api/cis/visit/visit";

export default {
  props: ["visiId"],
  data() {
    return {
      bLoading: false
    };
  },
  components: {},
  methods: {
    async pendingClick() {
      this.$confirm("确认暂挂吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        this.suspendAjax();
      });
    },
    async suspendAjax() {
      this.bLoading = true;
      try {
        let { data, msg, code } = await suspendAjax(this.visiId);
        if (code == 1) {
          this.$message.success(msg || "暂挂成功");
          this.$emit("pendSuccess");
        } else {
          this.$message.error(msg || "暂挂失败");
        }
      } catch (error) {
        this.$message.error(msg || "暂挂失败");
      } finally {
        this.bLoading = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
