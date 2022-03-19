<template>
  <div class="QueryList">
    <header class="QueryList_header" ref="header">
      <p-title-search @query-method="queryMethod" @reset-method="resetMethod" @show="expandCollapse" :boxshow="boxshow"></p-title-search>
      <div class="query_conditions">
        <el-row type="flex">
          <el-col :span="6">
            <l-formt-title label="小组名称" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.name" clearable></el-input>
            </l-formt-title>
          </el-col>
        </el-row>
      </div>
    </header>
    <main class="QueryList_main" :style="{'max-height':mainHeight + 'px','min-height':mainHeight + 'px'}">
      <p-title-list @new-method="newMethod()" @refresh-method="refreshMethod"></p-title-list>
      <div class="FMList_table">
        <el-table :data="memberTableData" :height="mainHeight - 153" style="width: 100%;min-height: 400px;">
          <el-table-column prop="leaderName" label="组长姓名" width></el-table-column>
          <el-table-column prop="leaderSex" label="性别" width></el-table-column>
          <el-table-column prop="leaderAge" label="年龄" width></el-table-column>
          <el-table-column prop="leaderIdNo" label="身份证" width></el-table-column>
          <el-table-column prop="name" label="组名" width></el-table-column>
          <el-table-column prop="leaderSpecialty" label="擅长" width></el-table-column>
          <el-table-column prop="date" label="操作" width="320">
            <template slot-scope="scope">
              <el-button type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination class="QueryList_main_page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="reqParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="reqParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </main>

    <div class="FMListdialog" v-if="this.dialogFormVisible">
      <el-dialog title="分组管理" :visible.sync="dialogFormVisible" :close-on-click-modal="false" top="5vh" @close="closeDiag">
        <el-row>
          <el-col>
            <l-formt-title label="小组名称" class="center">
              <el-input placeholder="请输入" v-model="saveParams.name" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="小组简介" class="center">
              <el-input placeholder="请输入" v-model="saveParams.summary" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="小组类型" class="center">
              <el-select v-model="saveParams.groupType" placeholder="请选择" clearable filterable>
                <el-option v-for="item in deptOptions" :key="item.id" :label="item.orgNm" :value="item.id"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="联系电话" class="center">
              <el-input placeholder="请输入" v-model="saveParams.telephone" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="地址" class="center">
              <el-input placeholder="请输入" v-model="saveParams.address" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <main class="QueryList_main">
              <el-button type="success" @click="openUserList">新建</el-button>
              <div class="FMList_table">
                <el-table :data="saveParams.sysSignGroupMemberDTOs" style="width: 100%;" height="400">
                  <el-table-column prop="userName" label="姓名"></el-table-column>
                  <el-table-column prop="sex" label="性别"></el-table-column>
                  <el-table-column prop="age" label="年龄"></el-table-column>
                  <el-table-column prop="idNo" label="身份证"></el-table-column>
                  <el-table-column prop="mobile" label="电话"></el-table-column>
                  <el-table-column prop="groupName" label="组名"></el-table-column>
                  <el-table-column prop="specialty" label="擅长"></el-table-column>
                  <el-table-column prop="isLeader" label="是否为组长"></el-table-column>
                  <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.isLeader == '否'" type="success" size="mini" @click="setLeader(scope.$index, scope.row)">设为组长</el-button>
                      <el-button type="success" size="mini" @click="deleteMember(scope.$index, scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </main>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDiag">取 消</el-button>
          <el-button type="primary" @click="saveMethod">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="人员选择" :visible.sync="userFormVisible" :close-on-click-modal="false" top="5vh">
      <el-row>
        <el-col :span="20">
          <l-formt-title label="人员姓名" class="center">
            <el-input placeholder="请输入" v-model="userParams.name" clearable></el-input>
          </l-formt-title>
        </el-col>
        <el-col :span="4">
          <el-button @click="getUserTableDataMethod">查询</el-button>
        </el-col>
        <el-col>
          <main class="QueryList_main">
            <div class="FMList_table">
              <el-table :data="userTableData" highlight-current-row style="width: 100%;" height="300" @selection-change="handleSelectChange">
                <el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
                <el-table-column prop="userName" label="姓名"></el-table-column>
                <el-table-column prop="sex" label="性别"></el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="idNo" label="身份证"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="groupName" label="组名"></el-table-column>
                <el-table-column prop="specialty" label="擅长"></el-table-column>
                <el-table-column prop="isLeader" label="是否为组长"></el-table-column>
              </el-table>
            </div>
            <el-pagination class="QueryList_main_page" @size-change="userHandleSizeChange" @current-change="userHandleCurrentChange" :current-page="userParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="userParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="userParams.total"></el-pagination>
          </main>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectMethod">确 定</el-button>
      </div>
    </el-dialog>
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
        boxshow: false,
        total: 0,
        reqParams: {
          name: "",
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        saveParams: {
          id: "",
          name: "",
          summary: "",
          groupType: "",
          telephone: "",
          address: "",
          sysSignGroupMemberDTOs: []
        },
        categoryOptions: [], //服务包分类
        typeOptions: [], //服务包类型
        userFormVisible: false,
        userParams: {
          name: "",
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        memberParams: {
          signGroupId: ""
        },
        deptOptions: [],
        // 表格数据
        memberTableData: [],
        userTableData: [],
        groupMemberTableData: [],
        selectUserData: {}
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
      this.getDeptList();
    },
    mounted() {
      // saveHeaderHeight(this.$refs.header.offsetHeight);
    },
    methods: {
      expandCollapse() {
        this.boxshow = !this.boxshow;
        this.boxshow ? saveHeaderHeight(290) : saveHeaderHeight(143);
      },
      selectable(row,index){
           if(row.isLeader == '是'){
              return false;
           }
             return true;
           
        },
      getDeptList() {
        //
        onPost({
            url: "/phss/sysPublic/getDeptList",
            data: { hosId: null }
          })
          .then(res => {
            if (res.code === 1) {
              this.deptOptions = res.data;
            } else {
              this.deptOptions = [];
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      queryMethod() {
        // console.log("查询queryMethod");
        onPost({
            url: "/phss/sysSignGroup/onQuerySysSignGroup",
            data: this.reqParams
          })
          .then(res => {
            if (res.code === 1) {
              this.memberTableData = res.data.data;
              this.reqParams.pageNo = res.data.pageNo;
              this.reqParams.pageSize = res.data.pageSize;
              this.total = res.data.total;
            } else {
              this.memberTableData = [];
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
          pageNo: 1,
          pageSize: 20
        };
      },
      //console.log("新建newMetho");
      newMethod() {
        this.saveParams = {
          id: "",
          name: "",
          summary: "",
          groupType: "",
          telephone: "",
          address: "",
          sysSignGroupMemberDTOs: []
        };
        this.dialogFormVisible = true;
      },
      saveMethod() {
        onPost({
            url: "/phss/sysSignGroup/onSaveSysSignGroup",
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
          name: "",
          summary: "",
          groupType: "",
          telephone: "",
          address: "",
          sysSignGroupMemberDTOs: []
        };
        this.saveParams.id = row.id;
        this.saveParams.name = row.name;
        this.saveParams.summary = row.summary;
        this.saveParams.groupType = Number(row.groupType);
        this.saveParams.telephone = row.telephone;
        this.saveParams.address = row.address;
        this.memberParams.signGroupId = row.id;
        onPost({
            url: "/phss/sysSignGroupMember/onQuerySignGroupMember",
            data: this.memberParams
          })
          .then(res => {
            if (res.code === 1) {
              this.saveParams.sysSignGroupMemberDTOs = res.data;
            }
          })
          .catch(error => {
            console.log(error);
          });
        this.dialogFormVisible = true;
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
                url: "/phss/sysSignGroup/onDeleteSysSignGroup",
                data: { id: row.id }
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
      selectMethod() {
        for (var i = 0; i < this.selectUserData.length; i++) {
          this.saveParams.sysSignGroupMemberDTOs.push(this.selectUserData[i]);
        }
        this.userFormVisible = false;
      },
      getUserTableDataMethod() {
        onPost({
            url: "/phss/sysSignGroupMember/onQueryUser",
            data: this.userParams
          })
          .then(res => {
            if (res.code === 1) {
              this.userTableData = res.data.data;
              this.userParams.pageNo = res.data.pageNo;
              this.userParams.pageSize = res.data.pageSize;
              this.userParams.total = res.data.total;
            } else {
              this.userTableData = [];
              this.userParams.total = 0;
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      openUserList() {
        this.userParams = {
          name: "",
          pageNo: 1,
          pageSize: 20,
          total: 0
        }
        this.userFormVisible = true;
        this.getUserTableDataMethod();
      },
      handleSelectChange(val) {
        this.selectUserData = val;
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
      },
      userHandleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.userParams.pageSize = val;
        this.getUserTableDataMethod();
      },
      userHandleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.userParams.pageNo = val;
        this.getUserTableDataMethod();
      },
      setLeader(index, row) {
        for (var i = 0; i < this.saveParams.sysSignGroupMemberDTOs.length; i++) {
          this.saveParams.sysSignGroupMemberDTOs[i].isLeader = "否";
        }
        row.isLeader = "是";
      },
      deleteMember(index, row) {
        this.saveParams.sysSignGroupMemberDTOs.splice(index, 1);
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
