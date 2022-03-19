<template>
  <div class="container" v-loading="recordLoading">
    <div v-if="showTree" style="height: 100%; width: 100%">
      <el-card class="left" v-show="showMrHomepageCon">
        <!-- @updateEditor="updateEditorHandler" -->
        <ins-tree
          ref="insTree"
          :showMrHomepage="showMrHomepage"
          :modeType="mode"
          :dnFlag="dnFlag"
          :isHome="isHome"
          :disableTimeControl="disableTimeControl"
          @node-click="handleNodeClick($event)"
          @delete="handlerDel"
          @closeTree="handleCloseTree"
          @copyByTree="checkMrReplaceableAndCreate"
        ></ins-tree>
      </el-card>
      <el-card
        class="left-mini"
        v-show="!showMrHomepageCon"
        @click.native="openTree"
      >
        <i class="special-icon el-icon-arrow-right"></i>
        <p class="text">展开文书树</p>
      </el-card>
      <el-card
        class="right"
        :style="{ 'margin-left': !showMrHomepageCon ? '30px' : '' }"
        id="emr-editor1"
      >
        <div
          style="width: 100%; height: 100%"
          v-show="!mrHomepage"
          v-loading="isDoneRquest"
        >
          <l-editor
            ref="axEditor"
            :defaultMsg="defaultMsg"
            :visitType="modeTypeStr"
            :dnFlag="dnFlag"
            :env="env"
            :mrinfo="mrinfoObj"
            :isHome="isHome"
            :configs="
              isHome === '1'
                ? editorConfigs_inp1
                : dnFlag === '1'
                ? editorConfigs_inp
                : editorConfigs1
            "
            @save="save"
            @clickElementAddEventer="clickElementAddEventer"
            @fullScreen="handlerFullScreen"
            @saveAsTempl="saveTemp"
            @handleClickSignature="clickSignature"
            @ready="editorReady"
            @update="updatePrintNo"
          ></l-editor>
        </div>
        <div
          style="width: 100%; height: 100%; overflow: auto"
          v-show="mrHomepage"
        >
          <mr-homepage
            :style="{
              transform: 'scale(' + scaleVal + ')',
              'transform-origin': '0 0'
            }"
          ></mr-homepage>
        </div>
      </el-card>
    </div>
    <div v-else style="height: 100%; width: 100%">
      <el-card style="height: 100%; width: 100%" id="emr-editor2">
        <l-editor
          ref="axEditor"
          :env="env"
          :defaultMsg="defaultMsg"
          :visitType="modeTypeStr"
          :dnFlag="dnFlag"
          :configs="editorConfigs"
          :isHome="isHome"
          @save="save"
          @fullScreen="handlerFullScreen"
          @saveAsTempl="saveTemp"
          @handleClickSignature="clickSignature"
          @ready="editorReady"
        ></l-editor>
      </el-card>
    </div>

    <el-dialog
      title="新建病历"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="1134px"
    >
      <div
        style="
          margin: 12px 12px 0px 12px;
          height: 530px;
          border-top: 2px solid #e4e4e4;
        "
      >
        <create-emr
          ref="createEmr"
          v-if="dialogVisible"
          :isHome="isHome"
          :dnFlag="dnFlag"
          :visitType="this.modeTypeStr"
          :classValMsg="classValMsg"
          @rowDbClick="handleRowDbClick"
        ></create-emr>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="myBtn" type="primary" @click="handleDetermine">
          确定
        </el-button>
        <el-button class="myBtn" @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="另存为模板"
      :append-to-body="true"
      :visible.sync="saveTempDialog"
      width="900px"
    >
      <div style="margin: 15px 40px 15px 40px">
        <create-temp ref="createTemp"></create-temp>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="myBtn" type="primary" @click="handleDetermine1"
          >确定</el-button
        >
        <el-button class="myBtn" @click="saveTempDialog = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      width="400px"
      :append-to-body="true"
      title="请输入签名医师工号及密码"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" width="200px">
        <el-form-item label="工号" prop="name" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.name" autocomplete="输入工号"></el-input>
        </el-form-item>

        <el-form-item
          class="down-margin"
          label="密码"
          prop="passWord"
          :label-width="formLabelWidth"
        >
          <el-input
            type="password"
            v-model="ruleForm.passWord"
            autocomplete="输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearSignLevel('ruleForm')">清 空</el-button>
        <el-button type="primary" @click="checkSignLevel('ruleForm')"
          >确 定</el-button
        >
        <el-button @click="resetData">取 消</el-button>
      </div>
    </el-dialog>
    <div class="mask" v-if="popShow" @click.self="popShow = false">
      <div class="popover">
        <div style="line-height: 45px">
          <el-radio-group v-model="actionType" class="align-center">
            <el-radio :label="0">追加</el-radio>
            <el-radio :label="1">替换</el-radio>
          </el-radio-group>
          <span class="quoteBtn" @click.prevent="quoteSelect">引用</span>
        </div>
        <el-card style="width: 100%" id="emr-editor3">
          <l-editor
            ref="axEditor1"
            :isHome="isHome"
            :isScrollBar="false"
            :defaultMsg="previewTempHtml"
            :visitType="modeTypeStr"
            :configs="editorConfigsShow"
            @ready="previewEditorReady"
          ></l-editor>
        </el-card>
      </div>
    </div>
    <el-dialog
      width="650px"
      title="文书内容"
      :visible.sync="emrContentVisible"
    >
      <div style="height: 600px; overflow: auto; width: 520px; margin: 0 auto;">
        <div v-html="emrContent"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入组件

// import docRecord from "@/views/nursingRecord/maintenanceDocument/components/analyComponent.vue";
import { v4 as uuidv4 } from "uuid";
import mrHomepage from "./component//mrHomepage.vue";
import insTree from "./component/insTree";
import createEmr from "./component/createEmr";
import createTemp from "./component/createTemp.vue";

import { mapGetters, mapActions } from "vuex";

// 引入api相关接口
import {
  getTree,
  contentQuery,
  modifyContent,
  removeMr,
  chkAppPerson,
  save,
  modifyAttribute,
  checkCancelStatus,
  checkMrCreatedBy,
  checkMrReplaceable,
  attributeQuery,
  cancelSubmit,
  getLastFollowUpDate,
  saveHighBloodPressureContent,
  feritinFrom
} from "@/api/emrRecord/emr/instrument";
import {
  getUsableList,
} from "@/api/emrRecord/emr/template";

import { getPatientArchInfo, savaHeightAndWeight } from "@/api/filingAndChange/arch";
import { stopVisitAjax } from "@/api/cis/visit/visit";
import { getGroupFlag, getFrameUrlNew } from "@/api/third/third";

import { getParamsByKey } from "@/api/emrRecord/emr/SysParam";

import { putLocalEn } from "@/api/emrRecord/emr/basicTemplate.js";

import { getPatientInfoByEnNo } from "@/api/emrRecord/cis/patientList";
import { getRecentRecordByPatientId } from "@/api/emr/instrument";

import {
  checkSign,
  signAuthGetConfig,
  signTempSign,
  signDelTempSign
} from "@/api/emrRecord/checkAndSign";

import {
  getDefaultTemp,
  getByCode,
  saveAs,
  getNextSeq,
  getDefaultTempNOPatient
} from "@/api/emrRecord/emr/template";

import { transformCode } from "@/api/emrRecord/directive/directiveRequest";
import { getSelfOrders } from "@/api/emr/contrast";

import {
  saveDiagRelation,
  deleteDiagRelation,
  getDelDiagList
} from "@/api/emrRecord/common/diagnosis"; // 诊断关系维护

import { maintainApplyComp } from "@/api/emrRecord/emr/maintainApply"; // 维护状态文书状态修改接口

import { getCurrentDiagList } from "@/api/common/diagnosis.js";

import CA from "@/api/emrRecord/emr/ca.js";

import { getHistoryDiagList } from "@/api/emrRecord/tools/historicalDiagnosis.js";
import { previousOrderList } from "@/api/emrRecord/tools/PreviousOrder.js";

import { getListHistory } from "@/api/third/third.js";

import { addDiags, deleteDiag } from "@/api/common/diagnosis";

// 引入utils相关工具方法

import { getUId } from "@/utils/crypto";
import {
  showSelectPatientAlert,
  setShowSelectPatientAlert,
  signConfig,
  identityConfirm
} from "@/utils/emrConfig.js";

import Base64 from "@/utils/base64.js";
import {
  refreshMacros,
  insertDiagnose,
  showDiagnoseInfo,
  handlerDiagnoseInfo,
  insertPrescription,
  showPrescriptionInfo,
  handlerPreviousData,
  saveMarks,
  getMarks
} from "@/utils/axeditor";

import { getUserId, getUserName, getPamars } from "@/utils/auth.js";

import sha1 from "js-sha1";
import {
  SZCAInit,
  SZCAKeyIsExist,
  SZCASignMessage,
  SZCAParseSignMessage,
  SZCA_PdfSign_GetSealImage
} from "../../../../public/lib/ca/szcapki";

import clientRecord from "@/mixins/clientRecord";


