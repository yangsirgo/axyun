<template>
  <div class="QueryList">
    <header class="QueryList_header" ref="header">
      <p-title-search @query-method="queryMethod" @reset-method="resetMethod" :boxshow="boxshow" @show="expandCollapse"></p-title-search>
      <div class="query_conditions">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <l-formt-title label="姓名/简码" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.rsdtName" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="健康档案编号" class="center" style="width: 90%;">
              <el-input placeholder="请输入" v-model="reqParams.digDocNo" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="人群类别" class="center" style="width: 90%;">
              <el-select v-model="reqParams.rsdtType" placeholder="请选择" clearable filterable>
                <el-option v-for="item in crowdCategoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="出生时间" class="fr" style="width: 90%;">
              <el-date-picker v-model="reqParams.birthdays" type="daterange" prefix-icon="icon iconfont iconriqi" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <div v-if="boxshow">
            <el-row class="pt-10" type="flex" justify="space-between">
              <el-col :span="6">
                <l-formt-title label="性别" style="width: 90%;">
                  <el-select v-model="reqParams.gender" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="纸质档案编号" class="center" style="width: 90%;">
                  <el-input placeholder="请输入" v-model="reqParams.papDocNo" clearable></el-input>
                </l-formt-title>
              </el-col>

              <el-col :span="6">
                <l-formt-title label="迁入网格" class="center" style="width: 90%;">
                  <el-cascader :disabled="popupStatus=='view'" v-model="reqParams.cmntCmtId" :options="gridOptions" clearable></el-cascader>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="建档时间" class="fr" style="width: 90%;">
                  <el-date-picker class="fr" v-model="reqParams.createDocDate" type="daterange" prefix-icon="icon iconfont iconriqi" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </l-formt-title>
              </el-col>
            </el-row>
            <el-row class="pt-10" type="flex" justify="space-between">
              <el-col :span="6">
                <l-formt-title label="电话" style="width: 90%;">
                  <el-input placeholder="请输入" v-model="reqParams.telephone" clearable></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="个人档案状态" class="center" style="width: 90%;">
                  <el-select v-model="reqParams.docStatus" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in profileStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>

              <el-col :span="6">
                <l-formt-title label="医疗机构" class="center" style="width: 90%;">
                  <el-select v-model="reqParams.moveInOrg" placeholder="请选择" clearable filterable @change="onOrgChange" :disabled="moveInFlg || popupStatus=='view'">
                    <el-option v-for="item in orgOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="登记录入时间" class="fr" style="width: 90%;">
                  <el-date-picker v-model="reqParams.registerDate" type="daterange" prefix-icon="icon iconfont iconriqi" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </l-formt-title>
              </el-col>
            </el-row>
            <el-row class="pt-10" type="flex" justify="space-between">
              <el-col :span="6">
                <l-formt-title label="身份证" style="width: 90%;">
                  <el-input placeholder="请输入" v-model="reqParams.idNo" clearable></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="家庭档案状态" style="width: 90%;">
                  <el-select v-model="reqParams.homeStatus" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in familyfileStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="12"></el-col>
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
          <el-table-column prop="date" width="65">
            <template slot="header">
              <div class="table_header">性别</div>
              <div class="table_header">年龄</div>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.sex}}</div>
              <div>{{scope.row.age}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="110">
            <template slot="header">
              <div class="table_header">建档日期</div>
              <div class="table_header">登记录入日期</div>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.create_doc_date}}</div>
              <div>{{scope.row.register_date}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" show-overflow-tooltip>
            <template slot="header">
              <div class="table_header">建档机构</div>
              <div class="table_header">当前机构</div>
            </template>
            <template slot-scope="scope">
              <div class="hidden">{{scope.row.create_org_name}}</div>
              <div class="hidden">{{scope.row.current_org_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date">
            <template slot="header">
              <div class="table_header">居委会</div>
              <div class="table_header">网格</div>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.cmnt_cmt_name}}</div>
              <div>{{scope.row.grid_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="80">
            <template slot="header">
              <div class="table_header">责任医生</div>
              <div class="table_header">建档人</div>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.responsible_dr_name}}</div>
              <div>{{scope.row.create_doc_user_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="80">
            <template slot="header">
              <div class="table_header">档案状态</div>
              <div class="table_header">家庭档案</div>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.doc_status_desc}}</div>
              <div>{{scope.row.home_status}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="120">
            <template slot="header">
              <div class="table_header">人群类别</div>
            </template>
            <template slot-scope="scope">
              <div class="IM_list_badge_group">
                <div class="badge" :class="dynamicClass(v)" v-for="(v,i) in scope.row.rsdtTypes" :key="i">
                  <span>{{v}}</span> <br />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="280">
            <template slot="header">
              <div class="table_header">操作</div>
            </template>
            <template slot-scope="scope">
              <el-button type="success" @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="primary" @click="handleIntegrated(scope.$index, scope.row)">综合管理</el-button>
              <el-dropdown class="ml-10">
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="scope.row.doc_status == '00'" @click.native="handleReview(scope.$index, scope.row)" icon="el-icon-plus">复核</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.doc_status == '01'" @click.native="handleArchive(scope.$index, scope.row)" icon="el-icon-circle-plus">封存</el-dropdown-item>
                  <el-dropdown-item @click.native="handleDelete(scope.$index, scope.row)" icon="el-icon-circle-plus-outline">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination class="QueryList_main_page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="reqParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="reqParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </main>
    <!-- 新增 编辑弹窗 -->
    <TableDialog v-if="showDialog" ref="tableDialogRef" @saveMethod="saveMethod" :showDialog.sync="showDialog"></TableDialog>
    <!-- 档案封存 弹窗 -->
    <div class="FileArchiving">
      <el-dialog title="档案封存" :visible.sync="sealVisible" width="650px">
        <el-form :model="sealParams" :rules="sealParamsRules" ref="sealParams" label-width="120px" size="medium">
          <el-form-item label="封存原因" prop="seal_reason">
            <el-select v-model="sealParams.seal_reason" placeholder="请选择">
              <el-option label="档案迁出" value="01"></el-option>
              <el-option label="死亡" value="02"></el-option>
              <el-option label="失访" value="03"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="sealParams.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelarchive()">取 消</el-button>
          <el-button type="primary" @click="onSealDocIndex()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 查看弹窗 -->
    <div class="Viewdialog">
      <TableDialogView v-if="ViewdialogVisible" ref="tableDialogRef" :showDialog1.sync="ViewdialogVisible" />
    </div>
    <el-dialog title="提示" :visible.sync="reviewVisible" width="30%">
      <span>确定要复核此档案？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviewVisible = false">取 消</el-button>
        <el-button type="primary" @click="onReviewDocIndex()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getPamars } from "@/utils/auth";
  import { mapGetters, mapActions } from "vuex";
  import { adaptiveHeight, saveHeaderHeight } from "@/utils/common";
  import { queryRegionAndGridByHospitalId } from "@/api/phss/region/grid_information";
  import {
    onQueryDocIndex,
    sealDocIndex,
    reviewDocIndex,
    onDeleteDocIndex
  } from "@/api/phss/docIndex/docIndex";
  import { onPost, onGet } from "@/api/public/public";
  export default {
    name: "QueryList",
    components: {},
    data() {
      return {
        ViewdialogVisible: false,
        reviewVisible: false,
        sealVisible: false,
        showDialog: false,
        boxshow: false,
        moveInFlg: false,
        popupStatus: "show",
        input: "",
        total: 0,
        id: "",
        // 医疗机构
        orgOptions: [],
        // 居委会/网络
        gridOptions: [],
        sealParams: {
          seal_reason: "",
          index_id: "",
          remark: ""
        },
        sealParamsRules: {
          seal_reason: [
            { required: true, message: "请选择封存原因", trigger: "change" }
          ],
          remark: [{ required: true, message: "请输入备注", trigger: "change" }]
        },
        reqParams: {
          rsdtName: "", //姓名
          digDocNo: "", //健康档案编号
          rsdtType: "", //人群类别
          birthdays: [], //出生时间
          gender: "", //性别
          papDocNo: "", //纸质档案编号
          cmntCmtId: "", //居委会/网络
          createDocDate: [], //建档时间
          telephone: "", //电话
          docStatus: "", //个人档案状态
          currentOrgId: "", //医疗机构
          registerDate: [], //登记录入时间
          idNo: "", //身份证
          homeStatus: "", //家庭档案状态
          moveInGrid: "", //居委会网络
          moveInOrg: "",
          moveInRecode: "",
          pageNo: 1,
          pageSize: 20
        },
        // 表格数据
        tableData: [],
        //--- Options ---
        // 家庭档案状态
        familyfileStatus: [{
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
        // 个人档案状态
        profileStatus: [{
            value: "00",
            label: "暂存"
          },
          {
            value: "01",
            label: "正常"
          },
          {
            value: "02",
            label: "封存"
          },
          {
            value: "03",
            label: "迁移"
          }
        ],
        //性别
        sexList: [{
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
            label: "未说的性别"
          }
        ],
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
        ],
        tempId: ""
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
    },
    mounted() {
      saveHeaderHeight(this.$refs.header.offsetHeight);
    },
    methods: {
      ...mapActions({
        setConfiguration: "table/setConfiguration",
        setAllStepData: "table/setAllStepData"
      }),
      expandCollapse() {
        this.boxshow = !this.boxshow;
        this.boxshow ? saveHeaderHeight(290) : saveHeaderHeight(143);
      },
      queryMethod() {
        console.log("查询queryMethod");
        onQueryDocIndex(this.reqParams)
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
      // 新建
      newMethod() {
        console.log("新建newMetho");
        this.setConfiguration({
          tableName: "ResidentHealthRecord",
          dataYear: "twentySeventeen",
          tableTitle: "居民健康档案",
          status: "add"
        });
        this.showDialog = true;
      },

      // 改变数据
      onOrgChange(flg) {
        this.onQueryUsersByHosId(this.reqParams.moveInRecode, "dr");
        this.getRegionAndGridByHospitalId(null);
      },
      onQueryUsersByHosId(hosId, flg) {
        onPost({
            url: "/phss/sysPublic/onQueryUsersByHosId",
            data: { hosId: hosId }
          })
          .then(res => {
            console.log(res);
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
        var hospitalId = "";
        if (flg == "in") {
          hospitalId = this.reqParams.moveInOrg;
        } else if (flg == "out") {
          hospitalId = this.reqParams.moveOutOrg;
        } else {
          hospitalId = this.reqParams.moveInOrg;
        }
        queryRegionAndGridByHospitalId({
            hospitalId: hospitalId
          })
          .then(res => {
            console.log(res);
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

      //获取网络
      queryOrg() {
        onGet({
            url: "/org/hos-tree",
            data: null
          })
          .then(res => {
            console.log(res);
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

      // 保存
      saveMethod(row) {
        console.log("row", row);
        row.id = this.tempId;
        onPost({ url: "/phss/docIndex/onSaveDocIndex", data: row })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              this.$message.success("保存成功");
              this.tempId = "";
              this.queryMethod();
              this.$refs.tableDialogRef.initialize();
              this.$refs.tableDialogRef.OnClose();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      refreshMethod() {
        console.log("刷新refreshMethod");
        this.queryMethod();
      },
      // --- 操作 ---
      handleView(index, row) {
        console.log("查看---", index, row);
        console.log("viewMethod---", row);
        onGet({ url: "/phss/docIndex/onQueryOneDocIndex", data: { id: row.id } })
          .then(res => {
            if (res.code === 1) {
              this.setConfiguration({
                tableName: "ResidentHealthRecord",
                dataYear: "twentySeventeen",
                tableTitle: "居民档案",
                status: "view",
                editData: res.data,
                editChObject: res.data.chObject
              });
              this.ViewdialogVisible = true;
              this.DynamicMask();
            } else {
              this.$message.error("获取数据失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      handleEdit(index, row) {
        console.log("编辑---", index, row);
        this.tempId = row.id;
        onGet({ url: "/phss/docIndex/onQueryOneDocIndex", data: { id: row.id } })
          .then(res => {
            if (res.code === 1) {
              this.setConfiguration({
                tableName: "ResidentHealthRecord",
                dataYear: "twentySeventeen",
                tableTitle: "居民档案",
                status: "edit",
                editData: res.data,
                editChObject: res.data.chObject
              });
              this.showDialog = true;
            } else {
              this.$message.error("获取数据失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      handleIntegrated(index, row) {
        console.log("综合管理---", index, row);
        this.$router.push("/IntegratedManagementInfo?id=" + row.id);
      },
      // 当某一行被双击时会触发该事件
      // rowDblclick(row) {
      //   this.$router.push("/IntegratedManagementInfo");
      //   console.log("双击---", row);
      // },
      handleReview(index, row) {
        console.log("复核---", index, row);
        this.id = row.id;
        // this.reviewVisible = true;
        this.$confirm("确定要复核此档案？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            this.onReviewDocIndex()
          })
          .catch(() => {
            this.$message({
              type: "success",
              message: "已取消删除"
            });
          });
      },
      handleArchive(index, row) {
        console.log("封存---", index, row);
        this.sealVisible = true;
        this.sealParams.index_id = row.id;
      },
      cancelarchive() {
        this.sealParams = {
          seal_reason: " ",
          remark: " "
        }
        this.sealVisible = false;
      },
      handleDelete(index, row) {
        console.log("删除---", index, row);
        this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            onDeleteDocIndex({ id: row.id })
              .then(res => {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.queryMethod();
              })
              .catch(error => {
                console.log("error", error);
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
      },
      onSealDocIndex() {
        // eslint-disable-next-line consistent-return
        this.$refs.sealParams.validate(valid => {
          if (valid) {
            sealDocIndex(this.sealParams)
              .then(res => {
                console.log(res);
                if (res.code === 1) {
                  this.$message.success("保存成功");
                  this.sealVisible = false;
                  this.queryMethod();
                } else {
                  this.$message.error("保存失败");
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      onReviewDocIndex() {
        reviewDocIndex({ id: this.id })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              this.$message.success(res.msg);
              this.reviewVisible = false;
              this.queryMethod();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      dynamicClass(v) {
        // console.log("v", v);
        let className = "";
        switch (v) {
          case "普":
            className = "lao";
            break;
          case "老":
            className = "pu";
            break;
          case "糖":
            className = "tang";
            break;
          case "高":
            className = "gao";
            break;
          case "精":
            className = "jing";
            break;
          case "结":
            className = "jie";
            break;

          default:
            break;
        }
        return className;
      }
    },
    watch: {}
  };
</script>

<style lang="scss" scoped>
  .FileArchiving {
    /deep/.el-form-item {
      margin-bottom: 22px;
    }

    /deep/.el-dialog {
      // width: 100%;
      // width: 1035px;
      position: relative;
      margin: 0 auto 0px;
      background: #fff;
      box-sizing: border-box;
      // height: 90vh;

      /deep/.el-dialog__body {
        border-bottom: 1px solid #dcdfe6;
        padding: 20px 30px 10px 0px;
      }

      /deep/.el-dialog__footer {
        // display: flex;
        // align-items: center;
        // justify-content: flex-end;
        padding: 10px 30px 10px 10px;
        text-align: right;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
    }
  }
  .QueryList .QueryList_main .table_header{
    text-align: center;
  }
  .Viewdialog {

    // width: 100%;
    // height: 100%;
    // overflow-y: auto;
    // background: #fff;
    // padding: 30px;
    /deep/.el-dialog {
      width: 100%;
      width: 1035px;
      position: relative;
      margin: 0 auto 0px;
      background: #fff;
      box-sizing: border-box;
      height: 90vh;

      /deep/.el-dialog__body {
        border-bottom: 1px solid #dcdfe6;
        height: calc(100% - 120px);
        overflow: scroll;
        padding: 30px 105px;
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

  .IM_list_badge_group {
    margin-top: 10px;
    margin-bottom: 3px;

    .badge {
      float: left;
      margin-left: 3px;
      margin-bottom: 3px;
      width: 30%;
      height: 20px;
      text-align: center;
      border-radius: 10px;
      font-size: 12px;
      color: rgba(255, 255, 255, 1);
      line-height: 18px;
    }

    .badge:nth-child(4) {
      margin-left: 0px;
    }

    .pu {
      background: #67c23a;
      border: 1px solid #67c23a;
    }

    .lao {
      background: rgba(54, 86, 255, 1);
      border: 1px solid rgba(54, 86, 255, 1);
    }

    .tang {
      background: #ef1011;
      border: 1px solid #ef1011;
    }

    .gao {
      background: #f26e40;
      border: 1px solid #f26e40;
    }

    .jing {
      background: #ffc109;
      border: 1px solid #ffc109;
    }

    .jie {
      background: #25d9f5;
      border: 1px solid #25d9f5;
    }

    .badge:nth-child(1) {
      margin: 0;
    }
  }

  .IM_list_badge_group:nth-child(1) {
    padding: 0;
  }
</style>
