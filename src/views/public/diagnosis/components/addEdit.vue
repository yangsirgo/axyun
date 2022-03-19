<template>
  <div class="contain height100 width100">
    <div class="width100">
      <el-form ref="formElem" :model="accountRechargeForm" :rules="rules">
        <div class="inputs detail clearfix">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label label-width prop="diagType">
                <LFormtTitle
                  class="width100"
                  label="诊断类型"
                  labelWidth="76"
                  :required="true"
                  :disabled="disabledTrue"
                >
                  <el-select
                    class="select-container"
                    clearable
                    placeholder="请选择诊断类型"
                    v-model="accountRechargeForm.diagType"
                    :disabled="disabledTrue"
                  >
                    <el-option
                      v-for="item in diaTypeList"
                      :key="item._id"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label label-width prop="cwFlag">
                <LFormtTitle
                  class="width100"
                  label="中/西医"
                  labelWidth="68"
                  :required="true"
                >
                  <l-value-domain
                    class="select-container"
                    placeholder="请选择"
                    code="DIAGCWM"
                    :value.sync="accountRechargeForm.cwFlag"
                    @change="cwFlagChange"
                  />
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label label-width prop="isFirst">
                <LFormtTitle
                  class="width100"
                  label="初复诊"
                  labelWidth="62"
                  :required="true"
                >
                  <l-value-domain
                    class="select-container"
                    clearable
                    placeholder="请选择"
                    code="FirstOrNo"
                    :value.sync="accountRechargeForm.isFirst"
                  />
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label prop="startTime">
                <LFormtTitle
                  class="width100"
                  label="发病日期"
                  labelWidth="62"
                  :required="true"
                >
                  <el-date-picker
                    class="width100"
                    clearable
                    placeholder
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    style="line-height: 34px"
                    v-model="accountRechargeForm.startTime"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </LFormtTitle>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label label-width prop="diagName">
                <LFormtTitle
                  class="width100"
                  label="诊断名称"
                  labelWidth="96"
                  :required="true"
                >
                  <LocalDiagnosisSelector
                    v-if="hasIndexDb"
                    ref="LocalDiagnosisSelectorClear"
                    :WesternMedicineDiagnosis="WesternMedicineDiagnosis"
                    :ChineseMedicineDiagnosis="ChineseMedicineDiagnosis"
                    :diagName="accountRechargeForm"
                    @diagSelectorChange="diagSelectorChange"
                  ></LocalDiagnosisSelector>
                  <SelectAllowCreate
                    v-else
                    class="input-width-default width100"
                    clearable
                    ref="diagName"
                    style="line-height: 34px"
                    remoteUrl="/patTcmDiag/getDiagNameCode"
                    placeholder="请输入诊断名称"
                    :isUseInputValue="true"
                    :showNameSpecialCode="remoteShowCode"
                    :remoteParams="remoteParams"
                    :value.sync="accountRechargeForm.diagName"
                    :remoteShowKey="remoteShowKey"
                    :remoteValueKey="remoteValueKey"
                    @change="diagNameChange"
                  ></SelectAllowCreate>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label label-width prop="diagMain">
                <el-checkbox v-model="accountRechargeForm.diagMain">
                  主诊断
                </el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label label-width prop="status">
                <LFormtTitle
                  class="width100"
                  label="状态"
                  labelWidth="62"
                  :required="true"
                >
                  <l-value-domain
                    clearable
                    code="DiagStatus"
                    class="select-container"
                    placeholder="请选择"
                    :value.sync="accountRechargeForm.status"
                    @keydown.enter.native="valiedDiagMain('ruleForm')"
                  />
                </LFormtTitle>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="accountRechargeForm.cwFlag === '2'">
            <el-col :span="24">
              <el-form-item label prop="tcmSyndrome2">
                <LFormtTitle
                  class="width100"
                  label="中医证型"
                  :required="false"
                  :disabled="disabled2"
                >
                  <LSelectAllowCreate
                    class="width100"
                    placeholder="请输入中医证型"
                    remoteUrl="/patTcmSyndrome/pageList"
                    :disabled="disabled2"
                    :remoteParams="remoteParams1"
                    :accountRechargeForm="accountRechargeForm"
                    @change="syndromeChange"
                  ></LSelectAllowCreate>
                </LFormtTitle>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="
              accountRechargeForm.diagType === '1' ||
                accountRechargeForm.diagType === '3'
            "
          >
            <!-- 出院诊断 1 家床初步诊断 3 -->
            <el-form-item label label-width prop="diagResults">
              <LFormtTitle
                class="width100"
                label="病情"
                labelWidth="62"
                :required="true"
              >
                <l-value-domain
                  clearable
                  class="select-container"
                  placeholder="请选择"
                  code="EntranceCode"
                  :value.sync="accountRechargeForm.diagResults"
                />
              </LFormtTitle>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label label-width prop="diagIcd">
              <LFormtTitle class="width100" label="诊断描述" labelWidth="99">
                <el-input
                  class="width100"
                  clearable
                  placeholder
                  maxlength="25"
                  style="line-height: 34px"
                  v-model="accountRechargeForm.diagIcd"
                ></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer clearfix" style="padding-bottom: 0" slot="footer">
      <div style="float: right">
        <el-button
          type="primary"
          v-hotKey="{ func: 'func_submit', flag: 'submitLoad' }"
          :loading="submitLoad"
          @click="valiedDiagMain"
        >
          {{ editOrRegister }}
        </el-button>
        <el-button @click="cancel">关闭</el-button>
      </div>
    </div>

    <!-- 传染性疾病报卡 -->
    <!-- el-dialog
      width="80%"
      title="传染性疾病报卡"
      :visible.sync="dialogVisibleBK"
      :before-close="handleClose"
      :modal-append-to-body="true"
      :append-to-body="true"
    >
      <infectious-card
        ref="infectiousCard"
        :baokaData="baokaData"
        @submitBK="submitBK"
      ></infectious-card>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog> -->
    <el-dialog
      width="80%"
      top="10px"
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="handleClose"
      title="传染性疾病报卡"
      :visible.sync="dialogVisibleBK"
    >
      <baokaForm
        ref="infectiousCard"
        :baokaFormData="baokaFormData"
        @submitBK="submitBK"
      ></baokaForm>
    </el-dialog>
    <!-- 食源性疾病报卡 -->
    <el-dialog
      width="80%"
      title="食源性疾病报卡"
      :visible.sync="dialogVisibleBKStyle"
      :before-close="handleClose"
      :modal-append-to-body="true"
      :append-to-body="true"
    >
      <main-a
        ref="mainA"
        style="height: 600px"
        :baokaData="baokaData"
        @submitBK="submitBKStyle"
      ></main-a>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { deepClone } from "@/utils/index";

