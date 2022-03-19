<template>
  <div class="hd-container height100" ref="page">
    <l-layout
      :toolBoxShow="false"
      :isLeftExpand="false"
      :patientListShow="false"
    >
      <template #content>
        <el-card class="width100 height100" id="diseaseMain">
          <div style="margin: 10px">
            <div class="search-con clearfix">
              <div class="search-main float-left">
                <div class="common-width margin-top-10">
                  <l-formt-title label="病种编码">
                    <el-input
                      style="width: 160px"
                      class="my-input"
                      v-model="form.diseasesCode"
                    ></el-input>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="病种名称">
                    <el-input
                      style="width: 160px"
                      class="my-input"
                      v-model="form.diseasesName"
                    ></el-input>
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
          <div class="tablist">
            <div style="margin: 10px" class="operate clearfix">
              <div class="float-right">
                <el-button icon="el-icon-plus" @click="create">新建</el-button>
                <el-button icon="el-icon-remove-outline" @click="edit"
                  >修改</el-button
                >
                <el-button icon="el-icon-remove-outline" @click="handleRemove"
                  >删除</el-button
                >
                <el-button icon="el-icon-remove-outline" @click="enable"
                  >启用</el-button
                >
                <el-button icon="el-icon-remove-outline" @click="disable"
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
                  stripe
                  :data="listData"
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
                    prop="diseasesCode"
                    label="病种编码"
                    width="80"
                  ></el-table-column>
                  <el-table-column
                    prop="diseasesName"
                    label="病种名称"
                    width="200"
                  ></el-table-column>
                  <el-table-column label="关联ICD">
                    <template slot-scope="scope">
                      <span>{{ parseICDDic(scope.row.icdDic) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="enabled" label="启用标识" width="80">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.enabled"
                        code="ModelStatus"
                        v-codeTransformEmr
                      ></span> </template
                  ></el-table-column>
                  <el-table-column prop="description" label="描述" width="200">
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
        </el-card>
      </template>
    </l-layout>
  </div>
</template>
<script>
import FlowMenu from "@/components/FlowMenu";
import EditSection from "./components/editSection";
import {
  getManageList,
  getDetail,
  multiUpdate,
  removeBatch
} from "@/api/emrRecord/emr/disease";
import { mapGetters } from "vuex";
import { getUId, getUN } from "@/utils/crypto";

export default {
  name: "specialSymbolManagement",
  components: {
    EditSection
  },
  data() {
    return {
      tableHeight: 300,
      tlm_isLoading: false,
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0,
        pageSize: 20 // 每页数据条数
      },
      //接口参数
      form: {
        diseasesCode: "", //符号编码
        diseasesName: "" //符号名称
      },
      dialogVisible: false,
      selection: [],
      sTemplate: {},
      listData: []
    };
  },
  mounted() {
    setTimeout(() => {
      this.changeTableHeight();
    });
    this.handleQuery();
  },
  methods: {
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.fetchData();
    },
    changeTableHeight() {
      this.tableHeight =
        document.getElementById("diseaseMain").offsetHeight - 200;
      console.log("tableHeight", this.tableHeight);
    },

    parseICDDic(dic) {
      let str = "";
      // for (let key in dic) {
      //   str += `${dic[key].DICTIONARY_NAME}(${key})、`;
      // }

      dic.forEach(item => {
        str += `${item.DICTIONARY_NAME}(${item.ICD10_ENCODING})、`;
      });
      return str;
    },
    //查询
    handleQuery() {
      //医院信息和登录人信息
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: 0
      };
      this.listData = [];
      this.fetchData();
    },
    //调接口
    fetchData() {
      this.tlm_isLoading = true;
      getManageList({ ...this.form, ...this.pageParams })
        .then(res => {
          this.tlm_isLoading = false;

          if (res.code === 1) {
            this.listData = res.data;
            this.dataTotal = res.total;
            this.pageParams = {
              pageNo: res.pageNo,
              pageSize: res.pageSize,
              total: res.total
            };
          } else {
            this.$message("获取数据失败");
            return;
          }
        })
        .catch(error => {
          this.$message.error(error);
          this.tlm_isLoading = false;
        });
    },
    handleReset() {
      this.form.diseasesCode = ""; //符号编码
      this.form.diseasesName = ""; //符号名称
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
        diseasesCode: "",
        diseasesId: "",
        diseasesName: "",
        icdList: "",
        pinyinCode: "",
        sortNo: this.getSequence(),
        wubiCode: "",
        icdDic: []
      };
      setTimeout(() => {
        this.dialogVisible = true;
      }, 200);
    },
    getSequence() {
      let returnNumber = 1;
      for (let item of this.listData) {
        if (item.number !== "" && item.number > returnNumber) {
          returnNumber = item.number + 1;
        }
      }
      return returnNumber;
    },
    //编辑
    edit() {
      if (this.$refs.tempTable.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }

      if (this.$refs.tempTable.selection.length > 1) {
        this.$message("只能选择一条数据");
        return;
      }
      getDetail(this.selection[0].diseasesId).then(res => {
        if (res.code === 1) {
          this.sTemplate = res.data;
          this.dialogVisible = true;
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
        arr.push(index.diseasesId);
        delList.push(index.enabled);
      }
      if (delList.includes("1") || delList.includes("2")) {
        this.$message.warning("所选记录含有启用/停用状态,不可删除");
        return;
      }
      this.handleDelete(arr);
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
          this.$message.error(
            index.diseasesName +
              "(" +
              index.diseasesCode +
              ")已启用，不能再次启用!"
          );
          return;
        } else if (status != "0") {
          this.$message.error(
            index.diseasesName +
              "(" +
              index.diseasesCode +
              ")状态不正确不能启用!"
          );
          return;
        }
        index.enabled = "1";
        arr.push(index);
      }
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
    disable(启用标识) {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.enabled;
        if (status == "2") {
          this.$message.error(
            index.diseasesName +
              "(" +
              index.diseasesCode +
              ")已停用，不能再次停用!"
          );
          return;
        } else if (status != "1") {
          this.$message.error(
            index.diseasesName +
              "(" +
              index.diseasesCode +
              ")状态不正确，不能停用!"
          );
          return;
        }
        index.enabled = "2";
        arr.push(index);
      }
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
            message: "删除成功!共删除" + delArr.length + "条数据",
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
      this.handleReset();
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: 0
      };
      this.listData = [];
      this.fetchData();
      //this.setSelectRow(template);
      setTimeout(() => {
        this.dialogVisible = false;
      }, 200);
    },
    handleUpdate(template) {
      this.handleReset();
      this.handleQuery();
    },

    //回调编辑后，定位新增行
    setSelectRow(data) {
      this.listData.forEach((item, index) => {
        if (item.diseasesId == data.diseasesId) {
          this.$refs.tempTable.clearSelection();
          this.$refs.tempTable.toggleRowSelection(this.listData[index], true);
        }
      });
    }
  },
  computed: {
    ...mapGetters(["role"])
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
    height: calc(100% - 60px);
    position: relative;
    padding: 10px 20px;
    border-top: 1px solid #e4e4e4;

    .table-contain {
      margin-top: 10px;
      height: calc(100% - 40px);
    }
  }

  .search-con {
    width: 100%;

    .search-main {
      width: calc(100% - 160px);
      margin-left: 10px;
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

  .el-tabs {
    height: 100%;
  }

  .left {
    height: 100%;
    width: 246px;
    float: left;
    background-color: #ffffff;
  }

  .right {
    height: 100%;
    margin-left: 254px;
    background-color: #ffffff;
    position: relative;
  }
}
</style>
