<template>
  <div class="right-card">
    <div class="top-con">
      <span>
        <el-button type="primary" @click="returnDrug">退药</el-button>
        <el-button @click="cancelReturnDrug">取消</el-button>
      </span>
      <LDatePickerwithTitle
        style="margin-left:60px;"
        :title="title"
        :value="selectValue"
      >
      </LDatePickerwithTitle>
    </div>
    <div class="middle-con">
      <LCheckBoxCon></LCheckBoxCon>
    </div>
    <el-dialog
      title="退药医嘱"
      :visible.sync="dialogVisible"
      width="450px"
      :before-close="handleClose"
    >
      <div class="sign-confirm-middle">
        <p class="graged-title">
          退药原因（必填）
        </p>
        <el-input
          type="textarea"
          style="margin-top:10px;"
          :autosize="{ minRows: 8 }"
          placeholder="请输入至少五个字符"
          resize="none"
          v-model="textareaValue"
        >
        </el-input>
      </div>
      <div slot="footer" class="sign-confirm-footer">
        <span class="dialog-footer">
          <el-button type="primary" @click="handleClose">再看看</el-button>
          <el-button @click="handleConfirm">退回</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LDatePickerwithTitle from "./LDatePickerwithTitle";
import LCheckBoxCon from "./LCheckBoxCon";
export default {
  name: "",
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.textareaValue = "";
    },
    handleConfirm() {
      // 异步提交请求

      this.handleClose();
    },
    // 退药点击事件
    returnDrug() {
      this.dialogVisible = true;
    },
    // 点击取消按钮
    cancelReturnDrug() {
      this.$confirm(
        "取消退药后，药房将按需进行配药并发药， 你要继续吗?",
        "取消退药",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.$message({
            type: "success",
            message: "取消成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  },
  components: {
    LDatePickerwithTitle,
    LCheckBoxCon
  },
  data() {
    return {
      title: "用药时间",
      selectValue: ["2019-09-11T16:00:00.000Z", "2019-10-17T15:59:59.000Z"],
      dialogVisible: false,
      textareaValue: ""
    };
  }
};
</script>

<style lang='scss' scoped>
.right-card {
  padding: 20px;
  .middle-con {
  }
  .sign-confirm-middle {
    padding: 20px;
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    line-height: 20px;
  }
  /deep/ .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }
}
</style>
