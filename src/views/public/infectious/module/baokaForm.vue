<template>
  <div class="infectiousCard height100" v-loading="loading">
    <div class="reg-form">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-position="left"
        label-width="0"
        class="demo-ruleForm"
      >
        <div class="patient-box clearfix">
          <div class="patient-info">
            <el-row :gutter="20">
              <div class="form-title">中华人民共和国传染性疾病报告卡</div>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="cardSource">
                  <l-formt-title label="报卡来源">
                    <l-value-domain
                      code="AdviceMedicationRange"
                      :value.sync="ruleForm.cardSource"
                      class="select-container"
                      :placeholder="$t('base.placeholder')"
                      key="key4"
                    ></l-value-domain>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  prop="cardType"
                  label="报卡类型"
                  label-width="80px"
                >
                  <el-radio
                    v-for="(item, i) in cardTypeOptions"
                    :key="i"
                    v-model="ruleForm.cardType"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="cardCode">
                  <l-formt-title label="卡片编号" :disabled="true">
                    <el-input
                      placeholder
                      v-model="ruleForm.cardCode"
                      :disabled="true"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="patientName">
                  <l-formt-title label="患者姓名" :required="true">
                    <el-input
                      placeholder
                      v-model="ruleForm.patientName"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="">
                  <l-formt-title label="患儿家长姓名">
                    <el-input
                      placeholder="请填写患儿家长姓名"
                      v-model="ruleForm.parantName"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="paperwork">
                  <l-formt-title label="有效身份证号码" :required="true">
                    <el-input
                      placeholder="请填写有效身份证号码"
                      maxlength="18"
                      v-model="ruleForm.paperwork"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="sex" label="性别" label-width="80px">
                  <el-radio
                    v-for="(item, i) in sexOptions"
                    :key="i"
                    v-model="ruleForm.sex"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="birthday">
                  <l-formt-title label="出生日期">
                    <el-date-picker
                      v-model="ruleForm.birthday"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions"
                      placeholder="请选择出生日期"
                    ></el-date-picker>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label-width="82px">
                  <span slot="label">实足年龄</span>
                  <el-input
                    placeholder
                    v-model="ruleForm.regularAge"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="workplace">
                  <l-formt-title label="工作单位">
                    <el-input
                      placeholder="请填写工作单位"
                      v-model="ruleForm.workplace"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="telephone">
                  <l-formt-title label="联系电话" required>
                    <el-input
                      placeholder="请填写联系电话"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      v-model="ruleForm.telephone"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item
                  prop="patientAttribution"
                  label="病人属于"
                  label-width="80px"
                >
                  <el-radio
                    v-for="(item, i) in patientAttributionOptions"
                    :key="i"
                    v-model="ruleForm.patientAttribution"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="addrCode">
                  <l-formt-title label="现住址" :required="true">
                    <l-value-domain
                      type="cascader"
                      code="AdministrativDivision"
                      :value.sync="ruleForm.addrCode"
                      class="select-container"
                      remoteValueKey="id"
                      remoteShowKey="label"
                      :multiple="false"
                      :relation="true"
                      :placeholder="$t('base.placeholder')"
                      key="key3"
                    ></l-value-domain>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="doorplateAddressCode">
                  <l-formt-title label="详细住址" required>
                    <el-input
                      placeholder="请填写详细住址"
                      v-model="ruleForm.doorplateAddressCode"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item
                  class="required"
                  prop="profession"
                  label="人群分类"
                  label-width="83px"
                >
                  <span slot="label">人群分类</span>
                  <el-radio
                    v-for="(item, i) in professionOptions"
                    :key="i"
                    v-model="ruleForm.profession"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24" class="required">
                <el-form-item prop="" label="病例分类" label-width="80px">
                  <span style="display: inline-block"></span>
                  <div style="display: inline-flex">
                    <div>
                      <div class="margin-right-10" style="display: inline">
                        (1)
                      </div>
                      <el-radio
                        v-for="(item, i) in diseaseClassificationOneOptions"
                        :key="i"
                        v-model="ruleForm.diseaseClassificationOne"
                        :label="item.value"
                        >{{ item.label }}</el-radio
                      >
                    </div>
                    <div>
                      <div class="margin-right-10" style="display: inline">
                        (2)
                      </div>
                      <el-radio
                        v-for="(item, i) in diseaseClassificationTwoOptions"
                        :key="i"
                        v-model="ruleForm.diseaseClassificationTwo"
                        :label="item.value"
                        >{{ item.label }}</el-radio
                      >
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="chuzhenDate">
                  <l-formt-title label="初诊日期">
                    <el-date-picker
                      v-model="ruleForm.chuzhenDate"
                      type="datetime"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择初诊日期"
                    ></el-date-picker>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="jiuzhenDate">
                  <l-formt-title label="就诊日期">
                    <el-date-picker
                      v-model="ruleForm.jiuzhenDate"
                      type="datetime"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择就诊日期"
                    ></el-date-picker>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="onsetDate">
                  <l-formt-title label="发病日期" :required="true">
                    <el-date-picker
                      v-model="ruleForm.onsetDate"
                      type="datetime"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择发病日期"
                    ></el-date-picker>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="diagDate">
                  <l-formt-title label="诊断日期" :required="true">
                    <el-date-picker
                      v-model="ruleForm.diagDate"
                      type="datetime"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择初诊日期"
                    ></el-date-picker>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="diagName">
                  <LFormtTitle
                    label="疾病诊断"
                    labelWidth="96"
                    style="width: 100%"
                    :required="true"
                  >
                    <el-form-item label label-width prop="diagName">
                      <l-value-domain
                        style="line-height: 34px; width: 100%"
                        remoteUrl="/patDiag/getIcd10Dictionary"
                        :remoteParams="remoteParams"
                        :value.sync="ruleForm.diagName"
                        placeholder="请输入诊断名称"
                        remoteShowKey="dictionaryName"
                        remoteValueKey="icd10Encoding"
                        class="input-width-default"
                        @change="diagNameChange"
                      ></l-value-domain>
                    </el-form-item>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="deathDate">
                  <l-formt-title label="死亡日期">
                    <el-date-picker
                      v-model="ruleForm.deathDate"
                      type="datetime"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择发病日期"
                    ></el-date-picker>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="fillCardDoctorName">
                  <l-formt-title label="报卡医生" :required="true" disabled>
                    <el-input
                      placeholder
                      v-model="ruleForm.fillCardDoctorName"
                      :disabled="true"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="fillCardDate">
                  <l-formt-title label="报卡日期" :required="true">
                    <el-date-picker
                      v-model="ruleForm.fillCardDate"
                      type="datetime"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder
                    ></el-date-picker>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="revisedDiagName">
                  <l-formt-title label="订正诊断">
                    <el-input
                      placeholder="请填写订正诊断"
                      v-model="ruleForm.revisedDiagName"
                      clearable
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="keshiTelephone">
                  <l-formt-title label="科室联系电话">
                    <el-input
                      placeholder="请填写科室联系电话"
                      v-model="ruleForm.keshiTelephone"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="keshiName">
                  <l-formt-title label="报告科室" disabled>
                    <el-input
                      placeholder="请填写报告科室"
                      v-model="ruleForm.keshi"
                      :disabled="true"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="reportUnit">
                  <l-formt-title label="报告单位" disabled>
                    <el-input
                      placeholder
                      v-model="ruleForm.reportUnit"
                      :disabled="true"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item prop="returnCardReason">
                  <l-formt-title label="退卡原因">
                    <el-input
                      placeholder="请填写退卡原因"
                      v-model="ruleForm.returnCardReason"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item prop="remark" label-width="0">
                  <l-formt-title label="备注" :isMultiRow="true">
                    <el-input
                      type="textarea"
                      placeholder="请填写备注"
                      v-model="ruleForm.remark"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <div class="reg-footer">
      <el-button
        type="primary"
        v-if="baokaFormData.state != '2'"
        @click="stagSubmit"
        >暂存</el-button
      >
      <el-button
        type="primary"
        v-if="baokaFormData.state != '2'"
        @click="submitForm"
        >提交</el-button
      >
    </div>
    <div class="infectiousCard-shade width100 height100" v-if="baokaFormData.state == '2'"></div>
  </div>
