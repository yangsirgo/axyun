<template>
  <div class="height100 width100 bg-center">
    <l-layout
      :toolBoxShow="false"
      :patientListShow="false"
      pageName="docSubmit"
    >
      <template #content>
        <div class="bg-contain width100 height100" id="card">
          <div class="m-contain height100">
            <l-common-search rightAreaWidth="210">
              <template slot="leftCon">
                <div class="common-item">
                  <l-formt-title
                    :label="isInOrOut === 'in' ? '住院号' : '就诊号'"
                  >
                    <el-input
                      class="searchWidth"
                      v-model="form.enId"
                    ></el-input>
                  </l-formt-title>
                </div>
                <div class="common-item">
                  <l-formt-title label="患者姓名">
                    <el-input
                      class="searchWidth"
                      v-model="form.patientNm"
                    ></el-input>
                  </l-formt-title>
                </div>
                <div class="common-item">
                  <l-formt-title label="文书名称">
                    <el-input
                      class="searchWidth"
                      placeholder="输入文书名称"
                      v-model="form.mrNm"
                    ></el-input>
                  </l-formt-title>
                </div>
                <div class="common-item" v-if="applyFlag">
                  <l-formt-title label="申请人">
                    <el-input
                      class="searchWidth"
                      placeholder="输入申请人"
                      v-model="form.appPersNm"
                    ></el-input>
                  </l-formt-title>
                </div>
                <div class="common-item" style="width: 240px">
                  <l-formt-title label="申请状态">
                    <el-select
                      multiple
                      collapse-tags
                      v-model="form.chkStatus"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </l-formt-title>
                </div>
                <div class="common-item" style="width: 450px">
                  <l-formt-title label="申请时间">
                    <el-date-picker
                      clearable
                      v-model="archiveRange"
                      :picker-options="pickerOptions"
                      type="datetimerange"
                      align="right"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="~"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :default-time="['08:00:00', '23:59:59']"
                    >
                    </el-date-picker>
                  </l-formt-title>
                </div>
              </template>
              <template slot="rightCon">
                <div class="search-btns">
                  <el-button type="primary" @click="queryTableList"
                    >查询
                  </el-button>
                  <el-button type="primary" plain @click="resetData()"
                    >重置
                  </el-button>
                </div></template
              ></l-common-search
            >
            <div class="choose-con clearfix">
              <h2 class="table-title">病历维护列表</h2>
              <div class="search-btns">
                <el-button
                  @click="newApply"
                  :disabled="isAdd"
                  v-if="isApplyOrApprove != 'approve'"
                  >新增维护申请
                </el-button>
                <el-button
                  @click="handleDeleteApply"
                  :disabled="isSendAdd"
                  v-if="isApplyOrApprove != 'approve'"
                  >删除
                </el-button>
                <el-button
                  @click="handleSendApply"
                  :disabled="isSendAdd"
                  v-if="isApplyOrApprove != 'approve'"
                  >发送申请
                </el-button>
                <el-button
                  :disabled="isRecall"
                  @click="handleRecall"
                  v-if="isApplyOrApprove != 'approve'"
                  >撤销申请
                </el-button>
                <el-button
                  :disabled="isShow && maintenanceParams.listType === '1'"
                  @click="handleOpenApply"
                >
                  {{
                    !isSendAdd && maintenanceParams.listType === "1"
                      ? "修改申请"
                      : "查看申请"
                  }}
                </el-button>
                <el-button
                  @click="openV"
                  :disabled="isOpenV"
                  v-if="isApplyOrApprove != 'approve'"
                  >打开
                </el-button>
                <el-button
                  @click="handleApprove"
                  :disabled="isApprove"
                  plain
                  v-if="isApplyOrApprove != 'apply'"
                  >审批
                </el-button>
              </div>
            </div>
            <!-- 表格部分 -->
            <div class="table-con">
              <l-table
                :total="pageParams.total"
                :pageSize.sync="pageParams.pageSize"
                :page.sync="pageParams.pageNo"
                :layout="layout"
                :singlePageShow="true"
                @changeSize="changeSize"
              >
                <el-table
                  stripe
                  :data="eleData"
                  width="100%"
                  height="100%"
                  border
                  ref="recordMaintenance"
                  v-loading="tlm_isLoading"
                  highlight-current-row
                  empty-text="暂无数据"
                  @row-click="selectRow"
                  @current-change="handleCurrentChange"
                  element-loading-text="加载中..."
                  @row-dblclick="rowDoubleClickHandle"
                >
                  <el-table-column
                    fixed="left"
                    :index="indexMethod"
                    type="index"
                    width="50"
                    label="序号"
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
                  >
                    <template slot-scope="scope">
                      <div v-if="item.prop === 'chkStatus'">
                        <span
                          :val="scope.row.chkStatus"
                          code="checkStatus"
                          v-codeTransformEmr
                        ></span>
                      </div>
                      <div v-else-if="item.prop === 'chkTime'">
                        <span>{{
                          scope.row.chkTime ? scope.row.chkTime : ""
                        }}</span>
                      </div>
                      <div v-else-if="item.prop === 'expiredTime'">
                        <span v-if="scope.row.expiredTime % 24 === 0">{{
                          scope.row.expiredTime
                            ? scope.row.expiredTime / 24 + "天"
                            : ""
                        }}</span>
                        <span v-else>{{
                          scope.row.expiredTime
                            ? scope.row.expiredTime + "小时"
                            : ""
                        }}</span>
                      </div>
                      <div v-else-if="item.prop === 'sex'">
                        <span
                          :val="scope.row.sex"
                          code="GENDER_CODE"
                          v-codeTransformEmr
                        ></span>
                      </div>
                      <div v-else-if="item.prop === 'appPerson'">
                        <span
                          v-if="scope.row.appPerson"
                          tableName="sys_user"
                          :conditionMap="{ id: scope.row.appPerson }"
                          columns="name"
                          v-tableTransformEmr
                        ></span>
                      </div>
                      <div v-else-if="item.prop === 'appDept'">
                        <span
                          v-if="scope.row.appDept"
                          tableName="sys_org"
                          :conditionMap="{ id: scope.row.appDept }"
                          columns="org_nm"
                          v-tableTransformEmr
                        ></span>
                      </div>
                      <div v-else-if="item.prop === 'chkPerson'">
                        <span
                          v-if="scope.row.chkPerson"
                          tableName="sys_user"
                          :conditionMap="{ id: scope.row.chkPerson }"
                          columns="name"
                          v-tableTransformEmr
                        ></span>
                      </div>
                      <div v-else-if="item.prop === 'chkDept'">
                        <span
                          v-if="scope.row.chkDept"
                          tableName="sys_org"
                          :conditionMap="{ id: scope.row.chkDept }"
                          columns="org_nm"
                          v-tableTransformEmr
                        ></span>
                      </div>
                      <div v-else-if="item.prop === 'appReason'">
                        <span
                          :val="scope.row.appReason"
                          code="RecordMaintenanceApplyReason"
                          v-codeTransformEmr
                        ></span>
                      </div>
                      <div v-else>{{ scope.row[item.prop] }}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </l-table>
            </div>
          </div>
          <!--          编辑器-->
          <el-card
            class="height-bottom"
            v-if="editBottom === '0'"
            :style="{ bottom: editBottom }"
            v-loading="templateLoading"
          >
            <div class="top">
              <l-card-title>
                <span slot="left">文书详情</span>
              </l-card-title>
              <el-button
                class="btn-position-left"
                @click="handlerDelEditor"
                v-show="currentRow.appReason && currentRow.appReason === '2'"
                >删除文书
              </el-button>
              <el-button class="btn-position" @click="hiddenEditTemplate"
                >关闭
              </el-button>
            </div>
            <div
              class="clearfix"
              style="width: 100%; height: calc(100% - 65px)"
            >
              <div class="tool-right" :style="{ width: toolWidth }">
                <tool-box
                  boxName="StructureTree"
                  :containerWidth="360"
                  :refrehTree.sync="refrehTree"
                  :modules="modules"
                  :open.sync="openFlag"
                  :treeData="treeData"
                  :recordName="recordName"
                  :visitType="visitType"
                  :editor="axeditor"
                  :isHome="isHome"
                  :mainDiag="mainDiag"
                  @message="messageHandler"
                  @showPop="showPopHandler"
                />
              </div>
              <div class="editor-left" :style="{ width: editorWidth }">
                <!-- 编辑器组件-->
                <opEmr
                  ref="emr"
                  :mrIdProp="mrIdProp"
                  :mode="modeType"
                  :isHome="isHome"
                  :thirdPatientId="thirdPatientId"
                  :thirdNum="thirdNum"
                  :propsPatientId="patientId"
                  @deleteRecord="deleteRecordHandler"
                  @showStructureTree="showStructureTree"
                  @refreshTemplate="refreshTemplate"
                />
              </div>
            </div>
          </el-card>
          <!-- 申请查询-->
          <el-card
            class="height-bottom"
            :style="{ bottom: bottom }"
            v-loading="templateLoading"
          >
            <div class="top">
              <l-card-title>
                <span slot="left">病历文书查询列表</span>
              </l-card-title>
              <el-button class="btn-position" @click="hiddenTemplate"
                >关闭
              </el-button>
            </div>
            <applyDialog
              ref="apply"
              @handle-apple="addApply"
              @handle-update="handleSave"
              :params="maintenanceParams"
            ></applyDialog>
          </el-card>
          <innerContain
            :isShow.sync="innerVisible"
            :isHome="isHome"
            :template="appTemplate"
            :params="maintenanceParams"
            @handle-app-save="handleAppSave"
          ></innerContain>
          <approveDialog
            :params="maintenanceParams"
            :isShow.sync="approveVisible"
            :temple="approveTemple"
            @handle-save="handleSave"
            @handle-update="handleSave"
          />
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import ToolBox from "@/views/public/tools/emrTools";
import opEmr from "../opEmr.vue";
import approveDialog from "./components/approveDialog";
import applyDialog from "./components/applyDialog";
import innerContain from "./components/innerContain";

