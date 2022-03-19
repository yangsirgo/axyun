<template>
  <div class="medicalScreenForm height100" v-loading="loading">
    <div class="reg-form">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-position="left"
        label-width="0"
        class="demo-ruleForm"
      >
        <el-row v-for="(item, index) in formList" :key="index" :gutter="8">
          <l-card-title class="l-card-title">
            <template #left>
              <div
                class="text-style width100 height100"
                :class="{ required: item.required }"
                :title="(item.title || '') + (item.note || '')"
              >
                {{ item.title || "" }}
                <span class="text-note-style">{{ item.note || "" }}</span>
              </div>
            </template>
          </l-card-title>
          <!-- 血压 -->
          <template v-if="item.prop === 'bloodPressure'">
            <el-row
              class="bloodPressure-row"
              :gutter="8"
              v-for="(value, key) in item.children"
              :key="key"
            >
              <el-col :span="10">
                <l-formt-title
                  :label="value.label1"
                  class="bloodPressure"
                  :class="bloodPressureError[value.errorClass]"
                  :disabled="value.disabled"
                  :required="value.required"
                >
                  <LDoubleInput widthRatio="50%" :disabled="value.disabled">
                    <template slot="left">
                      <el-form-item :prop="value.prop1">
                        <el-input-number
                          v-model="ruleForm[value.prop1]"
                          :controls="false"
                          :placeholder="value.placeholder1"
                          :disabled="value.disabled"
                          :precision="value.precision"
                          @blur="
                            lowBlur(
                              ruleForm[value.prop1],
                              value,
                              key,
                              value.prop1
                            )
                          "
                        ></el-input-number>
                      </el-form-item>
                    </template>
                    <template slot="right">
                      <el-form-item :prop="value.prop11">
                        <el-input-number
                          v-model="ruleForm[value.prop11]"
                          :controls="false"
                          :placeholder="value.placeholder11"
                          :disabled="value.disabled"
                          :precision="value.precision"
                          @blur="
                            highBlur(
                              ruleForm[value.prop11],
                              value,
                              key,
                              value.prop11
                            )
                          "
                        ></el-input-number>
                      </el-form-item>
                    </template>
                  </LDoubleInput>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <el-form-item :prop="value.prop2">
                  <l-formt-title
                    :label="value.label2"
                    :disabled="value.disabled"
                    :required="value.required"
                  >
                    <el-input-number
                      v-model="ruleForm[value.prop2]"
                      :controls="false"
                      :disabled="value.disabled"
                      :min="value.min"
                      :max="value.max"
                      :precision="value.precision"
                      @blur="
                        heartRateBlur(
                          ruleForm[value.prop2],
                          value,
                          key,
                          value.prop2
                        )
                      "
                    ></el-input-number>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-else-if="item.children && item.children.length">
            <el-col
              v-for="(value, key) in item.children"
              :key="key"
              :span="value.span"
              :title="value.title ? ruleForm[value.prop] : ''"
            >
              <el-form-item :prop="value.prop">
                <l-formt-title
                  :label="value.label"
                  :disabled="value.disabled"
                  :required="value.required"
                >
                  <template v-if="value.prop === 'patientGender'">
                    <l-value-domain
                      :disabled="value.disabled"
                      code="GENDER_CODE"
                      :value.sync="ruleForm[value.prop]"
                      placeholder=""
                    ></l-value-domain>
                  </template>
                  <template v-else-if="value.type === 'input'">
                    <el-input
                      v-model="ruleForm[value.prop]"
                      :disabled="value.disabled"
                      @blur="validateItem(value.prop)"
                    ></el-input>
                  </template>
                  <template v-else-if="value.type === 'inputNumber'">
                    <el-input-number
                      v-model="ruleForm[value.prop]"
                      :controls="false"
                      :precision="value.precision"
                      @blur="inputNumberBlur(ruleForm[value.prop], value.prop)"
                    ></el-input-number>
                  </template>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </template>
          <template v-else-if="item.type === 'checkbox'">
            <el-form-item :prop="item.prop">
              <el-checkbox-group
                v-model="ruleForm[item.prop]"
                @change="checkboxChange(ruleForm[item.prop], item, item.prop)"
              >
                <el-checkbox
                  v-for="(value, key) in item.options"
                  :key="key"
                  :label="value.code"
                  >{{ value.name }}</el-checkbox
                >
                <el-input
                  v-model="ruleForm.personTypeOtherName"
                  class="personTypeOtherName"
                  placeholder="其他人群分类"
                  :disabled="ruleForm['personTypeCode'].indexOf('99') <= -1"
                ></el-input>
              </el-checkbox-group>
            </el-form-item>
          </template>
          <template v-else-if="item.type === 'radio'">
            <el-form-item :prop="item.prop">
              <el-radio-group
                v-model="ruleForm[item.prop]"
                @change="validateItem(item.prop)"
              >
                <el-radio
                  v-for="(value, key) in item.options"
                  :key="key"
                  :label="value.value"
                  :disabled="value.disabled"
                  >{{ value.label }}</el-radio
                >
              </el-radio-group>
              <!-- @click.native="radioClick(ruleForm[item.prop], value, item.prop, $event)" -->
            </el-form-item>
          </template>
        </el-row>
      </el-form>
    </div>
    <div class="reg-footer">
      <el-button
        type="primary"
        v-if="editFormData.recordStatus != '1'"
        @click="stagSubmit"
        >暂存</el-button
      >
      <el-button
        type="primary"
        v-if="editFormData.recordStatus != '1'"
        @click="submitForm"
        >提交</el-button
      >
      <el-button type="primary" plain @click="closeDialog">关闭</el-button>
    </div>
    <div
      class="medicalScreenForm-shade width100"
      v-if="editFormData.recordStatus == '1'"
    ></div>
  </div>
