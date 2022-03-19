<template>
  <div class="height100 drug">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      pageName="drugApply"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="true"></left-bar>
      </template>
      <template #content>
        <el-card
          class="right height100 position-relative"
          style="margin-left: 0px;"
          v-loading="isLoading"
        >
          <el-tabs class="height100" v-model="activeModule" @tab-click="handleClickTab">
            <el-tab-pane label="待申领" name="first">
              <div class="overflow-hidden btn-top position-absolute">
                <el-button
                  class="float-right"
                  type="primary"
                  v-hotKey="{func: 'func_submit', flag:'isLoading'}"
                  @click="applyDrug"
                >申领</el-button>
              </div>
              <div class="overflow-hidden search-box padding20" style="padding-top: 0px;">
                <div class="float-left" style="margin-top: 9px;">
                  <span class="label float-left">医嘱类别</span>
                  <el-checkbox-group
                    class="float-left"
                    v-model="searchForm.adviceType"
                    @change="categoryCodeChange"
                  >
                    <el-checkbox label="1">长期</el-checkbox>
                    <el-checkbox label="2">临时</el-checkbox>
                    <el-checkbox label="3">出院带药</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="float-left" style="width: 400px;margin-left: 30px;">
                  <l-formt-title label="选择药房">
                    <el-select
                      v-model="searchForm.hmmId"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      @change="storageChange"
                    >
                      <el-option
                        v-for="item in drugStorage"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </l-formt-title>
                </div>
                <div class="float-left margin-left-10" style="width: 250px">
                  <l-formt-title label="截至开始时间">
                    <el-date-picker
                      v-model="searchForm.endDate"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期"
                      @change="dateChange"
                    ></el-date-picker>
                  </l-formt-title>

                </div>
              </div>
              <div
                class="position-absolute"
                style="top: 40px;left: 0;right: 0;bottom: 50px;overflow: auto;padding: 20px 20px 80px;"
              >
                <el-collapse v-model="activeNames" @change="handleChange">
                  <l-collapse-item
                    v-for="(parentItem, $index) in collapseDataStay"
                    :name="$index"
                    :key="$index"
                  >
                    <div slot="title" style="font-size: 14px;">
                      <el-checkbox v-model="parentItem.checked" @change="selectAll($index)"></el-checkbox>
                      <!-- <span style="font-size: 20px;">{{parentItem.bedNum}}</span>床 -->
                      <span class="margin-left-20">{{parentItem.patientName}}</span>
                      <span
                        class="margin-left-20"
                        :val="parentItem.patientGender"
                        code="GENDER_CODE"
                        v-codeTransform
                      >-</span>
                      <span class="margin-left-20">用药时间：{{parentItem.exec_time || '--'}}</span>
                      <!-- <span class="margin-left-20">{{parentItem.ageInfo}}岁</span> -->
                    </div>
                    <div slot="content">
                      <div class="table-wrapper" style="margin-top: 5px;">
                        <el-table
                          header-cell-class-name="headerCls"
                          row-class-name="rowStyleCls"
                          ref="singleTable"
                          :data="parentItem.pendingAdviceList"
                          highlight-current-row
                          style="width: 100%"
                          stripe
                          border
                          @select="selectItem"
                          element-loading-text="加载中..."
                          @row-click="rowClick"
                        >
                          <el-table-column type="selection" width="45"></el-table-column>
                          <el-table-column
                            v-for="item in collapseTableColumn"
                            :key="item.label"
                            :label="item.label"
                            :prop="item.prop"
                            align="center"
                            show-overflow-tooltip
                            header-align="center"
                            :min-width="item.width"
                          >
                            <template slot-scope="scope">
                              <div v-if="item.prop === 'basicDosage'" class="color2">
                                <template v-if="scope.row.categoryCode=='3'">
                                  {{scope.row.basicDosage}}
                                  <span
                                    :val="scope.row.basicDosageUnit"
                                    code="DrugUnit"
                                    v-codeTransform
                                  ></span>
                                </template>
                                <template v-else>
                                  {{scope.row.onceDosage/scope.row.dosageValue}}
                                  <span
                                    :val="scope.row.basicDosageUnit"
                                    code="DrugUnit"
                                    v-codeTransform
                                  ></span>
                                </template>
                              </div>
                              <div
                                v-else-if="item.prop === 'status'"
                                class="color1"
                              >{{statusArr[scope.row[item.prop]]}}</div>
                              <div v-else-if="item.prop ==='patientGender'">
                                <span
                                  :val="scope.row[item.prop]"
                                  code="GENDER_CODE"
                                  v-codeTransform
                                ></span>
                              </div>
                              <div v-else-if="item.prop === 'uses'" class="color1">
                                <span
                                  :val="scope.row.uses"
                                  code="MedicationRouteCode"
                                  v-codeTransform
                                ></span>
                              </div>

                              <div v-else-if="item.prop === 'onceDosage'" class="color1">
                                {{scope.row.onceDosage}}
                                <span
                                  :val="scope.row.dosageUnit"
                                  code="DrugDoseUnit"
                                  v-codeTransform
                                ></span>
                              </div>

                              <div v-else-if="item.prop == 'frequency'">
                                <span
                                  columns="FREQUENCY_NAME"
                                  :conditionMap="{FREQUENCY_CODE: scope.row.frequency}"
                                  tableName="hrp_frequency"
                                  v-tableTransform
                                ></span>
                              </div>
                              <div v-else-if="item.prop == 'deptCode'">
                                <span
                                  tableName="sys_org"
                                  :conditionMap="{org_type: '_DEPT_', id: scope.row[item.prop]}"
                                  columns="org_nm"
                                  v-tableTransform
                                ></span>
                              </div>
                              <div v-else>{{scope.row[item.prop]}}</div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>
                  </l-collapse-item>
                </el-collapse>
              </div>
            </el-tab-pane>
            <el-tab-pane label="已申领" name="second">
              <div class="overflow-hidden search-box padding20" style="padding-top: 0px;">
                <div class="float-left" style="margin-top: 9px;">
                  <span class="label float-left">医嘱类别</span>
                  <el-checkbox-group
                    class="float-left"
                    v-model="searchHavingForm.adviceType"
                    @change="categoryCodeChange"
                  >
                    <el-checkbox label="1">长期</el-checkbox>
                    <el-checkbox label="2">临时</el-checkbox>
                    <el-checkbox label="3">出院带药</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="float-left" style="width: 475px;margin-left: 30px;">
                  <l-formt-title label="选择药房">
                    <el-select
                      v-model="searchHavingForm.hmmId"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      @change="storageChange"
                    >
                      <el-option
                        v-for="item in drugStorage"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </l-formt-title>
                </div>
                <div class="float-left margin-left-10">
                  <l-formt-title
                    label="申领时间"
                    style="width: 350px;"
                    class="position-relative float-left"
                  >
                    <el-date-picker
                      v-model="dateRange"
                      @change="dateChange"
                      type="daterange"
                      prefix-icon="null"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      :default-time="['00:00:00', '23:59:59']"
                    ></el-date-picker>
                    <i class="iconfont iconriqi position-absolute date-icon"></i>
                  </l-formt-title>
                </div>
              </div>
              <div
                class="position-absolute"
                style="top: 40px;left: 0;right: 0;bottom: 50px;overflow: auto;padding: 20px 20px 80px;"
              >
                <div class="table-wrapper" style="margin-top: 5px;">
                  <el-table
                    header-cell-class-name="headerCls"
                    row-class-name="rowStyleCls"
                    :data="claimeTableList"
                    highlight-current-row
                    style="width: 100%"
                    stripe
                    border
                    element-loading-text="加载中..."
                  >
                    <el-table-column
                      v-for="(item,index) in collapseHavingTableColumn"
                      :key="item.label+index"
                      :label="item.label"
                      :prop="item.prop"
                      align="center"
                      show-overflow-tooltip
                      header-align="center"
                      :min-width="item.width"
                    >
                      <template slot-scope="scope">
                        <div v-if="item.prop === 'basicDosage'" class="color2">
                          <template v-if="scope.row.categoryCode=='3'">
                            {{scope.row.basicDosage}}
                            <span
                              :val="scope.row.basicDosageUnit"
                              code="DrugUnit"
                              v-codeTransform
                            ></span>
                          </template>
                          <template v-else>
                            {{scope.row.onceDosage/scope.row.dosageValue}}
                            <span
                              :val="scope.row.basicDosageUnit"
                              code="DrugUnit"
                              v-codeTransform
                            ></span>
                          </template>
                        </div>
                        <div
                          v-else-if="item.prop === 'status'"
                          class="color1"
                        >{{statusArr[scope.row[item.prop]]}}</div>
                        <div v-else-if="item.prop ==='patientGender'">
                          <span :val="scope.row[item.prop]" code="GENDER_CODE" v-codeTransform></span>
                        </div>
                        <div v-else-if="item.prop === 'uses'" class="color1">
                          <span :val="scope.row.uses" code="MedicationRouteCode" v-codeTransform></span>
                        </div>

                        <div v-else-if="item.prop === 'onceDosage'" class="color1">
                          {{scope.row.onceDosage}}
                          <span
                            :val="scope.row.dosageUnit"
                            code="DrugDoseUnit"
                            v-codeTransform
                          ></span>
                        </div>

                        <div v-else-if="item.prop == 'frequency'">
                          <span
                            columns="FREQUENCY_NAME"
                            :conditionMap="{FREQUENCY_CODE: scope.row.frequency}"
                            tableName="hrp_frequency"
                            v-tableTransform
                          ></span>
                        </div>
                        <div v-else-if="item.prop == 'deptCode'">
                          <span
                            tableName="sys_org"
                            :conditionMap="{org_type: '_DEPT_', id: scope.row[item.prop]}"
                            columns="org_nm"
                            v-tableTransform
                          ></span>
                        </div>
                        <div v-else>{{scope.row[item.prop]}}</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div
                  v-if="dataTotal!=0"
                  style="text-align: right;margin-right: 25px;margin-top: 10px"
                >
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 30, 40,50,100]"
                    :page-size="pageSize"
                    layout="sizes, prev, pager, next, jumper"
                    :total="dataTotal"
                  ></el-pagination>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </template>
    </l-layout>
    <!-- 申请结果 -->
    <el-dialog
      class="noHeader"
      :visible.sync="ApplyDialogVisible"
      :show-close="false"
      width="450px"
    >
      <div class="change-section padding20">
        <div style="line-height: 28px;">
          <span v-if="currentApplyState">
            <i class="el-icon-success margin-right-10 color2 success-tip"></i>完成申请
          </span>
          <span v-if="!currentApplyState">
            <i class="el-icon-warning margin-right-10 color6 success-tip"></i>完成申请
          </span>
        </div>
        <div style="margin-top: 20px;">
          <l-collapse-item v-for="(item, index) in applyList" :key="index">
            <div class="width100" slot="title" style="font-size: 14px;">
              <span style="font-size: 20px;">{{item.bedNum}}</span>床
              <span class="margin-left-20">{{item.name}}</span>
              <span class="margin-left-20">{{item.gender}}</span>
              <span class="margin-left-20">{{item.age}}岁</span>
              <span class="float-right apply-res color2" v-if="item.state == 1">申领成功</span>
              <span class="float-right apply-res color15" v-else>申领失败</span>
            </div>
            <div slot="content">
              <div
                v-for="(val, i) in item.detail"
                :key="i"
                style="line-height: 44px;"
                :class="val.itemState == 1?'color3':'color15'"
              >
                <span>{{val.itemName}}</span>
                <span
                  class="float-right margin-right-10"
                  style="height: 44px;width: 56px;text-align: center"
                  v-if="val.itemState == 1"
                >
                  <i class="iconfont icondagou color2"></i>
                </span>
                <span
                  class="float-right margin-right-10"
                  style="height: 44px;width: 56px;text-align: center"
                  v-else
                >{{val.itemState}}</span>
              </div>
            </div>
          </l-collapse-item>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="float-left color15 marginTop10" v-if="!currentApplyState">(1个药品申请失败)</span>
        <el-button
          v-if="!currentApplyState"
          type="primary"
          style="border-radius: 2px;"
          @click="dialogDrugDetailVisible = true"
        >查看失败药品</el-button>
        <el-button type="primary" plain @click="ApplyDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 申领明细 -->
    <el-dialog title="申领明细（0.9%氯化钠注射液）" :visible.sync="dialogDrugDetailVisible">
      <div class="padding20">
        <el-table :data="applyDetail.data" border>
          <el-table-column
            v-for="(item, index) in applyDetail.column"
            :key="index"
            :property="item.prop"
            :label="item.label"
            :min-width="item.width"
          ></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="dialogDrugDetailVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LeftBar from "../../components/nursingLeftBar";
