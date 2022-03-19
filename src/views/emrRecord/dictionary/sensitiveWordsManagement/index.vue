<template>
  <div class="hd-container height100 width100" ref="page">
    <l-layout
      :toolBoxShow="false"
      :isLeftExpand="false"
      :patientListShow="false"
    >
      <template #content>
        <div class="tree-left height100">
          <el-row class="margin-10">
            <span> 请选择敏感词类型:</span>
          </el-row>
          <el-row class="margin-10">
            <l-value-domain-emr
              code="sensitiveType"
              :value.sync="currentType"
              style="width: 225px"
              @change="handleSelect"
            >
            </l-value-domain-emr>
          </el-row>
          <el-row> </el-row>
          <el-row
            class="tree_box"
            v-loading="loading"
            style="
              height: 90%;
              padding-left: 10px;
              padding-right: 10px;
              padding-bottom: 20px;
            "
          >
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText"
              @change="filterTextChanged"
            ></el-input>
            <el-tree
              id="myTree"
              :expand-on-click-node="false"
              :data="treeData"
              default-expand-all
              node-key="_id"
              ref="tree"
              @node-click="handleChange"
              :filter-node-method="filterNode"
              :props="defaultProps"
              style="height: 100%; overflow-y: auto; padding-top: 5px"
            >
              <span
                class="custom-tree-node"
                slot-scope="{ node, data }"
                :style="
                  node.isCurrent
                    ? 'background:#ffc499;margin-left:-25px;padding-left:25px'
                    : ''
                "
              >
                <span>{{ node.data.name }}</span>
              </span>
            </el-tree>
          </el-row>
        </div>
        <div class="tree-right height100">
          <div class="tablist">
            <div style="height: 40px; padding: 5px 0px">
              <span style="font-weight: bold; font-size: 20px">
                {{ currentText }}</span
              >
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
                  class="my-table"
                  :data="tableData"
                  ref="sectionTempTable"
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
                    prop="sensitiveType"
                    label="敏感词类型"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.sensitiveType"
                        code="sensitiveType"
                        v-code-transform-emr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="使用范围">
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.sensitiveType === '1'"
                        :val="scope.row.sensitiveTypeEx"
                        code="GENDER_CODE"
                        v-code-transform-emr
                      ></span>
                      <!-- <span
                          v-if="scope.row.sensitiveType === '3'"
                          columns="diseases_name"
                          :conditionMap="{
                            diseases_id: scope.row.sensitiveTypeEx,
                          }"
                          tableName="md_diseases"
                          v-tableTransformEmr
                        ></span> -->
                      <span v-if="scope.row.sensitiveType === '3'">
                        {{ scope.row.sensitiveTypeEx2 }}
                      </span>
                      <span v-if="scope.row.sensitiveType === '2'">{{
                        ageScopeMap
                          .get(scope.row.sensitiveTypeEx)
                          .replace(
                            "#1",
                            `${scope.row.ageParam1}${ageUnitMap.get(
                              scope.row.ageUnit
                            )}`
                          )
                          .replace(
                            "#2",
                            `${scope.row.ageParam2}${ageUnitMap.get(
                              scope.row.ageUnit
                            )}`
                          )
                      }}</span>
                      <span
                        v-if="scope.row.sensitiveType === '4'"
                        :val="scope.row.sensitiveTypeEx"
                        code="emrSickState"
                        v-code-transform-emr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="prompt" label="提示类型" width="150">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.prompt"
                        code="promptLevel"
                        v-code-transform-emr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sensitiveWordCode"
                    label="敏感词编码"
                    width="100"
                  ></el-table-column>
                  <el-table-column
                    prop="sensitiveWord"
                    label="敏感词"
                    width="500"
                  ></el-table-column>
                  <el-table-column prop="enabled" label="是否启用" width="150">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.enabled"
                        code="ModelStatus"
                        v-code-transform-emr
                      ></span>
                    </template>
                  </el-table-column>
                </el-table>
              </l-table>
            </div>
          </div>
          <edit-section
            :isShow.sync="dialogVisible"
            :template="sTemplate"
            @handle-save="handleSave"
            @handle-update="handleUpdate"
          ></edit-section>
        </div>
      </template>
    </l-layout>
  </div>
