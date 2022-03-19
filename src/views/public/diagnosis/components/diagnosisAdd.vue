<template>
  <div class="contain">
    <div class="dialog-header">
      <el-form :model="accountRechargeForm" :rules="rules" ref="formElem">
        <div class="detail">
          <div class="inputs clearfix">
            <el-row :gutter="10" style="margin-top: 20px">
              <el-col :span="12">
                <LFormtTitle label="诊断类型" labelWidth="76" style="width:100%">
                  <el-form-item label label-width prop="diagType">
                    <!--<el-select v-model="accountRechargeForm.diagType" placeholder="请选择"-->
                    <!--style="line-height: 34px;width:100%">-->
                    <!--<el-option-->
                    <!--v-for="item in options1"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                    <l-value-domain
                      :code="codeDiagType"
                      :value.sync="accountRechargeForm.diagType"
                      class="select-container"
                      placeholder="请选择"
                    />
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="12">
                <LFormtTitle label="中/西医" labelWidth="68" style="width:100%">
                  <el-form-item label label-width prop="cwFlag">
                    <!--<el-select v-model="accountRechargeForm.cwFlag" placeholder="请选择"-->
                    <!--style="line-height: 34px;width:100%">-->
                    <!--<el-option-->
                    <!--v-for="item in options2"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                    <l-value-domain
                      :code="codeCwFlag"
                      :value.sync="accountRechargeForm.cwFlag"
                      class="select-container"
                      placeholder="请选择"
                    />
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <LFormtTitle label="ICD诊断描述" labelWidth="99" style="width:100%">
                <el-form-item label label-width prop="diagIcd">
                  <el-input
                    v-model="accountRechargeForm.diagIcd"
                    placeholder
                    style="line-height: 34px;width:100%"
                  ></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-row>
            <el-row style="margin-top: 20px">
              <LFormtTitle label="诊断名称" labelWidth="96" style="width:100%">
                <el-form-item label label-width prop="diagName">
                  <!--<el-select v-model="accountRechargeForm.diagName" placeholder="请选择"-->
                  <!--style="line-height: 34px;width:100%">-->
                  <!--<el-option-->
                  <!--v-for="item in options5"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                  <!--</el-option>-->
                  <!--</el-select>-->
                  <l-value-domain
                    :value.sync="accountRechargeForm.diagName"
                    remoteUrl="http://192.168.198.244:8762/patDiag/getIcd10Dictionary"
                    remoteShowKey="dictionaryName"
                    remoteValueKey="icd10Encoding"
                    class="select-container"
                    placeholder="请选择"
                  />
                </el-form-item>
              </LFormtTitle>
            </el-row>
            <el-row :gutter="10" style="margin-top: 20px">
              <el-col :span="12">
                <LFormtTitle label="主诊断" labelWidth="62" style="width:100%">
                  <el-form-item label label-width prop="diagMain">
                    <!--<el-select v-model="accountRechargeForm.diagMain" placeholder="请选择"-->
                    <!--style="line-height: 34px;width:100%">-->
                    <!--<el-option-->
                    <!--v-for="item in options3"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                    <l-value-domain
                      :code="codeDiagmain"
                      :value.sync="accountRechargeForm.diagMain"
                      class="select-container"
                      placeholder="请选择"
                    />
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="12">
                <LFormtTitle label="初复诊" labelWidth="62" style="width:100%">
                  <el-form-item label label-width prop="isFirst">
                    <!-- <el-select v-model="accountRechargeForm.isFirst" placeholder="请选择"
                    style="line-height: 34px;width:100%">
                    <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                    </el-select> -->
                    <l-value-domain
                      :code="codeIsfirst"
                      :value.sync="accountRechargeForm.isFirst"
                      class="select-container"
                      placeholder="请选择"
                    />
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-row>

            <el-row :gutter="10" style="margin-top: 20px">
              <el-col :span="12">
                <LFormtTitle label="发病日期" labelWidth="62" style="width:100%">
                  <el-form-item label prop="startTime">
                    <el-date-picker
                      v-model="accountRechargeForm.startTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      placeholder
                      style="line-height: 34px;width:100%"
                    ></el-date-picker>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="12">
                <LFormtTitle label="诊断日期" labelWidth="62" style="width:100%">
                  <el-form-item label prop="diagTime">
                    <el-date-picker
                      v-model="accountRechargeForm.diagTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      placeholder
                      style="line-height: 34px;width:100%"
                    ></el-date-picker>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer clearfix" slot="footer">
      <div style="float:right">
        <el-button type="primary" @click="confirm">确认登记</el-button>
        <el-button @click="cancel" class="plain-button">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addDiag } from "@/api/common/diagnosis";