import { getHistoryDiagList } from "@/api/emrRecord/tools/historicalDiagnosis.js";
import {
  getByParamsInPage,
  multiSendApply,
  multiRecallApply,
  deleteById
} from "@/api/emrRecord/emr/maintainApply";

import { getUId } from "@/utils/crypto";
import { getRole } from "@/utils/auth";

export default {
  name: "",
  components: { approveDialog, applyDialog, innerContain, ToolBox, opEmr },
  data() {
    return {
      isHome: null,
      currentRow: {},
      // 编辑器
      modeType: "menzhen",
      defaultChkStatus: "", // 默认查询状态 审核界面 状态 只有 申请、通过、拒绝的数据
      toolWidth: "360px",
      editorWidth: "calc(100% - 370px)",
      //工具箱
      showToolBox: false,
      modules: [],
      refrehTree: true,
      openFlag: true,
      recordName: "",
      // 按钮相关
      isAdd: false,
      isSendAdd: false,
      isRecall: false,
      isShow: false,
      isOpenV: false,
      isApprove: false,
      // 申请单数据
      appTemplate: {},
      isApplyOrApprove: "default",
      isInOrOut: "default",
      templateLoading: false,

      archiveRange: "",
      showContain: false,
      approveVisible: false,
      applyTemple: {},
      approveTemple: {},
      //  后续添加部分
      defaultMsg: "",
      axeditor: null,
      editBottom: "-100%",
      bottom: "-100%",
      layout: "total,prev,pager,next,jumper",
      eleData: [],
      tlm_isLoading: false,
      innerVisible: false,
      pageParams: {
        pageSize: 20,
        pageNo: 1,
        total: 0
      },
      form: {
        patientNm: "",
        enId: "",
        chkStatus: "",
        startTime: "",
        endTime: "",
        mrNm: "",
        appPersNm: ""
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      options: [
        { label: "新建", value: "0" },
        { label: "申请", value: "1" },
        { label: "取消申请", value: "2" },
        { label: "通过", value: "3" },
        { label: "拒绝", value: "4" }
      ],

      eleParams: [],
      treeData: [],
      defaultTreeProps: {
        children: "children",
        label: "label"
      },
      maintenanceParams: {},
      mrIdProp: "",
      mainDiag: "",
      applyFlag: true,
      thirdNum: "",
      thirdPatientId: ""
    };
  },
  computed: {
    visitType() {
      return this.isInOrOut === "in" ? "04" : "01";
    },
    patientId() {
      return this.$refs.recordMaintenance.selection[0].patientId
    }
  },
  watch: {
    openFlag: {
      handler(val) {
        if (val) {
          this.editorWidth = "calc(100% - 370px)";
          this.toolWidth = "360px";
        } else {
          this.editorWidth = "calc(100% - 60px)";
          this.toolWidth = "50px";
        }
      },
      immediate: true
    }
  },
  created() {
    // 路由为inRecordMaintenanceApply
    if (this.$route.path.indexOf("inRecordMaintenanceApply") != -1) {
      this.isApplyOrApprove = "apply";
      this.isInOrOut = "in";
      this.isHome = "1";
      this.applyFlag = false;
    }
    if (this.$route.path.indexOf("inRecordMaintenanceApplyApprove") != -1) {
      this.isApplyOrApprove = "approve";
      this.isInOrOut = "in";
      this.isHome = "1";
      this.applyFlag = true;
    }
    if (this.$route.path.indexOf("outRecordMaintenanceApply") != -1) {
      this.isApplyOrApprove = "apply";
      this.isInOrOut = "out";
      this.isHome = "0";
      this.applyFlag = false;
    }
    if (this.$route.path.indexOf("outRecordMaintenanceApplyApprove") != -1) {
      this.isApplyOrApprove = "approve";
      this.isInOrOut = "out";
      this.isHome = "0";
      this.applyFlag = true;
    }
    this.modeType = this.isInOrOut === "in" ? "zhuyuan" : "menzhen";
    // 设置参数 该参数会给申请列表传递
    this.maintenanceParams = {
      visitType: this.isInOrOut === "in" ? "04" : "01", //  就诊类型 01 门诊 04 住院
      listType:
        this.isApplyOrApprove === "apply"
          ? "1"
          : this.isApplyOrApprove === "approve"
          ? "2"
          : "default" // 列表类型 1-申请列表（必区分就诊类型） 2-审批列表（根据系统配置是否区分就诊类型）
    };
    if (this.maintenanceParams.listType === "1") {
      this.options = [
        { label: "新建", value: "0" },
        { label: "申请", value: "1" },
        { label: "取消申请", value: "2" },
        { label: "通过", value: "3" },
        { label: "拒绝", value: "4" },
        { label: "完成", value: "9" }
      ];
    } else {
      this.options = [
        { label: "申请", value: "1" },
        { label: "通过", value: "3" },
        { label: "拒绝", value: "4" },
        { label: "完成", value: "9" }
      ];
    }
    if (this.maintenanceParams.visitType === "04") {
      this.eleParams = [
        {
          prop: "patientNm",
          label: "患者姓名",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "100"
        },
        {
          prop: "enNo",
          label: "住院号",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "150"
        },
        {
          prop: "mrNm",
          label: "文书名称",
          align: "left",
          fixed: "left",
          headerAlign: "left",
          width: "160"
        },
        {
          prop: "chkStatus",
          label: "申请状态",
          align: "left",
          headerAlign: "left",
          width: "80",
          fixed: "left"
        },

        {
          prop: "appTime",
          label: "申请时间",
          align: "left",
          headerAlign: "left",
          width: "160"
        },
        {
          prop: "appPerson",
          label: "申请人姓名",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "appDept",
          label: "申请科室",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "appReason",
          label: "申请原因",
          align: "left",
          headerAlign: "left",
          width: "120"
        },

        {
          prop: "chkPerson",
          label: "审批人",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "chkDept",
          label: "审批科室",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "chkTime",
          label: "审批时间",
          align: "left",
          headerAlign: "left",
          width: "160"
        },
        {
          prop: "expiredTime",
          label: "维护期限",
          align: "left",
          headerAlign: "left",
          width: "80",
          fixed: "left"
        },
        {
          prop: "chkAdv",
          label: "审批意见",
          align: "left",
          headerAlign: "left",
          width: "120"
        }
      ];
    } else {
      this.eleParams = [
        {
          prop: "patientNm",
          label: "患者姓名",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "100"
        },
        {
          prop: "enNo",
          label: "就诊号",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "150"
        },
        {
          prop: "mrNm",
          label: "文书名称",
          align: "left",
          fixed: "left",
          headerAlign: "left",
          width: "160"
        },
        {
          prop: "chkStatus",
          label: "申请状态",
          align: "left",
          headerAlign: "left",
          width: "80",
          fixed: "left"
        },

        {
          prop: "appTime",
          label: "申请时间",
          align: "left",
          headerAlign: "left",
          width: "160"
        },
        {
          prop: "appPerson",
          label: "申请人姓名",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "appDept",
          label: "申请科室",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "appReason",
          label: "申请原因",
          align: "left",
          headerAlign: "left",
          width: "120"
        },

        {
          prop: "chkPerson",
          label: "审批人",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "chkDept",
          label: "审批科室",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "chkTime",
          label: "审批时间",
          align: "left",
          headerAlign: "left",
          width: "160"
        },
        {
          prop: "expiredTime",
          label: "维护期限",
          align: "left",
          headerAlign: "left",
          width: "80",
          fixed: "left"
        },
        {
          prop: "chkAdv",
          label: "审批意见",
          align: "left",
          headerAlign: "left",
          width: "120"
        }
      ];
    }
    this.defaultChkStatus =
      this.isApplyOrApprove === "apply" ? [] : ["1", "3", "4", "9"];
    this.fetchData();
  },
  methods: {
    messageHandler(data, res) {
      if (data === "insertCheckRes") {
        // 检验
        this.$refs.emr.insertinspection(res);
      } else if (data === "insertCheck") {
        // 检查
        this.$refs.emr.insertCheckRes(res);
      } else if (data === "insertPreviousFunc") {
        this.$refs.emr.insertPreviousFunc(res);
      } else if (data === "insertPrevious") {
        this.$refs.emr.insertPrevious(res);
      } else if (data === "insertDiagnoses") {
        this.$refs.emr.insertDiagnoses(res);
      } else if (data === "insertHistorical") {
        this.$refs.emr.insertHistorical(res);
      } else if (data === "pastDocumentClick") {
        this.$refs.emr.$refs.insTree.handleNodeClick(res);
        this.$refs.emr.$refs.insTree.pickUp();
      }
    },
    deleteRecordHandler() {
      this.hiddenEditTemplate();
    },
    handlerDelEditor() {
      this.$refs.emr && this.$refs.emr.handlerDel();
    },
    showStructureTree(instance) {
      this.axeditor = instance;

      this.modules = [
        "Phrase",
        "StructureTree",
        "ManagePlan",
        "HealthPrescribe",
        "HistoricalDiagnosis",
        "PreviousOrder",
        "PastDocument",
        "InspectionResults",
        "CheckResult",
        "MedicalExpression",
        "SpecialSymbol"
      ];
    },
    refreshTemplate() {},
    resetButton() {
      this.isAdd = false;
      this.isSendAdd = false;
      this.isRecall = false;
      this.isShow = false;
      this.isOpenV = false;
      this.isApprove = false;
    },
    //新增
    //新增申请
    newApply() {
      this.applyTemple = {};
      this.bottom = "0";
      this.$refs.apply.handleQuery();
    },

    // 删除按钮
    handleDeleteApply() {
      this.$confirm("该操作将删除所选申请", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log("aaaaaaa")
          this.delete();
        })
        .catch(error => {
          // console.log("aaaaaaa",error)
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delete() {
      this.tlm_isLoading = true;
      deleteById(this.$refs.recordMaintenance.selection[0].mrMtAppId)
        .then(resData => {
          let data = resData.data;
          if (resData.code === 1 && data) {
            this.$message.success("删除成功！");
            this.fetchData();
          } else {
            this.$message(resData.msg || "病历维护删除报错");
          }
        })
        .catch(error => {
          console.log(error);

          this.$message(error || error.msg || "查询接口报错");
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },
    // 查看
    handleOpenApply() {
      if (this.$refs.recordMaintenance.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      if (this.$refs.recordMaintenance.selection.length > 1) {
        this.$message("只能选中一条数据");
        return;
      }
      this.appTemplate = this.$refs.recordMaintenance.selection[0];
      this.innerVisible = true;
    },

    //发送申请
    handleSendApply() {
      // this.resetButton();
      if (this.$refs.recordMaintenance.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      this.$confirm("该操作将发送所选申请", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.sendApply();
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: "已取消发送申请！"
          });
        });
    },
    sendApply() {
      let applyList = [];
      let _role = JSON.parse(getRole());
      // console.log("params====",params);
      // console.log("_role====",_role);
      for (let i = 0; i < this.$refs.recordMaintenance.selection.length; i++) {
        // 新建状态的 申请才允许 提交申请
        if (
          this.$refs.recordMaintenance.selection[i].chkStatus != "0" &&
          this.$refs.recordMaintenance.selection[i].chkStatus != "2"
        ) {
          this.$message("只有新建、取消申请状态的申请，才允许发送申请！");
          return;
        }
        applyList.push({
          ...this.$refs.recordMaintenance.selection[i],
          appTime: new Date(),
          appPerson: getUId(),
          appDept: _role.deptId,
          chkStatus: "1"
        });
      }
      this.tlm_isLoading = true;
      multiSendApply(applyList)
        .then(resData => {
          let data = resData.data;
          if (resData.code === 1 && data) {
            this.$message.success("操作成功！");
            this.fetchData();
          } else {
            this.$message(resData.msg || "接口报错");
          }
        })
        .catch(error => {
          console.log(error);

          this.$message(error || error.msg || "接口报错");
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },

    //撤销
    handleRecall() {
      if (this.$refs.recordMaintenance.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let state = true;
      for (let i = 0; i < this.$refs.recordMaintenance.selection.length; i++) {
        if (
          this.$refs.recordMaintenance.selection[i].chkStatus != "0" &&
          this.$refs.recordMaintenance.selection[i].chkStatus != "1"
        ) {
          this.$message("记录状态不对，只有新建、申请状态的信息可以撤销申请！");
          state = false;
          break;
        }
      }
      if (state) {
        this.$confirm("该操作将撤销所选申请", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.recall();
          })
          .catch(error => {
            this.$message({
              type: "info",
              message: "已取消撤销申请"
            });
          });
      } else {
        return;
      }
    },
    recall() {
      this.tlm_isLoading = true;
      multiRecallApply(this.$refs.recordMaintenance.selection)
        .then(resData => {
          console.log("resData", resData);
          if (resData.code === 1) {
            this.$message("撤销申请成功！");
            this.fetchData();
          } else {
            this.$message(resData.msg || "查询接口报错");
          }
        })
        .catch(error => {
          console.log(error);

          this.$message(error || error.msg || "查询接口报错");
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },

    //申请审批
    handleApprove() {
      if (this.$refs.recordMaintenance.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      if (this.$refs.recordMaintenance.selection.length > 1) {
        this.$message("只能选择一条数据");
        return;
      }
      if (this.$refs.recordMaintenance.selection[0].chkStatus == "3") {
        this.$message("该申请已通过审核！");
        return;
      }
      if (this.$refs.recordMaintenance.selection[0].chkStatus == "4") {
        this.$message("该申请已拒绝！");
        return;
      }
      if (
        this.$refs.recordMaintenance.selection[0].chkStatus != "0" &&
        this.$refs.recordMaintenance.selection[0].chkStatus != "1"
      ) {
        this.$message("记录状态不对，只有新建、申请状态的信息可以进行审核！");
        return;
      }
      this.approveVisible = true;
      this.approveTemple = this.$refs.recordMaintenance.selection[0];
    },
    // 获取打开文书的主诊断
    async getMainDiag(obj) {
      let param = {
        paId: obj.patientId,
        visitType: this.isHome === "1" ? "04" : "01",
        enNo: obj.enNo,
        isHome: this.isHome
      };

      const { code, data, msg } = await getHistoryDiagList(param);

      if (code === 1) {
        let findIndex = data.findIndex(item => item.mainF == "1");
        if (findIndex >= 0) {
          this.mainDiag = data[findIndex].diagNm;
        }
      }
    },
    //打开编辑器
    async openV() {
      if (this.$refs.recordMaintenance.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      if (this.$refs.recordMaintenance.selection.length > 1) {
        this.$message("只能选择一条数据");
        return;
      }
      this.currentRow = this.$refs.recordMaintenance.selection[0];
      await this.getMainDiag(this.currentRow);
      if (
        this.currentRow.chkStatus != "3" &&
        this.currentRow.chkStatus != "9"
      ) {
        this.$message("只有审核通过的记录可以查看！");
        return;
      }
      // 审核时间到
      let nowDate = this.dayjs().format("YYYY-MM-DD HH:mm:ss");
      let diff = this.dayjs(nowDate).diff(
        this.dayjs(this.currentRow.chkTime),
        "hour"
      );
      // console.log("nowDate===",nowDate);
      // console.log("chkTime===",this.$refs.recordMaintenance.selection[0].chkTime);
      // console.log("diff===",diff);
      if (this.currentRow.expiredTime <= diff) {
        this.$message("已超过查看时间，无法继续查看！");
        return;
      }
      this.editBottom = "0";
      this.initRecord(this.currentRow);
    },

    showPopHandler(data) {
      this.$refs.emr.showPopBox(data);
    },

    //病案查询界面 返回申请数据
    addApply(val) {
      this.appTemplate = val;
      this.innerVisible = true;
    },

    // 单独查看
    handleAppSave() {
      this.innerVisible = false;
      this.fetchData();
    },

    // table 表相关操作
    queryTableList() {
      this.pageParams.pageNo = 1;
      this.fetchData();
    },

    fetchData() {
      if (this.archiveRange.length > 0) {
        this.form.startTime = this.archiveRange[0].toLocaleString();
        this.form.endTime = this.archiveRange[1].toLocaleString();
      }
      // 请求数据
      let data = {
        ...this.maintenanceParams,
        ...this.form,
        ...this.pageParams,
        chkStatus:
          this.form.chkStatus.length === 0
            ? this.defaultChkStatus
            : this.form.chkStatus
      };
      this.tlm_isLoading = true;
      getByParamsInPage(data)
        .then(resData => {
          let data = resData.data;
          if (resData.code === 1 && data) {
            this.pageParams.total = resData.total;
            this.eleData = data;
          } else {
            this.$message(resData.msg || "查询接口报错");
          }
        })
        .catch(error => {
          console.log(error);

          this.$message(error || error.msg || "查询接口报错");
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },

    resetData() {
      for (let i in this.form) {
        this.form[i] = "";
      }
      this.archiveRange = [];
      this.resetButton();
    },

    handleCurrentChange(row) {
      if (row == null) {
        return;
      }
      // 0 新增 1 申请 、2 取消 、3 通过 4 拒绝 9 完成
      if (row.chkStatus == "0") {
        this.isAdd = false;
        this.isSendAdd = false;
        this.isRecall = true;
        this.isShow = false;
        this.isOpenV = true;
        this.isApprove = true;
      } else if (row.chkStatus == "1") {
        this.isAdd = false;
        this.isSendAdd = true;
        this.isRecall = false;
        this.isShow = false;
        this.isOpenV = true;
        this.isApprove = false;
      } else if (row.chkStatus == "2") {
        this.isAdd = false;
        this.isSendAdd = false;
        this.isRecall = true;
        this.isShow = false;
        this.isOpenV = true;
        this.isApprove = true;
      } else if (row.chkStatus == "3") {
        this.isAdd = false;
        this.isSendAdd = true;
        this.isRecall = true;
        this.isShow = false;
        this.isOpenV = false;
        this.isApprove = true;
      } else if (row.chkStatus == "4") {
        this.isAdd = false;
        this.isSendAdd = true;
        this.isRecall = true;
        this.isShow = false;
        this.isOpenV = true;
        this.isApprove = true;
      } else if (row.chkStatus == "9") {
        if (row.appReason == "2") {
          this.isOpenV = true;
        } else {
          this.isOpenV = false;
        }
      }
    },
    selectRow(row, column, event) {
      this.$refs.recordMaintenance.clearSelection();
      this.$refs.recordMaintenance.toggleRowSelection(row);
    },
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    rowDoubleClickHandle(row) {
      if (this.isApplyOrApprove === "approve") {
        return;
      }
      this.openV();
      // if (row.chkStatus != "3") {
      //   this.$message("只有审核通过的记录可以查看！");
      //   return;
      // }
      // this.editBottom = "0";
      // this.initRecord(row);
    },
    hiddenEditTemplate() {
      this.editBottom = "-100%";
      this.$refs.emr.changeLocalVairlHandler(false);
      this.queryTableList();
    },

    // 隐藏申请界面
    hiddenTemplate() {
      this.bottom = "-100%";
      this.fetchData();
    },

    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.fetchData();
    },
    initRecord(row) {
      this.$nextTick(() => {
        this.$refs.emr.changeLocalVairlHandler(true);
        this.mrIdProp = row.mrId;
        this.thirdPatientId = row.patientId;
        this.thirdNum = row.enNo;
        // this.$refs.emr.getPatientInfo({ enNo: row.enNo });
      });
    },
    handleSave() {
      this.fetchData();
    }
  }
};
</script>

<style lang="scss" scoped>
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 2px;

  .m-contain {
    padding: 20px;
    box-sizing: border-box;
    font-size: 0;

    .choose-con {
      padding-top: 20px;

      .table-title {
        font-size: 16px;
        float: left;
      }

      .search-con {
        width: calc(100% - 180px);
        float: left;

        .common-item {
          margin-right: 10px;
          margin-top: 10px;
          display: inline-block;
          width: 260px;
        }
      }

      .search-btns {
        width: auto;
        float: right;
      }
    }

    .table-con {
      margin-top: 10px;
      height: calc(100% - 150px);
    }
  }
}

.height-bottom {
  background: #ffffff;
  position: absolute;
  left: 0px;
  z-index: 100;
  width: 100%;
  height: 100%;
  transition: all 0.5s;

  .top {
    padding: 10px 10px;
    position: relative;
    height: 44px;

    .btn-position {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .btn-position-left {
      position: absolute;
      top: 10px;
      right: 80px;
    }
  }
  .editor-left {
    height: 100%;
  }
  .tool-right {
    float: right;
    width: 300px;
    height: 100%;
  }
}

/deep/ .el-col {
  padding-left: 0 !important;
}

/deep/ .el-tabs {
  height: calc(100% + 50px);
}

/deep/ .el-tabs__content {
  height: calc(100% + 50px);
}
</style>
