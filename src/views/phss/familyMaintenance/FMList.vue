<template>
  <div class="QueryList">
    <header class="QueryList_header" ref="header">
      <p-title-search @query-method="queryMethod" @reset-method="resetMethod" @show="expandCollapse" :boxshow="boxshow"></p-title-search>
      <div class="query_conditions">
        <el-row type="flex">
          <el-col :span="6">
            <l-formt-title label="家庭档案编号" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.homeCode" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="户主姓名或简码" class="center" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.houseHolder" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="家庭住址" class="center" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.address" clearable></el-input>
            </l-formt-title>
          </el-col>

        </el-row>
        <el-collapse-transition>
          <div v-if="boxshow">
            <el-row class="pt-10" type="flex">

              <el-col :span="6">
                <l-formt-title label="户号" class="center" style="width: 90%;">
                  <el-input placeholder="请输入" v-model="reqParams.familyNum" clearable></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="成员姓名或简码" class="center" style="width: 90%;">
                  <el-input placeholder="请输入" v-model="reqParams.memFamily" clearable></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="建档医生" class="center" style="width: 90%;">
                  <el-select v-model="reqParams.docDoctor" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in docDoctorData" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>

            </el-row>
            <el-row class="pt-10" type="flex">
              <!--<el-col :span="6">-->
              <!--<l-formt-title label="电话" style="width: 90%;">-->
              <!--<el-input placeholder="请输入" v-model="input" clearable></el-input>-->
              <!--</l-formt-title>-->
              <!--</el-col>-->
              <el-col :span="6">
                <l-formt-title label="家庭档案状态" class="center" style="width: 90%;">
                  <el-select v-model="reqParams.status" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in crowdCategoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="医疗机构" class="center" style="width: 90%;">
                  <el-select v-model="reqParams.hosId" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in orgOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="户主或家庭成员身份证号" style="width: 90%;">
                  <el-input placeholder="请输入" v-model="reqParams.idNo" clearable></el-input>
                </l-formt-title>
              </el-col>

            </el-row>
          </div>
        </el-collapse-transition>
      </div>
    </header>
    <main class="QueryList_main" :style="{'max-height':mainHeight + 'px','min-height':mainHeight + 'px'}">
      <p-title-list @new-method="newMethod()" @refresh-method="refreshMethod"></p-title-list>
      <div class="FMList_table">
        <el-table :data="houseHolds" @row-dblclick="rowDblclick" :height="mainHeight - 153" style="width: 100%;min-height: 400px;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.familyInformationVOList" style="width: 100%">
                <el-table-column prop="rsdtName" label="姓名" width></el-table-column>
                <el-table-column prop="desc" label="与户主关系" width></el-table-column>
                <el-table-column prop="sex" label="性别" width></el-table-column>
                <el-table-column prop="age" label="年龄" width></el-table-column>
                <el-table-column prop="idNo" label="身份证号" width></el-table-column>
                <el-table-column prop="telephone" label="电话" width></el-table-column>
                <el-table-column prop="date" label="操作" width>
                  <template slot-scope="scope">
                    <el-button type="success" @click="handleView(scope.$index, scope.row)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="homeCode" label="家庭档案号" width></el-table-column>
          <el-table-column prop="houseHolder" label="户主姓名" width></el-table-column>
          <el-table-column prop="familyPopulation" label="家庭人口数" width></el-table-column>
          <el-table-column prop="houseHoldType" label="家庭类型" width></el-table-column>
          <el-table-column prop="homeStatus" label="档案状态" width></el-table-column>
          <el-table-column prop="address" label="家庭住址" width></el-table-column>
          <el-table-column prop="createDocUserName" label="建档医生" width></el-table-column>
          <el-table-column prop="docTime" label="建档日期" width></el-table-column>
          <el-table-column prop="date" label="操作" width="320">
            <template slot-scope="scope">
              <el-button type="success" @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="primary" v-show="scope.row.status!='3'" @click="handleIntegrated(scope.$index, scope.row)">解散</el-button>
              <el-button type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination class="QueryList_main_page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="reqParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="reqParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </main>

    <div class="FMListdialog" v-if="this.dialogFormVisible">
      <el-dialog title="新增家庭基本信息" :visible.sync="this.dialogFormVisible" :close-on-click-modal="false" top="5vh" @close="closeDiag">
        <add ref="addFM" :data="dataNew" @saveMethod="saveMethod1" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDiag">取 消</el-button>
          <el-button type="primary" @click="saveMethod">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="FMListdialog" v-if="this.dialogViewVisible">
      <el-dialog title="查看家庭基本信息" :visible.sync="this.dialogViewVisible" :close-on-click-modal="false" top="5vh" @close="closeViewDiag">
        <viewFM ref="viewFM" :data="dataNew" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeViewDiag">取 消</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="disBanddialog" v-if="this.dialogdisBandReason">
      <el-dialog title="家庭解散" :visible.sync="this.dialogdisBandReason" :close-on-click-modal="false" top="5vh" @close="closeDiagDisBand">
        <el-input type="textarea" :rows="2" placeholder="解散原因请输入" v-model="disBandReason" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDiagDisBand">取 消</el-button>
          <el-button type="primary" @click="saveDisBandMethod">确 定</el-button>
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
  import add from "./addFM";
  import viewFM from "./viewFM";
  import {
    getBaseHomDoc,
    onQueryDocIndex,
    saveBaseHomDoc,
    disBandHomDoc,
    deleteHomDoc,
    getHomeDocByPage
  } from "@/api/phss/family_maintenance/family_maintenance";
  export default {
    name: "FamilyMaintenanceList",
    components: {
      add,
      viewFM
    },
    data() {
      return {

        // 解散的数据
        rowData: {},
        disBandReason: '',
        dataNew: {
          status: '',
          rowData: {}
        },

        TableForm: {},
        dialogFormVisible: false,
        dialogViewVisible: false,
        dialogdisBandReason: false,
        boxshow: false,
        input: "",
        total: 0,
        reqParams: {
          // 家庭档案编号
          homeCode: "",
          // 户主姓名或简码
          houseHolder: '',
          // 家庭住址
          address: '',
          // 户号
          familyNum: '',
          // 成员姓名或简码
          memFamily: '',
          // 建档医生
          docDoctor: '',
          // 家庭档案状态
          status: '',
          // 医疗机构
          hosId: '',
          // 户主或家庭成员身份证号
          idNo: '',
          pageNo: 1,
          pageSize: 10
        },
        // 表格数据
        houseHolds: [],
        //--- Options ---
        // 人群类别选项
        crowdCategoryOptions: [{
            value: "0",
            label: "异常"
          },
          {
            value: "1",
            label: "正常"
          },
          {
            value: "3",
            label: "解散"
          }

        ],
        // 医疗机构
        orgOptions: [],
        // 建档医生
        docDoctorData: []
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
      this.queryOrg();
      this.baseData({
        "ad": "123"
      });
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
        getHomeDocByPage(this.reqParams)
          .then(res => {
            // console.info("家庭关系", JSON.stringify(res));
            this.houseHolds = res.data;
            this.reqParams.pageNo = res.pageNo;
            this.reqParams.pageSize = res.pageSize;
            this.total = res.total;
          })
          .catch(error => {
            console.log(error);
          });
      },
      resetMethod() {
        console.log("重置resetMethod");
        this.reqParams = {
          // 家庭档案编号
          homeCode: "",
          // 户主姓名或简码
          houseHolder: '',
          // 家庭住址
          address: '',
          // 户号
          familyNum: '',
          // 成员姓名或简码
          memFamily: '',
          // 建档医生
          docDoctor: '',
          // 家庭档案状态
          status: '',
          // 医疗机构
          hosId: '',
          // 户主或家庭成员身份证号
          idNo: '',
          pageNo: 1,
          pageSize: 10
        }
      },
      baseData(data) {
        getBaseHomDoc(data)
          .then(res => {
            this.docDoctorData = res.data.docDoctors;
          }).catch(error => {
            console.log(error);
          });
      },
      //console.log("新建newMetho");
      newMethod() {
        this.dataNew = {
            status: '',
            rowData: {}
          };
          this.dataNew.status = "add";
        this.dialogFormVisible = true;
      },
      saveMethod1(data) {
        console.log("子组件返回信息", data);
        let HomeDocVO = data;
        if (HomeDocVO.houseHolder.replace(/\s*/g, "").length == 0) {
          this.$message.warning('请填在下面选择户主');
          return false
        }
        if (HomeDocVO.homeCode.replace(/\s*/g, "").length == 0) {
          this.$message.warning('请填写家庭档案编号');
          return false;
        }
        if (HomeDocVO.docDoctor.replace(/\s*/g, "").length == 0) {
          this.$message.warning('请填建档医生');
          return false;
        }
        saveBaseHomDoc(HomeDocVO)
          .then(res => {
            if (res.code == '1') {
              this.$message.success('保存成功');
              this.dialogFormVisible = false;
            } else {
              this.$message.error(res.msg)
            }
            this.queryMethod();

          }).catch(error => {
            this.$message.error(error);
          });
      },
      saveMethod(data) {
        this.$refs.addFM.saveMethod();
      },
      closeDiag() {
        this.queryMethod();
        this.dialogFormVisible = false;
      },
      // 家庭解散按钮
      saveDisBandMethod() {
        this.rowData.disBandReason = this.disBandReason;
        this.disBandHomDoc(this.rowData);
        this.disBandReason = "";
        this.dialogdisBandReason = false;
        this.rowData = {};
      },
      queryOrg() {
        onGet({
            url: "/org/hos-tree",
            data: null
          })
          .then(res => {
            // console.log("=====迁入机构======", res);
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
      closeViewDiag() {
        this.dialogViewVisible = false;
      },
      closeDiagDisBand() {
        this.disBandReason = "";
        this.dialogdisBandReason = false;
      },
      refreshMethod() {
        console.log("刷新refreshMethod");
      },
      // --- 操作 ---
      handleView(index, row) {
        this.dataNew = {
            status: '',
            rowData: {}
          };
          // console.log("查看---", index, row);
          this.dataNew.status = "modify";
        this.dataNew.rowData = row;
        this.dialogViewVisible = true;

      },
      handleEdit(index, row) {
        this.dataNew = {
            status: '',
            rowData: {}
          };
          console.log("编辑===============================", row);
        this.dataNew.status = "modify";
        this.dataNew.rowData = row;
        this.dialogFormVisible = true;

      },
      handleIntegrated(index, row) {
        this.dialogdisBandReason = true;
        this.rowData = row;
      },
      disBandHomDoc(data) {
        disBandHomDoc(data)
          .then(res => {
            this.queryMethod();
          })
          .catch(error => {
            console.log(error);
          });
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
        console.log("删除---", index, JSON.stringify(row));
        this.$confirm('此操作将永久删除此条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteHomDoc(row)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.queryMethod();
            })
            .catch(error => {
              console.log(error);
            });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消删除'
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
          background-color: #F5F8FA;
        }

        /deep/.el-table__body {
          background-color: #f5f8fa;
        }
      }
    }
  }
</style>