import diagNameList from "./diagNameList";
import SelectAllowCreate from "./selectAllowAndInput";

import infectiousCard from "@/views/public/infectious/dialogMain.vue"; //报卡弹窗
import mainA from "@/views/public/infectious/mainA.vue"; //食原型报卡弹窗
import baokaForm from "@/views/public/infectious/module/baokaForm.vue";

import addEditMixins from "../mixins/addEditMixins.js";
import LocalDiagnosisSelector from "@/components/LocalDiagnosisSelector";
import { updateDiag, addDiag, getDiaTypeList } from "@/api/common/diagnosis";
import localForage from "localforage";
import baokaMixin from "@/views/public/infectious/mixins/baokaMixin.js";
export default {
  name: "diagnosisEdit",
  components: {
    diagNameList,
    SelectAllowCreate,
    infectiousCard,
    mainA,
    LocalDiagnosisSelector,
    baokaForm
  },
  props: [
    "patientId",
    "patientSex",
    "patientBirthday",
    "patientName",
    "asd",
    "inpCode",
    "diagDoctorName",
    "deptName",
    "deptId",
    "visitCode",
    "diagDoctorId",
    "clinicType",
    "hdm",
    "table",
    "aOrE", // 判断新增or编辑
    // 1：门诊 2：急诊 3：住院
    "hosType",
    "diagAdds"
    
  ],
  mixins: [addEditMixins, baokaMixin],
  data() {
    return {
      hasIndexDb: false,
      ChineseMedicineDiagnosis: [],
      WesternMedicineDiagnosis: [],
      //诊断类型列表
      diaTypeList: [],
      accountRechargeForm: {
        cwFlagName: "西医",
        diagName: "",
        status: "0", // 状态
        diagType: "",
        cwFlag: "1",
        diagIcd: "",
        diagMain: "",
        isFirst: "1", // 初复诊 默认初诊
        startTime: this.dayjs(new Date()).format("YYYY-MM-DD HH:mm"), // 发病日期
        elementId: "",
        id: "",
        tcmSyndrome2: [], // 中医证型
        tcmSyndrome: [], // 中医证型
        diagResults: "", // 病情
        diagTime: this.dayjs(new Date()).format("YYYY-MM-DD") + " 12:00" //诊断日期
      },
      onsetDate: "", //发病
      rules: {
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change"
          }
        ],
        diagType: [
          {
            required: true,
            message: "请选择诊断类型",
            trigger: "change"
          }
        ],
        diagResults: [
          {
            required: true,
            message: "请选择病情",
            trigger: "change"
          }
        ],
        tcmSyndrome2: [],
        diagCode: [
          {
            required: true,
            message: "请输入诊断名称",
            trigger: "blur"
          }
        ],
        cwFlag: [
          {
            required: true,
            message: "请选择中/西医",
            trigger: "change"
          }
        ],
        diagIcd: [
          {
            message: "请输入诊断描述",
            trigger: "blur"
          }
        ],
        diagMain: [
          {
            required: false,
            message: "请选择主诊断",
            trigger: "change"
          }
        ],
        isFirst: [
          {
            required: true,
            message: "请选择初复诊",
            trigger: "change"
          }
        ],
        startTime: [
          {
            required: true,
            message: "请选择发病日期",
            trigger: "blur"
          }
        ],
        diagName: [
          {
            required: true,
            message: "请选择诊断名称",
            trigger: "blur"
          }
        ]
      },
      // 诊断名称入参
      remoteParams: {
        keyword: "",
        type: this.handleHosType(),
        cwFlag: "1"
      },
      // 中医证型数据
      remoteParams1: {
        // diagCodes: "",
        keyword: "",
        pageNo: 1,
        pageSize: 20
      },
      disabledTrue: false,

      remoteShowKey: "dictionaryName",
      remoteValueKey: "icd10DictionaryId",
      remoteShowCode: "icd10Encoding",
      oldDiagCode: null,
      submitLoad: false,
      // 发病日期只允许选择今天之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dialogVisibleBK: false, // 报卡dialog
      dialogVisibleBKStyle: false, //食源性报卡
      baokaData: {} //报卡数据
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("diagnosis", ["diagnosisData"]),
    isUsedSave() {
      return this.$route.path === "/cisOne/cisThree";
    },
    // 提交按钮为修改还是登记
    editOrRegister() {
      return this.aOrE === true ? "确认登记" : "确认修改";
    },
    // 控制中医证型是否可用
    disabled2() {
      return this.accountRechargeForm.diagName ? false : true;
    }
  },
  watch: {
    asd: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log(`asd`, val);
        this.$refs.LocalDiagnosisSelectorClear &&
          this.$refs.LocalDiagnosisSelectorClear.clear();
        this.$nextTick(() => {
          this.oldDiagCode = val.diagCode;

          // 改变remoteParams1，得到当前诊断名称下拉框列表值-
          this.rest();
          if (!this.aOrE) {
            // 修改
            this.setDiagMain(val, val.diagMain);
          }
        });
      }
    },
    aOrE: {
      immediate: true,
      handler(val) {
        console.log(`val`, val);
        this.$nextTick(() => {
          this.rest();
          if (!val) {
            this.setDiagMain(this.asd, this.asd.diagMain);
          } else {
            this.remoteParams1 = {
              // diagCodes: "",
              keyword: "",
              pageNo: 1,
              pageSize: 20
            };
          }
        });
      }
    }
  },
  created() {
    // 初始化数据
    this.initDataBeforeRender();
  },
  mounted() {
    //获取诊断
    this.getDiaTypeList();
    // 获取本地诊断数据
    this.getLocalDiagnosisData();
  },
  /**
   *
   *  initDataBeforeRender （页面初始化数据处理）：
   *  1. 对页面相应数据根据props 做处理
   *  cwFlagChange （中西医切换）：
   *  1. 中西医诊断切换
   *  2. 重置中西医对应的展示数据
   *
   *  confirm （诊断提交按钮）
   *  1.对诊断数据进行逻辑校验
   *  2.区分新增和提交，并走相应逻辑和提交接口
   *
   *  cancel (页面关闭按钮)
   *  1. 重置诊断录入表单元素的校验状态
   *  2. 抛出相应事件，便于父组件监控进行相关操作（隐藏诊断录入界面）
   *
   *  diagNameChange （诊断名称切换事件）
   *  1.重置相应的诊断相关数据
   *
   *  syndromeChange （中医证型select change事件）
   *  1.重置相应的诊断相关数据
   *
   *  handleClose (报卡弹窗 取消按钮点击事件)
   *  1、触发confirm弹窗
   *
   *  submitBK （传染性疾病报卡 弹窗提交按钮）
   *  1.关闭弹窗
   *  2.抛出事件，父组件监控并处理
   *
   *  submitBKStyle （食源性疾病报卡）
   *  1、关闭弹窗
   *  2.抛出事件，父组件监控并处理
   * */
  methods: {
    ...mapActions({
      changeRef: "diagnosis/changeRef",
      changeReloadPatient: "base/changeReloadPatient"
    }),
    // 获取缓存里的诊断数据
    async getLocalDiagnosisData() {
      try {
        const res = await this.diagnosisData.ChineseMedicine;
        console.log(`res`, res)
        if (res === null) {
          this.hasIndexDb = false;
        } else {
          this.hasIndexDb = true;
        }
        console.log(`this.hasIndexDb`, this.hasIndexDb)
      } catch (err) {
        console.log(err);
      }
    },
    diagSelectorChange(val) {
      console.log(`diagSelectorChange---`, JSON.parse(JSON.stringify(val)));
      this.accountRechargeForm.diagCode = val.diagCode;
      this.accountRechargeForm.diagName = val.diagName;
      // 中医证型 数据 置空
      // this.accountRechargeForm.tcmSyndrome2 = [];
      // if (curItem) {
      //   // 西医
      //   if (typeof curItem.dictionaryName !== "undefined") {
      //     this.accountRechargeForm.diagCode = curItem.icd10Encoding;
      //     this.accountRechargeForm.diagName = curItem.dictionaryName;
      //   } else {
      //     // 中医
      //     this.accountRechargeForm.diagCode = curItem.tcdCode;
      //     this.accountRechargeForm.diagName = curItem.tcdName;
      //   }
      // } else {
      //   this.accountRechargeForm.diagCode = "";
      //   this.accountRechargeForm.diagName = "";
      // }
    },

    //获取诊断类型
    async getDiaTypeList() {
      try {
        const { code, data } = await getDiaTypeList();
        if (code == 1) {
          this.handleDiaTypeList(data);
        }
      } catch (e) {
        console.log(e);
      }
    },
    handleDiaTypeList(data) {
      let arr = [];
      let hosType = this.handleHosType() == "1" ? "1" : "2";
      for (let i in data) {
        if (data[i]["type"] == hosType) {
          arr.push({ ...data[i] });
        }
      }
      this.diaTypeList = arr;
      console.log(this.diaTypeList, "this.diaTypeList");
    },
    handleHosType() {
      return this.hosType == "1" ? 1 : this.hosType === "3" ? 2 : "";
    },
    // 初始化数据
    initDataBeforeRender() {
      // 是门诊流程下的诊断录入就锁定select
      if (this.handleHosType() == "1") {
        this.accountRechargeForm.diagType = "2";
        this.disabledTrue = true;
      } else {
        this.accountRechargeForm.diagType = "";
        this.disabledTrue = false;
      }
    },
    // 中医证型 change事件
    syndromeChange(item, curItems) {
      this.accountRechargeForm.tcmSyndrome = "";
      this.accountRechargeForm.tcmSyndromeCode = "";
      item.forEach((el, i) => {
        // console.log(`el`, el);
        // console.log(`i`, i);
        if (i === item.length - 1) {
          this.accountRechargeForm.tcmSyndrome += el.tcdName;
          this.accountRechargeForm.tcmSyndromeCode += el.tcdCode;
        } else {
          this.accountRechargeForm.tcmSyndrome += `${el.tcdName},`;
          this.accountRechargeForm.tcmSyndromeCode += `${el.tcdCode},`;
        }
      });
      // if (!item.length) {
      //   return;
      // }
      // let curItem = [];
      // for (let i in curItems) {
      //   if (curItems[i]) {
      //     curItem.push(curItems[i]);
      //   }
      // }

      // let value = "",
      //   code = "";
      // let length = curItem.length;
      // if (length === 1) {
      //   value = curItem[0].tcdName;
      //   code = curItem[0].tcdCode;
      // } else if (length > 1) {
      //   for (let index = 0; index < length; index++) {
      //     code =
      //       code === ""
      //         ? curItem[index].tcdCode
      //         : code + "," + curItem[index].tcdCode;
      //     value =
      //       value === ""
      //         ? curItem[index].tcdName
      //         : value + "," + curItem[index].tcdName;
      //   }
      // }
      // 更新数据
      // this.accountRechargeForm.tcmSyndrome = value;
      // this.accountRechargeForm.tcmSyndromeCode = code;
      // this.accountRechargeForm.tcmSyndrome2 = this.accountRechargeForm.tcmSyndromeCode.split(
      //   ","
      // );
      this.accountRechargeForm.tcmSyndrome2 = item;
      console.log("77777777777777777", this.accountRechargeForm.tcmSyndrome2);
      // 更新成最新的数据
      this.remoteParams1 = {
        // diagCodes: '',
        keyword: this.remoteParams1.keyword,
        pageNo: 1,
        pageSize: 20
      };
      console.log(`this.accountRechargeForm----`, this.accountRechargeForm);
    },
    // 验证存的是主诊断是否有诊断编码
    valiedDiagMain() {
      console.log(this.accountRechargeForm, "提交前的：accountRechargeForm");
      let hasDiagMain = this.diagAdds.some(item => {
        return item.diagMain === "1";
      });
      if(!(!this.accountRechargeForm.diagCode && !hasDiagMain)) {
        this.confirm();
        return;
      }
      let htmls = '<p>主诊断为自定义诊断。</p><p>根据医保报销要求，主诊断为"自定义诊断"可能会影响医保患者的报销比例。</p>'
      this.$confirm(htmls, '请注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.confirm();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消保存！'
          });          
        });
    },
    // 验证并提交
    confirm() {
      console.log(this.accountRechargeForm, "提交前的：accountRechargeForm");
      const startTime = this.accountRechargeForm.startTime;

      let fbTime = startTime;
      if (!startTime == "") {
        fbTime = startTime.replace(/-/g, "/");
      }
      if (new Date(fbTime) > Date.now()) {
        this.$message.warning("请选择正确的发病日期");
        return;
      }
      this.onsetDate = startTime;
      if (this.aOrE) {
        console.log(`this.aOrE 保存`, this.aOrE);
        this.$refs["formElem"].validate(valid => {
          if (valid) {
            let data = deepClone(this.accountRechargeForm);
            if (this.clinicType == "1") {
              data.visitCode = this.visitCode;
              this.$delete(data, "treatNo");
              this.$delete(data, "inpCode");
            } else if (this.clinicType == "3") {
              data.inpCode = this.inpCode;
              this.$delete(data, "visitCode");
            }
            data.patientId = this.patientId;
            data.diagDoctorId = this.diagDoctorId;
            data.diagDoctorName = this.diagDoctorName;
            data.deptId = this.deptId;
            data.deptName = this.deptName;
            data.patientSex = this.patientSex;
            data.patientBirthday = this.patientBirthday;
            data.patientName = this.patientName;
            //传入就诊类型是门诊or住院 clinicType：就诊类型1:门诊  2：急诊  3：住院
            data.clinicType = this.clinicType;
            // diagType：诊断类型  2:门诊诊断 3:家床诊断
            if (!data.diagType) {
              data.diagType = this.clinicType == "1" ? "2" : "3";
            }
            data.diagMain ? (data.diagMain = "1") : (data.diagMain = "0");
            this.submitLoad = true;
            if (
              data.cwFlag === "1" ||
              (Array.isArray(data.tcmSyndrome) && !data.tcmSyndrome.length)
            ) {
              data.tcmSyndrome = "";
              data.tcmSyndromeCode = "";
            }

            delete data.tcmSyndrome2;
            data.id = "";

            let receiveData = {};
            if (this.hosType == "1") {
              receiveData = {
                appointmentId: this.receivePatientData.appointmentId,
                freeCode: this.receivePatientData.freeCode,
                haveMoney: this.receivePatientData.haveMoney
              };
            }
            console.log(`...data,`, JSON.parse(JSON.stringify(data)));
            console.log(`receiveData`, JSON.parse(JSON.stringify(receiveData)));
            // return;
            addDiag({
              ...data,
              ...receiveData
            })
              .then(async res => {
                if (res.code === 1) {
                  this.$message.success("添加成功");
                  if (this.isUsedSave) {
                    // 添加对诊断关系的维护
                    const paramsObj = {
                      enId: this.visitCode,
                      enTpCd: "01",
                      isHome: "0",
                      diagRelationList: [
                        {
                          diagCode: data.diagCode || "",
                          diagName: data.diagName,
                          isAuto: "0"
                        }
                      ]
                    };
                    await this.saveDiagRelationHandler(paramsObj);
                  }

                  if (this.hosType === "1") {
                    await this.goBaoka(data);
                  }
                  this.changeRef();
                  this.rest();
                  // 清空 数据
                  this.clearFormDataHandler();
                  this.changeReloadPatient({}); // 刷新左侧病人列表，初次登记改变接诊状态才有必要刷新，
                  this.remoteParams.cwFlag = "1";
                  this.cwFlagChange("1", { code: "1", name: "西医" });
                  this.$emit("rechargeConfirm", false);
                } else {
                  this.$message.error(res.msg || "添加失败");
                }
              })
              .catch(err => {
                console.log(err);
              })
              .finally(() => {
                this.submitLoad = false;
              });
          }
        });
      } else {
        console.log(`this.aOrE 修改`, this.aOrE);
        this.$refs["formElem"].validate(valid => {
          if (valid) {
            console.log(`this.accountRechargeForm`, this.accountRechargeForm);
            let data = deepClone(this.accountRechargeForm);
            data.diagMain ? (data.diagMain = "1") : (data.diagMain = "0");
            this.submitLoad = true;
            if (!data.startTime) {
              data.startTime = "";
            }
            if (data.cwFlag === "1") {
              data.tcmSyndrome = "";
              data.tcmSyndromeCode = "";
            }
            console.log("data :>> ", JSON.parse(JSON.stringify(data)));
            updateDiag(data)
              .then(async res => {
                if (res.code === 1) {
                  this.$message.success("编辑成功");
                  this.changeRef();

                  if (this.isUsedSave) {
                    // 维护诊断
                    const paramsObj = {
                      enId: this.visitCode,
                      enTpCd: "01",
                      isHome: "0",
                      diagRelationList: [{ diagCode: this.oldDiagCode }]
                    };
                    // 先删除  在保存诊断关系
                    await this.deleteDiagRelationHandler(paramsObj);

                    const paramsObj1 = {
                      enId: this.visitCode,
                      enTpCd: "01",
                      isHome: "0",
                      diagRelationList: [
                        {
                          diagCode: data.diagCode || "",
                          diagName: data.diagName,
                          isAuto: "0"
                        }
                      ]
                    };
                    await this.saveDiagRelationHandler(paramsObj1);
                  }

                  this.rest();
                  // 清空 数据
                  this.clearFormDataHandler();
                  this.$emit("addDiagHandler", true);
                  this.$emit("rechargeConfirm", false);
                  this.remoteParams.cwFlag = "1";
                  this.cwFlagChange("1", { code: "1", name: "西医" });
                } else {
                  this.$message.error(res.msg || "编辑失败");
                }
              })
              .catch(err => {
                console.log(err);
              })
              .finally(() => {
                this.submitLoad = false;
              });
          }
        });
      }
    },
    clearFormDataHandler() {
      this.accountRechargeForm = {
        cwFlagName: "西医",
        diagName: "",
        status: "0", // 状态
        diagType: "",
        cwFlag: "1",
        diagIcd: "",
        diagMain: "",
        isFirst: "1", // 初复诊 默认初诊
        startTime: this.dayjs().format("YYYY-MM-DD HH:mm"), // 发病日期
        elementId: "",
        id: "",
        tcmSyndrome2: [], // 中医证型
        tcmSyndrome: [], // 中医证型
        diagResults: "", // 病情
        diagTime: this.dayjs().format("YYYY-MM-DD") + " 12:00" //诊断日期
      };
      // 情况中医证型相关数据
      this.accountRechargeForm.tcmSyndrome = "";
      this.accountRechargeForm.tcmSyndromeCode = "";
      this.initDataBeforeRender();
    },
    // 关闭诊断录入模块
    cancel() {
      this.rest();
      this.$emit("rechargeCancel");
    },
    // 诊断名称切换
    diagNameChange(value, curItems) {
      let curItem = {
        ...curItems
      };
      console.log(`curItem`, JSON.parse(JSON.stringify(curItem)));
      // 中医证型 数据 置空
      this.accountRechargeForm.tcmSyndrome2 = [];
      if (curItem) {
        // 西医
        if (typeof curItem.dictionaryName !== "undefined") {
          this.accountRechargeForm.diagCode = curItem.icd10Encoding;
          this.accountRechargeForm.diagName = curItem.dictionaryName;
        } else {
          // 中医
          this.accountRechargeForm.diagCode = curItem.tcdCode;
          this.accountRechargeForm.diagName = curItem.tcdName;
        }
      } else {
        this.accountRechargeForm.diagCode = "";
        this.accountRechargeForm.diagName = "";
      }
    },
    // 中西医切换
    cwFlagChange(item, curItem) {
      console.log(
        `this.$refs.LocalDiagnosisSelectorClear`,
        this.$refs.LocalDiagnosisSelectorClear
      );
      this.$refs.LocalDiagnosisSelectorClear &&
        this.$refs.LocalDiagnosisSelectorClear.clear();

      // 重置中西医选项的数据
      this.accountRechargeForm.cwFlag = curItem.code;
      this.accountRechargeForm.cwFlagName = curItem.name;

      // 重置诊断名称相关数据
      this.accountRechargeForm.diagName = "";
      this.accountRechargeForm.diagCode = "";
      this.accountRechargeForm.tcmSyndrome2 = [];
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    submitBK(data, flag) {
      if (!flag) {
        this.dialogVisibleBK = false;
        this.$emit("rechargeCancel", false);
      }
    },
    submitBKStyle(data) {
      this.dialogVisibleBKStyle = false;
      this.$emit("rechargeCancel", false);
    }
  },
  beforeDestroy() {
    console.log(`ChineseMedicineDiagnosis----destroyed`);
    this.ChineseMedicineDiagnosis = [];
    this.WesternMedicineDiagnosis = [];
  }
};
</script>

<style scoped lang="scss">
.contain {
  padding: 0 20px;
}

.detail {
  margin-bottom: 8px;
}

.dialog-footer {
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
