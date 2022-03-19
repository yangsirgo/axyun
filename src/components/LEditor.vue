<template>
  <div class="l-editor" :id="editorId">
    <div v-if="isScrollBar" class="paperscale" :style="paperscaleStyle">
      <input
        type="range"
        v-model="iframeScale"
        :max="150"
        :min="60"
        :step="10"
        orient="vertical"
      />
      <span :class="'paperscale-value'">{{ iframeScale + "%" }}</span>
    </div>

    <i
      v-if="isFullFlag"
      class="el-icon-full-screen fullscreen"
      :class="configs.editorModel == 'edit' ? 'edit-fullscreen' : ''"
      :style="fullStyle"
      @click="full"
      title="全屏"
    ></i>

    <div
      ref="editor"
      :class="configs.editorModel == 'edit' ? 'edit-model' : ''"
      :id="randomId"
    >
      <slot></slot>
    </div>
    <img-form
      ref="imageDialog"
      :isShow.sync="dialogVisible"
      :template="sTemplate"
      :imageTypeOpt="imageTypeOpt"
      @handle-save="handleSave"
    ></img-form>
    <edit-section
      templateStatus="1"
      scopeLevel="2"
      :selectorStr="selectorStr"
      :saveContent="saveContent"
      :isShow.sync="showPhraseDialog"
      :innerHtml="phraseHtml"
      :template="phraseInfo"
      :editorTypeFlag="editorTypeFlag"
    ></edit-section>
    <el-dialog
      width="580px"
      custom-class="prient-class"
      :append-to-body="true"
      title="续打文书"
      :visible.sync="dialogFormVisible"
    >
      <div style="width: 560px; height: 400px; margin-left: 10px" class>
        <el-table
          class="my-table"
          :data="eleData"
          ref="tempTable"
          border
          width="100%"
          height="100%"
          style="width: 100%; margin-top: 10px"
        >
          <el-table-column label="选择" fixed width="60px">
            <template slot-scope="scope">
              <el-radio
                :label="scope.$index"
                v-model="templateRadio"
                @change.native="getTemplateRow(scope.$index, scope.row)"
                style="margin-left: 10px"
                >&nbsp;</el-radio
              >
            </template>
          </el-table-column>
          <el-table-column
            fixed
            type="index"
            label="序号"
            width="50px"
          ></el-table-column>
          <el-table-column
            v-for="(item, index) in eleParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          ></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printFunc">打印</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="980px"
      :append-to-body="true"
      title="svg编辑"
      :visible.sync="svgEditShow"
    >
      <iframe
        title="电子病历编辑器"
        :src="svgEditorUrl"
        height="720"
        style="width: 100%"
        ref="svgEdit"
      ></iframe>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";

import { check_IP } from "axcommon/src/utils/util";

import editSection from "@/views/emrRecord/DocTempMaintenance/component/editSection";
import imgForm from "@/views/emrRecord/dictionary/imageManagement/components/editSection";

// import "../../public/lib/axEditor/axeditor.all.min.js";
// import "../../public/lib/axEditor/third-party/print/CLodopFuncs.min.js";

import { getUId, getUN } from "@/utils/crypto";
import { getPamars, getRole } from "@/utils/auth";
import { saveElement } from "@/utils/saveElement";
import { getServerConfig } from "@/utils/config";

import { getHistoryDiagList } from "@/api/emrRecord/tools/historicalDiagnosis.js";
import { getAll } from "@/api/emrRecord/emr/element";
import { getTree } from "@/api/emrRecord/emr/imageType.js";
import { getNextSeqNo } from "@/api/emrRecord/emr/sectionTemplate";
import { updatePrintNo } from "@/api/emrRecord/emr/instrument";
import { getParamsByKey } from "@/api/emrRecord/emr/SysParam";

import {
  getPrintList,
  getPrintContent,
  getSensitiveWord,
  getByParamsEx,
  getServerDate,
  getUuids,
  getEleUnits
} from "@/api/emrRecord/emr/editor";
import { getDatas } from "@/api/emrRecord/wconf/wparam.js";
import debounce from 'throttle-debounce/debounce';

