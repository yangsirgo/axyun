<template>
  <div class="tgm-container height100">
    <flow-menu>
      <el-card class="left">
        <div style="margin: 16px 12px">
          <div class="top-btn-con">
            <div class="item-btns">
              <el-tooltip effect="light" content="新建" placement="top">
                <el-button
                  icon="iconfont iconxinzeng"
                  class="little-button"
                  @click="createGroup"
                ></el-button>
              </el-tooltip>
            </div>

            <div class="item-btns">
              <el-tooltip effect="light" content="删除" placement="top">
                <el-button
                  icon="iconfont iconshanchu"
                  class="little-button"
                  @click="handleDeleteG"
                ></el-button>
              </el-tooltip>
            </div>

            <div class="item-btns">
              <el-tooltip effect="light" content="编辑" placement="top">
                <el-button
                  icon="iconfont el-icon-setting"
                  class="little-button"
                  @click="editGroup"
                ></el-button>
              </el-tooltip>
            </div>

            <div class="item-btns">
              <el-tooltip effect="light" content="刷新" placement="top">
                <el-button
                  icon="iconfont iconshuaxin"
                  class="little-button"
                  @click="refreshGroup"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
          <el-dialog
            :title="tgDialogMode"
            :visible.sync="createTypeGroupDialog"
            :close-on-click-modal="false"
            width="480px"
          >
            <div style="width: 480px; padding: 12px 24px">
              <el-row style="margin-top: 12px">
                <el-col :span="5"
                  ><span
                    style="line-height: 30px; margin-left: 1em"
                    class="necessary-control"
                    >类别编码</span
                  ></el-col
                >
                <el-col :span="19"
                  ><el-input
                    :disabled="mngPlanTpCdFlag"
                    v-model="createTypeGroupData.mngPlanTpCd"
                    style="width: 300px"
                  ></el-input
                ></el-col>
              </el-row>
              <el-row style="margin-top: 8px">
                <el-col :span="5"
                  ><span
                    style="line-height: 30px; margin-left: 1em"
                    class="necessary-control"
                    >类别名称</span
                  ></el-col
                >
                <el-col :span="19">
                  <el-input
                    v-model="createTypeGroupData.mngPlanTpNm"
                    style="width: 300px"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 8px">
                <el-col :span="5">
                  <span style="line-height: 30px; margin-left: 2em"
                    >拼音码</span
                  >
                </el-col>
                <el-col :span="19"
                  ><el-input
                    v-model="createTypeGroupData.pinyinCd"
                    style="width: 300px"
                  ></el-input
                ></el-col>
              </el-row>
              <el-row style="margin-top: 8px">
                <el-col :span="5"
                  ><span style="line-height: 30px; margin-left: 2em"
                    >五笔码</span
                  ></el-col
                >
                <el-col :span="19">
                  <el-input
                    v-model="createTypeGroupData.wubiCd"
                    style="width: 300px"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 8px">
                <el-col :span="5"
                  ><span style="line-height: 30px; margin-left: 2em"
                    >助记码</span
                  ></el-col
                >
                <el-col :span="19">
                  <el-input
                    v-model="createTypeGroupData.customCd"
                    style="width: 300px"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 8px">
                <el-col :span="5"
                  ><span
                    style="line-height: 30px; margin-left: 2em"
                    class="necessary-control"
                    >排序码</span
                  ></el-col
                >
                <el-col :span="19">
                  <el-input
                    v-model="createTypeGroupData.sortNo"
                    style="width: 300px"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 8px">
                <el-col :span="5"
                  ><span style="line-height: 30px; margin-left: 3em"
                    >描述</span
                  ></el-col
                >
                <el-col :span="19"
                  ><el-input
                    type="textarea"
                    :rows="2"
                    v-model="createTypeGroupData.description"
                    style="width: 300px"
                  ></el-input
                ></el-col>
              </el-row>
            </div>
            <div slot="footer">
              <el-button type="primary" @click="typeGroupDetermine"
                >确定</el-button
              >
              <el-button @click="cancalHandler">取消</el-button>
            </div>
          </el-dialog>
        </div>
        <div style="margin: 10px; overflow: auto">
          <el-tree
            ref="groupTree"
            node-key="id"
            :data="tree"
            :props="defaultProps"
            :default-expand-all="true"
            v-loading="loading"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </el-card>
      <el-card class="right">
        <div style="padding: 8px 16px">
          <div class="search-con clearfix">
            <div class="search-main float-left">
              <div class="common-width margin-top-10">
                <l-formt-title label="计划分类">
                  <el-select
                    v-model="queryTypeListParam.mngPlanTpCd"
                    placeholder="请选择"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in typeGroupOptions"
                      :key="item.mngPlanTpCd"
                      :label="item.mngPlanTpNm"
                      :value="item.mngPlanTpCd"
                    >
                    </el-option>
                  </el-select>
                </l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="关键字">
                  <el-input
                    placeholder="请输入名称、拼音、五笔或助记码"
                    v-model="queryTypeListParam.key"
                  ></el-input
                ></l-formt-title>
              </div>
            </div>
            <div class="float-right margin-top-10">
              <el-button class="el-button--primary" @click="queryFirstNo"
                >查询</el-button
              >
              <el-button class="el-button--default" @click="clearCondition"
                >重置</el-button
              >
            </div>
          </div>
        </div>
        <div
          style="
            height: calc(100% - 60px);
            margin-top: 8px;
            padding: 8px 16px;
            border-top: 1px solid #dcdfe6;
          "
        >
          <div class="iconBtn">
            <l-card-title>
              <template slot="left">管理计划列表</template>
              <div slot="right">
                <el-button @click="createType" icon="el-icon-plus"
                  >新建</el-button
                >

                <el-button icon="el-icon-edit-outline" @click="modifyType"
                  >编辑</el-button
                >

                <el-button icon="el-icon-remove-outline" @click="handelDeleteT"
                  >删除</el-button
                >
              </div>
            </l-card-title>
          </div>
          <div style="margin-top: 8px; height: calc(100% - 40px)">
            <l-table
              :total="pageParams.total"
              :pageSize.sync="pageParams.pageSize"
              :page.sync="pageParams.pageNo"
              :layout="layout"
              :singlePageShow="true"
              @changeSize="changeSize"
            >
              <el-table
                :data="typeTable"
                ref="typeTable"
                border
                stripe
                height="100%"
                style="width: 100%"
                v-loading="loading1"
                element-loading-background="rgba(255, 255, 255, 0.5)"
                @row-click="handleRowClick"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="50px"
                ></el-table-column>
                <el-table-column
                  type="index"
                  label="序号"
                  :index="indexMethod"
                  width="55px"
                ></el-table-column>
                <el-table-column
                  prop="mngPlanCd"
                  label="计划编码"
                  width="160px"
                ></el-table-column>
                <el-table-column
                  prop="mngPlanNm"
                  label="计划名称"
                  width="160px"
                ></el-table-column>
                <el-table-column
                  prop="scopeLevel"
                  label="所属类别"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <span
                      :val="scope.row.scopeLevel"
                      code="LevelType"
                      v-codeTransformEmr
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="mngPlanTpNm"
                  label="计划类别"
                  width="160px"
                ></el-table-column>
                <el-table-column
                  prop="planContent"
                  label="计划内容"
                ></el-table-column>
                <el-table-column
                  prop="sortNo"
                  label="排序"
                  width="160px"
                ></el-table-column>
              </el-table>
            </l-table>
          </div>
          <el-dialog
            :title="tDialogMode"
            :visible.sync="createTypeDialog"
            :close-on-click-modal="false"
            width="700px"
          >
            <div style="width: 100%; padding: 12px 24px">
              <el-row style="margin-top: 12px" :gutter="12">
                <el-col :span="3">
                  <p
                    style="line-height: 30px; text-align: right"
                    class="necessary-control"
                  >
                    计划编码
                  </p>
                </el-col>
                <el-col :span="9">
                  <el-input
                    :disabled="disabledFlag || mngPlanCdFlag"
                    v-model="createTypeData.mngPlanCd"
                  ></el-input>
                </el-col>
                <el-col :span="3">
                  <p
                    style="line-height: 30px; text-align: right"
                    class="necessary-control"
                  >
                    计划名称
                  </p>
                </el-col>
                <el-col :span="9">
                  <el-input
                    :disabled="disabledFlag"
                    v-model="createTypeData.mngPlanNm"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 12px" :gutter="12">
                <el-col :span="3">
                  <p
                    style="line-height: 30px; text-align: right"
                    class="necessary-control"
                  >
                    计划类别
                  </p>
                </el-col>
                <el-col :span="9">
                  <el-select
                    style="width: 100%"
                    v-model="createTypeData.mngPlanTpCd"
                    :disabled="disabledFlag"
                    placeholder="请选择"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in typeGroupOptions"
                      :key="item.mngPlanTpCd"
                      :label="item.mngPlanTpNm"
                      :value="item.mngPlanTpCd"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row style="margin-top: 12px" :gutter="12">
                <el-col :span="3">
                  <p
                    style="line-height: 30px; text-align: right"
                    class="necessary-control"
                  >
                    所属级别
                  </p>
                </el-col>
                <el-col :span="9">
                  <el-select
                    v-model="createTypeData.scopeLevel"
                    @change="changeOwner"
                    :disabled="disabledFlag"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in orgOptions"
                      :key="item._id"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <p
                    style="line-height: 30px; text-align: right"
                    class="necessary-control"
                  >
                    所属名称
                  </p>
                </el-col>
                <el-col :span="9">
                  <el-select
                    class="width100"
                    v-model="ownerId"
                    :disabled="nOwnNameDisabled || disabledFlag"
                    filterable
                    clearable
                    collapse-tags
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in nOwnNameOpt"
                      :key="item.id"
                      :label="item.orgNm"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row style="margin-top: 12px" :gutter="12">
                <el-col :span="3">
                  <p
                    style="line-height: 30px; text-align: right"
                    class="necessary-control"
                  >
                    计划内容
                  </p>
                </el-col>
                <el-col :span="21">
                  <el-input
                    v-model="createTypeData.planContent"
                    :disabled="disabledFlag"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="请输入内容"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 12px" :gutter="12">
                <el-col :span="3">
                  <p style="line-height: 30px; text-align: right">拼音码</p>
                </el-col>
                <el-col :span="9">
                  <el-input
                    disabled
                    v-model="createTypeData.pinyinCd"
                  ></el-input>
                </el-col>
                <el-col :span="3">
                  <p style="line-height: 30px; text-align: right">五笔码</p>
                </el-col>
                <el-col :span="9">
                  <el-input disabled v-model="createTypeData.wubiCd"></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 12px" :gutter="12">
                <el-col :span="3">
                  <p style="line-height: 30px; text-align: right">助记码</p>
                </el-col>
                <el-col :span="9">
                  <el-input
                    :disabled="disabledFlag"
                    v-model="createTypeData.customCd"
                  ></el-input>
                </el-col>
                <el-col :span="3">
                  <p
                    style="line-height: 30px; text-align: right"
                    class="necessary-control"
                  >
                    排序码
                  </p>
                </el-col>
                <el-col :span="9">
                  <el-input
                    :disabled="disabledFlag"
                    v-model="createTypeData.sortNo"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 12px" :gutter="12">
                <el-col :span="3">
                  <p style="line-height: 30px; text-align: right">描述</p>
                </el-col>
                <el-col :span="21">
                  <el-input
                    placeholder="请输入内容"
                    type="textarea"
                    :disabled="disabledFlag"
                    v-model="createTypeData.description"
                    :autosize="{ minRows: 3, maxRows: 6 }"
                  ></el-input
                ></el-col>
              </el-row>
            </div>
            <div slot="footer">
              <el-button type="primary" @click="typeDetermine">确定</el-button>
              <el-button @click="closeManageDialog">取消</el-button>
            </div>
          </el-dialog>
        </div>
      </el-card>
    </flow-menu>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";

