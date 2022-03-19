<template>
  <div class="outDailyReportTurnIn height100">
    <div class="outDailyReportTurnIn-radio">
      <el-radio-group v-model="radio" @change="radioChange">
        <el-radio :label="0">门诊</el-radio>
        <el-radio :label="1">家床</el-radio>
      </el-radio-group>
    </div>
    <div class="outDailyReportTurnIn-cont height100">
      <el-tabs v-model="activeName">
        <el-tab-pane label="结账" name="first">
          <div class="nav-bar-left">
            <el-row :gutter="10">
              <el-col :span="5">
                <l-formt-title label="收费员">
                  <el-select
                    v-model="searchValue.userId"
                    placeholder="收费员"
                    clearable
                    @change="roleChange"
                  >
                    <el-option
                      v-for="item in roleData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="4">
                <span
                  style="padding-top: 6px; width: 178px; display: inline-block"
                >
                  <el-radio-group v-model="isDaily">
                    <el-radio :label="1">日报表</el-radio>
                    <el-radio :label="2">票据核销表</el-radio>
                  </el-radio-group>
                </span>
              </el-col>
              <el-col :span="8" v-if="isDaily == '1'">
                <l-formt-title label="账期" required>
                  <el-date-picker
                    clearable
                    v-model="searchValue.date"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  ></el-date-picker>
                </l-formt-title>
              </el-col>
              <el-col :span="4" v-if="isDaily == '2'">
                <l-formt-title label="起始票据" required>
                  <el-input
                    v-model="searchValue.startReceiptNum"
                    clearable
                  ></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="4" v-if="isDaily == '2'">
                <l-formt-title label="终止票据" required>
                  <el-input
                    v-model="searchValue.endReceiptNum"
                    clearable
                  ></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="7">
                <div class="float-right">
                  <el-button type="primary" plain @click="reset"
                    >重置</el-button
                  >
                  <el-button type="primary" @click="getData">查询</el-button>
                  <el-button
                    type="primary"
                    plain
                    @click="settleAccount"
                    :disabled="!outDailyReportComShow"
                    >结账</el-button
                  >
                  <el-button
                    type="primary"
                    plain
                    :disabled="!outDailyReportComShow"
                    @click="printFuc"
                    >打印</el-button
                  >
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="turnIn-cont1">
            <outDailyReportCom
              :printData="printData"
              v-if="outDailyReportComShow"
            ></outDailyReportCom>
          </div>
        </el-tab-pane>
        <el-tab-pane label="结账记录" name="second">
          <div class="nav-bar-right">
            <el-row :gutter="10">
              <el-col :span="4">
                <l-formt-title label="收费员">
                  <el-select
                    v-model="searchValueTwo.chargeUserCode"
                    placeholder="收费员"
                    clearable
                  >
                    <el-option
                      v-for="item in roleData1"
                      :key="item.id"
                      :label="item.name"
                      :value="item.userNo"
                    >
                    </el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="8">
                <span
                  style="padding-top: 6px; width: 178px; display: inline-block"
                >
                  <el-radio-group v-model="isSearchDate">
                    <el-radio :label="1">账期时间</el-radio>
                    <el-radio :label="2">结账时间</el-radio>
                  </el-radio-group>
                </span>
                <l-formt-title
                  label="时间"
                  v-if="isSearchDate == 1"
                  style="width: calc(100% - 182px)"
                >
                  <el-date-picker
                    clearable
                    v-model="searchValueTwo.settleTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  ></el-date-picker>
                </l-formt-title>
                <l-formt-title
                  label="时间"
                  v-else-if="isSearchDate == 2"
                  style="width: calc(100% - 182px)"
                >
                  <el-date-picker
                    clearable
                    v-model="searchValueTwo.turnInTimeTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  ></el-date-picker>
                </l-formt-title>
              </el-col>
              <el-col :span="4">
                <l-formt-title label="状态">
                  <el-select v-model="searchValueTwo.recordStatus">
                    <el-option
                      v-for="(item, index) in recordStatusOptions"
                      :key="index"
                      :index="index"
                      :label="item"
                      :value="index"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="8">
                <div class="float-right">
                  <el-button type="primary" @click="resetTwo">重置</el-button>
                  <el-button type="primary" @click="getDataTwo">查询</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="turnIn-cont">
            <el-table
              ref="multiTable"
              :data="multiData"
              width="100%"
              height="100%"
              border
            >
              <el-table-column
                v-for="(item, index) in multiParams"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align || 'left'"
                :header-align="item.headerAlign || 'left'"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'opreaton'">
                    <el-button type="text" @click="showDetail(scope.row)"
                      >明细</el-button
                    >
                    <el-button
                      type="text"
                      @click="cancelPay(scope.row)"
                      :disabled="scope.row.recordStatus == '2'"
                      >撤销</el-button
                    >
                  </template>
                  <template v-else-if="item.prop === 'recordStatus'">
                    <span>{{
                      recordStatusOptions[scope.row.recordStatus]
                    }}</span>
                  </template>
                  <template v-else-if="item.align === 'right'">
                    <span>{{ utils().outputmoney(scope.row[item.prop]) }}</span>
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <l-dialog
        :visible.sync="modelVisible"
        width="1000px"
        title="查看明细"
        @confirm="conserve"
        :customBottom="true"
      >
        <template #content>
          <div style="padding: 10px; min-height: 100px; overflow-y: auto">
            <outDailyReportCom :printData="printDataRight"></outDailyReportCom>
          </div>
        </template>
        <template #footerContent>
          <el-button type="primary" size="small" plain @click="conserve"
            >关闭</el-button
          >
        </template>
      </l-dialog>
    </div>
  </div>
