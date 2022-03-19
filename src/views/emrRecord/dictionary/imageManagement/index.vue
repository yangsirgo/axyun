<template>
  <div class="hd-container height100 width100" ref="page">
    <l-layout
      :toolBoxShow="false"
      :isLeftExpand="false"
      :patientListShow="false"
    >
      <template #content>
        <el-card class="tree-left height100">
          <div style="width: 100%; margin: 10px" class="icon-btn">
            <el-row class="icon-btn-contain">
              <el-button
                size="mini"
                icon="iconfont icontianjia"
                @click="addImageType"
                title="新增"
              ></el-button>
              <el-button
                size="mini"
                @click="modifyImageType"
                icon="iconfont iconbianji"
                title="修改"
              ></el-button>
              <el-button
                size="mini"
                @click="delImageType"
                icon="iconfont iconshanchu1"
                title="删除"
              ></el-button>
              <el-button
                size="mini"
                @click="initTree"
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
          <el-row class="tree_box" v-loading="treeLoading">
            <el-tree
              :data="tree"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              :loading="treeLoading"
              style="overflow: auto; height: calc(100% - 50px)"
              @node-click="nodeClick"
              id="myTree"
              ref="myTree"
              :props="defaultProps"
              :filter-node-method="filterNode"
              :highlight-current="true"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-row>
          <!--          图片类型编辑-->
          <el-dialog
            :title="imageTypeMode"
            :visible.sync="imageTypeDialog"
            :close-on-click-modal="false"
            @close="diaClose"
            width="500px"
          >
            <div style="width: 480px; padding: 20px 20px">
              <el-row style="margin-top: 10px">
                <span style="margin-left: 2em" class="form-control">编码</span>
                <el-input
                  v-model="imageTypeForm.imageTypeCode"
                  style="width: 380px"
                  disabled
                ></el-input>
              </el-row>
              <el-row style="margin-top: 10px">
                <span style="margin-left: 2em" class="form-control">名称</span>
                <el-input
                  style="width: 380px"
                  maxlength="50"
                  placeholder="描述不超过50字！"
                  v-model="imageTypeForm.imageTypeName"
                ></el-input>
              </el-row>
              <el-row style="margin-top: 10px" v-if="imageTypeMode == '修改'">
                <span style="margin-left: 1em">父节点</span>
                <el-select
                  v-model="imageTypeForm.parentId"
                  style="width: 380px"
                >
                  <el-option
                    v-for="item in parentNodeOpt"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="12">
                  <span style="margin-left: 1em">拼音码</span>
                  <el-input
                    style="width: 150px"
                    v-model="imageTypeForm.pinyinCode"
                    :disabled="true"
                  ></el-input>
                </el-col>
                <el-col :span="12">
                  <span style="margin-left: 1em">五笔码</span>
                  <el-input
                    style="width: 150px"
                    v-model="imageTypeForm.wubiCode"
                    :disabled="true"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="12">
                  <span style="margin-left: 1em">助记码</span>
                  <el-input
                    style="width: 150px"
                    v-model="imageTypeForm.customCode"
                  ></el-input>
                </el-col>
                <el-col :span="12">
                  <span style="margin-left: 1em">顺序号</span>
                  <el-input
                    style="width: 150px"
                    v-model="imageTypeForm.sortNo"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px; height: 50px">
                <span style="margin-left: 2em">描述</span>
                <el-input
                  type="textarea"
                  style="width: 360px; vertical-align: top"
                  v-model="imageTypeForm.description"
                ></el-input>
              </el-row>
            </div>
            <div slot="footer">
              <el-button type="primary" @click="submitForm">确定</el-button>
              <el-button @click="imageTypeDialog = false">取消</el-button>
            </div>
          </el-dialog>
        </el-card>
        <el-card class="tree-right height100" id="imageMain">
          <div style="margin: 10px">
            <div class="search-con clearfix">
              <div class="search-main float-left">
                <div class="common-width margin-top-10">
                  <l-formt-title label="图片编码">
                    <el-input
                      class="my-input"
                      style="width: 160px"
                      v-model="form.imageCode"
                    ></el-input>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="图片名称">
                    <el-input
                      class="my-input"
                      style="width: 160px"
                      v-model="form.imageName"
                    ></el-input>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="图片分类">
                    <el-select
                      v-model="form.imageType"
                      clearable
                      style="width: 160px"
                    >
                      <el-option
                        v-for="item in imageTypeOpt"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="医护标识">
                    <l-value-domain
                      clearable
                      style="width: 160px"
                      code="EmployeeMark"
                      :value.sync="form.dnFlag"
                      placeholder="请选择"
                    ></l-value-domain>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="是否启用">
                    <l-value-domain
                      clearable
                      style="width: 160px"
                      code="ModelStatus"
                      :value.sync="form.enabled"
                      placeholder="请选择"
                    ></l-value-domain>
                  </l-formt-title>
                </div>
                <div
                  class="common-width margin-top-10 special-item"
                  style="color: #949da3"
                >
                  <l-formt-title>
                    <el-checkbox v-model="level0">全院</el-checkbox>
                    <el-checkbox v-model="level1">科室</el-checkbox>
                    <l-value-domain
                      multiple
                      clearable
                      filterable
                      :localFilterKeys="deptLocalFilterKeys"
                      collapse-tags
                      style="width: 210px"
                      :value.sync="depts"
                      remoteUrl="/wadmin/hos/dept"
                      remoteShowKey="orgNm"
                      remoteValueKey="id"
                      placeholder="请选择"
                      @change="changeDept"
                    ></l-value-domain>
                    <el-checkbox v-model="level2">个人</el-checkbox>
                  </l-formt-title>
                </div>
              </div>
              <div class="float-right margin-top-10">
                <el-button
                  class="el-button--primary"
                  style="width: 68px; height: 30px"
                  @click="handleQuery"
                  >查询
                </el-button>
                <el-button
                  class="el-button--default"
                  style="width: 68px; height: 30px"
                  @click="handleReset"
                  >重置
                </el-button>
              </div>
            </div>
          </div>
          <div
            style="margin: 15px 16px 0px 16px; border: 1px solid #dcdfe6"
            class="tablist"
          >
            <div style="margin: 10px" class="clearfix">
              <div style="float: left; line-height: 36px">
                <el-switch
                  v-model="modeF"
                  active-text="卡片"
                  inactive-text="列表"
                  @change="modeChange"
                >
                </el-switch>
              </div>
              <div class="float-right">
                <el-button icon="el-icon-plus" @click="create">新建</el-button>
                <el-button icon="el-icon-remove-outline" @click="edit"
                  >修改</el-button
                >
                <el-button icon="el-icon-remove-outline" @click="handleRemove"
                  >删除</el-button
                >
                <el-button icon="el-icon-check" @click="enable">启用</el-button>
                <el-button icon="el-icon-close" @click="disable"
                  >停用</el-button
                >
              </div>
            </div>
            <div v-if="modeF" v-loading="tlm_isLoading">
              <div
                :style="{ height: tableHeight + 'px' }"
                style="border: 1px solid #dcdfe6; overflow: auto"
                id="imgCards"
              >
                <image-card
                  v-for="item in tableData"
                  :key="item.imageId"
                  :info="item"
                  :imageTypeMap="imageTypeMap"
                  @card-click="clickImgCard"
                >
                </image-card>
              </div>
            </div>
            <div v-else class="table-contain">
              <l-table
                :total="pageParams.total"
                :pageSize.sync="pageParams.pageSize"
                :page.sync="pageParams.pageNo"
                layout="total,prev,pager,next,jumper"
                :singlePageShow="true"
                @changeSize="changeSize"
              >
                <el-table
                  class="my-table"
                  :data="tableData"
                  ref="tempTable"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="dblclickOpen"
                  @row-click="selectRow"
                  border
                  width="100%"
                  height="100%"
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
                    width="60"
                  ></el-table-column>
                  <el-table-column
                    prop="imageCode"
                    label="图片编码"
                    width="150"
                  ></el-table-column>
                  <el-table-column
                    prop="imageName"
                    label="图片名称"
                    width="200"
                  ></el-table-column>
                  <el-table-column prop="enabled" label="是否启用" width="150">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.enabled"
                        code="ModelStatus"
                        v-code-transform
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="imageType"
                    label="图片分类"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <span>{{ imageTypeMap.get(scope.row.imageType) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="所属级别" width="100">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.ownerType"
                        code="LevelType"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="所属名称" width="120">
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.ownerType === '0'"
                        tableName="sys_org"
                        :conditionMap="{ id: scope.row.ownerId }"
                        columns="org_nm"
                        v-tableTransformEmr
                      ></span>
                      <div
                        v-else-if="scope.row.ownerType === '1'"
                        v-for="(item, index) in scope.row.ownerId.split(',')"
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
                            index != scope.row.ownerId.split(',').length - 1
                          "
                          >、</i
                        >
                      </div>
                      <span
                        v-else-if="scope.row.ownerType === '2'"
                        tableName="sys_user"
                        :conditionMap="{ id: scope.row.ownerId }"
                        columns="name"
                        v-tableTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="dnFlag" label="医护标识" width="100">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.dnFlag"
                        code="EmployeeMark"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="图片" min-width="150">
                    <template slot-scope="scope">
                      <img
                        alt="图片"
                        style="width: 100px; height: 100px"
                        :src="
                          'http://' +
                          tableData[scope.$index].masterUrl +
                          tableData[scope.$index].imageUrlId
                        "
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </l-table>
            </div>
          </div>
          <edit-section
            ref="imageDialog"
            :isShow.sync="dialogVisible"
            :template="sTemplate"
            :imageTypeOpt="imageTypeOpt"
            :disabledFlag="disabledFlag"
            @handle-save="handleSave"
            @handle-update="handleUpdate"
          ></edit-section>
        </el-card> </template
    ></l-layout>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import {
  getManageList,
  getDetail,
  multiUpdate,
  removeBatch
} from "@/api/emrRecord/emr/image";
import { getPamars } from "@/utils/auth";
import { getUId, getUN } from "@/utils/crypto";

import EditSection from "./components/editSection";
import ImageCard from "./components/ImageCard";
import {
  insert,
  getTree,
  detail,
  update,
  delMulti
} from "@/api/emrRecord/emr/imageType.js";
import { getCd } from "@/api/emrRecord/emr/image";

import commonMixins from "@/views/emrRecord/DocTempMaintenance/mixins/common.js";

export default {
  name: "specialSymbolManagement",
  components: {
    ImageCard,
    EditSection
  },
  computed: {
    ...mapGetters(["role"])
  },
  mixins: [commonMixins],
  data() {
    return {
      deptLocalFilterKeys: ["orgNm"],
      modeF: true,
      tableHeight: 400,
      tlm_isLoading: false,
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0,
        pageSize: 10 // 每页数据条数
      },
      searchTxt: "",
      imageTypeOpt: [],
      imageTypeMap: new Map(),
      parentNodeOpt: [],
      delArr: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      imageTypeForm: {
        imageTypeCode: "",
        imageTypeName: "",
        parentId: "",
        description: "",
        sortNo: "",
        pinyinCode: "",
        wubiCode: "",
        customCode: ""
      },
      tree: [],
      treeNode: {},
      treeLoading: false,
      imageTypeDialog: false,
      imageTypeMode: "新建",
      activeName: "mainTab",
      //接口参数
      form: {
        imageCode: "", //符号编码
        imageName: "", //符号名称
        imageType: "", // 图片类别
        dnFlag: "", //医护标识
        enabled: "",
        depts: ""
      },
      level0: false, //通用
      level1: false, //科室
      level2: false, //个人
      hosId: "",
      persId: "",
      depts: [],
      dialogVisible: false,
      selection: [],
      sTemplate: {},
      tableData: [],
      fit: "cover",
      rules: {
        imageTypeCode: [
          { required: true, message: "请输入编码", trigger: "blur" }
        ],
        imageTypeName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ]
      },
      disabledFlag: false
    };
  },
  watch: {
    searchTxt(val) {
      this.$refs.myTree.filter(val);
    }
  },
  created() {
    setTimeout(() => {
      this.changeTableHeight();
    });
    this.handleQuery();
    this.initTree();
  },
  methods: {
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.fetchData();
    },
    diaClose() {
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
    },
    modeChange() {},
    clickImgCard(data, selected) {
      if (selected) {
        this.selection.push(data);
      } else {
        this.selection = this.selection.filter(item => {
          return item.imageId != data.imageId;
        });
      }
    },
    changeTableHeight() {
      this.tableHeight =
        document.getElementById("imageMain").offsetHeight - 200;
      console.log("tableHeight", this.tableHeight);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    nodeClick(data) {
      this.form.imageType = data.id;
      this.treeNode = data;

      this.handleQuery();
    },
    addImageType(data, e) {
      this.imageTypeMode = "新建";
      console.log("add", this.treeNode);

      getCd()
        .then(res => {
          this.imageTypeForm.imageTypeCode = res.data;
        })
        .catch(res => {
          this.$message({
            type: "error",
            message: res.msg
          });
        });

      this.resetImageTypeForm();
      this.imageTypeDialog = true;
      if (Object.keys(this.treeNode).length > 0) {
        this.imageTypeForm.parentId = this.treeNode.id;
      }
    },
    resetImageTypeForm() {
      this.imageTypeForm = {
        imageTypeCode: "",
        imageTypeName: "",
        parentId: "",
        description: "",
        sortNo: "",
        pinyinCode: "",
        wubiCode: "",
        customCode: ""
      };
    },
    modifyImageType() {
      if (Object.keys(this.treeNode).length === 0) {
        this.$message.error("请选中修改项");
        return;
      }

      this.imageTypeMode = "修改";

      this.parentNodeOpt = [];
      this.tree.forEach(item => {
        this.hasChild(item, this.treeNode.id);
      });

      detail(this.treeNode.id)
        .then(res => {
          if (res.code == 1) {
            this.imageTypeDialog = true;
            this.imageTypeForm = res.data;
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },

    delImageType(node, data, e) {
      if (Object.keys(this.treeNode).length === 0) {
        this.$message.error("请选中修改项");
        return;
      }
      this.delArr = [];
      this.delChild(this.treeNode);
      delMulti(this.delArr)
        .then(res => {
          if (res.code == 1) {
            this.initTree();
            this.$message.success("删除成功");

            if (this.treeNode.id == this.form.imageType) {
              this.form.imageType = "";
              this.handleQuery();
            }
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    delChild(data) {
      this.delArr.push(data.id);
      if (data.children) {
        data.children.forEach(item => {
          this.delChild(item);
        });
      }
    },
    hasChild(data, id) {
      if (data.id != id) {
        this.parentNodeOpt.push({ id: data.id, label: data.label });
        if (data.children) {
          data.children.forEach(item => {
            this.hasChild(item, id);
          });
        }
      }
    },
    submitForm() {
      if (
        this.imageTypeForm.imageTypeCode === "" ||
        this.imageTypeForm.imageTypeName === ""
      ) {
        this.$message.error("编码和名称不可为空！");
        return;
      }

      if (this.imageTypeMode == "新建") {
        insert(this.imageTypeForm)
          .then(res => {
            if (res.code == 1) {
              this.initTree();
              this.$message.success("添加成功");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(res => {
            this.$message.error(res);
          });
      } else {
        update(this.imageTypeForm)
          .then(res => {
            if (res.code == 1) {
              this.initTree();
              this.$message.success("修改成功");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(res => {
            this.$message.error(res);
          });
      }
      this.imageTypeDialog = false;
    },
    initTree() {
      this.treeLoading = true;
      getTree({})
        .then(res => {
          if (res.code == 1) {
            this.tree = res.data;
            this.imageTypeOpt = [];
            this.imageTypeMap.clear();
            this.tree.forEach(item => {
              this.getAllType(item);
            });
            console.log("map", this.imageTypeMap);
          }
          this.treeLoading = false;
        })
        .catch(res => {
          this.$message.error(res.msg);
          this.treeLoading = false;
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
    },
    //查询
    handleQuery() {
      if (this.level1 == false) {
        this.depts = [];
      }
      //医院信息和登录人信息
      this.hosId = JSON.parse(getPamars()).hosId;
      this.persId = getUId();
      let obj = {
        level0: this.level0 == true ? "1" : "0",
        level1: this.level1 == true ? "1" : "0",
        level2: this.level2 == true ? "1" : "0",
        // 院区id和个人id后台从头部取值
        // hospitalId: this.hosId,
        // persId : this.level2 == true ? this.persId : '',
        depts: this.level1 == true ? this.depts.toString() : ""
        //pageNo: 1
      };
      this.form = { ...this.form, ...obj };

      this.pageParams = {
        pageNo: 1,
        pageSize: 10,
        total: 0
      };
      this.tableData = [];
      this.fetchData();
    },
    //调接口
    fetchData() {
      this.tlm_isLoading = true;
      getManageList({ ...this.form, ...this.pageParams })
        .then(res => {
          if (res.code === 1) {
            this.tableData = res.data;
            this.pageParams = {
              pageNo: res.pageNo,
              pageSize: res.pageSize,
              total: res.total
            };
            this.selection = [];
          } else {
            this.$message.error("获取数据失败");

            return;
          }
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },
    handleReset() {
      this.form.imageCode = ""; //符号编码
      this.form.imageName = ""; //符号名称
      this.form.imageType = ""; //类型
      this.form.dnFlag = ""; //医护标识
      this.form.enabled = ""; //启用
      this.level0 = false;
      this.level1 = false;
      this.level2 = false;
      this.depts = [];
    },

    selectRow(row, column, event) {
      this.$refs.tempTable.toggleRowSelection(row);
    },
    //选择项发生变化
    handleSelectionChange(val) {
      this.selection = val;
    },
    //双击打开编辑模板内容
    dblclickOpen(row, column, event) {
      this.$refs.tempTable.clearSelection();
      this.$refs.tempTable.toggleRowSelection(row, true);
      this.edit(row);
    },
    //新建按钮
    create() {
      this.sTemplate = {
        customCode: "",
        dataVersion: 0,
        description: "",
        dnFlag: "",
        enabled: "0",
        fileUrl: "",
        format: "",
        imageCode: "",
        imageId: "",
        imageName: "",
        imageType: "",
        imageUrlId: "",
        ownerId: "",
        ownerType: "",
        pinyinCode: "",
        sortNo: this.getSequence(),
        wubiCode: ""
      };
      this.disabledFlag = false;
      setTimeout(() => {
        this.dialogVisible = true;
      }, 200);
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
          id: item.imageId,
          code: item.imageCode,
          scopeLevel: item.ownerType,
          ownerId: item.ownerId,
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

      getDetail(this.selection[0].imageId).then(res => {
        if (res.code === 1) {
          this.sTemplate = res.data;

          if (!this.imageTypeMap.get(this.sTemplate.imageType)) {
            this.sTemplate.imageType = "";
          }

          setTimeout(() => {
            this.dialogVisible = true;
          }, 200);
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
        arr.push(index.imageId);
        delList.push(index.enabled);
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
    //启用
    async enable() {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.enabled;
        if (status === "1") {
          this.$message.error(
            index.imageName + "(" + index.imageCode + ")已启用，不能再次启用!"
          );
          return;
        }
        index.enabled = "1";
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
        let status = index.enabled;
        if (status === "2") {
          this.$message.error(
            index.imageName + "(" + index.imageCode + ")已停用，不能再次停用!"
          );
          return;
        }

        if (status === "0") {
          this.$message.error(
            index.imageName +
              "(" +
              index.imageCode +
              ")不可停用，请先启用后再停用!"
          );
          return;
        }

        // index.enabled = "2";
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

    handleSave(template) {
      this.pageParams = {
        pageNo: 1,
        pageSize: 10,
        total: 0
      };
      this.tableData = [];

      this.fetchData();
      //this.setSelectRow(template)
      setTimeout(() => {
        this.dialogVisible = false;
      }, 200);
    },
    handleUpdate(template) {
      this.pageParams = {
        pageNo: 1,
        pageSize: 10,
        total: 0
      };
      this.tableData = [];
      this.fetchData();
    },

    //回调编辑后，定位新增行
    setSelectRow(data) {
      this.tableData.forEach((item, index) => {
        if (item.imageId == data.imageId) {
          this.$refs.tempTable.clearSelection();
          this.$refs.tempTable.toggleRowSelection(this.tableData[index], true);
        }
      });
    },
    changeDept() {
      if (this.depts.length > 0) {
        if (this.level1 == false) {
          this.level1 = true;
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.hd-container {
  overflow: hidden;

  .myFormItem {
    width: 385px;
    display: inline-block;
  }

  .el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }

  /deep/ .el-form-item__content {
    margin-left: 0px !important;
  }
  .tablist {
    height: calc(100% - 150px);
    position: relative;
    border-top: 1px solid #e4e4e4;

    .table-contain {
      margin-top: 10px;
      height: calc(100% - 40px);
    }
  }

  .el-tree-node {
    white-space: normal;
    min-width: 100%;
    display: inline-block;
  }

  .el-tree-node__content {
    white-space: nowrap;
  }

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

  .special-item {
    width: 460px;
  }

  .margin-top-10 {
    margin-top: 10px;
  }

  .tree-left {
    height: 100%;
    width: 266px;
    float: left;
    background-color: #ffffff;
  }

  .tree-right {
    height: 100%;
    margin-left: 254px;
    background-color: #ffffff;
    position: relative;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
<style lang="scss" >
.el-tree-node > .el-tree-node__children {
  overflow: initial !important;
}
.form-control {
  position: relative;
  /*margin-left: 2em;*/
  width: 100px;
}
.form-control:before {
  content: "*";
  color: #f56c6c;
  position: absolute;
  top: 2px;
  left: -6px;
}
</style>