export default {
  name: "diagnosisEdit",
  props: [
    "patientId",
    "inpCode",
    "visitCode",
    "diagDoctorId",
    "diagDoctorName",
    "deptId",
    "deptName"
  ],
  data() {
    return {
      // 诊断类型类型数据code
      codeDiagType: "diagtype",
      // 类型值
      diagType: "",

      // 中西医类型数据code
      codeCwFlag: "cwFlag",
      // 类型值
      cwFlag: "",

      // 是否主诊断类型数据code
      codeDiagmain: "diagMain",
      // 类型值
      diagmain: "",

      // 初复诊类型数据code
      codeIsfirst: "isFirst",
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
        cwFlag: "",
        diagIcd: "",
        diagMain: "",
        isFirst: "",
        startTime: new Date().format("yyyy-MM-dd HH:mm"),
        elementId: "",
        id: "",
        diagName: "", //诊断名称
        diagTime: "" //诊断日期
      },
      rules: {
        diagType: [
          { required: true, message: "请选择诊断类型", trigger: "change" }
        ],
        cwFlag: [
          { required: true, message: "请选择中/西医", trigger: "change" }
        ],
        diagIcd: [
          { required: true, message: "请输入诊断描述", trigger: "blur" }
        ],
        diagMain: [
          { required: true, message: "请选择主诊断", trigger: "change" }
        ],
        isFirst: [
          { required: true, message: "请选择初复诊", trigger: "change" }
        ],
        startTime: [
          { required: true, message: "请选择发病日期", trigger: "change" }
        ],
        diagName: [
          { required: true, message: "请选择诊断名称", trigger: "change" }
        ],
        diagTime: [
          { required: true, message: "请选择诊断日期", trigger: "change" }
        ]
      },
      radio: "1"
    };
  },
  methods: {
    confirm() {
      this.$refs["formElem"].validate(async valid => {
        console.log(this.accountRechargeForm);
        this.accountRechargeForm.patientId = this.patientId;
        this.accountRechargeForm.inpCode = this.inpCode;
        this.accountRechargeForm.visitCode = this.visitCode;
        this.accountRechargeForm.diagDoctorId = this.diagDoctorId;
        this.accountRechargeForm.diagDoctorName = this.diagDoctorName;
        this.accountRechargeForm.deptId = this.deptId;
        this.accountRechargeForm.deptName = this.deptName;
        this.accountRechargeForm.diagCode = this.accountRechargeForm.diagName;
        this.accountRechargeForm.status = '1';
        //传入就诊类型是门诊or住院
        this.accountRechargeForm.clinicType =
          this.visitCode && !this.inpCode ? "1" : "2";
        if (valid) {
          //            console.log(111111);
          //              console.log(this.accountRechargeForm);
          let res = await addDiag(this.accountRechargeForm);
          this.$refs["formElem"].resetFields();
          this.$emit("rechargeConfirm", false);
        } else {
          this.$message.error(error.msg || "标准错误提示");
        }
      });
    },
    rest() {
      self.$refs["formElem"].resetFields();
    },
    cancel() {
      this.$emit("rechargeCancel");
      this.$refs["formElem"].resetFields();
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
  margin-bottom: 30px;
}

.detail {
  /*margin-top: 20px;*/
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