</template>
<script>
import outDailyReportCom from "./outDailyReportCom.vue";
import service from "@/api/financeManagement/reportForms.js";
import { queryUsers } from "@/api/admin/user.js";
import { getUserId } from "@/utils/auth";
import Base64 from "@/utils/base64.js";
import utils from "../utils/utils.js";
import { deepClone } from "@/utils/index";
import { print } from "@/utils/print_new.js";
import { generateTable } from "@/printTemplete/module/outDailyReportTp.js";
import codes from "@/printTemplete/code.js";
import { getPrintTpl } from "@/api/admin/print/print";

export default {
  name: "outDailyReportTurnIn",
  components: {
    outDailyReportCom,
  },
  data() {
    return {
      outDailyReportComShow: false,
      roleData: [],
      roleData1: [],
      isDaily: 1,
      radio: 0,
      isSearchDate: 1, //按账期查还是按结账时间查
      remoteParams: {
        pageSize: 210,
        page: 1,
        orderBy: "updated_at desc",
      },
      activeName: "first",
      searchValue: {
        date: [
          this.dayjs(new Date()).format("YYYY-MM-DD") + " 00:00:00",
          this.dayjs(new Date()).format("YYYY-MM-DD") + " 23:59:59",
        ],
        userId: "",
      },
      searchValueTwo: {
        chargeUserCode: "",
        settleTime: [
          this.dayjs(
            new Date(new Date().getTime() - 168 * 60 * 60 * 1000)
          ).format("YYYY-MM-DD") + " 00:00:00",
          this.dayjs(new Date()).format("YYYY-MM-DD") + " 23:59:59",
        ],
        turnInTimeTime: [
          this.dayjs(
            new Date(new Date().getTime() - 168 * 60 * 60 * 1000)
          ).format("YYYY-MM-DD") + " 00:00:00",
          this.dayjs(new Date()).format("YYYY-MM-DD") + " 23:59:59",
        ],
        recordStatus: "1",
      },
      recordStatusOptions: {
        1: "已结账",
        2: "撤销结账",
      },
      multiParams: [
        {
          prop: "opreaton",
          label: "操作",
          width: "120",
          align: "left",
          headerAlign: "center",
          fixed: true,
        },
        {
          prop: "recordStatus",
          label: "状态",
          width: "100",
          align: "left",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "chargeUserName",
          label: "收费员",
          width: "100",
          align: "left",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "settleStartTime",
          label: "账期开始时间",
          width: "200",
          align: "left",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "settleEndTime",
          label: "账期结束时间",
          width: "200",
          align: "left",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "totalFeeAmt",
          label: "费用总额",
          width: "100",
          align: "right",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "totalSettleAmt",
          label: "结算总额",
          width: "100",
          align: "right",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "currencyBalance",
          label: "货币差额",
          width: "100",
          align: "right",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "turnInTime",
          label: "结账时间",
          width: "200",
          align: "left",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "turnInOperatorName",
          label: "结账操作人",
          width: "200",
          align: "left",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "cancelTurnInTime",
          label: "撤销结账时间",
          width: "200",
          align: "left",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "cancelTurnInOperatorName",
          label: "撤销结账人",
          width: "200",
          align: "left",
          headerAlign: "center",
          fixed: false,
        },
      ],
      multiData: [],
      printData: {},
      printDataRight: {},
      modelVisible: false,
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    radioChange() {
      if (this.activeName == "first") {
        this.getData();
      } else if (this.activeName == "second") {
        this.getDataTwo();
      }
    },
    async getRoles() {
      let roleData = [];
      let roleData1 = [];
      let userId = Base64.decode(getUserId());
      let res = await queryUsers(this.remoteParams);
      if (res.code === 1) {
        roleData = res.data.concat({
          id: "",
          name: "全部",
          userNo: "",
        });
        this.roleData = roleData;
        roleData1 = res.data.concat({
          id: "all_user",
          name: "院总账",
          userNo: "all_user",
        });
        this.roleData1 = roleData1;
      }
      for (let i in roleData) {
        if (userId == roleData[i].id) {
          this.searchValue.userId = roleData[i].id;
          this.searchValueTwo.chargeUserCode = roleData[i].userNo;
        }
      }
    },
    roleChange() {},
    async getData() {
      this.outDailyReportComShow = false;
      this.printData = {};
      if (this.isDaily == "1") {
        if (!this.searchValue.date || !this.searchValue.date.length) {
          this.$message.warning("请先选择账期再进行查询！");
          return;
        }
      } else if (this.isDaily == "2") {
        if (
          !this.searchValue.startReceiptNum ||
          !this.searchValue.endReceiptNum
        ) {
          this.$message.warning("请先输入起始票据与终止票据再进行查询！");
          return;
        }
      }

      if (this.radio == 0) {
        this.getDataMZ();
        return;
      }
      this.getDataZY();
    },
    async getDataMZ() {
      try {
        this.$showLoading();
        let startTime =
          this.searchValue.date && this.searchValue.date.length
            ? this.searchValue.date[0]
            : "";
        let endTime =
          this.searchValue.date && this.searchValue.date.length
            ? this.searchValue.date[1]
            : "";
        let params = {
          startTime: startTime,
          endTime: endTime,
          userId: this.searchValue.userId,
          opIpFlag: this.radio,
          startReceiptNum: this.searchValue.startReceiptNum,
          endReceiptNum: this.searchValue.endReceiptNum,
        };
        if (this.isDaily == "1") {
          delete params.startReceiptNum;
          delete params.endReceiptNum;
        } else if (this.isDaily == "2") {
          delete params.startTime;
          delete params.endTime;
        }
        let res = await service.getDailyReportNew(params);
        if (res.code == 1) {
          this.outDailyReportComShow = true;
          this.printData = {
            ...res.data,
            inHosType: this.radio == 1 ? "门诊" : this.radio == 2 ? "住院" : "",
          };
        } else {
          this.$message.error(res.msg);
        }
        this.$hideLoading();
      } catch (e) {
        this.$hideLoading();
      }
    },
    async getDataZY() {
      try {
        this.$showLoading();
        let startTime =
          this.searchValue.date && this.searchValue.date.length
            ? this.searchValue.date[0]
            : "";
        let endTime =
          this.searchValue.date && this.searchValue.date.length
            ? this.searchValue.date[1]
            : "";
        let params = {
          startDate: startTime,
          endDate: endTime,
          chargeUserId: this.searchValue.userId,
          opIpFlag: this.radio,
          startReceiptNum: this.searchValue.startReceiptNum,
          endReceiptNum: this.searchValue.endReceiptNum,
        };
        if (this.isDaily == "1") {
          delete params.startReceiptNum;
          delete params.endReceiptNum;
        } else if (this.isDaily == "2") {
          delete params.startDate;
          delete params.endDate;
        }
        let res = await service.getInpOperatorDailyReport(params);
        if (res.code == 1) {
          this.outDailyReportComShow = true;
          this.printData = {
            ...res.data,
            inHosType: this.radio == 1 ? "门诊" : this.radio == 2 ? "住院" : "",
          };
        } else {
          this.$message.error(res.msg);
        }
        this.$hideLoading();
      } catch (e) {
        this.$hideLoading();
      }
    },
    reset() {
      this.searchValue = {
        date: [],
      };
    },
    // 结账
    async settleAccount() {
      this.$showLoading();
      try {
        let params = {
          ...this.printData,
          chargeUserCode: this.printData.chargeUserCode
            ? this.printData.chargeUserCode
            : "all_user",
          chargeUserName: this.printData.chargeUserName
            ? this.printData.chargeUserName
            : "全部",
          opIpFlag: this.radio,
        };
        let res = await service.uploadTurnInRecord(params);
        if (res.code == 1) {
          this.$message.success(res.msg || "结账成功！");
        } else {
          this.$message.error(res.msg || "结账失败！");
        }
      } finally {
        this.$hideLoading();
      }
    },
    // 打印
    async printFuc() {
      let str = generateTable({
        ...this.printData,
        turnInOperatorName: `${this.printData.turnInOperatorName || ""}`,
        turnInTime: `${
          this.printData.hasOwnProperty("turnInTime")
            ? this.printData.turnInTime
            : this.dayjs(new Date()).format("YYYY年MM月DD日")
        }`,
      });
      // console.log("strstrstr",str)
      let { code, data } = await getPrintTpl(codes.outDailyReportStr);
      if (code != 1) return;
      print(
        null,
        data.value,
        {},
        {
          orgName: JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团",
          hosName: `${
            JSON.parse(localStorage.getItem("pamars")).hosName || ""
          } 收费汇总`,
          tableCont: str,
        }
      );
    },
    async getDataTwo() {
      let settleStartTime =
        this.searchValueTwo.settleTime && this.searchValueTwo.settleTime.length
          ? this.searchValueTwo.settleTime[0]
          : "";
      let settleEndTime =
        this.searchValueTwo.settleTime && this.searchValueTwo.settleTime.length
          ? this.searchValueTwo.settleTime[1]
          : "";
      let turnInTimeStartTime =
        this.searchValueTwo.turnInTimeTime &&
        this.searchValueTwo.turnInTimeTime.length
          ? this.searchValueTwo.turnInTimeTime[0]
          : "";
      let turnInTimeEndTime =
        this.searchValueTwo.turnInTimeTime &&
        this.searchValueTwo.turnInTimeTime.length
          ? this.searchValueTwo.turnInTimeTime[1]
          : "";
      let params = {
        chargeUserCode: this.searchValueTwo.chargeUserCode,
        recordStatus: this.searchValueTwo.recordStatus,
        settleStartTime,
        settleEndTime,
        turnInTimeStartTime,
        turnInTimeEndTime,
        opIpFlag: this.radio,
      };
      if (this.isSearchDate == 1) {
        delete params.turnInTimeStartTime;
        delete params.turnInTimeEndTime;
      } else if (this.isSearchDate == 2) {
        delete params.settleStartTime;
        delete params.settleEndTime;
      }

      this.$showLoading();
      try {
        let res = await service.turnInRecordQuery(params);
        if (res.code == 1) {
          this.multiData = res.data;
        } else {
          this.$message.error(res.msg || "查询失败！");
        }
      } finally {
        this.$hideLoading();
      }
    },
    resetTwo() {
      this.searchValueTwo = {
        settleTime: [],
        turnInTimeTime: [],
        chargeUserCode: "",
      };
      // this.getDataTwo();
    },
    // 展示明细
    showDetail(row) {
      this.modelVisible = true;
      this.printDataRight = row;
    },
    // 撤销
    cancelPay(row) {
      this.$confirm("是否确定撤销?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        this.$showLoading();
        try {
          let res = await service.cancelTurnInRecord(row);
          if (res.code == 1) {
            this.$message.success(res.msg || "撤销成功！");
            this.getDataTwo();
          } else {
            this.$message.error(res.msg || "撤销成功！");
          }
        } finally {
          this.$hideLoading();
        }
      });
    },
    conserve() {
      this.modelVisible = false;
    },
    utils() {
      return utils;
    },
  },
};
</script>
<style lang="scss" scoped>
.outDailyReportTurnIn {
  position: relative;
  .outDailyReportTurnIn-radio {
    position: absolute;
    right: 10px;
    top: 4px;
    z-index: 1;
    /deep/.el-radio__label {
      font-size: 18px;
      font-weight: 600;
    }
  }
  .nav-bar-left {
    width: 1200px;
    margin-left: calc(50% - 420px);
    margin-top: 10px;
  }
  .nav-bar-right {
    margin-top: 10px;
  }
  .turnIn-cont {
    margin-top: 10px;
    height: calc(100% - 54px);
    overflow-y: auto;
  }
  .turnIn-cont1 {
    margin-top: 10px;
    height: calc(100% - 54px);
    overflow-y: auto;
    width: 840px;
    margin-left: calc(50% - 420px);
  }
  /deep/.el-tabs {
    height: 100%;
    .el-button--medium {
      padding: 8px;
    }
  }
}
</style>
