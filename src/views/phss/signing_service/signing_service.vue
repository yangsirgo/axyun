<template>
  <div class="QueryList">
    <header class="QueryList_header" ref="header">
      <p-title-search @query-method="queryMethod" @reset-method="resetMethod" @show="expandCollapse" :boxshow="boxshow"></p-title-search>
      <div class="query_conditions">
        <el-row type="flex">
          <el-col :span="6">
            <l-formt-title label="服务包名称" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.name" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="服务包状态" class="center" style="width: 90%;">
              <el-select v-model="reqParams.status" placeholder="请选择" clearable filterable>
                <el-option label="启用" value="0"></el-option>
                <el-option label="停用" value="1"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="服务包类型" class="center" style="width: 90%;">
              <el-select v-model="reqParams.type" placeholder="请选择" clearable filterable>
                <el-option v-for="item in typeOptions" :key="item.dicId" :label="item.desc" :value="item.dicId"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
        </el-row>
      </div>
    </header>
    <main class="QueryList_main" :style="{'max-height':mainHeight + 'px','min-height':mainHeight + 'px'}">
      <p-title-list @new-method="newMethod()" @refresh-method="refreshMethod"></p-title-list>
      <div class="FMList_table">
        <el-table :data="serviceData" :height="mainHeight - 153" style="width: 100%;min-height: 400px;">
          <el-table-column prop="name" label="服务包名称" width></el-table-column>
          <el-table-column prop="type_desc" label="类型" width></el-table-column>
          <el-table-column prop="remark" label="服务包详细描述" width></el-table-column>
          <el-table-column prop="price" label="价格" width></el-table-column>
          <el-table-column prop="discount" label="折扣" width></el-table-column>
          <el-table-column prop="created_at" label="创建时间" width></el-table-column>
          <el-table-column prop="status_desc" label="状态" width></el-table-column>
          <el-table-column prop="date" label="操作" width="320">
            <template slot-scope="scope">
              <el-button type="success" v-if="scope.row.status == 1" @click="handleChange(scope.$index, scope.row)">启用</el-button>
              <el-button type="success" v-else @click="handleChange(scope.$index, scope.row)">停用</el-button>
              <el-button type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="success" v-show="scope.row.status!='3'" @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination class="QueryList_main_page" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="reqParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="reqParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </main>

    <div class="FMListdialog" v-if="this.dialogFormVisible">
      <el-dialog title="服务包信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false" top="5vh" @close="closeDiag">
        <el-row>
          <el-col>
            <l-formt-title label="服务包名称" class="center">
              <el-input :disabled="view" placeholder="请输入" v-model="saveParams.name" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="所属大类" class="center">
              <el-select :disabled="view" v-model="saveParams.category" placeholder="请选择" clearable filterable>
                <el-option v-for="item in categoryOptions" :key="item.dicId" :label="item.desc" :value="item.dicId"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="服务包类型" class="center">
              <el-select :disabled="view" v-model="saveParams.type" placeholder="请选择" clearable filterable>
                <el-option v-for="item in typeOptions" :key="item.dicId" :label="item.desc" :value="item.dicId"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="价格" class="center">
              <el-input :disabled="view" placeholder="请输入" v-model="saveParams.price" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="24">
            <l-formt-title label="折扣" class="center">
              <el-input :disabled="view" placeholder="请输入" v-model="saveParams.discount" clearable></el-input>
            </l-formt-title>
          </el-col>


          <el-col :span="24">
            <el-row>
              <el-col :span="3" class="sever">服务项目</el-col>
              <el-col :span="21">
                <el-table :data="saveParams.sysSignProjectDTOs" style="width: 100%;" height="200">
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column prop="name" label="服务项目名称"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button v-if="!view" type="danger" icon="el-icon-delete" @click="handleDeleteDetail(scope.$index, scope.row)"
                        circle></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <div style="width: 100%;" class="flexStyle" v-if="!view">
              <el-button class="el-icon-circle-plus" type="success" @click="addServiceProject">新增</el-button>
            </div>
          </el-col>
          <el-col :span="24">
            <l-formt-title label="服务包详细描述" class="center">
              <el-input :disabled="view" placeholder="请输入" v-model="saveParams.remark" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col v-if="!view">
            <l-formt-title label="服务包名称" class="center" style="width: 90%;">
              <el-input :disabled="view" placeholder="请输入" v-model="serviceProjectName" clearable></el-input>
            </l-formt-title>

          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDiag">取 消</el-button>
          <el-button v-if="!view" type="primary" @click="saveMethod">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    adaptiveHeight,
    saveHeaderHeight
  } from "@/utils/common";
  import {
    onGet,
    onPost
  } from "@/api/public/public";

  export default {
    name: "FamilyMaintenanceList",
    data() {
      return {
        // 解散的数据
        rowData: {},
        disBandReason: "",
        data: {
          status: "",
          rowData: {}
        },

        TableForm: {},
        dialogFormVisible: false,
        boxshow: false,
        input: "",
        total: 0,
        serviceProjectName: "",
        reqParams: {
          name: "",
          status: "",
          type: "",
          pageNo: 1,
          pageSize: 10
        },
        saveParams: {
          id: "",
          name: "",
          category: "",
          type: "",
          price: "",
          discount: "",
          remark: "",
          sysSignProjectDTOs: []
        },
        categoryOptions: [], //服务包分类
        typeOptions: [], //服务包类型
        view: false,
        // 表格数据
        serviceData: []
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
      this.getCategoryOptions();
      this.getTypeOptions();
    },
    mounted() {
      saveHeaderHeight(this.$refs.header.offsetHeight);
    },
    methods: {
      expandCollapse() {
        this.boxshow = !this.boxshow;
        this.boxshow ? saveHeaderHeight(290) : saveHeaderHeight(143);
      },
      queryMethod() {
        // console.log("查询queryMethod");
        onPost({
            url: "/phss/sysSignService/onQuerySysSignService",
            data: this.reqParams
          })
          .then(res => {
            if (res.code === 1) {
              this.serviceData = res.data.data;
              this.reqParams.pageNo = res.data.pageNo;
              this.reqParams.pageSize = res.data.pageSize;
              this.total = res.data.total;
            } else {
              this.serviceData = [];
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
          name: "",
          status: "",
          type: "",
          pageNo: 1,
          pageSize: 10
        };
      },
      //console.log("新建newMetho");
      newMethod() {
        this.saveParams = {
          id: "",
          name: "",
          category: "",
          type: "",
          price: "",
          discount: "",
          remark: "",
          sysSignProjectDTOs: []
        };
        this.view = false;
        this.dialogFormVisible = true;
      },
      addServiceProject() {
        var obj = {};
        var gian = false;
        obj.name = this.serviceProjectName;
        if(obj.name){
          for(let i = 0;i < this.saveParams.sysSignProjectDTOs.length;i++){

            if(obj.name == this.saveParams.sysSignProjectDTOs[i].name){
              this.$message.error('服务包名称已存在')
              gian = false;
              break
            }else{
              gian = true;
            }
          }
          if(gian){
             this.saveParams.sysSignProjectDTOs.push(obj);
          }
          this.serviceProjectName = "";
        }else{
          this.$message.error("请输入填写服务包名称")
        }

      },
      saveMethod(data) {
        onPost({
            url: "/phss/sysSignService/onSaveSysSignService",
            data: this.saveParams
          })
          .then(res => {
            // console.log("=====迁入机构======", res);
            if (res.code === 1) {
              this.$message.success("保存成功");
               this.queryMethod();
            } else {
              this.$message.error(res.msg);
            }
            this.dialogFormVisible = false;
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
      handleView(index, row) {
        console.log("查看---", index, row);
        this.view = true;
        this.saveParams = {
          id: "",
          name: "",
          category: "",
          type: "",
          price: "",
          discount: "",
          remark: "",
          sysSignProjectDTOs: []
        };
        onGet({
            url: "/phss/sysSignService/onQuerySysSignServiceDetail",
            data: {
              id: row.id
            }
          })
          .then(res => {
            if (res.code === 1) {
              this.saveParams.id = res.data.sysSignServicePO.id;
              this.saveParams.name = res.data.sysSignServicePO.name;
              this.saveParams.category = res.data.sysSignServicePO.category;
              this.saveParams.type = res.data.sysSignServicePO.type;
              this.saveParams.price = res.data.sysSignServicePO.price;
              this.saveParams.discount = res.data.sysSignServicePO.discount;
              this.saveParams.remark = res.data.sysSignServicePO.remark;
              this.saveParams.sysSignProjectDTOs = res.data.sysSignProjectPOs;
            }
          })
          .catch(error => {
            console.log(error);
          });
        this.dialogFormVisible = true;
      },
      handleChange(index, row) {
        //启用/停用
        var mes = "";
        var message = "";
        if (row.status == "0") {
          mes = "确认要停用此服务包？";
          message = "停用成功";
        } else {
          mes = "确认要启用此服务包？";
          message = "启用成功";
        }
        this.$confirm(mes, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            onPost({
                url: "/phss/sysSignService/onChangeSysSignServiceStatus",
                data: {
                  id: row.id
                }
              })
              .then(res => {
                if (res.code === 1) {
                  this.$message.success(message);
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
              message: "已取消操作"
            });
          });
      },
      handleEdit(index, row) {
        console.log("编辑===============================", row);
        this.view = false;
        this.saveParams = {
          id: "",
          name: "",
          category: "",
          type: "",
          price: "",
          discount: "",
          remark: "",
          sysSignProjectDTOs: []
        };
        onGet({
            url: "/phss/sysSignService/onQuerySysSignServiceDetail",
            data: {
              id: row.id
            }
          })
          .then(res => {
            if (res.code === 1) {
              this.saveParams.id = res.data.sysSignServicePO.id;
              this.saveParams.name = res.data.sysSignServicePO.name;
              this.saveParams.category = res.data.sysSignServicePO.category;
              this.saveParams.type = res.data.sysSignServicePO.type;
              this.saveParams.price = res.data.sysSignServicePO.price;
              this.saveParams.discount = res.data.sysSignServicePO.discount;
              this.saveParams.remark = res.data.sysSignServicePO.remark;
              this.saveParams.sysSignProjectDTOs = res.data.sysSignProjectPOs;
            }
          })
          .catch(error => {
            console.log(error);
          });
        this.dialogFormVisible = true;
      },
      handleIntegrated(index, row) {
        this.dialogdisBandReason = true;
        this.rowData = row;
      },
      handleDelete(index, row) {
        console.log("删除---", index, JSON.stringify(row));
        this.$confirm("此操作将永久删除此条信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            onPost({
                url: "/phss/sysSignService/onDeleteSysSignServiceStatus",
                data: {
                  id: row.id
                }
              })
              .then(res => {
                if (res.code === 1) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
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
      handleDeleteDetail(index, row) {
        this.saveParams.sysSignProjectDTOs.splice(index, 1);
      },
      getCategoryOptions() {
        onPost({
            url: "/phss/sysDictionary/getDictionary",
            data: {
              dic_group: "sign_service_category"
            }
          })
          .then(res => {
            if (res.code === 1) {
              this.categoryOptions = res.data;
            } else {
              this.categoryOptions = [];
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      getTypeOptions() {
        onPost({
            url: "/phss/sysDictionary/getDictionary",
            data: {
              dic_group: "sign_service_type"
            }
          })
          .then(res => {
            if (res.code === 1) {
              this.typeOptions = res.data;
            } else {
              this.typeOptions = [];
            }
          })
          .catch(error => {
            console.log(error);
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
    .flexStyle {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 15px;
      box-sizing: border-box;
    }

    .sever {
      font-size: 14px;
      color: #949DA3;
      line-height: 33px;
      display: inline-block;
      padding: 0 10px;
    }

    .FMListdialog {
      /deep/.el-dialog {
        width: 100%;
        width: 700px;
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
        width: 700px;
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
