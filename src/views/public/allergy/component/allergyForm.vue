<template>
  <div
    :class="[
      'allergy-form',
      status !== '' && !this.status.includes('echo') ? 'has-title' : '',
    ]"
  >
    <div class="report-top-title" style="margin-bottom: 8px">
      <l-card-title>
        <template slot="left" class="report-cont-title">{{
          addType[status] + "登记"
        }}</template>
      </l-card-title>
    </div>

    <div class="allergy-form-scroll">
      <div class="report-sub-title">患者信息</div>
      <el-form
        :model="form"
        ref="ruleForm"
        label-width="0"
        class="demo-ruleForm"
      >
        <el-row :gutter="6">
          <el-col :span="6">
            <span class="allergy-form-title">患者</span>
            <span>{{ receivePatientData.patientName || "--" }}</span>
          </el-col>
          <template v-if="$attrs.hosType == '1'">
            <el-col :span="6">
              <span class="allergy-form-title">门诊号</span>
              <span>{{ receivePatientData.visitCode || "--" }}</span>
            </el-col>
            <el-col :span="6">
              <span class="allergy-form-title">就诊科室</span>
              <span
                v-show="receivePatientData.patientId"
                tableName="sys_org"
                :conditionMap="{
                  org_type: '_DEPT_',
                  id: receivePatientData.ouptDeptId || '',
                }"
                columns="org_nm"
                v-tableTransform
                >--</span
              >
              <span v-show="!receivePatientData.patientId">--</span>
            </el-col>
            <el-col :span="6">
              <span class="allergy-form-title">医院</span>
              <span
                tableName="sys_org"
                :conditionMap="{
                  org_type: '_HOS_',
                  id: receivePatientData.hosId || '',
                }"
                columns="org_nm"
                v-tableTransform
                >--</span
              >
              <span v-show="!receivePatientData.patientId">--</span>
            </el-col>
          </template>
          <template v-else-if="$attrs.hosType == '3'">
            <el-col :span="8">
              <span class="allergy-form-title">住院号</span>
              <span>{{ receivePatientData.inpCode || "--" }}</span>
            </el-col>
            <el-col :span="8">
              <span class="allergy-form-title">就诊科室</span>
              <span
                v-show="receivePatientData.patientId"
                tableName="sys_org"
                :conditionMap="{
                  org_type: '_DEPT_',
                  id: receivePatientData.admissionSdeptId || '',
                }"
                columns="org_nm"
                v-tableTransform
                >--</span
              >
              <span v-show="!receivePatientData.patientId">--</span>
            </el-col>
          </template>
        </el-row>
        <div class="bdrtop"></div>
        <div class="report-sub-title">过敏信息</div>
        <div class="allergy-form-box clearfix">
          <el-row :gutter="8">
            <el-col :span="24"> </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item
                prop="registerTime"
                :rules="[
                  {
                    required: !this.status.includes('echo'),
                    message: '请选择日期',
                    trigger: 'change',
                  },
                ]"
              >
                <LFormtTitle
                  :required="!this.status.includes('echo')"
                  label="登记时间"
                  labelWidth="76"
                >
                  <el-date-picker
                    class="allergy-date"
                    v-model="form.registerTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    prefix-icon="icon iconfont iconriqi"
                    placeholder="选择日期时间"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="allergyId"
                :rules="[
                  {
                    required: !this.status.includes('echo'),
                    message: '请选择',
                    trigger: 'change',
                  },
                ]"
              >
                <LFormtTitle
                  :required="!this.status.includes('echo')"
                  label="过敏源"
                  :key="ergenCodeStr"
                  labelWidth="76"
                >
                  <l-value-domain
                    :code="ergenCodeStr"
                    :value.sync="form.allergyId"
                    @change="changeAllergy"
                    placeholder="请选择"
                  ></l-value-domain>
                </LFormtTitle>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item
                prop="symptomIds"
                :rules="[
                  {
                    required: !this.status.includes('echo'),
                    type: 'array',
                    message: '请选择',
                    trigger: 'change',
                  },
                ]"
              >
                <LFormtTitle
                  :required="!this.status.includes('echo')"
                  label="症状描述"
                >
                  <l-value-domain
                    remoteShowKey="name"
                    remoteValueKey="code"
                    multiple
                    clearable
                    code="AllergSymptomCode"
                    :value.sync="form.symptomIds"
                    placeholder="请选择"
                  ></l-value-domain>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col v-if="this.status.includes('0')" :span="12">
              <el-form-item
                prop="drugName"
                :rules="[
                  {
                    required: !this.status.includes('echo') && diugNdis,
                    message: '请输入',
                    trigger: 'blur',
                  },
                ]"
              >
                <LFormtTitle
                  class="more-selected"
                  :required="!this.status.includes('echo') && diugNdis"
                  label="过敏药品"
                >
                  <el-input
                    v-model="form.drugName"
                    :required="diugNdis"
                    placeholder="请输入内容"
                  ></el-input>
                </LFormtTitle>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item
                prop="symptomDescription"
                :rules="[
                  {
                    required: !this.status.includes('echo') && hasOther,
                    message: '请输入',
                    trigger: 'blur',
                  },
                ]"
                style="margin-bottom: 0"
              >
                <LFormtTitle
                  :disabled="!hasOther"
                  :required="!this.status.includes('echo') && hasOther"
                  label="其他症状描述"
                >
                  <el-input
                    maxlength="100"
                    v-model="form.symptomDescription"
                    placeholder="其他症状描述"
                    :disabled="!hasOther"
                  ></el-input>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="remark">
                <LFormtTitle label="备注" labelWidth="76">
                  <el-input v-model="form.remark" placeholder="备注"></el-input>
                </LFormtTitle>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="allergy-form-mask" v-show="status.includes('echo')"></div>
    </div>
    <div
      class="allergy-form-btn"
      v-show="status !== '' && !this.status.includes('echo')"
    >
      <el-button
        type="primary"
        :loading="submitLoad"
        v-hotKey="{ func: 'func_submit', flag: 'submitLoad' }"
        @click="register"
        >确认登记</el-button
      >
    </div>
    <div class="allergy-form-btn" v-show="status.includes('echo')">
      <el-button type="primary" :loading="submitLoad" @click="cancelRegister"
        >作废</el-button
      >
    </div>
  </div>
