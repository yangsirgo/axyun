<template>
  <div class="page height100">
    <l-card-title class="title">
      <span slot="left">申请单属性维护</span>
    </l-card-title>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item
        label="医生姓名"
        prop="doctorName"
      >
        <el-input v-model="ruleForm.doctorName"></el-input>
      </el-form-item>
      <el-form-item
        label="员工编号"
        prop="yGNo"
      >
        <el-input v-model="ruleForm.yGNo"></el-input>
      </el-form-item>
      <el-form-item
        label="医生职称"
        prop="doctorTitle"
      >
        <el-input v-model="ruleForm.doctorTitle"></el-input>
      </el-form-item>
      <el-form-item
        label="处方权"
        prop="cfQ"
      >
        <el-checkbox-group v-model="ruleForm.cfQ">
          <el-checkbox label="0">西药</el-checkbox>
          <el-checkbox label="1">中成药</el-checkbox>
          <el-checkbox label="2">中草药</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="医保处方权"
        prop="ybCfQ"
      >
        <el-radio-group v-model="ruleForm.ybCfQ">
          <el-radio label="1">有</el-radio>
          <el-radio label="0">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="麻醉药品处方权"
        prop="mzCfQ"
      >
        <el-radio-group v-model="ruleForm.mzCfQ">
          <el-radio label="1">有</el-radio>
          <el-radio label="0">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="毒性药品处方权"
        prop="dxypCFW"
      >
        <el-radio-group v-model="ruleForm.dxypCFW">
          <el-radio label="1">有</el-radio>
          <el-radio label="0">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="精神药品处方权"
        prop="jsCfQ"
      >
        <el-radio-group v-model="ruleForm.jsCfQ">
          <el-radio label="0">精1</el-radio>
          <el-radio label="1">精2</el-radio>
          <el-radio label="2">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="抗菌药品处方权"
        prop="kjypCfQ"
      >
        <el-radio-group v-model="ruleForm.kjypCfQ">
          <el-radio label="0">特殊级</el-radio>
          <el-radio label="1">限制级</el-radio>
          <el-radio label="2">非限制级</el-radio>
          <el-radio label="3">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="手术主刀权"
        prop="sszQ"
      >
        <el-radio-group v-model="ruleForm.sszQ">
          <el-radio label="1">有</el-radio>
          <el-radio label="0">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
      >
        <el-select
          v-model="ruleForm.status"
          placeholder="请选择"
        >
          <el-option
            label="启用"
            value="0"
          ></el-option>
          <el-option
            label="停止"
            value="1"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
      >保存</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      ruleForm: {
        doctorName: "",
        yGNo: "",
        doctorTitle: "",
        cfQ: [],
        ybCfQ: "",
        mzCfQ: "",
        dxypCFW: "",
        jsCfQ: "",
        kjypCfQ: "",
        sszQ: "",
        status: "1"
      },
      rules: {
        doctorName: [
          { required: false, message: "请输入医生姓名", trigger: "blur" }
        ],
        yGNo: [{ required: false, message: "请输入员工编号", trigger: "blur" }],
        status: [{ required: false, message: "请选择状态", trigger: "blur" }]
      }
    };
  },
  components: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  padding: 10px;
  .demo-ruleForm {
    margin-top: 20px;
    flex: 1;
  }
  .btn {
    height: auto;
    text-align: right;
  }
}
</style>