export default {
  name: "opEmr",
  components: {
    insTree,
    createEmr,
    mrHomepage,
    createTemp
    // docRecord,
  },
  props: {
    showTree: Boolean, //住院
    env: {
      type: String,
      default: ""
    }, // 运行环境
    dnFlag: String,
    showMrHomepage: Boolean, //集成病历(暂时仅作为集成病历模式标志，病案首页先不集成进来了)
    mode: {
      type: String,
      default: "menzhen" // menzhen  zhuyuan
    },
    insertRes: {
      // 插入检验结果数据
      default: null
    },
    insertCheck: {
      // 插入检查结果数据
      default: null
    },
    thirdPatientId: {
      type: String,
      default: ""
    },
    thirdNum: {
      type: String,
      default: ""
    },
    mrIdProp: {
      type: String,
      default: ""
    },
    isHome: {
      type: String,
      default: "0"
    },
    propsPatientId: {
      type: String,
      default: ''
    }
  },
  mixins: [clientRecord],
  inject: {
    tabName: {
      default: () => {
        return () => {};
      }
    }
  },
  data() {
    return {
      popShow: false,
      selectionText: "", // 预览模板时选中的文本
      previewTempHtml: "",
      editorP: null,
      actionType: 1,
      showMrHomepageCon: false,
      ruleForm: {
        name: "",
        passWord: ""
      },
      recordLoading: false,
      formLabelWidth: "60px",
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: "请输入工号", trigger: "blur" }],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checkSignLevelStr: "",
      checkSignLevelObj: {
        normal: "01",
        oneLevel: "02",
        twoLevel: "03",
        threeLevel: "04"
      },
      mrinfoObj: {
        mrId: "",
        dataVersion: "",
        printNo: 0
      },
      editorConfigs: {
        editorModel: "edit",
        defaultModel: "edit",
        initialFrameHeight: "",
        showTabBar: false,
        saveTemplMethod: this.saveTemp,
        submitMethod: this.submit, // 提交病历方法
        recallMethod: this.recall,
        printMethod: this.print,
        refreshMacrosMethod: this.refreshMacros,
        refreshDiagnoseMethod: this.refreshDiagnose1,
        refreshPrescriptionMethod: this.refreshPrescription1,
        refreshHistoryMethod: this.getThirdHistory,
        highBloodFollowUpMethod: this.switchHighBloodFollowUpMethod,
        getAllContentMethod: this.getAllContent,
        //菜单配置，全菜单可参考axeditor.config.js中的配置
        tabToolbars: [
          {
            id: "edit",
            name: "编辑",
            widgets: [
              [
                {
                  id: "save",
                  iconOnly: false,
                  name: "暂存"
                },
                {
                  id: "submit",
                  iconOnly: false,
                  name: "提交"
                },
                {
                  id: "recall",
                  iconOnly: false,
                  name: "撤回"
                },
                {
                  id: "savetempl",
                  iconOnly: false,
                  name: "另存为模板"
                }
              ],
              [
                {
                  id: "refreshMacros",
                  iconOnly: false,
                  name: "刷新基本信息"
                },
                {
                  id: "refreshDiagnose",
                  iconOnly: false,
                  name: "刷新诊断"
                },
                {
                  id: "refreshHistory",
                  iconOnly: false,
                  name: "刷新既往史"
                },
                {
                  id: "highBloodFollowUp",
                  iconOnly: false,
                  name: "高血压随访"
                },
                {
                  id:
                    this.mode === "zhuyuan"
                      ? "refreshprescription_in"
                      : "refreshprescription_out",
                  iconOnly: false,
                  name: "刷新处方"
                }
              ],
              [
                {
                  id: "printpreview",
                  iconOnly: false,
                  name: "打印预览"
                },
                // {
                //   id: "continueprint",
                //   iconOnly: false,
                //   name: "续打",
                // },
                {
                  id: "print",
                  iconOnly: false,
                  name: "打印文档"
                },
                {
                  id: "getAllContent",
                  iconOnly: false,
                  name: "查看文书内容"
                }
              ]
            ]
          }
        ]
      },
      editorConfigs_inp: {
        editorModel: "edit",
        defaultModel: "edit",
        initialFrameHeight: "",
        showTabBar: false,
        saveTemplMethod: this.saveTemp,
        submitMethod: this.submit, // 提交病历方法
        recallMethod: this.recall,
        printMethod: this.print,
        printPreviewMethod: this.printPreview,
        refreshMacrosMethod: this.refreshMacros,
        refreshDiagnoseMethod: this.refreshDiagnose1,
        refreshPrescriptionMethod: this.refreshPrescription1,
        refreshHistoryMethod: this.getThirdHistory,
        highBloodFollowUpMethod: this.switchHighBloodFollowUpMethod,
        getAllContentMethod: this.getAllContent,
        //菜单配置，全菜单可参考axeditor.config.js中的配置
        tabToolbars: [
          {
            id: "edit",
            name: "编辑",
            widgets: [
              [
                {
                  id: "save",
                  iconOnly: false,
                  name: "暂存"
                },
                {
                  id: "submit",
                  iconOnly: false,
                  name: "提交"
                },
                {
                  id: "recall",
                  iconOnly: false,
                  name: "撤回"
                },
                {
                  id: "savetempl",
                  iconOnly: false,
                  name: "另存为模板"
                }
              ],

              [
                {
                  id: "refreshMacros",
                  iconOnly: false,
                  name: "刷新基本信息"
                },
                {
                  id: "refreshDiagnose",
                  iconOnly: false,
                  name: "刷新诊断"
                },
                {
                  id: "refreshHistory",
                  iconOnly: false,
                  name: "刷新既往史"
                },
                {
                  id: "highBloodFollowUp",
                  iconOnly: false,
                  name: "高血压随访"
                },
                {
                  id: "refreshprescription_out",
                  iconOnly: false,
                  name: "刷新医嘱"
                }
              ],
              [
                // {
                //   id: "print",
                //   iconOnly: false,
                //   name: "打印文档"
                // },
                {
                  id: "printpreview",
                  iconOnly: false,
                  name: "打印预览"
                },
                {
                  id: "getAllContent",
                  iconOnly: false,
                  name: "查看文书内容"
                }
              ],
              [
                {
                  iconOnly: true,
                  id: "superscript",
                  name: "上标"
                },
                {
                  iconOnly: true,
                  id: "subscript",
                  name: "下标"
                }
              ]
            ]
          }
        ]
      },
      editorConfigs_inp1: {
        editorModel: "edit",
        defaultModel: "edit",
        initialFrameHeight: "",
        showTabBar: false,
        saveTemplMethod: this.saveTemp,
        submitMethod: this.submit, // 提交病历方法
        recallMethod: this.recall,
        printMethod: this.print,
        printPreviewMethod: this.printPreview,
        refreshMacrosMethod: this.refreshMacros,
        refreshDiagnoseMethod: this.refreshDiagnose1,
        refreshPrescriptionMethod: this.refreshPrescription1,
        refreshHistoryMethod: this.getThirdHistory,
        highBloodFollowUpMethod: this.switchHighBloodFollowUpMethod,
        getAllContentMethod: this.getAllContent,
        //菜单配置，全菜单可参考axeditor.config.js中的配置
        tabToolbars: [
          {
            id: "edit",
            name: "编辑",
            widgets: [
              [
                {
                  id: "save",
                  iconOnly: false,
                  name: "暂存"
                },
                {
                  id: "submit",
                  iconOnly: false,
                  name: "提交"
                },
                {
                  id: "recall",
                  iconOnly: false,
                  name: "撤回"
                },
                {
                  id: "savetempl",
                  iconOnly: false,
                  name: "另存为模板"
                }
              ],

              [
                {
                  id: "refreshMacros",
                  iconOnly: false,
                  name: "刷新基本信息"
                },
                {
                  id: "refreshDiagnose",
                  iconOnly: false,
                  name: "刷新诊断"
                },
                {
                  id: "refreshHistory",
                  iconOnly: false,
                  name: "刷新既往史"
                },
                {
                  id: "highBloodFollowUp",
                  iconOnly: false,
                  name: "高血压随访"
                },
              ],
              [
                {
                  id: "printpreview",
                  iconOnly: false,
                  name: "打印预览"
                },
                {
                  id: "continueprint",
                  iconOnly: false,
                  name: "续打"
                },
                {
                  id: "print",
                  iconOnly: false,
                  name: "打印文档"
                },
                {
                  id: "getAllContent",
                  iconOnly: false,
                  name: "查看文书内容"
                }
              ],
              [
                {
                  iconOnly: true,
                  id: "superscript",
                  name: "上标"
                },
                {
                  iconOnly: true,
                  id: "subscript",
                  name: "下标"
                }
              ]
            ]
          }
        ]
      },
      editorConfigs1: {
        editorModel: "edit",
        defaultModel: "edit",
        initialFrameHeight: "",
        showTabBar: false,
        saveTemplMethod: this.saveTemp,
        submitMethod: this.submit, // 提交病历方法
        recallMethod: this.recall,
        printMethod: this.print,
        getAllContentMethod: this.getAllContent,
        //菜单配置，全菜单可参考axeditor.config.js中的配置
        tabToolbars: [
          {
            id: "edit",
            name: "编辑",
            widgets: [
              [
                {
                  id: "save",
                  iconOnly: false,
                  name: "暂存"
                },
                {
                  id: "submit",
                  iconOnly: false,
                  name: "提交"
                },
                {
                  id: "recall",
                  iconOnly: false,
                  name: "撤回"
                },
                {
                  id: "savetempl",
                  iconOnly: false,
                  name: "另存为模板"
                }
              ],
              [
                {
                  id: "printpreview",
                  iconOnly: false,
                  name: "打印预览"
                },
                {
                  id: "print",
                  iconOnly: false,
                  name: "打印文档"
                },
                {
                  id: "getAllContent",
                  iconOnly: false,
                  name: "查看文书内容"
                }
              ]
            ]
          }
        ]
      },
      editorConfigsShow: {
        editorModel: "dirty",
        defaultModel: "preview",
        initialFrameHeight: "750",
        showTabBar: false,
        tabToolbars: []
      },
      insInfo: {},
      insNum: "",
      dialogVisible: false,
      editor: {},
      defaultMsg: "",
      mrHomepage: false,
      scaleVal: 1,
      hpHeight: 2700,
      saveTempDialog: false,
      signArr: [],
      isDoneRquest: false,
      isSaveDoneRequest: false,
      diagRefreshF: "0", // 诊断刷新标识 0-不刷新 1- 第一次刷新 2-永久刷新
      orRefreshF: "0", // 处方刷新标识 0-不刷新 1- 第一次刷新 2-永久刷新
      BaseInfoRefreshF: "0", // 宏元素刷新标识 0-不刷新 1- 第一次刷新 2-永久刷新
      signList: ["02", "03", "04"], // 审签文书等级
      isSignApply: false, // 支持病历维护申请接入渲染逻辑
      editorType: "01", // 记录文书编辑器类型
      outpatientTimeliness: "N", // 就诊时效控制 N-无时效控制,Y-当天有效, 其他值为具体时长(单位:小时)
      regBPAge: 35, // 高血压年龄限制
      mrAutoTempSaveIntervalTime: 0, // 文书自动暂存时间限制， 以分钟为单位
      disableTimeControl: true,
      medicalDiagSkip: "0", // 病历诊断跳转
      medicalPrescriptionSkip: "0", // 病历处方跳转
      isFirstVisit: false, // 是否是第一次就诊
      diagnosticList: null, // 记录文书模板中存储的诊断
      newDiagnoseList: [], // 记录文书模板新增的诊断列表
      diagnoseOprate: "", // 记录底部诊断列表操作
      editorCreateType: "", // 文书创建模式  既往文书 复制 还是新建
      orderShowStyle: "1", // 控制文书 处方/医嘱在文书中展示的样式，1：表格，2-文本
      classValMsg: "",
      initRecordFlag: false, // 判断文书是否渲染完毕
      historyEmrContent: '',
      historyDocData: null,
      emrContentVisible: false,
      emrContent: '',
      oridinaryEmrInfo: {}, // 普通门诊病历的文书内容
      currenrtNode: null,
      emrResult: null,
    };
  },
  created() {
    const query = this.$route.query;
    if (query.enId && query.mrTpCd) {
      this.dialogVisible = true;
      this.classValMsg = query.mrTpCd;
    }

    // 获取是否刷新诊断标识和处方刷新标识
    // diagRefreshF（诊断刷新标识）、orRefreshF（处方刷新标识） BaseInfoRefreshF(宏元素刷新标识)
    getParamsByKey({
      key: [
        "regBPAge",
        "orderShowStyle",
        "diagRefreshF",
        "orRefreshF",
        "BaseInfoRefreshF",
        "outpatientTimeliness",
        "medicalDiagSkip",
        "medicalPrescriptionSkip",
        "mrAutoTempSaveIntervalTime"
      ]
    })
      .then(resp => {
        let { code, data, msg } = resp;
        if (code === 1) {
          this.orderShowStyle = data.orderShowStyle;
          this.diagRefreshF = data.diagRefreshF;
          this.orRefreshF = data.orRefreshF;
          this.BaseInfoRefreshF = data.BaseInfoRefreshF;
          this.outpatientTimeliness = data.outpatientTimeliness;
          this.medicalDiagSkip = data.medicalDiagSkip;
          this.medicalPrescriptionSkip = data.medicalPrescriptionSkip;
          this.regBPAge = data.regBPAge;
          this.mrAutoTempSaveIntervalTime = data.mrAutoTempSaveIntervalTime;
        } else {
          this.$message.error(msg);
        }
      })
      .catch(error => {
        this.$message.error(error || "error");
      });
  },
  mounted() {
    let _this = this;
    //  监听 管理计划 添加方法
    this.$root.eventHub.$on("managePlanInsert", domStr => {
      // 新建或者维护状态文书可以插入
      if (
        this.insInfo.mrStaCd === "01" ||
        (this.insInfo.mrStaCd === "11" && this.insInfo.appReason !== "2")
      ) {
        console.log(_this.editor, " _this.editor");
        _this.editor.execCommand("insertappointparagraph", "PT_gljh", domStr);
      }
    });
    // 监听健康处方 添加 方法
    this.$root.eventHub.$on("insertRecordHander", domStr => {
      console.log(this.insInfo, "this.insInfo");

      if (this.insInfo.mrStaCd !== "01" && this.insInfo.mrStaCd !== "11") {
        console.log(_this.editor, " _this.editor");
        // this.editor.execCommand("insertappointparagraph", "PT_hzzqxz", domStr);
        _this.$message.warning("当前文书不是新建或维护状态，不能插入健康处方 ");
      } else {
        _this.editor.execCommand("insertfreetext", domStr);
      }
    });
    // 监听健康处方 删除 方法
    this.$root.eventHub.$on("deleteglHandler", id => {
      if (
        this.insInfo.mrStaCd === "01" ||
        (this.insInfo.mrStaCd === "11" && this.insInfo.appReason !== "2")
      ) {
        _this.editor.execCommand("deletegl", id);
      } else {
        _this.$message.warning("当前文书不是新建或维护状态，不能删除健康处方");
      }
    });

    setTimeout(() => {
      if (this.mode === "menzhen") {
        let dom = document.getElementById("emr-editor1");
        this.editorConfigs.initialFrameHeight = dom ? dom.offsetHeight : "";
      } else {
        let dom = document.getElementById("emr-editor2");
        this.editorConfigs.initialFrameHeight = dom ? dom.offsetHeight : "";
      }
      if (this.showMrHomepage) {
        this.scaleVal =
          (document.getElementById("emr-editor1").offsetWidth - 20) / 1142;
        this.hpHeight = this.scaleVal * 2700;
      }
    }, 1000);

    // 外接第三方链接跳转处理
    if (!this.interceptParams.enNo) {
      if (!this.patientId) {
        if (!showSelectPatientAlert) {
          setShowSelectPatientAlert(true);
        }
        return;
      }
      if (!showSelectPatientAlert) {
        setShowSelectPatientAlert(true);
      }
    }

    this.editor.setDisabled(true);
  },
  computed: {
    ...mapGetters("base", ["receivePatientData", "patientEmr"]),
    ...mapGetters("cis", ["diagnosis"]),
    ...mapGetters("user", ["name", "role", "interceptParams"]),
    ...mapGetters("homeSickbeds", {
      homeSickbedsPatient: "receivePatientData"
    }),
    modeTypeStr() {
      if (this.showMrHomepage) {
        return this.diagnosis.enTpCd;
      }
      return this.mode === "menzhen" ? "01" : "04";
    },
    modeNumCode() {
      if (this.showMrHomepage) {
        return this.diagnosis ? this.diagnosis.enNo : "";
      }
      // 家床类型 才传递 家床的患者号
      return this.mode === "zhuyuan" && this.isHome === "1"
        ? this.homeSickbedsPatient.treatNo
        : this.receivePatientData.visitCode;
    },
    // 病历维护申请页面控制撤回按钮
    recallFlag() {
      let path = this.$route.path;
      if (
        path === "/inMr/inRecordMaintenanceApply" ||
        path === "/outMr/outRecordMaintenanceApply"
      ) {
        return true;
      }
      return false;
    },
    // 判断点击tab
    tabOldName() {
      return this.tabName();
    },
    isHomeBed() {
      let flag = this.mode === "zhuyuan" && this.isHome === "1";
      return flag;
    },
    patientId() {
      let patientId = this.isHomeBed
        ? this.homeSickbedsPatient.patientId
        : this.receivePatientData.patientId || this.propsPatientId;
      return patientId;
    },
    isThirdWay() {
      let flag = this.initRecordFlag && this.isSignApply;
      return flag;
    }
  },
  watch: {
    homeSickbedsPatient: {
      immediate: true,
      deep: true,
      handler(n, o) {
        if (!this.isHomeBed) return;
        if (!n || Object.keys(n).length === 0) return;

        // 相同的患者同一次就诊不让在调用方法
        if (o && n.patientId === o.patientId && n.treatNo === o.treatNo) {
          return;
        }

        // 不同患者的 文书门诊诊断需要清空
        this.diagnosticList = null;
        this.newDiagnoseList = [];
        this.disableTimeControl = false;
        // 调用后台接口同步数据
        this.defaultMsg = "";
        putLocalEn(n.treatNo, { enTpCd: "04", isHome: "1" }).then(res => {
          const { code, data, msg } = res;
          if (code === 1) {
            // 更新数据
            this.isFirstVisit = res.data.first;
            this.init();
          } else {
            this.$message.error(msg);
          }
        });
      }
    },
    receivePatientData: {
      handler(n, o) {
        console.log('n=======', n)
        const oldPatientId = o.patientId
        if (this.isSignApply) return; // 第三方渲染 不走这个逻辑
        if (this.isHomeBed) return;
        if (!n.visitCode) {
          this.diagnoseOprate = '';
          this.editor.setContent('');
          this.editor.execCommand("setmodel", {
            modelType: "pure",
            showToolbar: false
          });
          return;
        }
        // 处理是否超过文书时限
        this.disableTimeControl = this.handlerVisitTimeControl(
          this.outpatientTimeliness
        );

        if (!n.patientId) return;

        if (Object.keys(n).length === 0 && Object.keys(o).length === 0) {
          return;
        }

        // 相同的患者同一次就诊不让在调用方法
        if (o && n.patientId === o.patientId && n.visitCode === o.visitCode) {
          return;
        }

        // 不同患者的 文书门诊诊断需要清空
        this.diagnosticList = null;
        this.newDiagnoseList = [];
        // this.defaultMsg = "";
        // 调用后台 同步云医院数据到电子病历系统
        putLocalEn(n.visitCode, { enTpCd: "01", isHome: "0" })
          .then(res => {
            if (res.code === 1) {
              // 更新数据
              this.isFirstVisit = res.data.first;
              if (o.visitCode && this.insInfo.mrId && this.insNum > 0 && this.insInfo.mrStaCd !== "02") {
                const $div = $('<div style="position:fixed;left:0; right:0; top:0; bottom: 0;z-index: 100000000" id="body-modal"></div>')
                $('body').append($div)
                const editorContent = this.editor.getContent()
                this.save(editorContent, "02", 'N', oldPatientId)
                .then(res => {
                  this.init();
                }).catch(err => {
                  this.init();
                })
              } else {
                this.init()
              }
              // this.init();


            } else {
              this.$message.error(res.msg || "同步数据失败1");
            }
          })
          .catch(error => {
            console.log(error, "error111");
            this.$message.error(error || "同步数据失败");
          });
      },
      deep: true,
      immediate: true
    },
    isThirdWay(val) {
      if (val) {
        if (this.mrIdProp) {
          this.handlerUpdate({ mrId: this.mrIdProp });
        }
      }
    },
    "editor.options.editorModel": {
      handler(n) {
        if (n == "mark") {
          getMarks({ editor: this.editor, mrId: this.insInfo.mrId });
        } else {
          this.editor.execCommand("resetmarktitle");
        }
      },
      deep: true
    },
    interceptParams: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.enNo) {
          this.getPatientInfo(val);
        }
      }
    },
    diagnosis: {
      deep: true,
      handler(n, o) {
        if (n && n.enNo && o && o.enNo && n.enNo == o.enNo) {
          return;
        }
        if (n && n.enNo) {
          this.$nextTick(() => {
            if (!this.isSignApply) {
              this.init();
            }
          });
        }
      }
    },
    // 监听外接跳转
    patientEmr: {
      handler(value) {
        if (value.hasOwnProperty("patientId")) {
          // 设置当前患者
          console.log("-----------监听外接跳转", value);
          this.getPatientInfo({ enNo: value.enId });
          // 展示文书
        }
      },
      deep: true,
      immediate: true
    },
    tabOldName: {
      handler(val, oldValue) {
        if (oldValue === "diagnosis" && val === "record") {
          // 刷入基本信息
          this.judgeisRefreshMacros(this.insInfo.mrStaCd);
          // 诊断相关处理逻辑
          this.judgeDiagnoseisRefresh(this.insInfo.mrStaCd);
        } else if (oldValue === "order" && val === "record") {
          // 处方相关逻辑处理
          this.judgePrescriptionisRefresh(this.insInfo.mrStaCd);
        }
      },
      immediate: true
    },
    insInfo: {
      handler(val) {
        if (val) {
          this.$emit("recordDataHandler", val);
        }
      }
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      changePatientEmrData: "base/changePatientEmrData",
      setRecallRecord: "cis/setRecallRecord",
      setMainComplaint: "cdss/setMainComplaint",
      setHisPresent: "cdss/setHisPresent"
    }),

    getAllContent() {
      console.log(11111)
      this.emrContent = this.editor.getContent()
      this.emrContentVisible = true

    },

    // 文书自动保存
    keepRecordHandler(func, w, t) {
      var interv = function() {
        if (typeof t === "undefined" || t > 0) {
          setTimeout(interv, w);
          try {
            func.call(null);
          } catch (e) {
            t = 0;
            throw e.toString();
          }
        }
      };
      setTimeout(interv, w);
    },
    // 获取第三方患者的既往史
    getThirdHistory(type, idNum) {
      // 非新建和维护状态的文书 不能更新既往史
      if (this.insInfo.mrStaCd !== "01" && this.insInfo.mrStaCd !== "11") {
        return;
      }

      let params = {
        identificationType: type || this.receivePatientData.identificationType,
        identificationNum: idNum || this.receivePatientData.identificationNum
      };

      getListHistory(params)
        .then(res => {
          let { code = "", data = [] } = res;
          if (code === "SUCCESS" && data.length) {
            this.editor.execCommand("insertthirdpasthistory", data);
            this.$message.success("刷新既往史成功");
          }
        })
        .catch(error => {
          this.$message.error(
            JSON.stringify(error) || "获取患者既往史失败，请联系管理员"
          );
        });
    },
    // 调用改变本地变量
    changeLocalVairlHandler(flag) {
      this.isSignApply = flag;
    },
    // 获取文书存储的诊断
    getDiagnoseInfo() {
      // 获取病历维护中的诊断信息
      if (this.editor) {
        return this.editor.execCommand("getdiagnoseinfo");
      } else {
        return [];
      }
    },
    // 35岁患者 首次就诊必须填写血压
    judgeWriteBloodPressure() {
      if (!this.patientId) return false;
      let age = "";
      if (this.isHomeBed) {
        age = this.homeSickbedsPatient.age;
      } else {
        age = this.receivePatientData.patientAge;
      }

      let flag =
        this.isFirstVisit &&
        age.includes("岁") &&
        parseFloat(age) >= parseFloat(this.regBPAge);
      return flag;
    },
    handlerMessageBloodPressure() {
      let bloodPressureFlag = this.judgeWriteBloodPressure();
      if (bloodPressureFlag && this.insInfo.mrStaCd === "01") {
        this.$message.warning("请为该患者录入血压数据！");
      }
    },
    // 没有患者的时候获取 默认模板展示
    getDefaultTempRender() {
      let params = {
        visitType: this.modeTypeStr,
        dnFlag: this.dnFlag,
        level0: "0"
      };
      getDefaultTempNOPatient(params)
        .then(res => {
          let { code, data, msg } = res;
          if (code === 1) {
            this.defaultMsg = data.content || "";
          } else {
            this.$message.error(msg || "获取默认模板失败");
          }
        })
        .catch(error => {
          this.$message.error(error || "获取默认模板失败");
        });
    },
    clickElementAddEventer(type) {
      this.$emit("closeDiagnoseHandler");
      if (
        this.insInfo.mrStaCd === "01" ||
        (this.insInfo.mrStaCd === "11" && this.insInfo.appReason !== "2")
      ) {
        switch (type) {
          // 诊断元素 新建文书调用外部诊断录入弹窗
          case "diagnose":
            this.$emit("openDiagnoseHandler");
            break;
          case "PT_cbzd": // 诊断元素的 段落名称
            this.$emit("openDiagnoseHandler");
            break;
          case "prescription":
            // 先暂存 暂存成功后跳转到 电子处方页面
            const content = this.editor.getContent();
            this.save(content, "02")
              .then(res => {
                if (res) {
                  // 跳转到电子处方
                  this.$emit("jumpElePrescription");
                }
              })
              .catch(error => {
                this.$message.error(error || "文书暂存失败");
              });
            break;
          default:
            break;
        }
      }
    },
    // 控制就诊时限处理
    handlerVisitTimeControl(visitTime) {
      if (this.patientId) {
        if (this.outpatientTimeliness === "N") {
          return false;
        }
        if (this.receivePatientData.appointmentTime) {
          let newDate = this.dayjs().unix(); // 获取当前时间
          let appointmentTime = this.dayjs(
            this.receivePatientData.appointmentTime
          ).unix(); // 就诊时间

          // 当天有效
          if (this.outpatientTimeliness === "Y") {
            let isToday = this.dayjs(
              this.receivePatientData.appointmentTime
            ).isToday();

            return !isToday;
          } else {
            // 单位 小时
            let time = (newDate - appointmentTime) / 3600; // 时间差距
            return time > Number(this.outpatientTimeliness);
          }
        }
        return false;
      }
      return true;
    },
    // 获取文书的 段落信息
    getEditorParagrapheleContent(list) {
      if (!this.editor) {
        this.$message.error("请选择文书后操作");
        return;
      }
      return this.editor.execCommand("getparagraphelecontent", list, true);
    },
    getPatientInfo(interceptParams) {
      let params = {
        enNo: interceptParams.enNo,
        hosId: interceptParams.hosId,
        orgId: interceptParams.orgId,
        isHome: this.isHome
      };

      getPatientInfoByEnNo(params)
        .then(res => {
          if (res.code === 1) {
            let patientInfo = {
              patientId: res.data.paId,
              patientName: res.data.nm,
              visitCode: res.data.visitingNumber,
              visitingTime: res.data.visitingTime,
              triageStatus: res.data.triageStatus,
              patientGender: res.data.sexCd,
              patientAge: res.data.age,
              ...res.data
            };
            this.changeRecPatientData(patientInfo);
            return;
          }

          this.$message.warning("获取患者信息失败，请手动选择患者");
        })
        .catch(error => {
          this.$message.warning("获取患者信息失败，请手动选择患者");
        });
    },
    clickSignature(data) {
      let signLevel = this.checkSignLevelObj[data] || "";

      let index = this.signArr.findIndex(item => {
        return item.signLevel === signLevel;
      });

      if (index === -1 && signLevel !== "01") {
        this.signArr.push({ signLevel: signLevel });
      }

      this.checkSignLevelStr = data;

      // 配置通过
      if (identityConfirm) {
        this.dialogFormVisible = true;
      }
    },
    // 重置数据
    resetData() {
      this.dialogFormVisible = false;
      this.ruleForm.name = "";
      this.ruleForm.passWord = "";
    },
    signModeConfirm(name, level, userId) {
      console.log(name, level);
      // 文字签名
      if (signConfig.mode == "sign") {
        // 调用编辑器方法
        this.editor.execCommand("insertsignature", name, level, userId);
      } else if (signConfig.mode == "ca") {
        // 调用签章 获取签章图片
        let url = SZCA_PdfSign_GetSealImage();
        // 添加签章方法
        this.editor.execCommand(
          "insertimgsign",
          `data:image/jpg;base64,${url}`,
          name
        );

        // 删除签章方法
        // this.editor.execCommand("delimgsign", 'oneLevel');
      }
    },
    // 验证审签等级
    checkSignLevel(formName) {
      let signLevel = this.checkSignLevelObj[this.checkSignLevelStr] || "";
      let data = {
        signLevel,
        userName: this.ruleForm.name,
        password: this.ruleForm.passWord
      };

      this.$refs[formName].validate(valid => {
        if (valid) {
          checkSign(data, true)
            .then(res => {
              if (res.code === 1) {
                this.dialogFormVisible = false;
                let { name, userId } = res.data;

                let index = this.signArr.findIndex(item => {
                  return item.signLevel === signLevel;
                });

                if (index > -1 && signLevel !== "01") {
                  this.signArr[index].userId = userId;
                  this.signArr[index].signLevel = signLevel;
                }

                this.signModeConfirm(name, this.checkSignLevelStr, userId);
              } else {
                this.$message.warning(res.msg || "该用户没有审签权限");
              }
            })
            .catch(error => {
              console.log(error);
              this.$message.error(error.msg || "审签权限接口报错");
            })
            .finally(() => {
              this.ruleForm.name = "";
              this.ruleForm.passWord = "";
            });
        } else {
          return false;
        }
      });
    },
    clearSignLevel(formName) {
      let signLevel = this.checkSignLevelObj[this.checkSignLevelStr] || "";
      let data = {
        mrId: this.insInfo.mrId,
        signLevel,
        userName: this.ruleForm.name,
        password: this.ruleForm.passWord
      };

      this.$refs[formName].validate(valid => {
        if (valid) {
          signDelTempSign(data, true)
            .then(res => {
              if (res.code === 1) {
                this.dialogFormVisible = false;

                this.signArr = this.signArr.filter(item => {
                  return (
                    Number.parseFloat(item.signLevel) <
                    Number.parseFloat(signLevel)
                  );
                });

                this.editor.execCommand("clearsign", this.checkSignLevelStr);
                this.$message.success("删除成功");
              } else {
                this.$message.warning(res.msg || "该用户没有审签权限");
              }
            })
            .catch(error => {
              console.log(error);
              this.$message.error(error.msg || "审签权限接口报错");
            })
            .finally(() => {
              this.ruleForm.name = "";
              this.ruleForm.passWord = "";
            });
        } else {
          return false;
        }
      });
    },
    // 工具箱插入诊断信息，可编辑
    insertDiagnoses(val) {
      insertDiagnose(this.editor, val);
    },
    // 工具箱插入医嘱信息,普通样式可编辑
    insertPreviousFunc(data) {
      insertPrescription(this.editor, data);
    },
    // 工具箱插入诊断信息
    insertHistorical(val) {
      showDiagnoseInfo(this.editor, val);
    },
    // 工具箱插入医嘱信息
    insertPrevious(val) {
      showPrescriptionInfo(this.editor, val, this.orderShowStyle);
    },
    insertinspection(val) {
      val.data.isSecret = false;
      this.editor.execCommand(
        "insertinspection",
        val.multipleSelection,
        val.data
      );
    },
    insertCheckRes(val) {
      val.isSecret = false;
      this.editor.execCommand("insertcheckres", val);
    },
    openTree() {
      this.showMrHomepageCon = true;
    },
    handleCloseTree() {
      this.showMrHomepageCon = false;
    },
    saveTemp() {
      this.saveTempDialog = true;
      attributeQuery({ mrId: this.insInfo.mrId })
        .then(res => {
          if (res.code == 1) {
            getByCode(res.data.mrTplCd)
              .then(res1 => {
                if (res1.code == 1) {
                  let seqNo = "";
                  getNextSeq().then(res => {
                    if (res.code === 1) {
                      seqNo = res.data;
                      this.$refs.createTemp.templatePO = res1.data;
                      
                      const currentNodeData = this.$refs.insTree.$refs.docTree.getCurrentNode()
                      const templateName = currentNodeData.text.split('_')[0]

                      this.$refs.createTemp.templatePO.templateId = "";
                      this.$refs.createTemp.templatePO.templateStatus = "1";
                      this.$refs.createTemp.templatePO.scopeLevel = "2";
                      this.$refs.createTemp.templatePO.templateName = templateName;
                      let code = this.$refs.createTemp.templatePO.templateCode;
                      setTimeout(() => {
                        this.$refs.createTemp.templatePO.templateCode =
                          code.replace(this.$refs.createTemp.prefix, "") +
                          "_" +
                          seqNo;
                      }, 500);
                      this.$refs.createTemp.templatePO.isDefault = "0";
                      this.$refs.createTemp.templatePO.templateVersion = "0";
                      this.$refs.createTemp.templatePO.dataVersion = "";
                      this.$refs.createTemp.changeOwner();
                      this.$refs.createTemp.initFirstVisit();
                    } else {
                      this.$message.error("获取模板流水号失败！");
                    }
                  });
                }
              })
              .catch(error => {
                this.$message.error(error.msg);
              });
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    handlerFullScreen(data) {
      console.log("点击全屏了");
      this.$emit("fullScreen", data);
    },
    handleDetermine1() {
      if (
        this.$refs.createTemp.templatePO.templateCode === "" ||
        !this.$refs.createTemp.templatePO.templateCode
      ) {
        this.$message.error("文书编码不可为空！");
        return;
      }

      if (
        this.$refs.createTemp.templatePO.templateName === "" ||
        !this.$refs.createTemp.templatePO.templateName
      ) {
        this.$message.error("文书名称不可为空！");
        return;
      }
      if (
        this.$refs.createTemp.templatePO.typeCode === "" ||
        !this.$refs.createTemp.templatePO.typeCode
      ) {
        this.$message.error("文书类型不可为空！");
        return;
      }

      delete this.$refs.createTemp.templatePO.templateId;
      delete this.$refs.createTemp.templatePO.mongoId;
      let $templatePO = this.$refs.createTemp.templatePO;
      let code = $templatePO.templateCode;
      $templatePO.templateCode = this.$refs.createTemp.prefix + code;

      let params = {
        template: { ...this.$refs.createTemp.mergerData() },
        templateContent: {
          content: this.editor.execCommand("gettemplcontent")
        }
      };
      this.saveTempDialog = false;
      saveAs(params)
        .then(res => {
          if (res.code == 1) {
            this.$emit("refreshTemplate");
            this.$message.success("保存成功!");
          } else {
            this.$message.warning(res.msg);
          }
        })
        .catch(error => {
          this.$message.error(error.msg);
        });
    },
    clearEdtiorInfo() {
      let div = document.createElement("div");
      div.innerHTML = this.editor.getContent();
      let macroDom = div.querySelectorAll(".macro-ctrl");
      macroDom.forEach(dom => {
        dom.querySelector(".ctrl-value").innerHTML = "";
      });

      let signatureDom = div.querySelectorAll(".signature");
      signatureDom.forEach(dom => {
        dom.querySelector(".ctrl-value").innerHTML = "";
      });

      let diagnoseDom = div.querySelectorAll(".diagnose");
      diagnoseDom.forEach(dom => {
        dom.querySelector(".ctrl-value").innerHTML = "";
      });

      let prescriptionDom = div.querySelectorAll(".prescription");
      prescriptionDom.forEach(dom => {
        dom.querySelector(".ctrl-value").innerHTML = "";
      });

      return div.innerHTML;
    },
    updatePrintNo(obj) {
      this.mrinfoObj.dataVersion = obj.dataVersion;
      this.updateInsInfo({
        mrId: obj.mrId
      });
    },
    // 打印
    print() {
      if (this.insInfo.mrStaCd === "01") {
        this.submit().then(res => {
          if (res) {
            this.editor.execCommand("doprint");
            this.$root.eventHub.$emit("top-list-change");
          }
        });
      } else {
        this.editor.execCommand("doprint");
        this.$root.eventHub.$emit("top-list-change");
      }
    },
    // 打印预览
    async printPreview() {
      if (this.insInfo.mrStaCd === "01") {
        this.submit().then(async res => {
          if (res) {
            // let flag = await this.$refs.axEditor.updatePrintResult(1);
            // if (flag) {
            //   this.editor.execCommand("printpreview1");
            // }

            this.editor.execCommand("printpreview1");
          }
        });
      } else {
        this.editor.execCommand("printpreview1");
        // let flag = await this.$refs.axEditor.updatePrintResult(1);
        // if (flag) {
        //   this.editor.execCommand("printpreview1");
        // }
      }
    },
    codeTransform(code, val) {
      let param = [
        {
          field: "name",
          code: code,
          val: val
        }
      ];
      return transformCode(param).then(res => {
        if (res.code == 1) {
          return res.data[code];
        }
        return "";
      });
    },
    async createByToolbox(data) {
      if (!this.patientId) {
        this.$message.warning("请选择患者！");
        return;
      }

      const flag = await this.$refs.insTree.judgeCallVisitInteFace();
      if (!flag) {
        return;
      }

      let params = { ...data, createType: "create" };

      this.checkMrReplaceableAndCreate(params);
    },
    async reacordModelAndToolsStatusHandler() {
      try {
        // 处理文书浏览模式 和 工具栏按钮状态
        let { data } = await checkMrCreatedBy({
          mrId: this.insInfo.mrId,
          createdBy: getUserId()
        });

        const editorRecordFlag = this.handlerVisitTimeControl(
          this.outpatientTimeliness
        );

        // 超出时间限制的文书 设置不可以 操作
        if (editorRecordFlag) {
          this.editor.execCommand("setmodel", {
            modelType: "pure",
            diabledBtns: ["recall"],
            showToolbar: true
          });
          return;
        }
        let result = await this.isRecallHandler();
        // debugger
        if (data === "true") {
          if (this.insInfo.mrStaCd === "01") {
            this.editor.execCommand("setmodel", {
              modelType: "edit",
              showToolbar: true
            });
            // 维护模式
          } else if (this.insInfo.mrStaCd === "11") {
            if (this.insInfo.appReason !== "2") {
              this.editor.execCommand("setmodel", {
                modelType: "mark",
                diabledBtns: ["recall"],
                showToolbar: true
              });
            } else {
              this.editor.execCommand("setmodel", {
                modelType: "pure",
                diabledBtns: ["recall"],
                showToolbar: true
              });
            }
          } else {
            if (result.success === true) {
              this.editor.execCommand("setmodel", {
                modelType: "pure",
                showToolbar: true
              });
            } else {
              this.editor.execCommand("setmodel", {
                modelType: "pure",
                diabledBtns: ["recall"],
                showToolbar: true
              });
            }
          }
        } else {
          if (result.success === true) {
            if (this.insInfo.mrStaCd === "01") {
              this.editor.execCommand("setmodel", {
                modelType: "edit",
                showToolbar: true
              });
            } else if (this.insInfo.mrStaCd === "11") {
              this.editor.execCommand("setmodel", {
                modelType: "pure",
                diabledBtns: ["recall"],
                showToolbar: true
              });
            } else {
              this.editor.execCommand("setmodel", {
                modelType: "pure",
                showToolbar: true
              });
            }
          } else {
            if (this.editor.options.editorModel === "pure") {
              //两次 文书 pure模式 对维护的文书的留痕部分不会处理 需要重置下
              this.editor.options.editorModel = "edit";
              // 隐藏工具栏
              // this.editor.execCommand("hidetools");
              // return;
            }
            this.editor.execCommand("setmodel", {
              modelType: "pure",
              showToolbar: false
            });
          }
        }
      } catch (error) {
        console.log(error);
        this.$message.error(error);
      } finally {
        this.changePatientEmrData({});
      }
    },
    init() {
      this.insNum = 0;
      this.signArr = [];

      if (!this.patientId) {
        this.editor.execCommand("setmodel", {
          modelType: "preview",
          noViewMenu: true
        });

        return;
      }
      if (this.showMrHomepage) {
        this.editor.execCommand("setmodel", {
          modelType: "pure",
          showToolbar: false
          // noViewMenu: true
        });
      }

      // 判断是否是跳转过来的
      if (this.patientEmr.hasOwnProperty("patientId")) {
        this.$refs.insTree.handleNodeClick({
          exts: {
            mrId: this.patientEmr.mrId,
            mrStaCd: this.patientEmr.mrStaCd
          }
        });
        return;
      }

      let data = {
        patientId: this.patientId,
        enId: this.modeNumCode,
        isHome: this.isHome,
        visitType: this.modeTypeStr
      };
      this.$refs.insTree && this.$refs.insTree.clearTree()
      // 现获取文书树中的列表数据
      getTree(data, false).then(res => {
        if (res.code == 1) {
          res.data.forEach(item => {
            this.countIns(item);
          });

          if (this.insNum === 0) {
            // 住院、集成病历 情况下不会默认加载模板
            if (this.mode === "zhuyuan" || this.showMrHomepage) {
              // 更新左侧文书树 清空上一个患者的病例树
              this.$refs.insTree && this.$refs.insTree.initTree(data.mrId);
              $('#body-modal') && $('#body-modal').remove()
              return;
            }
            // // 获取可用的模板列表
            // getDefaultTemp({ enNo: this.modeNumCode })
            //   .then(res => {
            //     let resData = res.data;
            //     if (res.code === 1) {
            //       let param = {
            //         bizTime: new Date(),
            //         enCnt: 0,
            //         enId: this.modeNumCode,
            //         enStaCd: "01",
            //         enTpCd: this.modeTypeStr,
            //         mrAmrGroupId: "",
            //         mrId: "",
            //         mrMainId: "",
            //         mrTpCd: resData.typeCode,
            //         mrTplCd: resData.templateCode,
            //         nm: resData.templateName,
            //         pastEnId: "",
            //         pastMrF: "0",
            //         pastMrId: "",
            //         patientId: this.patientId,
            //         signLvlCd: resData.signLevel,
            //         supDctId: "",
            //         templateVersion: resData.templateVersion
            //       };

            //       save(param, false)
            //         .then(resp => {
            //           let { code, data, msg } = resp;
            //           if (code == 1) {
            //             data.isNew = true;
            //             this.editorCreateType = "create";
            //             this.handlerUpdate(data);
            //             this.handlerMessageBloodPressure();
            //             this.insNum++;
            //           } else {
            //             this.$message.error(msg || "创建失败!");
            //             if (code === 60301) {
            //               this.defaultMsg = "";
            //               this.$refs.insTree.tree = [];
            //             }
            //           }
            //         })
            //         .catch(error => {
            //           this.$message.error(error.msg || "创建失败");
            //         });
            //     } else if (res.code === 60201) {
            //       this.$message.warning("不是门诊类型不提供默认模板查询");
            //     } else if (res.code === 60202) {
            //       this.$message.warning("没有找到默认模板，请选择手动选择模板");
            //       // 打开新建弹窗
            //       this.$refs.insTree &&
            //         (this.$refs.insTree.dialogVisible = true);
            //     } else {
            //       this.$message.warning(res.msg || "查找默认模板失败");

            //       return;
            //     }
            //   })
            //   .catch(error => {
            //     this.$message.error(error.msg || "获取默认模板错误");
            //   });

            // 跳转 到第一个tab

            this.$root.eventHub.$emit("jump-template-change", "first");
            this.editor.setContent('')
            this.editor.execCommand("setmodel", {
              modelType: "pure",
              showToolbar: false
            });
            $('#body-modal') && $('#body-modal').remove()
            // this.getDefaultTempRender();
            // setTimeout(() => {
            //   this.editor.execCommand("setmodel", {
            //     modelType: "pure",
            //     showToolbar: false
            //   });
            // }, 2000)
          } else if (this.insNum >= 1) {
            let param = {
              mrId: res.data[0].exts.mrName
                ? res.data[0].exts.mrId
                : res.data[0].children[0].exts.mrId
            };
            // this.defaultMsg = "";
            contentQuery(param)
              // eslint-disable-next-line complexity
              .then(res => {
                if (res.code == 1) {

                  // this.defaultMsg = res.data.docMongoContent || "";
                  this.editor.setContent(res.data.docMongoContent || "");

                  // cdss主诉解析
                  const zsContent = this.editor.execCommand('getzscontent');
                  this.setMainComplaint(zsContent);

                  // cdss现病史解析
                  const xbsContent = this.editor.execCommand('getxbscontent');
                  this.setHisPresent(xbsContent);

                  $('#body-modal') && $('#body-modal').remove()

                  this.insInfo = res.data;
                  // 更新文书树中的文书状态

                  this.$refs.insTree &&
                    this.$refs.insTree.initTree(this.insInfo.mrId);

                  this.editorType = res.data.editor || "01";

                  this.mrinfoObj.mrId = res.data.mrId;
                  this.mrinfoObj.dataVersion = res.data.mrDataVersion;
                  this.mrinfoObj.printNo = res.data.printNo;

                  this.editorCreateType = "";

                  this.handlerMessageBloodPressure();

                  // 更新结构树
                  this.$emit("refreshStrureTree");
                  // 处理病历文书模式和工具栏按钮状态
                  if (!this.showMrHomepage) {
                    this.reacordModelAndToolsStatusHandler();
                  }
                  // setTimeout(() => {
                    // if (
                    //   this.receivePatientData.identificationType &&
                    //   this.receivePatientData.identificationNum
                    // ) {
                    //   this.getThirdHistory(
                    //     this.receivePatientData.identificationType,
                    //     this.receivePatientData.identificationNum
                    //   );
                    // }
                    this.judgeisRefreshMacros(res.data.mrStaCd);
                    this.judgeRefreshDiagAndF(res.data.mrStaCd);
                    this.autoSignlabel(res.data.mrStaCd);
                    this.setFiveServiceCardInfo();
                    this.insertSelfOrders()
                  // }, 500);
                } else {
                  this.$message.error("查询失败!");
                  $('#body-modal') && $('#body-modal').remove()
                }
              })
              .catch(res => {
                this.$message.error(res.msg);
                $('#body-modal') && $('#body-modal').remove()
              });
          }
        } else {
          $('#body-modal') && $('#body-modal').remove()
        }
      }).catch(err => {
        $('#body-modal') && $('#body-modal').remove()
      });
    },
    countIns(data) {
      // 递归 有文书的 this.insNum递增
      if (data.exts.mrName) {
        this.insNum++;
      }
      if (data.children) {
        data.children.forEach(item => {
          this.countIns(item);
        });
      }
    },
    //更新insInfo  针对于dataVersion
    async updateInsInfo(param) {
      try {
        let { code, data, msg } = await contentQuery(param);
        if (code == 1) {
          this.insInfo = data;

          this.mrinfoObj.mrId = data.mrId;
          this.mrinfoObj.dataVersion = data.mrDataVersion;
          this.mrinfoObj.printNo = data.printNo;

          this.editorType = data.editor || "01";

          // 更新结构树
          this.$emit("refreshStrureTree");
          // 更新文书状态
          await this.reacordModelAndToolsStatusHandler();

          // 判断是否可以撤销 更新撤销按钮状态
          this.isRecallHandler()
            .then(result => {
              // if (data.mrStaCd !== "01" && data.mrStaCd !== "11") {
              //   if (res.data.appReason == "1" && res.data.mrStaCd === "2") {
              //     if (result.success === true) {
              //       this.editor.execCommand("setmodel", {
              //         modelType: "dirty",
              //         showToolbar: true
              //       });
              //     } else {
              //       this.editor.execCommand("setmodel", {
              //         modelType: "dirty",
              //         diabledBtns: ["recall"],
              //         showToolbar: true
              //       });
              //     }
              //   } else {
              //     if (result.success === true) {
              //       this.editor.execCommand("setmodel", {
              //         modelType: "pure",
              //         showToolbar: true
              //       });
              //     } else {
              //       this.editor.execCommand("setmodel", {
              //         modelType: "pure",
              //         diabledBtns: ["recall"],
              //         showToolbar: true
              //       });
              //     }
              //   }
              // }
              // if (this.insNum === 0) {
              //     this.editor.execCommand("setmodel", {
              //       modelType: "pure",
              //       showToolbar: false
              //     });
              //   }
            })
            .catch(error => {
              this.$message.error(error);
            });
          return true;
        } else {
          this.$message.error(msg || "查询失败!");
          return false;
        }
      } catch (error) {
        this.$message.error(error.msg);
        return false;
      } finally {
        // 放开文书相关操作
        this.disableTimeControl = false;
      }
    },
    // 获取用户审签等级
    async getSignConfig() {
      let data = {
        userId: getUId(),
        deptId: this.role.deptId,
        roleId: this.role.roleId
      };
      return await signAuthGetConfig(data);
    },
    async textSignLogin() {
      let auditType;
      // 获取当前用户审签权限
      try {
        let resData = await this.getSignConfig();
        if (resData.code === 1) {
          auditType = resData.data.auditType;
          return auditType;
        } else {
          this.$message.error(resData.msg || "获取审签权限失败");
          return false;
        }
      } catch (error) {
        return false;
      }

      let allSignArr = this.editor.execCommand("checksign");

      let signLabel = "";
      let isEmpty; // on 为 必填
      let signValue = "";
      let index = -1;

      // 无签名元素的时候 直接退出判断
      if (allSignArr.length === 0) {
        return true;
      }

      allSignArr.forEach(item => {
        if (item.type === "normal") {
          signLabel = item.type;
          signValue = item.value;
          isEmpty = item.isEmpty;
        } else if (item.value !== "") {
          index++;
        }
      });

      let normalSign = signLabel !== "" && isEmpty === "" && signValue === "";
      // 拦截 无审签元素 需要签名但未签名 逻辑
      if (normalSign) {
        this.$message.warning("请完成署名");
        return false;
      } else if (signLabel === "") {
        // 拦截 有审签等级元素未签名逻辑
        if (index === -1) {
          // 审签签名判断
          this.$message.warning("请完成签名");
          return false;
        }
      }

      return true;
    },
    // 判断诊断元素是否有内容
    diagnoseContentHandler(mrStaCd) {
      let diagnoseFlag = this.judgePrescriptionOrDiagnoseHas("diagnose");
      // 存在诊断元素 且 为 新建文书的情况下
      if (diagnoseFlag && mrStaCd === "01") {
        //
        // 诊断元素没有内容
        if (!this.editor.execCommand("checkcontent", "diagnose")) {
          return false;
        } else {
          return true;
        }
      }
      return true;
    },
    // 提交按钮的方法
    async submit() {
      // 35岁 首次 就诊  血压必须填写
      let bloodPressureFlag = this.judgeWriteBloodPressure();
      let bloodPressureIsEmpty = this.editor.execCommand("checknotempty");
      if (bloodPressureFlag && !bloodPressureIsEmpty) {
        this.$message.warning("请为该患者录入血压数据！");
        return false;
      }

      // 未添加诊断的不能提交
      let diagnoseContentFlag = this.diagnoseContentHandler(
        this.insInfo.mrStaCd
      );
      if (!diagnoseContentFlag) {
        this.$message.warning("需要完成诊断内容填写！");
        return false;
      }
      let textSignLoginFlag = await this.textSignLogin();
      // 文字签名的逻辑
      if (signConfig.mode === "sign" && !textSignLoginFlag) {
        return false;
      }

      let content = this.editor.getContent();

      // 添加防重复点击功能
      if (this.isDoneRquest) {
        return false;
      }
      this.isDoneRquest = true;

      try {
        let flag = await this.save(content, "03");
        let param = {
          dataVersion: this.insInfo.mrDataVersion,
          mrId: this.insInfo.mrId,
          mrStaCd: "02",
          submitCd: getUId(),
          submitDate: new Date(),
          submitDeptCd: this.role.deptId,
          submitRoleCd: this.role.roleId,
          opTp: "04" // 提交
        };
        if (flag) {

          return await this.handlerModifyAttribute(param);
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    async handlerModifyAttribute(param) {
      try {
        let res = await modifyAttribute(param);

        if (res.code == 1) {
          this.mrinfoObj.dataVersion = res.data.dataVersion;
          //保存留痕信息
          saveMarks({
            editor: this.editor,
            mrId: this.insInfo.mrId,
            opLogId: res.data.opLogId
          }).then(() => {
            getMarks({ editor: this.editor, mrId: this.insInfo.mrId });
          });

          this.$message({
            message: "提交成功!",
            type: "success"
          });

          await this.stopVisitAjax();

          this.$root.eventHub.$emit('refresh-wait-patientList', 'second', true)

          // 提供提交成功 事件的 回调
          await this.handlerWeihuHandler();
          this.$emit("submitSuccess");
          await this.updateInsInfo({
            mrId: res.data.mrId
          });

          // 保存后  判断有审签元素在调用审签完成接口
          if (this.isHasSignLabel()) {
            await this.signLabelSave(this.insInfo.mrId, 0);
          }

          // TODO:重置审签签名元素 的数组
          // this.signArr = [];
          // 更新文书树中的文书状态
          this.$refs.insTree.initTree(this.insInfo.mrId);

          return res;
        }
        this.$message.error("提交失败!");
        return false;
      } catch (error) {
        this.$message.error(error);
        return false;
      } finally {
        this.isDoneRquest = false;
      }
    },
    async stopVisitAjax() {
      try {
        let { data, msg, code } = await stopVisitAjax(this.receivePatientData.id);
        if (code == 1) {
          this.$message.success(msg || "结束就诊成功");
        } else {
          this.$message.error(msg || "结束就诊失败");
        }
      } catch (error) {
        this.$message.error(msg || "结束就诊失败");
      }
    },
    // 维护文书提交状态调整
    async handlerWeihuHandler() {
      // 维护状态文书 提交的时候需要修改状态
      if (this.insInfo.mrStaCd === "11") {
        try {
          let compResData = await maintainApplyComp(this.insInfo.mrMtAppId);
          if (compResData.code !== 1) {
            this.$message.warning(compResData.msg || "维护接口状态修改失败");
          }
        } catch (error) {
          console.log(error || "维护接口状态修改失败");
        }
      }
    },
    // ca验证逻辑
    async caLogicFunc(content) {
      // 执行初始化
      let initFlag = SZCAInit() || true;

      if (initFlag) {
        // 检测key 是否已插入
        let isExist = SZCAKeyIsExist();
        if (isExist) {
          let sha1Str = sha1(content);
          let signData = SZCASignMessage(sha1Str, 0);
          let certData = SZCAParseSignMessage(signData, 2);

          let data = {
            signRes: signData,
            certData: certData,
            method: "SM2"
          };

          await CA.dssLogin(data)
            .then(resData => {
              if (resData.code !== 1) {
                this.$message.info(resData.msg);
              }
            })
            .catch(error => {
              console.log(error);
              this.$message.error(error || "ca登陆失败");
            });
          let params = {
            signRes: signData,
            method: "SM2"
          };
          return await CA.TSSSign(params).then(res => {
            res.signRes = signData;
            return res;
          });
        }
      }

      this.$message.info("请插入验证工具");
      return false;
    },
    // 判断是否有需要审签签字的元素
    isHasSignLabel() {
      let allSignArr = this.editor.execCommand("checksign");
      console.log(allSignArr, "allSignArr");

      let falg = allSignArr.some(item => {
        return item.type !== "normal";
      });
      return falg;
    },
    // 判断是否可以撤销
    async isRecallHandler() {
      let data = {
        patientId: this.thirdPatientId || this.patientId,
        enId: this.thirdNum || this.modeNumCode,
        mrId: this.mrIdProp || this.insInfo.mrId
      };
      return await checkCancelStatus(data);
    },
    async recall() {
      if (this.insInfo.mrStaCd === "01") {
        this.$message.warning("当前文书为编辑状态，无需撤回操作");
        return;
      }
      if (this.recallFlag) {
        this.$message.warning("已提交维护申请文书，无法撤回");
        return;
      }
      let paramsObj = {
        patientId: this.patientId,
        enId: this.modeNumCode,
        mrId: this.insInfo.mrId,
        dataVersion: this.insInfo.mrDataVersion
      };

      cancelSubmit(paramsObj)
        .then(resp => {
          console.log(resp, "resp");
          if (resp.code === 1) {
            this.$message({
              message: "撤回成功!",
              type: "success"
            });

            // 住院清空下 有审签的元素 删除已签名的元素
            if (this.isHasSignLabel() && this.mode === "zhuyuan") {
              this.editor.execCommand("clearsign", "oneLevel");
            }

            // 更新文书数据
            this.updateInsInfo({
              mrId: this.insInfo.mrId
            });

            this.editor.execCommand("setmodel", { modelType: "edit" });

            // insTree 未初始化的时候 没有
            this.$refs.insTree &&
              this.$refs.insTree.initTree(this.insInfo.mrId);

            // 更新既往文书列表
            this.setRecallRecord(true);
          } else if (resp.code === 0) {
            this.$message.error(resp.msg || "1撤回失败");
          }
        })
        .catch(error => {
          console.log(error, "error");
          this.$message.error(error.msg || "撤回失败");
        });
    },
    handlerDel() {
      if (!this.insInfo.mrId) {
        this.$message.info("请选中文书后删除");
        return;
      }

      if (!["01", "11"].includes(this.insInfo.mrStaCd)) {
        this.$message.warning("非新建和维护文书不能删除");
        return;
      }

      this.$confirm("此操作将删除该文书, 是否继续?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          checkMrCreatedBy({ mrId: this.insInfo.mrId, createdBy: getUserId() })
            .then(res => {
              if (res.code === 1) {
                const param = {
                  mrId: this.insInfo.mrId,
                  dataVersion: this.insInfo.mrDataVersion
                };
                let mrIdStr = this.insInfo.mrId;
                if (res.data == "true") {
                  removeMr(param)
                    .then(async res => {
                      if (res.code == 1) {
                        this.$emit("deleteRecord");

                        this.$message.success("文书删除成功");
                        await this.handlerWeihuHandler();
                        this.insInfo = {};
                        this.$refs.insTree && this.$refs.insTree.initTree();
                        this.$refs.insTree && this.$refs.insTree.clearRowData();
                        this.editor.setContent('')
                        // this.defaultMsg = "";
                        this.editor.execCommand("setmodel", {
                          modelType: "pure",
                          showToolbar: false
                        });
                        await this.deleteDiagList(mrIdStr);
                      } else {
                        this.$message.error(res.msg);
                      }
                    })
                    .catch(res => {
                      this.$message.error(res.msg);
                    });
                } else {
                  // 检查是否为维护人
                  chkAppPerson(this.insInfo.mrId).then(res => {
                    const mrIdStr = this.insInfo.mrId;
                    if (res.code === 1) {
                      removeMr(param)
                        .then(async res => {
                          if (res.code == 1) {
                            this.$emit("deleteRecord");
                            this.$message.success("文书删除成功");
                            await this.handlerWeihuHandler();

                            this.insInfo = {};
                            this.$refs.insTree && this.$refs.insTree.initTree();
                            this.defaultMsg = "";
                            this.editor.execCommand("setmodel", {
                              modelType: "pure",
                              showToolbar: false
                            });
                            await this.deleteDiagList(mrIdStr);
                          } else {
                            this.$message.error(res.msg);
                          }
                        })
                        .catch(res => {
                          this.$message.error(res.msg);
                        });
                    } else {
                      this.$message.warning("您没有删除当前文书的权限!");
                    }
                  });
                }
              }
            })
            .catch(res => {
              this.$message.error(res.msg);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 文书的时候 处理审签签名暂存问题
    async signLabelSave(mrId, saveOrKeep) {
      let params = {
        mrId,
        signArr: this.signArr,
        option: "",
        tempF: saveOrKeep
      };
      try {
        let { code, data, msg } = await signTempSign(params);
        if (code === 1) {
          // 更新打印的相关数据
          this.mrinfoObj.dataVersion = data.mrDataVersion;
          this.insInfo.mrDataVersion = data.mrDataVersion;
        } else {
          this.$message.error(msg || "审签失败");
        }
      } catch (error) {
        this.$message.error(error || "审签接口报错");
      }
    },
    // eslint-disable-next-line complexity
    async save(content, opTp, undateFlag, patientId) {
      let caLogicObj = {};
      // 35岁高血压输入提示
      let bloodPressureIsEmpty = this.editor.execCommand("checknotempty");

      !bloodPressureIsEmpty && this.handlerMessageBloodPressure();


      // 收集ca需要的数据
      if (signConfig.mode === "ca" && signConfig.isLoad === true) {
        let res = await this.caLogicFunc(content);
        if (res.code == 1) {
          caLogicObj = {
            timeStamp: res.timeStampBase64,
            signRes: res.signRes
          };
        } else {
          this.$message.error(res.msg || "时间戳验证不通过");
          return false;
        }
      }
      // 获取段落相关信息 并存入接口
      const strPar = this.getEditorParagrapheleContent([
        {
          keys: "paragraphtype",
          value: "PT_zs"
        },
        {
          keys: "paragraphtype",
          value: "PT_xbs"
        },
        {
          keys: "paragraphtype",
          value: "PT_jws"
        },
        {
          keys: "paragraphtype",
          value: "PT_tgjc"
        }
      ]);
      let paragraph = {
        height: this.editor.execCommand("getheight"),
        weight: this.editor.execCommand("getweight"),
        zs: "", // 主诉
        xbs: "", // 现病史
        jws: "", // 既往史
        tgjc: "", // 体格检查
        bodyTemperature: this.editor.execCommand("gettemperature"),
        pulse: this.editor.execCommand("getpulse"),
        breath: this.editor.execCommand("getbreath"),
        bmi: this.editor.execCommand("getbmi"),
        firstBloodPressure: this.editor.execCommand("getfirstbloodpressure"),
        pulseFrequency: this.editor.execCommand("getpulsefrequency"),
        bloodPressure: this.editor.execCommand("getbloodpressure"),
        tgjcMsg: this.editor.execCommand("gettgjcmsg"),
        primaryDiag: this.editor.execCommand("getzdtext"),
        healthEducation: this.editor.execCommand("gethealthedu"),
        managemetnPlan: this.editor.execCommand("getmanagemetplan"),
        fastingPlasmaGlucose: this.editor.execCommand("getglu"),
        lastMenstruation: this.editor.execCommand("getmcyj"),
        auxiliaryCheck: this.editor.execCommand("getfzjc"),
      };
      if (strPar && strPar.length > 0) {
        strPar.forEach(item => {
          switch (item.name) {
            case "主诉":
              paragraph.zs = item.content;
              break;
            case "既往史":
              paragraph.jws = item.content;
              break;
            case "现病史":
              paragraph.xbs = item.content;
              break;
            case "体格检查":
              paragraph.tgjc = item.content;
              break;
            default:
              break;
          }
        });
      }

      let param = {
        docDataVersion: this.insInfo.docDataVersion,
        docId: this.insInfo.docId,
        docMongoContent: content,
        docMongoId: this.insInfo.docMongoId,
        mrDataVersion: this.insInfo.mrDataVersion,
        mrId: this.insInfo.mrId,
        mrStaCd: this.insInfo.mrStaCd,
        opTp: opTp,
        completedF: this.editor.execCommand("validrequired") ? "1" : "0",
        ...caLogicObj,
        paragraph
      };

      // 添加防重复提交逻辑
      if (this.isSaveDoneRequest) {
        return false;
      }
      this.isSaveDoneRequest = true;

      // 审签流程
      if (this.signArr.length) {
        await this.signLabelSave(this.insInfo.mrId, 1);
      }


      try {
        let { code, data, msg } = await modifyContent(param);
        if (code == 1) {
          this.$message({
            message: "保存文书成功!",
            type: "success"
          });

          this.insInfo.mrDataVersion = data.mrDataVersion;
          this.mrinfoObj.dataVersion = data.mrDataVersion;

          this.editor.execCommand("recordinitcontent");
          // if (!undateFlag) {
            await this.updateInsInfo({
              mrId: data.mrId
            });
          // }
          const currenrtNode = this.currenrtNode || this.$refs.insTree.$refs.docTree.getCurrentNode();
          const isHighBlood = currenrtNode.exts.typeCode === 'T_2104230001';

          const sbp = parseFloat(this.editor.execCommand('getsbp')); // 收缩压
          const dbp = parseFloat(this.editor.execCommand('getdbp')); // 舒张压
          if (dbp && sbp && dbp >= sbp) {
            param.paragraph.bloodPressure = '/'
          }


          const firstsbp = parseFloat(this.editor.execCommand('getfirstsbp')); // 第一次收缩压
          const firstdbp = parseFloat(this.editor.execCommand('getfirstdbp')); // 第一次舒张压
          // const secondsbp = parseFloat(this.editor.execCommand('getsecondsbp')); // 第二次收缩压
          // const seconddbp = parseFloat(this.editor.execCommand('getseconddbp')); // 第二次舒张压

          if (firstsbp && firstdbp && firstdbp >= firstsbp) {
            param.paragraph.firstBloodPressure = '/';
          }

          // if (secondsbp && seconddbp && seconddbp >= secondsbp) {
          //   this.$message.error('第二次舒张压须小于第二次收缩压');
          //   return
          // }

          const temperature = parseFloat(param.paragraph.bodyTemperature)
          if (temperature && (temperature < 30 || temperature > 50)) {
            param.paragraph.bodyTemperature = ''
          }

          const height = parseFloat(param.paragraph.height);
          const weight = parseFloat(param.paragraph.weight);
          if (!height) {
            param.paragraph.height = '';
          }
          if (!weight) {
            param.paragraph.weight = '';
          }

          const bmi = parseFloat(param.paragraph.bmi);
          if (bmi && bmi > 9999.99) {
            param.paragraph.bmi = '';
          }

          const fastingPlasmaGlucose = parseFloat(param.paragraph.fastingPlasmaGlucose);
          if (fastingPlasmaGlucose && fastingPlasmaGlucose > 99.99) {
            param.paragraph.fastingPlasmaGlucose = '';
          }

          if(isHighBlood) {
            const emrResult = this.emrResult || this.editor.execCommand('gethypertensionfollowupemrinfo');
            saveHighBloodPressureContent({
              ...emrResult,
              cert_type: this.receivePatientData.identificationType,
              cert_id: this.receivePatientData.identificationNum,
              mrId: this.insInfo.mrId,
            });
          }
          feritinFrom(param);
          return true;
        }
        this.$message.error(
          msg || "文书/模板内容已更新，请重新打开文书/模板进行书写/维护!"
        );
        return false;
      } catch (error) {
        this.$message.error(error.msg || "保存文书失败");
        return false;
      } finally {
        this.isSaveDoneRequest = false;
        savaHeightAndWeight({
          patientId: patientId || this.patientId,
          height: this.editor.execCommand("getheight"),
          weight: this.editor.execCommand("getweight"),
        }).catch(err => {
          this.$message.error(err.msg || "保存身高体重失败");
        })
      }
    },
    // todo 文书渲染完毕
    editorReady(instance) {
      this.editor = instance;
      this.initRecordFlag = true;

      // 对接3.1系统相关方法 保留代码
      // this.supplySubmitFunc(this.editor, this.mode, this.receivePatientData);

      this.$emit("showStructureTree", instance);
      // 初始默认为 pure 模式
      if (!this.isSignApply) {
        this.editor.execCommand("setmodel", {
          modelType: "pure",
          showToolbar: false
        });
        // 只有门诊有默认模板
        // this.mode === "menzhen" && this.getDefaultTempRender();
      }
    },
    previewEditorReady(instance) {
      var _this = this;
      this.editorP = instance;
      instance.execCommand("setmodel", {
        modelType: "preview",
        showToolbar: false
      });
      // iframe 内由于不知明原因点击会失焦，添加此事件记录选中文字
      this.editorP.body.addEventListener("mouseup", function(e) {
        _this.selectionText = _this.editorP.document.getSelection().toString();
      });
      this.editorP.body.addEventListener("click", function(e) {
        // 引用段落
        if (e.target.className == "quoteBtn") {

          var quoteDom = instance.execCommand(
            "getselectcontent",
            e.target.getAttribute("paragraphtype")
          );
          console.log('quoteDom', quoteDom)
          _this.editor.execCommand(
            "quoteparagraph",
            quoteDom,
            e.target.getAttribute("paragraphtype"),
            _this.actionType
          );
          // _this.popShow = false;
        }
      });
    },
    // 判断是否处理刷新诊断和处方
    judgeRefreshDiagAndF(mrStaCd) {
      this.judgeDiagnoseisRefresh(mrStaCd);
      this.judgePrescriptionisRefresh(mrStaCd);
    },
    // 判断宏元素是否刷入到文书中
    judgeisRefreshMacros(mrStaCd) {
      if (mrStaCd === "01") {
        switch (this.BaseInfoRefreshF) {
          // 不刷新
          case "0":
            break;
          // 没有值的时候 刷入 有值的时候不刷入
          case "1":
            // 如果诊断元素没有的时候  或者 宏元素没有的时候 都刷新
            if (
              !this.editor.execCommand("checkcontent", "macro-ctrl") ||
              !this.editor.execCommand("checkcontent", "diagnose")
            ) {
              this.refreshMacros();
            }
            break;
          // 一直刷入
          case "2":
            this.refreshMacros();
            break;
          default:
        }
      }
    },
    // 判断诊断信息是否刷入到文书中
    judgeDiagnoseisRefresh(mrStaCd) {
      // 判断文书中是否含有诊断元素

      let diagnoseFlag = this.judgePrescriptionOrDiagnoseHas("diagnose");
      // 存在诊断元素 且 为 新建文书的情况下
      if (diagnoseFlag && mrStaCd === "01") {
        // 判断是否可以自动刷新
        switch (this.diagRefreshF) {
          case "0":
            break;
          case "1":
            // 诊断元素没有
            if (!this.editor.execCommand("checkcontent", "diagnose")) {
              this.refreshDiagnose().then(() => {
                this.editor.execCommand("recordinitcontent");
              });
            }
            break;
          case "2":
            this.refreshDiagnose().then(() => {
              this.editor.execCommand("recordinitcontent");
            });
            break;
          default:
        }
      }
    },
    // 判断处方信息是否刷入到文书中
    judgePrescriptionisRefresh(mrStaCd) {
      // 判断文书中是否含有处方元素

      let prescriptionFlag = this.judgePrescriptionOrDiagnoseHas(
        "prescription"
      );

      if (prescriptionFlag && mrStaCd === "01") {
        // 判断是否可以自动刷新
        switch (this.orRefreshF) {
          case "0":
            break;
          case "1":
            if (!this.editor.execCommand("checkcontent", "prescription")) {
              this.refreshPrescription().then(() => {
                this.editor.execCommand("recordinitcontent");
              });
            }
            break;
          case "2":
            this.refreshPrescription().then(() => {
              this.editor.execCommand("recordinitcontent");
            });
            break;
          default:
        }
      }
    },
    handleNodeClick(data) {
      if (data.text == "病案首页") {
        this.mrHomepage = true;
        return;
      }
      this.mrHomepage = false;

      // 这里注释掉是因为高度上没有考虑工具箱的影响
      // document.getElementsByClassName(
      //   "edui-editor-iframeholder"
      // )[0].style.height =
      //   document.getElementById("emr-editor1").offsetHeight + "px";

      if (!data.exts.mrId) {
        return;
      }

      let params = {
        mrId: data.exts.mrId
      };

      this.editor.options &&
        this.editor.options.sensitiveSetting &&
        this.editor.options.sensitiveSetting.map(item => {
          item.isshow = false;
        });

      this.defaultMsg = "";
      contentQuery(params)
        .then(res => {
          if (res.code == 1) {
            // this.defaultMsg = res.data.docMongoContent || "";
            this.editor.setContent(res.data.docMongoContent || "");

            // cdss主诉解析
            const zsContent = this.editor.execCommand('getzscontent');
            this.setMainComplaint(zsContent);

            // cdss现病史解析
            const xbsContent = this.editor.execCommand('getxbscontent');
            this.setHisPresent(xbsContent);

            this.insInfo = res.data;

            this.mrinfoObj.mrId = res.data.mrId;
            this.mrinfoObj.dataVersion = res.data.mrDataVersion;
            this.mrinfoObj.printNo = res.data.printNo;

            this.editorType = res.data.editor || "01";

            // 更新结构树
            this.$emit("refreshStrureTree");

            // 处理文书浏览模式 和 工具栏按钮状态
            if (!this.showMrHomepage) {
              // 不是文书创建人  只能清洁浏览
              this.reacordModelAndToolsStatusHandler();
            }
            // 非新建文书
            this.editorCreateType = "";

            // 刷新文书相关信息
            setTimeout(() => {
              this.$nextTick(async () => {
                // if (
                //   this.receivePatientData.identificationType &&
                //   this.receivePatientData.identificationNum
                // ) {
                //   this.getThirdHistory(
                //     this.receivePatientData.identificationType,
                //     this.receivePatientData.identificationNum
                //   );
                // }
                this.judgeisRefreshMacros(res.data.mrStaCd);
                this.judgeRefreshDiagAndF(res.data.mrStaCd);
                this.autoSignlabel(res.data.mrStaCd);
                this.setFiveServiceCardInfo();
                this.insertSelfOrders()
              });
            }, 1000);
          } else {
            this.$message.error("查询失败!");
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    handlerUpdate(data, str = "") {
      let params = {
        mrId: data.mrId
      };
      contentQuery(params)
        .then(async res => {
          if (res.code == 1) {
            // 先清空 在设置
            let editorContent = ''
            if (str === "jiwangRecord") {
              const paramsMsg = JSON.parse(getPamars())
              const hosName = paramsMsg.hosName;
              // 既往病历来源需要去掉文书原有数据
              editorContent = this.editor.execCommand(
                "gettemplcontent",
                res.data.docMongoContent,
                hosName
              );
              console.log('editorContent1======', editorContent)
            } else if (str === "oldSystemRecord") {
              editorContent = this.editor.getContent();
            } else {
              editorContent = res.data.docMongoContent || "";
            }
            console.log('editorContent====', editorContent)
            this.editor.setContent(editorContent)

            // cdss主诉解析
            const zsContent = this.editor.execCommand('getzscontent');
            this.setMainComplaint(zsContent);

            // cdss现病史解析
            const xbsContent = this.editor.execCommand('getxbscontent');
            this.setHisPresent(xbsContent);

            // this.editor.execCommand('restart')
            this.insInfo = res.data;
            this.mrinfoObj.mrId = res.data.mrId;
            this.mrinfoObj.dataVersion = res.data.mrDataVersion;
            this.mrinfoObj.printNo = res.data.printNo;
            this.editorType = res.data.editor || "01";

            // 更新左侧文书树
            if (this.$refs.insTree) {
              this.$refs.insTree.initTree(data.mrId);
              getTree({
                patientId: this.patientId,
                enId: this.modeNumCode,
                isHome: this.isHome,
                visitType: this.modeTypeStr
              }, false).then(async (resp) => {
                if (resp.code == 1) {
                  resp.data.forEach(item => {
                    this.countIns(item);
                  });
                  // 更新结构树
                  this.$emit("refreshStrureTree");
                  this.handlerUpdateFn(data, res, str)
                }
              })
            } else {
              this.handlerUpdateFn(data, res, str)
            }
          } else {
            this.editor.execCommand("setmodel", {
              modelType: "pure",
              showToolbar: false
            });
            this.$message.error(res.msg);
          }
          // 处理文书编辑器状态和编辑器工具栏状态
          // this.reacordModelAndToolsStatusHandler()
        })
        .catch(res => {
          this.editor.execCommand("setmodel", {
            modelType: "pure",
            showToolbar: false
          });
          this.$message.error(res.msg);
        });
    },

    async handlerUpdateFn(data, res, str) {
      console.log("update---------------");
      if (
        this.receivePatientData.identificationType &&
        this.receivePatientData.identificationNum
      ) {
        this.getThirdHistory(
          this.receivePatientData.identificationType,
          this.receivePatientData.identificationNum
        );
      }
      // 诊断和处方刷入的判断逻辑
      this.judgeRefreshDiagAndF(res.data.mrStaCd);
      // 回显上次的随访时间
      // if (!this.editor.execCommand("checkcontent", "macro-ctrl") && res.data.mrStaCd === "01") {
        /* 2021-7-21注释掉这个if 因为这个if不成立 */
        getLastFollowUpDate(this.patientId).then(res => {
          res.data && this.editor.execCommand("prevtime", new Date(res.data))
        })
        // setTimeout(() => {
        //   let userName = Base64.decode(getUserName());
        //   this.editor.execCommand("updatevisdoctor", userName);
        // }, 1500)
      // }
      let userName = Base64.decode(getUserName());
      this.editor.execCommand("updatevisdoctor", userName);
      const result = await getPatientArchInfo({
        pageNo: 1,
        pageSize: 10,
        patientId: this.patientId,
      });
      let height = ''
      let weight = ''
      if (result.data && result.data.length) {
        height = result.data[0].patientArchiveInfoVO.height
        weight = result.data[0].patientArchiveInfoVO.weight
      }

      height && this.editor.execCommand("insertheight", height)
      weight && this.editor.execCommand("insertweight", weight)

      this.insertSelfOrders();
      this.setFiveServiceCardInfo();

      // 判断自动刷入宏元素逻辑
      switch (this.BaseInfoRefreshF) {
        case "1":
          // 判断宏元素是否有值
          if (
            !this.editor.execCommand("checkcontent", "macro-ctrl") &&
            res.data.mrStaCd === "01"
          ) {
            if (data.isNew) {
              await this.refreshMacrosEx();
              this.editor.execCommand("setmodel", {
                modelType: "edit"
              });

            } else {
              await this.refreshMacros();
            }
          }
          break;
        case "2":
          if (data.isNew && res.data.mrStaCd === "01") {
            await this.refreshMacrosEx();
            this.editor.execCommand("setmodel", { modelType: "edit" });
          } else if (res.data.mrStaCd === "01") {
            await this.refreshMacros();
          }
          break;
        default:
      }
      // 判断是否自动审签逻辑
      await this.autoSignlabel(res.data.mrStaCd);

      // 普通门诊病历切换到高血压随访病历后已填写内容回显
      if(str === 'switchToHighBlood') {
        console.log('oridinaryEmrInfo====', this.oridinaryEmrInfo)
        this.editor.execCommand('sethighbloodinfobyoridinary', this.oridinaryEmrInfo)
      }

      // 丛诊前筛查获取数据填入病历
      const recentRecordRes = await getRecentRecordByPatientId(this.receivePatientData.patientId);
      this.editor.execCommand('setemrinfobyrecentrecord', recentRecordRes.data)

      // 对文书模式判断
      if (res.data.mrStaCd === "11") {
        console.log("留痕模式");
        // 如果是病历维护申请 并且是 删除申请
        if (res.data.appReason === "2") {
          this.editor.execCommand("setmodel", {
            modelType: "pure",
            showToolbar: false
          });
        } else {
          setTimeout(() => {
            this.editor.execCommand("setmodel", {
              modelType: "mark",
              diabledBtns: ["recall"],
              showToolbar: true
            });
          }, 1000);
        }
      } else {
        // 判断是否可以撤销 更新撤销按钮状态
        this.isRecallHandler()
          .then(result => {
            if (res.data.mrStaCd === "02") {
              if (result.success === true) {
                if (this.isSignApply) {
                  this.editor.execCommand("setmodel", {
                    modelType: "dirty",
                    showToolbar: true
                  });
                } else {
                  this.editor.execCommand("setmodel", {
                    modelType: "pure",
                    showToolbar: true
                  });
                }
              } else {
                // 添加对维护页面文书展示支持
                if (this.isSignApply) {
                  this.editor.execCommand("setmodel", {
                    modelType: "dirty",
                    diabledBtns: ["recall"],
                    showToolbar: true
                  });
                } else {
                  this.editor.execCommand("setmodel", {
                    modelType: "pure",
                    diabledBtns: ["recall"],
                    showToolbar: true
                  });
                }
              }
            }

            // 文书相关操作禁止 等文书保存更新后在放开
            this.disableTimeControl = true;
            if (this.insInfo.mrStaCd === "01") {
              let content = this.editor.getContent();
              this.save(content, "02");
            }
          })
          .catch(error => {
            console.log(error);
            this.$message.error(error);
          });
      }
    },

    async insertSelfOrders() {
      const { data: selfOrders } =  await getSelfOrders(this.modeNumCode)
      if (!selfOrders || !selfOrders.length) {
        this.editor.execCommand("insertselforders",[])
        return
      }
      for(let i = 0; i < selfOrders.length; i++) {
        const unitNameRes = await transformCode([{
          field: "name",
          code: "DrugUnit",
          val: selfOrders[i].unitKey,
        }])
        // const prodNameRes = await transformCode([{
        //   field: "name",
        //   code: "Manufacturer",
        //   val: selfOrders[i].production,
        // }])
        selfOrders[i].unitName = unitNameRes.data.DrugUnit
        if (i === selfOrders.length - 1) {
          this.editor.execCommand("insertselforders", selfOrders || [])
        }
      }
      // let count = 0;
      // selfOrders.forEach(async (item, index) => {
      //   const result = await transformCode([{
      //     field: "name",
      //     code: "DrugUnit",
      //     val: item.unit,
      //   }])
      //   // count++
      //   console.error('result.data.DrugDoseUnit', result.data.DrugUnit)
      //   item.unitName = result.data.DrugUnit
      //   if (count === selfOrders.length - 1) {
      //     debugger
      //     this.editor.execCommand("insertselforders", selfOrders || [])
      //   }
      // })
      
    },

    // 设置五免一减服务卡内容
    setFiveServiceCardInfo() {
      let userName = Base64.decode(getUserName());
      this.editor.execCommand('setevalutename', userName);
      getGroupFlag({
        identificationType: this.receivePatientData.identificationType || "1",
        identificationNum: this.receivePatientData.identificationNum,
        identificationName: ""
      }).then(res => {
        const teamName = res.data.signDoctorName + '/' + res.data.signOrgName;
        this.editor.execCommand('setsignteam', teamName);
      })
    },

    // 处理自动签名问题
    // eslint-disable-next-line complexity
    async autoSignlabel(mrStaCd) {

      let userName = Base64.decode(getUserName());
      // 如果是审签文书的话， 并且
      // this.signList.includes(this.currentDocInfo.signLevel)
      if (mrStaCd === "01") {
        let resData = await this.getSignConfig();
        let userId = Base64.decode(getUserId());
        // 调用编辑器方法
        if (resData.code === 1) {
          if (resData.data) {
            this.editor.execCommand("updatevisdoctor", userName); //设置本次随访医生
            // 获取的审签等级
            let signAuditType = resData.data.auditType;
            let flag = this.signList.includes(signAuditType);
            if (flag) {
              if (signConfig.mode == "sign") {
                let allSignArr = this.editor.execCommand("checksign");
                console.log(allSignArr, "allSignArr");

                let oneIdx = allSignArr.findIndex(
                  sign => sign.type === "oneLevel"
                );
                // 有一级审签并且一级审签已经签字了 不能覆盖
                if (
                  oneIdx >= 0 &&
                  (allSignArr[oneIdx].value === "" ||
                    this.editorCreateType === "copy" || this.editorCreateType === "byPast" || this.editorCreateType === "create" || this.editorCreateType === "byTemp" || this.editorCreateType === "")
                ) {
                  this.signArr = [{ signLevel: "02", userId }];
                  this.editor.execCommand(
                    "insertsignature",
                    userName,
                    "oneLevel",
                    userId
                  );

                }
                this.editor.execCommand("setsigntime", new Date());
                // TODO: 如果有人签名后 如何在提交操作的时候处理
              } else if (signConfig.mode == "ca") {
                // 调用签章 获取签章图片
                let url = SZCA_PdfSign_GetSealImage();
                // 添加签章方法
                this.editor.execCommand(
                  "insertimgsign",
                  `data:image/jpg;base64,${url}`,
                  userName,
                  "oneLevel"
                );

                this.signArr = [{ signLevel: "02", userId }];
              }
            }
          } else {
            this.$message.warning(resData.msg || "查询审签权限失败");
          }
        }
      }
    },
    handleDetermine() {
      let {
        param = {},
        activeTab = ""
      } = this.$refs.createEmr.createInsAndEmr();

      if (param.typeCode) {
        this.dialogVisible = false;
        this.checkMrReplaceableAndCreate(param, activeTab);
      } else {
        this.$message.warning("请选择模板");
      }
    },
    handleRowDbClick() {
      this.dialogVisible = false;
      let {
        param = {},
        activeTab = ""
      } = this.$refs.createEmr.createInsAndEmr();
      this.checkMrReplaceableAndCreate(param, activeTab);
    },
    async refreshMacrosEx() {
      await refreshMacros({
        editor: this.editor,
        patientId: this.patientId,
        enId: this.modeNumCode,
        enTpCd: this.modeTypeStr,
        hideConfirmTip: true,
        isHome: this.isHome,
        mrId: this.insInfo.mrId
      });
    },
    async refreshMacros() {
      await refreshMacros({
        editor: this.editor,
        patientId: this.patientId,
        enId: this.modeNumCode,
        enTpCd: this.modeTypeStr,
        hideConfirmTip: false,
        isHome: this.isHome,
        mrId: this.insInfo.mrId
      });
    },
    // 删除因文书创建的诊断
    async deleteDiagList(mrIdStr) {
      if (this.isHome === "1") return;

      // 从提交的文书模板诊断中删除诊断删除 相关逻辑
      try {
        let paramObj = {
          pageNo: 1,
          pageSize: 1000,
          patientId: this.patientId,
          inpCode: this.receivePatientData.inpCode,
          visitCode: this.modeNumCode
        };
        let totalDiagnose = [];
        let { code, data, msg } = await getCurrentDiagList(paramObj);
        if (code === 1) {
          totalDiagnose = data;
        } else {
          return false;
        }

        // {enId}/{enTpCd}/{isHome}/{mrId}
        let resDataObj = await getDelDiagList(
          this.modeNumCode,
          "01",
          "0",
          mrIdStr
        );
        // debugger
        if (resDataObj.code === 1) {
          let diagList = [];
          diagList = resDataObj.data;
          if (diagList.length) {
            // 找出当前和当前诊断匹配的诊断 并删除
            let list = [];
            totalDiagnose.forEach(diagnose => {
              diagList.forEach(newDiagnose => {
                if (newDiagnose.diagCode === diagnose.diagCode) {
                  list.push({...diagnose, diagCode: diagnose.diagCode || ''});
                }
              });
            });
            // 如果有 先删除
            let { code, msg } = await deleteDiag(list);
            if (code !== 1) {
              this.$message.info(msg || "删除文书模板诊断数据失败");
            } else {
              this.$emit("updateDiagnoseList");
              // 删除诊断维护关系
              const paramsObj = {
                enId: this.modeNumCode,
                enTpCd: "01",
                isHome: "0",
                diagRelationList: diagList.map(diag => {
                  return { diagCode: diag.diagCode || '',  diagName: diag.diagName};
                }),
                templateDiagVO: { mrId: mrIdStr }
              };
              await this.deleteDiagRelationHandler(paramsObj);
            }
          } else {
            const paramsObj = {
              enId: this.modeNumCode,
              enTpCd: "01",
              isHome: "0",
              diagRelationList: [],
              templateDiagVO: { mrId: mrIdStr }
            };
            await this.deleteDiagRelationHandler(paramsObj);
          }
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 删除诊断关系
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
    // 添加诊断关系
    async saveDiagRelationHandler(params) {
      try {
        const { code, data, msg } = await saveDiagRelation(params);
        if (code !== 1) {
          this.$message.error(msg || "保存诊断关系操作失败！");
        }
      } catch (error) {
        this.$message.error(JSON.parse(JSON.stringify(error)));
      }
    },
    // 从接口获取获取诊断相关数据
    refreshDiagnose() {
      return getHistoryDiagList({
        paId: this.patientId,
        visitType: this.modeTypeStr,
        enNo: this.modeNumCode,
        isHome: this.isHome
      }).then(async res => {
        this.newDiagnoseList = [];
        if (res.code == 1) {
          // 处理下诊断排序
          let list = res.data;
          let findIdx = list.findIndex(item => item.mainF === "1");
          let diagItem, diagnoseInfo;
          if (findIdx >= 0) {
            diagItem = { ...list[findIdx] };
            list.splice(findIdx, 1);
            list.unshift(diagItem);
          }
          // 诊断存入
          diagnoseInfo = handlerDiagnoseInfo(list);
          // 从文书模板中获取相关诊断
          this.diagnosticList = this.getDiagnoseInfo() || [];
          let noMainDiag = false;
          // 诊断为底部操作导致的刷新 或者 再次点击当前文书导致的刷入 不让再次保存当前模板诊断
          // 并且当前文书不是新创建的文书
          if (
            this.diagnoseOprate !== "diagnoseOprate" &&
            this.editorCreateType !== ""
          ) {
            if (diagnoseInfo.length && this.diagnosticList) {
              diagnoseInfo.forEach(item => {
                // 判断是否有主诊断
                noMainDiag = item.resultList.every(
                  result => result.mainF === "0"
                );

                let newDiagnoseList = [];

                this.diagnosticList.forEach(diagnostic => {
                  // 目前只处理门诊
                  if (item.type === diagnostic.diagType) {
                    // 判断是否有
                    let findInx = item.resultList.findIndex(result => {
                      return result.diagCd === diagnostic.diagCode;
                    });
                    if (findInx < 0) {
                      // 如果模板维护的诊断设置为主诊断还要比对 诊断列表中是否有主诊断
                      let mainFlag = !noMainDiag
                        ? false
                        : diagnostic.diagMain === "1";
                      item.resultList.push({
                        cwDiagName: diagnostic.cwFlag === "1" ? "西" : "中",
                        diagCd: diagnostic.diagCode,
                        mainFlag: mainFlag,
                        name: diagnostic.diagName,
                        tcmSyndromeNm: diagnostic.tcmSyndrome
                      });
                      newDiagnoseList.push({
                        ...diagnostic,
                        diagMain: !noMainDiag ? "0" : diagnostic.diagMain
                      });
                    }
                  }
                });
                // 排序  把主诊断排在第一位
                newDiagnoseList.sort((a, b) => {
                  return Number(b.diagMain) - Number(a.diagMain);
                });
                this.newDiagnoseList = newDiagnoseList;
              });
            } else {
              // 诊断列表中没有 数据 则把文书中的诊断全部提交保存
              this.newDiagnoseList =
                this.diagnosticList.sort((a, b) => {
                  return Number(b.diagMain) - Number(a.diagMain);
                }) || [];
            }
          }
          this.diagnoseOprate = "";
          let diagnoseEleFlag = this.judgePrescriptionOrDiagnoseHas("diagnose");

          // 先清空诊断 然后从接口中获取
          if (diagnoseEleFlag) {
            this.insertHistorical([]);
          }
          // 有需要新增的诊断 并且 当前文书是新建未保存的状态
          if (this.newDiagnoseList.length && this.editorCreateType !== "") {
            // 处理需要提交的诊断数据
            let params = this.newDiagnoseList.map(diagnose => {
              return {
                clinicType: this.receivePatientData.visitCode ? "1" : "2",
                diagType: diagnose.diagType,
                diagName: diagnose.diagName,
                diagMain: diagnose.diagMain,
                status: diagnose.status,
                isFirst: diagnose.isFirst,
                cwFlag: diagnose.cwFlag,
                diagIcd: diagnose.diagIcd,
                cwFlagName: diagnose.cwFlagName,
                diagCode: diagnose.diagCode,
                tcmSyndrome: diagnose.tcmSyndrome,
                tcmSyndromeCode: diagnose.tcmSyndromeCode,
                startTime: this.dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
                diagDoctorId: this.role.userId,
                diagDoctorName: this.name,
                deptId: this.role.deptId,
                deptName: this.role.deptName,
                inpCode: this.receivePatientData.inpCode,
                visitCode: this.receivePatientData.visitCode,
                patientBirthday: this.receivePatientData.birthDate,
                appointmentId: this.receivePatientData.appointmentId,
                freeCode: this.receivePatientData.freeCode,
                haveMoney: this.receivePatientData.haveMoney,
                patientId: this.patientId,
                patientName: this.receivePatientData.patientName,
                patientSex: this.receivePatientData.patientGender
              };
            });
            this.newDiagnoseList = params;
            // 向后台批量提交新增的诊断
            addDiags(params).then(async res => {
              if (res.code !== 1) {
                this.$message.info(res.msg || "添加文书模板诊断数据失败");
                 this.editorCreateType = "";
                this.$emit("updateDiagnoseList");
                this.diagnosticList = [];
              } else {
                // 文书模式改成非新建
                this.editorCreateType = "";
                // 需要更新 底部诊断展示组件
                this.$emit("updateDiagnoseList");

                // 添加 诊断关系
                const paramsObj = {
                  enId: this.modeNumCode,
                  enTpCd: "01",
                  isHome: "0",
                  diagRelationList: params.map(param => {
                    return {
                      diagCode: param.diagCode || '',
                      diagName: param.diagName,
                      isAuto: "1"
                    };
                  }), // 模板向接口添加的诊断
                  templateDiagVO: {
                    mrId: this.insInfo.mrId,
                    templateId: this.insInfo.mrTplCd,
                    diags: this.diagnosticList.map(diag => ({diagCode: diag.diagCode, diagName: diag.diagName})) // 模板维护的诊断
                  }
                };
                await this.saveDiagRelationHandler(paramsObj);

                

                // 刷新左侧患者列表数据
                if (!this.receivePatientData.diagName) {
                  params.forEach(param => {
                    this.receivePatientData.diagName += param.diagName;
                  });

                  this.changeRecPatientData(this.receivePatientData).then(
                    () => {
                      // 成功之后刷新右侧工具箱 诊断列表
                      this.$root.eventHub.$emit("top-list-change");
                    }
                  );
                }
              }
            });
          } else {
            // 判断是否含有诊断元素
            if (diagnoseEleFlag) {
              
              // 获取文书全部诊断
              let paramObj = {
                pageNo: 1,
                pageSize: 1000,
                patientId: this.patientId,
                inpCode: this.receivePatientData.inpCode,
                visitCode: this.modeNumCode
              };
              let { code, data } = await getCurrentDiagList(paramObj);
              
              // this.insertHistorical(diagnoseInfo); // 原来使用diagnoseInfo历史诊断作为文书的诊断内容，但是在改既往病历插入诊断时，发现诊断顺序不对，改成下面的
              this.insertHistorical(handlerDiagnoseInfo(data))
              // 诊断相关内容存入文书 便于文书维护的时候生成最新的诊断
              if (code === 1 && data) {
                let diagListObj = data.map(item => {
                  return {
                    ...item,
                    randomId: uuidv4()
                  };
                });
                this.editor.execCommand("setdiagnoseinfo", diagListObj, null);
              }
            }
            this.editorCreateType = ""
          }
        }
      });
    },
    judgePrescriptionOrDiagnoseHas(type) {
      return this.editor.execCommand("checkelementcontent", type);
    },
    // 创建诊断后点击 调用函数
    async callRefreshDiagnose() {
      // 只有当前文书是新建或者维护状态才可以支持刷入诊断和更新患者信息
      // 非删除类维护的文书
      if (
        this.insInfo.mrStaCd === "01" ||
        (this.insInfo.mrStaCd === "11" && this.insInfo.appReason !== "2")
      ) {
        // 刷入诊断
        this.diagnoseOprate = "diagnoseOprate";
        // this.refreshDiagnose1();
        // 获取文书全部诊断
        let paramObj = {
          pageNo: 1,
          pageSize: 1000,
          patientId: this.patientId,
          inpCode: this.receivePatientData.inpCode,
          visitCode: this.modeNumCode
        };
        let { code, data } = await getCurrentDiagList(paramObj);
        
        // this.insertHistorical(diagnoseInfo); // 原来使用diagnoseInfo历史诊断作为文书的诊断内容，但是在改既往病历插入诊断时，发现诊断顺序不对，改成下面的
        this.insertHistorical(handlerDiagnoseInfo(data))
        // 诊断相关内容存入文书 便于文书维护的时候生成最新的诊断
        if (code === 1 && data) {
          let diagListObj = data.map(item => {
            return {
              ...item,
              randomId: uuidv4()
            };
          });
          this.editor.execCommand("setdiagnoseinfo", diagListObj, null);
        }
        // 再次更新患者基本信息
        this.refreshMacros();
      }
    },
    refreshDiagnose1() {
      if (!this.patientId) {
        return;
      }
      let diagnoseFlag = this.judgePrescriptionOrDiagnoseHas("diagnose");
      if (diagnoseFlag) {
        this.refreshDiagnose()
          .then(res => {
            this.$message.success("刷新诊断成功");
          })
          .catch(error => {
            console.error(error);
            this.$message.error(
              error || "当前文书中暂无诊断信息，请联系管理员"
            );
          });
      } else {
        this.$message.warning("当前文书中无诊断元素");
      }
    },
    async refreshPrescription() {
      return previousOrderList({
        paId: this.patientId,
        visitType: this.visitType,
        enNo: this.modeNumCode,
        isHome: this.isHome
      })
        .then(async res => {
          if (res.code == 1) {
            let previousList = await handlerPreviousData(res.data);
            console.log(previousList, "previousList");

            let previousEleFlag = this.judgePrescriptionOrDiagnoseHas(
              "prescription"
            );
            if (previousEleFlag) {
              this.insertPrevious(previousList);
            }
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    refreshPrescription1() {
      if (this.editor.execCommand('isselforders')) {
        this.insertSelfOrders()
      } else {
        let previousEleFlag = this.judgePrescriptionOrDiagnoseHas("prescription");
        if (previousEleFlag) {
          this.refreshPrescription()
            .then(res => {
              this.$message.success("刷新处方成功");
            })
            .catch(error => {
              console.log(error);
              this.$message.error(error || "刷新处方失败");
            });
        } else {
          this.$message.warning("当前文书无处方元素");
        }
      }
      
      
    },
    updateEditorHandler(data) {
      let { param = {}, activeTab = "" } = data;
      this.checkMrReplaceableAndCreate(param, activeTab);
    },
    //新建文书检查可替换逻辑并创建（弹窗新建、模板树新建、工具箱新建）
    async checkMrReplaceableAndCreate(data, editorType = "") {
      let param = {
        patientId: this.patientId,
        enId: this.modeNumCode,
        mrTplCd: data.templateCode,
        templateVersion: data.templateVersion
      };
      let saveParam = {};
      if (data.createType === "byPast") {
        saveParam = {
          bizTime: data.businessTime,
          enCnt: 0,
          enId: this.modeNumCode,
          enStaCd: "01",
          enTpCd: this.modeTypeStr,
          mrAmrGroupId: "",
          mrId: "",
          mrMainId: "",
          mrTpCd: data.typeCode,
          mrTplCd: data.templateCode,
          nm: data.templateName + '_' + this.dayjs(data.businessTime).format("YYYY-MM-DD HH:mm") + '_' + Base64.decode(getUserName()),
          pastEnId: this.modeNumCode,
          pastMrF: "1",
          pastMrId: data.pastMrId,
          patientId: this.patientId,
          signLvlCd: data.signLevel,
          supDctId: data.supDctId,
          templateVersion: data.templateVersion
        };
      } else if (data.createType === "copy") {
        saveParam = {
          bizTime: new Date(),
          enCnt: 0,
          enId: this.modeNumCode,
          enStaCd: "01",
          enTpCd: this.modeTypeStr,
          mrAmrGroupId: "",
          mrId: "",
          mrMainId: "",
          mrTpCd: data.typeCode,
          mrTplCd: data.templateCode,
          nm: data.mrName + '_' + this.dayjs(new Date()).format("YYYY-MM-DD HH:mm") + '_' + Base64.decode(getUserName()),
          pastEnId: this.modeNumCode,
          pastMrF: "1",
          pastMrId: data.mrId,
          patientId: this.patientId,
          signLvlCd: data.signLvlCd,
          supDctId: data.supDctId,
          templateVersion: data.templateVersion
        };
      } else {
        saveParam = {
          bizTime: data.businessTime,
          enCnt: 0,
          enId: this.modeNumCode,
          enStaCd: "01",
          enTpCd: this.modeTypeStr,
          mrAmrGroupId: "",
          mrId: "",
          mrMainId: "",
          mrTpCd: data.typeCode,
          mrTplCd: data.templateCode,
          nm: data.templateName + '_' + this.dayjs(data.businessTime).format("YYYY-MM-DD HH:mm") + '_' + Base64.decode(getUserName()),
          pastEnId: "",
          pastMrF: "0",
          pastMrId: "",
          patientId: this.patientId,
          signLvlCd: data.signLevel,
          supDctId: data.supDctId || "",
          templateVersion: data.templateVersion
        };
      }



      this.editorCreateType = data.createType || "";
      checkMrReplaceable(param)
        .then(res => {
          if (res.code == 1) {
            if (res.data.promptCode == "00") {
              save(saveParam)
                .then(res => {
                  if (res.code == 1) {
                    this.editor.execCommand("setmodel", {
                      modelType: "edit",
                      showToolbar: true
                    });
                    res.data.isNew = true;
                    if (editorType === "historyRecord") {
                      this.handlerUpdate(res.data, "jiwangRecord");
                    } else if (editorType === 'oldSystemRecord') {
                      this.handlerUpdate(res.data, "oldSystemRecord");
                    } else if (editorType === 'switchToHighBlood') {
                      this.handlerUpdate(res.data, "switchToHighBlood");
                    } else {
                      this.handlerUpdate(res.data);
                    }
                  } else {
                    this.$message.error(res.msg);
                  }
                })
                .catch(res => {
                  this.$message.error(res.msg);
                });
            } else if (res.data.promptCode == "02") {
              // this.$confirm(res.data.promptInformation, "提示", {
              //   confirmButtonText: "确定",
              //   cancelButtonText: "取消",
              //   type: "warning"
              // }).then(() => {

              // });

              //先删除
              let param = {
                mrId: res.data.mrId,
                dataVersion: res.data.dataVersion
              };
              let mrIdStr = res.data.mrId;
              removeMr(param)
                .then(async res => {
                  await this.deleteDiagList(mrIdStr);
                  if (res.code == 1) {
                    save(saveParam)
                      .then(res => {
                        if (res.code == 1) {
                          this.editor.execCommand("setmodel", {
                            modelType: "edit",
                            showToolbar: true
                          });
                          res.data.isNew = true;
                          if (editorType === "historyRecord") {
                            this.handlerUpdate(res.data, "jiwangRecord");
                          } else if (editorType === 'oldSystemRecord') {
                            this.handlerUpdate(res.data, "oldSystemRecord");
                          } else if (editorType === 'switchToHighBlood') {
                            this.handlerUpdate(res.data, "switchToHighBlood");
                          } else {
                            this.handlerUpdate(res.data);
                          }
                        } else {
                          this.$message.error(res.msg);
                        }
                      })
                      .catch(res => {
                        this.$message.error(res.msg);
                      });
                  } else {
                    this.$message.error(res.msg);
                  }
                })
                .catch(res => {
                  this.$message.error(res.msg);
                });
            } else if (
              res.data.promptCode == "01" ||
              res.data.promptCode == "03" ||
              res.data.promptCode == "04" ||
              res.data.promptCode == "05"
            ) {
              this.$alert(res.data.promptInformation, "提示", {
                confirmButtonText: "确定"
              });
            }
          } else {
            this.$message.error(res.msg || "查询文书是否是否已存在！");
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    showPopBox(editorContent, docData) {
      this.historyEmrContent = editorContent;
      this.historyDocData = {
        ...docData.exts,
        templateName: docData.exts.mrName.split('_')[0],
        createType: 'byPast',
        businessTime: new Date(),
        signLevel: docData.exts.signLvlCd,
        pastMrId: docData.exts.mrId,
        supDctId: docData.exts.supDctId || ''
      };
      var visDom = document.createElement("div"),
        paragraphele = [];
      visDom.innerHTML = editorContent;
      paragraphele = visDom.getElementsByClassName("paragraphele");
      for (var i = 0; i < paragraphele.length; i++) {
        // if (paragraphele[i].children[0].children.length == 0) {
        //   continue;
        // }
        // if (paragraphele[i].children[0].children[0].tagName == 'BR' && paragraphele[i].children[0].children.length == 1) {
        //   paragraphele[i].children[0].innerHTML =
        //   paragraphele[i].children[0].innerHTML +
        //   `<span class="quoteBtn" paragraphtype="${paragraphele[i].getAttribute(
        //     "paragraphtype"
        //   )}">引用</span>`;
        // } else {
        if (paragraphele[i].children.length === 0) break;
        paragraphele[i].children[0].outerHTML =
          `<span class="quoteBtn" paragraphtype="${paragraphele[i].getAttribute(
            "paragraphtype"
          )}">引用</span>` + paragraphele[i].children[0].outerHTML;
        // }
      }
      this.previewTempHtml = visDom.innerHTML;

      this.popShow = true;
    },
    quoteSelect() {
      // 引用选中的文字
      //     console.log(this.editorP.window.getSelection())
      // var text = this.editorP.execCommand("getselectcontent");
      console.log('this.selectionText.trim', this.selectionText.trim())
      if (!this.selectionText.trim()) {
        this.checkMrReplaceableAndCreate(this.historyDocData, 'historyRecord')
        this.judgeRefreshDiagAndF(this.insInfo.mrStaCd);
      } else {
        this.editor.execCommand("inserthtml", this.selectionText);
      }
      this.popShow = false;
    },
    async switchHighBloodFollowUpMethod() {
      const thirdRes = await getFrameUrlNew({
        identificationType: this.receivePatientData.identificationType || '1',
        identificationNum: this.receivePatientData.identificationNum,
        identificationName: this.receivePatientData.patientName
      });
      const { manageOrgCode, hypertensionCdId } = thirdRes.data.baseInfo ? thirdRes.data.baseInfo : {};

      if (!manageOrgCode) {
        this.$message.error('未查询到居民的健康档案，无需进行高血压随访');
        return;
      }

      let pamars = JSON.parse(getPamars());
      let hosID = '';
      if (pamars.hosId.slice(0, 1) === 'H') {
        hosID = pamars.hosId.slice(20, 33);
      } else {
        hosID = pamars.hosIdNum.slice(20, 33);
      }
      if (manageOrgCode !== hosID) {
        this.$message.error('该居民的健康档案当前不归本中心管理，无需进行高血压随访服务，请另选常规病历继续接诊');
        return;
      }

      if (!hypertensionCdId) {
        this.$message.error('该居民当前未建立高血压专案，如需随访请先建立‘专案’！');
        return;
      }

      const currenrtNode = this.$refs.insTree.$refs.docTree.getCurrentNode();
      const isHighBlood = currenrtNode.exts.typeCode === 'T_2104230001';
      if (isHighBlood) {
        this.$message.warning('当前文书已是高血压随访病历，无需切换');
        return;
      }

      const emrTreeData = this.$refs.insTree.tree;
      let emrList = [];
      emrTreeData.forEach(item => {
        emrList = emrList.concat(item.children)
      });
      const highBloodEmrIndex = emrList.findIndex(item => item.exts.typeCode === 'T_2104230001');
      if (highBloodEmrIndex === -1) {
        this.oridinaryEmrInfo = this.editor.execCommand('getoridinaryemrinfo');
        this.checkDeleAuth();
      } else {
        this.$confirm('已存在高血压随访记录，是否重新书写？', '提示', {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        }).then(() => {
          this.oridinaryEmrInfo = this.editor.execCommand('getoridinaryemrinfo');
          this.checkDeleAuth()
        })
      }
    },
    async checkDeleAuth() {
      const checkMrRes = await checkMrCreatedBy({ mrId: this.insInfo.mrId, createdBy: getUserId() });
      if (checkMrRes.code === 1) {
        if (checkMrRes.data == 'true') {
          const removeMrRes = await removeMr({ mrId: this.insInfo.mrId, dataVersion: this.insInfo.mrDataVersion });
          this.getHighBloodTemp();
        } else {
          const chkAppPersonRes = await chkAppPerson(this.insInfo.mrId);
          if (chkAppPersonRes.code === 1) {
            const removeMrRes = await removeMr({ mrId: this.insInfo.mrId, dataVersion: this.insInfo.mrDataVersion });
            this.getHighBloodTemp();
          } else {
            this.$message.warning("您没有删除当前文书的权限!");
          }
        }
      }
    },
    async getHighBloodTemp() {
      let params = {
        templateNameLike: '',
        diseaseId: '',
        typeCode: 'T_2104230001',
        typeGroupCode: '',
        visitType: '01',
        dnFlag: 1,
        age: this.receivePatientData.patientAge,
        sex: this.receivePatientData.patientGender,
        pageNo: 1,
        pageSize: 10000,
        currTenant: 1,
        currHos: 1,
        currDept: 1,
        currUser: 1,
        level0: 0,
        level1: 1,
        level2: 2,
        level9: 9
      };
      const res = await getUsableList(params);
      if (res.code === 1) {
        const highBloodTemp = res.data.filter(item => item.scopeLevelName === '医院')[0];
        const param = {
          templateName: highBloodTemp.templateName,
          businessTime: this.dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
          supDctId: '',
          typeCode: highBloodTemp.typeCode,
          templateCode: highBloodTemp.templateCode,
          signLevel: highBloodTemp.signLevel,
          templateVersion: highBloodTemp.templateVersion,
          createType: 'byTemp'
        };
        this.updateEditorHandler({ param, activeTab: 'switchToHighBlood' });
      } else {
        this.$message.error(res.msg || '获取模板失败');
      }
    }
  },
  beforeDestroy() {
    if (this.insInfo.mrId && this.insNum > 0  && this.insInfo.mrStaCd !== "02") {
      const editorContent = this.editor.getContent();
      this.currenrtNode = this.$refs.insTree.$refs.docTree.getCurrentNode();
      this.emrResult = this.editor.execCommand('gethypertensionfollowupemrinfo');
      this.save(editorContent, "02").then(res => {
        this.changeRecPatientData({});
      })
    }

    this.$root.eventHub.$off("managePlanInsert");
    this.$root.eventHub.$off("insertRecordHander");
    this.$root.eventHub.$off("deleteglHandler");
  }
};
</script>

<style lang="scss" scoped>
$treeWidth: 271px;

.container {
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.left {
  width: $treeWidth;
  background-color: #ffffff;
  height: 100%;
  float: left;
}
.left-mini {
  width: 30px;
  background-color: #f5f5f5;
  height: 100%;
  float: left;
  cursor: pointer;
  .special-icon {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    text-align: center;
    border-bottom: 1px solid #e4e4e4;
  }
  .text {
    margin-top: 10px;
    width: 100%;
    padding: 0 4px;
    text-align: center;
    font-size: 12px;
    word-wrap: break-word;
  }
}
.right {
  height: 100%;
  margin-left: $treeWidth;
  background-color: #ffffff;
}
/deep/ .el-dialog__body {
  padding: 20px;
  .down-margin {
    margin-top: 12px;
  }
  .el-form-item--medium .el-form-item__label {
    line-height: 36px;
  }
}

/** 模板气泡预览*/
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  .popover {
    padding-left: 8px;
    padding-right: 8px;
    width: 1000px;
    height: 800px;
    position: fixed;
    top: 50%;
    right: 200px;
    overflow: hidden;
    transform: translateY(-50%) scale(0.8);
    background: #fff;
    z-index: 9999;
    border: 1px solid #232d44;
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.7);
  }
  .quoteBtn {
    float: right;
    margin: 5px 20px;
    line-height: 32px;
    cursor: pointer;
    padding: 0 20px;

    border: 1px solid #aaa;
    color: #aaa;
    transition: all 0.3s;
    &:hover {
      color: $l-color-primary;
      border: 1px solid $l-color-primary;
      border-radius: 4px;
    }
  }
}
</style>
