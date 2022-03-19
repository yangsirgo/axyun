<template>
  <div class="height100 containerArea">
    <!-- 左侧排版区域 -->
    <div class="schedule">
      <div class="topSearch">
        <LFormtTitle label="医生" class="searchItem">
          <el-select
            v-model="searchValue.doctorId"
            placeholder="姓名/拼音/五笔"
            @focus="selectAllUser('')"
            :remote-method="selectAllUser"
            @change="filtrateData"
            filterable
            remote
            reserve-keyword
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </LFormtTitle>
        <l-formt-title label="专科" class="searchItem">
          <el-select
            filterable
            clearable
            v-model="searchValue.deptId"
            @change="deptIdChange"
          >
            <el-option
              v-for="item in deptIdOptions"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            ></el-option>
          </el-select>
        </l-formt-title>
        <el-button type="primary" @click="refresh">刷新</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="setAppointment">挂号</el-button>
      </div>
      <div style="flex: 1">
        <el-table
          ref="treeTable"
          :data="treeData"
          height="100%"
          v-loading="loading1"
          row-key="scheduleId"
          border
          :tree-props="{
            children: 'apptAndScheduleVOS',
            hasChildren: 'hasChildren',
          }"
          @row-click="rowClick1"
          :row-class-name="heightMethod"
          highlight-current-row
        >
          <el-table-column
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'ouptDeptName'">
                <span
                  :class="{ toLeft: scope.row.apptAndScheduleVOS.length }"
                  v-if="scope.row['level'] === '1'"
                  >{{ scope.row["ouptDeptName"] }}</span
                >
              </template>
              <template v-else-if="item.prop === 'recordStatus'">
                <!-- 状态 -->
                <!-- <span :val="scope.row[item.prop]" code="APPT_STATUS" v-codeTransform></span> -->
                <span v-if="scope.row[item.prop] == '1'">发布</span>
                <span v-else-if="scope.row[item.prop] == '2'">暂存</span>
                <span v-else-if="scope.row[item.prop] == '5'">停诊</span>
                <span v-else-if="scope.row[item.prop] == '3'">驳回</span>
                <span v-else-if="scope.row[item.prop] == '4'">审核</span>
              </template>
              <template v-else-if="item.prop === 'scheduleType'">
                <!-- 类型 -->
                <span v-if="scope.row[item.prop] === '1'">医生</span>
                <span v-else-if="scope.row[item.prop] === '2'">科室</span>
                <span v-else></span>
              </template>
              <template v-else-if="item.prop === 'isOnline'">
                <template v-if="scope.row[item.prop] !== undefined">
                  <el-checkbox
                    v-model="scope.row[item.prop]"
                    true-label="1"
                    false-label="2"
                    disabled
                  ></el-checkbox>
                </template>
              </template>
              <template v-else-if="item.prop === 'dutyStartDate'">
                <span v-if="scope.row.dutyStartTime.length">{{
                  scope.row.dutyStartTime.substring(0, 10)
                }}</span>
                <!-- 日期 -->
              </template>
              <template v-else-if="item.prop === 'dutyStartTime'">
                <span v-if="scope.row[item.prop].length">{{
                  scope.row[item.prop].substring(11, 19)
                }}</span>
                <!-- 日期 -->
              </template>
              <template v-else-if="item.prop === 'dutyStopTime'">
                <span v-if="scope.row[item.prop].length">{{
                  scope.row[item.prop].substring(11, 19)
                }}</span>
                <!-- 日期 -->
              </template>
              <template v-else-if="item.prop === 'week'">
                <span v-if="scope.row['dutyStartTime'].length >= 11">{{
                  getWeek(scope.row["dutyStartTime"].substring(0, 10))
                }}</span>
              </template>
              <template v-else-if="item.prop == 'sdeptLimitNum'">
                <span v-if="scope.row.level === '1'">{{
                  scope.row[item.prop]
                }}</span>
                <span v-else></span>
              </template>
              <template v-else-if="item.prop == 'sdeptLimitNumUsed'">
                <span v-if="scope.row.level === '1'">{{
                  scope.row[item.prop]
                }}</span>
                <span v-else></span>
              </template>
              <template v-else-if="item.prop == 'apptLimitNum'">
                <span v-if="scope.row.level === '1'">{{
                  scope.row[item.prop]
                }}</span>
                <span v-else></span>
              </template>
              <template v-else-if="item.prop == 'apptLimitNumUsed'">
                <span v-if="scope.row.level === '1'">{{
                  scope.row[item.prop]
                }}</span>
                <span v-else></span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 右侧挂号区域 -->
    <div class="registration">
      <div
        class="topSearch"
        style="display: flex; justify-content: flex-end; margin-bottom: 10px"
      >
        <!-- <el-button
          type="primary"
          @click="appointChangeTriage"
          >换诊</el-button
        > -->
        <el-button
          type="primary"
          @click="rowClick1(singleCurrentRow, '1')"
          >刷新</el-button
        >
        <el-button
          :disabled="multiCurrentRow.regStatus === '1'|| multiCurrentRow.regStatus === '3'"
          type="primary"
          @click="toPay"
          >补缴</el-button
        >
        <el-button
          :disabled="
            multiCurrentRow.recordStatus !== '1' &&
            multiCurrentRow.recordStatus !== '2' &&
            multiCurrentRow.recordStatus !== '3' &&
            multiCurrentRow.recordStatus !== '6'
          "
          @click="toAppointTriage"
          >分诊</el-button
        >
        <el-button
          :disabled="
            (multiCurrentRow.recordStatus !== '1' &&
              multiCurrentRow.recordStatus !== '2' &&
              multiCurrentRow.recordStatus !== '3' &&
              multiCurrentRow.recordStatus !== '6') ||
            singleCurrentRow.level == '1'
          "
          @click="cancelAppointTriage"
          >取消分诊医生</el-button
        >
      </div>
      <div style="flex: 1">
        <el-table
          ref="multiTable"
          :data="multiData"
          width="100%"
          height="100%"
          border
          stripe
          highlight-current-row
          @row-click="rowClick2"
          v-loading="loading2"
        >
          <el-table-column type="index" align="center" width="50" label="序号">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in multiParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'patientName'">
                <span :class="{ nameColor: !scope.row['patientId'] }">{{
                  scope.row[item.prop]
                }}</span>
              </template>
              <template v-else-if="item.prop == 'appointmentTime'">
                <span
                  v-if="scope.row[item.prop]"
                  :class="{
                    cGray:
                      new Date().getTime() >
                      new Date(scope.row[item.prop]).getTime(),
                  }"
                  >{{ scope.row[item.prop].split(" ")[1] }}</span
                >
                <span
                  v-else
                  :class="{
                    cGray:
                      new Date().getTime() >
                      new Date(scope.row[item.prop]).getTime(),
                  }"
                  >{{ "加号" }}</span
                >
              </template>
              <template v-else-if="item.prop == 'recordStatus'">
                <span
                  :val="scope.row[item.prop]"
                  code="APPT_STATUS"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'regStatus'">
                <span v-if="scope.row[item.prop] == 0">未收费</span>
                <span v-else-if="scope.row[item.prop] == 1">收费</span>
                <span v-else-if="scope.row[item.prop] == 2">退费</span>
                <span v-else-if="scope.row[item.prop] == 3">免收</span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 点击挂号按钮提示 -->
    <el-dialog
      title="是否收取挂号费？"
      :visible.sync="registerVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="dialogContent isFreeCheckedContent">
        <el-checkbox
          v-model="isFreeChecked"
          style="margin-right: 32px"
          size="small"
          @change="isFreeCheckedChange"
          >免收</el-checkbox
        >
        <l-value-domain
          :disabled="!isFreeChecked"
          style="width: 260px; margin-right: 3px"
          code="FreeRecipeReason"
          :value.sync="freeReason"
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="registerCancel">免 收</el-button> -->
        <el-button type="primary" @click="registerSure">{{
          isFreeChecked ? "确 定" : "收 取"
        }}</el-button>
      </span>
    </el-dialog>
    <!-- 结算确认弹窗 -->
    <LChargeConfirm
      :charge="newLchrage"
      v-if="chargeConfirmVisible"
      v-show="chargeConfirmVisibleMs"
      :isApptointment="true"
      title="结算详情确认"
      width="1300px"
      :visible.sync="chargeConfirmVisible"
      @cancel="chargeConfirmClose"
      @sure="chargeConfirmSure"
    ></LChargeConfirm>
    <!-- 收费弹窗 -->
    <el-dialog
      title="收费"
      v-if="payDialogVisible"
      :visible.sync="payDialogVisible"
      v-show="payDialogVisibleMs"
      width="1300px"
      top="5vh"
      @close="closeDialog"
      :close-on-click-modal="false"
      class="l-charge-dialog"
    >
      <l-charge
        :charge="newLchrage"
        :notMs="payDialogVisibleMs"
        :isApptointment="true"
        @close="close"
      ></l-charge>
    </el-dialog>
    <l-dialog
      :visible.sync="hzVisible"
      title="换诊"
      width="1050px"
      @confirm="saveHz"
      @cancel="cancelHz"
      @close="closeHz"
    >
      <template slot="content">
        <div style="padding: 8px" class="thirdTable">
          <el-table
            ref="thirdTable"
            :data="thirdTable"
            width="100%"
            height="200px"
            border
            stripe
            highlight-current-row
            @row-click="rowClick3"
          >
            <el-table-column
              v-for="(item, index) in thirdColumns"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'scheduleType'">
                  <span v-if="scope.row[item.prop] === '1'">医生</span>
                  <span v-else-if="scope.row[item.prop] === '2'">科室</span>
                  <span v-else></span>
                </template>
                <template v-else-if="item.prop === 'dutyStartTime'">
                  <span v-if="scope.row[item.prop].length">{{
                    scope.row[item.prop].substring(11, 19)
                  }}</span>
                </template>
                <template v-else-if="item.prop === 'dutyStopTime'">
                  <span v-if="scope.row[item.prop].length">{{
                    scope.row[item.prop].substring(11, 19)
                  }}</span>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </l-dialog>
  </div>
