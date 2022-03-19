<template>
  <div class="tgm-container height100">
    <flow-menu>
      <el-card class="left">
        <div style="margin: 20px 10px 20px 10px">
          <el-row>
            <el-col :span="8">
              <el-button @click="createGroup">新建</el-button>
            </el-col>
            <el-col :span="8">
              <el-button @click="editGroup">编辑</el-button>
            </el-col>
            <el-col :span="8">
              <el-button @click="handleDeleteG">删除</el-button>
            </el-col>
          </el-row>
          <el-dialog
            :title="tgDialogMode"
            :visible.sync="createTypeGroupDialog"
            :close-on-click-modal="false"
            width="480px"
          >
            <div style="width: 480px; padding: 20px 40px">
              <div
                style="
                  height: 14px;
                  width: 3px;
                  background-color: #f05a23;
                  float: left;
                "
              ></div>
              <span style="float: left; margin-left: 8px">基本属性</span>
              <div style="clear: both"></div>
              <el-row style="margin-top: 20px">
                <el-col :span="5"
                  ><span
                    style="line-height: 30px; margin-left: 2em"
                    class="necessary-control"
                    >编码</span
                  ></el-col
                >
                <el-col :span="19"
                  >{{ gPrefix
                  }}<el-input
                    disabled
                    v-model="gCode"
                    style="width: 278px"
                    @change="handleChageGCode"
                  ></el-input
                ></el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5"
                  ><span style="line-height: 30px" class="necessary-control"
                    >上级编码</span
                  ></el-col
                >
                <el-col :span="19">
                  <el-select
                    v-model="createTypeGroupData.parentCode"
                    @change="getNextNumber"
                    clearable
                    placeholder="请选择"
                    style="width: 298px"
                  >
                    <el-option
                      v-for="item in typeGroupOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5">
                  <span
                    style="line-height: 30px; margin-left: 2em"
                    class="necessary-control"
                    >名称</span
                  >
                </el-col>
                <el-col :span="19"
                  ><el-input
                    maxlength="200"
                    v-model="createTypeGroupData.typeGroupName"
                    style="width: 298px"
                  ></el-input
                ></el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5"
                  ><span style="line-height: 30px">就诊类型</span></el-col
                >
                <el-col :span="19">
                  <l-value-domain-emr
                    clearable
                    filterable
                    style="width: 298px"
                    code="MedicalRecordType"
                    :value.sync="createTypeGroupData.visitType"
                    placeholder="请选择"
                  ></l-value-domain-emr>
                </el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5"
                  ><span style="line-height: 30px" class="necessary-control"
                    >医护标识</span
                  ></el-col
                >
                <el-col :span="19">
                  <l-value-domain-emr
                    clearable
                    filterable
                    style="width: 298px"
                    code="EmployeeMark"
                    :value.sync="createTypeGroupData.dnFlag"
                    placeholder="请选择"
                  ></l-value-domain-emr>
                </el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5"
                  ><span style="line-height: 30px; margin-left: 2em"
                    >顺序</span
                  ></el-col
                >
                <el-col :span="19">
                  <el-input-number
                    v-model="createTypeGroupData.number"
                    controls-position="right"
                    :min="1"
                    style="width: 298px"
                  ></el-input-number>
                </el-col>
              </el-row>
              <el-row style="margin-top: 18px; height: 142px">
                <el-col :span="5"
                  ><span style="line-height: 30px; margin-left: 2em"
                    >描述</span
                  ></el-col
                >
                <el-col :span="19"
                  ><el-input
                    type="textarea"
                    v-model="createTypeGroupData.description"
                    style="width: 298px"
                  ></el-input
                ></el-col>
              </el-row>
            </div>
            <div slot="footer">
              <el-button type="primary" @click="typeGroupDetermine"
                >确定</el-button
              >
              <el-button @click="createTypeGroupDialog = false">取消</el-button>
            </div>
          </el-dialog>
        </div>
        <div style="margin: 10px; overflow: auto">
          <el-tree
            ref="groupTree"
            :data="tree"
            :props="defaultProps"
            node-key="id"
            @node-click="handleNodeClick"
            :default-expand-all="true"
            v-loading="loading"
          ></el-tree>
        </div>
      </el-card>
      <el-card class="right">
        <div style="padding: 10px 20px">
          <div class="search-con clearfix">
            <div class="search-main float-left">
              <div class="common-width margin-top-10">
                <l-formt-title label="编码">
                  <el-input
                    style="width: 160px"
                    v-model="queryTypeListParam.typeCode"
                  ></el-input
                ></l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="名称">
                  <el-input
                    style="width: 160px"
                    v-model="queryTypeListParam.typeName"
                  ></el-input
                ></l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="文书类型组">
                  <el-select
                    v-model="queryTypeListParam.typeGroupCode"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width: 130px"
                  >
                    <el-option
                      v-for="item in typeGroupOptions1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option> </el-select
                ></l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="医护标识">
                  <l-value-domain-emr
                    clearable
                    style="width: 140px"
                    code="EmployeeMark"
                    :value.sync="queryTypeListParam.dnFlag"
                    placeholder="请选择"
                  ></l-value-domain-emr
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
            margin-top: 10px;
            padding: 10px 20px;
            border-top: 1px solid #dcdfe6;
          "
        >
          <div class="iconBtn clearfix">
            <div class="float-right">
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
          </div>
          <div class="" style="margin-top: 10px; height: calc(100% - 40px)">
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
              >
                <el-table-column
                  type="selection"
                  width="50px"
                ></el-table-column>
                <el-table-column
                  type="index"
                  label="序号"
                  :index="indexMethod"
                  width="80px"
                ></el-table-column>
                <el-table-column
                  prop="typeCode"
                  label="编码"
                  width="160px"
                ></el-table-column>
                <el-table-column
                  prop="typeName"
                  label="名称"
                  width="160px"
                ></el-table-column>
                <el-table-column label="是否续打" width="160px">
                  <template slot-scope="scope">
                    <span>{{
                      typeTable[scope.$index].continuedPrinting === 1
                        ? "是"
                        : "否"
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="书写次数" width="160px">
                  <template slot-scope="scope">
                    <span
                      :val="scope.row.writeNum"
                      code="WriteTime"
                      v-codeTransformEmr
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="typeGroupName"
                  label="文书类型组"
                  width="160x"
                ></el-table-column>
                <el-table-column
                  prop="dnFlagName"
                  label="医护标识"
                  width="160px"
                ></el-table-column>
                <el-table-column
                  prop="number"
                  label="顺序"
                  width="160px"
                ></el-table-column>
                <el-table-column
                  prop="description"
                  label="描述"
                ></el-table-column>
              </el-table>
            </l-table>
          </div>

          <el-dialog
            :title="tDialogMode"
            :visible.sync="createTypeDialog"
            :close-on-click-modal="false"
            width="480px"
          >
            <div style="width: 480px; padding: 20px 40px">
              <el-row style="margin-top: 20px">
                <el-col :span="5">
                  <span
                    style="line-height: 30px; margin-left: 3em"
                    class="necessary-control"
                    >编码</span
                  >
                </el-col>
                <el-col :span="19">
                  {{ tPrefix
                  }}<el-input
                    v-model="tCode"
                    disabled
                    style="width: 278px"
                    @change="handleChageTCode"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5">
                  <span
                    style="line-height: 30px; margin-left: 3em"
                    class="necessary-control"
                    >名称</span
                  >
                </el-col>
                <el-col :span="19">
                  <el-input
                    v-model="createTypeData.typeName"
                    style="width: 298px"
                  ></el-input
                ></el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5">
                  <span
                    style="line-height: 30px; margin-left: 0em"
                    class="necessary-control"
                    >文书类型组</span
                  >
                </el-col>
                <el-col :span="19">
                  <el-select
                    v-model="createTypeData.typeGroupCode"
                    @change="changeGroup"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width: 298px"
                  >
                    <el-option
                      v-for="item in typeGroupOptions1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option> </el-select
                ></el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-checkbox
                  v-model="createTypeData.continuedPrinting"
                  true-label="1"
                  false-label="0"
                  style="margin-left: 6em"
                  @change="continuedPrintingChange"
                  >是否续打</el-checkbox
                >
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5">
                  <span style="line-height: 30px; margin-left: 1em"
                    >就诊类型</span
                  >
                </el-col>
                <el-col :span="19">
                  <l-value-domain-emr
                    filterable
                    clearable
                    style="width: 298px"
                    :disabled="vDisabled"
                    code="MedicalRecordType"
                    :value.sync="createTypeData.visitType"
                    placeholder="请选择"
                  ></l-value-domain-emr
                ></el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5">
                  <span style="line-height: 30px; margin-left: 1em"
                    >医护标识</span
                  >
                </el-col>
                <el-col :span="19">
                  <l-value-domain-emr
                    clearable
                    style="width: 298px"
                    :disabled="nDisabled"
                    code="EmployeeMark"
                    :value.sync="createTypeData.dnFlag"
                    placeholder="请选择"
                  ></l-value-domain-emr
                ></el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5">
                  <span style="line-height: 30px; margin-left: 1em"
                    >书写次数</span
                  >
                </el-col>
                <el-col :span="19">
                  <l-value-domain-emr
                    clearable
                    style="width: 298px"
                    code="WriteTime"
                    :value.sync="createTypeData.writeNum"
                    placeholder="请选择"
                  ></l-value-domain-emr>
                </el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5">
                  <span style="line-height: 30px; margin-left: 1em"
                    >打印选项</span
                  >
                </el-col>
                <el-col :span="19">
                  <l-value-domain-emr
                    style="width: 298px"
                    code="PrintOption"
                    :value.sync="createTypeData.printOption"
                    placeholder="请选择"
                  ></l-value-domain-emr
                ></el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5">
                  <span style="line-height: 30px; margin-left: 3em">顺序</span>
                </el-col>
                <el-col :span="19">
                  <el-input-number
                    v-model="createTypeData.number"
                    controls-position="right"
                    :min="1"
                    style="width: 298px"
                  ></el-input-number
                ></el-col>
              </el-row>
              <el-row style="margin-top: 18px; height: 142px">
                <el-col :span="5">
                  <span style="line-height: 30px; margin-left: 3em">描述</span>
                </el-col>
                <el-col :span="19">
                  <el-input
                    type="textarea"
                    v-model="createTypeData.description"
                    style="width: 298px"
                  ></el-input
                ></el-col>
              </el-row>
            </div>
            <div slot="footer">
              <el-button type="primary" @click="typeDetermine">确定</el-button>
              <el-button @click="createTypeDialog = false">取消</el-button>
            </div>
          </el-dialog>
        </div>
      </el-card>
    </flow-menu>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";

import {
  getTree,
  create,
  getTypeGroupById,
  modifyTypeGroupById,
  deleteById,
  getTypeGroupNextSeqNo,
  getTypeGroupByCode
} from "@/api/emrRecord/emr/typeGroup";

import {
  getTypeListPage,
  createType,
  getTypeInfoById,
  modifyTypeInfoById,
  deleteTypeById,
  deleteForBatch,
  getTypeNextSeqNo,
  getNextTypeNum
} from "@/api/emrRecord/emr/type";

export default {
  name: "typeGroupMaintain",
  components: {
    FlowMenu
  },
  data() {
    return {
      gPrefix: "G_",
      gCode: "",
      tPrefix: "T_",
      tCode: "",
      tree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      queryTypeListParam: {
        typeCode: "",
        typeName: "",
        typeGroupCode: "",
        dnFlag: ""
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      layout: "total,prev,pager,next,jumper",
      typeGroupOptions: [],
      typeGroupOptions1: [],
      medicalCareFOptions: [
        {
          value: "1",
          label: "医生"
        },
        {
          value: "2",
          label: "护士"
        }
      ],
      typeTable: [],
      createTypeGroupDialog: false,
      tgDialogMode: "新建文书类型组",
      createTypeGroupData: {
        typeGroupCode: "",
        typeGroupName: "",
        parentCode: "",
        visitType: "",
        dnFlag: "",
        number: "",
        description: ""
      },

      createTypeDialog: false,
      tDialogMode: "新建文书类型",
      createTypeData: {
        typeCode: "",
        typeName: "",
        typeGroupCode: "",
        number: "",
        description: "",
        continuedPrinting: 0,
        printOption: "02",
        writeNum: "",
        visitType: "",
        dnFlag: ""
      },
      curNode: {},
      loading: false,
      loading1: false,
      vDisabled: false,
      nDisabled: false,
      vParentId: "qy",
      vNumArr: []
    };
  },
  watch: {
    gCode(val) {
      this.createTypeGroupData.typeGroupCode = this.gPrefix + val;
    },
    tCode(val) {
      this.createTypeData.typeCode = this.tPrefix + val;
    }
  },
  methods: {
    continuedPrintingChange(val) {
      console.log(val, "valval");
      if (val == 1) {
        this.createTypeData.printOption = "03";
      }
    },
    handleChageGCode() {
      if (this.gCode == "") {
        this.$message.error("编码不可为空！");
      }
    },
    handleChageTCode() {
      if (this.tCode == "") {
        this.$message.error("编码不可为空！");
      }
    },
    changeGroup() {
      let groupCode = this.createTypeData.typeGroupCode;
      getTypeGroupByCode({ code: groupCode }).then(res => {
        if (res.code === 1) {
          if (res.data.visitType) {
            this.createTypeData.visitType = res.data.visitType;
            this.vDisabled = true;
          } else {
            this.vDisabled = false;
          }
          if (res.data.dnFlag) {
            this.createTypeData.dnFlag = res.data.dnFlag;
            this.nDisabled = true;
          } else {
            this.nDisabled = false;
          }
        } else {
          this.$message.error("获取类型组失败！");
        }
      });
      if (this.tDialogMode == "新建文书类型") {
        //获取下一个顺序号
        getNextTypeNum({
          typeGroupCode: this.createTypeData.typeGroupCode
        })
          .then(res => {
            if (res.code === 1) {
              this.createTypeData.number = res.data;
            } else {
              this.$message.error(res.msg || "接口失败!");
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    handleNodeClick(node) {
      this.curNode = node;
      if (!["zh", "ks", "gr", "qy"].includes(node.id)) {
        this.queryTypeListParam.typeGroupCode = node.id;
        this.insTypeQuery();
      }
    },
    handleRowClick(row, event, column) {
      this.$refs.typeTable.toggleRowSelection(row);
    },
    createGroup() {
      getTypeGroupNextSeqNo().then(res => {
        if (res.code === 1) {
          this.createTypeGroupData = {
            typeGroupCode: "",
            typeGroupName: "",
            parentCode: "",
            visitType: "",
            dnFlag: "",
            number: "",
            description: ""
          };
          let curKey = this.$refs.groupTree.getCurrentKey();
          if (curKey) {
            this.createTypeGroupData.parentCode = curKey;
          } else {
            this.createTypeGroupData.parentCode = "zh";
          }
          this.getNextNumber();
          this.gCode = res.data;
          this.tgDialogMode = "新建文书类型组";
          this.createTypeGroupDialog = true;
        } else {
          this.$message.error("获取类型组流水号失败！");
        }
      });
    },
    editGroup() {
      // 只能选择一条
      // if()this.$refs.typeTable

      this.tgDialogMode = "编辑文书类型组";
      getTypeGroupById({ id: this.curNode.exts.keyId }).then(res => {
        if (res.code == 1) {
          this.createTypeGroupData = { ...res.data };
          let temp = this.createTypeGroupData.typeGroupCode;
          this.gCode = temp.replace(this.gPrefix, "");
          if (this.createTypeGroupData.parentCode == null) {
            if (this.createTypeGroupData.scopeLevel === "0") {
              this.createTypeGroupData.parentCode = "qy";
            } else if (this.createTypeGroupData.scopeLevel === "1") {
              this.createTypeGroupData.parentCode = "ks";
            }
            if (this.createTypeGroupData.scopeLevel === "2") {
              this.createTypeGroupData.parentCode = "gr";
            }

            if (this.createTypeGroupData.scopeLevel === "9") {
              this.createTypeGroupData.parentCode = "zh";
            }
          }
          if (res.data.visitType) {
            this.createTypeData.visitType = res.data.visitType;
            this.vDisabled = true;
          } else {
            this.vDisabled = false;
          }
          if (res.data.dnFlag) {
            this.createTypeData.dnFlag = res.data.dnFlag;
            this.nDisabled = true;
          } else {
            this.nDisabled = false;
          }
          this.createTypeGroupDialog = true;
        } else {
          this.$message.error(res.msg || "接口失败!");
        }
      });
    },
    handleDeleteG() {
      this.$confirm("此操作将删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delGroup();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delGroup() {
      deleteById({ id: this.curNode.id }).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "删除成功!",
            type: "success"
          });
          this.queryTypeListParam.typeGroupCode = "";
          this.getTree();
        } else {
          this.$message.error("删除失败!");
        }
      });
    },
    createType() {
      getTypeNextSeqNo().then(res => {
        if (res.code === 1) {
          this.createTypeData = {
            typeCode: "",
            typeName: "",
            typeGroupCode: "",
            number: "",
            description: "",
            continuedPrinting: 0,
            printOption: "02",
            writeNum: 0,
            visitType: "",
            dnFlag: ""
          };
          this.tCode = res.data;
          this.tDialogMode = "新建文书类型";
          this.createTypeDialog = true;
        } else {
          this.$message.error("获取类型流水号失败！");
        }
      });
    },
    getNextNumber() {
      this.vNumArr = [];
      this.vParentId = this.createTypeGroupData.parentCode;
      this.getNextNumByParentId(this.tree);
      this.createTypeGroupData.number = Math.max(...this.vNumArr) + 1;
    },
    /*
     * 获取树形某个节点下所有直接子节点的最大顺序号+1
     * @returns {number}
     */
    getNextNumByParentId(arr) {
      arr.forEach(item => {
        if (item.id == this.vParentId) {
          if (item.children) {
            item.children.forEach(item2 => {
              this.vNumArr.push(item2.exts.number);
            });
          }
        } else {
          if (item.children) {
            this.getNextNumByParentId(item.children);
          }
        }
      });
    },
    modifyType() {
      if (this.$refs.typeTable.selection.length > 1) {
        this.$message("只能选中一条数据");
        return;
      }
      this.tDialogMode = "编辑文书类型";
      if (this.$refs.typeTable.selection.length == 0) {
        this.$message({
          message: "请先勾选一条记录!",
          type: "warning"
        });
        return;
      }
      var req = {
        id: this.$refs.typeTable.selection[0].typeId
      };
      getTypeInfoById(req).then(res => {
        if (res.code === 1) {
          this.createTypeData = res.data;
          this.createTypeData.continuedPrinting = this.createTypeData.continuedPrinting.toString();
          let temp = this.createTypeData.typeCode;
          this.tCode = temp.replace(this.tPrefix, "");
          this.createTypeDialog = true;
          this.changeGroup();
        } else {
          this.$message.error(res.msg || "接口失败!");
        }
      });
    },
    handelDeleteT() {
      if (this.$refs.typeTable.selection.length == 0) {
        this.$message({
          message: "请先选择类型!",
          type: "warning"
        });
        return;
      }
      let arr = [];

      for (let index of this.$refs.typeTable.selection) {
        arr.push(index);
      }
      this.$confirm("此操作将删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delType(arr);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delType(arr) {
      deleteForBatch(arr).then(res => {
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
    async typeGroupDetermine() {
      if (this.createTypeGroupData.typeGroupName === "") {
        this.$message.error("名称不可为空!");
        return;
      }
      if (this.createTypeGroupData.parentCode === "") {
        this.$message.error("上级编码不可为空!");
        return;
      }
      if (this.createTypeGroupData.dnFlag === "") {
        this.$message.error("医护标识不可为空!");
        return;
      }
      if (
        this.createTypeGroupData.parentCode === "qy" ||
        this.createTypeGroupData.parentCode === "ks" ||
        this.createTypeGroupData.parentCode === "gr" ||
        this.createTypeGroupData.parentCode === "zh"
      ) {
        this.createTypeGroupData.parentCode = null;
      }
      if (this.tgDialogMode == "新建文书类型组") {
        await create(this.createTypeGroupData).then(res => {
          if (res.code === 1) {
            this.$message({
              message: "新增成功!",
              type: "success"
            });
            this.createTypeGroupDialog = false;
          } else {
            this.$message.error(res.msg || "新增失败!");
          }
        });
        this.getTree();
      } else {
        await create(this.createTypeGroupData).then(res => {
          if (res.code === 1) {
            this.$message({
              message: "修改成功!",
              type: "success"
            });
            this.createTypeGroupDialog = false;
          } else {
            this.$message.error(res.msg || "修改失败!");
          }
        });
        this.getTree();
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
    async insTypeQuery() {
      this.loading1 = true;
      await getTypeListPage({
        ...this.queryTypeListParam,
        ...this.pageParams
      }).then(res => {
        if (res.code == 1) {
          this.typeTable = res.data;
          this.pageParams.total = res.total;
        } else {
          this.$message.error("查询失败!");
        }
      });
      this.loading1 = false;
    },
    clearCondition() {
      this.queryTypeListParam = {
        typeCode: "",
        typeName: "",
        typeGroupCode: "",
        dnFlag: ""
      };
    },
    typeDetermine() {
      if (this.createTypeData.typeName === "") {
        this.$message.error("名称不可为空!");
        return;
      }
      if (this.createTypeData.typeGroupCode === "") {
        this.$message.error("文书类型组不可为空!");
        return;
      }

      if (this.tDialogMode == "新建文书类型") {
        createType(this.createTypeData)
          .then(res => {
            if (res.code == 1) {
              this.createTypeDialog = false;
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
            console.log(error);
            this.$message.error(error.msg || "检查文书依赖接口异常");
          });
      } else {
        console.log("createTypeData:", this.createTypeData);
        modifyTypeInfoById(this.createTypeData).then(res => {
          if (res.code === 1) {
            this.createTypeDialog = false;
            this.$message({
              message: "修改成功!",
              type: "success"
            });
            this.insTypeQuery();
          } else {
            this.$message.error(res.msg || "接口失败!");
          }
        });
      }
    },
    dgTree(node) {
      this.typeGroupOptions.push({
        value: node.id,
        label: node.label
      });
      if (!["医院", "通用", "科室", "个人"].includes(node.label)) {
        this.typeGroupOptions1.push({
          value: node.id,
          label: node.label
        });
      }
      if (node.children) {
        node.children.forEach(item => {
          this.dgTree(item);
        });
      }
    },
    async getTree() {
      this.loading = true;
      await getTree({}).then(res => {
        if (res.code === 1) {
          this.tree = res.data;
          this.typeGroupOptions = [];
          this.typeGroupOptions1 = [];
          res.data.forEach(item => {
            this.dgTree(item);
          });
        } else {
          this.$message.error(res.msg || "接口失败!");
        }
      });
      this.loading = false;
    }
  },
  mounted() {
    this.getTree();
    this.insTypeQuery();
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
      width: 210px;
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