</template>
<script>
import {
  savePatientInfo,
  cacheInfectiousDiseaseCard,
} from "@/api/common/report.js";
import { deepClone } from "@/utils/index.js";

export default {
  components: {},
  props: {
    baokaFormData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      remoteParams: {
        pageSize: 10,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      // 报卡来源
      cardSourceOptions: [
        {
          label: "门诊",
          value: "1",
        },
        {
          label: "住院",
          value: "2",
        },
      ],
      // 年龄单位
      ageUnitOptions: [
        {
          label: "岁",
          value: "1",
        },
        {
          label: "月",
          value: "2",
        },
        {
          label: "天",
          value: "3",
        },
      ],
      // 报卡类型
      cardTypeOptions: [
        {
          label: "初次报卡",
          value: "1",
        },
        {
          label: "订正报卡",
          value: "2",
        },
      ],
      // 性别
      sexOptions: [
        {
          label: "男",
          value: "1",
        },
        {
          label: "女",
          value: "2",
        },
      ],
      // 病人属于
      patientAttributionOptions: [
        {
          label: "本县区",
          value: "1",
        },
        {
          label: "本市其它县区",
          value: "2",
        },
        {
          label: "本省其它城市",
          value: "3",
        },
        {
          label: "外省",
          value: "4",
        },
        {
          label: "港澳台",
          value: "5",
        },
        {
          label: "外籍",
          value: "6",
        },
      ],
      // 人群分类
      professionOptions: [
        {
          label: "幼托儿童",
          value: "幼托儿童",
        },
        {
          label: "散居儿童",
          value: "散居儿童",
        },
        {
          label: "学生（大中小学）",
          value: "学生（大中小学）",
        },
        {
          label: "教师",
          value: "教师",
        },
        {
          label: "保育员及保姆",
          value: "保育员及保姆",
        },
        {
          label: "餐饮食品业",
          value: "餐饮食品业",
        },
        {
          label: "公共场所服务员",
          value: "公共场所服务员",
        },
        {
          label: "商业服务",
          value: "商业服务",
        },
        {
          label: "医务人员",
          value: "医务人员",
        },
        {
          label: "工人",
          value: "工人",
        },
        {
          label: "民工",
          value: "民工",
        },
        {
          label: "农民",
          value: "农民",
        },
        {
          label: "牧民",
          value: "牧民",
        },
        {
          label: "渔（船）民",
          value: "渔（船）民",
        },
        {
          label: "干部职员",
          value: "干部职员",
        },
        {
          label: "海员及长途驾驶员",
          value: "海员及长途驾驶员",
        },
        {
          label: "离退人员",
          value: "离退人员",
        },
        {
          label: "家务及待业",
          value: "家务及待业",
        },
        {
          label: "不详",
          value: "不详",
        },
        {
          label: "其它",
          value: "其它()",
        },
      ],
      // 病例分类
      diseaseClassificationOneOptions: [
        {
          label: "疑似病例",
          value: "1",
        },
        {
          label: "临床诊断病例",
          value: "2",
        },
        {
          label: "确诊病例",
          value: "3",
        },
        {
          label: "病原携带者",
          value: "4",
        },
      ],
      diseaseClassificationTwoOptions: [
        {
          label: "急性",
          value: "1",
        },
        {
          label: "慢性（乙型肝炎、血吸虫病、丙肝）",
          value: "2",
        },
        {
          label: "未分型",
          value: "3",
        },
      ],
      ruleForm: {},
      rules: {
        patientName: [
          {
            required: true,
            message: "请填写患者姓名",
            trigger: ["blur", "change"],
          },
        ],
        paperwork: [
          {
            pattern:
              /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "身份证格式错误",
            trigger: ["blur", "change"],
          },
          {
            required: true,
            message: "请填写有效身份证号码",
            trigger: ["blur", "change"],
          },
        ],

        telephone: [
          {
            required: true,
            message: "请填写联系电话",
            trigger: ["blur", "change"],
          },
        ],
        addrCode: [
          {
            required: true,
            message: "请选择现住址",
            trigger: ["change"],
          },
        ],
        doorplateAddressCode: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: ["blur", "change"],
          },
        ],
        profession: [
          {
            required: true,
            message: "请选择人群分类",
            trigger: "change",
          },
        ],
        diseaseClassificationOne: [
          {
            required: true,
            message: "请选择病例分类",
            trigger: "change",
          },
        ],
        onsetDate: [
          {
            required: true,
            message: "请选择发病日期",
            trigger: "change",
          },
        ],
        diagDate: [
          {
            required: true,
            message: "请选择诊断日期",
            trigger: "change",
          },
        ],
        diagName: [
          {
            required: true,
            message: "请填写疾病诊断",
            trigger: ["change", "blur"],
          },
        ],
        fillCardDoctorName: [
          {
            required: true,
            message: "缺少报卡医生",
            trigger: ["change", "blur"],
          },
        ],
        fillCardDate: [
          {
            required: true,
            message: "请选择报卡日期",
            trigger: "change",
          },
        ],
      },
      loading: false,
    };
  },
  watch: {
    baokaFormData: {
      handler(val) {
        this.ruleForm = deepClone(val);
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    diagNameChange(val, item) {
      this.ruleForm.diagName = item.dictionaryName;
      this.ruleForm.icd10Encoding = item.icd10Encoding;
    },
    // 暂存
    async stagSubmit() {
      this.loading = true;
      try {
        let addrCodes =
          this.ruleForm.addrCode && this.ruleForm.addrCode.length
            ? {
                provinceAddressCode: this.ruleForm.addrCode[0] || "",
                cityAddressCode: this.ruleForm.addrCode[1] || "",
                countyAddressCode: this.ruleForm.addrCode[2] || "",
                streetAddressCode: this.ruleForm.addrCode[3] || "",
                villageAddressCode: this.ruleForm.addrCode[4] || "",
              }
            : {};
        let params = {
          ...this.ruleForm,
          ...addrCodes,
        };
        let { code, data, msg } = await cacheInfectiousDiseaseCard(params);
        if (code == 1) {
          this.$message.success("暂存成功");
          // TODO 刷新当前弹框的数据
          this.$refs.ruleForm.resetFields();
          this.ruleForm = this.handleData(data);
          this.$emit("submitBK", data, true);
        } else {
          this.$message.error(msg || "暂存失败");
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 提交
    submitForm() {
      if (this.ruleForm.patientName.length == "0") {
        this.$message.error("患者姓名");
        return;
      }

      if (this.ruleForm.paperwork.length == "0") {
        this.$message.error("请填写身份证号");
        return;
      }

      if (this.ruleForm.telephone.length == "0") {
        this.$message.error("请联系电话");
        return;
      }

      if (this.ruleForm.addrCode.length == "0") {
        this.$message.error("请填写现地址");
        return;
      }

      if (this.ruleForm.doorplateAddressCode.length == "0") {
        this.$message.error("请选择详细地址");
        return;
      }

      if (
        this.ruleForm.diseaseClassificationOne.length == "0" &&
        this.ruleForm.diseaseClassificationTwo.length == "0"
      ) {
        this.$message.error("请选择病例分类");
        return;
      }
      if (!this.ruleForm.onsetDate || this.ruleForm.onsetDate.length == "0") {
        this.$message.error("请写发病日期");
        return;
      }
      // ruleForm.diagDate
      if (!this.ruleForm.diagDate || this.ruleForm.diagDate.length == "0") {
        this.$message.error("请写诊断日期");
        return;
      }
      if (this.ruleForm.diagName.length == "0") {
        this.$message.error("请写疾病诊断");
        return;
      }
      // 报卡日期
      if (
        !this.ruleForm.fillCardDate ||
        this.ruleForm.fillCardDate.length == "0"
      ) {
        this.$message.error("请写报卡日期");
        return;
      }

      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            let params = {
              ...this.ruleForm,
              provinceAddressCode: this.ruleForm.addrCode[0],
              cityAddressCode: this.ruleForm.addrCode[1] || "",
              countyAddressCode: this.ruleForm.addrCode[2] || "",
              streetAddressCode: this.ruleForm.addrCode[3] || "",
              villageAddressCode: this.ruleForm.addrCode[4] || "",
              state: "2",
            };
            let { code, data, msg } = await savePatientInfo(params);
            if (code == 1) {
              this.$message.success("保存成功");
              this.$emit("submitBK", data, false);
            } else {
              this.$message.error(msg || "保存失败");
            }
          } catch (error) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
    // 处理查询到的报卡数据
    handleData(row) {
      let obj = deepClone(row);
      let addrCode = [
        Number(row.provinceAddressCode || ""),
        Number(row.cityAddressCode || ""),
        Number(row.countyAddressCode),
        Number(row.streetAddressCode || ""),
        Number(row.villageAddressCode || ""),
      ];
      obj.addrCode = addrCode.filter((item) => item !== 0);
      return obj;
    },
  },
};
</script>
<style lang="scss" scoped>
.form-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #000000;
  font-weight: 600;
}

.infectiousCard {
  background-color: #fff;
  overflow-y: auto;
  position: relative;
}

.infectiousCard-shade{
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0
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

.handler-box {
  padding: 20px;
  border-top: 1px solid $l-color-bgcolor-11;
  text-align: right;
  margin-right: 50px;
}

.patient-box {
  margin-bottom: 15px;
}

.patient-photo {
  img {
    width: 120px;
    height: 120px;
  }
}

.patient-info {
  padding-top: 20px;
  overflow: hidden;
}

.demo-ruleForm {
  /deep/ .el-form-item__content {
    line-height: 36px;
  }
}

.add-contacts {
  line-height: 36px;
  color: $l-color-fontcolor-2;
  border: 1px dashed $l-color-bgcolor-11;
  cursor: pointer;
  text-align: center;
  margin-bottom: 20px;
}

.contacts-box {
  position: relative;
}

.remove-contact {
  position: absolute;
  right: -66px;
  top: 0;
}

.age-box {
  .el-input {
    width: 30px;
    margin-right: 10px;

    /deep/ .el-input__inner {
      padding: 0 5px;
    }
  }

  .age-item {
    display: inline-block;
  }
}

.contain {
  width: 100%;
  padding: 0 20px;

  .dialog-header {
    width: 100%;
    margin-bottom: 30px;

    .detail {
      margin-top: 20px;
      margin-bottom: 18px;

      .title {
        height: 24px;
        margin-bottom: 20px;
        font-size: 16px;

        font-weight: bold;
        color: rgba(46, 50, 58, 1);
        line-height: 24px;

        span {
          display: inline-block;
          min-width: 35px;
          margin-right: 10px;
        }
      }

      .detail-cont {
        width: 100%;
        height: 20px;
        margin-bottom: 20px;

        .detail-cont-item {
          width: 30%;
          height: 20px;
          font-size: 14px;

          font-weight: 400;
          color: rgba(148, 157, 163, 1);
          line-height: 20px;
          float: left;

          i {
            margin-left: 10px;
            font-style: normal;
            color: rgba(46, 50, 58, 1);
          }
        }

        .balance-sum {
          i {
            height: 14px;
            font-size: 14px;

            font-weight: bold;
            color: $l-color-primary;
            line-height: 18px;
          }
        }
      }
    }

    .rechargeMethod {
      .title {
        height: 24px;
        margin-bottom: 15px;
        font-size: 16px;

        font-weight: bold;
        color: rgba(46, 50, 58, 1);
        line-height: 24px;
      }

      .sum {
        width: 100%;
        height: 76px;
        padding: 20px;
        background: $l-color-bgcolor-18;
        border-radius: 2px;
      }

      .radio-item {
        height: 48px;
        padding: 0 20px;
        border-radius: 2px;
        border: 1px solid $l-color-bgcolor-11;
        line-height: 48px;

        .balance {
          font-style: normal;
          font-size: $l-font-size;

          font-weight: 400;
          color: $l-color-fontcolor-4;
        }

        .el-radio__label {
          display: none;
        }
      }
    }
  }
}

.required {
  span:after {
    content: "*";
    width: 7px;
    height: 14px;
    font-size: 14px;

    padding-left: 5px;
    vertical-align: middle;
    font-weight: bolder;
    color: rgba(239, 15, 15, 1);
  }
}

/deep/ .el-dialog__footer {
  /*height: 36px;*/
  padding: 20px;
  border-top: 1px solid rgba(228, 228, 228, 1);
}

.ft0 {
  /deep/ .el-radio__label {
    font-size: 0;
  }
}

/deep/ .l-input-wrap {
  display: block;
}
</style>