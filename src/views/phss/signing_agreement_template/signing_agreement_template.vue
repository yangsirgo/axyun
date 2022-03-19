<template>
  <div class="QueryList">
    <header class="QueryList_header" ref="header">
      <p-title-search @query-method="queryMethod" @reset-method="resetMethod" @show="expandCollapse" :boxshow="boxshow"></p-title-search>
    </header>
    <main class="QueryList_main" :style="{'max-height':mainHeight + 'px','min-height':mainHeight + 'px'}">
      <p-title-list @new-method="newMethod()" @refresh-method="refreshMethod"></p-title-list>
      <div class="FMList_table">
        <el-table :data="templateTableData" :height="mainHeight - 153" style="width: 100%;min-height: 400px;">
          <el-table-column prop="template_name" label="模板名称" width></el-table-column>
          <el-table-column prop="created_at" label="创建时间" width></el-table-column>
          <el-table-column prop="statue" label="状态" width>
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{(scope.row.statue=='0'?"启用":"停用")}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="操作" width="320">
            <template slot-scope="scope">
              <el-button type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="success" @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button type="success" @click="handleDelete(scope.$index, scope.row)">{{(scope.row.statue=='0'?"停用":"启用")}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination class="QueryList_main_page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="reqParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="reqParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="reqParams.total"></el-pagination>
    </main>

    <div class="FMListdialog" v-if="this.dialogFormVisible">
      <el-dialog title="模板管理" :visible.sync="dialogFormVisible" :close-on-click-modal="false" top="5vh" @close="closeDiag">
        <el-row>
          <el-col>
            <l-formt-title label="模板名称" class="center">
              <el-input placeholder="请输入" v-model="saveParams.templateName"></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <el-input type="textarea" :rows="30" placeholder="请输入内容" v-model="saveParams.content">
            </el-input>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDiag">取 消</el-button>
          <el-button type="primary" @click="saveMethod">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="FMListdialog" v-if="this.viewFormVisible">
      <el-dialog title="模板管理" :visible.sync="viewFormVisible" :close-on-click-modal="false" top="5vh" @close="viewFormVisible = false">
        <el-row>
          <el-col>
            <l-formt-title label="模板名称" class="center">
              <el-input placeholder="请输入" v-model="viewParams.templateName"></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <div v-html="viewParams.content"></div>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="viewFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { adaptiveHeight, saveHeaderHeight } from "@/utils/common";
  import { onGet, onPost } from "@/api/public/public";

  export default {
    name: "FamilyMaintenanceList",
    data() {
      return {
        dialogFormVisible: false,
        viewFormVisible: false,
        boxshow: false,
        reqParams: {
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        saveParams: {
          id: "",
          templateName: "",
          content: ""
        },
        viewParams: {
          templateName: "",
          content: ""
        },
        // 表格数据
        templateTableData: []
      };
    },
    computed: {
      mainHeight() {
        // console.log("adaptiveHeight()", adaptiveHeight());
        return adaptiveHeight();
      }
    },
    created() {
      saveHeaderHeight(143);
      this.queryMethod();
    },
    mounted() {
      // saveHeaderHeight(this.$refs.header.offsetHeight);
    },
    methods: {
      newMethod() {
        this.saveParams = {
          id: "",
          templateName: "",
          content: ""
        };
        this.dialogFormVisible = true;
      },
      expandCollapse() {
        this.boxshow = !this.boxshow;
        this.boxshow ? saveHeaderHeight(290) : saveHeaderHeight(143);
      },
      queryMethod() {
        // console.log("查询queryMethod");
        onPost({
            url: "/phss/sysSignTemplate/sysSignTemplateAllByPage",
            data: this.reqParams
          })
          .then(res => {
            if (res.code === 1) {
              this.templateTableData = res.data;
              this.reqParams.total = res.total;
            } else {
              this.templateTableData = [];
              this.total = 0;
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      resetMethod() {
        console.log("重置resetMethod");
        this.reqParams = {
          pageNo: 1,
          pageSize: 20,
          total: 0
        };
      },
      //console.log("新建newMetho");
      saveMethod() {
        onPost({
            url: "/phss/sysSignTemplate/saveSysSignTemplate",
            data: this.saveParams
          })
          .then(res => {
            if (res.code === 1) {
              this.$message.success("保存成功");
              this.dialogFormVisible = false;
              this.queryMethod();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      closeDiag() {
        this.queryMethod();
        this.dialogFormVisible = false;
      },
      refreshMethod() {
        console.log("刷新refreshMethod");
      },
      // --- 操作 ---
      handleEdit(index, row) {
        console.log("编辑===============================", row);
        this.saveParams = {
          id: "",
          templateName: "",
          content: ""
        };
        this.saveParams.id = row.id;
        this.saveParams.templateName = row.template_name;
        this.saveParams.content = row.content;
        this.dialogFormVisible = true;
      },
      handleView(index, row) {
        this.viewParams.templateName = row.template_name;
        this.viewParams.content = row.content;
        this.viewFormVisible = true;
      },
      handleDelete(index, row) {
        var mes = "";
        var message = "";
        if (row.statue == '0') {
          mes = "确认要停用此模板？";
          message = "停用成功";
        } else {
          mes = "确认要启用此模板？";
          message = "启用成功";
        }
        this.$confirm(mes, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            onPost({
                url: "/phss/sysSignTemplate/stopOreEnabling",
                data: { id: row.id }
              })
              .then(res => {
                if (res.code === 1) {
                  this.$message({
                    type: "success",
                    message: message
                  });
                  this.queryMethod();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch(error => {
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
        width: 100%;
        width: 1200px;
        position: relative;
        margin: 0 auto 0px;
        background: #fff;
        box-sizing: border-box;
        height: 90vh;

        /deep/.el-dialog__body {
          border-bottom: 1px solid #dcdfe6;
          height: calc(100% - 120px);
          overflow: scroll;
          padding: 30px 60px 0 60px;
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
        width: 1200px;
        position: relative;
        margin: 0 auto 0px;
        background: #fff;
        box-sizing: border-box;
        height: 40vh;

        /deep/.el-dialog__body {
          border-bottom: 1px solid #dcdfe6;
          height: calc(100% - 120px);
          overflow: scroll;
          padding: 30px 60px 0 60px;
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

    .QueryList_main {
      .FMList_table {
        /deep/.has-gutter {
          line-height: 41px;

          /deep/.cell {
            padding-left: 10px;
          }

          /* height: 65px; */
          /* line-height: 65px; */
        }

        /deep/.el-table__expanded-cell {
          // padding: 0 0 0 48px;
          padding: 0;
          background-color: #f5f8fa;
        }

        /deep/.el-table__body {
          background-color: #f5f8fa;
        }
      }
    }
  }
</style>