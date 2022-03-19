<template>
  <div class="QueryList">
    <header class="QueryList_header" ref="header">
      <p-title-search @query-method="queryMethod" @reset-method="resetMethod" @show="expandCollapse" :boxshow="boxshow"></p-title-search>
      <div class="query_conditions">
        <el-row :gutter="20" type="flex">
          <el-col :span="4" class="width30">
            <l-formt-title label="原责任医生" class="center">
              <el-select v-model="reqParams.oldResponsibleDrId" placeholder="请选择" clearable filterable>
                <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="4" class="width30">
            <l-formt-title label="操作人" class="center">
              <el-select v-model="reqParams.optUserId" placeholder="请选择" clearable filterable>
                <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="4" class="width30">
            <l-formt-title label="新责任医生" class="center">
              <el-select v-model="reqParams.newResponsibleDrId" placeholder="请选择" clearable filterable>
                <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="4" class="width30">
            <l-formt-title label="操作类型" class="center">
              <el-select v-model="reqParams.changeType" placeholder="请选择" clearable filterable>
                <el-option label="责任医生变更" value="01"></el-option>
                <el-option label="责任医生设置" value="02"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="4" class="width30">
            <l-formt-title label="机构" class="center">
              <el-select v-model="reqParams.optOrgId" placeholder="请选择" clearable filterable>
                <el-option v-for="item in orgOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
        </el-row>
      </div>
    </header>
    <main class="QueryList_main" :style="{'max-height':mainHeight + 'px','min-height':mainHeight + 'px'}">
      <div slot="header" class="clearfix headerSearch">
        <div style="float: left; padding:5px" class="searchTitle">查询列表</div>
        <el-button class="migrationVisible" type="primary" @click="migrationVisible = true">责任医生变更</el-button>
        <el-button style="float: right; padding:5px" type="primary" @click="docVisible = true">批量设置责任医生</el-button>
      </div>
      <div>
        <el-table :data="tableData" border :height="mainHeight - 153" style="width: 100%;min-height: 400px;">
          <el-table-column prop="optDate" label="变更时间"></el-table-column>
          <el-table-column prop="optUserName" label="操作人"></el-table-column>
          <el-table-column prop="optOrgName" label="操作机构"></el-table-column>
          <el-table-column prop="oldResponsibleDrName" label="原责任医生"></el-table-column>
          <el-table-column prop="newResponsibleDrName" label="现责任医生"></el-table-column>
          <el-table-column prop="changeTypeDesc" label="变更类型"></el-table-column>
        </el-table>
      </div>
      <el-pagination class="QueryList_main_page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="reqParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="reqParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      <div class="migration">
        <el-dialog title="责任医生变更" :visible.sync="migrationVisible" @close="clearValue" width="750px">
          <el-row class="gutterMargin" :gutter="20">
            <el-col :span="12">
              <l-formt-title label="原责任医生" class="center">
                <el-select v-model="saveParams.oldResponsibleDrId" placeholder="请选择" clearable filterable>
                  <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col :span="12">
              <l-formt-title label="现责任医生" class="center">
                <el-select v-model="saveParams.newResponsibleDrId" placeholder="请选择" clearable filterable>
                  <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row class="gutterMargin" :gutter="20">
            <el-col :span="24">
              <l-formt-title label="操作说明">
                <el-input placeholder="请输入" v-model="saveParams.remark" clearable></el-input>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <p-lable-input class="mt-15" width="100" name="变更人" :val="userName" />
            </el-col>
            <el-col :span="12">
              <p-lable-input class="mt-15" width="100" name="变更时间" :val="newDate" />
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <p-lable-input class="mt-15" width="100" name="变更机构" :val="baseMes.hosName" />
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="migrationVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSave" size="medium">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="批量设置责任医生" :visible.sync="docVisible" @close="clearValue" @open="theRefresh" width="940px">
          <div>
            <el-row :gutter="20">
              <el-col :span="20">
                <l-formt-title label="机构" class="center">
                  <el-select v-model="hosId" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in orgOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" size="medium" @click="queryGridMaintenance">查询</el-button>
              </el-col>
            </el-row>
            <el-table :data="gridTableData" border @selection-change="handleSelectionChange" style="width: 100%">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="网格"></el-table-column>
              <el-table-column prop="responsibleDoctorName" label="原责任医生"></el-table-column>
              <el-table-column prop="newResponsibleDrId" label="现责任医生">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.newResponsibleDrId" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="docVisible = false" size="medium">取 消</el-button>
            <el-button type="primary" @click="onSaveResponsibleDoctor" size="medium">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </main>
  </div>
</template>