</template>

<script>
import { submitForm, cancelSubmitForm } from "@/api/allergy/index";
// import { mapGetters } from "vuex";
import { mapActions, mapGetters } from "vuex";
import { deepClone } from "@/utils/index";

export default {
  name: "allergyForm",
  props: {
    ainfo: Object
  },
  data() {
    return {
      ergenCodeStr: "AllergenCode",
      addType: {
        "0": "药物过敏",
        "1": "食物过敏",
        "2": "其他过敏"
      },
      // 备份患者信息
      pInfo: {},
      title: "新增登记",
      // 登记过敏的种类
      formtype: "",
      // 过敏源select
      allergeyCate: [
        {
          label: "头孢",
          value: "0"
        },
        {
          label: "青霉素",
          value: "1"
        },
        {
          label: "海鲜",
          value: "2"
        }
      ],
      // 实验方式select
      testWay: [
        {
          label: "皮下注射",
          value: "0"
        },
        {
          label: "皮内注射",
          value: "1"
        }
      ],
      form: {
        allergyId: "",
        allergyName: "",
        allergyCategory: "",
        symptomIds: [],
        remark: "",
        symptomDescription: "",
        registerTime: "",
        drugName: ""
      },
      // 表单loading
      submitLoad: false,
      // 登记时间不能超过今天
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      diugNdis: true
    };
  },
  computed: {
    // 获取病患信息
    ...mapGetters("base", ["receivePatientData"]),
    // 获取角色信息
    ...mapGetters("user", ["role"]),
    // 症状描述是否有其他
    hasOther() {
      return this.form.symptomIds.indexOf("99") > -1;
    },
    // 患者信息，过敏信息
    info() {
      return this.ainfo.data;
    },
    // 新增（0:药物过敏; 1:食物过敏; 2:造影剂过敏;）echo回显
    status() {
      let type = this.ainfo.type;

      return type;
    }
  },
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
        this.pInfo = {};
        if (val && val.patientId) {
          this.pInfo = val;
        }
        if (val) {
          for (let i in this.form) {
            this.$set(this.form, i, val[i]);
          }
          if (val.symptomIds) {
            const zzms = val.symptomIds.split(",");
            this.$set(this.form, "symptomIds", zzms);
          } else {
            this.$set(this.form, "symptomIds", []);
          }
        } else {
          if (this.$refs.ruleForm && this.$refs.ruleForm.resetFiled) {
            this.$refs.ruleForm.resetFiled();
          }
        }
      }
    },
    hasOther(val) {
      if (!val) {
        this.form.symptomDescription = "";
      }
    },
    status(val) {
      console.log(val, "valvalval");
      switch (val) {
        case "0":
          this.ergenCodeStr = "DrugAllergenCode";
          break;
        case "1":
          this.ergenCodeStr = "FoodAllergenCode";
          break;
        case "2":
          this.ergenCodeStr = "OtherAllergenCode";
          break;
        case "echo-0":
          this.ergenCodeStr = "DrugAllergenCode";
          break;
        case "echo-1":
          this.ergenCodeStr = "FoodAllergenCode";
          break;
        case "echo-2":
          this.ergenCodeStr = "OtherAllergenCode";
          break;
        default:
          this.ergenCodeStr = "AllergenCode";
          break;
      }

      if (val !== "0") {
        this.diugNdis = false;
      } else {
        this.diugNdis = true;
      }
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      changeReloadPatient: "base/changeReloadPatient"
    }),
    changeAllergy(val, cur) {
      this.$set(this.form, "allergyName", cur.name);
      if (this.status !== 0 && val === "99") {
        this.diugNdis = true;
      } else {
        this.diugNdis = false;
      }
    },
    register() {
      if (!this.receivePatientData.patientId) {
        this.$message.warning("请选择一个患者!");
        return;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const resDate = this.form.registerTime.replace(/-/g, "/");
          const resTime = new Date(resDate).getTime();
          const now = new Date().getTime();
          if (resTime > now) {
            this.$message.warning("登记时间不能大于当前时间");
            return;
          }
          this.submitLoad = true;
          let data = deepClone(this.form);
          data.symptomIds = data.symptomIds.join(",");
          let paramData = {};
          if (this.$attrs.hosType == "1") {
            paramData.visitCode = this.receivePatientData.visitCode;
          } else if (this.$attrs.hosType == "3") {
            paramData.inpCode = this.receivePatientData.inpCode;
          }
          submitForm({
            ...data,
            ...paramData,
            allergyCategory: this.status,
            status: "2",
            patientFrom: this.$attrs.hosType == "3" ? "2" : "1",
            patientId: this.receivePatientData.patientId,
            patientName: this.receivePatientData.patientName,
            userId: this.role.userId,
            ouptDeptName: this.role.deptName,
            ouptDeptCode: this.role.deptCode
          })
            .then(res => {
              if (res.code === 1) {
                this.changeReloadPatient({});
                this.$emit("load-list");
                this.$root.eventHub.$emit("refresh-wait-patientList");
                let addAllergyNamePatient = this.receivePatientData;
                this.$set(addAllergyNamePatient, "allergyName", addAllergyNamePatient.allergyName ? addAllergyNamePatient.allergyName + "," + this.form.allergyName : this.form.allergyName)
                // addAllergyNamePatient = {...addAllergyNamePatient,...{ allergyName: this.form.allergyName }}
                // console.log(addAllergyNamePatient.allergyName);
                this.changeRecPatientData(addAllergyNamePatient);
                // this.setPatientNewAllergyName();
                this.$message.success("登记成功");
                this.$refs.ruleForm.resetFields();
              } else {
                this.$message.error(res.msg || "登记失败");
              }
            })
            .catch(err => {
              this.$message.error(err || "登记失败");
            })
            .finally(() => {
              this.submitLoad = false;
            });
        }
      });
    },

    async cancelRegister() {
      if (!this.info.allergyInfoId) {
        this.$message.warning("请选择一条过敏信息!");
        return;
      }
      this.submitLoad = true;
      try {
        let res = await cancelSubmitForm({
          allergyInfoId: this.info.allergyInfoId
        });
        if (res.code === 1) {
          let patientInfo = this.receivePatientData;
          // delete this.receivePatientData.allergyName
          console.log(
            "+++++++++++++++++++++++++++++??",
            this.receivePatientData
          );
          console.log("+++++++++++++++++++++++++++++??", patientInfo);
          this.changeReloadPatient({});
          // this.changeRecPatientData({ ...patientInfo, ...{ allergyName: "" } });
          this.$root.eventHub.$emit("refresh-wait-patientList");
          let addAllergyNamePatient = this.receivePatientData;
          let arr = addAllergyNamePatient.allergyName.split(",");
          let newArr = arr.filter(item=>{
            return item != this.form.allergyName;
          });
          let allergyName = newArr.join(",");
          this.$set(addAllergyNamePatient, "allergyName", allergyName)
          this.changeRecPatientData(addAllergyNamePatient);

          this.$message.success("作废成功");
          this.$emit("load-list");
        } else {
          this.$message.error(res.msg || "作废失败");
        }
        this.submitLoad = false;
      } catch (e) {
        this.$message.error(e.msg || "作废失败");
        this.submitLoad = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.allergy-form {
  // position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 287px;
  padding: 16px;
  /deep/ .cardtitle {
    background: transparent;
    overflow: hidden;
    &.form-type {
      .titleright {
        float: none;
        margin-left: 120px;
      }
    }
    .titleleft::before {
      height: 20px;
      margin-top: 0;
    }
    .report-cont-title {
      font-weight: bold;
    }
  }
  .allergy-form-scroll {
    position: relative;
    flex: 1;
    padding-right: 16px;
    overflow: hidden;
    overflow-y: auto;
    .cardtitle {
      margin-bottom: 8px;
    }
  }
  .bdrtop {
    margin: 8px 0;
  }

  /deep/ .allergy-date {
    .el-input__inner {
      padding-left: 30px;
    }
  }
  .allergy-form-btn {
    font-size: 0;
    padding-top: 16px;
    border-top: 1px solid $l-color-bgcolor-11;
    text-align: right;
  }
  .allergy-form-title {
    display: inline-block;
    margin-right: 10px;
    color: $l-color-fontcolor-4;
  }
}
.required-txt {
  font-size: 14px;
  font-style: normal;

  vertical-align: middle;
  font-weight: bolder;
  color: $l-color-fontcolor-5;
}
.report-top-title {
  display: none;
}
.has-title {
  .report-top-title {
    display: flex;
  }
  // .allergy-form-scroll {
  //   top: 70px;
  //   bottom: 86px;
  // }
}
.report-sub-title {
  margin-bottom: 8px;
  color: $l-color-fontcolor-3;
  font-size: $l-font-size;
  font-weight: bold;
}
.more-selected {
  /deep/ .el-select__tags {
    height: 31px;
    overflow: hidden;
    overflow-y: auto;
  }
}

.allergy-form-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 10;
  opacity: 0.02;
  background-color: black;
}
</style>