</template>
<script>
import service from "@/api/cis/medicalScreen/index.js";
import { deepClone } from "@/utils/index.js";

let formListInit = [
  {
    prop: "patientInfo",
    title: "患者基本信息",
    children: [
      {
        prop: "patientName",
        label: "姓名",
        type: "input",
        disabled: true,
        required: true,
        span: 4,
        title: "patientName",
      },
      {
        prop: "patientGender",
        label: "性别",
        type: "input",
        disabled: true,
        required: true,
        span: 3,
      },
      {
        prop: "identificationNum",
        label: "证件号码",
        type: "input",
        disabled: true,
        required: true,
        span: 7,
        title: "identificationNum",
      },
      {
        prop: "birthDate",
        label: "出生日期",
        type: "input",
        disabled: true,
        required: true,
        span: 6,
        title: "birthDate",
      },
      {
        prop: "age",
        label: "年龄",
        type: "input",
        disabled: true,
        required: true,
        span: 4,
        title: "age",
      },
    ],
  },
  {
    prop: "bloodPressure",
    title: "血压测量",
    note: "（测量血压前安静放松至少五分钟，测量时不动不说话，多次测量时，两次测量间隔1-2分钟，若需测量两次，测量结果取收缩压较低的值记录；若需测量三次，测量结果取后两次收缩压较低的值记录）",
    children: [
      {
        errorClass: "bloodPressureFirstError",
        label1: "第一次血压（mmHg）",
        label2: "心率（次/分）",
        prop1: "bloodPressureLowFirst",
        prop11: "bloodPressureHighFirst",
        prop2: "heartRateFirst",
        disabled: false,
        required: true,
        placeholder1: "收缩压",
        placeholder11: "舒张压",
        type: "inputNumber",
        /* min1: 60,
        max1: 300,
        min11: 30,
        max11: 150,
        min2: 30,
        max2: 200, */
        precision: 0,
      },
      {
        errorClass: "bloodPressureSecondError",
        label1: "第二次血压（mmHg）",
        label2: "心率（次/分）",
        prop1: "bloodPressureLowSecond",
        prop11: "bloodPressureHighSecond",
        prop2: "heartRateSecond",
        disabled: true,
        placeholder1: "收缩压",
        placeholder11: "舒张压",
        type: "inputNumber",
        /* min1: 60,
        max1: 300,
        min11: 30,
        max11: 150,
        min2: 30,
        max2: 200, */
        precision: 0,
      },
      {
        errorClass: "bloodPressureThirdError",
        label1: "第三次血压（mmHg）",
        label2: "心率（次/分）",
        prop1: "bloodPressureLowThird",
        prop11: "bloodPressureHighThird",
        prop2: "heartRateThird",
        disabled: true,
        placeholder1: "收缩压",
        placeholder11: "舒张压",
        type: "inputNumber",
        /* min1: 60,
        max1: 300,
        min11: 30,
        max11: 150,
        min2: 30,
        max2: 200, */
        precision: 0,
      },
      {
        label1: "请告知，最终血压（mmHg）",
        label2: "心率（次/分）",
        prop1: "bloodPressureLowLast",
        prop11: "bloodPressureHighLast",
        prop2: "heartRateLast",
        disabled: true,
        placeholder1: "收缩压",
        placeholder11: "舒张压",
        type: "inputNumber",
      },
    ],
  },
  {
    prop: "heiWeight",
    title: "身高体重",
    children: [
      {
        prop: "height",
        label: "身高(cm)",
        type: "inputNumber",
        /* min: 5,
        max: 300, */
        precision: 0,
        disabled: false,
        required: true,
        span: 6,
      },
      {
        prop: "weight",
        label: "体重(kg)",
        type: "inputNumber",
        /*  min: 1,
        max: 500, */
        precision: 1,
        disabled: false,
        required: true,
        span: 6,
      },
      {
        prop: "waistline",
        label: "腰围(cm)",
        type: "inputNumber",
        /* min: 1,
        max: 300, */
        precision: 1,
        disabled: false,
        required: true,
        span: 6,
      },
      {
        prop: "animalHeat",
        label: "体温(℃)",
        type: "inputNumber",
        /* min: 35,
        max: 42, */
        precision: 1,
        disabled: false,
        required: true,
        span: 6,
      },
    ],
  },
  {
    prop: "personTypeCode",
    title: "人群分类",
    type: "checkbox",
    required: true,
    options: [],
  },
  {
    prop: "crisisFlag",
    title: "是否危急",
    type: "radio",
    required: false,
    options: [
      {
        value: "1",
        label: "是",
        disabled: false,
      },
      {
        value: "0",
        label: "否",
        disabled: false,
      },
    ],
  },
];
let ruleFormInit = {
  patientName: "",
  patientGender: "",
  identificationNum: "",
  birthDate: "",
  age: "",
  bloodPressureLowFirst: undefined,
  bloodPressureHighFirst: undefined,
  heartRateFirst: undefined,
  bloodPressureLowSecond: undefined,
  bloodPressureHighSecond: undefined,
  heartRateSecond: undefined,
  bloodPressureLowThird: undefined,
  bloodPressureHighThird: undefined,
  heartRateThird: undefined,
  bloodPressureLowLast: undefined,
  bloodPressureHighLast: undefined,
  heartRateLast: undefined,
  height: undefined,
  weight: undefined,
  waistline: undefined,
  animalHeat: undefined,
  personTypeCode: [],
  personTypeOtherName: "",
  crisisFlag: "0",
};
export default {
  name: "medicalScreenForm",
  props: {
    editFormData: {
      type: Object,
      default() {
        return {};
      },
    },
    personTypeNameOptions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    // 第一次收缩压校验
    let bloodPressureLowFirstCheck = (rule, value, callback) => {
      if (!value) {
        this.bloodPressureError.bloodPressureFirstError = "bloodPressureError";
        // this.$message.error("请填写第一次收缩压！");
        callback(new Error("请填写第一次收缩压！"));
      } else if (value > 300) {
        this.bloodPressureError.bloodPressureFirstError = "bloodPressureError";
        // this.$message.error("第一次收缩压不可大于300！");
        callback(new Error("第一次收缩压不可大于300！"));
      } else if (value < 60) {
        this.bloodPressureError.bloodPressureFirstError = "bloodPressureError";
        // this.$message.error("第一次收缩压不可小于60！");
        callback(new Error("第一次收缩压不可小于60！"));
      } else {
        let high = this.ruleForm.bloodPressureHighFirst;
        if (!high || (high >= 30 && high <= 150)) {
          this.bloodPressureError.bloodPressureFirstError = "";
        }
        callback();
      }
    };
    // 第一次舒张压校验
    let bloodPressureHighFirstCheck = (rule, value, callback) => {
      if (!value) {
        this.bloodPressureError.bloodPressureFirstError = "bloodPressureError";
        // this.$message.error("请填写第一次舒张压！");
        callback(new Error("请填写第一次舒张压！"));
      } else if (value > 150) {
        this.bloodPressureError.bloodPressureFirstError = "bloodPressureError";
        // this.$message.error("第一次舒张压不可大于150！");
        callback(new Error("第一次舒张压不可大于150！"));
      } else if (value < 30) {
        this.bloodPressureError.bloodPressureFirstError = "bloodPressureError";
        // this.$message.error("第一次舒张压不可小于30！");
        callback(new Error("第一次舒张压不可小于30！"));
      } else {
        let low = this.ruleForm.bloodPressureLowFirst;
        if (!low || (low >= 60 && low <= 300)) {
          this.bloodPressureError.bloodPressureFirstError = "";
        }
        callback();
      }
    };
    // 第二次收缩压校验
    let bloodPressureLowSecondCheck = (rule, value, callback) => {
      if (
        !(
          this.ruleForm["bloodPressureLowFirst"] >= 140 ||
          this.ruleForm["bloodPressureHighFirst"] >= 90
        )
      ) {
        this.bloodPressureError.bloodPressureSecondError = "";
        callback();
      } else if (!value) {
        this.bloodPressureError.bloodPressureSecondError = "bloodPressureError";
        // this.$message.error("请填写第二次收缩压！");
        callback(new Error("请填写第二次收缩压！"));
      } else if (value > 300) {
        this.bloodPressureError.bloodPressureSecondError = "bloodPressureError";
        // this.$message.error("第二次收缩压不可大于300！");
        callback(new Error("第二次收缩压不可大于300！"));
      } else if (value < 60) {
        this.bloodPressureError.bloodPressureSecondError = "bloodPressureError";
        // this.$message.error("第二次收缩压不可小于60！");
        callback(new Error("第二次收缩压不可小于60！"));
      } else {
        let high = this.ruleForm.bloodPressureHighSecond;
        if (!high || (high >= 30 && high <= 150)) {
          this.bloodPressureError.bloodPressureSecondError = "";
        }
        callback();
      }
    };
    // 第二次舒张压校验
    let bloodPressureHighSecondCheck = (rule, value, callback) => {
      if (
        !(
          this.ruleForm["bloodPressureLowFirst"] >= 140 ||
          this.ruleForm["bloodPressureHighFirst"] >= 90
        )
      ) {
        this.bloodPressureError.bloodPressureSecondError = "";
        callback();
      } else if (!value) {
        this.bloodPressureError.bloodPressureSecondError = "bloodPressureError";
        // this.$message.error("请填写第二次舒张压！");
        callback(new Error("请填写第二次舒张压！"));
      } else if (value > 150) {
        this.bloodPressureError.bloodPressureSecondError = "bloodPressureError";
        // this.$message.error("第二次舒张压不可大于150！");
        callback(new Error("第二次舒张压不可大于150！"));
      } else if (value < 30) {
        this.bloodPressureError.bloodPressureSecondError = "bloodPressureError";
        // this.$message.error("第二次舒张压不可小于30！");
        callback(new Error("第二次舒张压不可小于30！"));
      } else {
        let low = this.ruleForm.bloodPressureLowSecond;
        if (!low || (low >= 60 && low <= 300)) {
          this.bloodPressureError.bloodPressureSecondError = "";
        }
        callback();
      }
    };
    // 第三次收缩压校验
    let bloodPressureLowThirdCheck = (rule, value, callback) => {
      if (
        !(
          (this.ruleForm["bloodPressureLowFirst"] >= 140 ||
            this.ruleForm["bloodPressureHighFirst"] >= 90) &&
          !this.editFormData.hypertensionCdId
        )
      ) {
        this.bloodPressureError.bloodPressureThirdError = "";
        callback();
      } else if (!value) {
        callback();
      } else if (value > 300) {
        this.bloodPressureError.bloodPressureThirdError = "bloodPressureError";
        // this.$message.error("第三次收缩压不可大于300！");
        callback(new Error("第三次收缩压不可大于300！"));
      } else if (value < 60) {
        this.bloodPressureError.bloodPressureThirdError = "bloodPressureError";
        // this.$message.error("第三次收缩压不可小于60！");
        callback(new Error("第三次收缩压不可小于60！"));
      } else {
        let high = this.ruleForm.bloodPressureHighThird;
        if (!high || (high >= 30 && high <= 150)) {
          this.bloodPressureError.bloodPressureThirdError = "";
        }
        callback();
      }
    };
    // 第三次舒张压校验
    let bloodPressureHighThirdCheck = (rule, value, callback) => {
      if (
        !(
          (this.ruleForm["bloodPressureLowFirst"] >= 140 ||
            this.ruleForm["bloodPressureHighFirst"] >= 90) &&
          !this.editFormData.hypertensionCdId
        )
      ) {
        this.bloodPressureError.bloodPressureThirdError = "";
        callback();
      } else if (!value) {
        callback();
      } else if (value > 150) {
        this.bloodPressureError.bloodPressureThirdError = "bloodPressureError";
        // this.$message.error("第三次舒张压不可大于150！");
        callback(new Error("第三次舒张压不可大于150！"));
      } else if (value < 30) {
        this.bloodPressureError.bloodPressureThirdError = "bloodPressureError";
        // this.$message.error("第三次舒张压不可小于30！");
        callback(new Error("第三次舒张压不可小于30！"));
      } else {
        let low = this.ruleForm.bloodPressureLowThird;
        if (!low || (low >= 60 && low <= 300)) {
          this.bloodPressureError.bloodPressureThirdError = "";
        }
        callback();
      }
    };
    // 第一次心率校验
    let heartRateFirstCheck = (rule, value, callback) => {
      if (!value) {
        // this.$message.error("请填写第一次心率！");
        callback(new Error("请填写第一次心率！"));
      } else if (value > 200) {
        // this.$message.error("第一次心率不可大于200！");
        callback(new Error("第一次心率不可大于200！"));
      } else if (value < 30) {
        // this.$message.error("第一次心率不可小于30！");
        callback(new Error("第一次心率不可小于30！"));
      } else {
        callback();
      }
    };
    // 第二次心率校验
    let heartRateSecondCheck = (rule, value, callback) => {
      if (
        !(
          this.ruleForm["bloodPressureLowFirst"] >= 140 ||
          this.ruleForm["bloodPressureHighFirst"] >= 90
        )
      ) {
        callback();
      } else if (!value) {
        // this.$message.error("请填写第二次心率！");
        callback(new Error("请填写第二次心率！"));
      } else if (value > 200) {
        // this.$message.error("第二次心率不可大于200！");
        callback(new Error("第二次心率不可大于200！"));
      } else if (value < 30) {
        // this.$message.error("第二次心率不可小于30！");
        callback(new Error("第二次心率不可小于30！"));
      } else {
        callback();
      }
    };
    // 第三次心率校验
    let heartRateThirdCheck = (rule, value, callback) => {
      if (
        !(
          (this.ruleForm["bloodPressureLowFirst"] >= 140 ||
            this.ruleForm["bloodPressureHighFirst"] >= 90) &&
          !this.editFormData.hypertensionCdId
        )
      ) {
        callback();
      } else if (!value) {
        callback();
      } else if (value > 200) {
        // this.$message.error("第三次心率不可大于200！");
        callback(new Error("第三次心率不可大于200！"));
      } else if (value < 30) {
        // this.$message.error("第三次心率不可小于30！");
        callback(new Error("第三次心率不可小于30！"));
      } else {
        callback();
      }
    };
    // 身高校验
    let heightCheck = (rule, value, callback) => {
      if (!value) {
        // this.$message.error("请填写身高！");
        callback(new Error("请填写身高！"));
      } else if (value > 300) {
        // this.$message.error("身高不可大于300cm！");
        callback(new Error("身高不可大于300cm！"));
      } else if (value < 5) {
        // this.$message.error("身高不可小于5cm！");
        callback(new Error("身高不可小于5cm！"));
      } else {
        callback();
      }
    };
    // 体重校验
    let weightCheck = (rule, value, callback) => {
      if (!value) {
        // this.$message.error("请填写体重！");
        callback(new Error("请填写体重！"));
      } else if (value > 500) {
        // this.$message.error("体重不可大于500kg！");
        callback(new Error("体重不可大于500kg！"));
      } else if (value < 1) {
        // this.$message.error("体重不可小于1kg！");
        callback(new Error("体重不可小于1kg！"));
      } else {
        callback();
      }
    };
    // 腰围校验
    let waistlineCheck = (rule, value, callback) => {
      if (!value) {
        // this.$message.error("请填写腰围！");
        callback(new Error("请填写腰围！"));
      } else if (value > 300) {
        // this.$message.error("腰围不可大于300cm！");
        callback(new Error("腰围不可大于300cm！"));
      } else if (value < 1) {
        // this.$message.error("腰围不可小于1cm！");
        callback(new Error("腰围不可小于1cm！"));
      } else {
        callback();
      }
    };
    // 体温校验
    let animalHeatCheck = (rule, value, callback) => {
      if (!value) {
        // this.$message.error("请填写体温！");
        callback(new Error("请填写体温！"));
      } else if (value > 42) {
        // this.$message.error("体温不可大于42℃！");
        callback(new Error("体温不可大于42℃！"));
      } else if (value < 35) {
        // this.$message.error("体温不可小于35℃！");
        callback(new Error("体温不可小于35℃！"));
      } else {
        callback();
      }
    };
    // 人群分类校验
    let personTypeCodeCheck = (rule, value, callback) => {
      if (!value.length) {
        // this.$message.error("请选择人群分类！");
        callback(new Error("请选择人群分类！"));
      } else {
        callback();
      }
    };
    return {
      formList: [],
      ruleForm: {
        ...deepClone(ruleFormInit),
      },
      rules: {
        bloodPressureLowFirst: [
          {
            validator: bloodPressureLowFirstCheck,
            trigger: ["blur"],
          },
        ],
        bloodPressureHighFirst: [
          {
            validator: bloodPressureHighFirstCheck,
            trigger: ["blur"],
          },
        ],
        bloodPressureLowSecond: [
          {
            validator: bloodPressureLowSecondCheck,
            trigger: ["blur"],
          },
        ],
        bloodPressureHighSecond: [
          {
            validator: bloodPressureHighSecondCheck,
            trigger: ["blur"],
          },
        ],
        bloodPressureLowThird: [
          {
            validator: bloodPressureLowThirdCheck,
            trigger: ["blur"],
          },
        ],
        bloodPressureHighThird: [
          {
            validator: bloodPressureHighThirdCheck,
            trigger: ["blur"],
          },
        ],
        heartRateFirst: [
          {
            validator: heartRateFirstCheck,
            trigger: ["blur"],
          },
        ],
        heartRateSecond: [
          {
            validator: heartRateSecondCheck,
            trigger: ["blur"],
          },
        ],
        heartRateThird: [
          {
            validator: heartRateThirdCheck,
            trigger: ["blur"],
          },
        ],
        height: [
          {
            validator: heightCheck,
            trigger: ["blur"],
          },
        ],
        weight: [
          {
            validator: weightCheck,
            trigger: ["blur"],
          },
        ],
        waistline: [
          {
            validator: waistlineCheck,
            trigger: ["blur"],
          },
        ],
        animalHeat: [
          {
            validator: animalHeatCheck,
            trigger: ["blur"],
          },
        ],
        personTypeCode: [
          {
            validator: personTypeCodeCheck,
            trigger: ["change"],
          },
        ],
      },
      loading: false,
      bloodPressureError: {
        bloodPressureFirstError: "",
        bloodPressureSecondError: "",
        bloodPressureThirdError: "",
      },
    };
  },
  watch: {
    editFormData: {
      handler(val) {
        this.ruleForm = {
          ...deepClone(ruleFormInit),
          ...deepClone(val),
        };
        this.bloodPressureError = {
          bloodPressureFirstError: "",
          bloodPressureSecondError: "",
          bloodPressureThirdError: "",
        };
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        });
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    let formList = deepClone(formListInit);
    let formListItem = formList.filter((item) => {
      return item.prop === "personTypeCode";
    });
    this.$set(formListItem[0], "options", this.personTypeNameOptions);
    this.formList = deepClone(formList);
    let form = this.formList.filter((item) => {
      return item.prop === "bloodPressure";
    });
    let bloodPressureChildren = form[0].children;
    if( this.ruleForm["bloodPressureLowFirst"] >= 140 ||
      this.ruleForm["bloodPressureHighFirst"] >= 90){
      this.$set(bloodPressureChildren[1], "disabled", false);
      if (!this.editFormData.hypertensionCdId) {
        this.$set(bloodPressureChildren[2], "disabled", false);
      } else {
        // 清空第三次血压值，并且转为不可编辑
        this.$set(bloodPressureChildren[2], "disabled", true);
        this.$set(this.ruleForm, "bloodPressureLowThird", undefined);
        this.$set(this.ruleForm, "bloodPressureHighThird", undefined);
        this.$set(this.ruleForm, "heartRateThird", undefined);
      }
    }else{
      this.$set(bloodPressureChildren[1], "disabled", true);
      this.$set(bloodPressureChildren[2], "disabled", true);
      this.$set(this.ruleForm, "bloodPressureLowSecond", undefined);
      this.$set(this.ruleForm, "bloodPressureHighSecond", undefined);
      this.$set(this.ruleForm, "heartRateSecond", undefined);
      this.$set(this.ruleForm, "bloodPressureLowThird", undefined);
      this.$set(this.ruleForm, "bloodPressureHighThird", undefined);
      this.$set(this.ruleForm, "heartRateThird", undefined);
    }
  },
  methods: {
    // 暂存
    async stagSubmit() {
      this.loading = true;
      try {
        let params = this.forminitFuc({
          ...this.ruleForm,
          recordStatus: "0",
        });
        let { code, data, msg } = await service.saveHighBloodScreen(params);
        if (code == 1) {
          this.$message.success("暂存成功");
          this.$refs.ruleForm.resetFields();
          this.$emit("submitFuc");
        } else {
          this.$message.error(msg || "暂存失败");
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 提交之前的校验
    validateForm() {
      let flag = true;
      // 非空校验
      for (let i in this.ruleForm) {
        let value = this.ruleForm[i];
        if (
          (value === "" ||
            value === undefined ||
            value === null ||
            JSON.stringify(value) === "[]") &&
          this.rules[i] &&
          this.rules[i].length &&
          this.rules[i][0].required
        ) {
          flag = false;
          this.$message.error(this.rules[i][0].message || "校验失败！");
          break;
        }
      }

      if (
        (this.ruleForm["bloodPressureLowFirst"] >= 140 ||
          this.ruleForm["bloodPressureHighFirst"] >= 90) &&
        flag
      ) {
        // 第二三次血压校验
        // 校验第二次血压是否填写
        if (
          !this.ruleForm["bloodPressureLowSecond"] ||
          !this.ruleForm["bloodPressureHighSecond"]
        ) {
          flag = false;
          this.$message.error("请填写第二次血压！");
        }
        if (!this.ruleForm["heartRateSecond"]) {
          flag = false;
          this.$message.error("请填写第二次心率！");
        }
        /* if (flag && !this.editFormData.hypertensionCdId) {
          // 校验第三次血压是否填写
          if (
            !this.ruleForm["bloodPressureLowThird"] ||
            !this.ruleForm["bloodPressureHighThird"] ||
            !this.ruleForm["heartRateThird"]
          ) {
            flag = false;
            this.$message.error("请填写第三次血压！");
          }
          if (!this.ruleForm["heartRateThird"]) {
            flag = false;
            this.$message.error("请填写第三次心率！");
          }
        } */
      }
      return flag;
    },
    forminitFuc(data) {
      let formData = deepClone(data);
      let obj = {
        ...formData,
        personTypeCode: formData.personTypeCode.join(","),
        personTypeName: formData.personTypeName.join(","),
      };
      return obj;
    },
    // 提交
    submitForm() {
      /* let flag = this.validateForm();
      if (!flag) {
        return;
      } */
      let arrValidate = [];
      let a = 0;
      for (let i in this.rules) {
        arrValidate.push(i);
        this.$refs["ruleForm"].validateField(i, (msg) => {
          if (msg) {
            a++;
            let top = a * 50;
            this.$message({
              type: "error",
              message: msg,
              offset: top,
            });
          }
        });
      }
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            let params = this.forminitFuc({
              ...this.ruleForm,
              recordStatus: "1",
            });
            let { code, data, msg } = await service.saveHighBloodScreen(params);
            if (code == 1) {
              this.$message.success("提交成功");
              this.$emit("submitFuc");
            } else {
              this.$message.error(msg || "提交失败");
            }
          } catch (error) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
    // 关闭弹框
    closeDialog() {
      this.$emit("closeDialog");
    },
    // 多选框change
    checkboxChange(value, item, prop) {
      this.validateItem(prop);
      if (item.prop === "personTypeCode") {
        let formListItem = this.formList.filter((item) => {
          return item.prop === "personTypeCode";
        });
        let options = formListItem[0].options;
        let personTypeNameArr = [];
        for (let i in value) {
          for (let j in options) {
            if (value[i] === options[j].code) {
              personTypeNameArr.push(options[j].name);
            }
          }
        }
        this.$set(this.ruleForm, "personTypeName", personTypeNameArr);
        if(value.indexOf('99') == -1 && this.ruleForm.personTypeOtherName){
          this.ruleForm.personTypeOtherName = ''
        }
      }
    },
    // 单选框Click
    radioClick(val, item, prop, e) {
      if (e.target.tagName !== "INPUT") {
        return;
      }
      if (val === item.value) {
        this.$set(this.ruleForm, prop, "");
      }
    },
    // 收缩压blur
    lowBlur(val, item, index, prop) {
      this.validateItem(prop);
      this.getLastBloodPressure(val, item, index);
    },
    // 舒张压blur
    highBlur(val, item, index, prop) {
      this.validateItem(prop);
      this.getLastBloodPressure(val, item, index);
    },
    // 心率blur
    heartRateBlur(val, item, index, prop) {
      this.validateItem(prop);
      this.getLastBloodPressure(val, item, index);
    },
    // 比较三组血压，计算最终血压与心率
    getLastBloodPressure(val, item, index) {
      // 如果第一次血压异常，第二次血压可编辑
      let formListItem = this.formList.filter((item) => {
        return item.prop === "bloodPressure";
      });
      let bloodPressureChildren = formListItem[0].children;
      if (
        this.ruleForm["bloodPressureLowFirst"] >= 140 ||
        this.ruleForm["bloodPressureHighFirst"] >= 90
      ) {
        this.$set(bloodPressureChildren[1], "disabled", false);
        if (!this.editFormData.hypertensionCdId) {
          this.$set(bloodPressureChildren[2], "disabled", false);
        } else {
          // 清空第三次血压值，并且转为不可编辑
          this.$set(bloodPressureChildren[2], "disabled", true);
          this.$set(this.ruleForm, "bloodPressureLowThird", undefined);
          this.$set(this.ruleForm, "bloodPressureHighThird", undefined);
          this.$set(this.ruleForm, "heartRateThird", undefined);
        }
      } else {
        // 清空第二三次血压值，并且转为不可编辑
        this.$set(bloodPressureChildren[1], "disabled", true);
        this.$set(bloodPressureChildren[2], "disabled", true);
        this.$set(this.ruleForm, "bloodPressureLowSecond", undefined);
        this.$set(this.ruleForm, "bloodPressureHighSecond", undefined);
        this.$set(this.ruleForm, "heartRateSecond", undefined);
        this.$set(this.ruleForm, "bloodPressureLowThird", undefined);
        this.$set(this.ruleForm, "bloodPressureHighThird", undefined);
        this.$set(this.ruleForm, "heartRateThird", undefined);
      }

      // 比较三组血压，计算最终血压与心率
      if (
        this.ruleForm[item.prop1] &&
        this.ruleForm[item.prop11] &&
        this.ruleForm[item.prop2]
      ) {
        // 收缩压
        let bloodPressureLowArr = [
          this.ruleForm["bloodPressureLowFirst"] || Infinity,
          this.ruleForm["bloodPressureLowSecond"] || Infinity,
          this.ruleForm["bloodPressureLowThird"] || Infinity,
        ];
        let bloodPressureLowLast = bloodPressureLowArr.sort((a, b) => {
          return a - b;
        });
        this.$set(
          this.ruleForm,
          "bloodPressureLowLast",
          bloodPressureLowLast[0]
        );
        // 舒张压
        let bloodPressureHighArr = [
          this.ruleForm["bloodPressureHighFirst"] || Infinity,
          this.ruleForm["bloodPressureHighSecond"] || Infinity,
          this.ruleForm["bloodPressureHighThird"] || Infinity,
        ];
        let bloodPressureHighLast = bloodPressureHighArr.sort((a, b) => {
          return a - b;
        });
        this.$set(
          this.ruleForm,
          "bloodPressureHighLast",
          bloodPressureHighLast[0]
        );
        // 心率
        let heartRateArr = [
          this.ruleForm["heartRateFirst"] || Infinity,
          this.ruleForm["heartRateSecond"] || Infinity,
          this.ruleForm["heartRateThird"] || Infinity,
        ];
        let heartRateLast = heartRateArr.sort((a, b) => {
          return a - b;
        });
        this.$set(this.ruleForm, "heartRateLast", heartRateLast[0]);
      }
    },
    inputNumberBlur(value, prop) {
      // 如果是体温，大于37.3需要弹框确认
      if (
        prop === "animalHeat" &&
        Number(value) > 37.3 &&
        Number(value) <= 42
      ) {
        this.$alert("体温超过37.3，请确认！", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            this.validateItem(prop);
          },
        });
        return;
      }
      this.validateItem(prop);
    },
    // 分别校验每个字段
    validateItem(prop) {
      this.$refs["ruleForm"].validateField(prop, (msg) => {
        if (msg) {
          this.$message.error(msg);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.bloodPressureError {
  border: 1px solid #f56c6c;
}
.medicalScreenForm {
  background-color: #fff;
  overflow-y: auto;
  position: relative;
  .l-card-title {
    height: 24px;
    margin: 8px 0;
    .text-style {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .text-note-style {
        font-weight: normal;
        font-size: 14px;
      }
    }
  }
  .bloodPressure-row {
    margin-bottom: 6px;
  }
  .bloodPressure.l-input-wrap {
    .LDoubleInput {
      height: auto;
      border: none;
    }
  }

  .medicalScreenForm-shade {
    height: calc(100% - 64px);
    z-index: 999;
    position: absolute;
    top: 0;
    left: 0;
  }
  .form-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #000000;
    font-weight: 600;
  }

  .reg-form {
    height: calc(100% - 65px);
    padding: 0 16px;
    overflow: hidden;
    overflow-y: auto;
  }

  .reg-footer {
    padding: 16px;
    border-top: 1px solid #00000033;
    display: flex;
    justify-content: flex-end;
  }

  /deep/
    .el-form-item.is-required:not(.is-no-asterisk)
    > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk)
    .el-form-item__label-wrap
    > .el-form-item__label:before {
    content: "";
    margin-right: 0;
  }

  .demo-ruleForm {
    padding: 8px;
    /deep/ .el-form-item__content {
      line-height: 36px;
    }
  }

  .required:after {
    content: "*";
    width: 7px;
    height: 14px;
    font-size: 14px;
    padding-left: 5px;
    vertical-align: middle;
    font-weight: bolder;
    color: rgba(239, 15, 15, 1);
  }

  /deep/ .el-dialog__footer {
    /*height: 36px;*/
    padding: 20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }

  /deep/ .l-input-wrap {
    display: block;
  }
  .personTypeOtherName {
    width: 250px;
    margin-left: 20px;
  }
  /deep/.el-form-item.is-error .personTypeOtherName .el-input__inner {
    border-color: #e4e4e4 !important;
  }
  /deep/.el-form-item.is-success .personTypeOtherName .el-input__inner {
    border-color: #e4e4e4 !important;
  }
}
</style>