export default {
  name: "axEditor",
  components: {
    editSection,
    imgForm
  },
  props: {
    env: String, // 运行环境
    //编辑器的宽度取决于编辑器渲染节点本身的宽度
    configs: {
      editorModel: "design"
    },
    defaultMsg: {
      type: [String, undefined],
      default: undefined
    },
    //就诊类型
    visitType: {
      type: String,
      default: ""
    },
    //医护标识
    dnFlag: {
      type: String,
      default: ""
    },
    // 是否是家床病历
    isHome: {
      type: String,
      default: "0"
    },
    // 病历基本信息
    mrinfo: {
      type: Object,
      default: () => {
        return {
          // 病历文书编码
          mrId: "",
          dataVersion: "",
          // 打印次数
          printNo: 0
        };
      }
    },
    // 是否展示缩放
    isScrollBar: {
      type: Boolean,
      default: true
    },
    // 是否展示全屏按钮
    isFullFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editorTypeFlag: false,
      iframeScale: 100,
      fullFlag: true, //是否全屏标识
      fullStyle: {
        top: "18px",
        right: "25px"
      },
      paperscaleStyle: {
        right: "-30px",
        bottom: "105px"
      },
      editorId: "lEditor_" + uuidv4(),
      randomId: "axEditor_" + uuidv4(),
      axeditor: null,
      showPhraseDialog: false, //是否显示片语保存弹窗
      saveContent: true, //是否保存片语内容
      phraseHtml: "", //片语内容
      phraseInfo: {}, //片语信息，如医护标识、就诊类型、片语类型等,
      dialogFormVisible: false,
      eleParams: [
        {
          prop: "nm",
          label: "文书名称",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "120"
        },
        {
          prop: "bizTime",
          label: "业务时间",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "120"
        }
      ],
      eleData: [],
      templateRadio: false,
      templateSelection: {},
      mrDocIndex: -1,
      sensitiveList: [],

      sTemplate: {}, // form提交字段集合
      dialogVisible: false, //
      imageTypeOpt: [], // 图片类型
      tree: [], // 图片类型树
      imageTypeMap: new Map(),
      svgEditorUrl: "../../lib/svgEditor/editor/svg-editor.html", // 矢量图编辑器 地址
      svgEditShow: false,
      continuePrintTypeGroupCd: "", // 后端配置的字段
      selectorStr: null
    };
  },
  computed: {
    ...mapGetters("user", ["role"]),
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("homeSickbeds", {
      homeSickbedsPatient: "receivePatientData"
    }),
    isHomeBed() {
      return this.isHome === "1" && this.visitType === "04";
    },
    patientId() {
      let patientId = "";
      if (this.isHomeBed) {
        patientId = this.homeSickbedsPatient.patientId;
      } else {
        patientId = this.receivePatientData.patientId;
      }
      return patientId;
    },
    patientAge() {
      let age = "";
      if (this.isHomeBed) {
        age = this.homeSickbedsPatient.age;
      } else {
        age = this.receivePatientData.patientAge;
      }
      return age;
    },
    patientGender() {
      let patientGender = "";
      if (this.isHomeBed) {
        patientGender = this.homeSickbedsPatient.gender;
      } else {
        patientGender = this.receivePatientData.patientGender;
      }
      return patientGender;
    },
    visitCode() {
      let visitCode = "";
      if (this.isHomeBed) {
        visitCode = this.homeSickbedsPatient.treatNo;
      } else {
        visitCode = this.receivePatientData.visitCode;
      }
      return visitCode;
    }
  },
  watch: {
    defaultMsg: {
      immediate: true,
      handler(newVal, oldVal) {
        //放置在编辑器未初始化前触发编辑器方法，导致报错
        if (this.axeditor && this.axeditor.body) {
          this.setContent(newVal);
          this.execCommand("restart");
        }
      },
      deep: true
    },
    "configs.initialFrameHeight": {
      handler() {
        let editorDom = document.getElementById(this.randomId);
        if (editorDom) {
          let toolbarHeight = editorDom.getElementsByClassName(
              "edui-editor-toolbarbox"
            )[0].offsetHeight,
            newHeight = this.configs.initialFrameHeight;

          editorDom.getElementsByClassName(
            "edui-editor-iframeholder"
          )[0].style.height = newHeight - toolbarHeight + "px";
        }
      },
      deep: true,
      immediate: true
    },
    receivePatientData: {
      handler(newVal, oldVal) {
        if (this.isHomeBed) return;
        if (!newVal.visitCode) {
          return;
        }
        if (newVal.patientId) {
          this.getSensitiveList();
        }
      },
      deep: true
    },
    homeSickbedsPatient: {
      handler(newVal, oldVal) {
        if (!this.isHomeBed) return;
        if (newVal.patientId) {
          this.getSensitiveList();
        }
      },
      deep: true
    },
    "mrinfo.mrId": {
      handler(newVal, oldVal) {
        if (
          (this.receivePatientData.patientId ||
            this.homeSickbedsPatient.patientId) &&
          newVal
        ) {
          this.getSensitiveList();
        }
      },
      deep: true
    },
    iframeScale: {
      handler() {
        this.updatePaperScale();
      }
    }
  },
  created() {
    this.getImgType();
    this.getParamsPercent();
  },
  mounted() {
    this.debouncedGetData = debounce(1000, (paragraphInfo) => {
      if (paragraphInfo.type === "PT_zs") {
        this.setMainComplaint(paragraphInfo.msg);
      } else if (paragraphInfo.type === "PT_xbs") {
        this.setHisPresent(paragraphInfo.msg);
      }
    });
    this.$root.eventHub.$on("recordResize", () => {
      this.changeSize();
    });

    let configs =
      typeof this.configs == "string" ? JSON.parse(this.configs) : this.configs;
    this.addCustomFunc(configs, "saveMethod", "save");
    this.addCustomFunc(configs, "saveTemplMethod", "saveAsTempl");
    this.addCustomFunc(configs, "alertMsg", "alertMsg");
    this.addCustomFunc(configs, "confirmMsg", "confirmMsg");
    this.addCustomFunc(configs, "saveEleMethod", "saveEle");
    this.addCustomFunc(configs, "savePhraseMethod", "savePhrase");
    this.addCustomFunc(configs, "printResult", "updatePrintResult");
    this.addCustomFunc(configs, "clickSignature", "handleClickSignature");
    this.addCustomFunc(configs, "showContinuePrint", "handleShowContinuePrint");
    this.addCustomFunc(configs, "saveImgLib", "handleSaveImgLib");
    this.addCustomFunc(configs, "svgeditorMethod", "handleSvgeditorMethod");
    this.addCustomFunc(configs, "getServerDate", "getServerDate");
    this.addCustomFunc(configs, "getUUID", "getUuids");
    this.addCustomFunc(configs, "setContentReady", "setContentReady");
    this.addCustomFunc(configs, "clickElement", "clickElementAddEventer");
    this.addCustomFunc(configs, "printStatus", "printStatusAddEvent");
    // configs["getServerDate"] =  getServerDate; // 直接配置api方法
    configs["$"] = this.jq;
    let pamars = JSON.parse(getPamars());
    let _role = JSON.parse(getRole());
    if (!configs.userInfo || configs.userInfo.test) {
      configs.userInfo = {
        id: getUId(),
        name: getUN(),
        priv: 1,
        token: this.$store.getters.token,
        hosId: this.$store.getters.hosId,
        dept: this.$store.getters.role.deptId,
        role: this.$store.getters.role.roleId,
        _hosId: pamars.hosId || "",
        _hosNm: encodeURI(pamars.hosName) || "",
        _hosCd: pamars.hosCd || "",
        _orgId: pamars.orgId || "",
        _orgNm: encodeURI(pamars.orgName) || "",
        _orgCd: pamars.orgCd || "",
        _currDept: this.$store.getters.role.deptId || _role.deptId || "",
        _currRole: this.$store.getters.role.roleId || _role.roleId || "",
        _currDeptNm: encodeURI(this.$store.getters.role.deptName) || "",
        _currDeptCd: this.$store.getters.role.deptCode || _role.deptCode || "",
        _workType: pamars.workType || "",
        _roleType: this.$store.getters.role.rtype || _role.rtype || ""
      };
    }
    if (!configs.apiUrl) {
      //配置弹窗交互API地址
      configs.apiUrl = this.handlerCommonUrl(process.env.VUE_APP_EMR_BASE_API);
      configs.serverUrl =
        this.handlerCommonUrl(process.env.VUE_APP_EMR_BASE_API) +
        "/ueditor/controller";
    }
    configs.AXEDITOR_HOME_URL = this.handlerCommonUrl(
      process.env.VUE_APP_EDITOR_PATH
    );
    this.$nextTick(() => {
      //默认设计模式，若想设为编辑模式或只读模式，可在第二个参数中传入
      // configs.AX = AX;
      //默认设计模式，若想设为编辑模式或只读模式，可在第二个参数中传入
      this.axeditor = AX.getEditor(this.randomId, configs);
      console.log(this.axeditor, "editor组件内 this.axeditor");
      this.axeditor.addListener("ready", () => {
        setTimeout(() => {
          this.changeSize();
        }, 100);
        this.$emit("ready", this.axeditor);
        if (this.defaultMsg != undefined) {
          this.setContent(this.defaultMsg);
        } else if (this.axeditor.getContentTxt() == "") {
          this.setContent("<p></p><p></p><p></p><p></p><p></p><p></p>");
        }
        this.execCommand("recordinitcontent");

        // 初始化页面的缩放值
        this.updatePaperScale();
        // 获取数字元素单位
        this.setEleUnits();
        if (
          this.patientId &&
          (this.axeditor.options.editorModel == "mark" ||
            this.axeditor.options.editorModel == "edit")
        ) {
          this.getSensitiveList();
        }
      });
      this.getAllSensitWords();
      this.axeditor.addListener("paragraphKeyUp", (type, paragraphInfo) => {
        this.debouncedGetData(paragraphInfo);
      });
    });
    window.addEventListener("resize", this.changeSize);

    this.$root.eventHub.$on("editorResize", open => {
      this.resizeEditor(open);
    });
    // 矢量图编辑注册交互事件
    window.getMessageForSvg = file => {
      console.log(file);
      this.axeditor.execCommand("insertsvg", file.svg);
      this.svgEditShow = false;
    };

    document.addEventListener("keydown", function(event) {
      var code = event.keyCode ? event.keyCode : event.which;
      if (code === 27 && this.env) {
        this.fullFlag = false;
      }
    });
  },

  methods: {
    ...mapActions({
      setMainComplaint: "cdss/setMainComplaint",
      setHisPresent: "cdss/setHisPresent"
    }),
    getAllSensitWords() {
      getByParamsEx({ noParamShowAll: 1 }).then(res => {
        this.axeditor && (this.axeditor.options.allSensitiveSetting = res.data);
      });
    },
    handlerCommonUrl(url) {
      if (check_IP()) {
        return `${url}_IP`;
      }
      return url;
    },
    clickElementAddEventer(type) {
      this.$emit("clickElementAddEventer", type);
    },
    getParamsPercent() {
      let params = {
        key: ["medicalAutoCompletely", "continuePrintTypeGroupCd"]
      };
      getParamsByKey(params)
        .then(res => {
          if (res.code === 1) {
            if (this.isScrollBar) {
              this.iframeScale = res.data.medicalAutoCompletely;
            }

            this.continuePrintTypeGroupCd = res.data.continuePrintTypeGroupCd;
          } else {
            this.$message.error(res.msg || "获取文书默认缩放失败");
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    updatePaperScale() {
      let value = parseInt(this.iframeScale) / 100;
      const editorDom = document.getElementById(this.randomId);

      let iframeElem = editorDom.getElementsByClassName(
        "ax-editor-content-iframe"
      )[0];

      if (!iframeElem) {
        return;
      }
      iframeElem.style.transform = "scale(" + value + ") ";

      this.axeditor.execCommand("paperscale", value);

      iframeElem.style.transformOrigin = "50% 0px";
      let rate = 1 - value;

      if (value - 1 >= 0) {
        iframeElem.style.height = 100 + rate * (92 + rate * 48) + "%";
      } else {
        iframeElem.style.height = 100 + rate * (92 + rate * 160) + "%";
      }
    },
    handleSvgeditorMethod() {
      this.svgEditShow = true;
      console.log(this.$refs.svgEdit);
    },
    setEleUnits() {
      // 获取数字元素单位，注入编辑器
      getEleUnits().then(res => {
        if (res.code == 1) {
          this.axeditor.options.eleUnits = res.data;
        }
      });
    },
    // 敏感词查询
    async getSensitiveWord() {
      let datas = {
        pageSize: 20,
        page: 1,
        id: 4237
      };

      let ageUnit = await getDatas(datas);

      const ageReg = /((\w*)岁)?((\w*)月)?((\w*)天)?/;
      const result = this.patientAge.match(ageReg);
      const ageArray = [result[2], result[4], result[6]];
      let ageNum = 0;
      let ageUnitText = "岁";
      if (ageArray[0]) {
        ageNum =
          parseInt(ageArray[0]) +
          (ageArray[1] ? parseFloat((ageArray[1] / 12).toFixed(1)) : 0);
        ageUnitText = "岁";
      } else if (ageArray[1]) {
        ageNum =
          parseInt(ageArray[1]) +
          (ageArray[2] ? parseFloat((ageArray[2] / 30).toFixed(1)) : 0);
        ageUnitText = "月";
      } else {
        ageNum = parseInt(ageArray[2]);
        ageUnitText = "天";
      }
      let ageCode = "";
      // let ageUnitText = this.patientAge
      //   ? String(this.patientAge).replace(/[0-9]/gi, "")
      //   : "";
      if (ageUnit.code == 1) {
        ageUnit.data.forEach(item => {
          if (item.name === ageUnitText) {
            ageCode = item.code;
          }
        });
      }
      if (!this.patientId) {
        return;
      }
      let dataData = await getHistoryDiagList({
        paId: this.patientId,
        visitType: this.visitType,
        enNo: this.visitCode,
        isHome: this.isHome
      });

      let diagnosisList = [];
      if (dataData.code === 1 && dataData.data.length) {
        diagnosisList = dataData.data
          // .filter(diagnose => diagnose.diagCd !== "")
          .map(diagnose => {
            return {
              diagCd: diagnose.diagCd,
              diagNm: diagnose.diagNm
            };
          });
      }

      // let diagnosis = diagnosisList
      //   .filter(diagnose => diagnose.diagCd !== "")
      //   .map(diagnose => diagnose.diagCd)
      //   .join(",");
      let diagnosisNm = diagnosisList
        .map(diagnose => diagnose.diagNm)
        .join(",");
      let data = {
        ageUnit: ageCode == "" ? 3 : ageCode,
        age: ageNum,
        sensitiveType: "1",
        gender: this.patientGender, //年龄类型传年龄    其他传相应code
        // diagnosis: diagnosis,
        diagnosisNm: diagnosisNm,
        illnessState: ""
      };
      return await getByParamsEx(data);
    },
    async getSensitiveList() {
      let res = await this.getSensitiveWord();
      try {
        if (res.code === 1) {
          this.sensitiveList = res.data;
          this.axeditor &&
            (this.axeditor.options.sensitiveSetting = this.sensitiveList);
          this.axeditor.execCommand("sensitive"); // 敏感词校验
        }
      } catch (error) {
        this.$message.error(error.msg);
      }

      console.log(this.sensitiveList, "this.sensitiveList");
    },
    setContentReady() {
      this.$emit("setContentReady");
    },
    async getServerDate(cb) {
      let res = await getServerDate();
      if (res.code == 1) {
        cb(res.data);
      }
    },
    clearSensitiveList() {
      this.axeditor.options.sensitiveSetting = [];
    },
    getTemplateRow(index, row) {
      this.mrDocIndex = index;
      this.templateSelection = row;
    },
    resetData() {
      this.mrDocIndex = -1;
      this.templateSelection = {};
      this.eleData = [];
    },
    handleShowContinuePrint() {
      // 显示弹窗列表
      this.dialogFormVisible = true;
      this.getPrintListFunc();
    },
    printFunc() {
      if (this.mrDocIndex === -1) {
        this.$message.warning("请选择打印文书");
        return;
      }
      let mrIds = this.eleData.map(item => {
        return item.mrId;
      });
      let data = {
        startMrId: mrIds[this.mrDocIndex],
        mrIds,
        beginFlag: ""
      };
      this.execCommand("docontinueprint", {
        config: this.eleData,
        startIdx: this.mrDocIndex
      });

      // getPrintContent(data)
      //   .then(res => {
      //     if (res.code === 1) {
      //       let data = res.data;
      //       this.execCommand("docontinueprint", data);
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error);
      //     this.$message.error(error.msg);
      //   });

      this.dialogFormVisible = false;
    },
    getPrintListFunc() {
      if (this.patientId) {
        this.getSensitiveList();
      }
      let data = {
        typeGroupCode: this.continuePrintTypeGroupCd,
        enId: this.visitCode
      };

      getPrintList(data)
        .then(res => {
          if (res.code === 1) {
            this.eleData = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
          this.$message.error(error.msg);
        });
    },
    addCustomFunc(configs, methodName, methodContent) {
      // if (typeof configs[methodName] != "function") {
      configs[methodName] = this[methodContent];
      // }
    },
    handleClickSignature(data) {
      this.$emit("handleClickSignature", data);
    },
    changeSize() {
      // debugger;
      // 获取编辑器的dom元素
      const lEditorElem = this.$parent.$el.ownerDocument.getElementById(
        this.editorId
      );
      //
      const editorDom = document.getElementById(this.randomId);
      if (!editorDom) return;
      const toolbar = editorDom.getElementsByClassName("ax-toolbar-tab")
        ? editorDom.getElementsByClassName("ax-toolbar-tab")[0]
        : null;

      // 工具箱
      const toolbarboxouter = editorDom.getElementsByClassName(
        "edui-editor-toolbarboxouter"
      )
        ? editorDom.getElementsByClassName("edui-editor-toolbarboxouter")[0]
        : null;

      let newHeight = lEditorElem
        ? lEditorElem.parentNode.offsetHeight -
          (toolbar ? toolbar.offsetHeight : 0) -
          (toolbarboxouter ? toolbarboxouter.offsetHeight : 0)
        : 0;

      if (newHeight < 200) {
        newHeight = 200;
      }
      const $iframeholder = editorDom.getElementsByClassName(
        "edui-editor-iframeholder"
      )[0];

      if (this.configs.initialFrameHeight == "750") {
        $iframeholder.style.height = this.configs.initialFrameHeight + "px";
        $iframeholder.style.width = "100%";
        return;
      }

      if (!this.configs.initialFrameHeight) {
        $iframeholder.style.height = newHeight + "px";
      } else {
        $iframeholder.style.height =
          parseInt(this.configs.initialFrameHeight) + "px";
      }
    },
    execCommand(cmd, params) {
      return this.axeditor.execCommand(cmd, params);
    },
    getContent() {
      return this.axeditor.getContent();
    },
    setContent(html) {
      if (this.axeditor) {
        this.axeditor.setContent(html);
      }
    },
    save(content) {
      this.$emit("save", content, "02");
    },
    saveAsTempl(content) {
      this.$emit("saveAsTempl", content);
    },
    full() {
      console.log(this.env, this.fullFlag, "this.env");

      if (!this.env) {
        this.axeditor.ui.setFullScreen(this.fullFlag);
      } else {
        this.$emit("fullScreen", this.fullFlag ? 1 : 0);
      }

      this.fullFlag = !this.fullFlag;
      this.resizePos();
    },
    resizeEditor(open) {
      setTimeout(() => {
        if (!this.fullFlag) {
          this.axeditor.ui._updateFullScreen(); //更新全屏下编辑器位置
        }
        this.resizePos();
      }, 50);
    },
    resizePos() {
      if (!this.fullFlag) {
        var sideBarWidth;
        if (this.env) {
          sideBarWidth = 35;
        } else {
          sideBarWidth =
            document.querySelectorAll(".bdr4")[0] &&
            document.querySelectorAll(".bdr4")[0].offsetWidth + 35;
        }
        this.fullStyle = {
          top: "75px",
          right: sideBarWidth + "px"
        };
        this.paperscaleStyle = {
          bottom: "70px",
          right: sideBarWidth + "px"
        };
      } else {
        this.fullStyle = {
          top: "18px",
          right: "25px"
        };
        this.paperscaleStyle = {
          bottom: "70px",
          right: "-30px"
        };
      }
    },
    getUuids(count, cb) {
      getUuids(count).then(res => {
        cb(res);
      });
    },
    alertMsg(msg, type) {
      setTimeout(() => {
        this.$message({
          type: type || "error",
          message: msg
        });
      }, 1000);
    },
    confirmMsg(msg, callback) {
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          callback(true);
        })
        .catch(() => {
          callback(false);
        });
    },
    saveEle(eleData) {
      /**
        cascadeId: 级联id
        id: 元素编码
        isDel: 可删除
        isEmpty: 可为空
        isHide: 隐藏
        isPrint: 可打印
        isSecret: 是否保密
        metaData: 数据元信息{id:'数据元id',label:'数据元名称',value:'数据元valueId',metaType:'数据元类型'}
        name: 元素名称
        operator: 级联操作符
        placeholderText: 占位文本
        pluginType: 元素类型
        quot: 引用
        readonly: 只读
        showBorder: 显示边框
        showCondition: 级联条件
        source: 源
        tipText: 提示文本
        defaultVal: 默认值
        isEdit: 可编辑

        //文本专有属性
        maxLen: 最大字符长度
        minLen: 最小字符长度

        //下拉、单复选专有属性
        options: 下拉或单复选选项

        //数字专有属性
        isPopuInput: 弹窗输入
        eleUnitContr: 是否显示元素单位
        elemUnit: 元素单位
        valMax: 值域最大值
        valMin: 值域最小值
        normalMax: 正常值域最大值
        normalMin: 正常值域最大值
        numAccuracy: 小数点位数

        //日期元素专有属性
        inserCurDate: 是否刷入当前日期
        dateFormat: 日期格式
        dateFormatType: 默认日期格式--datatime

        //有无元素专有属性
        isShowName: 是否显示名称
        notSuffix: 阴性前缀标识
        notSuffixName: 阴性前缀名称
        yesSuffix: 阳性前缀标识
        yesSuffixName: 阳性前缀名称

        // 段落专有属性
        paratype: 段落类型
        singleTitle: 标题独占一行
        titleBg: 背景颜色

        //签名元素
        isCurrDoctor: 默认当前医生书写
        showPlaceholder： 显示占位文本
        signtype： 签名类型
        */
      getAll()
        .then(res => {
          if (res.code == 1) {
            let typeCodes = {
              text: "01",
              tagelement: "02",
              numberelement: "03",
              radio: "04",
              checkbox: "05",
              hot: "06",
              datedomain: "07",
              haveornot: "08",
              combine: "09",
              paragraphele: "10",
              signature: "11",
              select: "12",
              selectmulti: "13"
            };
            let [eles, typeCode] = [res.data, typeCodes[eleData.pluginType]];
            eles.map(item => {
              if (item.baseElementCode == typeCode) {
                eleData.elementBaseId = item.id;
                eleData.elementBaseName = item.baseElementName;
              }
              return item;
            });
            saveElement(eleData).then(res => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "元素存库成功！"
                });
              } else {
                this.$message({
                  type: "error",
                  message: "元素存库失败，请重试！"
                });
              }
            });
          }
        })
        .catch(res => {
          console.log(res);
          this.$message({
            type: "error",
            message: "元素类型信息获取失败，请重试！"
          });
        });
    },
    savePhrase(phraseContent, selector = "") {
      let paratype = phraseContent.paratype;
      let seqNo = "";
      getNextSeqNo().then(res => {
        if (res.code === 1) {
          seqNo = res.data;
          setTimeout(() => {
            let templateCode = seqNo;
            this.phraseHtml = this.execCommand("getparagraphtext", {
              type: paratype,
              filterMarks: true
            }).phtml;
            this.phraseInfo = {
              sectionTemplateCode: templateCode,
              visitType: this.visitType,
              dnFlag: this.dnFlag,
              typeCode: paratype,
              sectionTemplateStatus: "1",
              scopeLevel: "2"
            };
            this.showPhraseDialog = true;
            this.selectorStr = selector;
          }, 200);
        } else {
          this.$message.error("获取片语模板流水号失败！");
        }
      });
    },
    // 监听打印状态 展示loading
    printStatusAddEvent(state) {
      if (state === "start") {
        this.$showLoading();
      } else if (state === "end") {
        this.$hideLoading();
      } else {
        this.$message.error("请检查打印机状态");
      }
    },
    async updatePrintResult(state) {
      // 只有state为1才视为打印成功
      // if (state != 1) {
      //   return;
      // }
      if (!this.mrinfo.mrId) {
        console.error("缺少病历参数，请为LEditor组件配置mrinfo数据");
        return;
      }

      let param = {
        dataVersion: this.mrinfo.dataVersion,
        mrId: this.mrinfo.mrId,
        printNo: this.mrinfo.printNo + 1
      };

      try {
        // debugger;
        let res = await updatePrintNo(param);

        if (res.code == 1) {
          console.log("更新打印次数成功");

          this.$emit("update", {
            mrId: this.mrinfo.mrId,
            dataVersion: res.data.dataVersion
          });
          return true;
        } else {
          console.error("更新打印次数失败");
          return false;
        }
      } catch (res) {
        console.error(res.msg);
        return false;
      }
    },
    handleSaveImgLib(data) {
      this.sTemplate = {
        customCode: "",
        dataVersion: 0,
        description: "",
        dnFlag: "",
        enabled: "0",
        fileUrl: data.src,
        format: "",
        imageCode: "",
        imageId: "",
        imageName: "",
        imageType: "",
        imageUrlId: data.id,
        ownerId: "",
        ownerType: "",
        pinyinCode: "",
        sortNo: 1,
        wubiCode: "",
        isform: "editor"
      };
      setTimeout(() => {
        this.dialogVisible = true;
      }, 200);
    },
    handleSave() {
      this.dialogVisible = false;
    },
    getImgType() {
      getTree({})
        .then(res => {
          if (res.code == 1) {
            this.tree = res.data;
            this.imageTypeOpt = [];
            this.tree.forEach(item => {
              this.getAllType(item);
            });
            console.log("map", this.imageTypeMap);
          }
        })
        .catch(res => {
          console.log(res, "rere");
          this.$message.error(res.msg);
        });
    },
    getAllType(data) {
      this.imageTypeOpt.push({ id: data.id, label: data.label });
      this.imageTypeMap.set(data.id, data.label);
      if (data.children) {
        data.children.forEach(item => {
          this.getAllType(item);
        });
      }
    }
  },
  beforeDestroy() {
    if (this.axeditor !== null && this.axeditor.destroy) {
      this.axeditor.destroy();
    }
    window.removeEventListener("resize", this.changeSize);
    this.$root.eventHub.$off("editorResize");
  }
};
</script>
<style lang="scss">
.l-editor {
  position: relative;
  height: 100%;
  .edit-model {
    .edui-default {
      // height: 100%;
      .edui-toolbar .edui-menubutton .edui-icon {
        display: inline-block !important;
      }
    }
    .edui-editor-toolbarboxouter .edui-default .edui-label {
      display: inline-block !important;
      line-height: 20px !important;
      margin-left: 3px;
    }
  }
  .fullscreen {
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 1999;
    cursor: pointer;
    &.edit-fullscreen {
      top: 18px;
    }
  }
  .prient-class {
    height: 600px;
  }
}
.popover {
  .fullscreen {
    display: none;
  }
  .edui-editor-toolbarbox {
    display: none;
  }
}
.paperscale {
  position: absolute;
  right: -30px;
  z-index: 1999;
  bottom: 50px;
  transform: rotate(90deg);
}
.paperscale-value {
  position: absolute;
  top: 3px;
  z-index: 1999;
  font-size: 14px;
  white-space: nowrap;
  right: 133px;
  transform: rotate(-90deg);
}
</style>
