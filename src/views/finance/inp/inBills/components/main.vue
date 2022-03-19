<template>
  <div class="height100 width100">
    <el-row class="width100 padding10">
      <el-col :span="12">
        <span class="font-size">下一张票号：</span>
        <span
          class="font-size"
          style="min-width: 120px; display: inline-block"
          v-loading="btuLoading"
          >{{ nextReceiptNumOutPO.receiptNum || "无" }}</span
        >
        <el-button type="primary" @click="getNextReceiptNum">刷新</el-button>
        <el-button type="primary" @click="jumpCode">跳号</el-button>
        <el-button type="primary" @click="billsUse">票据启用</el-button>
      </el-col>
      <el-col :span="12">
        <el-button
          type="primary"
          class="float-right"
          :disabled="
            activeName == 'name1' ||
            !nextReceiptNumOutPO.receiptNum ||
            typeof rightRow === 'undefined' ||
            !rightRow.receiptNum ||
            rightRow.receiptStatus !== '1'
          "
          @click="newPrint"
          >新票重打</el-button
        >
        <el-button
          type="primary"
          class="float-right margin-right-10"
          :disabled="
            activeName == 'name1' ||
            typeof rightRow === 'undefined' ||
            !rightRow.receiptNum ||
            rightRow.receiptStatus !== '1'
          "
          @click="oldPrint"
          >原票补打</el-button
        >
        <!-- <el-button type="primary" class="float-right" :disabled="activeName == 'name1'||typeof rightRow === 'undefined' || !rightRow.receiptNum || rightRow.receiptStatus !=='1'" @click="emptyPrint">白纸重打</el-button> -->
        <el-button
          type="primary"
          class="float-right"
          :disabled="
            activeName != 'name1' ||
            !nextReceiptNumOutPO.receiptNum ||
            typeof leftRow === 'undefined' ||
            !leftRow.dischargeId
          "
          @click="billPrint"
          >发票打印</el-button
        >
        <!-- <el-button type="primary" class="float-right" @click="handlePrintData"
          >发票打印</el-button
        > -->
      </el-col>
    </el-row>

    <div class="bill-cont">
      <el-tabs
        class="height100 width100"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane name="name1" label="未打印">
          <el-table
            ref="leftTable"
            :data="leftTableData"
            width="100%"
            height="calc(100% - 56px)"
            border
            v-loading="loading1"
            highlight-current-row
            @row-click="leftRowClick"
          >
            <el-table-column
              v-for="(item, index) in leftParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'wardId'">
                  <span
                    tableName="sys_ward"
                    :conditionMap="{ ward_code: scope.row[item.prop] }"
                    columns="ward_name"
                    v-tableTransform
                    >--</span
                  >
                </template>
                <template v-else-if="item.prop === 'settlementType'">
                  <span
                    :val="scope.row[item.prop]"
                    code="settlementType"
                    v-codeTransform
                    >-</span
                  >
                </template>
                <template v-else-if="item.prop === 'dischargeDivisionCode'">
                  <span
                    :val="scope.row[item.prop]"
                    code="DIVISION_CODE"
                    v-codeTransform
                    >-</span
                  >
                </template>
                <template
                  v-else-if="
                    item.prop === 'inpCode' ||
                    item.prop === 'patientName' ||
                    item.prop === 'bedCode' ||
                    item.prop === 'dischargeTime' ||
                    item.prop === 'settlementTime'
                  "
                  >{{ scope.row[item.prop] }}</template
                >
                <template v-else>{{
                  formatNumber(scope.row[item.prop])
                }}</template>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="float-right page margin-top-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageParams.pageNo"
            :page-sizes="[5, 40, 60, 100, 300, 500, 1000, 3000, 5000, 10000]"
            :page-size="pageParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane name="name2" label="已打印">
          <el-table
            ref="rightTable"
            :data="rightTableData"
            width="100%"
            height="calc(100% - 56px)"
            border
            v-loading="loading2"
            highlight-current-row
            @row-click="rightRowClick"
          >
            <el-table-column
              v-for="(item, index) in rightParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'wardId'">
                  <span
                    tableName="sys_ward"
                    :conditionMap="{ ward_code: scope.row[item.prop] }"
                    columns="ward_name"
                    v-tableTransform
                    >--</span
                  >
                </template>
                <template v-else-if="item.prop === 'settlementType'">
                  <span
                    :val="scope.row[item.prop]"
                    code="settlementType"
                    v-codeTransform
                    >-</span
                  >
                </template>
                <template v-else-if="item.prop === 'receiptStatus'">
                  <span v-if="scope.row.receiptStatus == '1'">正常</span>
                  <span v-if="scope.row.receiptStatus == '2'">已退票</span>
                  <span v-if="scope.row.receiptStatus == '9'">退票</span>
                </template>
                <template v-else-if="item.prop === 'dischargeDivisionCode'">
                  <span
                    :val="scope.row[item.prop]"
                    code="DIVISION_CODE"
                    v-codeTransform
                    >-</span
                  >
                </template>
                <template
                  v-else-if="
                    item.prop === 'inpCode' ||
                    item.prop === 'patientName' ||
                    item.prop === 'bedCode' ||
                    item.prop === 'dischargeTime' ||
                    item.prop === 'settlementTime' ||
                    item.prop === 'receiptNum'
                  "
                  >{{ scope.row[item.prop] }}</template
                >
                <template v-else>{{
                  formatNumber(scope.row[item.prop])
                }}</template>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="float-right page margin-top-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageParams.pageNo"
            :page-sizes="[5, 40, 60, 100, 300, 500, 1000, 3000, 5000, 10000]"
            :page-size="pageParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title="票据启用"
      :visible.sync="dialogVisible"
      width="1500px"
      :before-close="getNextReceiptNum"
    >
      <div class="width100 padding10">
        <useSelect :inBillForm="inBillForm" style="height: 600px"></useSelect>
      </div>
    </el-dialog>
    <el-dialog
      title="住院收费票据"
      :visible.sync="dialogVisible1"
      width="1000px"
    >
      <billsContent :receiptContent="receiptContent"></billsContent>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible1 = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
