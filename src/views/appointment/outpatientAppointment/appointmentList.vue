<template>
  <el-card class="appointmentList height100">
    <div class="nav-bar">
      <div class="nav-bar-cont">
        <el-row :gutter="10" class="margin-bottom-10">
          <el-col :span="4">
            <l-formt-title label="日期">
              <el-date-picker
                v-model="searchValue.date"
                :clearable="false"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </l-formt-title>
          </el-col>
          <el-col :span="3">
            <l-formt-title label="预约状态">
              <l-value-domain
                clearable
                code="APPT_STATUS"
                :value.sync="searchValue.recordStatus"
                placeholder="预约状态"
              ></l-value-domain>
            </l-formt-title>
          </el-col>
          <el-col :span="3">
            <l-formt-title label="预约渠道">
              <l-value-domain
                clearable
                remoteUrl="/appointment/numPercentageDict/selectNumPercentageDict"
                :value.sync="searchValue.appointmentMode"
                remoteShowKey="channelName"
                remoteValueKey="channelCode"
                placeholder="预约渠道"
              ></l-value-domain>
            </l-formt-title>
          </el-col>
          <el-col :span="3">
            <l-formt-title label="医生姓名">
              <el-select
                v-model="searchValue.doctorId"
                filterable
                remote
                reserve-keyword
                placeholder="姓名/拼音/五笔"
                @focus="selectAllUser('')"
                :remote-method="selectAllUser"
                :loading="selLoading"
                @change="setUseUserInfo"
                clearable
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="2">
            <l-formt-title label="患者姓名">
              <el-input
                v-model="searchValue.patientName"
                placeholder="患者姓名"
                clearable
              ></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="2">
            <l-formt-title label="患者编号">
              <el-input
                v-model="searchValue.patientCode"
                placeholder="患者编号"
                clearable
              ></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="7">
            <!-- <l-formt-title label="卡号">
              <el-input
                v-model="searchValue.cardNum"
                placeholder="卡号"
                clearable
              ></el-input>
            </l-formt-title> -->
            <el-col :span="16"><l-read-card @readCard="readCard" class="margin-left-10"></l-read-card></el-col>
            <el-col :span="8">
              <el-button type="primary" @click="search" class="float-right">查询</el-button>
              <el-button type="primary" @click="reset" class="float-right" style="margin-right:10px">重置</el-button>
            </el-col>
          </el-col>
          <!-- <el-col :span="3">
            <el-button type="primary" @click="readCard">读卡</el-button>
            <el-button type="primary" @click="search" class="float-right"
              >查询</el-button
            >
          </el-col> -->
        </el-row>
      </div>
    </div>
    <div class="table-cont">
      <el-row :gutter="10" style="margin-bottom:8px;">
        <el-col :span="12">
          <div class="float-left"><h2 style="margin:0;">预约列表</h2></div>
        </el-col>
        <el-col :span="12">
          <div class="float-right">
            <el-button
              type="primary"
              plain
              class="plain-btn"
              :disabled="
                !(
                  ((currentRegisteredData.regStatus == '0' || currentRegisteredData.regStatus == '1' || currentRegisteredData.regStatus == '3') &&
                    (currentRegisteredData.recordStatus == 1 ||
                      currentRegisteredData.recordStatus == 2 ||
                      currentRegisteredData.recordStatus == 3 ||
                      currentRegisteredData.recordStatus == 4 ||
                      currentRegisteredData.recordStatus == 5 ||
                      currentRegisteredData.recordStatus == 6)) ||
                  (currentRegisteredData.regStatus == '1' &&
                    currentRegisteredData.recordStatus == 9)
                )
              "
              @click="appointCancelClick"
              >退号</el-button
            >
            <el-button
              type="primary"
              plain
              class="plain-btn"
              :disabled="
                !(
                  currentRegisteredData.regStatus == '0' &&
                  (currentRegisteredData.recordStatus == 1 ||
                    currentRegisteredData.recordStatus == 2 ||
                    currentRegisteredData.recordStatus == 3 ||
                    currentRegisteredData.recordStatus == 4 ||
                    currentRegisteredData.recordStatus == 5 ||
                    currentRegisteredData.recordStatus == 6 ||
                    currentRegisteredData.recordStatus == 10)
                )
              "
              @click="payClick"
              >缴费</el-button
            >
            <!-- <el-button
              type="primary"
              plain
              class="plain-btn"
              :disabled="
                !(
                  currentRegisteredData.regStatus == '1' &&
                  (currentRegisteredData.recordStatus == 1 ||
                    currentRegisteredData.recordStatus == 6)
                )
              "
              @click="appointTriageClick"
              >分诊</el-button
            > -->
            <!-- <el-button
              type="primary"
              plain
              class="plain-btn"
              :disabled="
                !currentRegisteredData ||
                currentRegisteredData.recordStatus == '9'
              "
              @click="printClick"
              >挂号单打印</el-button
            > -->
          </div>
        </el-col>
      </el-row>

      <!-- <l-tables
        :total="pageParams.total"
        :pageSize.sync="pageParams.pageSize"
        :page.sync="pageParams.pageNo"
        :layout="layout"
        :pagerCount="5"
        paginationAlign="center"
        :singlePageShow="true"
        @changeSize="changeSize"
      >
      <template slot="table-body">-->
      <el-table
        ref="singelTable"
        :data="registeredData"
        width="100%"
        height="calc(100% - 48px)"
        border
        stripe
        highlight-current-row
        @row-click="rowClick"
        v-loading="loading"
      >
        <el-table-column
          v-for="(item, index) in RegisteredListParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'center'"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.prop == 'ouptDeptId'">
              <span
                tableName="sys_org"
                :conditionMap="{ org_type: '_DEPT_', id: scope.row[item.prop] }"
                columns="org_nm"
                v-tableTransform
              ></span>
            </template>
            <template v-else-if="item.prop == 'apptDept'">
              <span
                tableName="appt_dict_value"
                :conditionMap="{
                  dict_item_code: 'A0003',
                  dict_code: scope.row[item.prop],
                }"
                columns="dict_name"
                v-tableTransform
              ></span>
            </template>
            <template v-else-if="item.prop == 'birthDate'">{{
              scope.row[item.prop] ? scope.row[item.prop].substring(0, 10) : ""
            }}</template>
            <template v-else-if="item.prop == 'patientGender'">
              <span
                :val="scope.row[item.prop]"
                code="GENDER_CODE"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.prop == 'regStatus'">
              <span v-if="scope.row[item.prop] == '0'">未收费</span>
              <span v-if="scope.row[item.prop] == '1'">已收费</span>
              <span v-if="scope.row[item.prop] == '2'">已退费</span>
              <span v-if="scope.row[item.prop] == '3'">免收费</span>
            </template>
            <template v-else-if="item.prop == 'recordStatus'">
              <span
                :val="scope.row[item.prop]"
                code="APPT_STATUS"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.prop == 'regMoney'">
              <span v-if="Number(scope.row[item.prop]) > 0">{{
                scope.row[item.prop].toFixed(2) || "0.00"
              }}</span>
              <span v-else>0.00</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <div class="paper">
        <el-pagination
          background
          @size-change="changeSize"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="退费结算" :visible.sync="returnVis">
      <ReturnPreDialog
        :refundApplyData="currentRegisteredData.tradeId"
        @close="returnClose"
      />
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
    <el-dialog
      title="收费"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      v-show="payDialogVisibleMs"
      width="1300px"
      top="5vh"
      @close="closeDialog"
      class="l-charge-dialog"
    >
      <l-charge
        :charge="newLchrage"
        :isApptointment="true"
        :notMs="payDialogVisibleMs"
        @close="close"
      ></l-charge>
    </el-dialog>
    <el-dialog
      title="是否收取挂号费？"
      :visible.sync="registerVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="dialogContent isFreeCheckedContent">
        <el-checkbox v-model="isFreeChecked" style="margin-right:32px;" size="small" @change="isFreeCheckedChange">免收</el-checkbox><l-value-domain
          style="width: 260px; margin-right: 3px"
          code="FreeRecipeReason"
          :disabled="!isFreeChecked"
          :value.sync="freeReason"
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="registerCancel">免 收</el-button> -->
        <el-button type="primary" @click="registerSure">收 取</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import outpatientAppointment from "@/api/appointmentNew/outpatientAppointment.js";
