<template>
  <el-button
    size="mini"
    @click.stop="clearClick()"
    v-loading="bLoading"
  >清空</el-button>
</template>

<script type="text/ecmascript-6">
import { resetPatVisitAjax } from "@/api/cis/visit/visit";
import { resetEmrAjax } from "@/api/emrRecord/cis/patientList.js";

export default {
  props: ["visiId", "hosId", "visitCode"],
  data() {
    return {
      bLoading: false
    };
  },
  components: {},
  methods: {
    async clearClick() {
      
      this.$confirm(
        "您将清除当前所书写的全部内容,并取消本次接诊,请确认是否清空?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(async () => {
        try {
          await this.resetAjax();
        } catch (error) {
          return;
        }

        await this.clearEmrAjax();
        this.$message.success("操作成功");
        this.$emit("clearSuccess");
      });
    },
    alertShow(msg) {
      this.$alert(msg, "操作错误信息", {
        // dangerouslyUseHTMLString: true
      });
    },
    //电子病历清空
    async clearEmrAjax() {
      return new Promise(async (resolve, reject) => {
        this.bLoading = true;
        try {
          let { data, msg, code } = await resetEmrAjax(this.hosId, this.visitCode);
          //   console.log(data, msg, code);
          if (code == 1) {
            // this.$message.success(msg || "操作成功");
            // this.$emit("clearSuccess");
            resolve(true);
          } else {
            //   this.$message.error(msg || "操作失败");
            // this.alertShow(msg || "操作失败");
            reject(false);
          }
        } catch (error) {
          // this.$message.error(msg || "操作失败");
          // console.log(error);
          //   let { data = {} } = error;
          //   let { msg } = data;
          //   this.alertShow(msg || "操作失败");
          reject(false);
        } finally {
          this.bLoading = false;
        }
      });
    },
    // 患者的就诊记录清空
    async resetAjax() {
      return new Promise(async (resolve, reject) => {
        this.bLoading = true;

        try {

          let { data, msg, code } = await resetPatVisitAjax(this.visiId);
          console.log(data, msg, code);
          if (code == 1) {
            // this.$message.success(msg || "操作成功");
            resolve(true);
          } else {
            //   this.$message.error(msg || "操作失败");
            this.alertShow(msg || "操作失败");
            reject(false);
          }
        } catch (error) {
          // this.$message.error(msg || "操作失败");
          // console.log(error);
          let { data = {} } = error;
          let { msg } = data;
          this.alertShow(msg || "操作失败");
          reject(false);
        } finally {
          this.bLoading = false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
