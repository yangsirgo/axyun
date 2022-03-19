<template>
  <div class="contain">
    <l-card-title class="margin-bottom-8"><span slot="left">添加诊断</span></l-card-title>
    <div class="dialog-header">
      <el-form
        :model="accountRechargeForm"
        :rules="rules"
        ref="formElem"
      >
        <div class="detail">
          <div class="inputs clearfix">
            <el-row :gutter="10">
              <el-col :span="6">
                <LFormtTitle
                  :required="true"
                  label="中/西医"
                  labelWidth="68"
                  style="width:100%"
                >
                  <el-form-item
                    label
                    label-width
                    prop="cwFlag"
                  >
                    <l-value-domain
                      :code="codeCwFlag"
                      :value.sync="accountRechargeForm.cwFlag"
                      class="select-container"
                      placeholder="请选择"
                      @change="cwFlagChange"
                    />
                    <!-- remoteValueKey="name" -->
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="9">
                <!-- <LFormtTitle :required="true" label="诊断名称" labelWidth="96" style="width:100%">
                  <el-form-item label label-width prop="diagName">
                    <l-value-domain
                      ref="diagName"
                      style="line-height: 34px;width:100%"
                      remoteUrl="/patTcmDiag/getDiagNameCode"
                      :remoteParams="remoteParams"
                      :value.sync="accountRechargeForm.diagName"
                      placeholder="请输入诊断名称"
                      :remoteShowKey="remoteShowKey"
                      :remoteValueKey="remoteValueKey"
                      class="input-width-default"
                      @change="diagNameChange"
                    ></l-value-domain>
                  </el-form-item>
                </LFormtTitle>-->
                <el-form-item
                  label
                  label-width
                  prop="diagName"
                >
                  <LFormtTitle
                    :required="true"
                    label="诊断名称"
                    labelWidth="96"
                    style="width:100%"
                  >
                    <select-allow-create
                      ref="diagName"
                      style="line-height: 34px;width:100%"
                      remoteUrl="/patTcmDiag/getDiagNameCode"
                      :remoteParams="remoteParams"
                      :value.sync="accountRechargeForm.diagName"
                      placeholder="请输入诊断名称"
                      :remoteShowKey="remoteShowKey"
                      :remoteValueKey="remoteValueKey"
                      class="input-width-default"
                      @change="diagNameChange"
                    ></select-allow-create>

                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label
                  label-width
                  prop="status"
                >
                  <LFormtTitle
                    :required="true"
                    label="状态"
                    labelWidth="62"
                    style="width:100%"
                  >
                    <l-value-domain
                      code="DiagStatus"
                      :value.sync="accountRechargeForm.status"
                      class="select-container"
                      placeholder="请选择"
                    />

                  </LFormtTitle>
                </el-form-item>
              </el-col>

              <!-- <el-col :span="6">
                <LFormtTitle
                  :required="true"
                  label="初复诊"
                  labelWidth="62"
                  style="width:100%"
                >
                  <el-form-item
                    label
                    label-width
                    prop="isFirst"
                  >
                    <l-value-domain
                      :code="codeIsfirst"
                      :value.sync="accountRechargeForm.isFirst"
                      class="select-container"
                      placeholder="请选择"
                    />
                  </el-form-item>
                </LFormtTitle>
              </el-col> -->
              <el-col :span="3">
                <el-form-item
                  label
                  label-width
                  prop="diagMain"
                >
                  <el-checkbox v-model="accountRechargeForm.diagMain">主诊断</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              :gutter="10"
            >
              <el-col :span="6">
                <LFormtTitle
                  :required="true"
                  label="诊断类型"
                  labelWidth="76"
                  :disabled="disabledTrue"
                  style="width:100%"
                >
                  <!-- diagType：诊断类型  2:门诊诊断 3:登记诊断 -->
                  <el-form-item
                    label
                    label-width
                    prop="diagType"
                  >
                    <l-value-domain
                      :code="codeDiagType"
                      :disabled="disabledTrue"
                      :value.sync="accountRechargeForm.diagType"
                      class="select-container"
                      placeholder="请选择诊断类型"
                    />
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="9">
                <LFormtTitle
                  label="诊断描述"
                  labelWidth="99"
                  style="width:100%"
                >
                  <el-form-item
                    label
                    label-width
                    prop="diagIcd"
                  >
                    <el-input
                      maxlength="25"
                      v-model="accountRechargeForm.diagIcd"
                      placeholder
                      style="line-height: 34px;width:100%"
                    ></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="6">
                <LFormtTitle
                  label="发病日期"
                  labelWidth="62"
                  style="width:100%"
                >
                  <el-form-item
                    label
                    prop="startTime"
                  >
                    <el-date-picker
                      v-model="accountRechargeForm.startTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      placeholder
                      style="line-height: 34px;width:100%"
                      :picker-options="pickerOptions"
                    ></el-date-picker>
                  </el-form-item>
                </LFormtTitle>
              </el-col>

              <el-col :span="3">
                <!-- <LFormtTitle
                  v-if="accountRechargeForm.cwFlag === '2'"
                  :required="true"
                  label="中医证型"
                  style="width:100%"
                >
                  <el-form-item label prop="tcmSyndrome2">
                    <l-value-domain
                      style="line-height: 34px;width:100%"
                      remoteUrl="/patTcmSyndrome/pageList"
                      :remoteParams="remoteParams1"
                      :value.sync="accountRechargeForm.tcmSyndrome2"
                      placeholder="请输入中医证型"
                      :disabled="disabled2"
                      remoteShowKey="tcdName"
                      remoteValueKey="tcdCode"
                      multiple
                      @change="syndromeChange"
                    ></l-value-domain>
                  </el-form-item>
                </LFormtTitle>-->

                <el-form-item
                  label
                  prop="tcmSyndrome2"
                  v-if="accountRechargeForm.cwFlag === '2'"
                >
                  <LFormtTitle
                    :required="false"
                    label="中医证型"
                    style="width:100%"
                  >
                    <select-allow-create
                      style="line-height: 34px;width:100%"
                      remoteUrl="/patTcmSyndrome/pageList"
                      :remoteParams="remoteParams1"
                      :value.sync="accountRechargeForm.tcmSyndrome2"
                      placeholder="请输入中医证型"
                      :disabled="disabled2"
                      remoteShowKey="tcdName"
                      remoteValueKey="tcdCode"
                      multiple
                      @change="syndromeChange"
                    ></select-allow-create>

                  </LFormtTitle>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row
              v-if="accountRechargeForm.diagType==='1'||accountRechargeForm.diagType==='3' "
              :gutter="10"
            >
              <!-- 出院诊断 1 登记初步诊断 3 -->
              <LFormtTitle
                :required="true"
                label="病情"
                labelWidth="62"
                style="width:100%"
              >
                <el-form-item
                  label
                  label-width
                  prop="diagResults"
                >
                  <l-value-domain
                    code="EntranceCode"
                    :value.sync="accountRechargeForm.diagResults"
                    class="select-container"
                    placeholder="请选择"
                  />
                </el-form-item>
              </LFormtTitle>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <div
      class="dialog-footer clearfix"
      style="padding-bottom:0;"
      slot="footer"
    >
      <div style="float:right">
        <el-button
          type="primary"
          @click="confirm"
          :loading="submitLoad"
          v-hotKey="{ func: 'func_submit', flag: 'submitLoad' }"
        >{{editOrRegister}}</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from "@/utils/index";