</template>

<script>
import service from "@/api/appointment/appointment";
import appointmentOrder from "@/api/appointmentNew/appointmentOrder.js";
import outpatientAppointment from "@/api/appointmentNew/outpatientAppointment.js";

import { canBeUseDoctorAndNurseList2 } from "@/api/ipnw/etHospital.js";
import { getPamars } from "@/utils/auth";
import scheManagement from "@/api/schedule/scheduleManagement.js";
import { mapGetters } from "vuex";
import { getThirdUrl } from "@/api/third/third";
import { deepClone } from "@/utils";

export default {
  props: {
    patientInfo: Object
  },
  data() {
    return {
      isFreeChecked: false,
      // 结算确认弹窗
      chargeConfirmVisible: false,
      chargeConfirmVisibleMs: true,
      freeReason: "",
      payDialogVisible: false,
      payDialogVisibleMs: true,
      searchValue: {
        deptId: "",
        doctorId: ""
      },
      deptIdOptions: [],
      options: [],
      loading1: false,
      loading2: false,
      singleCurrentRow: {}, //当前选中排班
      multiData: [], //挂号记录数组
      multiCurrentRow: {}, //当前选中挂号记录
      columns: [
        {
          prop: "ouptDeptName",
          label: "专科",
          width: "105",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "scheduleType",
          label: "类型",
          width: "50",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "doctorName",
          label: "医生姓名",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "diagTreatTypeName",
          label: "诊疗类型",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "className",
          label: "班次",
          width: "50",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "roomName",
          label: "诊室",
          width: "90",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "dutyStartTime",
          label: "开始时间",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "dutyStopTime",
          label: "结束时间",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "sdeptLimitNum",
          label: "挂号号源",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "sdeptLimitNumUsed",
          label: "已挂号",
          width: "62",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "apptLimitNum",
          label: "预约号源",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "apptLimitNumUsed",
          label: "已预约",
          width: "63",
          align: "center",
          headerAlign: "center",
          fixed: false
        }
      ],
      // 挂号记录列参数
      multiParams: [
        {
          prop: "recordStatus",
          label: "状态",
          width: "50",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "patientName",
          label: "患者姓名",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "doctorName",
          label: "接诊医生",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "regStatus",
          label: "缴费状态",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "channelName",
          label: "来源",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "phoneNum",
          label: "联系方式",
          width: "110",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "recordRemark",
          label: "备注",
          width: "60",
          align: "center",
          headerAlign: "center",
          fixed: false
        }
      ],
      registerVisible: false, //免收弹窗
      newLchrage: {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      },
      initData: [], //初始排班数据
      treeData: [], //筛选过后的排班数据
      hosId: "",
      hzVisible: false, //换诊弹框
      thirdColumns: [
        {
          prop: "doctorName",
          label: "医生姓名",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "diagTreatTypeName",
          label: "诊疗类型",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "className",
          label: "班次",
          width: "50",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "dutyStartTime",
          label: "开始时间",
          width: "90",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "dutyStopTime",
          label: "结束时间",
          width: "90",
          align: "center",
          headerAlign: "center",
          fixed: false
        }
      ],
      thirdTable: [], //换诊的表格数据
      thirdCurrentRow: {}, //换诊的当前排班数据
      urls: ""
    };
  },
  computed: {
    ...mapGetters("cis", ["publicHealthData"])
  },
  async mounted() {
    let res = await getThirdUrl();
    this.urls = res.data;
    this.hosId = JSON.parse(getPamars()).hosId;
    this.selectAllDept();
    // this.selectAllUser();
    this.refresh();
  },
  methods: {
    // 初始化 收取挂号费 弹窗
    initRegisterVisible() {
      this.isFreeChecked = false;
      this.freeReason = "";
    },
    isFreeCheckedChange() {
      // debugger
      if (!this.isFreeChecked) {
        this.freeReason = "";
        return;
      }
      this.freeReason = "5";
    },
    async refresh() {
      this.singleCurrentRow = {};
      // 查询排班数据
      await this.getDeptAndNum();
      // 根据当前搜索条件筛选排班数据
      this.filtrateData();
    },
    reset() {
      this.searchValue = {
        deptId: "",
        doctorId: ""
      };
      this.refresh();
    },
    //根据专科和医生姓名筛选数据
    filtrateData() {
      this.multiData = [];
      this.multiCurrentRow = {};
      let initData = JSON.parse(JSON.stringify(this.initData));
      let arr = [];
      if (this.searchValue.deptId == "" && this.searchValue.doctorId == "") {
        this.treeData = initData;
        return;
      }
      //先根据专科id匹配
      if (this.searchValue.deptId != "") {
        for (let i in initData) {
          if (initData[i].ouptDeptId == this.searchValue.deptId) {
            arr.push(initData[i]);
          }
        }
      } else {
        arr = initData;
      }
      //再根据医生id匹配
      if (this.searchValue.doctorId != "") {
        if (arr.length) {
          let arrDoc = [];
          for (let i in arr) {
            if (
              arr[i].scheduleType == "1" &&
              arr[i].doctorId == this.searchValue.doctorId
            ) {
              // 一级排班是医生排班的情况,把所有匹配的医生排班都push到arrDoc
              arrDoc.push(arr[i]);
            } else {
              // 一级排班是科室排班的情况,
              if (arr[i].scheduleType == "2") {
                //子排班里存在和当前医生id相等的项放入到arrDoc数组中。
                for (let j in arr[i].apptAndScheduleVOS) {
                  if (
                    arr[i].apptAndScheduleVOS[j].doctorId ==
                    this.searchValue.doctorId
                  ) {
                    arr[i].apptAndScheduleVOS = arr[
                      i
                    ].apptAndScheduleVOS.filter(
                      ele => ele.doctorId == this.searchValue.doctorId
                    );
                    arrDoc.push(arr[i]);
                    break;
                  }
                }
              }
            }
          }
          this.treeData = arrDoc;
        } else {
          this.treeData = [];
        }
      } else {
        this.treeData = arr;
      }
    },
    async selectAllDept(val) {
      try {
        let res = await scheManagement.queryDept({
          deptName: ""
        });
        this.deptIdOptions = res.data;
        // this.searchValue.deptId = res.data.length?res.data[0].deptId:'';
      } catch (error) {
        this.$message.error(error.msg || "查询科室失败");
      }
    },
    // // 查询用户
    // async selectAllUser(val) {
    //   try {
    //     let res = await canBeUseDoctorAndNurseList({
    //       hosId: this.hosId,
    //       utype: "1",
    //     });
    //     this.options = res.data;
    //   } catch (error) {
    //     this.$message.error(error.msg || "搜索用户失败");
    //   }
    // },
    // 查询用户
    async selectAllUser(val) {
      try {
        let res = await canBeUseDoctorAndNurseList2({
          // hosId:this.hosId,
          workType: "1",
          userSearchValue: val || ""
        });
        this.options = res.data;
      } catch (error) {
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    // setUseUserInfo(row) {
    //   this.searchValue.doctorName = "";
    //   this.searchValue.doctorId = "";
    //   if (row) {
    //     this.options.forEach((val) => {
    //       if (val.id == row) {
    //         this.searchValue.doctorName = val.name;
    //         this.searchValue.doctorId = val.id;
    //       }
    //     });
    //   }
    //   this.filtrateData();
    // },
    // 专科的指改变
    deptIdChange() {
      this.singleCurrentRow = {};
      this.filtrateData();
    },
    // 3.挂号
    setAppointment() {
      if (!this.singleCurrentRow.scheduleId) {
        this.$message.error("请先选择一条排班记录");
        return;
      }
      if (!this.patientInfo.patientId) {
        this.$message.error("请先选择患者");
        return;
      }
      this.registerConfirmOne();
    },
    // 查询挂号信息
    async getDeptAndNum() {
      try {
        // 清空排班数组
        this.initData = [];
        this.treeData = [];
        // this.singleCurrentRow = {};//清空当前你选中的排班
        this.multiData = []; //清空预约记录数组
        this.multiCurrentRow = {}; //清空当前选中预约记录
        let params = {
          startDate: new Date().format("yyyy-MM-dd") + " 00:00:00",
          stopDate: new Date().format("yyyy-MM-dd") + " 23:59:59"
          // startDate: "2020-10-19 00:00:00",
          // stopDate: "2020-10-19 23:59:59",
          // deptId: this.searchValue.deptId,
          // doctorId: this.searchValue.doctorId,
        };
        this.loading1 = true;
        let res = await appointmentOrder.getDeptAndNum(params);
        if (res.code == 1) {
          if (res.data.length) {
            this.initData = res.data;
            for (let i in this.initData) {
              this.initData[i].level = "1";
            }
            // 根据当前搜索条件筛选排班数据
            await this.filtrateData();
            // 如果当前选中排班有值且存在于当前treeData里的话，自动根据singleCurrentRow查询挂号记录
            // this.$refs.treeTable.setCurrentRow(this.singleCurrentRow);
            let b = await this.isInTreeData(this.singleCurrentRow.scheduleId);
            if (b) {
              this.singleCurrentRow = b;
            }
            if (this.singleCurrentRow.scheduleId && b) {
              // this.getApptByScheduleId(this.singleCurrentRow.scheduleId);
              await this.rowClick1(this.singleCurrentRow, "1");
              this.refs.treeTable.setCurrentRow(this.singleCurrentRow);
            }
          } else {
            this.$message("未查询到门诊部门号源信息");
          }
          this.loading1 = false;
        }
      } catch (error) {
        this.loading1 = false;
        this.$message.error(error.msg);
      }
    },
    rowClick1(row, flag) {
      // flag代表是否相同的排班需要重新请求挂号记录
      let cutRow = this.singleCurrentRow;
      if (
        ((cutRow.hasOwnProperty("scheduleId") &&
          (cutRow.scheduleId == row.scheduleId ||
            cutRow.scheduleId == row.superScheduleId)) ||
          (cutRow.hasOwnProperty("superScheduleId") &&
            (cutRow.superScheduleId == row.scheduleId ||
              cutRow.superScheduleId == row.superScheduleId))) &&
        flag !== "1"
      ) {
        this.singleCurrentRow = row;
        return;
      }
      this.singleCurrentRow = row;
      if (row.level == "1") {
        // 点击父排班
        let scheduleId = row.scheduleId;
        this.getApptByScheduleId(scheduleId); //请求预约列表
      } else if (row.level == undefined) {
        //点击子排班
        for (let i in this.treeData) {
          for (let j in this.treeData[i].apptAndScheduleVOS) {
            if (
              this.treeData[i].apptAndScheduleVOS[j].scheduleId ===
              row.scheduleId
            ) {
              let scheduleId = this.treeData[i].scheduleId;
              this.getApptByScheduleId(scheduleId); //请求预约列表
            }
          }
        }
      }
    },
    rowClick2(row) {
      this.multiCurrentRow = row;
    },
    async getApptByScheduleId(scheduleId) {
      if (!scheduleId) {
        return;
      }
      this.multiData = []; //清空预约记录数组
      this.multiCurrentRow = {}; //清空当前选中预约记录
      try {
        this.loading2 = true;
        let res = await outpatientAppointment.getApptByScheduleId({
          scheduleSerialId: scheduleId
        });
        if (res.code === 1) {
          this.multiData = res.data;
        } else {
          this.$message.error(res.msg);
        }
        this.loading2 = false;
      } catch (error) {
        this.loading2 = false;
        this.$message.error(error.msg);
      }
    },
    //挂号接口
    async registerConfirmOne() {
      try {
        this.$showLoading();
        let res = await outpatientAppointment.createAppt({
          scheduleId: this.singleCurrentRow.scheduleId, //排班ID
          appointmentId: "", //预约ID
          patientId: this.patientInfo.patientId, //患者ID
          channel: 1, //预约渠道
          appointType: "1", //预约类型0：预约 1：挂号  (此页面可预约可挂号不区分)
          isAutoAppendNum: false //是否自动加号(true;false布尔类型)
        });
        if (res.code == 1) {
          this.$message.success("挂号成功");
          this.getDeptAndNum();
          // 弹出是否面收费
          // this.freeReason = ""; //重置免费原因
          this.initRegisterVisible();
          this.registerVisible = true;
          //准备收费数据
          this.newLchrage.appointment = res.data;
          //获取收费明细
          let ChargeRegDetail = this.getChargeRegDetail();
          // 待收费对象转换
          this.changeObj(ChargeRegDetail);
        } else {
          this.$message.success(res.msg || "挂号失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    handleClose() {
      this.registerVisible = false;
    },
    async registerCancel() {
      if (!this.freeReason) {
        this.$message.error("请选择免收原因");
        return;
      }
      this.newLchrage.haveMoney = 0;
      this.newLchrage.freeCode = this.freeReason;
      this.registerVisible = false;
      //显示确认收费框
      this.chargeConfirmVisible = true;
      this.chargeConfirmVisibleMs = false;
    },
    async registerSure() {
      this.chargeConfirmVisibleMs = true;
      // 判断是否免收
      if (this.isFreeChecked) {
        this.registerCancel();
        return;
      }
      //不免收
      this.newLchrage.haveMoney = 1;
      this.newLchrage.freeCode = "";
      this.registerVisible = false;
      //显示确认收费框
      this.chargeConfirmVisible = true;
      this.chargeConfirmVisibleMs = true;
    },
    close(data) {
      if (data.refresh) {
        this.payDialogVisible = false;
        if (
          this.newLchrage.appointment.recordStatus == "1" ||
          this.newLchrage.appointment.recordStatus == "2" ||
          this.newLchrage.appointment.recordStatus == "3" ||
          this.newLchrage.appointment.recordStatus == "6"
        ) {
          this.appointTriage(this.newLchrage.appointment.appointmentId);
        } else {
          this.getDeptAndNum(); //请求排班列表
        }
        this.newLchrage = {
          appointment: {}, // 预约明细
          chargePrescriptions: [], // 待收费明细，
          accountInfo: {} // 账户数据
        };
        // 刷新左侧列表
        this.$emit("updatePatientList");
        this.recordPerfection();
      } else {
        this.closeDialog();
      }
    },
    async appointTriage(appointmentId) {
      try {
        // this.getDeptAndNum(); //请求排班列表
        this.$showLoading();

        let res = await outpatientAppointment.appointTriage({
          appointmentId,
          scheduleId:
            this.singleCurrentRow.level == "1"
              ? ""
              : this.singleCurrentRow.scheduleId
        });
        await this.getDeptAndNum(); //请求排班列表
        this.$hideLoading();
        this.$message.success(res.msg);
      } catch (error) {
        this.$hideLoading();
        // this.$message.error(error.msg);
      }
    },
    async getChargeRegDetail() {
      let { data } = await service.getChargeRegDetail({
        birthDate: "",
        regDiagTreatType: this.singleCurrentRow.diagTreatType,
        regWorkCode: this.singleCurrentRow.workCode
      });
      return data;
    },
    // 对象转换
    changeObj(ChargeRegDetail) {
      let chargePrescriptions = [];
      for (let i = 0; i < ChargeRegDetail.length; i++) {
        let item = ChargeRegDetail[i];
        let obj = {
          orderName: item.chargeItemName,
          dosageUnit: item.chargeUnit,
          quantity: "1",
          price: item.chargePrice,
          orderItemId: item.chargeItemId,
          orderItemCat: item.statisticsCode,
          prescriptionSource: "9",
          num: "1",
          visitId: this.multiCurrentRow.appointmentId,
          ouptDeptId: this.multiCurrentRow.ouptDeptId, // 专科id
          groupId: item.groupNo, // 组号
          groupNo: item.groupNo
        };
        chargePrescriptions.push(obj);
      }
      this.newLchrage.chargePrescriptions = chargePrescriptions;
    },
    closeDialog() {
      this.payDialogVisible = false;
      this.getDeptAndNum(); //请求排班列表
    },
    toPay() {
      if (!this.multiCurrentRow.appointmentId) {
        this.$message.error("请先选择挂号记录");
        return;
      }
      this.newLchrage.appointment = this.multiCurrentRow;
      //获取收费明细
      let ChargeRegDetail = this.getChargeRegDetail();
      // 待收费对象转换
      this.changeObj(ChargeRegDetail);
      // 弹出是否收费
      // this.freeReason = ""; //重置免费原因
      this.initRegisterVisible();
      this.registerVisible = true;
    },
    toAppointTriage() {
      if (!this.multiCurrentRow.appointmentId) {
        this.$message.error("请先选择挂号记录");
        return;
      }
      //如果状态为2，等待，那么走换诊流程
      if (this.multiCurrentRow.recordStatus == "2") {
        this.appointChangeTriage();
      } else {
        this.appointTriage(this.multiCurrentRow.appointmentId);
      }
    },
    // 判断当前id是否存在于当前treeData中
    isInTreeData(scheduleId) {
      for (let i in this.treeData) {
        if (this.treeData[i].scheduleId === scheduleId) {
          return this.treeData[i];
        }
        for (let j in this.treeData[i].apptAndScheduleVOS) {
          if (
            this.treeData[i].apptAndScheduleVOS[j].scheduleId === scheduleId
          ) {
            return this.treeData[i].apptAndScheduleVOS[j];
          }
          if (
            i == this.treeData.length - 1 &&
            j == this.treeData[i].apptAndScheduleVOS[j].length - 1
          ) {
            return false;
          }
        }
      }
    },
    heightMethod({ row, rowIndex }) {
      if (row.scheduleId === this.singleCurrentRow.scheduleId) {
        return "heightClass";
      }
      return "";
    },
    //zhengyawen 在挂号完成之后弹框询问，判断该患者档案完成度是否为0，跳转公卫建档界面
    recordPerfection() {
      let recordPerfection = this.publicHealthData.recordPerfection;
      if (!recordPerfection && this.publicHealthData.identificationNum) {
        this.$confirm("患者还未建立居民健康档案，是否马上去建档？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          window.open(
            this.urls +
              "?type=archives&identificationNum=" +
              this.publicHealthData.identificationNum +
              "&identificationType=" +
              this.publicHealthData.identificationType
          );
        });
      }
    },
    //zhengyawen 换诊
    async rowClick3(row) {
      this.thirdCurrentRow = row;
    },
    appointChangeTriage() {
      if (!this.multiCurrentRow.appointmentId) {
        this.$message.warning("请选择一个挂号记录！");
        return;
      }
      //选择科室排班的挂号记录
      if (this.singleCurrentRow.level == "1") {
        if (
          !this.singleCurrentRow.hasOwnProperty("apptAndScheduleVOS") ||
          !this.singleCurrentRow.apptAndScheduleVOS.length
        ) {
          this.$message.warning("本排班不支持换诊！");
          return;
        }
        //整理本科室排班下所有的医生排班
        this.thirdTable = deepClone(this.singleCurrentRow.apptAndScheduleVOS);
      } else if (this.singleCurrentRow.hasOwnProperty("superScheduleId")) {
        for (let i in this.treeData) {
          let item = this.treeData[i];
          if (item.scheduleId == this.singleCurrentRow.superScheduleId) {
            this.thirdTable = deepClone(item.apptAndScheduleVOS);
          }
        }
      }

      this.hzVisible = true;
    },
    async cancelAppointTriage() {
      if (!this.multiCurrentRow.appointmentId) {
        this.$message.warning("请选择一个挂号记录！");
        return;
      }
      try {
        let res = await service.cancelChildAppt({
          appointmentId: this.multiCurrentRow.appointmentId
        });
        if (res.code == 1) {
          this.$message.success("取消成功");
          this.getDeptAndNum();
        } else {
          this.$message.error(res.msg || "操作失败");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async saveHz() {
      if (!this.thirdCurrentRow.scheduleId) {
        this.$message.error("请选择要换诊到的排班记录");
        return false;
      }
      let scheduleId =
        this.singleCurrentRow.superScheduleId ||
        this.singleCurrentRow.scheduleId;
      try {
        let res = await outpatientAppointment.appointTriage({
          appointmentId: this.multiCurrentRow.appointmentId,
          newScheduleId: this.thirdCurrentRow.scheduleId,
          scheduleId:
            this.singleCurrentRow.level == "1"
              ? ""
              : this.singleCurrentRow.scheduleId
        });
        if (res.code === 1) {
          await this.getApptByScheduleId(scheduleId);
          this.$message.success("换诊成功");
          this.hzVisible = false;
        } else {
          this.$message.error(res.msg || "换诊失败");
        }
      } catch (error) {
        this.hzVisible = false;
      }
    },
    cancelHz() {
      this.hzVisible = false;
    },
    closeHz() {
      this.thirdTable = [];
      this.thirdCurrentRow = {};
    },
    chargeConfirmClose() {
      this.chargeConfirmVisible = false;
    },
    chargeConfirmSure(data) {
      this.newLchrage.confirmInfo = data;
      this.chargeConfirmVisible = false;
      this.$nextTick(() => {
        if (this.newLchrage.haveMoney == 1) {
          this.payDialogVisibleMs = true; //是否在页面上显示收费框
        } else {
          this.payDialogVisibleMs = false; //是否在页面上显示收费框
        }
        this.payDialogVisible = true; //收费框走流程
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.containerArea {
  display: flex;
  padding: 16px;

  .topSearch {
    margin-bottom: 8px;
    .searchItem {
      width: 200px;
      margin-right: 8px;
    }
  }

  .schedule {
    width: 61%;
    display: flex;
    flex-direction: column;
    padding-right: 8px;
  }

  .registration {
    width: 39%;
    display: flex;
    flex-direction: column;
  }
  .dialogContent.isFreeCheckedContent {
    height: auto;
    padding: 24px;
    display: flex;
    align-items: center;
  }
  >>> .el-table__expand-icon {
    right: 15px;
  }
  .toLeft {
    position: relative;
    right: 22px;
  }
  >>> .heightClass {
    background: #cad0e0;
  }
  .thirdTable {
    >>> .el-table__body-wrapper {
      overflow: auto;
    }
  }
}
.l-charge-dialog{
  >>> .el-dialog {
    height: 90%;
  }

  >>> .el-dialog__body {
    height: calc(100% - 54px);
  }
}
</style>
