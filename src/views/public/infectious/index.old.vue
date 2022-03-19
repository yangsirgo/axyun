<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="default"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="apply" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <div class="container height100" v-loading="loading">
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
                    <el-col :span="8">
                      <el-form-item prop="cardSource">
                        <l-formt-title label="报卡来源">
                          <el-select v-model="ruleForm.cardSource" placeholder="请选择">
                            <el-option
                              v-for="(item, i) in cardSourceOptions"
                              :key="i"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="cardType" label="报卡类型" label-width="80px">
                        <el-radio
                          v-for="(item, i) in cardTypeOptions"
                          :key="i"
                          v-model="ruleForm.cardType"
                          :label="item.value"
                        >{{ item.label }}</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="cardId">
                        <l-formt-title label="卡片编号" :disabled="true">
                          <el-input placeholder v-model="ruleForm.cardId" :disabled="true"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <!-- <el-col :span="8">
                      <el-form-item prop="patientId">
                        <l-formt-title label="病卡号" :required="true">
                          <el-input placeholder="请填写诊疗活动ID" v-model="ruleForm.pid"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>-->
                    <el-col :span="8">
                      <el-form-item prop="patientName">
                        <l-formt-title label="患者姓名" :required="true">
                          <el-input placeholder v-model="ruleForm.patientName"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="jiazhangxingming">
                        <l-formt-title label="患儿家长姓名">
                          <el-input placeholder="请填写患儿家长姓名" v-model="ruleForm.jiazhangxingming"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item prop="paperwork">
                        <l-formt-title label="有效身份证号码" :required="true">
                          <el-input placeholder="请填写有效身份证号码" v-model="ruleForm.paperwork"></el-input>
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
                        >{{ item.label }}</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="birthday">
                        <l-formt-title label="出生日期">
                          <el-date-picker
                            v-model="ruleForm.birthday"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions0"
                            placeholder="请选择出生日期"
                          ></el-date-picker>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item class="required" prop="regularAge" label-width="82px">
                        <span slot="label">实足年龄</span>
                        <el-input
                          placeholder="请填写实足年龄"
                          v-model="ruleForm.regularAge"
                          style="width: 60%"
                        ></el-input>
                        <el-select
                          class="float-right"
                          v-model="ruleForm.ageUnit"
                          placeholder
                          style="width: 30%"
                        >
                          <el-option
                            v-for="(item, i) in ageUnitOptions"
                            :key="i"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="workplace">
                        <l-formt-title label="工作单位">
                          <el-input placeholder="请填写工作单位" v-model="ruleForm.workplace"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="telephone">
                        <l-formt-title label="联系电话" required>
                          <el-input placeholder="请填写联系电话" v-model="ruleForm.telephone"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <el-form-item prop="patientAttribution" label="病人属于" label-width="80px">
                        <el-radio
                          v-for="(item, i) in patientAttributionOptions"
                          :key="i"
                          v-model="ruleForm.patientAttribution"
                          :label="item.value"
                        >{{ item.label }}</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item prop="addrCode">
                        <l-formt-title label="现住址1" :required="true">
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
                    <!-- <el-col :span="8">
                      <el-form-item prop="telephone">
                        <l-formt-title label="联系电话" required>
                          <el-input placeholder="请填写联系电话" v-model="ruleForm.telephone"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>-->
                    <el-col :span="12">
                      <el-form-item prop="villageAddressCode">
                        <l-formt-title label="详细住址" required>
                          <el-input placeholder="请填写工作单位" v-model="ruleForm.villageAddressCode"></el-input>
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
                        label-width="80px"
                      >
                        <span slot="label">人群分类</span>
                        <el-radio
                          v-for="(item, i) in professionOptions"
                          :key="i"
                          v-model="ruleForm.profession"
                          :label="item.value"
                        >{{ item.label }}</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <el-form-item
                        prop="diseaseClassificationOne"
                        class="required"
                        label="病例分类"
                        label-width="80px"
                      >
                        <div>
                          <span class="margin-right-10">(1)</span>
                          <el-radio
                            v-for="(item, i) in diseaseClassificationOneOptions"
                            :key="i"
                            v-model="ruleForm.diseaseClassificationOne"
                            :label="item.value"
                          >{{ item.label }}</el-radio>
                        </div>
                        <div>
                          <div class="margin-right-10" style="display: inline;">(2)</div>
                          <el-radio
                            v-for="(item, i) in diseaseClassificationTwoOptions"
                            :key="i"
                            v-model="ruleForm.diseaseClassificationTwo"
                            :label="item.value"
                          >{{ item.label }}</el-radio>
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
                            :picker-options="pickerOptions0"
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
                            :picker-options="pickerOptions0"
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
                            :picker-options="pickerOptions0"
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
                            :picker-options="pickerOptions0"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择初诊日期"
                          ></el-date-picker>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="diagName">
                        <!-- <l-formt-title label="疾病诊断">
                          <el-input placeholder="请填写疾病诊断" v-model="ruleForm.diagName" clearable></el-input>
                        </l-formt-title>-->

                        <LFormtTitle
                          label="疾病诊断"
                          labelWidth="96"
                          style="width:100%"
                          :required="true"
                        >
                          <el-form-item label label-width prop="diagName">
                            <l-value-domain
                              style="line-height: 34px;width:100%"
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
                            :picker-options="pickerOptions0"
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
                            :picker-options="pickerOptions0"
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
                          <el-input placeholder="请填写科室联系电话" v-model="ruleForm.keshiTelephone"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="keshiName">
                        <l-formt-title label="报告科室" disabled>
                          <el-input
                            placeholder="请填写报告科室"
                            v-model="ruleForm.keshiName"
                            :disabled="true"
                          ></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="reportUnit">
                        <l-formt-title label="报告单位" disabled>
                          <el-input placeholder v-model="ruleForm.reportUnit" :disabled="true"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <el-form-item prop="returnCardReason">
                        <l-formt-title label="退卡原因">
                          <el-input placeholder="请填写退卡原因" v-model="ruleForm.returnCardReason"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <el-form-item prop="remark" label="备注" label-width="60px">
                        <el-input type="textarea" placeholder="请填写备注" v-model="ruleForm.remark"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-form>
          </div>
          <div class="handler-box">
            <el-button
              @click="submitForm('ruleForm')"
              style="border-radius: 2px;border-color:#F05A23;color:#F05A23;"
            >提交</el-button>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import LeftBar from "@/views/cis/components/leftBar";
