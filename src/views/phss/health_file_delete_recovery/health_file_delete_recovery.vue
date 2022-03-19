<template>
  <div class="QueryList health_file_delete_recovery">
    <header class="QueryList_header" ref="header">
      <p-title-search @query-method="queryMethod" @reset-method="resetMethod" @show="expandCollapse" :boxshow="boxshow"></p-title-search>
      <div class="query_conditions">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <l-formt-title label="健康档案编号" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.digDocNo" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="姓名或简码" class="center" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.rsdtName" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="18位身份证号" class="center" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.idNo" clearable></el-input>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <div v-if="boxshow">
            <el-row class="pt-10" type="flex" justify="space-between">
              <el-col :span="6">
                <l-formt-title label="选择性别" class="center" style="width: 90%;">
                  <el-select v-model="reqParams.sex" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in sexs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="选择操作类型" class="center" style="width: 90%;">
                  <el-select v-model="reqParams.homeStatus" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in homeStatuss" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="操作人" class="center" style="width: 90%;">
                  <!-- <el-input placeholder="请输入" v-model="reqParams.optUserName" clearable></el-input> -->
                  <el-select v-model="reqParams.optUserName" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in docDoctorData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
            </el-row>
            <el-row class="pt-10" type="flex" justify="space-between">
              <!--<el-col :span="6">-->
              <!--<l-formt-title label="电话" style="width: 90%;">-->
              <!--<el-input placeholder="请输入" v-model="input" clearable></el-input>-->
              <!--</l-formt-title>-->
              <!--</el-col>-->
              <el-col :span="6">
                <l-formt-title label="选择机构" class="center" style="width: 90%;">
                  <el-select v-model="reqParams.hosId" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in crowdCategoryOptions" :key="item.id" :label="item.orgNm" :value="item.id"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </div>
    </header>
    <main class="QueryList_main" :style="{'max-height':mainHeight + 'px','min-height':mainHeight + 'px'}">
      <p-title-list @delete-method="deleteMethod()" @refresh-method="refreshMethod" @restore-method="restoreMethod()" :healthDR="true"></p-title-list>
      <div>
        <el-table :data="tableData" @row-dblclick="rowDblclick" :height="mainHeight - 153" border style="width: 100%;min-height: 400px;">
          <el-table-column align="center" prop="digDocNo" label="档案编码"></el-table-column>
          <el-table-column align="center" prop="papDocNo" label="纸质档案编码"></el-table-column>
          <!--<el-table-column-->
          <!--align="center"-->
          <!--prop="drugPinyin"-->
          <!--label="药品拼音码"-->
          <!--width="180">-->
          <!--</el-table-column>-->
          <el-table-column align="center" prop="rsdtName" label="姓名"></el-table-column>
          <el-table-column align="center" prop="sex" label="性别">
          </el-table-column>
          <el-table-column align="center" prop="birthday" label="出生日期" ></el-table-column>
          <el-table-column align="center" label="原档案状态" prop="oldDelFlag">
            <template slot-scope="scope">
              <div>{{scope.row.oldDelFlg=='0'?'正常':(scope.row.oldDelFlg=='1'?'删除':'')}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作类型">
            <template slot-scope="scope">
              <div>{{scope.row.status=='restore'?'档案恢复':(scope.row.status=='delete'?'档案删除':'')}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="optUserName" label="操作人姓名"></el-table-column>
          <el-table-column align="center" prop="orgNm" label="操作机构名称"></el-table-column>
          <el-table-column align="center" prop="optDate" label="操作日期"></el-table-column>


          <!-- <el-table-column prop="date" width="380"> -->
           <!-- <template slot="header">
              <div class="table_header">操作</div>
            </template> -->
            <!-- <template slot-scope="scope"> -->
              <!--<el-button type="primary" @click="handleView(scope.$index, scope.row)">查看</el-button>-->
              <!--<el-button type="primary" @click="handleEdit(scope.$index, scope.row)">档案恢复</el-button>-->
              <!--<el-button type="primary" @click="handleDelete(scope.$index, scope.row)">档案删除</el-button>-->

              <!--<el-button type="primary" @click="handleIntegrated(scope.$index, scope.row)">综合管理</el-button>-->
              <!--<el-dropdown class="ml-10">-->
              <!--<span class="el-dropdown-link">-->
              <!--<i class="el-icon-more"></i>-->
              <!--</span>-->
              <!--<el-dropdown-menu slot="dropdown">-->
              <!--<el-dropdown-item-->
              <!--@click.native="handleReview(scope.$index, scope.row)"-->
              <!--icon="el-icon-plus"-->
              <!--&gt;复核</el-dropdown-item>-->
              <!--<el-dropdown-item-->
              <!--@click.native="handleArchive(scope.$index, scope.row)"-->
              <!--icon="el-icon-circle-plus"-->
              <!--&gt;封存</el-dropdown-item>-->
              <!--<el-dropdown-item-->
              <!--@click.native="handleDelete(scope.$index, scope.row)"-->
              <!--icon="el-icon-circle-plus-outline"-->
              <!--&gt;删除</el-dropdown-item>-->
              <!--</el-dropdown-menu>-->
              <!--</el-dropdown>-->
            <!-- </template> -->
          <!-- </el-table-column> -->
        </el-table>
      </div>
      <el-pagination class="QueryList_main_page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="reqParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="reqParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </main>
    <div class="FMListdialog" v-if="dialogFormVisible">
      <el-dialog title="档案删除与恢复" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <restore ref="restore" :data="this.data" />
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
  import {
    docIndexAllByPage,
    docDeleteRestoreList,
    deleteOrRecover,
    baseDocData
  } from "@/api/phss/health_file_delete_recovery/health_file_delete_recovery";
  import restore from "./restore_health_file_delete_recovery";
  import { mapActions, mapGetters } from "vuex";
  export default {
    name: "health_file_delete_recovery",
    components: { restore },
    data() {
      return {
        data: {
          status: "",
          rowData: {}
        },
        dialogFormVisible: false,
        boxshow: false,
        input: "",
        total: 0,
        reqParams: {
          pageNo: 1,
          pageSize: 10,
          drugCode: "",
          drugName: "",
          createdByName: "",
          // 健康档案号
          digDocNo: "",
          // 姓名
          rsdtName: "",
          // 身份证号
          idNo: "",
          // 选择性别
          sex: "",
          // 操作类型
          homeStatus: "",
          //操作人
          optUserName: "",
          // 选择结构
          hosId: ""
        },
        // 表格数据
        tableData: [],

        sexs: [{
            value: "0",
            label: "未知的性别"
          },
          {
            value: "1",
            label: "男"
          },
          {
            value: "2",
            label: "女"
          },
          {
            value: "9",
            label: "未说明的性别"
          }
        ],

        homeStatuss: [{
            value: "restore",
            label: "档案恢复"
          },
          {
            value: "delete",
            label: "档案删除"
          }
        ],

        //--- Options ---
        // 操作人
        docDoctorData: [],
        // 人群类别选项
        crowdCategoryOptions: [{
            value: "1",
            label: "普通人群"
          },
          {
            value: "2",
            label: "高血压"
          },
          {
            value: "3",
            label: "糖尿病"
          },
          {
            value: "4",
            label: "老年人"
          },
          {
            value: "5",
            label: "儿童"
          },
          {
            value: "6",
            label: "孕产妇"
          },
          {
            value: "7",
            label: "结核病"
          },
          {
            value: "8",
            label: "精神病"
          },
          {
            value: "9",
            label: "贫困人群"
          },
          {
            value: "10",
            label: "低收入人群"
          }
        ]
      };
    },
    computed: {
      ...mapGetters("home_doc_status", ["status", "choose"]),
      mainHeight() {
        // console.log("adaptiveHeight()", adaptiveHeight());
        return adaptiveHeight();
      }
    },
    created() {
      saveHeaderHeight(143);
      this.onQueryUsersByHosId(null, "user");
    },
    mounted() {
      this.tableData = [];
      // saveHeaderHeight(this.$refs.header.offsetHeight);
      baseDocData(this.reqParams)
        .then(res => {
          console.info("药品列表", JSON.stringify(res));
          console.info("药品列表res", res);
          this.crowdCategoryOptions = res.data;
        })
        .catch(error => {
          console.log(error);
        });

      this.list(this.reqParams);
    },
    methods: {
      ...mapActions({
        setConfigurationHome: "home_doc_status/setStatus"
      }),
      onQueryUsersByHosId(hosId, flg) {
        onPost({
            url: "/phss/sysPublic/onQueryUsersByHosId",
            data: { hosId: hosId }
          })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              this.docDoctorData = res.data;
            } else {
              console.log("error", res);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      restoreMethod() {
        this.data = {
          status: "",
          rowData: {}
        };
        this.setConfigurationHome("restore");
        this.dialogFormVisible = true;
        this.data.status = "restore";
        this.$emit("restore-method");
      },
      deleteMethod() {
        this.setConfigurationHome("delete");
        console.info("ssdelete", this.status);
        this.data = {
          status: "",
          rowData: {}
        };
        this.dialogFormVisible = true;
        this.data.status = "delete";

        this.$emit("delete-method");
      },
      saveMethod() {
        this.data = {
          status: "",
          rowData: {}
        };
        this.$refs.restore.saveMethod();
        this.dialogFormVisible = false;
        let val = this.choose;
        val.status = this.status;
        this.operate(val);
      },
      operate(data) {
        deleteOrRecover(data)
          .then(res => {
            this.list(this.reqParams);
          })
          .catch(error => {
            console.log(error);
          });
      },

      closeDiag() {
        this.dialogFormVisible = false;
      },
      list(data) {
        docDeleteRestoreList(data)
          .then(res => {
            this.tableData = res.data;
            this.total = res.total;
            this.reqParams.pageNo = res.pageNo;
            this.reqParams.pageSize = res.pageSize;
          })
          .catch(error => {
            console.log(error);
          });
      },

      expandCollapse() {
        this.boxshow = !this.boxshow;
        // this.boxshow ? saveHeaderHeight(143) : saveHeaderHeight(143);
        saveHeaderHeight(143);
      },
      queryMethod() {
        console.log("查询queryMethod");
        this.list(this.reqParams);
      },
      resetMethod() {
        console.log("重置resetMethod");
        this.reqParams = {
          pageNo: 1,
          pageSize: 10,
          // 健康档案号
          digDocNo: "",
          // 姓名
          rsdtName: "",
          // 身份证号
          idNo: "",
          // 选择性别
          sex: "",
          // 操作类型
          homeStatus: "",
          //操作人
          optUserName: "",
          // 选择结构
          hosId: ""
        }
      },
      newMethod() {
        this.$router.push({
          name: "addDrug",
          params: {
            status: "123",
            id: "123"
          }
        });
      },
      refreshMethod() {
        this.list(this.reqParams);
      },
      // --- 操作 ---
      handleView(index, row) {
        console.log("查看---", index, row);
        console.log("编辑---", index, row);
        this.$router.push({
          name: "modifyDrug",
          params: {
            status: "view",
            row: row
          }
        });
      },
      handleEdit(index, row) {
        console.log("编辑---", index, row);
        this.$router.push({
          name: "modifyDrug",
          params: {
            status: "modify",
            row: row
          }
        });
      },
      handleIntegrated(index, row) {
        console.log("综合管理---", index, row);
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
        this.dialogFormVisible = true;
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
  .health_file_delete_recovery {
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

    .FMListdialog {
      /deep/.el-dialog {
        width: 100%;
        width: 900px;
        position: relative;
        margin: 0 auto 0px;
        background: #fff;
        box-sizing: border-box;

        // height: 90vh;
        /deep/.el-dialog__body {
          border-bottom: 1px solid #dcdfe6;
          height: calc(100% - 120px);
          overflow: scroll;
          padding: 10px 60px 20px 60px;
        }

        /deep/.el-dialog__footer {
          // display: flex;
          // align-items: center;
          // justify-content: flex-end;
          padding: 15px;
          // text-align: right;
          // -webkit-box-sizing: border-box;
          // box-sizing: border-box;
        }
      }
    }
  }
</style>