import {
  fetchDrugStorage,
  fetchApplyDrugList,
  requestDrug,
  getHistoryDrugRequestList
} from "@/api/ipnw/nursing";

export default {
  name: "drugApply",
  components: {
    LeftBar
  },
  data() {
    return {
      //当前页
      currentPage: 1,
      //每页条数
      pageSize: 10,
      //条数
      dataTotal: 0,
      isLoading: false, // 数据请求loading
      formParams: [
        "technicalOffices",
        "illnessArea",
        "patientsType",
        "patientsState",
        "search"
      ], // 左侧搜索条件
      toolBoxs: ["drugInfo", "Hotkey"],
      // 患者列表查询条件
      patientsSearchForm: {},

      value: "",
      drugStorage: [],

      ApplyDialogVisible: false, // 申请药品弹框 显示隐藏
      dialogDrugDetailVisible: false, // 申请药品详情table 显示隐藏
      activeNames: "", //
      activeModule: "first", // 列表所选tab
      dateRange: [],
      searchForm: {
        adviceType: ["1"], // 医嘱类别
        hmmId: [], // 标签
        endDate: ""
      },
      searchHavingForm: {
        adviceType: ["1"], // 医嘱类别
        hmmId: [], // 标签
        endDate: "",
        startDate: ""
      },
      selectedList: [], // 已选中列表
      collapseDataStay: [
        // 待申领
      ],
      collapseDataed: [
        // 已申领
      ],
      collapseDataAll: [
        // 全部
      ],
      collapseTableColumn: [
        // 待申领
        {
          prop: "status",
          label: "状态",
          width: "80"
        },
        {
          prop: "adviceTime",
          label: "开始时间",
          width: "120"
        },
        {
          prop: "stopTime",
          label: "停止时间",
          width: "120"
        },
        {
          prop: "name",
          label: "名称",
          width: "120"
        },
        {
          prop: "spec",
          label: "规格",
          width: "120"
        },
        {
          prop: "onceDosage",
          label: "单次剂量",
          width: "120"
        },
        {
          prop: "uses",
          label: "用法",
          width: "120"
        },
        {
          prop: "frequency",
          label: "频次",
          width: "80"
        },
        {
          prop: "basicDosage",
          label: "数量",
          width: "80"
        },
        {
          prop: "amount",
          label: "总金额",
          width: "120"
        },
        {
          prop: "execTime",
          label: "常规时间",
          width: "120"
        },
        {
          prop: "doctorName",
          label: "开嘱人",
          width: "120"
        },
        {
          prop: "deptCode",
          label: "开嘱科室",
          width: "120"
        },
        {
          prop: "execDeptName",
          label: "执行科室",
          width: "120"
        },
        {
          prop: "remark",
          label: "备注",
          width: "120"
        }
      ],
      collapseHavingTableColumn: [],
      statusArr: {
        "0": "未申领",
        "10": "已申领",
        "20": "执行中",
        "30": "已执行"
      },
      currentApplyState: false, // 当前药品申请是否成功
      applyList: [
        // 申请弹框列表
        {
          bedNum: "04",
          name: "李玉梅",
          gender: "女",
          age: "36",
          state: 1, // 1 申领成功 0 失败
          detail: [
            {
              itemName: "0.9%氯化钠注射液",
              itemState: "1" // 1 申领成功 0 失败
            },
            {
              itemName: "阿司匹林肠溶片",
              itemState: "1" // 1 申领成功 0 失败
            },
            {
              itemName: "阿托伐他丁钙片",
              itemState: "费用不足" // 1 申领成功 0 失败
            }
          ]
        }
      ], //
      applyDetail: {
        column: [
          {
            label: "常规时间",
            prop: "normalTime",
            width: 150
          },
          {
            label: "规格",
            prop: "spec",
            width: 100
          },
          {
            label: "用量",
            prop: "dosage",
            width: 80
          },
          {
            label: "用法",
            prop: "usage",
            width: 100
          },
          {
            label: "频次",
            prop: "frequency",
            width: 80
          },
          {
            label: "申领数量",
            prop: "applyNum",
            width: 80
          },
          {
            label: "执行科室",
            prop: "executeRoom",
            width: 100
          }
        ],
        data: [
          {
            normalTime: "2019-01-01 10:11",
            spec: "10mg/支",
            dosage: "10mg",
            usage: "静脉滴注",
            frequency: "bid",
            applyNum: "2",
            executeRoom: "住院药房"
          }
        ]
      },
      cancelApplyData: {
        reason: ""
      },
      claimeTableList: []
    };
  },
  computed: {
    ...mapGetters(["receivePatientDatas"])
  },
  created() {
    this.changeDrugName({ drugName: '' });
    this.getDrugStorage(); // 获取药房列表
    this.fetchAdvList(this.receivePatientDatas);
    this.getCollapseHavingTableColumn();
  },
  methods: {
    ...mapActions({
      changeDrugName: "order/changeDrugName"
    }),
    //页数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchHistoryDrugRequestList(this.receivePatientDatas);
    },
    //页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchHistoryDrugRequestList(this.receivePatientDatas);
    },
    handleClick() {
      // tab 的切换方法
    },
    search(form) {
      // 查询方法
      this.patientsSearchForm = form;
      this.$refs.patients.search(form);
    },
    readCard() {
      // 读卡方法
    },
    getDrugStorage() {
      // 获取药房列表
      fetchDrugStorage().then(res => {
        let { code, data, msg } = res;
        if (code === 1) {
          this.drugStorage = data;
        } else {
          this.$message.warning(msg);
        }
      });
    },
    /*
      选择时间
     */
    changeDate() {
      this.getDrugStorage();
    },
    /*
     * 选择药房失去焦点 触发 药房更改
     */
    storageChange() {
      if (this.activeModule === "first") {
        this.fetchAdvList(this.receivePatientDatas);
      }
      if (this.activeModule === "second") {
        this.fetchHistoryDrugRequestList(this.receivePatientDatas);
      }
    },
    dateChange() {
      if (this.activeModule === "first") {
        this.fetchAdvList(this.receivePatientDatas);
      }
      if (this.activeModule === "second") {
        if (this.dateRange != null && this.dateRange.length > 1) {
          this.searchHavingForm.endDate = this.dateRange[1];
          this.searchHavingForm.startDate = this.dateRange[0];
        }else{
          this.searchHavingForm.endDate = '';
          this.searchHavingForm.startDate ='';
        }
        this.fetchHistoryDrugRequestList(this.receivePatientDatas);
      }
    },
    categoryCodeChange(val) {
      // 医嘱类型 改变
      // if (this.searchForm.advType.length > 1) {
      // this.searchForm.advType.shift();
      if (this.activeModule) {
        this.fetchAdvList(this.receivePatientDatas);
      }
      if (this.activeModule === "second") {
        this.fetchHistoryDrugRequestList(this.receivePatientDatas);
      }
      // }
    },
    messageHandler() {
      consle.log("工具箱消息");
    },
    handleClickTab(tab, event) {
      // 切换tab 触发事件 更新list
      this.selectedList = [];
      this.activeModule = tab.name;
      if (this.activeModule === "first") {
        this.fetchAdvList(this.receivePatientDatas);
      }
      if (this.activeModule === "second") {
        this.fetchHistoryDrugRequestList(this.receivePatientDatas);
      }
    },
    cancelApplyConfirm() {
      // 取消申领
      if (this.selectedList.length === 0) {
        this.$message.warning("请选择医嘱!");
        return;
      }
      if (this.cancelApplyData.reason === "") {
        this.$message.warning("请输入取消原因!");
        return;
      }

      this.$alert(
        `<div><p>取消申领</p><p style="color: #3D7DFB">药品已被【住院药房】发药,请先退药后再取消申领</p></div>`,
        "",
        {
          confirmButtonText: "我知道了",
          showClose: false,
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.$message({
          type: "success",
          message: "处理!"
        });
        this.changeSectionDialogVisible = false;
      });
    },
    applyDrug() {
      // 申领药品
      if (this.selectedList.length === 0) {
        this.$message.warning("请选择医嘱!");
        return;
      }
      this.isLoading = true;
      // this.ApplyDialogVisible = true;
      requestDrug({
        tId: this.selectedList.map(val => val.tId)
      })
        .then(res => {
          if (res.code == 1) {
            this.$message.success('药品申领成功')
            this.fetchAdvList(this.receivePatientDatas);

            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.$message.error(res.msg);
          }
          this.ApplyDialogVisible = false;
        })
        .catch(e => {
          this.$message.error("药品申领异常");
          this.isLoading = false;
        });
    },
    selectAll(i) {
      // 全选
      // alert(this.collapseData[i].checked)
      let data = this.collapseDataStay;
      if (data[i].checked) {
        data[i].pendingAdviceList.map(val => {
          this.$refs.singleTable[i].toggleRowSelection(val, true);
          val._itemChecked = true;
        });
      } else {
        this.$refs.singleTable[i].clearSelection();
        data[i].pendingAdviceList.map(val => {
          val._itemChecked = false;
        });
      }
      this.pushSelectedList();
    },
    selectAll1(val) {
      let data = this.collapseDataed;
      if (data[i].checked) {
        data[i].pendingAdviceList.map(val => {
          this.$refs.singleTable[i].toggleRowSelection(val, true);
          val._itemChecked = true;
        });
      } else {
        this.$refs.singleTable[i].clearSelection();
        data[i].pendingAdviceList.map(val => {
          val._itemChecked = false;
        });
      }
      this.pushSelectedList();
    },
    selectAll2(val) {
      let data = this.collapseDataAll;
      if (data[i].checked) {
        data[i].pendingAdviceList.map(val => {
          this.$refs.singleTable[i].toggleRowSelection(val, true);
          val._itemChecked = true;
        });
      } else {
        this.$refs.singleTable[i].clearSelection();
        data[i].pendingAdviceList.map(val => {
          val._itemChecked = false;
        });
      }
      this.pushSelectedList();
    },
    selectItem(list, row) {
      // 单个选中 成组
      let currentList = this.collapseDataStay;
      if (this.activeModule == "second") {
        currentList = this.collapseDataed;
      } else if (this.activeModule == "third") {
        currentList = this.collapseDataAll;
      }
      let isSelect = list.some(val => row.tId === val.tId);
      row._itemChecked = isSelect;
      this.isAllSelect();
    },
    handleChange() {},
    tableChange(list) {
      // 当table项发生变化
    },
    isAllSelect() {
      // checked
      // _itemChecked
      let currentList = this.collapseDataStay;
      if (this.activeModule == "second") {
        currentList = this.collapseDataed;
      } else if (this.activeModule == "third") {
        currentList = this.collapseDataAll;
      }
      let initial = true;
      currentList.forEach(item => {
        item.pendingAdviceList.forEach(val => {
          if (!val._itemChecked) {
            initial = false;
          }
        });
        item.checked = initial;
        initial = true;
      });
      this.pushSelectedList();
    },
    pushSelectedList() {
      // 将选中项放入list
      let list = [];
      let currentList = this.collapseDataStay;
      if (this.activeModule == "second") {
        currentList = this.collapseDataed;
      } else if (this.activeModule == "third") {
        currentList = this.collapseDataAll;
      }
      currentList.map(item => {
        if (item.checked) {
          list = [...list, ...item.pendingAdviceList];
        } else {
          item.pendingAdviceList.map(val => {
            if (val._itemChecked) {
              list = [...list, val];
            }
          });
        }
      });
      this.selectedList = list;
    },
    async fetchAdvList(patientsList) {
      // 请求数据后 增加每条数据所用字段
      this.isLoading = true;
      if (patientsList.length == 0) {
        this.isLoading = false;
        if (this.activeModule == "first") {
          this.collapseDataStay = [];
        } else if (this.activeModule == "second") {
          this.collapseDataed = [];
        } else {
          this.collapseDataAll = [];
        }
        return;
      }
      try {
        let params = {
          ...this.searchForm,
          inpCode: patientsList.map(item => item.inpCode)
        };
        let { code, data, msg } = await fetchApplyDrugList(params);
        if (code == 1) {
          data.map((item, index) => {
            item.checked = false;
            item.pendingAdviceList.map(val => {
              Object.assign(val, { _index: index, _itemChecked: false }); // 用于确认所在table
              if (item.checked) {
                this.$refs.singleTable[index].toggleRowSelection(val, true);
              }
            });
          });
          if (this.activeModule == "first") {
            this.collapseDataStay = data;
          } else if (this.activeModule == "second") {
            this.collapseDataed = data;
          } else {
            this.collapseDataAll = data;
          }
        } else {
          this.$message.error(msg);
        }
      } catch (e) {
        this.$message.error("网络错误!");
      }
      this.isLoading = false;
    },
    getCollapseHavingTableColumn() {
      let _this = this;
      this.collapseHavingTableColumn = [];
      this.collapseHavingTableColumn.push({
        prop: "patientName",
        label: "姓名",
        width: "80"
      });
      this.collapseHavingTableColumn.push({
        prop: "patientGender",
        label: "性别",
        width: "80"
      });
      this.collapseHavingTableColumn.push( {
        prop: "applyTime",
        label: "申请时间",
        width: "120"
      });
      this.collapseTableColumn.forEach(item => {
        _this.collapseHavingTableColumn.push(item);
      });
    },
    async fetchHistoryDrugRequestList(patientsList) {
      // 请求数据后 增加每条数据所用字段
      this.isLoading = true;
      if (patientsList.length == 0) {
        this.isLoading = false;
        if (this.activeModule == "first") {
          this.collapseDataStay = [];
        } else if (this.activeModule == "second") {
          this.collapseDataed = [];
        } else {
          this.collapseDataAll = [];
        }
        return;
      }
      try {
        let params = {
          ...this.searchHavingForm,
          inpCode: patientsList.map(item => item.inpCode),
          pageSize: this.pageSize,
          pageNo: this.currentPage
        };
        console.log(params);
        getHistoryDrugRequestList(params).then(res => {
          if (res.code == 1) {
            if (this.activeModule == "second") {
              this.claimeTableList = res.data;
              this.dataTotal = res.total;
            } else {
              this.collapseDataAll = res.data;
            }
          } else {
            this.$message.error(msg);
          }
        });
      } catch (e) {
        console.log(e);
        this.$message.error("网络错误!");
      }
      this.isLoading = false;
    },
    toolBoxMessage(moduleName, data) {
      if (moduleName != "PreviousPrescriptions") {
        return;
      }
    },
    rowClick(row) {
      // 更新药品字典查询条件
      this.changeDrugName({ drugName: row.name });
    }
  },
  watch: {
    receivePatientDatas: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        this.fetchAdvList(val); // 监听 患者 ID 变化 触发事件
        this.fetchHistoryDrugRequestList(val);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.color1 {
  color: $l-color-primary1;
}
.color2 {
  color: $l-color-fontcolor-2;
}
.color3 {
  color: $l-color-fontcolor-3;
}
.color6 {
  color: $l-color-border-6;
}
.color15 {
  color: $l-color-bgcolor-15;
}
.success-tip {
  font-size: 24px;
  vertical-align: middle;
}
.apply-res {
  margin-top: 3px;
  margin-right: 10px;
}
.marginTop10 {
  margin-top: 10px;
}
/deep/ .el-collapse {
  border: none;
}
.right /deep/ th .el-checkbox {
  display: none;
}
.right /deep/ .el-tabs__nav-scroll {
  padding-left: 20px;
}
.main-content {
  /deep/ th .el-checkbox {
    display: none;
  }
}
/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}
.drug {
  /deep/ .noHeader .el-dialog__header {
    display: none;
  }
}
.btn-top1 {
  bottom: 0px;
  width: 100%;
  height: 50px;
  left: 0;
  .el-button {
    border-radius: 2px;
  }
  .normal {
    color: $l-color-primary;
    border-color: $l-color-primary;
  }
}
.reason-box {
  width: calc(100% - 120px);
}
.btn-top {
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 20px;
  background-color: $l-color-white;
  border-top: 1px solid $l-color-bgcolor-11;
  .el-button {
    border-radius: 2px;
  }
  .normal {
    color: $l-color-primary;
    border-color: $l-color-primary;
  }
}
.search-box {
  .label {
    position: relative;
    top: 2px;
    margin-right: 20px;
    color: $l-color-fontcolor-4;
  }
}
</style>
