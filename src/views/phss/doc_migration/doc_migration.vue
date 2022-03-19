<template>
  <div class="QueryList">
    <header class="QueryList_header" ref="header">
      <p-title-search @query-method="queryMethod" @reset-method="resetMethod" @show="expandCollapse" :boxshow="boxshow"></p-title-search>
      <div class="query_conditions">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <l-formt-title label="姓名/简码" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.rsdtName" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="迁移状态" class="center" style="width: 90%;">
              <el-select v-model="reqParams.migrate" placeholder="请选择" clearable filterable>
                <el-option label="申请中" value="00"></el-option>
                <el-option label="已完成" value="01"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="迁入人" class="center" style="width: 90%;">
              <el-select v-model="reqParams.moveInUserId" placeholder="请选择" clearable filterable>
                <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="申请时间" class="fr" style="width: 90%;">
              <el-date-picker v-model="reqParams.applyDate" type="daterange" prefix-icon="icon iconfont iconriqi" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <div v-if="boxshow">
            <el-row class="pt-10" type="flex" justify="space-between">
              <el-col :span="6">
                <l-formt-title label="身份证" style="width: 90%;">
                  <el-input placeholder="请输入" v-model="reqParams.idNo" clearable></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="迁出机构" class="center" style="width: 90%;">
                  <el-select v-model="reqParams.moveOutRecode" placeholder="请选择" clearable filterable @change="getRegionAndGridByHospitalId('out')">
                    <el-option v-for="item in orgOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="迁出网格" class="center" style="width: 90%;">
                  <el-cascader v-model="saveParams.moveOutGrid" :options="outGridOptions" clearable></el-cascader>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="个人档案状态" class="fr" style="width: 90%;">
                  <el-select v-model="reqParams.docStatus" placeholder="请选择" clearable filterable>
                    <el-option label="暂存" value="00"></el-option>
                    <el-option label="正常" value="01"></el-option>
                    <el-option label="封存" value="02"></el-option>
                    <el-option label="迁移中" value="03"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
            </el-row>
            <el-row class="pt-10" type="flex" justify="space-between">
              <el-col :span="6">
                <l-formt-title label="健康档案编号" style="width: 90%;">
                  <el-input placeholder="请输入" v-model="reqParams.digDocNo" clearable></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="迁入机构" class="center" style="width: 90%;">
                  <el-select v-model="reqParams.moveInRecode" placeholder="请选择" clearable filterable @change="getRegionAndGridByHospitalId('in')">
                    <el-option v-for="item in orgOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="迁入网格" class="center" style="width: 90%;">
                  <el-cascader v-model="saveParams.moveInGrid" :options="inGridOptions" clearable></el-cascader>
                </l-formt-title>
              </el-col>
              <el-col :span="6"></el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </div>
    </header>
    <main class="QueryList_main" :style="{'max-height':mainHeight + 'px','min-height':mainHeight + 'px'}">
      <p-title-list @new-method="newMethod()" @refresh-method="refreshMethod"></p-title-list>
      <div>
        <el-table :data="tableData" :height="mainHeight - 153" border style="width: 100%;min-height: 400px;">
          <el-table-column prop="date">
            <template slot="header">
              <div class="table_header">档案编号</div>
              <div class="table_header">纸质档案编号</div>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.dig_doc_no}}</div>
              <div>{{scope.row.pap_doc_no}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date">
            <template slot="header">
              <div class="table_header">姓名</div>
              <div class="table_header">身份证号</div>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.rsdt_name}}</div>
              <div>{{scope.row.id_no}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date">
            <template slot="header">
              <div class="table_header">迁出机构</div>
              <div class="table_header">迁出网络</div>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.out_recode_name}}</div>
              <div>{{scope.row.out_grid_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date">
            <template slot="header">
              <div class="table_header">迁入机构</div>
              <div class="table_header">迁入网络</div>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.in_recode_name}}</div>
              <div>{{scope.row.in_grid_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" show-overflow-tooltip>
            <template slot="header">
              <div class="table_header">迁入人</div>
            </template>
            <template slot-scope="scope">
              <div class="hidden">{{scope.row.move_in_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date">
            <template slot="header">
              <div class="table_header">申请日期</div>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.apply_date}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date">
            <template slot="header">
              <div class="table_header">迁移状态</div>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.migrate_desc}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="300">
            <template slot="header">
              <div class="table_header">操作</div>
            </template>
            <template slot-scope="scope">
              <el-button type="success" @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button v-if="scope.row.migrate == '00'" type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button v-if="scope.row.migrate == '00'" type="success" @click="handleMoveIn(scope.$index, scope.row)">迁入</el-button>
              <el-button v-if="scope.row.migrate == '00'" type="success" @click="onDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination class="QueryList_main_page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="reqParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="reqParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      <div class="migration">
        <el-dialog title="迁移管理" :visible.sync="migrationVisible" width="750px" @close="onInitMigration" :before-close="handleClose">
          <el-row>
            <el-col :span="4">基本信息</el-col>
            <el-col :span="20">
              <el-row :gutter="20">
                <el-col :span="12" class="flex_cs">
                  <l-formt-title label="姓名" :style="popupStatus=='show'?'width:80%':''">
                    <el-input placeholder="请输入" v-model="saveParams.name" readonly></el-input>
                  </l-formt-title>
                  <div v-if="popupStatus=='show'">
                    <el-button @click="docVisible = true" icon="el-icon-plus" circle></el-button>
                  </div>
                </el-col>
                <el-col :span="12">
                  <l-formt-title label="性别" class="center">
                    <el-select v-model="saveParams.gender" placeholder="请选择" disabled>
                      <el-option label="男" value="1"></el-option>
                      <el-option label="女" value="2"></el-option>
                      <el-option label="未知的性别" value="0"></el-option>
                      <el-option label="未说明的性别" value="9"></el-option>
                    </el-select>
                  </l-formt-title>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <l-formt-title label="身份证">
                    <el-input placeholder="请输入" v-model="saveParams.idNo" readonly></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="12">
                  <l-formt-title label="民族" class="center">
                    <el-input placeholder="请输入" v-model="saveParams.nation_desc" readonly></el-input>
                  </l-formt-title>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <l-formt-title label="地址">
                    <el-input :readonly="popupStatus=='view'" placeholder="请输入" v-model="saveParams.address" clearable></el-input>
                  </l-formt-title>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">迁移信息</el-col>
            <el-col :span="20">
              <el-row :gutter="20">
                <el-col :span="12">
                  <l-formt-title label="迁出机构">
                    <el-input placeholder="请输入" v-model="saveParams.moveOutOrgName" readonly></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="12">
                  <l-formt-title label="迁入机构" class="center">
                    <el-select v-model="saveParams.moveInOrg" placeholder="请选择" clearable filterable @change="onOrgChange" :disabled="moveInFlg || popupStatus=='view'">
                      <el-option v-for="item in orgOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                  </l-formt-title>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <l-formt-title label="原责任医生">
                    <el-input placeholder="请输入" v-model="saveParams.oldResponsibleDrName" readonly></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="12">
                  <l-formt-title label="新责任医生" class="center">
                    <el-select :disabled="popupStatus=='view'" v-model="saveParams.responsibleDrId" placeholder="请选择" clearable filterable>
                      <el-option v-for="item in drOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </l-formt-title>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <l-formt-title label="迁出网格">
                    <el-input placeholder="请输入" v-model="saveParams.moveOutGridName" readonly></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="12">
                  <l-formt-title label="迁入网格" class="center">
                    <el-cascader :disabled="popupStatus=='view'" v-model="saveParams.moveInGrid" :options="gridOptions"></el-cascader>
                  </l-formt-title>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div>
                    <l-formt-title label="迁出家庭">
                      <el-radio class="mt-10" :disabled="popupStatus=='view'" v-model="saveParams.family" label="N">否</el-radio>
                      <el-radio class="mt-10" :disabled="popupStatus=='view'" v-model="saveParams.family" label="Y">是</el-radio>
                    </l-formt-title>
                  </div>
                </el-col>
                <el-col :span="12">
                  <l-formt-title label="迁入操作员" class="center">
                    <el-select :disabled="popupStatus=='view'" v-model="saveParams.moveInUserId" placeholder="请选择" clearable filterable>
                      <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </l-formt-title>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">迁入原因</el-col>
            <el-col :span="20">
              <el-input :readonly="popupStatus=='view'" type="textarea" :rows="2" placeholder="请输入内容" v-model="saveParams.moveInReason"></el-input>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="migrationVisible = false">取 消</el-button>
            <el-button v-if="popupStatus!='view'" type="primary" @click="onSave" size="medium">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div v-if="docVisible" class="docdialog">
        <el-dialog title="档案" :visible.sync="docVisible" width="940px">
          <div>
            <PChoosePatient ref="choosePatient" />
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="docVisible = false">取 消</el-button>
            <el-button type="primary" @click="queren">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </main>
  </div>
</template>

<script>
  import { adaptiveHeight, saveHeaderHeight } from "@/utils/common";
  import { queryDocMigrationManagement } from "@/api/phss/docMigration/docMigration";
  import { queryRegionAndGridByHospitalId } from "@/api/phss/region/grid_information";
  import { onGet, onPost } from "@/api/public/public";
  import { getPamars } from "@/utils/auth";
  export default {
    name: "QueryList",
    components: {},
    data() {
      return {
        moveInFlg: false,
        popupStatus: "show",
        chooseDate: {},
        //--- Options ---
        inGridOptions: [],
        outGridOptions: [],
        gridOptions: [],
        orgOptions: [],
        drOptions: [],
        userOptions: [],
        migrationVisible: false,
        docVisible: false,
        boxshow: false,
        input: "",
        total: 0,
        reqParams: {
          pageNo: 1,
          pageSize: 10,
          rsdtName: "",
          migrate: "",
          moveInUserId: "",
          applyDate: [],
          idNo: "",
          moveOutGrid: "",
          moveOutRecode: "",
          moveInRecode: "",
          digDocNo: "",
          docStatus: "",
          moveInGrid: "",
          recodeGrid: ""
        },
        saveParams: {
          id: "",
          digDocNo: "",
          papDocNo: "",
          name: "",
          idNo: "",
          gender: "",
          nation: "",
          nation_desc: "",
          docIndexId: "",
          moveOutOrg: "",
          moveOutGrid: "",
          moveInOrg: "",
          moveInGrid: [],
          moveInUserId: "",
          moveInName: "",
          family: "N",
          address: "",
          moveInReason: "",
          responsibleDrId: "",
          oldResponsibleDrId: ""
        },
        // 表格数据
        tableData: []
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
      this.queryOrg();
      this.queryMethod();
      this.onQueryUsersByHosId(null, "user");
    },
    mounted() {
      saveHeaderHeight(this.$refs.header.offsetHeight);
    },
    methods: {
      onInitMigration() {
        this.saveParams = {
          id: "",
          digDocNo: "",
          papDocNo: "",
          name: "",
          idNo: "",
          gender: "",
          nation: "",
          nation_desc: "",
          docIndexId: "",
          moveOutOrg: "",
          moveOutGrid: "",
          moveInOrg: "",
          moveInGrid: [],
          moveInUserId: "",
          moveInName: "",
          family: "N",
          address: "",
          moveInReason: "",
          responsibleDrId: "",
          oldResponsibleDrId: ""
        };
        this.moveInFlg = false;
        // this.popupStatus = "show";
      },
      onSave() {
        if (this.saveParams.docIndexId == "") {
          this.$message.warning("前选择档案");
          return;
        }
        if (this.saveParams.moveInOrg == "") {
          this.$message.warning("前选择迁入机构");
          return;
        }
        var url = "/phss/docMigrationManagement/onSaveDocMigrationManagement";
        if (this.moveInFlg) {
          url = "/phss/docMigrationManagement/onSaveMoveIn";
          if (
            this.saveParams.moveInGrid.length <= 0 ||
            typeof this.saveParams.moveInGrid[0] == "undefined" ||
            typeof this.saveParams.moveInGrid[1] == "undefined"
          ) {
            this.$message.warning("前选择迁入网格");
            return;
          }
          if (this.saveParams.responsibleDrId == "") {
            this.$message.warning("前选择新责任医生");
            return;
          }
          if (this.saveParams.moveInUserId == "") {
            this.$message.warning("前选择迁入操作员");
            return;
          }
        }
        onPost({
            url: url,
            data: this.saveParams
          })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              this.migrationVisible = false;
              this.queryMethod();
            } else {
              this.$message.error("保存失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      onDelete(index, row) {
        this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            onPost({
                url: "/phss/docMigrationManagement/onDeleteDocMigrationManagement",
                data: row
              })
              .then(res => {
                console.log(res);
                if (res.code === 1) {
                  this.queryMethod();
                } else {
                  this.$message.error("保存失败");
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
      // 确认
      queren() {
        this.chooseDate = this.$refs.choosePatient.returnChoosePatient();
        console.log(this.chooseDate);
        this.docVisible = false;
        this.saveParams.docIndexId = this.chooseDate.id;
        this.saveParams.name = this.chooseDate.rsdt_name;
        this.saveParams.digDocNo = this.chooseDate.dig_doc_no;
        this.saveParams.papDocNo = this.chooseDate.pap_doc_no;
        this.saveParams.idNo = this.chooseDate.id_no;
        this.saveParams.gender = this.chooseDate.gender;
        this.saveParams.nation = this.chooseDate.nation;
        this.saveParams.nation_desc = this.chooseDate.nation_desc;
        this.saveParams.address = this.chooseDate.current_address;
        this.saveParams.moveOutOrgName = this.chooseDate.current_org_name;
        this.saveParams.moveOutGridName = this.chooseDate.grid_name;
        this.saveParams.moveOutOrg = this.chooseDate.current_org_id;
        this.saveParams.moveOutRecode = this.chooseDate.cmnt_cmt_id;
        this.saveParams.moveOutGrid = this.chooseDate.grid;
        this.saveParams.oldResponsibleDrId = this.chooseDate.responsible_dr_id;
        this.saveParams.oldResponsibleDrName = this.chooseDate.responsible_dr_name;
      },
      expandCollapse() {
        this.boxshow = !this.boxshow;
        this.boxshow ? saveHeaderHeight(241) : saveHeaderHeight(143);
      },

      onOrgChange(flg) {
        console.log(this.saveParams.moveInRecode)
        this.onQueryUsersByHosId(flg, "dr");
        this.getRegionAndGridByHospitalId(null);
      },
      onQueryUsersByHosId(hosId, flg) {
        onPost({
            url: "/phss/sysPublic/onQueryUsersByHosId",
            data: { hosId: hosId }
          })
          .then(res => {
            console.log("======人员======", res);
            if (res.code === 1) {
              if (flg == "dr") {
                this.drOptions = res.data;
              } else {
                this.userOptions = res.data;
              }
            } else {
              if (flg == "dr") {
                this.drOptions = [];
              } else {
                this.userOptions = [];
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      },

      getRegionAndGridByHospitalId(flg) {
        console.log("=========onOrgChange========", flg);
        var hospitalId = "";
        if (flg == "in") {
          hospitalId = this.reqParams.moveInRecode;
        } else if (flg == "out") {
          hospitalId = this.reqParams.moveOutRecode;
        } else {
          hospitalId = this.saveParams.moveInOrg;
        }
        console.log(hospitalId);
        queryRegionAndGridByHospitalId({
            hospitalId: hospitalId
          })
          .then(res => {
            console.log("=====outGridOptions=====", res);
            if (res.code === 1) {
              if (flg == "in") {
                this.inGridOptions = res.data;
              } else if (flg == "out") {
                this.outGridOptions = res.data;
              } else {
                this.gridOptions = res.data;
              }
            } else {
              if (flg == "in") {
                this.inGridOptions = [];
              } else if (flg == "out") {
                this.outGridOptions = [];
              } else {
                this.gridOptions = [];
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      },

      queryOrg() {
        onGet({
            url: "/org/hos-tree",
            data: null
          })
          .then(res => {
            console.log("=====迁入机构======", res);
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
      // 关闭弹窗
      handleClose() {
        this.popupStatus = "show";
        this.migrationVisible = false;
      },
      queryMethod() {
        console.log("查询queryMethod");
        queryDocMigrationManagement(this.reqParams)
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              this.tableData = res.data;
              this.total = res.total;
            } else {
              this.$message.error("获取数据失败");
              this.total = 0;
              this.tableData = [];
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
          pageSize: 10,
          rsdtName: "",
          migrate: "",
          moveInUserId: "",
          applyDate: [],
          idNo: "",
          moveOutGrid: "",
          moveOutRecode: "",
          moveInRecode: "",
          digDocNo: "",
          docStatus: "",
          moveInGrid: "",
          recodeGrid: ""
        };
      },
      newMethod() {
        console.log("新建newMetho");
        this.migrationVisible = true;
        this.popupStatus = "show";
      },
      refreshMethod() {
        console.log("刷新refreshMethod");
        this.queryMethod();
      },
      // --- 操作 ---
      handleView(index, row) {
        console.log("查看---", index, row);
        this.migrationVisible = true;
        this.popupStatus = "view";
        this.saveParams.id = row.id;
        this.saveParams.docIndexId = row.doc_index_id;
        this.saveParams.name = row.rsdt_name;
        this.saveParams.digDocNo = row.dig_doc_no;
        this.saveParams.papDocNo = row.pap_doc_no;
        this.saveParams.idNo = row.id_no;
        this.saveParams.gender = row.gender;
        this.saveParams.nation = row.nation;
        this.saveParams.nation_desc = row.nation_desc;
        this.saveParams.address = row.address;
        this.saveParams.moveOutOrgName = row.out_org_name;
        this.saveParams.moveOutGridName = row.out_grid_name;
        this.saveParams.moveOutOrg = row.move_out_org;
        this.saveParams.moveOutGrid = row.move_out_grid;
        this.saveParams.moveInOrg = Number(row.move_in_org);
        this.saveParams.moveInGrid = [row.move_in_recode, row.move_in_grid];
        this.saveParams.moveInUserId = row.move_in_user_id;
        this.saveParams.responsibleDrId = row.responsible_dr_id;
        this.saveParams.oldResponsibleDrId = row.old_responsible_dr_id;
        this.saveParams.oldResponsibleDrName = row.old_responsible_dr_name;
        this.saveParams.moveInReason = row.move_in_reason;
        this.saveParams.family = row.family;
        this.onOrgChange();
      },
      handleMoveIn(index, row) {
        this.handleEdit(index, row);
        this.moveInFlg = true;
      },
      handleEdit(index, row) {
        console.log("编辑---", index, row);
        // moveInRecode
        this.migrationVisible = true;
        this.popupStatus = "hide";
        this.saveParams.id = row.id;
        this.saveParams.docIndexId = row.doc_index_id;
        this.saveParams.name = row.rsdt_name;
        this.saveParams.digDocNo = row.dig_doc_no;
        this.saveParams.papDocNo = row.pap_doc_no;
        this.saveParams.idNo = row.id_no;
        this.saveParams.gender = row.gender;
        this.saveParams.nation = row.nation;
        this.saveParams.nation_desc = row.nation_desc;
        this.saveParams.address = row.address;
        this.saveParams.moveOutOrgName = row.out_org_name;
        this.saveParams.moveOutGridName = row.out_grid_name;
        this.saveParams.moveOutOrg = row.move_out_org;
        this.saveParams.moveOutGrid = row.move_out_grid;
        this.saveParams.moveInOrg = Number(row.move_in_org);
        this.saveParams.moveInGrid = [row.move_in_recode, row.move_in_grid];
        this.saveParams.moveInUserId = row.move_in_user_id;
        this.saveParams.responsibleDrId = row.responsible_dr_id;
        this.saveParams.oldResponsibleDrId = row.old_responsible_dr_id;
        this.saveParams.oldResponsibleDrName = row.old_responsible_dr_name;
        this.saveParams.moveInReason = row.move_in_reason;
        this.saveParams.family = row.family;
        this.onOrgChange();
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
  }
</style>