</template>
<script>
import { get } from "@/utils/request";
import EditSection from "./components/editSection";
import {
  getIcd10DictionaryByKey,
  getAllIcd10Dictionary,
  getIcd10DictionaryPage
} from "@/api/emrRecord/emr/paragraphType";
import {
  getManageList,
  getDetail,
  multiUpdate,
  removeBatch
} from "@/api/emrRecord/emr/sensitiveWord";

export default {
  name: "sensitiveWordsManagement",
  components: {
    EditSection
  },
  computed: {
    tlm_noMore1() {
      return (
        Math.ceil(this.pageParams1.total / this.pageParams1.pageSize) <=
        this.pageParams1.pageNo
      );
    }
  },
  data() {
    return {
      tableHeight: 600,
      // 类型为诊断时
      pageParams1: {
        pageNo: 1, // 当前页数
        total: 5,
        pageSize: 50 // 每页数据条数
      },
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0,
        pageSize: 10 // 每页数据条数
      },
      tlm_isLoading1: false,
      tlm_isLoading: false,
      dialogVisible: false,
      selection: [],
      sTemplate: {},
      currentType: "1", //当前类型
      filterText: "",
      currentText: "无",
      currentCode: "",
      loading: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      form: {
        ageUnit: "",
        enabled: "",
        prompt: "",
        sensitiveType: "",
        sensitiveVal: "", //年龄类型传年龄    其他传相应code
        sensitiveWord: "",
        sensitiveWordCode: "",
        pageSize: 10,
        pageNo: 1
      },
      tableData: [],
      table_isLoading: false,
      ageScopeMap: new Map([
        ["1", "小于#1"],
        ["2", "小于等于#1"],
        ["3", "等于#1"],
        ["4", "大于#1"],
        ["5", "大于等于#1"],
        ["6", "大于#1并且小于#2"],
        ["7", "大于等于#1并且小于#2"],
        ["8", "大于#1并且小于等于#2"],
        ["9", "大于等于#1并且小于等于#2"]
      ]),
      ageUnitMap: new Map([["1", "天"], ["2", "月"], ["3", "岁"]])
    };
  },
  watch: {
    filterText(val) {
      console.log("filterText========", val);
      console.log("this.$refs.tree========", this.$refs.tree);
      // this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.handleSelect();
  },
  methods: {
    changeSize(val) {
      console.log("val====", val);
      this.pageParams.pageNo = val.page;
      this.fetchData();
    },

    //检索字段修改
    filterTextChanged() {
      if (this.currentType == 3) {
        this.treeData = [];
        if (this.filterText === "") {
          this.pageParams1 = {
            pageNo: 1, // 当前页数
            total: 0,
            pageSize: 50 // 每页数据条数
          };
          this.getDiagListInPage();
        } else {
          this.getDiagList();
        }
      } else {
        if (this.filterText === "") {
          this.handleSelect();
        }
        this.treeData = this.treeData.filter(item => {
          return item.name.indexOf(this.filterText) > -1;
        });
      }
    },
    async getDiagListInPage() {
      try {
        this.loading = true;
        await getIcd10DictionaryPage({
          pageNo: this.pageParams1.pageNo,
          pageSize: this.pageParams1.pageSize
        }).then(res => {
          if (res.code == 1) {
            let list = [];
            for (let index of res.data) {
              list.push({
                _id: index.icd10DictionaryId,
                code: index.icd10Encoding,
                name: index.dictionaryName
              });
            }
            this.treeData = [...this.treeData, ...list];
            this.pageParams1 = {
              pageNo: res.pageNo,
              total: res.total,
              pageSize: res.pageSize
            };
            console.log("pageParams1", this.pageParams1);
          }
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$message.error(e.msg);
      }
    },
    //选择敏感词类型
    handleSelect() {
      console.log("this.currentType=====", this.currentType);
      this.filterText = "";
      this.form.sensitiveType = this.currentType;
      this.form.sensitiveVal = "";

      this.pageParams = {
        pageNo: 1,
        pageSize: 10,
        total: 0
      };
      this.tableData = [];
      this.fetchData();
      this.currentText = "无";
      this.treeData = [];
      switch (this.currentType) {
        case "1":
          this.getSex();
          break;
        case "2":
          this.getAge();
          break;
        case "3":
          this.pageParams1 = {
            pageNo: 1, // 当前页数
            total: 5,
            pageSize: 50 // 每页数据条数
          };
          this.getDiagListInPage();
          break;
        case "4":
          this.getCondition();
          break;
        default:
          this.treeData = [];
          this.tableData = [];
      }
    },
    //调用接口
    getSex() {
      this.treeData = [];
      this.loading = true;
      let url = "/wdata/dic/single/GENDER_CODE";
      get(url)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.treeData = res.data;
          } else {
            this.$message("获取数据失败");
            return;
          }
        })
        .catch(error => {
          this.treeData = [];
          this.loading = false;
          console.log(error);
        });
    },
    getAge() {
      this.treeData = [];
    },

    getDiagList() {
      this.treeData = [];
      this.loading = true;
      getIcd10DictionaryByKey(this.filterText)
        .then(res => {
          this.loading = false;
          console.log("res============", res);
          if (res.code === 1 && res.data) {
            let list = [];
            for (let index of res.data) {
              list.push({
                _id: index.icd10DictionaryId,

                code: index.icd10Encoding,
                name: index.dictionaryName
              });
            }
            this.treeData = list;
            console.log("this.treeData======", this.treeData);
          } else {
            this.$message("获取数据失败");
            return;
          }
        })
        .catch(err => {
          this.treeData = [];
          this.$message.error(err);
        });
    },
    getCondition() {
      // 获得病情的list接口
      this.treeData = [];
      this.loading = true;
      let url = "/wdata/dic/single/emrSickState";
      get(url)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.treeData = res.data;
            console.log("res.data====", res.data);
          } else {
            this.$message("获取数据失败");
            return;
          }
        })
        .catch(error => {
          this.treeData = [];
          this.loading = false;
        });
    },
    filterData() {
      if (this.currentType == "3") {
        this.getDiagList(this.filterText);
      }
    },
    //选择项发生变化
    handleSelectionChange(val) {
      this.selection = val;
    },

    fetchData() {
      this.tlm_isLoading = true;
      this.form = { ...this.form, ...this.pageParams };
      console.log("this.form======", this.form);
      getManageList(this.form)
        .then(res => {
          this.tlm_isLoading = false;
          if (res.code === 1) {
            this.tableData = res.data;
            this.pageParams = {
              pageNo: res.pageNo,
              pageSize: res.pageSize,
              total: res.total
            };
            this.dataTotal = res.total;
            console.log("this.tableData======", this.tableData);
          } else {
            this.$message("获取数据失败");
            return;
          }
        })
        .catch(err => {
          this.$message.error(err);
          this.tlm_isLoading = false;
        });
    },
    remoteMethod() {},
    handleChange(item, node, index) {
      this.currentText = item.name;
      this.currentCode = item.code;
      this.form.sensitiveVal = this.currentCode;

      this.pageParams = {
        pageNo: 1,
        pageSize: 100,
        total: 0
      };
      this.tableData = [];

      this.fetchData();
      console.log("item========", item);
      console.log("node========", node);
      console.log("index========", index);
    },
    //查询
    handleQuery() {
      this.pageParams = {
        pageNo: 1,
        pageSize: 100,
        total: 0
      };
      this.tableData = [];

      this.fetchData();
    },
    filterNode(value, data) {
      // if (!value) return true;
      // return data.label.indexOf(value) !== -1;
    },
    selectRow(row) {
      this.$refs.sectionTempTable.toggleRowSelection(row);
    },
    //回调编辑后，定位新增行
    setSelectRow(data) {
      this.tableData.forEach((item, index) => {
        if (item.sensitiveWordId == data.sensitiveWordId) {
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
    //信息编辑回调
    handleSave(template) {
      this.handleReset();
      this.pageParams = {
        pageNo: 1,
        pageSize: 100,
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
      this.handleReset();
      this.handleQuery();
    },
    //新建按钮
    create() {
      if (this.currentType != "2") {
        if (this.currentText == "无") {
          this.$message("请您先选中敏感词对应的属性");
          return;
        }
      }

      this.sTemplate = {
        ageParam1: "0",
        ageParam2: "0",
        ageUnit: "3",
        customCode: "",
        description: "",
        enabled: "0",
        prompt: "",
        sensitiveType: this.currentType,
        sensitiveTypeEx: this.currentType === "2" ? "1" : this.currentCode,
        sensitiveTypeEx2: this.currentType === "3" ? this.currentText : "",
        sensitiveWord: "",
        sensitiveWordCode: "",
        dataVersion: "0",
        pinyinCode: "",
        wubiCode: "",
        sortNo: this.getSequence()
      };
      setTimeout(() => {
        this.dialogVisible = true;
      }, 200);
    },
    getSequence() {
      // console.log("getSequence===",this.tableData);
      let returnNumber = 1;
      for (let item of this.tableData) {
        if (item.number !== "" && item.number > returnNumber) {
          returnNumber = item.number + 1;
        }
      }
      return returnNumber;
    },

    //编辑
    edit() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      if (this.selection.length > 1) {
        this.$message("只能选择一条数据");
        return;
      }
      getDetail(this.selection[0].sensitiveWordId).then(res => {
        if (res.code === 1) {
          this.sTemplate = {
            ...res.data,
            sensitiveTypeEx2: this.currentType === "3" ? this.currentText : ""
          };
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
    handleRemove() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      let delList = [];
      for (let index of this.selection) {
        arr.push(index.sensitiveWordId);

        delList.push(index.enabled);
      }

      if (delList.includes("1") || delList.includes("2")) {
        this.$message.warning("所选记录含有启用/停用状态,不可删除");
        return;
      }

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
    enable() {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.enabled;
        if (status == "1") {
          this.$message.error(index.sensitiveWord + "已启用，不能再次启用!");
          return;
        }
        index.enabled = "1";
        arr.push(index);
      }
      multiUpdate(arr).then(res => {
        // console.log("multiUpdate=====",arr)
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
    disable() {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.enabled;
        if (status === "2") {
          this.$message.error(index.sensitiveWord + "已停用，不能再次停用!");
          return;
        }

        if (status === "0") {
          this.$message.error(
            index.sensitiveWord + "不可停用，请先启用后再停用!"
          );
          return;
        }

        index.enabled = "2";
        arr.push(index);
      }
      // console.log("multiUpdate=====",arr)
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

  /deep/ .el-tabs__content {
    height: calc(100% - 55px);
  }

  .tablist {
    height: calc(100% - 10px);
    position: relative;
    padding: 10px 20px;
    border-top: 1px solid #e4e4e4;

    .table-contain {
      margin-top: 10px;
      height: calc(100% - 40px);
    }
  }

  .el-tabs {
    height: 100%;
  }

  .el-tree-node {
    white-space: normal;
    min-width: 100%;
    display: inline-block;
  }

  .el-tree-node__content {
    white-space: nowrap;
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
  }

  .margin-10 {
    padding-top: 10px;
    padding-left: 10px;
  }

  .tree_box {
    padding: 20px 0 30px 0px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
