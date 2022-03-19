<template>
  <div class="contain">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0"
      class="demo-ruleForm"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="useRange">
            <l-formt-title :required="true" label="模版类型">
              <el-select
                v-model="ruleForm.useRange"
                placeholder="请选择"
                style="line-height: 34px;width:100%"
                @change="setTemType($event)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <!-- <l-value-domain
                      :code="codeDiagType"
                      :value.sync="accountRechargeForm.diagType"
                      class="select-container"
                      placeholder="请选择"
              />-->
            </l-formt-title>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="deptId">
            <l-formt-title :disabled="true" label="共享科室">
              <el-input
                v-model="ruleForm.deptId"
                disabled
                placeholder="请输入内容"
              ></el-input>
            </l-formt-title>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="tempName">
        <l-formt-title :required="true" label="模板名称" :disabled="true">
          <el-input v-model="ruleForm.tempName" placeholder="请输入" disabled></el-input>
        </l-formt-title>
      </el-form-item>
    </el-form>
    <div class="text-align-right">
      <el-button
        type="primary"
        @click="confirm"
        :loading="submitLoad"
        v-hotKey="{ func: 'func_save', flag: 'submitLoad' }"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import { saveTemplate } from "@/api/common/diagnosis";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "SaveTem",
  props: ["asd", "selectArr"],
  data() {
    return {
      ruleForm: {
        useRange: "",
        deptId: "",
        tempName: ""
      },
      rules: {
        useRange: [{ required: true, message: "请选择", trigger: "change" }],
        deptId: [{ required: false, message: "请输入", trigger: "blur" }],
        tempName: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      options: [
        {
          label: "个人",
          value: "1"
        },
        {
          label: "科室",
          value: "2"
        }
      ],
      submitLoad: false
    };
  },
  computed: {
    // 获取登录用户信息
    ...mapGetters("user", ["role"]),
    rowData() {
      return this.selectArr;
    }
  },
  watch: {
    selectArr: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log('this.selectArr---',this.selectArr)
        if (this.selectArr.length == 1) {
          this.ruleForm.tempName = this.selectArr[0].diagName
        }else{
          this.$message.warning("只能单条保存模板!");
          this.ruleForm.tempName = ''
        }
        
      }
    },
    reloadDataFlag() {
      this.reLoadData();
    }
  },
  mounted() {
    // console.log('this.selectArr',this.selectArr)
    // this.ruleForm.tempName = this.selectArr.length>0?this.selectArr[0].diagName||'':''//"hhhh"
  },
  methods: {
    setTemType(val) {
      if (val === "1") {
        this.$set(this.ruleForm, "deptId", "");
      } else {
        this.$set(this.ruleForm, "deptId", this.role.deptName);
      }
    },
    confirm() {
      console.log(this.selectArr)
      if (this.selectArr.length == 1) {
          
      }else{
        this.$message.warning("请选择一条记录再保存模板!");
        return
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoad = true;
          saveTemplate({
            ...(this.ruleForm.useRange === "2"
              ? { deptId: this.role.deptId }
              : { doctorId: this.role.userId }),
            tempName: this.ruleForm.tempName,
            useRange: this.ruleForm.useRange,
            tempDoctorDiag: this.rowData
          })
            .then(res => {
              if (res.code === 1) {
                this.$message.success("保存模板成功");
                this.$refs.ruleForm.resetFields();
                this.$root.eventHub.$emit("saveTemRefresh");
                this.$emit("dialogVisibleFalse");
              } else {
                this.$message.error(res.msg || "保存模板失败");
              }
              this.submitLoad = false;
            })
            .catch(err => {
              this.$message.error(err || "保存模板失败");
              this.submitLoad = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  /deep/ .el-form-item__content {
    height: 36px;
  }
  /deep/ .el-form-item {
    margin-bottom: 18px;
  }
}
</style>
