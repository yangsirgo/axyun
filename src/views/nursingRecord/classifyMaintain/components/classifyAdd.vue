<template>
  <div class="classifyAdd">
    <div class="cont">
      <el-form :model="classifyAddForm" :rules="rules" ref="classifyAddForm">
        <el-row class="margin-bottom-20">
          <LFormtTitle label="分类编码" disabled>
            <el-form-item prop="classCode">
              <el-input
                v-model="classifyAddForm.classCode"
                style="line-height: 34px; width: 100%"
                placeholder="自动生成"
                disabled
              >
              </el-input>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row class="margin-bottom-20">
          <LFormtTitle label="分类名称" required>
            <el-form-item prop="className">
              <el-input
                v-model="classifyAddForm.className"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              >
              </el-input>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row class="margin-bottom-20">
          <LFormtTitle label="分类排序">
            <el-form-item prop="classSort">
              <el-input-number
                v-model="classifyAddForm.classSort"
                controls-position="right"
                :min="1"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              ></el-input-number>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row style="margin-bottom: 10px">描述</el-row>
        <el-row class="margin-bottom-20">
          <el-form-item prop="classNote">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入"
              v-model="classifyAddForm.classNote"
            >
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer clearfix">
      <div class="float-right">
        <el-button type="primary" @click="confirm">确认</el-button>
        <el-button type="primary" plain @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { saveOrUpdateDocClass } from "@/api/emrRecord/nursingRecord/classifyMaintain";

export default {
  name: "classifyAdd",
  data() {
    return {
      classifyAddForm: {},
      rules: {
        className: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      }
    };
  },
  props: ["form"],
  watch: {
    form: {
      handler(n) {
        this.classifyAddForm = {};
        this.classifyAddForm = { ...n };
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    confirm() {
      this.$refs["classifyAddForm"].validate(async valid => {
        if (valid) {
          this.$showLoading();
          try {
            let form = {
              ...this.classifyAddForm
            };
            let data = await saveOrUpdateDocClass(form);
            if (data.code == "1") {
              this.$emit("classifyAddConfirm", false);
              this.$refs["classifyAddForm"].resetFields();
            } else {
              this.$message.error(data.msg || "保存失败");
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "保存失败");
          }
        }
      });
    },
    //取消
    cancel() {
      this.$emit("classifyAddCancel", false);
      this.$refs["classifyAddForm"].resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
.classifyAdd {
  .margin-bottom-20 {
    margin-bottom: 20px;
  }

  .cont {
    padding: 40px 90px;
  }

  .dialog-footer {
    padding: 20px;
    border-top: 1px solid $l-color-bgcolor-11;
  }
}
</style>
