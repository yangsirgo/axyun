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
                  style="width:100%"
                >
                  <el-form-item
                    label
                    label-width
                    prop="diagType"
                    :rules="[
                      {
                        required: true,
                        message: '请选择诊断类型',
                        trigger: 'change'
                      }
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
                  style="width:100%"
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
                <el-form-item label label-width prop="diagMain">
                  <!-- <l-value-domain
                      :code="codeDiagmain"
                      :value.sync="accountRechargeForm.diagMain"
                      class="select-container"
                      placeholder="请选择"
                  />-->
                  <el-checkbox disabled v-model="accountRechargeForm.diagMain"
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
                  style="width:100%"
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
                    <l-value-domain
                      v-if="accountRechargeForm.cwFlag === '1'"
                      style="line-height: 34px;width:100%"
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
                    <!-- <diagNameList :value.sync="accountRechargeForm.diagCode" @change="typeChange" /> -->
                    <!-- <l-value-domain
                      :value.sync="accountRechargeForm.diagCode"
                      remoteUrl="patDiag/getIcd10Dictionary"
                      remoteShowKey="dictionaryName"
                      remoteValueKey="icd10Encoding"
                      @change="typeChange"
                      class="select-container"
                      placeholder="请选择"
                    />-->
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="8">
                <LFormtTitle
                  :required="true"
                  label="初复诊"
                  labelWidth="62"
                  style="width:100%"
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
                  :required="true"
                  label="发病日期"
                  labelWidth="62"
                  style="width:100%"
                >
                  <el-form-item label prop="startTime">
                    <el-date-picker
                      v-model="accountRechargeForm.startTime"
                      type="datetime"
                      format="yyyy-MM-dd hh:mm"
                      value-format="yyyy-MM-dd hh:mm"
                      placeholder
                      style="line-height: 34px;width:100%"
                      :picker-options="pickerOptions"
                    ></el-date-picker>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px"></el-row>
            <LFormtTitle
              :required="true"
              label="诊断描述"
              labelWidth="99"
              style="width:100%"
            >
              <el-form-item label label-width prop="diagIcd">
                <el-input
                  v-model="accountRechargeForm.diagIcd"
                  placeholder
                  style="line-height: 34px;width:100%"
                ></el-input>
              </el-form-item>
            </LFormtTitle>
          </div>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer clearfix" style="padding-bottom:0;" slot="footer">
      <div style="float:right">
        <el-button
          type="primary"
          @click="confirm"
          :loading="submitLoad"
          v-hotKey="{ func: 'func_submit', flag: 'submitLoad' }"
          >确认修改</el-button
        >
        <el-button @click="cancel" class="plain-button">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from "@/utils/index";
import { updateDiag } from "@/api/common/diagnosis";
import diagNameList from "./diagNameList";
import { mapActions } from "vuex";

export default {
  name: "diagnosisEdit",
  components: { diagNameList },
  props: ["asd", "clinicType", "hdm", "table"],
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
      /*accountRechargeForm: {
          diagType: '',
          cwFlag: '',
          diagIcd: '',
          diagMain: '',
          isFirst: '',
          startTime: '',
          elementId: '',
          id: '',
          diagTime: ''//诊断日期
        },*/
      accountRechargeForm: {},
      rules: {
        cwFlag: [
          { required: true, message: "请选择中/西医", trigger: "change" }
        ],
        diagIcd: [
          { required: true, message: "请输入诊断描述", trigger: "blur" }
        ],
        diagMain: [
          { required: false, message: "请选择主诊断", trigger: "change" }
        ],
        isFirst: [
          { required: true, message: "请选择初复诊", trigger: "change" }
        ],
        startTime: [
          { required: true, message: "请选择发病日期", trigger: "change" }
        ],
        diagName: [
          { required: true, message: "请选择诊断名称", trigger: "change" }
        ]
      },
      radio: "1",
      nowIsDm: false,
      remoteParams: { pageSize: 10 },
      submitLoad: false,
      // 发病日期只允许选择今天之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
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
  watch: {
    asd: {
      deep: true,
      immediate: true,
      handler(val) {
        this.setDiagMain(val, val.diagMain);
        this.nowIsDm = val.diagMain === "1" ? true : false;
      }
    }
  },
  created() {
    this.setDiagMain(this.asd, this.asd.diagMain);
    this.nowIsDm = this.asd.diagMain === "1" ? true : false;
  },
  methods: {
    ...mapActions({
      changeRef: "diagnosis/changeRef"
    }),
    setDiagMain(data, val) {
      this.accountRechargeForm = deepClone(data);
      this.accountRechargeForm.diagCode = data.diagCode;
      const flag = val === "1" ? true : false;
      this.$nextTick(() => {
        this.$set(this.accountRechargeForm, "diagMain", flag);
      });
    },
    confirm() {
      /* if (
        this.diagLength > 1 &&
        this.hasDiagMain &&
        this.accountRechargeForm.diagMain
      ) {
        this.$message.warning("已有主诊断!");
        return;
      }
      if (this.diagLength === 1 && !this.accountRechargeForm.diagMain) {
        this.$message.warning("必须有一条主诊断!");
        return;
      } */
      const startTime = this.accountRechargeForm.startTime;
      const fbTime = startTime.replace(/-/g, "/");
      if (new Date(fbTime) > Date.now()) {
        this.$message.warning("请选择正确的发病日期");
        return;
      }
      this.$refs["formElem"].validate(async valid => {
        if (valid) {
          let data = deepClone(this.accountRechargeForm);
          data.diagMain ? (data.diagMain = "1") : (data.diagMain = "0");
          this.submitLoad = true;
          updateDiag(data)
            .then(res => {
              if (res.code === 1) {
                this.$message.success("编辑成功");
                this.changeRef();
                this.$refs["formElem"].resetFields();
                this.$emit("rechargeConfirm", false);
              } else {
                this.$message.error(res.msg || "编辑失败");
              }
              this.submitLoad = false;
            })
            .catch(err => {
              this.$message.error(err || "编辑失败");
              this.submitLoad = false;
            });
        }
      });
    },
    cancel() {
      this.$emit("rechargeCancel");
      this.$refs["formElem"].resetFields();
    },
    diagNameChange(item, cur) {
      this.$set(this.accountRechargeForm, "diagName", cur.dictionaryName);
    },
    // 中西医切换
    cwFlagChange(val) {
      if (val === "2") {
        this.$set(this.accountRechargeForm, "diagCode", "");
        this.$set(this.accountRechargeForm, "diagName", "");
      }
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
