<template>
  <div class="page">
    <div class="drugInfo">
      XX药品为【精神一类】或者【精神二类】或【麻醉药品】，患者档案未实名，请验证患者身份信息
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0px"
      class="demo-ruleForm"
    >
      <el-form-item
        label=""
        prop="repName"
        v-if="isReplace"
      >
        <l-formt-title label="代办人姓名">
          <el-input v-model="ruleForm.repName"></el-input>
        </l-formt-title>

      </el-form-item>
      <el-form-item
        label=""
        prop="repIphone"
        v-if="isReplace"
      >
        <l-formt-title label="代办人手机号">
          <el-input v-model="ruleForm.repIphone"></el-input>
        </l-formt-title>
      </el-form-item>

      <el-form-item prop="identificationType">
        <l-formt-title label="证件类型">
          <l-value-domain
            code="MARK_TYPE_CODE"
            :value.sync="ruleForm.identificationType"
          />
        </l-formt-title>
      </el-form-item>
      <el-form-item
        label=""
        prop="idCard"
      >
        <l-formt-title label="证件号">
          <el-input v-model="ruleForm.idCard"></el-input>
        </l-formt-title>

      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      ruleForm: {
        idCard: "",
        identificationType: "",
        repName: "",
        repIphone: ""
      },
      isReplace: true,
      rules: {
        identificationType: {},
        idCard: {},
        repName: {},
        repIphone: {}
      }
    };
  },
  components: {},
  methods: {
    validateFiled() {
      return new Promise((resolve, reject) => {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
.page {
    padding: 16px 20px;
  .drugInfo {
    font-size: 14px;
    font-weight: 400;
    color: #2e323a;
    margin-bottom: 8px;
  }
}
</style>