import { getUId, getUN } from "@/utils/crypto.js";
import { getPamars } from "@/utils/auth";
import { getParamsByKey } from "@/api/emrRecord/emr/SysParam";

import {
  createMngPlan,
  modifyMngPlan,
  deleteMngPlan,
  getMngPlan,
  createMngPlanType,
  modifyMngPlanType,
  deleteMngPlanType,
  getMngPlanType,
  getMngPlanSeq_no,
  getmngPlanTypeSeq_no
} from "@/api/emrRecord/emr/managePlan";
import hmm from "@/api/hmm/base.js";
import { getDeptList } from "@/api/admin/role";
import commonMixins from "@/views/emrRecord/DocTempMaintenance/mixins/common.js";

export default {
  name: "typeGroupMaintain",
  components: {
    FlowMenu
  },
  data() {
    return {
      tree: [
        {
          mngPlanTpNm: "管理计划类别",
          mngPlanTpId: "0",
          children: []
        }
      ],
      defaultProps: {
        children: "children",
        label: "mngPlanTpNm",
        id: "mngPlanTpId"
      },
      queryTypeListParam: {
        mngPlanTpCd: "",
        key: ""
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      layout: "total,prev,pager,next,jumper",
      typeGroupOptions: [],
      typeTable: [],
      manageTypeFlag: false,
      createTypeGroupDialog: false,
      mngPlanTpCdFlag: true,
      mngPlanCdFlag: true,
      tgDialogMode: "新建管理计划类别",
      createTypeGroupData: {
        mngPlanTpCd: "",
        mngPlanTpNm: "",
        pinyinCd: "",
        wubiCd: "",
        sortNo: "",
        description: ""
      },
      createTypeDialog: false,
      tDialogMode: "新建管理计划",
      createTypeData: {
        mngPlanCd: "",
        mngPlanNm: "",
        mngPlanTpCd: "",
        scopeLevel: "",
        ownerId: "",
        planContent: "",
        pinyinCd: "",
        wubiCd: "",
        customCd: "",
        sortNo: "",
        description: ""
      },
      curNode: null,
      loading: false,
      loading1: false,
      multipleSelection: [],
      nOwnNameOpt: [],
      nOwnNameOptCopy: [],
      ownerId: null,
      isNewBuilt: true,
      orgOptions: [],
      disabledFlag: false,
      dictListForCode: [],
      isDicDeptAdmin: false,
      nOwnNameDisabled: false
    };
  },
  mixins: [commonMixins],
  watch: {
    createTypeGroupDialog(newVal) {
      if (newVal && this.tgDialogMode === "新建管理计划类别") {
        this.getManPlanTypeNo();
      }
    },
    createTypeDialog(newVal) {
      if (newVal && this.tDialogMode === "新建管理计划") {
        this.getManPlanNo();
      }
    }
  },
  created() {
    this.getTree();
    this.insTypeQuery();
    this.getDeptListRequest();
    this.handlerOrgList();
  },
  methods: {
    async handlerOrgList() {
      try {
        const { code, data, msg } = await hmm.getDictListForCode(
          "AllLevelType"
        );
        this.dictListForCode = data;
        const adminStr = this.getCurrRoleCodeHandler();
        if (code === 1 && data) {
          this.swithHandler(adminStr, data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    swithHandler(adminStr, data) {
      switch (adminStr) {
        case "tenant":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("9");
          });
          break;
        case "org":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("0");
          });
          break;
        case "dept":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("1");
          });
          break;
        case "other":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("2");
          });
          break;
        default:
          break;
      }
    },
    getManPlanTypeNo() {
      getmngPlanTypeSeq_no()
        .then(res => {
          if (res.code === 1) {
            this.createTypeGroupData.mngPlanTpCd = res.data;
            this.mngPlanTpCdFlag = true;
          } else {
            this.mngPlanTpCdFlag = false;
            this.$message.error(res.message || "获取管理类型编码失败");
          }
        })
        .catch(error => {
          this.mngPlanTpCdFlag = false;

          this.$message.error(error.message || "获取管理类型编码失败");
        });
    },
    getManPlanNo() {
      getMngPlanSeq_no()
        .then(res => {
          if (res.code === 1) {
            this.createTypeData.mngPlanCd = res.data;
            this.mngPlanCdFlag = true;
          } else {
            this.mngPlanCdFlag = false;
            this.$message.error(res.message || "获取管理计划编码失败");
          }
        })
        .catch(error => {
          this.mngPlanCdFlag = false;

          this.$message.error(error.message || "获取管理计划编码失败");
        });
    },
    getDeptListRequest() {
      getDeptList()
        .then(res => {
          const { code, data, msg } = res;
          if (code === 1) {
            this.nOwnNameOptCopy = data;
          } else {
            this.$message.error(msg || "请求数据失败");
            return;
          }
        })
        .catch(err => {
          this.$message.error(JSON.stringify(err) || "获取科室列表数据失败");
        });
    },
    changeOwner(sLevel = "") {
      this.nOwnNameDisabled = false;
      let orgMsg = JSON.parse(getPamars());
      let scopeLevel = sLevel
        ? sLevel
        : !this.isNewBuilt
        ? this.createTypeData.scopeLevel
        : this.roleMap[this.getCurrRoleCodeHandler()];
      let hosId = this.createTypeData.ownerId;

      switch (scopeLevel) {
        case "0":
          // 全院的情况
          let hosName = orgMsg.hosName;

          this.nOwnNameOpt = [{ id: hosId, orgNm: hosName }];
          this.ownerId = [hosId];
          break;
        case "1":
          // 选择科室的情况
          this.nOwnNameOpt = this.nOwnNameOptCopy;
          // 科室情况
          if (
            !this.isNewBuilt &&
            this.multipleSelection[0].scopeLevel === "1"
          ) {
            // 非新建状态
            this.ownerId = hosId.split(",").map(item => Number(item));
          } else {
            // 新建
            this.ownerId = [this.nOwnNameOpt[0].id];
          }

          if (this.isDicDeptAdmin) {
            this.nOwnNameDisabled = true
            const deptId = JSON.parse(window.localStorage.getItem('role')).deptId
            this.ownerId = [this.nOwnNameOpt.find(item => item.id === deptId).id]
          }

          break;
        case "2":
          // 选择个人的情况
          this.nOwnNameOpt = [{ id: getUId(), orgNm: getUN() }];
          this.ownerId = [getUId()];
          break;
        case "9":
          // 选择租户的情况
          this.nOwnNameOpt = [{ id: orgMsg.orgId, orgNm: orgMsg.orgName }];
          this.ownerId = [orgMsg.orgId];
          break;
        default:
          break;
      }
    },
    handleSelectionChange(data) {
      this.multipleSelection = data;
    },
    resetManagePlanData() {
      this.createTypeGroupData = {
        mngPlanTpCd: "",
        mngPlanTpNm: "",
        pinyinCd: "",
        wubiCd: "",
        sortNo: "",
        description: ""
      };
    },
    handleNodeClick(node) {
      this.curNode = node;
      this.queryTypeListParam.mngPlanTpCd = node.mngPlanTpCd;
      this.insTypeQuery();
    },
    handleRowClick(row, event, column) {
      this.$refs.typeTable.toggleRowSelection(row);
    },
    createGroup() {
      this.tgDialogMode = "新建管理计划类别";
      this.curNode = null;

      this.resetManagePlanData();
      this.createTypeGroupDialog = true;
    },
    // 刷新管理计划树
    refreshGroup() {
      this.getTree();
    },
    editGroup() {
      this.tgDialogMode = "编辑管理计划类别";
      if (!this.curNode) {
        this.$message.warning("请选择管理计划类别");
        return;
      }

      this.createTypeGroupData = {
        ...this.curNode
      };
      this.createTypeGroupDialog = true;
    },
    handleDeleteG() {
      if (!this.curNode) {
        this.$message.warning("请选择删除项");
        return;
      }
      this.$confirm("此操作将删除选项, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delGroup();
        })
        .catch(() => {});
    },
    delGroup() {
      if (this.manageTypeFlag) return;
      this.manageTypeFlag = true;
      deleteMngPlanType([this.curNode.mngPlanTpId])
        .then(res => {
          if (res.code === 1) {
            this.$message({
              message: "删除成功!",
              type: "success"
            });
          } else {
            this.$message.error("删除失败!");
          }
        })
        .catch(err => {
          this.$message.error(err || "删除失败!");
        })
        .finally(() => {
          this.manageTypeFlag = false;
          this.curNode = null;
          this.getTree();
        });
    },
    createType() {
      getParamsByKey({
        key: ['deptDictionaryAdminRoles']
      }).then(resp => {
        this.tDialogMode = "新建管理计划";
        this.isNewBuilt = true;
        this.createTypeDialog = true;
        this.disabledFlag = false;
        const curRoleId = JSON.parse(window.localStorage.getItem('role')).roleCode
        const rolesList = resp.data.deptDictionaryAdminRoles.split(',')
        this.isDicDeptAdmin = rolesList.includes(curRoleId);
        this.clearManagePlan();
        this.swithHandler(this.getCurrRoleCodeHandler(), this.dictListForCode);
        // this.changeOwner();
      })
      
    },
    async modifyType() {
      if (this.multipleSelection.length > 1) {
        this.$message("只能选中一条数据编辑");
        return;
      }

      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请先勾选一条记录!",
          type: "warning"
        });
        return;
      }

      this.createTypeData = {
        ...this.multipleSelection[0]
      };

      const params = this.paramsArrHandler(this.multipleSelection);
      const flag = await this.authorityHandler(params);

      this.disabledFlag = !flag;
      if (this.disabledFlag) {
        this.swithHandler(
          this.roleRevereMap[this.createTypeData.scopeLevel],
          this.dictListForCode
        );
      } else {
        this.swithHandler(this.getCurrRoleCodeHandler(), this.dictListForCode);
      }

      // 初始化所属类型和所属名称 的数据
      this.changeOwner();

      this.tDialogMode = "编辑管理计划";
      this.createTypeDialog = true;
      this.isNewBuilt = false;
    },
    paramsArrHandler(arr = []) {
      let list = [];
      list = arr.map(item => {
        return {
          id: item.mngPlanId,
          code: item.mngPlanCd,
          scopeLevel: item.scopeLevel,
          ownerId: item.ownerId,
          oprRoleLevel: item.oprRoleLevel
        };
      });
      return list;
    },
    async handelDeleteT() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请先选择删除项!",
          type: "warning"
        });
        return;
      }

      const params = this.paramsArrHandler(this.multipleSelection);
      const flag = await this.authorityHandler(params);
      if (!flag) {
        return;
      }

      let arr = [];

      arr = this.multipleSelection.map(item => item.mngPlanId);
      this.$confirm("此操作将删除当前数据, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delType(arr);
        })
        .catch(() => {});
    },
    delType(arr) {
      deleteMngPlan(arr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "删除成功!",
            type: "success"
          });
          this.insTypeQuery();
        } else {
          this.$message.error("删除失败!");
        }
      });
    },
    cancalHandler() {
      this.createTypeGroupDialog = false;
      this.curNode = null;
    },
    typeGroupDetermine() {
      if (this.createTypeGroupData.mngPlanTpCd.trim() === "") {
        this.$message.error("类别编码不可为空!");
        return;
      }
      if (this.createTypeGroupData.mngPlanTpNm.trim() === "") {
        this.$message.error("类别名称不可为空!");
        return;
      }
      if (this.createTypeGroupData.sortNo.trim() === "") {
        this.$message.error("排序码不可为空!");
        return;
      }
      if (this.manageTypeFlag) return;
      this.manageTypeFlag = true;
      let params;

      if (this.tgDialogMode == "新建管理计划类别") {
        params = {
          ...this.createTypeGroupData
        };
        createMngPlanType(params)
          .then(res => {
            if (res.code) {
              this.$message({
                message: "新增成功!",
                type: "success"
              });
            } else {
              this.$message({
                message: res.message || "新增失败！",
                type: "error"
              });
            }
          })
          .catch(error => {
            this.$message.error(error);
          })
          .finally(() => {
            this.manageTypeFlag = false;
            this.cancalHandler();
            this.getTree();
          });
      } else {
        params = {
          ...this.createTypeGroupData
        };
        modifyMngPlanType(params)
          .then(res => {
            if (res.code) {
              this.$message({
                message: "修改成功!",
                type: "success"
              });
            } else {
              this.$message({
                message: res.message || "修改失败！",
                type: "error"
              });
            }
          })
          .catch(error => {
            this.$message.error(error);
          })
          .finally(() => {
            this.manageTypeFlag = false;
            this.cancalHandler();
            this.getTree();
          });
      }
    },
    queryFirstNo() {
      this.pageParams.pageNo = 1;
      this.insTypeQuery();
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.insTypeQuery();
    },
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    insTypeQuery() {
      this.loading1 = true;
      let params = {
        ...this.queryTypeListParam,
        ...this.pageParams
      };
      getMngPlan(params)
        .then(res => {
          if (res.code === 1) {
            this.typeTable = res.data;
            this.pageParams.pageNo = res.pageNo;
            this.pageParams.pageSize = res.pageSize;
            this.pageParams.total = res.total;
          } else {
            this.$message.error("查询失败!");
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.loading1 = false;
        });
    },
    clearCondition() {
      this.queryTypeListParam = {
        mngPlanTpCd: "",
        key: ""
      };
    },
    clearManagePlan() {
      this.createTypeData = {
        mngPlanCd: "",
        mngPlanNm: "",
        mngPlanTpCd: "",
        scopeLevel: "",
        ownerId: "",
        planContent: "",
        pinyinCd: "",
        wubiCd: "",
        customCd: "",
        sortNo: "",
        description: ""
      };
      this.ownerId = null;
      // this.nOwnNameOpt = [];
    },
    closeManageDialog() {
      this.clearManagePlan();
      this.createTypeDialog = false;
    },
    typeDetermine() {
      let noInportantKey = [
        "pinyinCd",
        "wubiCd",
        "customCd",
        "description",
        "dataVersion",
        "ownerId"
      ];
      // 必填项判断
      for (let k in this.createTypeData) {
        if (k === "ownerId") {
          if (this.ownerId.length === 0) {
            this.$message.error("请填写必填项!");
            return false;
          }
        } else if (!noInportantKey.includes(k)) {
          let keyVal = this.createTypeData[k];
          if (keyVal.trim() === "") {
            this.$message.error("请填写必填项!");
            return false;
          }
        }
      }
      let params = {
        ...this.createTypeData,
        ownerId: this.ownerId.join(",")
      };

      if (this.tDialogMode == "新建管理计划") {
        createMngPlan(params)
          .then(res => {
            if (res.code == 1) {
              this.$message({
                message: "新建成功!",
                type: "success"
              });
              this.insTypeQuery();
            } else {
              this.$message.error(res.msg || "新建失败!");
            }
          })
          .catch(error => {
            this.$message.error(error.msg || "新建接口异常");
          })
          .finally(() => {
            this.createTypeDialog = false;
          });
      } else {
        modifyMngPlan(params)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                message: "修改成功!",
                type: "success"
              });
              this.insTypeQuery();
            } else {
              this.$message.error(res.msg || "接口失败!");
            }
          })
          .catch(err => {})
          .finally(() => {
            this.createTypeDialog = false;
          });
      }
    },
    getTree() {
      if (this.loading) return;
      this.loading = true;

      getMngPlanType()
        .then(res => {
          let { code, data } = res;
          if (code === 1) {
            this.tree[0].children = data;
            this.typeGroupOptions = data;
          }
        })
        .catch(err => {
          this.$message.error(err || "获取管理计划类别接口失败");
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.tgm-container {
  overflow: hidden;
  .left {
    width: 246px;
    height: 100%;
    float: left;
    background-color: #ffffff;
    .top-btn-con {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .little-button {
        width: 42px;
        height: 30px;
        padding: 0;
        margin-left: 0px;
        .el-button--default {
          padding: 5px 20px;
        }
      }
    }
  }
  .right {
    height: 100%;
    margin-left: 254px;
    background-color: #ffffff;
    position: relative;
    .search-con {
      width: 100%;
      .search-main {
        width: calc(100% - 160px);
      }
    }
    .common-width {
      margin-right: 10px;
      display: inline-block;
      width: 240px;
    }
  }
  .fangkuai {
    width: 4px;
    height: 16px;
    background-color: $l-color-bgcolor-12;
    margin-left: 16px;
    margin-top: 19px;
    float: left;
  }
  .el-input--medium .el-input__inner {
    height: 30px !important;
  }
  .el-button {
    height: 30px;
    width: 70px;
  }
  .iconBtn {
    .el-button--primary,
    .el-button--default {
      padding: 5px 20px 5px 10px;
    }
  }
  .el-table--medium th {
    height: 36px;
  }
  .el-table th,
  .el-table td {
    text-align: center;
  }
  textarea {
    height: 142px;
  }
  .margin-top-10 {
    margin-top: 10px;
  }
  .necessary-control:before {
    content: "*";
    color: #f56c6c;
    /*position: absolute;*/
    top: 2px;
    left: -8px;
  }
}
</style>
