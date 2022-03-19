<template>
  <div class="hd-container height100 width100" ref="page">
    <l-layout
      :toolBoxShow="false"
      :isLeftExpand="false"
      :patientListShow="false"
    >
      <template #content>
        <div class="tree-left height100">
          <div style="width: 100%; margin: 10px" class="icon-btn">
            <el-row class="icon-btn-contain">
              <el-button
                size="mini"
                icon="iconfont icontianjia"
                @click="addNewKnowledgeTP"
                title="新增"
              ></el-button>
              <el-button
                size="mini"
                @click="modifyTreeItem"
                icon="iconfont iconbianji"
                title="修改"
              ></el-button>
              <el-button
                size="mini"
                @click="deleteTreeItem"
                icon="iconfont iconshanchu1"
                title="删除"
              ></el-button>
              <el-button
                size="mini"
                @click="refresh"
                icon="iconfont iconshuaxin "
                title="刷新"
              ></el-button>
            </el-row>
            <el-row style="margin-top: 8px">
              <el-input
                placeholder="请输入检索条件"
                prefix-icon="el-icon-search"
                v-model="searchTxt"
                style="width: 226px"
              >
              </el-input>
            </el-row>
          </div>
          <el-row class="tree_box" v-loading="loading">
            <el-tree
              id="myTree"
              ref="myTree"
              :data="treeData"
              :props="defaultProps"
              default-expand-all
              node-key="id"
              :filter-node-method="filterNode"
              :highlight-current="true"
              @node-click="handleChange"
              style="height: 100%; overflow-y: auto"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-row>
          <TpEditSection
            ref="createSection"
            :isShow.sync="dialogVisible"
            :mode="modeType"
            :template="tpTemplate"
            @handleSave="handleSaveTp"
            @handle-update="handleUpdateTp"
          ></TpEditSection>
        </div>
        <div class="tree-right height100" id="sensitiveMain">
          <div class="m-contain">
            <div
              class=""
              style="width: calc(100% - 180px); display: inline-block"
            >
              <div class="common-width">
                <l-formt-title label="知识库名称">
                  <el-input v-model="form.kLibNm"></el-input>
                </l-formt-title>
              </div>
              <div class="common-width">
                <l-formt-title label="知识库分类">
                  <el-select
                    clearable
                    filterable
                    v-model="form.kLibTpCd"
                    placeholder="请选择"
                    @change="changeTpCd"
                  >
                    <el-option
                      v-for="item in knowledgeLibTpOptions"
                      :key="item.mdKLibTpId"
                      :label="item.kLibTpNm"
                      :value="item.mdKLibTpId"
                    >
                    </el-option
                  ></el-select>
                </l-formt-title>
              </div>
              <div class="common-width">
                <l-formt-title label="所属级别">
                  <l-value-domain-emr
                    ref="scopeLevel"
                    clearable
                    code="LevelType"
                    :value.sync="form.ownerTp"
                    placeholder="请选择"
                    @change="changeOwner"
                  ></l-value-domain-emr>
                </l-formt-title>
              </div>
              <div class="common-width">
                <l-formt-title label="所属名称">
                  <el-select
                    v-model="ownerCd"
                    clearable
                    multiple
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in ownNameOpt"
                      :key="item.id"
                      :label="item.orgNm"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </l-formt-title>
              </div>
              <div class="common-width">
                <l-formt-title label="是否启用">
                  <l-value-domain-emr
                    clearable
                    code="ModelStatus"
                    :value.sync="form.enableF"
                    placeholder="请选择"
                  ></l-value-domain-emr>
                </l-formt-title>
              </div>
            </div>
            <div class="" style="display: inline-block; float: right">
              <el-button class="el-button--primary" @click="btnClickQuery"
                >查询
              </el-button>
              <el-button class="el-button--default" @click="clearConditionForm"
                >重置
              </el-button>
            </div>
          </div>
          <div class="tablist">
            <div style="height: 30px" class="clearfix">
              <div class="float-right">
                <el-button icon="el-icon-plus" @click="create">新建</el-button>
                <el-button icon="el-icon-remove-outline" @click="edit"
                  >修改
                </el-button>
                <el-button icon="el-icon-remove-outline" @click="handleRemove"
                  >删除
                </el-button>
                <el-button icon="el-icon-check" @click="enable">启用</el-button>
                <el-button icon="el-icon-close" @click="disable"
                  >停用</el-button
                >
              </div>
            </div>
            <div class="table-contain">
              <l-table
                :total="pageParams.total"
                :pageSize.sync="pageParams.pageSize"
                :page.sync="pageParams.pageNo"
                layout="total,prev,pager,next,jumper"
                :singlePageShow="true"
                @changeSize="changeSize"
              >
                <el-table
                  width="100%"
                  height="100%"
                  :data="tableData"
                  ref="sectionTempTable"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="dblclickOpen"
                  @row-click="selectRow"
                  element-loading-text="加载中..."
                  border
                  v-loading="tlm_isLoading"
                >
                  <el-table-column
                    fixed
                    type="selection"
                    width="40"
                  ></el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    width="55"
                  ></el-table-column>
                  <el-table-column prop="kLibCd" label="知识库编码" width="100">
                  </el-table-column>
                  <el-table-column prop="kLibNm" label="知识库名称" width="200">
                  </el-table-column>
                  <el-table-column
                    prop="kLibTpCd"
                    label="知识库分类"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <span
                        tableName="md_knowledge_lib_tp"
                        :conditionMap="{
                          md_k_lib_tp_id: scope.row.kLibTpCd || '',
                        }"
                        columns="k_lib_tp_nm"
                        v-tableTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ownerCd" label="所属级别" width="80">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.ownerTp"
                        code="LevelType"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ownerTp" label="所属名称" width="150">
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.ownerTp === '0'"
                        tableName="sys_org"
                        :conditionMap="{ id: scope.row.ownerCd }"
                        columns="org_nm"
                        v-tableTransformEmr
                      ></span>
                      <div
                        v-else-if="scope.row.ownerTp === '1'"
                        v-for="(item, index) in scope.row.ownerCd.split(',')"
                        :key="item"
                      >
                        <span
                          tableName="sys_org"
                          :conditionMap="{ id: item }"
                          columns="org_nm"
                          v-tableTransformEmr
                        ></span>
                        <i
                          v-if="
                            index != scope.row.ownerCd.split(',').length - 1
                          "
                          >、</i
                        >
                      </div>
                      <span
                        v-else-if="scope.row.ownerTp === '2'"
                        tableName="sys_user"
                        :conditionMap="{ id: scope.row.ownerCd }"
                        columns="name"
                        v-tableTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="dnFlag" label="医护标识" width="80">
                    <template slot-scope="scope"
                      ><span
                        :val="scope.row.dnFlag"
                        code="EmployeeMark"
                        v-code-transformEmr
                      ></span
                    ></template>
                  </el-table-column>
                  <el-table-column prop="systemF" label="是否系统" width="150">
                    <template slot-scope="scope"
                      ><span
                        :val="scope.row.systemF"
                        code="systemF"
                        v-code-transformEmr
                      ></span
                    ></template>
                  </el-table-column>
                  <el-table-column
                    prop="versionNo"
                    label="版本号"
                    width="70"
                  ></el-table-column>
                  <el-table-column prop="enableF" label="启用" width="50">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.enableF"
                        code="ModelStatus"
                        v-code-transformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="editor" label="采用编辑器" width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.editor === '00'">无编辑器</span>
                      <span
                        v-else
                        :val="scope.row.editor"
                        code="EditorType"
                        v-code-transformEmr
                      >
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="comm"
                    label="描述"
                    width="300"
                  ></el-table-column>
                </el-table>
              </l-table>
            </div>
            <EditSection
              ref="addCreateSection"
              :isShow.sync="AddDialogVisible"
              :template="sTemplate"
              :disabledFlag="disabledFlag"
              @handle-save="handleSave"
              @handle-update="handleUpdate"
            />
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>
<script>
import FlowMenu from "@/components/FlowMenu";
import TpEditSection from "./components/tpEditSection";
import EditSection from "./components/editSection";
import {
  getKLibTpTree,
  getList,
  getDetail,
  removeBatch,
  multiUpdate,
  deleteKnowledgeLibTp,
  knowledgeLibTpSeq,
  getListByParams
} from "@/api/emrRecord/emr/knowledge";

