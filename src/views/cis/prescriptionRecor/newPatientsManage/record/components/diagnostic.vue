<template>
  <el-card class="bottom" :style="{ bottom: shrinkValue + 'px' }">
    <div class="height100">
      <l-card-title
        class="clearfix card-header margin-top-8 margin-bottom-8"
        ref="header"
      >
        <span slot="left">诊断录入</span>
        <el-button
          type="text"
          class="fr button"
          :disabled="disabledWirteFlag"
          v-show="!isOpened"
          @click.native="shrinkHandler"
          slot="right"
          >{{ shrinkText }}</el-button
        >
      </l-card-title>
      <div class="height100" style="height: calc(100% - 42px)">
        <el-table
          ref="multipleTable"
          border
          width="100%"
          height="168"
          highlight-current-row
          :data="diagAdd"
          v-loadmore="{
            noMoreVar: tlm_noMore,
            loadingVar: tlm_isLoading,
            value: loadNextPage
          }"
          v-loading="tableLoading"
          @selection-change="handleSelectionChange"
          @row-click="editTableRow"
        >
          <el-table-column
            v-for="(item, index) in mainTableHead"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            header-align="left"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope0">
              <template v-if="item.prop == 'diagCode'">
                <span class="blue-color">{{ scope0.row[item.prop] }}</span>
              </template>
              <template v-else-if="item.prop == 'diagType'">
                <span
                  code="DiseaseDiagnosisCategoryCode"
                  v-codeTransform
                  :val="scope0.row[item.prop]"
                ></span>
              </template>
              <template v-else-if="item.prop == 'cwFlag'">
                <span
                  code="DIAGCWM"
                  v-codeTransform
                  :val="scope0.row[item.prop]"
                ></span>
              </template>
              <template v-else-if="item.prop == 'diagMain'">
                <span
                  code="YesOrNo"
                  v-codeTransform
                  :val="scope0.row[item.prop]"
                ></span>
              </template>
              <template v-else-if="item.prop == 'diagName'">
                <span class="blue-color">{{ scope0.row[item.prop] }}</span>
              </template>
              <template v-else>{{ scope0.row[item.prop] }}</template>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            text-align="center"
            width="160"
          >
            <template slot-scope="scope">
              <el-button
                @click.stop="setDiagMainValied(scope.row)"
                type="text"
                size="small"
                v-if="scope.row.diagMain !== '1'"
                >设置主诊断</el-button
              >
              <el-button @click.stop="del(scope.row)" type="text" size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-form
          :inline="true"
          :model="diagnosticForm"
          ref="diagnosticForm"
          class="diagnosticForm"
          style="height: calc(100% - 194px)"
        >
          <el-form-item
            v-for="(item, index) in diagnosticList"
            label
            :rules="item.rules"
            :prop="item.prop"
            :key="index"
            :class="item.prop"
          >
            <template v-if="item.type === 'select'">
              <LFormtTitle
                v-if="item.label === '西医/中医'"
                :required="true"
                :label="item.label"
                style="width: 100%"
              >
                <l-value-domain
                  style="line-height: 34px; width: 100%"
                  :code="codeCwFlag"
                  :value.sync="diagnosticForm[item.prop]"
                  placeholder="请选择"
                  @change="cwFlagChange"
                >
                </l-value-domain>
              </LFormtTitle>
              <LFormtTitle
                v-else-if="item.label === '诊断名称'"
                :required="true"
                :label="item.label"
                style="width: 100%"
              >
                <LocalDiagnosisSelector
                  v-if="
                    ChineseMedicineDiagnosis !== null &&
                      WesternMedicineDiagnosis !== null
                  "
                  ref="LocalDiagnosisSelectorClear"
                  :shrinkText="shrinkText"
                  :WesternMedicineDiagnosis="WesternMedicineDiagnosis"
                  :ChineseMedicineDiagnosis="ChineseMedicineDiagnosis"
                  :diagName="diagnosticForm"
                  @diagSelectorChange="diagSelectorChange"
                ></LocalDiagnosisSelector>
                <SelectAllowCreate
                  v-else
                  class="input-width-default width100"
                  ref="diagName"
                  style="line-height: 34px"
                  placeholder="请输入诊断名称"
                  remoteUrl="/patTcmDiag/getDiagNameCode"
                  :isUseInputValue="isUseInputValue"
                  :remoteParams="remoteParams"
                  :value.sync="diagnosticForm[item.prop]"
                  :remoteShowKey="remoteShowKey"
                  :remoteValueKey="remoteValueKey"
                  @clear="clearHandler"
                  @change="diagNameChange"
                ></SelectAllowCreate>
              </LFormtTitle>
            </template>
            <template v-else-if="item.prop === 'startTime'">
              <LFormtTitle
                :label="item.label"
                style="width: 100%"
                :required="true"
              >
                <el-date-picker
                  style="width: 203px"
                  v-model="diagnosticForm[item.prop]"
                  :picker-options="expireTimeOption"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="时间"
                  @change="startTimeChange"
                ></el-date-picker>
              </LFormtTitle>
            </template>
            <template v-else-if="item.prop === 'isFirst'">
              <LFormtTitle
                :label="item.label"
                style="width: 100%"
                :required="true"
              >
                <l-value-domain
                  code="FirstOrNo"
                  :value.sync="diagnosticForm[item.prop]"
                  class="select-container"
                  placeholder="请选择"
                />
              </LFormtTitle>
            </template>
            <template v-if="item.type === 'input'">
              <LFormtTitle
                v-if="item.prop === 'diagCode'"
                :required="true"
                :label="item.label"
                style="width: 100%"
                :disabled="true"
              >
                <el-input
                  :disabled="true"
                  v-model="diagnosticForm[item.prop]"
                ></el-input>
              </LFormtTitle>
              <LFormtTitle
                v-else-if="item.prop === 'diagIcd'"
                :required="false"
                :label="item.label"
                style="width: 100%"
              >
                <el-input v-model="diagnosticForm[item.prop]"></el-input>
              </LFormtTitle>
              <LFormtTitle v-else :label="item.label" style="width: 100%">
                <el-input v-model="diagnosticForm[item.prop]"></el-input>
              </LFormtTitle>
            </template>
            <template>
              <LFormtTitle
                v-if="item.prop === 'status'"
                :required="true"
                :label="item.label"
              >
                <l-value-domain
                  style="width: 219px"
                  code="DiagStatus"
                  :value.sync="diagnosticForm[item.prop]"
                  class="select-container"
                  placeholder="请选择状态"
                />
              </LFormtTitle>
            </template>
            <template v-if="item.type === 'radio'">
              <el-checkbox
                v-model="diagnosticForm[item.prop]"
                true-label="1"
                false-label="0"
                >主诊断</el-checkbox
              >
            </template>
            <template v-if="item.type === 'select'">
              <LFormtTitle
                v-if="
                  diagnosticForm.cwFlag === '2' && item.prop === 'tcmSyndrome2'
                "
                :required="false"
                :label="item.label"
                style="width: 100%"
              >
                <LSelectAllowCreate
                  placeholder="请输入中医证型"
                  remoteUrl="/patTcmSyndrome/pageList"
                  :disabled="disabled2"
                  :remoteParams="remoteParams1"
                  :diagnosticForm="diagnosticForm"
                  @change="syndromeChange"
                ></LSelectAllowCreate>
                <!-- <select-allow-create
                  :remote="false"
                  :allow-create='true'
                  style="line-height: 34px; width: 100%"
                  remoteUrl="/patTcmSyndrome/pageList"
                  :remoteParams="remoteParams1"
                  :value.sync="diagnosticForm[item.prop]"
                  placeholder="请输入中医证型"
                  :disabled="disabled2"
                  remoteShowKey="tcdName"
                  remoteValueKey="tcdCode"
                  multiple
                  @change="syndromeChange"
                ></select-allow-create> -->
              </LFormtTitle>
            </template>
          </el-form-item>
        </el-form>
        <div class="button float-right">
          <el-button
            type="primary"
            @click="valiedDiagMain"
            v-hotKey="{ func: 'func_save' }"
            :loading="cardLoading"
            >保 存</el-button
          >
          <!-- <el-button
            type="primary"
            @click="addStyleFun()"
            v-hotKey="{ func: 'func_save' }"
            >新建</el-button
          > -->
          <el-button
            type="text"
            class=""
            v-show="isOpened"
            @click.native="shrinkHandler"
            >{{ shrinkText }}</el-button
          >
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { getInquiryRecord } from "@/api/cis/visit/visit";