import { updateDiag, addDiag, getCardByICD } from "@/api/common/diagnosis";
import { receive } from "@/api/cis/visit/visit";
import diagNameList from "./diagNameList";
import { mapActions, mapGetters } from "vuex";
import { format } from "path";
// import selectAllowCreate from "./selectAllowCreate"; // 改成用下边这个，可输入，可筛选
import selectAllowCreate from "./selectAllowAndInput";
import { getPatientInfo, savePatientInfo } from "@/api/common/report";

export default {
  name: "diagnosisEdit",
  components: { diagNameList, selectAllowCreate },
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
    "aOrE",
    "hosType"
    // 1：门诊 2：急诊 3：住院
  ],
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.accountRechargeForm.tcmSyndrome2.length >= 1) {
        callback();
      } else {
        callback(new Error("请输入中医证型"));
      }
    };
    return {
      accountRechargeForm: {
        cwFlagName: "西医",
        diagName: "",
        status: "0", // 状态
        diagType: "",
        cwFlag: "1",
        diagIcd: "",
        diagMain: "",
        isFirst: "1", // 初复诊 默认初诊
        startTime: new Date().format("yyyy-MM-dd hh:mm"), // 发病日期
        elementId: "",
        id: "",
        tcmSyndrome2: [], // 中医证型
        tcmSyndrome: [], // 中医证型
        diagResults: "", // 病情
        diagTime: new Date().format("yyyy-MM-dd") + " 12:00" //诊断日期
      },
      /*accountRechargeForm: {}, */

      rules: {
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
        /* tcmSyndrome2: [
          {
            required: true,
            validator: validatePass,
            message: "请输入中医证型",
            trigger: "blur"
          }
        ], */
        tcmSyndrome2: [
          // {
          //   validator: validatePass,
          //   trigger: "change"
          // }
        ],
        diagCode: [
          { required: true, message: "请输入诊断名称", trigger: "blur" }
        ],
        cwFlag: [
          { required: true, message: "请选择中/西医", trigger: "change" }
        ],
        diagIcd: [{ message: "请输入诊断描述", trigger: "blur" }],
        diagMain: [
          { required: false, message: "请选择主诊断", trigger: "change" }
        ],
        isFirst: [
          { required: true, message: "请选择初复诊", trigger: "change" }
        ],
        startTime: [{ message: "请选择发病日期", trigger: "change" }],
        diagName: [
          { required: true, message: "请选择诊断名称", trigger: "blur" }
        ]
      },
      // true: true,
      disabled2: true,
      // remoteShowKey: "dictionaryName",
      // remoteValueKey: "icd10DictionaryId",

      // 提交按钮为修改还是登记
      editOrRegister: this.aOrE === true ? "保存" : "保存",
      remoteParams: {
        keyword: "",
        type: this.hosType === "1" ? 1 : this.hosType === "3" ? 2 : "",
        cwFlag: "1"
      },
      // 中医证型数据
      remoteParams1: { pageSize: 10, diagId: "" },
      disabledTrue: false,
      // 诊断类型类型数据code
      codeDiagType: "DiseaseDiagnosisCategoryCode",
      // 类型值
      diagType: "",

      remoteShowKey: "dictionaryName",
      remoteValueKey: "icd10DictionaryId",
      // 中西医类型数据code
      codeCwFlag: "CWM",
      // 类型值
      // cwFlag: "1",
      // tcmSyndrome2: [], // 中医证型
      // 是否主诊断类型数据code
      codeDiagmain: "diagMain",
      // 类型值
      diagmain: "",

      // 初复诊类型数据code
      codeIsfirst: "FirstOrNo",
      // 类型值
      isfirst: "",

      // 状态值
      status: "",

      // 诊断名称类型值
      diagName: "",

      options1: [
        {
          value: "0",
          label: "登记"
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

      radio: "1",
      nowIsDm: false,
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
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    // 判断是门诊的还是住院的
    // pageType() {
    //   return this.clinicType === "3";
    // },
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
    // receivePatientData: {
    //   handler(n) {
    //     this.visitCode = n.visitCode;
    //     // 重置 诊断录入 数据
    //     this.diagnosticForm = {
    //       cwFlagName: "",
    //       diagCode: "",
    //       diagName: "",
    //       diagMain: "0",
    //       diagIcd: "",
    //       diagType: "1",
    //       cwFlag: "1",
    //       status: "0",
    //       isFirst: "1",
    //       startTime: new Date().format("yyyy-MM-dd hh:mm")
    //     };
    //     this.patient = n;
    //     if (n && n.patientId) {
    //       this.reLoadData();
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // },
    /* tcmSyndrome2: {
      deep: true,
      immediate: true,
      handler(val) {
        this.accountRechargeForm.tcmSyndrome2 = val;
      }
    }, */
    asd: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          let hosType2 = "";
          if (this.hosType === "1") {
            hosType2 = this.hosType;
          } else if (this.hosType === "3") {
            hosType2 = "2";
          } else {
            hosType2 = "";
          }
          if (val.cwFlag) {
            if (val.cwFlag === "1") {
              this.remoteShowKey = "dictionaryName";
              this.remoteValueKey = "icd10DictionaryId";
              this.remoteParams = {
                ...this.remoteParams,
                ...{
                  keyword: "",
                  type: hosType2,
                  cwFlag: "1"
                }
              };
            } else {
              this.remoteShowKey = "tcdName";
              this.remoteValueKey = "tcdCode";
              this.remoteParams = {
                ...this.remoteParams,
                ...{
                  // keyword: val.diagName,
                  keyword: "",
                  type: hosType2,
                  cwFlag: "2"
                }
              };
            }
          }
          // 以上：改变remoteParams，得到当前诊断名称下拉框列表值
          this.remoteParams1 = { pageSize: 10, diagName: val.diagName };
          // 改变remoteParams1，得到当前诊断名称下拉框列表值-
          if (!this.aOrE) {
            this.setDiagMain(val, val.diagMain);
            this.nowIsDm = val.diagMain === "1" ? true : false;
          } else {
            this.$refs["formElem"] && this.$refs["formElem"].resetFields();
          }
        });
      }
    },
    aOrE: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          this.editOrRegister = val === true ? "保存" : "保存";
          this.$refs["formElem"] && this.$refs["formElem"].resetFields();
          if (!val) {
            this.setDiagMain(this.asd, this.asd.diagMain);
          }
        });
      }
    },
    "accountRechargeForm.diagName": {
      immediate: true,
      handler(val) {
        if (val) {
          this.disabled2 = false;
        } else {
          this.disabled2 = true;
        }
      }
    },
    "accountRechargeForm.tcmSyndrome2": {
      immediate: true,
      handler(val) {
        console.log(val, "accountRechargeForm.tcmSyndrome2,<-改变了");
      }
    }
  },
  created() {
    this.nowIsDm = this.asd.diagMain === "1" ? true : false;
    if (this.hosType === "1") {
      this.accountRechargeForm.diagType = "2";
      this.disabledTrue = true;
    } else {
      this.accountRechargeForm.diagType = "";
      this.disabledTrue = false;
    }
  },
  methods: {
    ...mapActions({
      changeRef: "diagnosis/changeRef",
      changeReloadPatient: "base/changeReloadPatient"
    }),
    syndromeChange(item, curItem) {
      console.log(item, "实例的item", curItem, "实例的curItem");
      let value = "",
        code = "";
      this.accountRechargeForm.tcmSyndrome = value;
      this.accountRechargeForm.tcmSyndromeCode = code;
      if (curItem.length === 1) {
        if (curItem[0] && curItem[0] !== null) {
          value = curItem[0].tcdName;
          code = curItem[0].tcdCode;
        } else {
          code = item[0]; // test 0110
          value = item[0];
        }
      } else if (curItem.length > 1) {
        // if (curItem[0]) {
        for (let index = 0; index < curItem.length; index++) {
          if (curItem[index] !== null) {
            code =
              code === ""
                ? curItem[index].tcdCode
                : code + "," + curItem[index].tcdCode;
            value =
              value === ""
                ? curItem[index].tcdName
                : value + "," + curItem[index].tcdName;
          } else {
            code = code === "" ? item[index] : code + "," + item[index];
            value = value === "" ? item[index] : value + "," + item[index];
          }
        }
        // 也就是说 上下两个分支 都要考虑自定义编辑和表数据混合的情况
        // }
        /* else {
          for (let index = 0; index < item.length; index++) {
            code = code === "" ? item[index] : code + "," + item[index];
            value = value === "" ? item[index] : value + "," + item[index];
          }
        } */
      }
      this.accountRechargeForm.tcmSyndrome = value;
      this.accountRechargeForm.tcmSyndromeCode = code;
    },
    setDiagMain(data, val) {
      if (data.tcmSyndromeCode) {
        data.tcmSyndrome2 = data.tcmSyndromeCode.split(",");
      } else if (data.tcmSyndrome) {
        data.tcmSyndrome2 = data.tcmSyndrome.split(",");
      }
      this.accountRechargeForm = deepClone(data);
      this.accountRechargeForm.diagName = data.diagName;
      const flag = val === "1" ? true : false;
      this.$nextTick(() => {
        this.$set(this.accountRechargeForm, "diagMain", flag);
      });
    },
    loadSwitch(val) {
      this.$parent.cardLoading = val;
    },
    goBaoka(data) {
      this.loadSwitch(true);
      /* let paths = "";
      if (this.hosType == "1") {
        paths = "/cisOne/infectious";
      } else {
        this.hosType = "2";
        paths = "/ipnw/inpatientsInfectious";
      } */
      getCardByICD({
        diagCode: data.diagCode,
        cardSource: this.hosType,
        pid: this.patientId
      })
        .then(result => {
          this.loadSwitch(false);
          if (result.result !== 0) {
            this.$confirm("确认现在填写报卡吗？", "提示", {
              confirmButtonText: "立即填写",
              cancelButtonText: "稍后填写"
            })
              .then(_ => {
                // this.$emit("dialogVisibleBK");
                this.$parent.dialogVisibleBKShow({
                  diagName: data.diagName,
                  diagCode: data.diagCode,
                  cardSource: this.hosType,
                  pid: this.patientId
                });
                console.log('this.$emit("dialogVisibleBK");');
                // this.$router.push({
                //   path: paths,
                //   query: {
                //     diagName: data.diagName,
                //     diagCode: data.diagCode,
                //     cardSource: this.hosType,
                //     pid: this.patientId
                //   }
                // });
              })
              .catch(_ => {
                let params = {
                  // ...this.ruleForm,

                  diagName: data.diagName,
                  diagCode: data.diagCode,
                  cardSource: this.hosType,
                  pid: this.receivePatientData.patientId
                };
                savePatientInfo(params)
                  .then(res => {
                    this.$message.success("暂存成功，可稍后填写");
                  })
                  .catch(() => {
                    // this.$message({
                    //   type: "error",
                    //   message: "查询电子病历失败!"
                    // });
                  });
              });
          }
        })
        .catch(error => {
          this.loadSwitch(false);
          this.$message.error(error.msg || "报卡接口错误!");
        });
    },
    rest() {
      this.$refs["formElem"].resetFields();
    },
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
      if (this.aOrE) {
        this.$refs["formElem"].validate(valid => {
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
            data.patientSex = this.patientSex;
            data.patientBirthday = this.patientBirthday;
            data.patientName = this.patientName;
            //传入就诊类型是门诊or住院 clinicType：就诊类型1:门诊  2：急诊  3：住院
            data.clinicType = this.clinicType;
            // diagType：诊断类型  2:门诊诊断 3:登记诊断
            if (!data.diagType) {
              data.diagType = this.clinicType == "1" ? "2" : "3";
            }
            data.diagMain ? (data.diagMain = "1") : (data.diagMain = "0");
            this.submitLoad = true;
            if (data.cwFlag === "1") {
              /* delete data.tcmSyndrome;
              delete data.tcmSyndromeCode; */
              data.tcmSyndrome = "";
              data.tcmSyndromeCode = "";
            }

            // 1、单击一下患者即变为“诊中”了，建议以下诊断为标志事件，改变病人状态，初次登记改变接诊状态
            // receive({
            //   ...this.receivePatientData,
            //   ...{
            //     inpCode: this.receivePatientData.treatNo
            //   }
            // }).then(res => {
            //   // console.info("======res", res)
            //   if (res.code === 1) {
            //     // let data = res.data;
            //   } else {
            //     this.$message.error("接诊失败，请联系管理员");
            //   }
            // });

            delete data.tcmSyndrome2;
            data.id = "";
            // data.status = '1';
            addDiag(data)
              .then(res => {
                if (res.code === 1) {
                  this.$message.success("添加成功");
                  this.$parent.queryCurrentDiag(); // 重新请求表格数据
                  if (this.hosType === "1") {
                    this.goBaoka(data);
                  }
                  this.changeRef();
                  this.rest();
                  this.changeReloadPatient({}); // 刷新左侧病人列表，初次登记改变接诊状态才有必要刷新，
                  this.$emit("rechargeConfirm", false);
                } else {
                  this.$message.error(res.msg || "添加失败");
                }
                this.submitLoad = false;
              })
              .catch(err => {
                this.$message.error(err.msg || "添加失败");
                this.submitLoad = false;
              });
          }
        });
      } else {
        this.$refs["formElem"].validate(async valid => {
          if (valid) {
            let data = deepClone(this.accountRechargeForm);
            data.diagMain ? (data.diagMain = "1") : (data.diagMain = "0");
            this.submitLoad = true;
            if (data.cwFlag === "1") {
              /* delete data.tcmSyndrome;
              delete data.tcmSyndromeCode; */
              data.tcmSyndrome = "";
              data.tcmSyndromeCode = "";
            }
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
                this.$message.error(err.msg || "编辑失败");
                this.submitLoad = false;
              });
          }
        });
      }
    },
    cancel() {
      this.$emit("rechargeCancel");
      this.$refs["formElem"].resetFields();
    },
    diagNameChange(value, curItem) {
      this.accountRechargeForm.tcmSyndrome2 = [];
      if (curItem) {
        if (typeof curItem.dictionaryName !== "undefined") {
          this.accountRechargeForm.diagCode = curItem.icd10Encoding;
          this.accountRechargeForm.diagName = curItem.dictionaryName;
          this.remoteParams1 = { pageSize: 10, diagId: curItem.id };
        } else {
          this.accountRechargeForm.diagCode = curItem.tcdCode;
          this.accountRechargeForm.diagName = curItem.tcdName;
          this.remoteParams1 = { pageSize: 10, diagId: curItem.id };
        }
      }
    },
    // 中西医切换
    cwFlagChange(item, curItem) {
      let hosType2 = "";
      this.accountRechargeForm.diagName = "";
      this.accountRechargeForm.tcmSyndrome2 = [];
      if (this.hosType === "1") {
        hosType2 = this.hosType;
      } else if (this.hosType === "3") {
        hosType2 = "2";
      } else {
        hosType2 = ""; // hosType值为2时是急诊 目前无急诊，所以hostype为2时，值为空，后期如项目需要可从此位置更改传参
      }
      if (item === "1") {
        this.remoteShowKey = "dictionaryName";
        this.remoteValueKey = "icd10DictionaryId";
        this.remoteParams = {
          ...this.remoteParams,
          ...{
            keyword: this.accountRechargeForm.diagName,
            type: hosType2,
            cwFlag: "1"
          }
        };
      } else {
        this.remoteShowKey = "tcdName";
        this.remoteValueKey = "tcdCode";
        this.remoteParams = {
          ...this.remoteParams,
          ...{
            keyword: this.accountRechargeForm.diagName,
            type: hosType2,
            cwFlag: "2"
          }
        };
        // this.$refs.diagName[0].$refs.elem.options = []; // 1230报错 已注释，后面需要改动
      }
      this.accountRechargeForm.cwFlag = curItem.code;
      this.accountRechargeForm.cwFlagName = curItem.name;
      this.accountRechargeForm.diagName = "";
      this.accountRechargeForm.diagCode = "";
    }
  }
};
</script>

<style scoped lang="scss">
.contain {
  width: 100%;
  height: 100%;
  padding: 16px;
}

.dialog-header {
  width: 100%;
  // margin-bottom: 30px;
}

.detail {
  /*margin-top: 20px;*/
  margin-bottom: 8px;
}

.dialog-footer {
  // padding: 20px 0 20px 0;
  // border-top: 1px solid rgba(228, 228, 228, 1);

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