import { swipe } from "@/api/arch/arch";
import service from "@/api/appointment/appointment";
import ReturnPreDialog from "@/views/cis/settleAccount/returnCharge/components/returnPreDialog.vue";
import { onPreview, onPreviewStr } from "@/utils/print";
import { transformCode, getTableData } from "@/api/directive/directiveRequest";
import service1 from "@/api/systemManagement/receipt/receipt";

export default {
  name: "appointmentList",
  components: { ReturnPreDialog },
  data() {
    return {
      isFreeChecked:false,
      // 结算确认弹窗
      chargeConfirmVisible: false,
      chargeConfirmVisibleMs: true,
      payDialogVisibleMs: true,
      searchValue: {
        date: [
          this.dayjs(new Date()).format("YYYY-MM-DD"),
          this.dayjs(new Date()).format("YYYY-MM-DD")
        ],
        recordStatus: "",
        appointmentMode: "",
        doctorName: "",
        doctorId: "",
        patientName: "",
        patientCode: "",
        cardNum: ""
      },
      regStatusOptions: {
        0: "未收费",
        1: "已收费",
        2: "已退费",
      },
      loading: false,
      RegisteredListParams: [
        {
          prop: "recordStatus",
          label: "预约状态",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "100",
        },
        // {
        //   prop: "apptDept",
        //   label: "门诊部门",
        //   align: "left",
        //   headerAlign: "left",
        //   fixed: false,
        //   width: "100",
        // },
        {
          prop: "ouptDeptId",
          label: "专科",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "100",
        },
        {
          prop: "doctorName",
          label: "医生姓名",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "100",
        },
        {
          prop: "diagTreatTypeName",
          label: "诊疗类型",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "120",
        },
        {
          prop: "regMoney",
          label: "挂号费",
          align: "right",
          headerAlign: "left",
          fixed: false,
          width: "90",
        },
        {
          prop: "regStatus",
          label: "收费状态",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "100",
        },
        {
          prop: "appointmentTime",
          label: "预约号日期",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "200",
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "120",
        },
        {
          prop: "patientGender",
          label: "性别",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "60",
        },
        {
          prop: "birthDate",
          label: "出生日期",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "120",
        },
        {
          prop: "identificationNum",
          label: "身份证",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "200",
        },
        {
          prop: "phoneNum",
          label: "联系电话",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "150",
        },
        {
          prop: "appointmentModeName",
          label: "预约渠道",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "100",
        },
        {
          prop: "updatedByName",
          label: "预约人",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "100",
        },
        {
          prop: "appointmentTime",
          label: "预约时间",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "200",
        },
        {
          prop: "updatedByName",
          label: "操作者",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "100",
        },
        {
          prop: "updatedAt",
          label: "操作时间",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "200",
        },
      ],
      registeredData: [],
      currentRegisteredData: {},
      recPatientData: {},
      registerVisible: false, //免收弹窗
      //退费结算弹框
      returnVis: false,
      // 缴费弹窗
      dialogVisible: false,
      newLchrage: {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {}, // 账户数据
      },
      //反显数据缓存
      codeTransformObj: {},
      options: [],
      selLoading: false,
      //分页信息
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      layout: "total,sizes,prev, pager, next, jumper",
      freeReason: "",
    };
  },
  methods: {
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
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.search();
    },
    // 重置
    reset() {
      this.searchValue = {
        date: [],
        recordStatus: "",
        appointmentMode: "",
        doctorName: "",
        doctorId: "",
        patientName: "",
        patientCode: "",
        cardNum: ""
      };
      this.search();
    },
    // 查询
    async search() {
      this.registeredData = [];
      this.currentRegisteredData = {};
      let startDate =
        this.searchValue.date && this.searchValue.date.length
          ? this.searchValue.date[0] + " 00:00:00"
          : "";
      let stopDate =
        this.searchValue.date && this.searchValue.date.length
          ? this.searchValue.date[1] + " 23:59:59"
          : "";
      let params = {
        ...this.searchValue,
        startDate: startDate,
        stopDate: stopDate,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
      };
      this.$delete(params, "date");
      await this.getRegisteredList(params);
      if (this.registeredData && this.registeredData.length) {
        this.currentRegisteredData = this.registeredData[0];
      }
      this.$refs.singelTable.setCurrentRow(this.registeredData[0]);
    },
    async getRegisteredList(params) {
      this.loading = true;
      try {
        let result = await outpatientAppointment.getRegisteredList(params);
        if (result.code === 1) {
          this.registeredData = result.data;
          this.pageParams.total = result.total;
        } else {
          this.$message.error(result.msg || "获取挂号记录失败");
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$message.error(e.msg || "获取挂号记录失败");
      }
    },
    rowClick(row) {
      this.currentRegisteredData = row;
    },
    // 读卡
    readCard(obj) {
      this.searchValue.patientCode = obj.patientCode;
      this.searchValue.patientName = obj.patientName;
      this.search();
    },
    // 读卡
    /* async readCard() {
      if (!this.searchValue.cardNum) {
        this.$message.error("未获得卡号");
        return;
      }
      this.recPatientData = {};
      try {
        let result = await swipe({ cardNum: this.searchValue.cardNum });
        if (result.code == "1" && JSON.stringify(result.data) !== "{}") {
          this.recPatientData = {
            ...result.data,
            cardNum: this.searchValue.cardNum,
            cardType: result.data.cardType,
          };
          await this.handleCardData();
        } else {
          this.$message.info("未找到该卡");
        }
      } catch (e) {
        this.$message.error(e.msg || "读卡请求失败");
      }
    }, */
    /* async handleCardData() {
      this.searchValue.patientName = this.recPatientData.patientName || "";
      this.searchValue.patientCode = this.recPatientData.patientCode || "";
      let startDate =
        this.searchValue.date && this.searchValue.date.length
          ? this.searchValue.date[0] + " 00:00:00"
          : "";
      let stopDate =
        this.searchValue.date && this.searchValue.date.length
          ? this.searchValue.date[1] + " 23:59:59"
          : "";
      let params = {
        ...this.searchValue,
        startDate: startDate,
        stopDate: stopDate,
        patientCode: this.recPatientData.patientCode || "",
        patientName: this.recPatientData.patientName || "",
        cardNum: this.recPatientData.cardNum || "",
      };
      this.$delete(params, "date");
      await this.getRegisteredList(params);
    }, */
    // 退号
    async appointCancelClick() {
      let singleInfo = this.currentRegisteredData;
      // this.$confirmFunc({
      //   titleText: "提示",
      //   contentText:
      //     "是否取消" +
      //     (singleInfo.patientName || "") +
      //     (singleInfo.appointmentTime || "") +
      //     (singleInfo.className || "") +
      //     (singleInfo.ouptDeptName || "") +
      //     (singleInfo.doctorName || "") +
      //     (singleInfo.diagTreatTypeName || "") +
      //     "的挂号信息",
      //   confirmLoadingText: "退号中...",
      //   confirm: async (action, instance, done) => {
      //     if (this.currentRegisteredData.regStatus == "0" || this.currentRegisteredData.regStatus == "3") {
      //       //未收费
      //       try {
      //         this.$showLoading();
      //         let res = await outpatientAppointment.appointCancel({
      //           appointmentId: this.currentRegisteredData.appointmentId,
      //           channel: 1,
      //         });
      //         this.$hideLoading();
      //         this.$message.success(res.msg);
      //         await this.search();
      //       } catch (error) {
      //         this.$hideLoading();
      //         this.$message.error(error.msg);
      //       }
      //     } else if (this.currentRegisteredData.regStatus == "1") {
      //       this.returnVis = true;
      //     }
      //     done();
      //   },
      // });

      this.$confirm("是否取消" +
          (singleInfo.patientName?`【${singleInfo.patientName}】`:"") +
          (singleInfo.appointmentTime?`【${singleInfo.appointmentTime}】`:"") +
          (singleInfo.className?`【${singleInfo.className}】`:"") +
          (singleInfo.ouptDeptName?`【${singleInfo.ouptDeptName}】`:"") +
          (singleInfo.doctorName?`【${singleInfo.doctorName}】`:"") +
          (singleInfo.diagTreatTypeName?`【${singleInfo.diagTreatTypeName}】`:"") +
          "的挂号信息?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: async (action, instance, done) =>{
            if (action === 'confirm') {
              if (this.currentRegisteredData.regStatus == "0") {
                //未收费
                try {
                  this.$showLoading();
                  let res = await outpatientAppointment.appointCancel({
                    appointmentId: this.currentRegisteredData.appointmentId,
                    channel: 1,
                  });
                  this.$hideLoading();
                  this.$message.success(res.msg);
                  await this.search();
                } catch (error) {
                  this.$hideLoading();
                  this.$message.error(error.msg);
                }
              } else if (this.currentRegisteredData.regStatus == "1" || this.currentRegisteredData.regStatus == "3") {
                this.returnVis = true;
              }
              done();
            } else {
              done();
            }
          }
        });
    },
    returnClose(val) {
      if (val && val.refresh) {
        this.search();
        // this.getApptByScheduleId();
        // this.getDeptAndNum();
        // this.getScheduleByApptDept();
      }
      this.returnVis = false;
    },
    // 缴费
    payClick() {
      if (!this.currentRegisteredData.appointmentId) {
        this.$message.error("请选择一条预约记录");
        return;
      }
      //当前选中的预约数据
      this.newLchrage.appointment = this.currentRegisteredData;
      //获取收费明细
      let ChargeRegDetail = this.getChargeRegDetail();
      // 待收费对象转换
      this.changeObj(ChargeRegDetail);
      // 弹出是否收费
      this.freeReason = ""; //重置免费原因
      this.initRegisterVisible();
      this.registerVisible = true;
    },
    async getChargeRegDetail() {
      let { data } = await service.getChargeRegDetail({
        birthDate: "",
        regDiagTreatType: this.currentRegisteredData.diagTreatType,
        regWorkCode: this.currentRegisteredData.workCode,
      });
      return data;
    },
    closeDialog() {
      this.search();
    },
    close(data) {
      this.dialogVisible = false;
      if(data.refresh) {
        if(this.newLchrage.appointment.recordStatus == '1' ||
        this.newLchrage.appointment.recordStatus == '2' ||
        this.newLchrage.appointment.recordStatus == '3' ||
        this.newLchrage.appointment.recordStatus == '6' ){
          this.appointTriageClick();
        }
      }
      this.newLchrage = {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {}, // 账户数据
      };
      this.search();
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
          visitId: this.currentRegisteredData.appointmentId,
          ouptDeptId: this.currentRegisteredData.ouptDeptId, // 专科id
          groupId: item.groupNo, // 组号
          groupNo: item.groupNo,
        };
        chargePrescriptions.push(obj);
      }
      this.newLchrage.chargePrescriptions = chargePrescriptions;
    },
    //分诊
    async appointTriageClick() {
      if (!this.currentRegisteredData.appointmentId) {
        this.$message.error("请先选择一条数据记录");
        return;
      }
      try {
        this.$showLoading();
        let res = await outpatientAppointment.appointTriage({
          appointmentId: this.currentRegisteredData.appointmentId
        });
        this.$hideLoading();
        this.$message.success(res.msg);
        this.search();
        // this.getApptByScheduleId();
        // this.getDeptAndNum();
        // this.getScheduleByApptDept();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    // 打印
    async printClick() {
      /* let appointmentList = [];
      let data = this.registeredData;
      for (let i in data) {
        let obj = {
          ...data[i],
          regStatus: this.regStatusOptions[data[i]["regStatus"]],
          regMoney:
            data[i]["regMoney"] > 0
              ? Number(data[i]["regMoney"]).toFixed(2)
              : "0.00",
          patientGender: await this.transformCode(
            "name",
            "GENDER_CODE",
            data[i]["patientGender"] || ""
          ),
          recordStatus: await this.transformCode(
            "name",
            "APPT_STATUS",
            data[i]["recordStatus"] || ""
          )
        };
        appointmentList.push(obj);
      }
      let printData = {
        appointmentList: appointmentList
      };
      onPreview(printData, "预约列表"); */

      if (!this.currentRegisteredData.visitCode) {
        this.$message("没有记录需要打印！");
        return;
      }
      let outpDeptName = "";
      if (this.currentRegisteredData.outpDeptName) {
        outpDeptName = this.currentRegisteredData.outpDeptName;
      } else {
        outpDeptName = await this.transformTable(
          "org_nm",
          {
            org_type: "_DEPT_",
            id: this.currentRegisteredData.ouptDeptId,
          },
          "sys_org"
        );
      }
      let data = {
        visitCode: this.currentRegisteredData.visitCode,
        name: this.currentRegisteredData.patientName,
        departName: outpDeptName,
        floors: this.currentRegisteredData.roomLocation, //就诊地点
        visitTime: this.currentRegisteredData.appointmentTime,
        num: "",
        doctorName: this.currentRegisteredData.doctorName,
        roomNum: this.currentRegisteredData.roomName,
        chargePrice:
          this.currentRegisteredData.regMoney > 0
            ? Number(this.currentRegisteredData.regMoney).toFixed(2)
            : "0.00",
        chargeType: "挂号",
        visitDate: this.currentRegisteredData.updatedAt,
      };
      // console.log("打印数据data", data);
      onPreview(data, "挂号凭证");
    },
    //主数据反显
    async transformCode(field, code, val) {
      let params = [{ field, code, val }];
      if (this.codeTransformObj[`${code}+${val}`]) {
        // el.innerText = this.codeTransformObj[`${code}+${val}`];
        return this.codeTransformObj[`${code}+${val}`];
      } else {
        try {
          let resData = await transformCode(params);
          if (resData.code === 1) {
            this.codeTransformObj[`${code}${val}`] = resData.data[code];
            return Promise.resolve(resData.data[code]);
          } else {
            return "--";
          }
        } catch (err) {
          return "--";
        }
      }
    },
    //表数据反显 （科室用）
    async transformTable(columns, conditionMap, tableName) {
      try {
        let data = {
          tableName: tableName || "",
          columns: columns || "",
          conditionMap: conditionMap || {},
        };
        let resData = await getTableData(data);
        if (resData.code === 1 && resData.data != []) {
          return Promise.resolve(resData.data[0][columns]);
        }
        return "";
      } catch (error) {
        return "";
      }
    },
    // 查询用户
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await service1.getAllUser({
          userName: val || "",
        });
        this.options = res.data;
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    setUseUserInfo(row) {
      this.searchValue.doctorName = "";
      this.searchValue.doctorId = "";
      if (row) {
        this.options.forEach((val) => {
          if (val.id == row) {
            this.searchValue.doctorName = val.name;
            this.searchValue.doctorId = val.id;
          }
        });
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
      if(this.isFreeChecked){
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
    chargeConfirmClose() {
      this.chargeConfirmVisible = false;
    },
    chargeConfirmSure(data) {
      this.newLchrage.confirmInfo = data;
      this.chargeConfirmVisible = false;
      this.$nextTick(() => {
        if(this.newLchrage.haveMoney == 1){
          this.payDialogVisibleMs = true;//是否在页面上显示收费框
        }else{
          this.payDialogVisibleMs = false;//是否在页面上显示收费框
        }
        this.dialogVisible = true;//收费框走流程
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.appointmentList {
  padding: 10px;
  .dialogContent.isFreeCheckedContent{
    height: auto;
    padding: 24px;
    display: flex;
    align-items: center;
  }
  .nav-bar {
    display: flex;
    .nav-bar-cont {
      flex: 1;
    }
  }
  .table-cont {
    height: calc(100% - 111px);
    .paper {
      text-align: right;
      margin-top: 20px;
      .el-pagination {
        padding: 0;
        /deep/ .el-pagination__editor.el-input .el-input__inner {
          height: 100% !important;
        }
      }
    }
  }

  .margin-bottom-10 {
    margin-bottom: 10px;
  }
  .plain-btn {
    min-width: 66px;
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