import {
  getDiaByPatientCode,
  addDiag,
  getCurrentDiagList,
  updateDiag,
  deleteDiag,
  setDiagMian,
  getCardByICDNew
} from "@/api/common/diagnosis";
import SelectAllowCreate from "@/views/public/diagnosis/components/selectAllowAndInput.vue";

import {
  saveDiagRelation,
  deleteDiagRelation
} from "@/api/emrRecord/common/diagnosis";
import LocalDiagnosisSelector from "@/components/LocalDiagnosisSelector";
import localForage from "localforage";

const closeValue = "-356";
const shrinkValue = "0";
export default {
  name: "diagnosticEmr",
  components: {
    SelectAllowCreate,
    LocalDiagnosisSelector
  },
  props: ["diagnosticData", "hosType", "roomId", "saveMode"],
  data() {
    return {
      ChineseMedicineDiagnosis: [],
      WesternMedicineDiagnosis: [],
      disabledWirteFlag: false,
      isUseInputValue: true,
      editTableRowList: "",
      // 是否是编辑按钮的标志
      sigenStyle: true,
      // 中西医类型数据code
      codeCwFlag: "DIAGCWM",
      disabled2: true,
      diagAdd: [],
      // 表格loading
      tlm_isLoading: false,
      tableLoading: false,
      loading: false, //诊断名称的loading
      cardLoading: false, // 整个卡片的 loading
      //分页信息
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      diagNameUrl: "/patTcmDiag/getDiagNameCode",
      remoteShowKey: "dictionaryName",
      remoteValueKey: "icd10Encoding",
      remoteParams: {
        keyword: "",
        type: this.hosType == "1" ? 1 : this.hosType == "3" ? 2 : "",
        cwFlag: "1"
      },
      remoteParams1: {
        pageSize: 50
      },
      isOpened: false,
      shrinkValue: closeValue,
      shrinkText: "拉起",
      visitCode: "",
      activeName: "first",
      diagnosticForm: {
        cwFlagName: "西医",
        tcmSyndrome2: [], // 中医证型
        tcmSyndrome: [], // 中医证型
        diagCode: "",
        diagName: "",
        diagMain: "0",
        diagIcd: "",
        diagType: "1",
        cwFlag: "1",
        isFirst: "1",
        startTime: this.dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
        status: "0" //状态
      },
      diagnosticList: [
        {
          label: "西医/中医",
          rules: [
            {
              required: true,
              message: "请输入诊断类型",
              trigger: "blur"
            }
          ],
          prop: "cwFlag",
          type: "select"
        },
        {
          label: "诊断名称",
          rules: [
            {
              required: true,
              message: "请输入诊断名称",
              trigger: "blur"
            }
          ],
          prop: "diagName",
          type: "select"
        },
        {
          label: "诊断编码",
          //rules: [{required: true, message: '请输入诊断编码', trigger: 'blur'}, { type: 'number', message: '必须为数字值'}],
          prop: "diagCode",
          type: "input"
        },
        {
          label: "中医证型",
          rules: [
            {
              required: false,
              message: "请选择中医证型",
              trigger: "blur"
            }
          ],
          prop: "tcmSyndrome2",
          type: "select"
        },
        {
          label: "发病日期",
          rules: [
            { required: true, message: "请选择发病日期", trigger: "blur" }
          ],
          prop: "startTime",
          type: "date"
        },
        {
          label: "初复诊",
          // rules : [{ required: true, message: "请选择发病日期", trigger: "blur" }],
          prop: "isFirst",
          rules: [
            {
              required: true,
              message: "请选择初复诊",
              trigger: "change"
            }
          ],
          type: "lValueDomain"
        },
        {
          label: "状态",
          rules: [
            {
              required: true,
              message: "请选择状态",
              trigger: "blur"
            }
          ],
          prop: "status",
          type: "select"
        },
        {
          label: "",
          prop: "diagMain",
          type: "radio"
        },
        {
          label: "诊断描述",
          rules: [
            {
              required: false,
              message: "请输入诊断描述",
              trigger: "blur"
            }
          ],
          prop: "diagIcd",
          type: "input"
        }
      ],
      dynamicTags: [],
      options5: [
        //诊断名称
        {
          value: "98856a87",
          label: "咽喉炎"
        }
      ],
      multipleSelection: [],
      patient: {},
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() > Date.now();
        }
      },
      oldDiagCode: null,
      time: 0
    };
  },
  mounted() {
    console.log(this.diagnosticForm, "diagnosticForm");
    this.getLocalDiagnosisData();
  },
  methods: {
    ...mapActions({
      setLeaveAppLoadKey: "cis/setLeaveAppLoadKey",
      // changeRecPatientData: "base/changeRecPatientData",
      setReloadKey: "base/changeSearchAgainKey",
      setDiaName: "cis/setDiaName",
      setDiagnosisList: "cdss/setDiagnosisList"
    }),
    async getLocalDiagnosisData() {
      try {
        this.ChineseMedicineDiagnosis = await localForage.getItem(
          "ChineseMedicineDiagnosis"
        );
        this.WesternMedicineDiagnosis = await localForage.getItem(
          "WesternMedicineDiagnosis"
        );
      } catch (err) {
        console.log(err);
      }
    },
    diagSelectorChange(val) {
      console.log(`diagSelectorChange---`, JSON.parse(JSON.stringify(val)));
      this.diagnosticForm.diagCode = val.diagCode;
      this.diagnosticForm.diagName = val.diagName;
    },
    startTimeChange() {
      let startAt = (new Date(this.diagnosticForm.startTime) * 1000) / 1000;
      if (startAt > Date.now()) {
        this.diagnosticForm.startTime = this.dayjs(new Date()).format(
          "YYYY-MM-DD HH:mm"
        );
      }
    },
    clearHandler() {},
    addStyleFun() {
      this.resetAndReload();
      this.sigenStyle = true;
      this.$refs["diagnosticForm"].resetFields();
      this.diagnosticForm = {
        ...this.diagnosticForm,
        tcmSyndrome2: [],
        tcmSyndrome: [],
        tcmSyndromeCode: "",
        startTime: this.dayjs(new Date()).format("YYYY-MM-DD HH:mm")
      };
    },
    // 重新请求表格数据
    reLoadData() {
      this.pageParams.pageNo = 1;
      this.queryCurrentDiag();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //this.isEdit = val.length == 1 ? false : true;
    },
    editTableRow(row, column) {
      console.log(`row----`, JSON.parse(JSON.stringify(row)));
      this.editTableRowList = row;
      this.sigenStyle = false;
      this.oldDiagCode = row.diagCode;
      this.diagnosticForm = {
        cwFlagName: "",
        tcmSyndrome2: [], // 中医证型
        tcmSyndrome: [], // 中医证型
        diagCode: row.diagCode,
        diagName: row.diagName,
        diagMain: row.diagMain,
        diagIcd: row.diagIcd,
        diagType: row.diagType,
        cwFlag: row.cwFlag,
        isFirst: row.isFirst,
        startTime: row.startTime,
        status: row.status //状态
      };

      this.diagnosticForm.diagCode = row.diagCode;
      this.diagnosticForm.diagName = row.diagName;
      this.diagnosticForm.cwFlagName = row.cwFlag === "1" ? "西医" : "中医";
      console.log(`row.tcmSyndromeCode`, row.tcmSyndromeCode);

      if (row.tcmSyndromeCode === "") {
        this.diagnosticForm.tcmSyndrome2 = [];
        this.diagnosticForm.tcmSyndrome3 = [];
        this.diagnosticForm.tcmSyndrome = row.tcmSyndrome;
        this.diagnosticForm.tcmSyndromeCode = row.tcmSyndromeCode;
      } else {
        this.diagnosticForm.tcmSyndrome2 = row.tcmSyndromeCode.split(",")
          ? row.tcmSyndromeCode.split(",")
          : [];
        this.diagnosticForm.tcmSyndrome3 = row.tcmSyndromeCode.split(",")
          ? row.tcmSyndromeCode.split(",")
          : [];
        this.diagnosticForm.tcmSyndrome = row.tcmSyndrome;
        this.diagnosticForm.tcmSyndromeCode = row.tcmSyndromeCode;
      }
      this.setDiaName({
        ...row
      });
      this.$refs.multipleTable.setCurrentRow(row);
    },
    // 控制是否还可以继续加载
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageSize) <=
        this.pageParams.pageNo
      );
    },
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.queryCurrentDiag();
    },
    //获取当前诊断
    async queryCurrentDiag() {
      this.tableLoading = true;
      let res = await getCurrentDiagList({
        ...this.pageParams,
        patientId: this.receivePatientData.patientId,
        inpCode: this.receivePatientData.inpCode,
        visitCode: this.receivePatientData.visitCode
      });
      this.tableLoading = false;

      if (res.pageParams.pageNo === 1) {
        this.diagAdd = res.data;
      } else {
        this.diagAdd = this.diagAdd.concat(res.data);
      }

      this.sigenStyle = true; // 设置为新建状态
      this.setDiaName({
        ...this.diagAdd[0]
      });
      // cdss
      this.setDiagnosisList(this.diagAdd);
      this.pageParams = { ...res.pageParams };

      //顶部患者卡片更新主诊断信息
      /* this.diagAdd.forEach(item => {
        if (item.diagMain === "1") {
          let patientData = { ...this.receivePatientData };
          patientData.diagName = item.diagName;
          //更新初诊/复诊
          patientData.rediagStatus = item.isFirst;
          this.changeRecPatientData(patientData);
        }
      }); */

      this.loadNextPage = false;
    },
    setDiagAddList(list) {
      this.diagAdd = list;
    },
    diagNameChange(n, ms) {
      let m = {
        ...ms
      };
      console.log(m, "diagnosticForm");
      this.diagnosticForm.tcmSyndrome = [];
      this.diagnosticForm.tcmSyndrome2 = [];
      this.diagnosticForm.tcmSyndromeCode = [];

      if (m.dictionaryName) {
        this.diagnosticForm.diagCode = m.icd10Encoding;
        this.diagnosticForm.diagName = m.dictionaryName;
        this.remoteParams1 = {
          ...this.remoteParams1
          // ...{
          //   diagId: m.id,
          // },
        };
      } else {
        this.diagnosticForm.diagCode = m.tcdCode;
        this.diagnosticForm.diagName = m.tcdName;
        this.remoteParams1 = {
          ...this.remoteParams1
          // ...{
          //   diagId: m.id,
          // },
        };
      }
    },
    syndromeChange(item) {
      console.log(`item---123`, item);
      this.diagnosticForm.tcmSyndrome = "";
      this.diagnosticForm.tcmSyndromeCode = "";
      item.forEach((el, i) => {
        // console.log(`el`, el);
        // console.log(`i`, i);
        if (i === item.length - 1) {
          this.diagnosticForm.tcmSyndrome += el.tcdName;
          this.diagnosticForm.tcmSyndromeCode += el.tcdCode;
        } else {
          this.diagnosticForm.tcmSyndrome += `${el.tcdName},`;
          this.diagnosticForm.tcmSyndromeCode += `${el.tcdCode},`;
        }
      });
      console.log(`this.diagnosticForm----`, this.diagnosticForm);
      // this.diagnosticForm.tcmSyndrome = "";
      // this.diagnosticForm.tcmSyndromeCode = "";
      // if (!n.length) {
      //   return;
      // }
      // let code = "";
      // let name = "";
      // let m = [];
      // for (let i in ms) {
      //   if (ms[i]) {
      //     m.push(ms[i]);
      //   }
      // }
      // console.log(m);
      // if (m.length === 1) {
      //   code = m[0].tcdCode;
      //   name = m[0].tcdName;
      // } else if (m.length > 1) {
      //   for (let index in m) {
      //     if (m[index] !== null) {
      //       code =
      //         code === "" ? m[index].tcdCode : code + "," + m[index].tcdCode;
      //       name =
      //         name === "" ? m[index].tcdName : name + "," + m[index].tcdName;
      //     } else {
      //       code = code === "" ? n[index] : code + "," + n[index];
      //       name = name === "" ? n[index] : name + "," + n[index];
      //     }
      //   }
      //   console.log(code, name, "code,name");
      // }
      // this.diagnosticForm.tcmSyndromeCode = code;
      // this.diagnosticForm.tcmSyndrome = name;
      // console.log(this.diagnosticForm, "this.diagnosticForm");
    },
    // 中西医切换的时候
    cwFlagChange(n, m) {
      console.log(n, "n", m, "m");
      console.log(this.remoteParams, "提交的");
      this.diagnosticForm.tcmSyndrome = [];
      this.diagnosticForm.tcmSyndrome2 = [];
      this.diagnosticForm.tcmSyndromeCode = [];
      // console.log(this.$refs.diagName[0].$refs.elem.options);
      let hosType2 = "";
      if (this.hosType == "1") {
        hosType2 = this.hosType;
      } else if (this.hosType == "3") {
        hosType2 = "2";
      } else {
        hosType2 = ""; // hosType值为2时是急诊 目前无急诊，所以hostype为2时，值为空，后期如项目需要可从此位置更改传参
      }
      if (this.diagnosticForm.diagName) {
        this.diagnosticForm.diagName = "";
      }
      if (n === "1") {
        this.remoteShowKey = "dictionaryName";
        this.remoteValueKey = "icd10Encoding";
        this.remoteParams = {
          ...this.remoteParams,
          ...{
            keyword: this.diagnosticForm.diagName,
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
            keyword: this.diagnosticForm.diagName,
            type: hosType2,
            cwFlag: "2"
          }
        };
      }
      this.diagnosticForm.cwFlag = m.code;
      this.diagnosticForm.cwFlagName = m.name;
      this.diagnosticForm.diagName = "";
      this.diagnosticForm.diagCode = "";
    },
    diagnosticHandler(flag) {
      this.isOpened = flag;
    },
    shrinkHandler() {
      this.isOpened = !this.isOpened;
      if (this.isOpened) {
        this.$emit("openDiagnosticComponent");
      }
    },
    handleClose() {
      // 成功后的回调
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    // 验证存的是主诊断是否有诊断编码
    valiedDiagMain() {
      let hasDiagMain = this.diagAdd.some(item => {
        return item.diagMain === "1";
      });
      if(!(!this.diagnosticForm.diagCode && !hasDiagMain)) {
        this.submitDiagnosticForm();
        return;
      }
      let htmls = '<p>主诊断为自定义诊断。</p><p>根据医保报销要求，主诊断为"自定义诊断"可能会影响医保患者的报销比例。</p>'
      this.$confirm(htmls, '请注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.submitDiagnosticForm();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消保存！'
          });          
        });
    },
    submitDiagnosticForm() {
      // if(this.diagnosticForm.cwFlag==2&&!this.diagnosticForm.tcmSyndrome2){
      //   this.$message({
      //     message: "请选择中医证型!"
      //   });
      //   return;
      // }
      this.$refs.diagnosticForm.validate(async valid => {
        if (valid) {
          this.addDiagMes();
        }
      });
    },
    getInquiryRecord() {
      getInquiryRecord(this.visitCode)
        .then(res => {
          this.ruleForm.id = res.data.id;
          this.ruleForm.chiefComplaint = res.data.chiefComplaint;
          this.ruleForm.presentIllness = res.data.presentIllness;
          this.ruleForm.pastHistory = res.data.pastHistory;
          this.ruleForm.physicalExam = res.data.physicalExam;
          this.ruleForm.otherExam = res.data.otherExam;
          this.ruleForm.allergicHistory = res.data.allergicHistory;
          this.ruleForm.dataVersion =
            res.data.dataVersion == null ? 0 : res.data.dataVersion;
        })
        .catch(() => {});
    },
    getPatDialog() {
      let params = {
        visitCode: this.visitCode
      };
      getDiaByPatientCode(params)
        .then(res => {
          this.dynamicTags = res.data;
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "查询电子病历失败!"
          });
        });
    },
    // 校验主诊断是否为自定义
    setDiagMainValied(row) {
      if (row.diagMain === "1") {
        this.$message.warning("此诊断已是主诊断!");
        return;
      }
      // 兼容文书模板诊断显示
      if (this.saveMode === "editor") {
        this.$emit("setDiagMianToEditor", row);
        return;
      }

      if(row.diagCode) {
        this.setMain(row);
        return;
      }
      let htmls = '<p>主诊断为自定义诊断。</p><p>根据医保报销要求，主诊断为"自定义诊断"可能会影响医保患者的报销比例。</p>'
      this.$confirm(htmls, '请注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.setMain(row);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消设置！'
          });          
        });
    },
    setMain(row) {
      this.tableLoading = true;
      setDiagMian(row)
        .then(res => {
          if (res.code === 1) {
            this.reLoadData();
            this.$emit("save");
            this.$message.success("设置成功!");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    async deleteDiagRelationHandler(params) {
      try {
        const { code, data, msg } = await deleteDiagRelation(params);
        if (code !== 1) {
          this.$message.error(msg || "删除诊断关系操作失败");
        }
      } catch (error) {
        this.$message.error(JSON.parse(JSON.stringify(error)));
      }
    },
    del(row) {
      this.$confirm("是否删除所选诊断？", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 兼容文书模板诊断显示
          if (this.saveMode === "editor") {
            this.$emit("delDataToEditor", row);
            this.diagnosticForm.tcmSyndrome2 = [];
            this.addStyleFun();
            return;
          }

          deleteDiag([row])
            .then(async res => {
              if (res.code === 1) {
                this.$message.success("删除成功!");

                // 删除诊断维护关系
                const paramsObj = {
                  enId: this.visitCode,
                  enTpCd: "01",
                  isHome: "0",
                  diagRelationList: [
                    { diagCode: row.diagCode, diagName: row.diagName }
                  ]
                };
                await this.deleteDiagRelationHandler(paramsObj);

                //置为新增状态
                // this.sigenStyle = true;
                // this.$refs["diagnosticForm"].resetFields();
                this.diagnosticForm.tcmSyndrome2 = [];
                // this.$refs.multipleTable.clearSelection();
                //判断diagMain是不是主诊断
                // if(row.diagMain == '1'){
                //
                // }
                this.addStyleFun();
                this.$emit("save");

                this.reLoadData();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async goBaoka(data) {
      //zhengyawen
      try {
        let res = await getCardByICDNew({
          diagName: data.diagName,
          keyword: data.diagCode,
          cwFlag: data.cwFlag,
          type: this.hosType
        });
        console.log(`报卡----`, res);
        if (res.code === 1) {
          if (res.data.length !== 1) {
            return;
          }
          if (
            res.data[0].diseaseReportCard === "" ||
            res.data[0].diseaseReportCard === undefined
          ) {
            return;
          }
          if (res.data[0].diseaseReportCard == 0) {
            //传染病报卡
            /* this.$parent.dialogVisibleBKShow({
              diagName: data.diagName,
              diagCode: data.diagCode,
              cardSource: this.hosType,
              pid: this.receivePatientData.patientId,
              onsetDate: data.startTime
            }); */
            this.$parent.assignmentFun(
              {
                cardSource: this.hosType,
                patientName: this.receivePatientData.patientName,
                pid: this.receivePatientData.patientId,
                inpNo: this.receivePatientData.visitCode,
                diagName: data.diagName,
                diagCode: data.diagCode,
                onsetDate: data.startTime
              },
              true
            );
          } else if (res.data[0].diseaseReportCard == 1) {
            //食源性报卡
            this.$parent.dialogVisibleBKShowStyle({
              diagName: data.diagName,
              diagCode: data.diagCode,
              cardSource: this.hosType,
              pid: this.receivePatientData.patientId,
              onsetDate: data.startTime
            });
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.cardLoading = false;
      }
    },
    async saveDiagRelationHandler(params) {
      try {
        const { code, msg } = await saveDiagRelation(params);
        if (code !== 1) {
          this.$message.error(msg || "保存诊断关系操作失败！");
        }
      } catch (error) {
        this.$message.error(JSON.parse(JSON.stringify(error)));
      }
    },
    // eslint-disable-next-line complexity
    async addDiagMes() {
      if (this.diagnosticForm.hasOwnProperty("undefined")) {
        delete this.diagnosticForm.undefined;
      }

      let patientSex = this.receivePatientData.patientGender;
      if (
        patientSex !== "2" &&
        (this.diagnosticForm.diagName.indexOf("子宫") !== -1 ||
          this.diagnosticForm.diagName.indexOf("阴道") !== -1)
      ) {
        this.$message.warning("男性患者不能开女性诊断!");
        return false;
      }
      let ajaxData = {
        patientId: this.receivePatientData.patientId,
        diagDoctorId: this.role.userId,
        diagDoctorName: this.name,
        deptId: this.role.deptId,
        deptName: this.role.deptName,
        patientSex: this.receivePatientData.patientGender,
        patientBirthday: this.receivePatientData.birthDate,
        patientName: this.receivePatientData.patientName,
        inpCode: this.receivePatientData.inpCode,
        visitCode: this.visitCode,
        clinicType: this.receivePatientData.visitCode ? "1" : "2",
        diagType: "2"
      };
      console.info(ajaxData, this.receivePatientData);

      // 1、单击一下患者即变为“诊中”了，建议以下诊断为标志事件，改变病人状态

      console.log(this.receivePatientData, "=================");
      // 没有诊断的时候 调用接口 记录开始医生开始接诊
      /* if (this.diagAdd.length === 0 && this.saveMode !== "editor") {
        receive({
          ...this.receivePatientData,
          triageStatus: this.diagnosticForm.isFirst
        }).then(res => {
          if (res.code !== 1) {
            this.$message.error("接诊失败，请联系管理员");
          }
        });
      } */

      // this.diagnosticForm.isFirst = "1"; // 默认初复诊为 初诊：1
      delete this.diagnosticForm.tcmSyndrome2;
      //提交入参
      let params = {};
      this.cardLoading = true;
      if (this.sigenStyle) {
        params = {
          ...this.diagnosticForm,
          ...ajaxData
        };
        //(Array.isArray(params.tcmSyndrome) && !params.tcmSyndrome).length  判断中医证型是否为空数组
        if (
          params.cwFlag === "1" ||
          (Array.isArray(params.tcmSyndrome) && !params.tcmSyndrome.length)
        ) {
          params.tcmSyndrome = "";
          params.tcmSyndromeCode = "";
        }

        // 兼容文书模板嵌入诊断
        if (this.saveMode === "editor") {
          this.$emit("insertDataToEditor", {
            ...params,
            randomId: (Math.random() * 100000000).toFixed(0)
          });
          return;
        }
        let receiveData = {};
        if (this.hosType == "1") {
          receiveData = {
            appointmentId: this.receivePatientData.appointmentId,
            freeCode: this.receivePatientData.freeCode,
            haveMoney: this.receivePatientData.haveMoney
          };
        }
        console.log(`params`, JSON.parse(JSON.stringify(params)));

        addDiag({
          ...params,
          ...receiveData
        })
          .then(async res => {
            console.log(`添加诊断`, res);
            if (res.code === 1) {
              // this.getInquiryRecord();
              this.getPatDialog();
              this.$emit("save");
              await this.goBaoka({
                ...params,
                startTime: this.diagnosticForm.startTime
              });

              // 添加对诊断关系的维护
              const paramsObj = {
                enId: this.visitCode,
                enTpCd: "01",
                isHome: "0",
                diagRelationList: [
                  {
                    diagCode: params.diagCode || "",
                    isAuto: "0",
                    diagName: params.diagName
                  }
                ]
              };
              await this.saveDiagRelationHandler(paramsObj);

              /* if (
                this.patient.hasOwnProperty("diagName") &&
                this.patient.diagName !== ""
              ) {
                this.patient.diagName += "," + this.diagnosticForm.diagName;
              } else {
                this.patient.diagName = this.diagnosticForm.diagName;
              } */
              // this.changeRecPatientData(this.patient).then(() => {
              //   // 成功之后刷新左侧待诊患者列表
              //   this.$root.eventHub.$emit("refresh-wait-patientList");
              //   this.setReloadKey(+new Date()); // 更新 vuex 里的 ReloadKey  使最下测 模块刷新
              //   this.reLoadData();
              // });
              this.$root.eventHub.$emit("refresh-wait-patientList");
              // this.setReloadKey(+new Date()); // 更新 vuex 里的 ReloadKey  使最下测 模块刷新
              this.reLoadData();
              //置为新增状态
              this.sigenStyle = true;
              this.$refs["diagnosticForm"].resetFields();
              this.remoteParams.keyword = "";
              this.cwFlagChange("1", { code: "1", name: "西医" });
              this.$message.success(res.msg || "新建成功");

              this.$nextTick(() => {
                console.log(
                  `this.$refs.LocalDiagnosisSelectorClear`,
                  this.$refs.LocalDiagnosisSelectorClear
                );
                this.$refs.LocalDiagnosisSelectorClear &&
                  this.$refs.LocalDiagnosisSelectorClear[0].clear();
              });
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: "保存诊断失败!"
            });
          })
          .finally(() => {
            this.cardLoading = false;
          });
      } else {
        ajaxData.dataVersion = this.editTableRowList.dataVersion;
        params = {
          ...this.editTableRowList,
          ...this.diagnosticForm,
          ...ajaxData
        };
        if (
          params.cwFlag === "1" ||
          (Array.isArray(params.tcmSyndrome) && !params.tcmSyndrome.length)
        ) {
          params.tcmSyndrome = "";
          params.tcmSyndromeCode = "";
        }

        // 兼容文书模板嵌入诊断
        if (this.saveMode === "editor") {
          this.$emit("updateDataToEditor", params);
          return;
        }
        updateDiag(params)
          .then(async res => {
            if (res.code === 1) {
              console.log(`res.msg`, res.msg);
              this.$message.success(res.msg || "编辑成功");
              // this.changeRef();

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
                    diagCode: params.diagCode,
                    diagName: params.diagName,
                    isAuto: "0"
                  }
                ]
              };
              await this.saveDiagRelationHandler(paramsObj1);
              //置为新增状态

              this.sigenStyle = true;
              this.$refs["diagnosticForm"].resetFields();
              this.remoteParams.keyword = "";
              this.cwFlagChange("1", { code: "1", name: "西医" });
              this.reLoadData();
              this.$emit("save");
              this.diagnosticForm.tcmSyndrome2 = [];
              // this.sigenStyle = true;
              // this.$refs["diagnosticForm"].resetFields();

              this.$nextTick(() => {
                console.log(
                  `this.$refs.LocalDiagnosisSelectorClear`,
                  this.$refs.LocalDiagnosisSelectorClear
                );
                this.$refs.LocalDiagnosisSelectorClear &&
                  this.$refs.LocalDiagnosisSelectorClear[0].clear();
              });
            } else {
              this.$message.error(res.msg || "编辑失败");
            }
          })
          .catch(err => {
            // this.$message.error(err.msg || "编辑失败");
            console.log(err, "err");
          })
          .finally(() => {
            this.cardLoading = false;
          });
      }
    },
    resetAndReload() {
      console.log(`resetAndReload`, 1111111111);
      // 重置 诊断录入 数据
      this.diagnosticForm = {
        cwFlagName: "西医",
        diagCode: "",
        diagName: "",
        diagMain: "0",
        diagIcd: "",
        diagType: "1",
        cwFlag: "1",
        status: "1",
        isFirst: "1",
        startTime: this.dayjs(new Date()).format("YYYY-MM-DD HH:mm")
      };

      if (this.receivePatientData && this.receivePatientData.patientId) {
        this.reLoadData();
      }

      this.$nextTick(() => {
        this.$refs.multipleTable.setCurrentRow(null);
      });
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    // 获取登录用户信息
    ...mapGetters("user", ["name", "role"]),
    ...mapGetters("navBarMsg", ["$_top_message", "$_top_list"]),
    // 根据就诊类型显示不同的表头
    mainTableHead() {
      const tableHead1 = [
        {
          prop: "cwFlag",
          label: "中/西医",
          align: "left",
          fixed: false,
          width: 80
        },
        {
          prop: "diagCode",
          label: "诊断编码",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagName",
          label: "诊断名称",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "tcmSyndrome",
          label: "中医证型",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagIcd",
          label: "诊断描述",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagMain",
          label: "主诊断",
          align: "left",
          fixed: false,
          width: 76
        },
        {
          prop: "startTime",
          label: "发病日期",
          align: "left",
          fixed: false,
          width: 200
        },
        {
          prop: "diagDoctorName",
          label: "诊断医生",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagTime",
          label: "诊断日期",
          align: "left",
          fixed: false,
          width: 200
        }
      ];
      const tableHead2 = [
        {
          prop: "diagType",
          label: "诊断类型",
          align: "left",
          fixed: "left",
          width: 80
        },
        {
          prop: "cwFlag",
          label: "中/西医",
          align: "left",
          fixed: false,
          width: 80
        },
        {
          prop: "diagCode",
          label: "诊断编码",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagName",
          label: "诊断名称",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "tcmSyndrome",
          label: "中医证型",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagIcd",
          label: "诊断描述",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagMain",
          label: "主诊断",
          align: "left",
          fixed: false,
          width: 76
        },
        {
          prop: "diagResults",
          label: "治疗结果",
          align: "left",
          fixed: false,
          width: 150
        },
        {
          prop: "startTime",
          label: "发病日期",
          align: "left",
          fixed: false,
          width: 200
        },
        {
          prop: "diagDoctorName",
          label: "诊断医生",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagTime",
          label: "诊断日期",
          align: "left",
          fixed: false,
          width: 200
        }
      ];
      const tableHead3 = [
        {
          prop: "cwFlag",
          label: "中/西医",
          align: "left",
          fixed: false,
          width: 80
        },
        {
          prop: "diagCode",
          label: "诊断编码",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagName",
          label: "诊断名称",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "tcmSyndrome",
          label: "中医证型",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagIcd",
          label: "诊断描述",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagMain",
          label: "主诊断",
          align: "left",
          fixed: false,
          width: 76
        }
      ];
      // 兼容文书模板展示
      return this.saveMode === "editor" ? tableHead3 : tableHead1;
    }
  },
  watch: {
    "diagnosticForm.diagName": {
      immediate: true,
      handler(val) {
        console.log(`val`, val);
        if (val) {
          console.log("有值");
          this.disabled2 = false;
        } else {
          console.log("没有值");
          this.disabled2 = true;
        }
      }
    },
    receivePatientData: {
      handler(n, o) {
        this.disabledWirteFlag = n.patientId ? false : true;
        if (n && o && n.patientId === o.patientId) return;
        this.visitCode = n.visitCode;
        this.patient = n;
        this.sigenStyle = true;
        // 兼容处理文书模板展示诊断信息
        if (this.saveMode === "editor") {
          return;
        }
        this.resetAndReload();
      },
      immediate: true,
      deep: true
    },
    isOpened(n) {
      if (this.time && Date.now() - this.time < 500) {
        return;
      }
      this.time = Date.now();
      console.log(`n`, n);
      this.shrinkValue = n ? shrinkValue : closeValue;
      this.shrinkText = n ? "收回" : "拉起";
    },
    diagnosticData: {
      handler(n) {
        console.log(`n`, n);
        this.isOpened = false;
        this.diagnosticForm = { ...n };
        /* this.diagnosticForm.cwFlagName =
                this.diagnosticForm.cwFlag === "2" ? "中医" : "西医"; */
        this.diagnosticForm.id = ""; // id 置空
      },
      deep: true
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
.bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  padding: 0 20px 20px 20px;
  height: 400px;
  overflow-y: hidden;
  min-width: 810px;
  // 中药类型
  .tcmSyndrome2 {
    width: 100%;
    height: 40px;
    overflow: auto;
    /deep/ .el-form-item__content {
      width: 50%;
    }
  }
  .card-header {
    // padding: 5px 0;
  }

  .button {
    // margin-top: 10px;
  }

  /deep/.el-form-item {
    display: inline-block;
    // margin-bottom: 16px;
  }

  .el-form-item {
    // margin-right: 24px;
  }

  .diagMain {
    vertical-align: top;
  }

  /deep/.el-form-item__content {
    display: inline-block;
    height: 36px;
  }

  .diagnosticForm {
    position: relative;
    padding-top: 14px;

    .button {
      position: absolute;
      right: 0px;
      bottom: 0px;
      margin-right: 0;
      margin-bottom: 0;
    }
  }
}
</style>