import { getDeptList } from "@/api/admin/role";
import commonMixins from "@/views/emrRecord/DocTempMaintenance/mixins/common.js";

import { getUId, getUN } from "@/utils/crypto";
import { getPamars } from "@/utils/auth";
import { get } from "@/utils/requestEmr";

export default {
  name: "",
  components: {
    EditSection,
    TpEditSection
  },

  watch: {
    searchTxt(val) {
      this.$refs.myTree.filter(val);
    }
  },
  mixins: [commonMixins],
  data() {
    return {
      knowledgeLibTpOptions: [],
      ownerCd: [],
      knowledgeLibTpParams: {
        deletedStatus: "0"
      },
      modeType: "add",
      treeNode: {},
      AddDialogVisible: false,
      dialogVisible: false,
      searchTxt: "",
      valTypeOpt: [],
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0,
        pageSize: 20 // 每页数据条数
      },
      tlm_isLoading1: false,
      tlm_isLoading: false,
      selection: [],
      tpTemplate: {},
      sTemplate: {},
      loading: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      form: {
        kLibCd: "",
        kLibNm: "",
        kLibTpCd: "",
        ownerCd: "",
        ownerTp: ""
      },
      tableData: [],
      table_isLoading: false,
      chooseUpData: [],
      ownNameOpt: [],
      ownNameOptCopy: [],
      scopeLevel: "",
      disabledFlag: false
    };
  },
  provide() {
    return {
      upData: this.chooseUpData
    };
  },
  created() {
    this.initTreeData();
    this.getDeptListRequest();
  },
  mounted() {
    this.fetchData();
    this.getKnowledgeLibTpOptions();
  },
  methods: {
    // 生成编码
    getCodeSeq() {
      console.log("initUncodeHandle==========", this.myTemplate.kLibCd);
      let data = {};
      knowledgeLibTpSeq(data)
        .then(res => {
          if (res.code === 1) {
            this.myTemplate.kLibCd = res.data;
          } else {
            this.$message.error(res.msg);
            return;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error("自动生成编码失败");
        });
    },
    getKnowledgeLibTpOptions() {
      this.form.kLibTpCd = "";
      let url = "/knowledgeLibTp/getKnowledgeLibTpList ";

      this.loading = true;
      get(url)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.knowledgeLibTpOptions = res.data;
          } else {
            this.$message.error("获取质控体系：" + res.msg);
            return;
          }
        })
        .catch(res => {
          this.loading = false;
          this.$message({
            type: "error",
            message: res.msg
          });
        });
    },
    filterNode(value, data) {
      // console.log("value===",value)
      // console.log("data===",data)
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.queryTableList();
    },
    changeTpCd(item) {
      // console.log("scopeLevel=====", item)
    },
    handleSaveTp() {
      this.initTreeData();
      this.getKnowledgeLibTpOptions();
    },
    handleUpdateTp() {},
    getDeptListRequest() {
      getDeptList().then(res => {
        const { code, data, msg } = res;
        if (code === 1) {
          this.ownNameOptCopy = data;
        } else {
          this.$message.error(msg || "请求数据失败");
          return;
        }
      });
    },
    changeOwner() {
      console.log("scopeLevel=====", this.form.ownerTp);
      const orgMsg = JSON.parse(getPamars());
      const ownerTp = this.form.ownerTp;

      switch (ownerTp) {
        case "0":
          let hosId = orgMsg.hosId;
          let hosName = orgMsg.hosName;
          this.ownNameOpt = [{ id: hosId, orgNm: hosName }];
          this.ownerCd = this.ownNameOpt[0].id.split(",");
          break;
        case "1":
          this.ownNameOpt = this.ownNameOptCopy;

          this.ownerCd = [this.ownNameOpt[0].id];
          break;
        case "2":
          this.ownNameOpt = [{ id: getUId(), orgNm: getUN() }];
          this.ownerCd = this.ownNameOpt[0].id.split(",");
          break;
        case "9":
          this.ownNameOpt = [{ id: orgMsg.orgId, orgNm: orgMsg.orgName }];
          this.ownerCd = [orgMsg.orgId];
          break;
      }
    },
    modifyTreeItem() {
      if (Object.keys(this.treeNode).length === 0) {
        this.$message.error("请选中修改项");
        return;
      }
      this.modeType = "modify";
      this.dialogVisible = true;
      this.tpTemplate = { id: this.treeNode.id };
    },
    deleteTreeItem() {
      if (Object.keys(this.treeNode).length === 0) {
        this.$message.error("请选中删除项");
        return;
      }
      let { id } = this.treeNode;
      deleteKnowledgeLibTp(id, true)
        .then(res => {
          if (res.code === 1) {
            this.refresh();
          } else {
            this.$message("接口失败！");
            return;
          }
        })
        .catch(error => {
          console.log(error);
          this.$message.error(error);
        });
    },

    btnClickQuery() {
      this.tableData.length = 0;
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: 0
      };
      this.fetchData();
    },
    clearConditionForm() {
      for (let k in this.form) {
        this.form[k] = "";
      }
      this.form.ownerTp = "";
      this.handleReset();
    },
    addNewKnowledgeTP() {
      this.modeType = "add";
      if (this.treeNode.id) {
        this.tpTemplate = { id: this.treeNode.id, systemF: "1" };
      } else {
        this.tpTemplate = { systemF: "1" };
      }
      this.dialogVisible = true;
    },

    // 刷新
    refresh() {
      this.resetDataList();
      this.initTreeData();
      this.getKnowledgeLibTpOptions();
    },
    resetDataList() {
      this.treeNode = {};
      this.tpTemplate = {};
    },
    initTreeData(kLibTpNm = "") {
      let data = {
        kLibTpCd: "",
        kLibTpNm,
        dnFlag: ""
      };
      if (this.loading) {
        return;
      }
      this.loading = true;
      getKLibTpTree(data)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.treeData = res.data;
            this.chooseUpData.splice(0);
            this.initUpdate(this.treeData);
          } else {
            this.$message("接口失败！");
            return;
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(res.msg);
        });
    },
    initUpdate(array) {
      array.forEach(item => {
        this.chooseUpData.push({
          label: item.label,
          id: item.id
        });
        if (item.hasOwnProperty("children")) {
          this.initUpdate(item.children);
        }
      });
    },
    getDiagList() {},
    //选择项发生变化
    handleSelectionChange(val) {
      this.selection = val;
    },
    //调接口
    fetchData() {
      this.tableData.length = 0;
      this.tlm_isLoading = true;
      console.log("fetchData============");
      this.form.ownerCd =
        this.form.ownerTp == "1" ? this.ownerCd.join(",") : "";
      getListByParams({
        ...this.form,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      }).then(res => {
        if (res.code === 1) {
          this.tableData = [...this.tableData, ...res.data];
          this.dataTotal = res.total;
          this.tlm_isLoading = false;
          this.pageParams = {
            pageNo: res.pageNo,
            total: res.total,
            pageSize: res.pageSize
          };
          console.log("page", this.pageParams);
        } else {
          this.$message("获取数据失败");
          this.tlm_isLoading = false;
          return;
        }
      });
    },

    remoteMethod() {},
    handleChange(item, node, index) {
      this.treeNode = item;
      this.form.kLibTpCd = item.id;
      this.fetchData();
    },
    //查询
    handleQuery() {
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: 0
      };

      this.fetchData();
    },
    selectRow(row) {
      this.$refs.sectionTempTable.toggleRowSelection(row);
    },
    //回调编辑后，定位新增行
    setSelectRow(data) {
      this.tableData.forEach((item, index) => {
        if (item.kLibId == data.kLibId) {
          this.$refs.sectionTempTable.clearSelection();
          this.$refs.sectionTempTable.toggleRowSelection(
            this.tableData[index],
            true
          );
        }
      });
    },
    //双击打开编辑模板内容
    dblclickOpen(row, column, event) {
      this.$refs.sectionTempTable.clearSelection();
      this.$refs.sectionTempTable.toggleRowSelection(row, true);
      this.edit(row);
    },
    handleReset() {
      this.pageSize = 10;
      this.currentPage = 1;
    },
    //信息编辑回调  编辑后的动作
    handleSave(template) {
      // this.handleReset();

      // this.pageParams = {
      //   pageNo: 1,
      //   pageSize: 20,
      //   total: 0
      // };
      this.refresh();
      this.fetchData();
    },
    handleUpdate(template) {
      this.handleReset();
      this.handleQuery();
    },
    //新建按钮
    create() {
      this.sTemplate = {
        customCode: "",
        enableF: "0",
        kLibNm: "",
        kLibCd: "",
        dataVersion: "0",
        pinyinCode: "",
        wubiCode: "",
        sortNo: this.getSequence()
      };
      this.disabledFlag = false;
      this.AddDialogVisible = true;
    },
    getSequence() {
      let returnNumber = 1;
      for (let item of this.tableData) {
        if (item.number !== "" && item.number > returnNumber) {
          returnNumber = item.number + 1;
        }
      }
      return returnNumber;
    },
    paramsArrHandler(arr = []) {
      let list = [];
      list = arr.map(item => {
        return {
          id: item.kLibId,
          code: item.kLibCd,
          scopeLevel: item.ownerTp,
          ownerId: item.ownerCd,
          oprRoleLevel: item.oprRoleLevel
        };
      });
      return list;
    },
    //编辑
    async edit() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      if (this.selection.length > 1) {
        this.$message("只能选择一条数据");
        return;
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);

      this.disabledFlag = !flag;

      getDetail(this.selection[0].kLibId).then(res => {
        if (res.code === 1) {
          this.sTemplate = res.data;
          this.AddDialogVisible = true;
        } else {
          this.$message.error("获取明细失败!");
          return;
        }
      });
    },
    //删除
    async handleRemove() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      let delList = [];
      for (let index of this.selection) {
        arr.push(index.kLibId);

        delList.push(index.enableF);
      }

      if (delList.includes("1") || delList.includes("2")) {
        this.$message.warning("所选记录含有启用/停用状态,不可删除");
        return;
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);

      if (!flag) return;

      this.handleDelete(arr);
    },
    handleDelete(arr) {
      this.$confirm("此操作将删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteList(arr);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    deleteList(delArr) {
      // console.log("deleteList=====delArr===",delArr);
      removeBatch(delArr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "删除成功! 共删除" + delArr.length + "条数据",
            type: "success"
          });
          this.handleQuery();
        } else {
          this.$message.error("删除失败!");
          return;
        }
      });
    },

    //启用
    async enable() {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.enableF;
        if (status == "1") {
          this.$message.error(index.kLibNm + "已启用，不能再次启用!");
          return;
        }
        index.enableF = "1";
        arr.push(index);
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);

      if (!flag) return;

      multiUpdate(arr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "启用成功!",
            type: "success"
          });
          this.handleQuery();
        } else {
          this.$message.error("启用失败!" + res.message);
          return;
        }
      });
    },
    //停用
    async disable() {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.enableF;
        if (status === "2") {
          this.$message.error(index.kLibNm + "已停用，不能再次停用!");
          return;
        }

        if (status === "0") {
          this.$message.error(index.kLibNm + "不可停用，请先启用后再停用!");
          return;
        }

        // index.enableF = "2";
        arr.push(index);
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);

      if (!flag) return;

      multiUpdate(arr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "停用成功!",
            type: "success"
          });
          this.handleQuery();
        } else {
          this.$message.error("停用失败!" + res.message);
          return;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.hd-container {
  overflow: hidden;

  .icon-btn-contain {
    /deep/ .el-button--mini {
      padding: 3px 13px;
    }
  }

  .tree-left {
    height: 100%;
    width: 246px;
    float: left;
    background-color: #ffffff;
  }

  .tree-right {
    height: 100%;
    margin-left: 254px;
    background-color: #ffffff;
    position: relative;

    .m-contain {
      margin: 0 20px;
      padding: 20px 0;

      .common-width {
        margin-right: 8px;
        margin-bottom: 8px;
        display: inline-block;
        width: 260px;
      }

      .search-main {
        width: calc(100% - 160px);
      }

      .search-con {
        width: 100%;
      }
    }

    .tablist {
      height: calc(100% - 160px);
      position: relative;
      padding: 10px 20px;
      border-top: 1px solid #e4e4e4;

      .table-contain {
        margin-top: 10px;
        height: calc(100% - 40px);
      }
    }
  }

  .margin-top-10 {
    margin-top: 10px;
  }

  .float-right {
    /*float: right;*/
  }

  .table-con {
    margin-top: 20px;
    height: calc(100% - 70px);
  }

  .el-tree-node {
    white-space: normal;
    min-width: 100%;
    display: inline-block;
  }

  .el-tree-node__content {
    white-space: nowrap;
  }

  .tree_box {
    height: 90%;
    padding: 10px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .fromItem {
    width: 165px;
  }
}
</style>
