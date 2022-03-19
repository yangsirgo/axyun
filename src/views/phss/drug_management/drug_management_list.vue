<template>
  <div class="QueryList">
    <header class="QueryList_header" ref="header">
      <p-title-search @query-method="queryMethod" @reset-method="resetMethod" @show="expandCollapse" :boxshow="boxshow"></p-title-search>
      <div class="query_conditions">
        <el-row type="flex">
          <el-col :span="5">
            <l-formt-title label="药品编码" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.drugCode" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="5">
            <l-formt-title label="药品名称" class="center" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.drugName" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="5">
            <l-formt-title label="创建人" class="center" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.createdByName" clearable></el-input>
            </l-formt-title>
          </el-col>

        </el-row>

      </div>
    </header>
    <main class="QueryList_main" :style="{'max-height':mainHeight + 'px','min-height':mainHeight + 'px'}">
      <p-title-list @new-method="newMethod()" @refresh-method="refreshMethod"></p-title-list>
      <div>
        <el-table :data="tableData" @row-dblclick="rowDblclick" border style="width: 100%;min-height: 400px;max-height: 450px;">
          <el-table-column align="center" prop="createdByName" label="创建人" >
          </el-table-column>
          <el-table-column align="center" prop="drugCode" label="药品编码">
          </el-table-column>
          <el-table-column align="center" prop="drugJianxie" label="药品简码">
          </el-table-column>
          <el-table-column align="center" prop="drugName" label="药品名称" >
          </el-table-column>
          <el-table-column align="center" prop="createdAt" label="创建时间" >
          </el-table-column>
          <el-table-column align="center" prop="drugTypeName" label="药品类型名称">
          </el-table-column>
          <el-table-column align="center" prop="publicTypeName" label="公卫类型名称">
          </el-table-column>
          <el-table-column prop="date" width="280">
            <template slot="header">
              <div class="table_header">操作</div>
            </template>
            <template slot-scope="scope">
              <el-button type="success" @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="success" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination class="QueryList_main_page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="reqParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="reqParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </main>


    <div class="FMListdialog" v-if="dialogFormVisible">
      <el-dialog title="新增药品" :visible.sync="dialogFormVisible" :close-on-click-modal="false" top="5vh" @close="closeDiag">
        <addDrugPage ref="addDrugPage" :data="dataNew" @saveMethod="saveMethod1" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDiag">取 消</el-button>
          <el-button type="primary" @click="saveMethod" v-if="dataNew.status != 'view'">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { adaptiveHeight, saveHeaderHeight } from "@/utils/common";
  import { getDrugData, delSysDrugManager, saveSysDrugManager, getBaseDrugData } from "@/api/phss/drug_management/drug_management";
  import addDrugPage from "./add_drug_management_list";
  import modifyDrugPage from "./modify_drug_management_list";
  export default {
    name: "drugManagementist",
    components: {
      addDrugPage,
      modifyDrugPage
    },
    data() {
      return {
        boxshow: false,
        input: "",
        total: 0,
        dialogFormVisible: false,
        dataNew: {
          status: '',
          rowData: {}
        },
        reqParams: {
          pageNo: 1,
          pageSize: 20,
          drugCode: "",
          drugName: '',
          createdByName: ''
        },
        // 表格数据
        tableData: []
      };
    },
    computed: {
      mainHeight() {
        console.log("adaptiveHeight()", adaptiveHeight());
        return adaptiveHeight();
      }
    },
    created() {
      saveHeaderHeight(143);

    },
    mounted() {
      this.tableData = [];
      this.list(this.reqParams);
    },
    methods: {
      list(data) {
        getDrugData(data)
          .then(res => {
            console.info("药品列表", JSON.stringify(res))
            console.info("药品列表res", res)
            this.tableData = res.data;
            this.total = res.total;
            this.reqParams.pageNo = res.pageNo;
            this.reqParams.pageSize = res.pageSize;

          }).catch(error => {
            console.log(error);
          });
      },

      expandCollapse() {
        this.boxshow = !this.boxshow;
        // this.boxshow ? saveHeaderHeight(143) : saveHeaderHeight(143);
        saveHeaderHeight(143)
      },
      queryMethod() {
        console.log("查询queryMethod");
        this.list(this.reqParams);
      },
      resetMethod() {
        this.reqParams = {
          pageNo: 1,
          pageSize: 10,
          drugCode: "",
          drugName: '',
          createdByName: ''
        }
      },
      newMethod() {
        this.dataNew = {
            status: '',
            rowData: {}
          };
          this.dataNew.status = "add";
        this.dialogFormVisible = true;
      },
      closeDiag() {
        this.dialogFormVisible = false;
      },
      saveMethod1(SysDrugManagerVO) {
        if (SysDrugManagerVO.drugCode.length == 0) {
          this.$message.warning("药品编码不能为空");
          return false;
        }
        if (SysDrugManagerVO.drugName.length == 0) {
          this.$message.warning("药品名称不能为空");
          return false;
        }
        saveSysDrugManager(SysDrugManagerVO).then(res => {
          if (res.code == "1") {
            this.$message.success("保存成功");
            this.dialogFormVisible = false;
          }
          if (res.code == "0") {
            this.$message.error(res.msg);
          }
          this.list(this.reqParams);

        }).catch(error => {
          console.log(error);
          this.list(this.reqParams);
          this.$message.error(res.msg);
        })
      },
      saveMethod() {
        this.$refs.addDrugPage.save();
        // this.dialogFormVisible = false;
      },
      refreshMethod() {
        console.log("刷新refreshMethod");
        this.list(this.reqParams);
      },
      // --- 操作 ---
      handleView(index, row) {
        this.dataNew = {
            status: '',
            rowData: {}
          };
          this.dataNew.status = "view";
        this.dataNew.rowData = row
        this.dialogFormVisible = true;
      },
      handleEdit(index, row) {
        this.dataNew = {
            status: '',
            rowData: {}
          };
          this.dataNew.status = "modify";
        this.dataNew.rowData = row
        this.dialogFormVisible = true;
      },

      // 当某一行被双击时会触发该事件
      rowDblclick(row) {
        console.log("双击---", row);
      },
      handleReview(index, row) {
        console.log("复核---", index, row);
      },
      handleArchive(index, row) {
        console.log("封存---", index, row);
      },
      handleDelete(index, row) {
        console.log("删除---", index, row);
        this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            delSysDrugManager(row)
              .then(res => {
                this.list(this.reqParams);

              }).catch(error => {
                console.log(error);
              });
          })
          .catch(() => {
            this.$message({
              type: "success",
              message: "已取消删除"
            });
          });
      },
      // --- 操作 ---
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.reqParams.pageSize = val;
        this.queryMethod();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.reqParams.pageNo = val;
        this.queryMethod();
      }
    },
    watch: {}
  };
</script>

<style lang="scss" scoped>
  .QueryList {
    .FMListdialog {
      /deep/.el-dialog {
        width: 70%;

        position: relative;
        margin: 0 auto 0px;
        background: #fff;
        box-sizing: border-box;


        /deep/.el-dialog__body {
          border-bottom: 1px solid #dcdfe6;
          height: calc(100% - 120px);
          overflow: scroll;
          padding: 15px;
        }

        /deep/.el-dialog__footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          // padding: 20px;
          text-align: right;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
        }
      }
    }

    .disBanddialog {
      /deep/.el-dialog {
        width: 100%;
        position: relative;
        margin: 0 auto 0px;
        background: #fff;
        box-sizing: border-box;


        /deep/.el-dialog__body {
          border-bottom: 1px solid #dcdfe6;
          height: calc(100% - 120px);
          overflow: scroll;
          padding: 15px;
        }

        /deep/.el-dialog__footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          // padding: 20px;
          text-align: right;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
        }
      }
    }
    .QueryList .QueryList_main .table_header{
      text-align: center;
    }
  }
</style>