<script>
  import { adaptiveHeight, saveHeaderHeight } from "@/utils/common";
  import { onGet, onPost } from "@/api/public/public";
  import { getPamars } from "@/utils/auth";
  import { getCurrentTime_, getBasicDetail } from "@/utils/common";
  export default {
    name: "QueryList",
    components: {},
    data() {
      return {
        newDate: getCurrentTime_(),
        baseMes: JSON.parse(getPamars()),
        userName: getBasicDetail().userName,
        //--- Options ---
        orgOptions: [],
        drOptions: [],
        userOptions: [],
        migrationVisible: false,
        docVisible: false,
        boxshow: false,
        hosId: "",
        total: 0,
        reqParams: {
          pageNo: 1,
          pageSize: 20,
          oldResponsibleDrId: "",
          optUserId: "",
          newResponsibleDrId: "",
          changeType: "",
          optOrgId: ""
        },
        saveParams: {
          oldResponsibleDrId: "",
          newResponsibleDrId: "",
          remark: ""
        },
        // 表格数据
        tableData: [],
        gridTableData: [],
        multipleSelection: []
      };
    },
    computed: {
      mainHeight() {
        return adaptiveHeight();
      }
    },
    created() {
      saveHeaderHeight(143);
      this.queryOrg();
      this.queryMethod();
      this.onQueryUsersByHosId();

    },
    mounted() {
      // saveHeaderHeight(this.$refs.header.offsetHeight);
    },
    methods: {
      // 弹窗打开fun
      theRefresh(){
          this.queryGridMaintenance();
      },
      clearValue() {
        this.saveParams.newResponsibleDrId = "";
        this.saveParams.oldResponsibleDrId = "";
        this.saveParams.remark = "";
        this.multipleSelection = [];
        this.hosId = "";
        this.gridTableData = [];
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      onSave() {
        if (this.saveParams.newResponsibleDrId == "") {
          this.$message.warning("请选择现责任医生");
          return;
        }
        if (
          this.saveParams.oldResponsibleDrId == this.saveParams.newResponsibleDrId
        ) {
          this.$message.warning("现责任医生不能与原责任医生相同");
          return;
        }
        onPost({
            url: "/phss/responsibleDrChange/onSaveResponsibleDrChange",
            data: this.saveParams
          })
          .then(res => {
            if (res.code === 1) {
              this.$message.success(res.msg);
              this.migrationVisible = false;
              this.docVisible = false
              this.queryMethod();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      onSaveResponsibleDoctor() {
        if (this.multipleSelection.length <= 0) {
          this.$message("请勾选要设置的数据");
          return;
        }
        for(let i = 0;i < this.multipleSelection.length;i++){
              if(!this.multipleSelection[i].newResponsibleDrId){
                this.$message.error("请选择" + this.multipleSelection[i].name + "现责任医生");
                return;
              }
        }

        onPost({
            url: "/phss/sysGridMaintenance/onSaveResponsibleDoctor",
            data: { data: this.multipleSelection }
          })
          .then(res => {
            if (res.code === 1) {
              this.$message.success("设置成功");
              this.queryGridMaintenance();
              this.queryMethod();
              this.docVisible = false
            } else {
              this.$message.error("设置失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      },

      expandCollapse() {
        this.boxshow = !this.boxshow;
        // this.boxshow ? saveHeaderHeight(143) : saveHeaderHeight(143);
        saveHeaderHeight(143)
      },

      onOrgChange(flg) {
        this.onQueryUsersByHosId(this.saveParams.moveInRecode, "dr");
        this.getRegionAndGridByHospitalId(null);
      },
      onQueryUsersByHosId() {
        onPost({
            url: "/phss/sysPublic/onQueryUsersByHosId",
            data: { hosId: null }
          })
          .then(res => {
            if (res.code === 1) {
              this.userOptions = res.data;
            } else {
              this.userOptions = [];
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      queryOrg() {
        onGet({
            url: "/admin/org/hos-tree",
            data: null
          })
          .then(res => {
            if (res.code === 1) {
              this.orgOptions = res.data;
            } else {
              this.orgOptions = [];
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      queryMethod() {
        onPost({
            url: "/phss/responsibleDrChange/onQueryResponsibleDrChange",
            data: this.reqParams
          })
          .then(res => {
            if (res.code === 1) {
              this.tableData = res.data.data;
              this.total = res.data.total;
            } else {
              this.tableData = [];
              this.total = 0;
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      queryGridMaintenance() {
        onPost({
            url: "/phss/sysGridMaintenance/onQuerySysGridMaintenance",
            data: { hosId: this.hosId }
          })
          .then(res => {
            if (res.code === 1) {
              this.gridTableData = res.data;
            } else {
              this.gridTableData = [];
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      resetMethod() {
        this.reqParams = {
          pageNo: 1,
          pageSize: 10,
          oldResponsibleDrId: "",
          optUserId: "",
          newResponsibleDrId: "",
          changeType: "",
          optOrgId: ""
        }
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
    .QueryList_header .query_conditions .l-input-wrap{
        width: auto;
    }
    .migration {
      /deep/.el-dialog {
        width: 100%;
        // width: 1440px;
        position: relative;
        margin: 0 auto 0px;
        background: #fff;
        box-sizing: border-box;
        // height: 60vh;

        /deep/.el-dialog__body {
          border-bottom: 1px solid #dcdfe6;
          // height: calc(100% - 120px);
          overflow: scroll;
          padding: 30px 30px;
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

    .el-table th,
    .el-table td {
      text-align: center;
    }

    .el-table .cell {
      text-align: center;
    }

    .QueryList_main /deep/.has-gutter .cell {
    }

    .docdialog {
      /deep/.el-dialog {
        width: 100%;
        // width: 1440px;
        position: relative;
        margin: 0 auto 0px;
        background: #fff;
        box-sizing: border-box;
        // height: 80vh;

        /deep/.el-dialog__body {
          border-bottom: 1px solid #dcdfe6;
          // height: calc(100% - 120px);
          height: 100%;
          overflow: scroll;
          padding: 30px 30px;
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

    .migrationVisible {
      float: right;
      padding: 7px 15px;
      margin-left: 20px;
    }

    .headerSearch {
      height: 50px;
      padding: 15px 0;
      overflow: hidden;
      margin-bottom: 20px;
    }

    .searchTitle {
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #32353b;
    }

    .gutterMargin {
      margin-bottom: 20px;
    }
  }
</style>