let dzData = {
  1: "1",
  21: "2",
  16: "3",
  12: "4",
  2: "5", //
  15: "6",
  10: "7",
  20: "8",
  3: "9",
  19: "10", //
  11: "11",
  33: "12",
};
import useSelect from "@/views/finance/receiptManager/components/useSelect";
import billsContent from "@/views/finance/inp/inBills/components/billsContent";
import {
  getLeftTableData,
  receiptPrint,
  getReceiptContent,
  reReceiptPrint,
} from "@/api/systemManagement/inBIlls/inBills";
import { getDatas } from "@/api/wconf/wparam";
import { mapGetters, mapActions } from "vuex";
import service from "@/api/cis/receiptPrint/receiptPrint";
// import {onPreview, onPrint} from '@/utils/print';
import { preview, onPreview, getMacLoaction } from "@/utils/print";
import { print, getPrinterList } from "@/utils/print_new";
import { getPrintTpl } from "@/api/admin/print/print";
import { createData } from "@/printTemplete/module/inpFinanceLodopTpl.js";
import codes from "@/printTemplete/code.js";

export default {
  name: "index",
  components: {
    useSelect,
    billsContent,
  },
  data() {
    return {
      finCodeList: {},
      activeName: "name1",
      outTime: "", //出院时间
      loading1: false,
      loading2: false,
      leftTableData: [],
      leftTableDataUnit: [],
      leftParams: [
        {
          prop: "inpCode",
          label: "住院号",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "patientName",
          label: "姓名",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "wardId",
          label: "病区",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "bedCode",
          label: "床位号",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "settlementType",
          label: "结算类型",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "dischargeTime",
          label: "出院时间",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "150",
        },
        // {
        //   prop: "settlementTime",
        //   label: "结算时间",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "150",
        // },
        // {
        //   prop: "dischargeDivisionCode",
        //   label: "出院院区",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "120",
        // },
        {
          prop: "selfPayPrepay",
          label: "自付预缴款",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "selfPayAmount",
          label: "总自付金额",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "freePayAmount",
          label: "总记账金额",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "cashChange",
          label: "现金结算",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "cashierCheckChange",
          label: "支票结算",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
      ],
      rightTableData: [],
      rightTableDataUnit: [],
      rightParams: [
        {
          prop: "receiptNum",
          label: "票据号",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "inpCode",
          label: "住院号",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "receiptStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "80",
        },
        {
          prop: "patientName",
          label: "姓名",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "wardId",
          label: "病区",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "bedCode",
          label: "床位号",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "settlementType",
          label: "结算类型",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "dischargeTime",
          label: "出院时间",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "150",
        },
        // {
        //   prop: "settlementTime",
        //   label: "结算时间",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "150",
        // },
        // {
        //   prop: "dischargeDivisionCode",
        //   label: "出院院区",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "120",
        // },
        {
          prop: "selfPayPrepay",
          label: "自付预缴款",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "selfPayAmount",
          label: "总自付金额",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "freePayAmount",
          label: "总记账金额",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "cashChange",
          label: "现金结算",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
        {
          prop: "cashierCheckChange",
          label: "支票结算",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120",
        },
      ],
      leftRow: {
        dischargeId: "",
      },
      rightRow: {},
      //下一章票据号
      nextReceiptNumOutPO: {},
      //票据启用
      dialogVisible: false,
      inBillForm: {
        outType: "1", //出库类型
        receiveUserId: "", //领用人员
        receiptType: "", //票据类型
        abortStatus: "0", //终止标识
      },
      //发票内容
      dialogVisible1: false,
      receiptContent: {
        siCardNum: "",
        actualSelfPayMoney: "",
        actualTotalPayMoney: "",
        bussessTradeCode: "",
        orgType: "",
        emrNum: "",
        adNum: "",
        startDate: "",
        endDate: "",
        inDays: "",
        receiptNum: "",
        patientName: "",
        patientGender: "",
        companyName: "",
        socialSecurityNum: "",
        totalAmt: "",
        totalPrepayAmt: "",
        paymentAmount: "",
        refundAmount: "",
        userId: "",
        employeeCode: "",
        userName: "",
        remainedDepositAmt: "",
        remainedCreditAmt: "",
        prepayReceiptCount: "",
        printTime: "",
      },
      // 分页
      pageParams: {
        pageNo: 0,
        pageSize: 5,
        total: 0,
      },
      // 本机主MAC地址
      currentMac: "",
      // 票号loding
      btuLoading: false,
      receiptNum: "",
      receiptType: "", //票据类型
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
  },
  watch: {
    receivePatientData: {
      handler() {
        this.dateChange();
      },
      immediate: true,
      deep: true,
    },
  },
  async created() {
    this.getFinCodeList();
    await this.getDictionaryPO();
    this.getNextReceiptNum();
  },
  methods: {
    async getDictionaryPO() {
      try {
        let res = await service.getDictionaryPO({
          itemCode: "F0016",
          valueCode: "02",
        });
        if (res.code == 1) {
          this.receiptType = res.data.dictionaryValue;
          this.inBillForm.receiptType = res.data.dictionaryValue;
        }
      } catch (error) {
        this.$message.error(error.msg || "获取票据类型失败");
      }
    },
    //获取财务分类码主数据
    async getFinCodeList() {
      this.finCodeList = {};
      let resData = await getDatas({
        pageSize: 100,
        page: 1,
        id: 4280,
      });
      if (resData.code == 1) {
        let data = resData.data;
        let obj = {};
        for (let i in data) {
          obj[i] = data[i];
        }
        this.finCodeList = obj;
      } else {
        this.finCodeList = {};
      }
    },
    handleClick() {
      this.dateChange();
    },
    async dateChange() {
      if (!this.receivePatientData || !this.receivePatientData.inpCode) {
        return;
      }
      this.pageParams.pageNo = 1;
      if (this.activeName === "name1") {
        await this.getLeftTableData();
      } else if (this.activeName === "name2") {
        await this.getRightTableData();
      }
    },
    async getLeftTableData() {
      this.loading1 = true;
      await this.getTableData();
      this.leftRow = this.leftTableData[0];
      this.$refs.leftTable.setCurrentRow(this.leftTableData[0]);
      this.loading1 = false;
    },
    async getRightTableData() {
      this.loading2 = true;
      await this.getTableData();
      this.rightRow = this.rightTableData[0];
      this.$refs.rightTable.setCurrentRow(this.rightTableData[0]);
      this.loading2 = false;
    },
    //查询票据
    async getTableData() {
      try {
        let startDischargeTime = "";
        let endDischargeTime = "";
        if (this.outTime.length === 2) {
          startDischargeTime = this.outTime[0];
          endDischargeTime = this.outTime[1];
        }
        let params = {
          startDischargeTime: startDischargeTime,
          endDischargeTime: endDischargeTime,
          dischargeId: this.receivePatientData.dischargeId || "",
          cardType: this.receivePatientData.cardType || "",
          cardData: this.receivePatientData.cardData || "",
          queryType: this.activeName == "name1" ? "0" : "1",
          pageNo: this.pageParams.pageNo, // 页码
          pageSize: this.pageParams.pageSize, // 页码大小
        };
        let res = await getLeftTableData(params);
        if (res.code == 1) {
          if (this.activeName == "name1") {
            this.leftTableData = res.data;
          } else if (this.activeName == "name2") {
            this.rightTableData = res.data;
          }
          this.pageParams.total = res.total;
        } else {
          this.$message.error("获取打印数据失败");
        }
      } catch (e) {
        this.$message.error(e.msg || "获取打印数据失败");
      }
    },
    leftRowClick(row) {
      this.leftRow = row;
    },
    rightRowClick(row) {
      this.rightRow = row;
    },
    // 获取下一张票据号
    async getNextReceiptNum(done) {
      try {
        this.nextReceiptNumOutPO = {};
        this.btuLoading = true;
        if (!this.currentMac) {
          let mac = { value: "" };
          getMacLoaction(mac)
            .then(async (res2) => {
              this.currentMac = res2;
              let res = await service.getNextReceiptNum({
                receiptType: this.receiptType,
                useMacLoaction: this.currentMac || undefined,
              });
              if (!res.data) {
                this.$message.error("未找到当前登录人的领用票据信息");
                this.btuLoading = false;
                return;
              }
              this.nextReceiptNumOutPO = res.data;
              this.btuLoading = false;
            })
            .catch(() => {
              this.btuLoading = false;
            });
        } else {
          let res = await service.getNextReceiptNum({
            receiptType: this.receiptType,
            useMacLoaction: this.currentMac || undefined,
          });
          if (!res.data) {
            this.$message.error("未找到当前登录人的领用票据信息");
            this.btuLoading = false;
            return;
          }
          this.nextReceiptNumOutPO = res.data;
          this.btuLoading = false;
        }

        // let res = await service.getNextReceiptNum({
        //   receiptType: this.receiptType,
        // });
        // if (!res.data) {
        //   this.$message.error("未找到当前登录人的领用票据信息");
        //   return;
        // }
        // this.nextReceiptNumOutPO = res.data;
      } catch (error) {
        this.btuLoading = false;
        this.$message.error(error.msg || "获取下一张票据号失败");
      }
      if (done) {
        done();
      }
    },
    //跳号
    async jumpCode() {
      try {
        this.btuLoading = true;
        let obj = {
          outId: this.nextReceiptNumOutPO.outId,
          receiptStartNum: this.nextReceiptNumOutPO.nextReceiptNum,
          receiptStopNum: this.nextReceiptNumOutPO.nextReceiptNum + 1,
        };
        let res = await service.receiptJumpNum(obj);
        this.btuLoading = false;
        if (res.code == "1") {
          this.getNextReceiptNum();
          this.$message({ type: "success", message: "跳号成功" });
        } else {
          this.$message.error(res.msg || "跳号失败");
        }
      } catch (error) {
        this.btuLoading = false;
        this.$message.error(error.msg || "跳号失败");
      }
    },
    //票据启用
    billsUse() {
      this.dialogVisible = true;
    },
    //发票打印
    async billPrint() {
      if (!this.leftRow.dischargeId) {
        this.$message.error("请选中需要打印的记录");
        return false;
      }
      await this.receiptPrint();
      let res = await this.GetReceiptContent("left");
      if (res) {
        this.handlePrintData();
        await this.getNextReceiptNum();
      }
      await this.getLeftTableData();
    },
    //新票重打
    async newPrint() {
      if (!this.rightRow.receiptNum) {
        this.$message.error("请选中需要打印的记录");
        return;
      }
      await this.reReceiptPrint();
      let res = await this.GetReceiptContent("left");
      if (res) {
        this.handlePrintData();
        await this.getNextReceiptNum();
      }
      await this.getRightTableData();
    },
    //原票补打
    async oldPrint() {
      if (!this.rightRow.receiptNum) {
        this.$message.error("请选中需要打印的记录");
        return;
      }
      this.loading2 = true;
      let res = await this.GetReceiptContent("right");
      if (res) {
        this.handlePrintData();
      }
      this.loading2 = false;
    },
    //白纸重打
    async emptyPrint() {
      if (!this.rightRow.receiptNum) {
        this.$message.error("请选中需要打印的记录");
        return;
      }
      this.loading2 = true;
      let res = await this.GetReceiptContent("right");
      if (res) {
        this.handlePrintData();
      }
      this.loading2 = false;
    },
    //发票打印接口
    async receiptPrint() {
      this.loading1 = true;
      try {
        console.info(this.leftRow);
        let params = {
          dischargeId: this.leftRow.dischargeId,
          receiptNum: this.nextReceiptNumOutPO.nextReceiptNum, //票据号
          finAdId: this.leftRow.finAdId, //财务住院id
          outId: this.nextReceiptNumOutPO.outId,
        };
        let res = await receiptPrint(params);
        if (res.code == 1) {
          this.$message.success("发票打印成功");
        } else {
          this.$message.error("发票打印失败");
        }
        this.loading1 = false;
      } catch (e) {
        this.loading1 = false;
        this.$message.error(e.msg || "发票打印失败");
      }
    },
    //票据补打
    async reReceiptPrint() {
      this.loading2 = true;
      try {
        let params = {
          oldReceiptNum: this.rightRow.receiptNum,
          dischargeId: this.rightRow.dischargeId,
          finAdId: this.rightRow.finAdId,
          outId: this.nextReceiptNumOutPO.outId,
          receiptNum: this.nextReceiptNumOutPO.nextReceiptNum,
        };
        let res = await reReceiptPrint(params);
        if (res.code == 1) {
          this.$message.success("发票补打成功");
        } else {
          this.$message.error("发票补打失败");
        }
        this.loading2 = false;
      } catch (e) {
        this.loading2 = false;
        this.$message.error(e.msg || "发票补打失败");
      }
    },
    //获取发票内容
    async GetReceiptContent(type) {
      try {
        let params = {};
        if (type === "right") {
          params = {
            receiptNum: this.rightRow.receiptNum,
          };
        } else if (type === "left") {
          params = {
            receiptNum: this.nextReceiptNumOutPO.receiptNum,
          };
        }
        this.receiptNum = params.receiptNum;
        let res = await getReceiptContent(params);
        if (res.code == 1) {
          let data = res.data;
          this.receiptContent = data;
          return true;
        } else {
          this.$message.error("获取发票失败");
          return false;
        }
      } catch (e) {
        this.$message.error(e.msg || "获取发票失败");
        return false;
      }
    },
    //金额format
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    //处理打印数据
    /* handlePrintData() {
      let printTimeYear = this.receiptContent.printTime
        ? this.receiptContent.printTime.split("-")[0]
        : "";
      let printTimeMon = this.receiptContent.printTime
        ? this.receiptContent.printTime.split("-")[1]
        : "";
      let printTimeDay = this.receiptContent.printTime
        ? this.receiptContent.printTime.split("-")[2].split(" ")[0]
        : "";
      let printData = {
        siCardNum: this.receiptContent.siCardNum || "",
        businessTradeCode: this.receiptContent.businessTradeCode || "",
        orgType: this.receiptContent.orgType || "",
        inpCode: this.receiptContent.inpCode || "",
        emrCode: this.receiptContent.emrCode || "",
        startTime:  this.dayjs(this.receiptContent.startTime).format("YYYY-MM-DD") || "",
        stopTime: this.dayjs(this.receiptContent.stopTime).format("YYYY-MM-DD") || "",
        inDays: this.receiptContent.inDays || "",
        receiptNum: this.receiptContent.receiptNum || this.receiptNum || "",
        patientName: this.receiptContent.patientName || "",
        companyName: this.receiptContent.companyName || this.receiptContent.settlementTypeName == "自费" ? "自费病人" : this.receiptContent.settlementTypeName || "",
        socialSecurityNum: this.receiptContent.socialSecurityNum || "",
        createdBy: this.receiptContent.createdBy || "",
        createdByName: this.receiptContent.createdByName || "",
        sdeptName: this.receiptContent.sdeptName || "",
        hospitalType: this.receiptContent.hospitalType || "",
        createdAt: this.receiptContent.createdAt || "",
        prepayReceiptCount: this.receiptContent.prepayReceiptCount || "0",
        reCheckUserName: this.receiptContent.reCheckUserName || "0",
        chargeUserName: this.receiptContent.chargeUserName || "0",
        chargeUnitName: this.receiptContent.chargeUnitName || "0",
        settlementTypeName: this.receiptContent.settlementTypeName || "",
        totalAmt:  this.formatNumber(this.receiptContent.totalAmt) || this.formatNumber(this.receiptContent.selfPayAmount) || "0.00",
        selfPayPrepay:
          this.formatNumber(this.receiptContent.selfPayPrepay) || "0.00",
        paymentAmount:
          this.formatNumber(this.receiptContent.paymentAmount) || "0.00",
        refundAmount:
          this.formatNumber(this.receiptContent.refundAmount) || "0.00",
        freePayAmount:
          this.formatNumber(this.receiptContent.freePayAmount) || "0.00",
        selfPayAmount: this.formatNumber(this.receiptContent.selfPayAmount) || "0.00",
        RMB: this.changeRMB(this.receiptContent.totalAmt) || this.changeRMB(this.receiptContent.selfPayAmount) ||  "零拾零万零仟零佰零拾零元零角零分",
        remainedDepositAmt:
          this.formatNumber(this.receiptContent.remainedDepositAmt) || "0.00",
        remainedCreditAmt:
          this.formatNumber(this.receiptContent.remainedCreditAmt) || "0.00",
        printTimeYear: printTimeYear,
        printTimeMon: printTimeMon,
        printTimeDay: printTimeDay
      };
      if(this.receiptContent.patientGender === "1"){
        printData.patientGender = [{"content":"男","check":"checked"},{"content":"女"}];
      }
      if(this.receiptContent.patientGender === "2"){
        printData.patientGender = [{"content":"男"},{"content":"女","check":"checked"}];
      }
      if (this.receiptContent.clinicType === "1") {
        printData.clinicType = [{"content":"门诊","check":"checked"},{"content":"急诊"},{"content":"住院"}];
      }else if(this.receiptContent.clinicType === "3") {
        printData.clinicType = [{"content":"门诊"},{"content":"急诊"},{"content":"住院","check":"checked"}];
      }else if(this.receiptContent.clinicType === "2"){
        printData.clinicType = [{"content":"门诊"},{"content":"急诊","check":"checked"},{"content":"住院"}];
      }

      let drugFeeClassInfos = this.receiptContent.drugFeeClassInfos || [];
      let examFeeClassInfos = this.receiptContent.examFeeClassInfos || [];
      let treatFeeClassInfos = this.receiptContent.treatFeeClassInfos || [];
      let otherFeeClassInfos = this.receiptContent.otherFeeClassInfos || [];
      let arr = [];
      let len = Math.max(drugFeeClassInfos.length,examFeeClassInfos.length,treatFeeClassInfos.length,otherFeeClassInfos.length);
      for (let i = 0;i < len;i++) {
        let obj = {};
        obj = {
          className1: "",
          chargeAmount1: "",
          className2: "",
          chargeAmount2: "",
          className3: "",
          chargeAmount3: "",
          className4: "",
          chargeAmount4: ""
        }
        if(typeof drugFeeClassInfos !== "undefined" && typeof drugFeeClassInfos[i] !== "undefined" ){
            obj.className1 = drugFeeClassInfos[i].className || "";
            obj.chargeAmount1 = this.formatNumber(drugFeeClassInfos[i].chargeAmount ) || "0.00";

        }
        if(typeof examFeeClassInfos !== "undefined" && typeof examFeeClassInfos[i] !== "undefined" ){
            obj.className2 = examFeeClassInfos[i].className || "";
            obj.chargeAmount2 = this.formatNumber(examFeeClassInfos[i].chargeAmount ) || "0.00";
        }
        if(typeof treatFeeClassInfos !== "undefined" && typeof treatFeeClassInfos[i] !== "undefined" ){
            obj.className3 = treatFeeClassInfos[i].className || "";
            obj.chargeAmount3 = this.formatNumber(treatFeeClassInfos[i].chargeAmount ) || "0.00";
        }
        if(typeof otherFeeClassInfos !== "undefined" && typeof otherFeeClassInfos[i] !== "undefined"){
          obj.className4 = otherFeeClassInfos[i].className || "";
          obj.chargeAmount4 = this.formatNumber(otherFeeClassInfos[i].chargeAmount ) || "0.00";
        }
        arr.push(obj);
      }
      printData.inBillsData = arr;
      console.info(printData);
      onPreview(printData, "广东省医疗收费票据住院专用");
    }, */
    async handlePrintData() {
      /* this.receiptContent = {
        actualSelfPayMoney: 49.24,
        actualTotalPayMoney: 49.24,
        cashChangeAmt: 0,
        chargeUnitName: "长岭社康中心",
        chargeUserName: "长岭社康中心管理员",
        clinicType: "3",
        companyName: "自费病人",
        deratePayAmount: 0.0,
        // 医药费
        drugFeeClassInfos: [
          {
            chargeAmount: 0.99,
            classCode: "12",
            className: "中草药",
          },
          {
            chargeAmount: 0.35,
            classCode: "2",
            className: "西药费",
          },
        ],
        emrCode: "JINP210416002",
        examFeeClassInfos: [],
        freePayAmount: 0.0,
        hospitalType: "综合性医院",
        inDays: 1,
        inpPrepayPayTypeClassSumDTOS: [
          {
            payTypeClassCode: "cash",
            payTypeClassName: "现金",
            totalPrepayMoney: 49.24,
          },
        ],
        otherFeeClassInfos: [
          {
            chargeAmount: 3.9,
            classCode: "10",
            className: "材料费",
          },
        ],
        patientCode: "PC2104160011",
        patientGender: "2",
        patientName: "杨样子",
        printTime: "2021-05-11 14:52:35",
        printUserId: "402847fb785e18ae01785e18ae210011",
        printUserName: "长岭社康中心管理员",
        reCheckUserName: "长岭社康中心管理员",
        receiptNum: "SJ00028SJ",
        selfPayAmount: 49.24,
        selfPayPrepay: 49.24,
        startTime: "2021-04-16 16:06:49",
        stopTime: "2021-04-16 18:02:45",
        totalAmt: 49.24,
        treatFeeClassInfos: [
          {
            chargeAmount: 44.0,
            classCode: "15",
            className: "治疗费",
          },
        ],
      }; */
      let index = getPrinterList();
      index = 3;
      let obj = createData(this.receiptContent, this.dayjs);
      // let {code, data} = await getPrintTpl(codes.inpInanceTpl);
      // if(code != 1) return;
      // print(index, data.value, {}, obj, true);
      print(index, "inFinanceTpl", {}, obj, true);
    },
    /**
     * 来自Soujer新算法
     * @param amount
     * @returns {string}
     */
    changeRMB(amount) {
      if (isNaN(amount) || amount >= 1000000) return "无效金额！"; //数值最大不超过100万
      let sPrefix = amount < 0 ? "(负)" : ""; //将负号‘-’显示成汉字‘(负)’
      let sAmount = Math.abs(amount).toFixed(2); //格式化成两位小数格式（两位小数对应“'角”和“分”）
      let sUnit = "拾万仟佰拾元角分";
      let sCapital = "零壹贰叁肆伍陆柒捌玖"; //10个大写数字
      sAmount = sAmount.replace(".", ""); //去除小数点（使数字与权位对应）
      let str = "";
      if (sAmount.length < sUnit.length) {
        for (let i = 0, len = sUnit.length - sAmount.length; i < len; i++) {
          //拼接数字与权位单位
          str += "" + "0";
        }
      }
      sAmount = str + sAmount;
      console.info(sAmount);
      let sOutput = "";
      for (let i = 0, len = sAmount.length; i < len; i++) {
        //拼接数字与权位单位
        sOutput +=
          sCapital.substr(sAmount.substr(i, 1), 1) + sUnit.substr(i, 1);
      }
      return sPrefix + sOutput;
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getTableData();
    },
  },
};
</script>

<style scoped lang="scss">
.font-size {
  font-size: $l-font-size;
}
.bill-cont {
  height: calc(100% - 55px);
  padding: 10px;
}
</style>