import { getPatientInfo, savePatientInfo } from "@/api/common/report";
import { mapGetters } from "vuex";
import Base64 from "@/utils/base64";
import { getRoles, getRole, setRole } from "@/utils/auth";
export default {
  components: {
    LeftBar
  },
  data() {
    return {
      remoteParams: { pageSize: 10 },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      cardSourceOptions: [
        // 报卡来源
        {
          label: "门诊",
          value: "1"
        },
        {
          label: "住院",
          value: "2"
        }
      ],
      ageUnitOptions: [
        // 年龄单位
        {
          label: "岁",
          value: "1"
        },
        {
          label: "月",
          value: "2"
        },
        {
          label: "天",
          value: "3"
        }
      ],
      cardTypeOptions: [
        // 报卡类型
        {
          label: "初次报卡",
          value: "1"
        },
        {
          label: "订正报卡",
          value: "2"
        }
      ],
      sexOptions: [
        // 性别
        {
          label: "男",
          value: "1"
        },
        {
          label: "女",
          value: "2"
        }
      ],
      patientAttributionOptions: [
        // 病人属于
        {
          label: "本县区",
          value: "1"
        },
        {
          label: "本市其它县区",
          value: "2"
        },
        {
          label: "本省其它城市",
          value: "3"
        },
        {
          label: "外省",
          value: "4"
        },
        {
          label: "港澳台",
          value: "5"
        },
        {
          label: "外籍",
          value: "6"
        }
      ],
      professionOptions: [
        // 人群分类
        { label: "幼托儿童", value: "幼托儿童" },
        { label: "散居儿童", value: "散居儿童" },
        { label: "学生（大中小学）", value: "学生（大中小学）" },
        { label: "教师", value: "教师" },
        { label: "保育员及保姆", value: "保育员及保姆" },
        { label: "餐饮食品业", value: "餐饮食品业" },
        { label: "公共场所服务员", value: "公共场所服务员" },
        { label: "商业服务", value: "商业服务" },
        { label: "医务人员", value: "医务人员" },
        { label: "工人", value: "工人" },
        { label: "民工", value: "民工" },
        { label: "农民", value: "农民" },
        { label: "牧民", value: "牧民" },
        { label: "渔（船）民", value: "渔（船）民" },
        { label: "干部职员", value: "干部职员" },
        { label: "海员及长途驾驶员", value: "海员及长途驾驶员" },
        { label: "离退人员", value: "离退人员" },
        { label: "家务及待业", value: "家务及待业" },
        { label: "不详", value: "不详" },
        { label: "其它", value: "其它()" }
      ],
      diseaseClassificationOneOptions: [
        // 病例分类
        {
          label: "疑似病例",
          value: "1"
        },
        {
          label: "临床诊断病例",
          value: "2"
        },
        {
          label: "确诊病例",
          value: "3"
        },
        {
          label: "病原携带者",
          value: "4"
        }
      ],
      diseaseClassificationTwoOptions: [
        {
          label: "急性",
          value: "1"
        },
        {
          label: "慢性（乙型肝炎、血吸虫病、丙肝）",
          value: "2"
        },
        {
          label: "未分型",
          value: "3"
        }
      ],
      ruleForm: {
        cardSource: "1", // 报卡来源
        cardType: "1", // 报卡类型
        cardId: "", // 卡片编号
        pid: "", // 病卡号
        patientName: "", // 患者姓名
        jiazhangxingming: "", // 家长姓名
        paperwork: "", // 有效身份证号码
        sex: "1", // 性别
        birthday: null, // 出生日期
        regularAge: "", // 实足年龄
        ageUnit: "1", // 年龄单位
        workplace: "", // 工作单位
        telephone: "", // 联系电话
        patientAttribution: "1", // 病人属于
        addrCode: [], // 现住址
        villageAddressCode: "", // 详细住址
        profession: "", // 人群分类
        diseaseClassificationOne: "", // 病例分类 必填
        diseaseClassificationTwo: "", // 病例分类
        chuzhenDate: null, // 初诊日期
        jiuzhenDate: new Date().format("yyyy-MM-dd hh:mm:ss"), // 就诊日期
        onsetDate: null, // 发病日期
        diagDate: new Date().format("yyyy-MM-dd hh:mm:ss"), // 诊断日期
        diagName: "", // 疾病诊断
        icd10Encoding: "", // 疾病编码
        deathDate: null, // 死亡日期
        fillCardDoctorName: "", // 报卡医生
        fillCardDate: new Date().format("yyyy-MM-dd hh:mm:ss"), // 报卡日期
        revisedDiagName: "", // 订正诊断
        keshiTelephone: "", // 科室联系电话
        keshiName: "", // 报告科室
        reportUnit: "", // 报告单位
        returnCardReason: "", // 退卡原因
        remark: "" // 备注
      },
      rules: {
        // pid: [
        //   { required: true, message: '请填写诊疗活动ID', trigger: ['blur', 'change'] },
        //   // { pattern: /^\d{1,}$/, message: '卡号格式错误', trigger: ['blur', 'change'] },
        // ],
        patientName: [
          {
            required: true,
            message: "请填写患者姓名",
            trigger: ["blur", "change"]
          }
        ],
        paperwork: [
          {
            required: true,
            message: "请填写有效身份证号码",
            trigger: ["blur", "change"]
          }
        ],
        regularAge: [
          {
            pattern: /^\d{1,}$/,
            message: "年龄格式错误",
            trigger: ["blur", "change"]
          },
          {
            required: true,
            message: "请填写实足年龄",
            trigger: ["blur", "change"]
          }
        ],
        telephone: [
          {
            pattern: /^(1[1235678490]\d{9})$/,
            message: "电话格式错误",
            trigger: ["blur", "change"]
          },
          {
            required: true,
            message: "请填写联系电话",
            trigger: ["blur", "change"]
          }
        ],
        addrCode: [
          { required: true, message: "请选择现住址", trigger: ["change"] }
        ],
        villageAddressCode: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: ["blur", "change"]
          }
        ],
        profession: [
          { required: true, message: "请选择人群分类", trigger: "change" }
        ],
        diseaseClassificationOne: [
          { required: true, message: "请选择病例分类", trigger: "change" }
        ],
        onsetDate: [
          {
            type: "string",
            required: true,
            message: "请选择发病日期",
            trigger: "change"
          }
        ],
        diagDate: [
          {
            type: "string",
            required: true,
            message: "请选择诊断日期",
            trigger: "change"
          }
        ],
        diagName: [
          {
            required: true,
            message: "请填写疾病诊断",
            trigger: ["change", "blur"]
          }
        ],
        fillCardDoctorName: [
          {
            required: true,
            message: "缺少报卡医生",
            trigger: ["change", "blur"]
          }
        ],
        fillCardDate: [
          {
            type: "string",
            required: true,
            message: "请选择报卡日期",
            trigger: "change"
          }
        ]
      },
      loading: false,
      toolBoxs: []
    };
  },
  computed: {
    ...mapGetters(["name", "receivePatientData"])
  },
  created() {
    this.ruleForm.fillCardDoctorName = Base64.decode(this.name);
    this.ruleForm.keshiName = JSON.parse(getRole()).deptName;
    this.ruleForm.reportUnit = JSON.parse(getRole()).hosName;
    this.ruleForm = {
      ...this.ruleForm,
      ...this.$route.query
    };
    this.ruleForm.icd10Encoding = this.$route.query.diagCode;
    console.log(this.$route.query.diagCode, "this.$route.query.diagCode");

    this.ruleForm.diagName=this.$route.query.diagName;
    this.patientInfo(this.$route.query.pid);
  },
  methods: {
    async patientInfo(id) {
      this.loading = true;
      let patientId = id;
      if (!patientId) {
        this.loading = false;
        return false;
      }
      try {
        let { code, data, msg } = await getPatientInfo(patientId);
        if (code === 1) {
          let age = data.archInfo.patientAge.substring(
            0,
            data.archInfo.patientAge.length - 1
          );
          let ageUnit = data.archInfo.patientAge.substring(
            data.archInfo.patientAge.length - 1,
            data.archInfo.patientAge.length
          );
          let addr = data.archAddrList.filter(val => val.addrType == 2);
          console.log(ageUnit == "岁");
          this.ruleForm.regularAge = age;
          this.ruleForm.ageUnit =
            ageUnit == "岁" ? "1" : ageUnit == "月" ? "2" : "3";
          this.ruleForm.workplace = data.archCompany.companyName;
          this.ruleForm.sex = data.archInfo.patientGender;
          this.ruleForm.patientName = data.archInfo.patientName;
          this.ruleForm.paperwork = data.archInfo.identificationNum;
          this.ruleForm.birthday = data.archInfo.birthDate;
          this.ruleForm.telephone = data.archInfo.mobileNum;
          if(addr[0].addrProvince&&addr[0].addrCity&&addr[0].addrDistrict){ // 三级地址都不为""，才可给addrCode赋值
            this.ruleForm.addrCode = [
              Number(addr[0].addrProvince),
              Number(addr[0].addrCity),
              Number(addr[0].addrDistrict)
            ];
          }else{
            this.ruleForm.addrCode = [];
          }
          console.log('现住址',this.ruleForm.addrCode)
          this.ruleForm.villageAddressCode = addr[0].detailAddr;
          this.ruleForm.pid = data.archInfo.patientId;
        } else {
          this.$message.error(msg);
        }
        this.loading = false;
      } catch (error) {
        // this.$message.error('网络错误')
        this.loading = false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true;
          let params = {
            ...this.ruleForm,
            provinceAddressCode: this.ruleForm.addrCode[0],
            cityAddressCode: this.ruleForm.addrCode[1],
            countyAddressCode: this.ruleForm.addrCode[2]
          };
          let { code, data, msg } = await savePatientInfo(params);
          if (code == 1) {
            this.$message.success("保存成功");
          }
          this.loading = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    diagNameChange(val, item) {

      this.ruleForm.diagName = item.dictionaryName;
      this.ruleForm.icd10Encoding = item.icd10Encoding;
    },
    messageHandler() {
      //
    }
  },
  watch: {
    receivePatientData: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        this.patientInfo(val.patientId);
        this.$refs["ruleForm"].resetFields();
      /*  this.ruleForm.diagName = val.diagName;*/
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
}
.reg-form {
  height: calc(100% - 77px);
  padding: 0 20px;
  overflow: hidden;
  overflow-y: auto;
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
  padding-right: 60px;
  /deep/ .el-form-item__content {
    line-height: 36px;
    margin-bottom: 20px;
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
