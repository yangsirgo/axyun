<template>
  <div class="contain">
    <div class="dialog-header">
      <el-form :model="accountRechargeForm" :rules="rules" ref="formElem">
        <div class="detail">
          <div class="inputs clearfix">
            <el-row :gutter="10">
              <el-col :span="8" v-if="pageType">
                <LFormtTitle
                  :required="true"
                  label="诊断类型"
                  labelWidth="76"
                  style="width: 100%"
                >
                  <el-form-item
                    prop="diagType"
                    :rules="[
                      {
                        required: true,
                        message: '请选择诊断类型',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <!-- <el-select
                      v-model="accountRechargeForm.diagType"
                      placeholder="请选择"
                      style="line-height: 34px;width:100%"
                    >
                      <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>-->
                    <l-value-domain
                      :code="codeDiagType"
                      :value.sync="accountRechargeForm.diagType"
                      class="select-container"
                      placeholder="请选择"
                    />
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="8">
                <LFormtTitle
                  :required="true"
                  label="中/西医"
                  labelWidth="68"
                  style="width: 100%"
                >
                  <el-form-item label label-width prop="cwFlag">
                    <!-- <el-select
                      v-model="accountRechargeForm.cwFlag"
                      placeholder="请选择"
                      style="line-height: 34px;width:100%"
                    >
                      <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>-->
                    <l-value-domain
                      :code="codeCwFlag"
                      :value.sync="accountRechargeForm.cwFlag"
                      class="select-container"
                      placeholder="请选择"
                      @change="cwFlagChange"
                    />
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="diagMain">
                  <!-- <l-value-domain
                      :code="codeDiagmain"
                      :value.sync="accountRechargeForm.diagMain"
                      class="select-container"
                      placeholder="请选择"
                  />-->
                  <el-checkbox v-model="accountRechargeForm.diagMain"
                    >主诊断</el-checkbox
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-top: 20px">
              <el-col :span="8">
                <LFormtTitle
                  :required="true"
                  label="诊断名称"
                  labelWidth="96"
                  style="width: 100%"
                >
                  <el-form-item label label-width prop="diagCode">
                    <!-- <el-select
                      v-model="accountRechargeForm.diagName"
                      placeholder="请选择"
                      style="line-height: 34px;width:100%"
                    >
                      <el-option
                        v-for="item in options5"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>-->
                    <!-- <diagNameList :value.sync="accountRechargeForm.diagCode" @change="getDiagItem" /> -->
                    <l-value-domain
                      v-if="accountRechargeForm.cwFlag === '1'"
                      style="line-height: 34px; width: 100%"
                      remoteUrl="/patDiag/getIcd10Dictionary"
                      :remoteParams="remoteParams"
                      :value.sync="accountRechargeForm.diagCode"
                      placeholder="请输入诊断名称"
                      remoteShowKey="dictionaryName"
                      remoteValueKey="icd10Encoding"
                      class="input-width-default"
                      @change="diagNameChange"
                    ></l-value-domain>
                    <el-select
                      v-else
                      class="width100"
                      v-model="accountRechargeForm.diagCode"
                      placeholder="请输入诊断名称"
                    ></el-select>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="8">
                <LFormtTitle
                  :required="true"
                  label="初复诊"
                  labelWidth="62"
                  style="width: 100%"
                >
                  <el-form-item label label-width prop="isFirst">
                    <!-- <el-select
                      v-model="accountRechargeForm.isFirst"
                      placeholder="请选择"
                      style="line-height: 34px;width:100%"
                    >
                      <el-option
                        v-for="item in options4"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>-->
                    <l-value-domain
                      :code="codeIsfirst"
                      :value.sync="accountRechargeForm.isFirst"
                      class="select-container"
                      placeholder="请选择"
                    />
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="8">
                <LFormtTitle
                  :required="false"
                  label="发病日期"
                  labelWidth="62"
                  style="width: 100%"
                >
                  <el-form-item label prop="startTime">
                    <el-date-picker
                      v-model="accountRechargeForm.startTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      placeholder
                      :picker-options="pickerOptions"
                      style="line-height: 34px; width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <LFormtTitle
                :required="false"
                label="诊断描述"
                labelWidth="99"
                style="width: 100%"
              >
                <el-form-item label label-width prop="diagIcd">
                  <el-input
                    v-model="accountRechargeForm.diagIcd"
                    placeholder
                    style="line-height: 34px; width: 100%"
                  ></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer clearfix" style="padding-bottom: 0" slot="footer">
      <div style="float: right">
        <el-button
          type="primary"
          @click="confirm"
          :loading="submitLoad"
          v-hotKey="{ func: 'func_submit', flag: 'submitLoad' }"
          >确认登记</el-button
        >
        <el-button @click="cancel">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from "@/utils/index";
import { addDiag, getCardByICD } from "@/api/common/diagnosis";
import diagNameList from "./diagNameList";

import { mapActions } from "vuex";

export default {
  name: "diagnosisAdd",
  components: { diagNameList },
  props: [
    "patientId",
    "inpCode",
    "visitCode",
    "diagDoctorId",
    "diagDoctorName",
    "deptId",
    "deptName",
    "clinicType",
    "hdm",
    "table",
    "hosType"
  ],
  computed: {
    // 判断是门诊的还是住院的
    pageType() {
      return this.clinicType === "3";
    },
    // 是否有主诊断
    hasDiagMain() {
      return this.hdm;
    },
    // 患者诊断数量
    diagLength() {
      return this.table.length;
    }
  },
  data() {
    return {
      // 诊断类型类型数据code
      codeDiagType: "DiseaseDiagnosisCategoryCode",
      // 类型值
      diagType: "",

      // 中西医类型数据code
      codeCwFlag: "CWM",
      // 类型值
      cwFlag: "",

      // 是否主诊断类型数据code
      codeDiagmain: "diagMain",
      // 类型值
      diagmain: "",

      // 初复诊类型数据code
      codeIsfirst: "FirstOrNo",
      // 类型值
      isfirst: "",

      // 诊断名称类型值
      diagName: "",

      options1: [
        {
          value: "0",
          label: "家床"
        },
        {
          value: "1",
          label: "门诊"
        }
      ],
      options2: [
        {
          value: "0",
          label: "中医"
        },
        {
          value: "1",
          label: "西医"
        }
      ],
      options3: [
        {
          value: "0",
          label: "主诊断"
        },
        {
          value: "1",
          label: "次诊断"
        }
      ],
      options4: [
        {
          value: "0",
          label: "初诊"
        },
        {
          value: "1",
          label: "复诊"
        }
      ],
      options5: [
        {
          value: "0",
          label: "咽喉炎"
        }
      ],
      accountRechargeForm: {
        diagType: "",
        cwFlag: "1",
        diagIcd: "",
        diagMain: "",
        isFirst: "",
        startTime: new Date().format("yyyy-MM-dd HH:mm"),
        elementId: "",
        id: "",
        diagName: "", //诊断名称
        diagCode: ""
      },
      rules: {
        cwFlag: [
          { required: true, message: "请选择中/西医", trigger: "change" }
        ],
        diagIcd: [
          { required: false, message: "请输入诊断描述", trigger: "blur" }
        ],
        diagMain: [
          { required: false, message: "请选择主诊断", trigger: "change" }
        ],
        isFirst: [
          { required: true, message: "请选择初复诊", trigger: "change" }
        ],
        startTime: [
          { required: false, message: "请选择发病日期", trigger: "change" }
        ],
        diagCode: [
          { required: true, message: "请选择诊断名称", trigger: "change" }
        ]
      },
      radio: "1",
      remoteParams: { pageSize: 10 },
      submitLoad: false,
      // 发病日期只允许选择今天之前
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  methods: {
    ...mapActions({
      changeRef: "diagnosis/changeRef"
    }),
    confirm() {
      if (
        this.hosType == "3" &&
        this.diagLength === 0 &&
        !this.accountRechargeForm.diagMain
      ) {
        this.$message.warning("当前患者没有诊断，请添加主诊断!");
        return;
      }
      if (this.hasDiagMain && this.accountRechargeForm.diagMain) {
        this.$message.warning("已有主诊断!");
        return;
      }
      const startTime = this.accountRechargeForm.startTime;
      const fbTime = startTime.replace(/-/g, "/");
      if (new Date(fbTime) > Date.now()) {
        this.$message.warning("请选择正确的发病日期");
        return;
      }
      this.$refs["formElem"].validate(async valid => {
        if (valid) {
          let data = deepClone(this.accountRechargeForm);
          if (this.clinicType == "1") {
            data.visitCode = this.visitCode;
          } else if (this.clinicType == "3") {
            data.inpCode = this.inpCode;
          }
          data.patientId = this.patientId;
          data.diagDoctorId = this.diagDoctorId;
          data.diagDoctorName = this.diagDoctorName;
          data.deptId = this.deptId;
          data.deptName = this.deptName;
          //传入就诊类型是门诊or住院 clinicType：就诊类型1:门诊  2：急诊  3：住院
          data.clinicType = this.clinicType;
          // diagType：诊断类型  2:门诊诊断 3:家床诊断
          if (!data.diagType) {
            data.diagType = this.clinicType == "1" ? "2" : "3";
          }
          data.diagMain ? (data.diagMain = "1") : (data.diagMain = "0");
          data.status = "1";
          this.submitLoad = true;
          addDiag(data)
            .then(async res => {
              if (res.code === 1) {
                this.$message.success("添加成功");
                if (this.hosType === "1") {
                  this.goBaoka(data);
                }
                this.changeRef();
                this.rest();

                this.$emit("rechargeConfirm", false);
              } else {
                this.$message.error(res.msg || "添加失败");
              }
              this.submitLoad = false;
            })
            .catch(err => {
              // this.$message.error(err || "添加失败");
              this.submitLoad = false;
            });
        }
      });
    },
    rest() {
      this.$refs["formElem"].resetFields();
    },
    cancel() {
      this.$emit("rechargeCancel");
      this.$refs["formElem"].resetFields();
    },
    // 获取诊断名称跟代码
    diagNameChange(item, cur) {
      this.$set(this.accountRechargeForm, "diagName", cur.dictionaryName);
    },
    // 中西医切换
    cwFlagChange(val) {
      if (val === "2") {
        this.$set(this.accountRechargeForm, "diagCode", "");
        this.$set(this.accountRechargeForm, "diagName", "");
      }
    },
    goBaoka(data) {
      this.loadSwitch(true);
      getCardByICD({
        diagCode: data.diagCode,
        cardSource: "1",
        pid: this.patientId
      })
        .then(result => {
          this.loadSwitch(false);
          if (result.result !== 0) {
            this.$confirm("确认跳转到填写报卡页面吗？")
              .then(_ => {
                this.$router.push({
                  path: "/cisOne/infectious",
                  query: {
                    diagName: data.diagName,
                    diagCode: data.diagCode,
                    cardSource: "1",
                    pid: this.patientId
                  }
                });
              })
              .catch(_ => {});
          }
        })
        .catch(error => {
          this.loadSwitch(false);
          this.$message.error(error.msg || "报卡接口错误!");
        });
    },
    loadSwitch(val) {
      this.$parent.cardLoading = val;
    }
  }
};
</script>

<style scoped lang="scss">
.contain {
  width: 100%;
  height: 100%;
  padding: 0 20px;
}

.dialog-header {
  width: 100%;
}
.detail {
  margin-bottom: 18px;
}

.dialog-footer {
  padding: 20px 0 20px 0;
  border-top: 1px solid rgba(228, 228, 228, 1);

  .plain-button {
    width: 80px;
    height: 36px;
    background: $l-color-white;
    border-radius: 2px;
    font-size: $l-font-size;

    font-weight: 400;
    color: $l-color-primary;
    border: 1px solid $l-color-primary;
  }
}
</style>
