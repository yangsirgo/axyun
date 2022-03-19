<template>
  <div class="QueryList">
    <header class="QueryList_header" ref="header">
      <p-title-search @query-method="queryMethod" @reset-method="resetMethod" @show="expandCollapse" :boxshow="boxshow"></p-title-search>
      <div class="query_conditions">
        <el-row type="flex">
          <el-col :span="6">
            <l-formt-title label="姓名" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.name" clearable></el-input>
            </l-formt-title>
          </el-col>
        </el-row>
      </div>
    </header>
    <main class="QueryList_main" :style="{'max-height':mainHeight + 'px','min-height':mainHeight + 'px'}">
      <div class="FMList_table">
        <el-table :data="memberTableData" :height="mainHeight - 153" style="width: 100%;min-height: 400px;">
          <el-table-column prop="userName" label="姓名" width></el-table-column>
          <el-table-column prop="age" label="年龄" width></el-table-column>
          <el-table-column prop="sex" label="性别" width></el-table-column>
          <el-table-column prop="idNo" label="身份证" width></el-table-column>
          <el-table-column prop="mobile" label="电话" width></el-table-column>
          <el-table-column prop="isLeader" label="是否组长" width></el-table-column>
          <el-table-column prop="specialty" label="擅长" width></el-table-column>
          <el-table-column prop="date" label="操作" width="320">
            <template slot-scope="scope">
              <el-button type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
               <el-button type="primary" @click="deleteFun(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination class="QueryList_main_page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="reqParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="reqParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="reqParams.total"></el-pagination>
    </main>

    <div class="FMListdialog" v-if="this.dialogFormVisible">
      <el-dialog title="分组管理" :visible.sync="dialogFormVisible" :close-on-click-modal="false" top="5vh" @close="closeDiag">
        <el-row>
          <el-col>
            <l-formt-title label="姓名" class="center">
              <el-input placeholder="请输入" v-model="saveParams.userName" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="电话" class="center">
              <el-input placeholder="请输入" v-model="saveParams.mobile" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="QQ" class="center">
              <el-input placeholder="请输入" v-model="saveParams.qq" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="身份证" class="center">
              <el-input placeholder="请输入" v-model="saveParams.idNo" maxlength="18" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="出生日期" class="center">
              <!-- <el-input placeholder="请输入" v-model="" clearable></el-input> -->
               <el-date-picker
                    v-model="saveParams.birthdayDate"
                    type="date"
                    placeholder="选择日期" clearable>
                  </el-date-picker>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="是否为组长" class="center">
              <el-input placeholder="请输入" v-model="saveParams.isLeader" disabled clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="分组" class="center">
              <el-input placeholder="请输入" v-model="saveParams.groupName" disabled clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="擅长" class="center">
              <el-input placeholder="请输入" v-model="saveParams.specialty" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col>
            <l-formt-title label="简介" class="center">
              <el-input placeholder="请输入" v-model="saveParams.remark" clearable></el-input>
            </l-formt-title>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDiag">取 消</el-button>
          <el-button type="primary" @click="saveMethod">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { adaptiveHeight, saveHeaderHeight } from "@/utils/common";
  import { onGet, onPost } from "@/api/public/public";
  import { deleteSignGroupMember } from "@/api/phss/region/hos_district"

  export default {
    name: "FamilyMaintenanceList",
    data() {
      return {
        dialogFormVisible: false,
        boxshow: false,
        reqParams: {
          name: "",
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        saveParams: {
          id: "",
          userId: "",
          userName: "",
          mobile: "",
          birthdayDate: "",
          idNo: "",
          specialty: "",
          remark: "",
          isLeader: '',
          groupName: '',
          qq: ''
        },
        // 表格数据
        memberTableData: []
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
      expandCollapse() {
        this.boxshow = !this.boxshow;
        this.boxshow ? saveHeaderHeight(290) : saveHeaderHeight(143);
      },
      queryMethod() {
        // console.log("查询queryMethod");
        onPost({
            url: "/phss/sysSignGroupMember/onQuerySignGroupMember",
            data: this.reqParams
          })
          .then(res => {
            if (res.code === 1) {
              this.memberTableData = res.data;
              this.reqParams.pageNo = res.pageNo;
              this.reqParams.pageSize = res.pageSize;
              this.reqParams.total = res.total;
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
          pageSize: 20,
          total: 0
        };
      },
      //console.log("新建newMetho");
      saveMethod() {
        onPost({
            url: "/phss/sysSignGroupMember/onSaveSignGroupMember",
            data: this.saveParams
          })
          .then(res => {
            if (res.code === 1) {
              this.$message.success("保存成功");
              this.queryMethod();
              this.dialogFormVisible = false;
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
          userId: "",
          userName: "",
          mobile: "",
          birthdayDate: "",
          idNo: "",
          specialty: "",
          remark: "",
          isLeader: '',
          groupName: '',
          qq: ''
        };
        this.saveParams.id = row.id;
        this.saveParams.userId = row.userId;
        this.saveParams.userName = row.userName;
        this.saveParams.mobile = row.mobile;
        this.saveParams.birthdayDate = row.birthdayDate;
        this.saveParams.idNo = row.idNo;
        this.saveParams.specialty = row.specialty;
        this.saveParams.remark = row.remark;
        this.saveParams.isLeader = row.isLeader;
        this.saveParams.groupName = row.groupName;
        this.saveParams.qq = row.qq;
        this.dialogFormVisible = true;
      },
      // 删除 /sysSignGroupMember/id
      deleteFun(index, row){

          if(row.isLeader == '是'){
            this.$message.error("组长不可删除")
          }else{
            let arr = {
              id: row.id
            };

             deleteSignGroupMember(arr).then(res => {
               if (res.code == "1") {
                 this.$message.success("保存成功");
                 this.queryMethod();
               }else{
                   this.$message.error(res.msg);
                 }
             }).catch(error => {
               console.log(error);
             })
          }
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
      }
    },
    watch: {}
  };
</script>

<style lang="scss" scoped>
  .QueryList {
    .FMListdialog {
      /deep/.el-dialog {
        width: 600px;
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
