<template>
  <div class="app-container" ref="page">
    <el-row :gutter="20" style="height: 100%">
      <el-col :span="8" style="padding: 30px !important; height: 100%">
        <span>所属模块:</span>

        <el-select
          placeholder="请选择1级类型"
          v-model="tl1"
          @change="handleSelectL1"
        >
          <el-option label="请选择" value />
          <el-option
            v-for="item in types_l1"
            :key="item.id"
            :label="item.paramName"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-button
          size="mini"
          icon="el-icon-refresh"
          type="primary"
          @click="handleReset"
          style="float: right; margin-right: 15px"
          >刷新</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="handleAdd"
          style="float: right; margin-right: 20px"
          icon="el-icon-plus"
          >新增</el-button
        >
        <!-- <el-button type="primary" @click="handleReset" style="margin-left:50px">刷新</el-button> -->

        <div class="tree_box" style="height: 90%; padding-bottom: 20px">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText"
          ></el-input>
          <el-tree
            :expand-on-click-node="false"
            :data="data"
            default-expand-all
            node-key="id"
            ref="tree"
            @node-click="handleChange"
            :filter-node-method="filterNode"
            :props="defaultProps"
            style="height: 100%; overflow-y: auto"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              :style="
                id == data.id
                  ? 'background:#ffc499;margin-left:-25px;padding-left:25px'
                  : ''
              "
            >
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="() => handleSingleEdit(data)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="() => handleDelete(data)"
                  >删除</el-button
                >
              </span>
            </span>
          </el-tree>
          <div class="allCount">
            <el-button
              type="text"
              icon="el-icon-refresh"
              style="margin-right: 30px"
              @click="handleTreeReset"
              >刷新</el-button
            >
            共&nbsp;{{ this.data.length }}&nbsp;条
          </div>
        </div>
      </el-col>
      <el-col
        :span="16"
        style="padding: 30px !important; height: 100%; overflow: auto"
      >
        <div
          v-if="
            (columns.length > 0 && tableData.length > 0 && isShow) || isName
          "
          :style="activeNames ? 'height: 60%; ' : 'height:75%'"
        >
          <el-table
            :data="tableData"
            style
            :height="activeNames ? '80%; ' : '80%'"
          >
            <el-table-column label="序号" width="150">
              <template slot-scope="scope">
                <span>{{
                  scope.$index + (form.page - 1) * form.pageSize + 1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in columns"
              :prop="item.cf"
              :label="item.cfn"
              :key="index"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="handleRemove(scope.row)"
                  type="text"
                  size="small"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <div style="position: relative">
            <div style="position: absolute; left: 0; top: 0px; z-index: 555">
              <span style="float: left">
                <el-input v-model="form.name" placeholder="配置名称"></el-input>
              </span>
              <span
                style="
                  float: left;
                  margin-left: 15px;
                  margin-top: 3px;
                  z-index: 555;
                "
              >
                <el-button size="mini" type="primary" @click="handleSearch"
                  >搜索</el-button
                >
              </span>
              <span
                style="
                  float: left;
                  margin-left: 15px;
                  margin-top: 3px;
                  z-index: 555;
                "
              >
                <el-button type="primary" size="mini" @click="handleClearName"
                  >清空</el-button
                >
              </span>
            </div>

            <pagination
              v-show="total > 0"
              :total="total"
              :pageSizes="pageSizes"
              :pageSize.sync="form.pageSize"
              :page.sync="form.page"
              :pageCount="pageCount"
              @pagination="changeSize"
              :layout="layout"
            />
          </div>
        </div>
        <div v-else style="height: 767px">暂无数据</div>
        <div
          :class="activeNames ? 'construction' : 'construction_new'"
          v-if="showContent && isShow"
        >
          <el-collapse v-model="activeNames" accordion>
            <el-collapse-item name="1">
              <template slot="title">
                <el-row :gutter="20" style="width: 100%">
                  <el-col :span="12">
                    <div style="font-weight: 500; font-size: 14px">
                      配置结构:
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div style="font-weight: 500; font-size: 14px">新增:</div>
                  </el-col>
                </el-row>
              </template>
              <el-row :gutter="20" class="edit">
                <el-col :span="11" style="height: 100%">
                  <el-form
                    :model="form1"
                    :label-position="labelPosition"
                    ref="form1"
                    label-width="100px"
                    style="padding: 20px"
                  >
                    <el-form-item label="类型">
                      <el-select v-model="type1" disabled>
                        <el-option
                          v-for="item in types"
                          :key="item.id"
                          :label="item.paramName"
                          :value="item.paramValue"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      v-for="(item, index) in form1.treeItem"
                      :key="index"
                      :label="item.cnfFieldName"
                      :prop="item.cnfField"
                    >
                      <el-input
                        v-if="item.cnfFieldType === 'input'"
                        v-model="item.cnfFieldValue"
                        style="width: 255px; margin-bottom: 7px"
                        :disabled="isDis || isCtype"
                      ></el-input>
                      <el-select
                        v-model="item.cnfFieldValue"
                        style="width: 255px; margin-bottom: 7px"
                        v-if="
                          item.cnfFieldType === 'select' && item.cnfFieldValues
                        "
                        :disabled="isDis || isCtype"
                      >
                        <el-option
                          v-for="it in JSON.parse(item.cnfFieldValues)"
                          :key="it.value"
                          :label="it.label"
                          :value="it.value"
                        ></el-option>
                      </el-select>
                      <el-checkbox-group
                        style="width: 255px; margin-bottom: 7px"
                        v-model="item.cnfFieldValue"
                        v-if="
                          item.cnfFieldType === 'checkbox' &&
                          item.cnfFieldValues
                        "
                        :disabled="isDis || isCtype"
                      >
                        <el-checkbox
                          v-for="it in JSON.parse(item.cnfFieldValues)"
                          :label="it.label"
                          :key="it.label"
                          >{{ it.label }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item
                      v-if="!isDis && !isCtype"
                      style="margin: 20px 0"
                    >
                      <el-button
                        type="primary"
                        size="mini"
                        @click="handleCnfSave()"
                        >保存</el-button
                      >
                      <el-button
                        type="primary"
                        size="mini"
                        @click="handleCancel()"
                        >取消</el-button
                      >
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="13" style="height: 100%">
                  <!-- <div v-if="!isCtype"> 隐藏添加编辑注释-->
                  <div>
                    <div
                      class="table_box"
                      style="height: 85%; padding-left: 20px"
                    >
                      <div>
                        <span class="type">类型</span>
                        <el-select
                          v-model="type"
                          placeholder="请选择类型"
                          @change="handleSelect"
                          :disabled="
                            isDis &&
                            (tableData.length <= 0 || columns.length <= 0)
                              ? false
                              : true
                          "
                        >
                          <el-option
                            v-for="item in types"
                            :key="item.id"
                            :label="item.paramName"
                            :value="item.paramValue"
                          ></el-option>
                        </el-select>
                      </div>
                      <el-form
                        :model="form2"
                        :label-position="labelPosition"
                        ref="form2"
                        label-width="100px"
                        style="padding: 0"
                        v-if="type"
                      >
                        <el-form-item
                          v-for="(item, index) in form2.treeItem"
                          :key="index"
                          :label="item.cnfFieldName"
                          :prop="item.cnfField"
                          style="margin-top: 7px"
                        >
                          <el-input
                            v-if="item.cnfFieldType === 'input'"
                            v-model="item.cnfFieldValue"
                            @input="changeValue(item)"
                            :disabled="!isDis"
                          ></el-input>
                          <el-select
                            v-model="item.cnfFieldValue"
                            v-if="
                              item.cnfFieldType === 'select' &&
                              item.cnfFieldValues
                            "
                            :disabled="!isDis"
                          >
                            <el-option
                              v-for="it in getJsonData(
                                item.cnfFieldName,
                                item.cnfFieldValues
                              )"
                              :key="it.value"
                              :label="it.label"
                              :value="it.value"
                            ></el-option>
                          </el-select>
                          <el-checkbox-group
                            v-model="item.cnfFieldValue"
                            v-if="
                              item.cnfFieldType === 'checkbox' &&
                              item.cnfFieldValues
                            "
                          >
                            <el-checkbox
                              v-for="it in getJsonData(
                                item.cnfFieldName,
                                item.cnfFieldValues
                              )"
                              :label="it.label"
                              :key="it.label"
                              :disabled="!isDis"
                              >{{ it.label }}</el-checkbox
                            >
                          </el-checkbox-group>
                        </el-form-item>
                        <el-form-item
                          style="margin-top: 20px; margin-bottom: 20px"
                        >
                          <el-button
                            type="primary"
                            size="mini"
                            @click="handleCnfAdd()"
                            >保存</el-button
                          >
                          <el-button
                            type="primary"
                            size="mini"
                            @click="handleCnfClear()"
                            >清空</el-button
                          >
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      title="新增单级列表"
      class="form_dialog"
      :before-close="handleClose"
    >
      <div style="padding-left: 20px; margin-bottom: 7px">
        <span class="type">类型</span>
        <el-select
          v-model="type2"
          placeholder="请选择类型"
          @change="handleSelectAdd"
          style="padding-left: 20px"
        >
          <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.paramName"
            :value="item.paramValue"
          ></el-option>
        </el-select>
      </div>
      <el-form
        :model="formAdd"
        :label-position="labelPosition"
        ref="formAdd"
        label-width="120px"
      >
        <el-form-item
          v-for="(item, index) in formAdd.treeItem"
          :key="index"
          :label="item.cnfFieldName"
          :prop="item.cnfField"
          style="margin-bottom: 7px"
        >
          <el-input
            v-if="item.cnfFieldType === 'input'"
            v-model="item.cnfFieldValue"
            @input="changeValue(item)"
          ></el-input>
          <el-select
            v-model="item.cnfFieldValue"
            v-if="item.cnfFieldType === 'select' && item.cnfFieldValues"
          >
            <el-option
              v-for="it in getJsonData(item.cnfFieldName, item.cnfFieldValues)"
              :key="it.value"
              :label="it.label"
              :value="it.value"
            ></el-option>
          </el-select>
          <el-checkbox-group
            v-model="item.cnfFieldValue"
            v-if="item.cnfFieldType === 'checkbox' && item.cnfFieldValues"
          >
            <el-checkbox
              v-for="it in getJsonData(item.cnfFieldName, item.cnfFieldValues)"
              :label="it.label"
              :key="it.label"
              >{{ it.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCnfTypeL1s,
  getCnfTreeSingle,
  getCnfanTypeTree,
  getColumns,
  getDatas,
  delRowVal,
  getCnfTypes,
  getCnfItem,
  getCnfanTypeTable,
  addCnf,
  searchType,
  deleteCnfTree,
  putCnfItem,
} from "@/api/wconf/wparam";
import { deepClone } from "@/utils";
import { log } from "util";
export default {
  data() {
    return {
      pageCount: 5,
      layout: "total, prev, pager, next, jumper",
      activeNames: "",
      isShow: false,
      cancelForm: {},
      item: {},
      isTop: false,
      dialogVisible: false,
      showContent: false,
      isDisabled: true,
      isDis: true,
      uplevelShow: true,
      upLevel: "",
      type1: "",
      type2: "",
      button_show: true,
      type: "",
      form1: {
        treeItem: [],
      },
      form2: {
        treeItem: [],
      },
      formAdd: {
        treeItem: [],
      },
      types: [],
      labelPosition: "left",
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
      data: [],
      tableData: [],
      types_l1: [
        {
          paramName: 123,
          id: 123,
        },
      ],
      tl1: null,
      columns: [],
      total: 0,
      form: {
        pageSize: 10,
        page: 1,
      },
      id: null,
      pageSizes: [10],
      isName:false,
    };
  },
  mounted() {
    this.getCnfTypeL1s();
    //这只要单级列表数据
    this.getCnfTree(this.tl1);
    this.getCnfTypes();
  },
  methods: {
    handleReset() {
      this.form = {
        pageSize: 10,
        page: 1,
      };
      this.tl1 = "";
      this.data = [];
      this.type = "";
      this.columns = [];
      this.filterText = "";
    },

    // 查询
    handleSearch() {
      this.form.page = 1;
      this.getDatas();
    },

    handleClearName() {
      this.form = {
        pageSize: 10,
        page: 1,
      };
      this.getDatas();
    },

    handleTreeReset() {
      this.isShow = false;
      this.form = {
        pageSize: 10,
        page: 1,
      };
      // this.type='';
      // this.columns=[];
      this.id = "";
    },

    handleAdd() {
      if (this.tl1) {
        this.type2 = "";
        this.formAdd.treeItem = [];
        this.dialogVisible = true;
        this.id = "";
      } else {
        this.$message("请选择所属模块");
      }
    },

    handleOk() {
      if (this.type2) {
        this.dialogVisible = false;
      }
      this.handleAddCnf(this.type2, this.formAdd.treeItem);
    },

    handleClose() {
      this.dialogVisible = false;
    },

    handleSelectAdd(val) {
      this.isTop = true;
      this.getCnfanTypeTable(val);
    },

    handleDelete(item) {
      console.log("itemitem", item);
      this.item = item;
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteCnfanTree(item.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    deleteCnfanTree(id) {
      deleteCnfTree(id).then((res) => {
        if (res.code === 1) {
          this.$message("删除数据成功");
          this.getCnfTree(this.tl1);
          this.handleCnfClear();
          this.isShow = false;
        } else {
          this.$message("删除数据失败");
        }
      });
    },

    getCnfTypes() {
      getCnfTypes().then((res) => {
        if (res.code === 1) {
          this.types = res.data;
        } else {
          this.$message("请求数据失败");
        }
      });
    },
    getCnfTypeL1s() {
      getCnfTypeL1s()
        .then((res) => {
          if (res.code === 1) {
            this.types_l1 = res.data;
          } else {
            this.$message("获取数据失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getCnfanType(id) {
      getCnfanTypeTree(id)
        .then((res) => {
          if (res.code === 1) {
            this.data = res.data;
          } else {
            this.$message("获取数据失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getCnfTree(pid) {
      getCnfTreeSingle(pid).then((res) => {
        if (res.code === 1) {
          this.data = res.data;
          this.$nextTick(() => {
            this.$refs.tree.filter(this.filterText);
          });
        } else {
          this.$message("请求数据失败");
        }
      });
    },

    // 选择类型
    handleSelect(val) {
      this.isTop = false;
      this.getCnfanTypeTable(val);
    },

    //  传入类型，获取表单
    getCnfanTypeTable(val) {
      getCnfanTypeTable({ type: val }).then((res) => {
        if (res.code === 1) {
          let list = [...res.data];
          let arr = [];
          let arr1 = [];
          for (let index of res.data) {
            if (
              index.cfnFieldType === "checkbox" &&
              index.hasOwnProperty("cfnFieldValue") === false
            ) {
              index.cfnFieldValue = [];
            }

            if (index.cnfFieldValues && index.cnfFieldValueType === "remote") {
              arr.push(index.cnfFieldValues);
            }
          }
          if (arr.length > 0) {
            let newArr = Array.from(new Set(arr));
            for (let index of newArr) {
              let obj = {
                code: index,
              };
              arr1.push(obj);
            }
            getArrayList(arr1).then((res) => {
              for (let index of list) {
                for (let index1 in res.data) {
                  console.log(index1);
                  if (index.cnfFieldValues === index1) {
                    let arr2 = [];
                    for (let index of res.data[index1]) {
                      let obj = {
                        label: index.name,
                        value: index.code,
                      };
                      arr2.push(obj);
                    }
                    index.cnfFieldValues = JSON.stringify(arr2);
                  }
                }
              }
              console.log("list", list);
              if (this.isTop) {
                this.formAdd.treeItem = list;
              } else {
                this.form2.treeItem = list;
              }
            });
          } else {
            if (this.isTop) {
              this.formAdd.treeItem = list;
            } else {
              this.form2.treeItem = list;
            }
          }
          /**/
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    handleCnfAdd() {
      let isAdd = true;
      this.form2.treeItem.map((val) => {
        if (val.cnfFieldLength) {
          if (!val.cnfFieldValue) {
            this.$message({
              type: "error",
              message: val.cnfFieldName + "不能为空",
            });
            isAdd = false;
            return;
          }
        }
      });
      if (!isAdd) {
        return;
      }
      this.handleAddCnf(this.type, this.form2.treeItem);
    },

    // 点击保存按钮
    handleCnfSave() {
      this.editCnfanItem();
    },

    editCnfanItem() {
      putCnfItem(this.form1.treeItem).then((res) => {
        if (res.code === 1) {
          this.$message("编辑数据成功");
          this.getCnfTree(this.tl1);
          this.isDis = true;
        } else {
          this.$message("编辑数据失败 ", res.msg);
        }
      });
    },

    handleAddCnf(type, treeItem) {
      if (!type) {
        this.$message("请先选择类型");
        return;
      }
      let obj = {};
      let cloneTreeItem = deepClone(treeItem);

      for (let index of cloneTreeItem) {
        if (Array.isArray(index.cnfFieldValue)) {
          index.cnfFieldValue = index.cnfFieldValue.join(";");
        }
      }
      //

      if (this.id) {
        obj = {
          cnfValues: cloneTreeItem,
          parentId: this.id,
        };
      } else {
        obj = {
          cnfValues: cloneTreeItem,
        };
      }
      obj.cmodule = this.tl1;
      if (this.isTop) {
        obj.isSingle = 1;
      } else {
        obj.isrow = 1;
      }

      console.log("objpbjdj", obj);
      //
      addCnf(obj).then((res) => {
        if (res.code === 1) {
          this.$message("添加成功");
          if (this.isTop) {
            this.getCnfTree(this.tl1);
          } else {
            this.getColumns({ id: this.id });
          }
        } else {
          this.$message("添加失败!" + res.msg);
        }
        for (let i in treeItem) {
          treeItem[i].cnfFieldValue = "";
        }

        this.uplevelShow = true;
      });
    },

    getDatas() {
      if (this.form.name) {
        this.isName = true;
      } else {
        this.isName = false;
      }
      let obj = {
        ...this.form,
        ...{ id: this.id, pageSize: this.columns.length * this.form.pageSize },
      };
      getDatas(obj).then((res) => {
        if (res.code === 1) {
          this.tableData = res.data;
          let t = res.total / this.columns.length;
          this.total = Math.ceil(t);
          if (this.tableData.length <= 0) {
            this.type = "";
          }
        } else {
          this.$message("请求数据失败");
        }
      });
    },

    searchType(data) {
      // let data={id:this.id}
      searchType(data).then((res) => {
        if (res.code === 1) {
          // console.log("res......", res);

          this.type = res.data;
          if (res.data) {
            this.getCnfanTypeTable(res.data);
          }
        } else {
          this.$message("请求数据失败");
        }
      });
    },

    getColumns(data) {
      // console.log(data);
      getColumns(data).then((res) => {
        if (res.code === 1) {
          if (res.data.length > 0) {
            this.columns = res.data;
            console.log("this.columns", res.data);
          } else {
            this.columns = [];
            return;
          }

          this.getDatas();
          console.log("+++++++++", this.type);
        } else {
          this.$message("请求数据失败");
        }
      });
    },

    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },

    handleSelectL1() {
      if (this.tl1 === "") {
        this.tl1 = null;
      }
      this.isShow = false;
      this.getCnfTree(this.tl1);
    },

    changeSize(obj) {
      this.form = { ...this.form, ...obj };
      this.getDatas();
    },

    handleChange(data) {
      this.activeNames = "";
      this.isShow = true;
      this.isDis = true;
      this.form = {
        pageSize: 10,
        page: 1,
      };
      // console.log("datatatata", data);
      this.showContent = true;
      this.id = data.id;
      this.searchType(data);
      this.getColumns({ id: data.id });
      this.handleEdit(data);
      this.handleCnfClear();
      // 加载类型
      this.getCnfTypes();
    },

    handleCancel() {
      this.getCnfanItem({ id: this.id });
      this.isDis = true;
      this.$message("已取消编辑");
    },

    handleSingleEdit(data) {
      this.isShow = true;
      this.activeNames = "";
      this.showContent = true;
      this.id = data.id;
      this.searchType(data);
      this.getColumns({ id: data.id });
      this.handleEdit(data);
      this.handleCnfClear();
      this.isDis = false;
      this.getCnfTypes();
      //  this.cancelForm=this.form1;
    },

    handleEdit(item) {
      console.log("item", item);
      this.type1 = item.exts.cnfTypeName;
      if (item.exts.cnfType) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
      const arr = this.data.filter((index) => index.id === item.id);
      if (arr.length > 0) {
        this.upLevel = arr[0].label;
      } else {
        this.upLevel = "";
      }
      this.getCnfanItem({ id: item.id });
    },

    getCnfanItem(params) {
      getCnfItem(params).then((res) => {
        if (res.code === 1) {
          for (let index of res.data) {
            if (index.orgFieldValueType === "remote") {
              let obj = { name: index.orgFieldValues };
              getArrayList(obj).then((res) => {
                let arr = [];
                if (res.code === 1) {
                  for (let index1 of res.data) {
                    let obj = {
                      label: index1.name,
                      value: index1.code,
                    };
                    arr.push(obj);
                    index.orgFieldValues = JSON.stringify(arr);
                  }
                }
              });
            }
            if (index.cnfFieldType === "checkbox") {
              if (index.hasOwnProperty("orgFieldValue")) {
                index.orgFieldValue = index.orgFieldValue.split(";");
              } else {
                index.orgFieldValue = "";
              }
            }
          }
          this.form1.treeItem = res.data;
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    // 点击清空
    handleCnfClear() {
      // this.type = ""
      this.uplevelShow = true;
      let form = [];
      if (!this.isDis) {
        form = this.form1.treeItem;
      } else {
        form = this.form2.treeItem;
      }
      for (let i in form) {
        form[i].cnfFieldValue = "";
      }
    },
    //输入值改变时设置长度限制
    changeValue(item) {
      if (item.cnfFieldValue.length > item.cnfFieldLength) {
        let str = item.cnfFieldValue.substr(0, item.cnfFieldLength);
        item.cnfFieldValue = str;
        this.$message({
          message:
            item.cnfFieldName +
            "的长度限制为" +
            item.cnfFieldLength +
            ",请您重新输入",
          type: "error",
        });
      }
    },
    handleRemove(val) {
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(val);
          delRowVal(val._id)
            .then((res) => {
              if (res.code != 1 && res.data === 0) {
                this.$message("删除数据失败");
              } else {
                this.form.page = 1;
                this.getDatas();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  // background-color: #ffffff;
  overflow: hidden;
  height: 100%;
  padding: 0;
}
.tree_box {
  padding: 20px 0 30px 0px;
}
.table_box {
  padding: 20px 30px 30px 0;
}
/deep/.el-tree {
  border: 1px solid #dcdfe6;
}
.btn_group {
  text-align: right;
  margin-bottom: 20px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
/deep/.el-form-item--medium .el-form-item__content {
  overflow: hidden;
}
.isNone {
  display: none;
}
.orgType {
  padding: 3px 5px;
  border: 1px solid $l-color-primary;
  display: inline-block;
  margin-left: 10px;
  border-radius: 4px;
  color: $l-color-primary;
  font-size: 10px;
  line-height: 10px;
  margin-right: 10px;
}
//设置按钮
.el-button--mini {
  border-radius: 0;
}
// 添加弹出框
.el-form {
  padding: 30px;
}

// 左侧
.el-col-8 {
  background-color: #fff;

  height: 100%;
  box-sizing: border-box;
}

// 右侧
.el-col-16 {
  background-color: #fff;
  padding: 20px;
  width: 65.26667%;
  margin-left: 1.4%;
  height: 100%;
}

/deep/.el-pagination {
  text-align: right;
}
/deep/.el-input.is-disabled .el-input__inner {
  margin-bottom: 7px;
  width: 255px;
}
/deep/.construction {
  .el-input__suffix {
    position: absolute;
    height: 100%;
    right: 5px;
    top: -5px;
    text-align: center;
    color: #c0c4cc;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    pointer-events: none;
  }
}
.el-col-13 {
  /deep/.el-input__inner {
    width: 255px;
  }
}
.type {
  width: 96px;
  display: inline-block;

  color: #606266;
  font-weight: 700;
  font-size: 16px;
}
.allCount {
  height: 30px;
  line-height: 30px;
  text-align: right;
  margin-right: 30px;
}
/deep/.el-dialog__body {
  padding: 30px;
  height: 400px;
  overflow: auto;
  .el-input__inner {
    width: 300px;
  }
}
/deep/.el-dialog {
  width: 900px;
  .el-form {
    padding: 0 0 0 20px;
  }
  .el-form-item__label {
    padding: 0;
    font-size: 16px;
  }
}
/deep/.construction_new {
  .el-input__suffix {
    position: absolute;
    height: 100%;
    right: 5px;
    top: -5px;
    text-align: center;
    color: #c0c4cc;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    pointer-events: none;
  }
}
/deep/.el-collapse-item__header {
  background-color: #fff;
}

/deep/.el-collapse-item__header {
  height: 35px;
  line-height: 35px;
}
/deep/.is-active {
  border-bottom: 1px solid #ebeef5;
}

.edit {
  height: 220px;
  overflow-y: auto;
}
</style>

