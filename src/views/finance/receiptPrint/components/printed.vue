<template>
  <div class="width100 height100 printed">
    <el-row :gutter="10" style="padding: 8px 0">
      <el-col :span="2">
        <l-card-title style="padding: 8px 0">
          <span slot="left">票据明细</span>
        </l-card-title>
      </el-col>
      <el-col :span="6">
        <LFormtTitle label="打印时间">
          <el-date-picker
            v-model="date"
            class="width100"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            clearable
          ></el-date-picker>
        </LFormtTitle>
      </el-col>
      <el-col :span="16">
        <el-button type="primary" plain @click="getReceiptDetail"
          >查询</el-button
        >
        <el-button type="primary" plain @click="receiptPrintFun('A5')"
          >打印费用明细（A5）</el-button
        >
        <el-button type="primary" plain @click="receiptPrintFun('A4')"
          >打印费用明细（A4）</el-button
        >
      </el-col>
    </el-row>
    <div class="width100 tableDiv">
      <el-table
        :data="tableData"
        width="100%"
        height="calc(50% - 79px)"
        stripe
        border
        v-loadmore="load"
        v-loading="loading"
        :element-loading-text="$t('retreat.loadInfo')"
        highlight-current-row
        @row-click="selectTradeDetail"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40px"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          v-for="(item, index) in tableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
          :type="item.type"
        >
          <template slot-scope="scope">
            <template v-if="item.prop == 'receiptType'">
              <span
                :val="scope.row['receiptType']"
                code="RECEIPT_TYPE"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.prop == 'recordStatus'">
              <span v-if="scope.row[item.prop] == '1'">已开票</span>
              <span v-if="scope.row[item.prop] == '2'">已退票</span>
              <span v-if="scope.row[item.prop] == '9'">退票</span>
            </template>
            <template v-else-if="item.prop == 'totalMoney'">
              <span v-if="scope.row[item.prop]">{{
                formatNumber(scope.row[item.prop])
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'selfPayMoney'">
              <span v-if="scope.row[item.prop]">{{
                formatNumber(scope.row[item.prop])
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'freePayMoney'">
              <span v-if="scope.row[item.prop]">{{
                formatNumber(scope.row[item.prop])
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'derateAmount'">
              <span v-if="scope.row[item.prop]">{{
                formatNumber(scope.row[item.prop])
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'couponPay'">
              <span v-if="scope.row[item.prop]">{{
                formatNumber(scope.row[item.prop])
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'bxMoney'">
              <span v-if="scope.row[item.prop]">{{
                formatNumber(scope.row[item.prop])
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'ybMoney'">
              <span v-if="scope.row[item.prop]">{{
                formatNumber(scope.row[item.prop])
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>

      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>

      <el-row :gutter="10" class="width100" style="height: 50%">
        <el-col :span="16" class="height100">
          <l-card-title class="float-left" style="padding: 8px 0">
            <span slot="left">交易记录</span>
          </l-card-title>
          <el-table
            :data="tableDataTwo"
            width="100%"
            height="calc(100% - 79px)"
            stripe
            border
            v-loading="loadingTwo"
            :element-loading-text="$t('retreat.loadInfo')"
            highlight-current-row
            @row-click="getChargeDetail"
          >
            <el-table-column
              v-for="(item, index) in tableParamsTwo"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'settlementType'">
                  <span
                    :val="scope.row['settlementType']"
                    code="settlementType"
                    v-codeTransform
                  ></span>
                </template>
                <template v-else-if="item.prop == 'ouptDeptId'">
                  <span
                    tableName="sys_org"
                    :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row[item.prop],
                    }"
                    columns="org_nm"
                    v-tableTransform
                  ></span>
                </template>
                <template v-else-if="item.prop == 'totalMoney'">
                  <span v-if="scope.row[item.prop]">{{
                    formatNumber(scope.row[item.prop])
                  }}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else-if="item.prop == 'selfPayMoney'">
                  <span v-if="scope.row[item.prop]">{{
                    formatNumber(scope.row[item.prop])
                  }}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else-if="item.prop == 'freePayMoney'">
                  <span v-if="scope.row[item.prop]">{{
                    formatNumber(scope.row[item.prop])
                  }}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else-if="item.prop == 'derateAmount'">
                  <span v-if="scope.row[item.prop]">{{
                    formatNumber(scope.row[item.prop])
                  }}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else-if="item.prop == 'couponPay'">
                  <span v-if="scope.row[item.prop]">{{
                    formatNumber(scope.row[item.prop])
                  }}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else-if="item.prop == 'bxMoney'">
                  <span v-if="scope.row[item.prop]">{{
                    formatNumber(scope.row[item.prop])
                  }}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else-if="item.prop == 'ybMoney'">
                  <span v-if="scope.row[item.prop]">{{
                    formatNumber(scope.row[item.prop])
                  }}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              background
              @size-change="handleSizeChangeTwo"
              @current-change="handleCurrentChangeTwo"
              :current-page="pageParamsTwo.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageParamsTwo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageParamsTwo.total"
            ></el-pagination>
          </div>
        </el-col>
        <el-col :span="8" class="height100">
          <l-card-title class="float-left" style="padding: 8px 0">
            <span slot="left">费用明细</span>
          </l-card-title>
          <el-table
            :data="tableDataThree"
            width="100%"
            height="calc(100% - 79px)"
            stripe
            border
            v-loading="loadingThree"
            :element-loading-text="$t('retreat.loadInfo')"
            highlight-current-row
          >
            <el-table-column
              v-for="(item, index) in tableParamsThree"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'classCode'">
                  <!-- <span :val="scope.row['classCode'] || ''" code="FinClassCode" v-codeTransform></span> -->
                  <span>{{ scope.row.classCodeName }}</span>
                </template>
                <template v-else-if="item.prop == 'chargePrice'">
                  <span v-if="scope.row[item.prop]">{{
                    scope.row[item.prop].toFixed(4)
                  }}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else-if="item.prop == 'chargeUnit'">
                  <span
                    v-if="!isChinese(scope.row[item.prop])"
                    :val="scope.row[item.prop]"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
                <template v-else-if="item.prop == 'totalMoney'">
                  <span v-if="scope.row[item.prop]">{{
                    formatNumber(scope.row[item.prop])
                  }}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              background
              @size-change="handleSizeChangeThree"
              @current-change="handleCurrentChangeThree"
              :current-page="pageParamsThree.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageParamsThree.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageParamsThree.total"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import service from "@/api/cis/receiptPrint/receiptPrint";
import {
  getTableDatas,
  getTableData,
  transformCodeList,
  transformCode,
} from "@/api/directive/directiveRequest";
import {
  // print,
  preview,
  onPreview,
  onPreviewData,
  getMacLoaction,
} from "@/utils/print";
import { print } from "@/utils/print_new.js";
import { deepClone } from "@/utils/index";
import codes from "@/printTemplete/code.js";
import { getPrintTpl } from "@/api/admin/print/print";
import {
  t3A5,
  t3A4,
  t3A5Old,
  t3A4Old,
  generateTable,
  printNew,
} from "@/printTemplete/module/t3.js";
import Base64 from "@/utils/base64.js";
import { getUserName } from "@/utils/auth";

Date.prototype.toLocaleStr = function () {
  var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
  var day = ("0" + this.getDate()).slice(-2);
  return this.getFullYear() + "-" + month + "-" + day;
};

export default {
  props: {
    patientId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 打印费用明细
      receiptPrintList: [],
      receiptPrintListData: [],
      codeTransformList: {},
      // 时间
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59",
      ],
      //
      loading: false,
      loadingTwo: false,
      loadingThree: false,
      // 表格数据
      tableData: [],
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      // 交易分页
      pageParamsTwo: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      // 费用明细分页
      pageParamsThree: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      // 表格列
      tableParams: [
        {
          prop: "receiptNum",
          label: "票据号",
          align: "left",
          headerAlign: "center",
          width: "120",
        },
        {
          prop: "recordStatus",
          label: "票据状态",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "companyName",
          label: "单位名称",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "printUserName",
          label: "打印人员",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "printTime",
          label: "打印时间",
          align: "left",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "totalMoney",
          label: "总金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "selfPayMoney",
          label: "自付金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "freePayMoney",
          label: "记账金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "derateAmount",
          label: "减免金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "couponPay",
          label: "优惠券金额",
          align: "right",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "bxMoney",
          label: "报销金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
        {
          // 医保金额
          prop: "ybMoney",
          label: "个人账户金额",
          align: "right",
          headerAlign: "center",
          width: "120",
        },
      ],
      tableDataTwo: [],
      tableParamsTwo: [
        {
          prop: "settlementTypeName",
          label: "结算类型",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "chargeUserName",
          label: "收费员",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "chargeTime",
          label: "交易时间",
          align: "left",
          headerAlign: "center",
          width: "160",
        },
        // {
        //   prop: "userType",
        //   label: "人员类别",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        {
          prop: "ouptDeptId",
          label: "专科",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "doctorName",
          label: "医生姓名",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "totalMoney",
          label: "总金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "selfPayMoney",
          label: "自付金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "freePayMoney",
          label: "记账金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "derateAmount",
          label: "减免金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "couponPay",
          label: "优惠券金额",
          align: "right",
          headerAlign: "center",
          width: "110",
        },
        {
          prop: "bxMoney",
          label: "报销金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
        {
          // 医保金额
          prop: "ybMoney",
          label: "账户金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
      ],
      tableDataThree: [],
      // 收费项目明细列
      tableParamsThree: [
        {
          prop: "classCode",
          label: "财务分类",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "chargeItemName",
          label: "收费项目名称",
          align: "left",
          headerAlign: "center",
          width: "140",
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          headerAlign: "center",
          width: "80",
        },
        {
          prop: "chargeQuantity",
          label: "数量",
          align: "right",
          headerAlign: "center",
          width: "70",
        },
        {
          prop: "chargeUnit",
          label: "单位",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "chargePrice",
          label: "单价",
          align: "right",
          headerAlign: "center",
          width: "70",
        },
        {
          prop: "totalMoney",
          label: "金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
      ],
      // 当前票据明细
      currentPJMX: {},
      currentJYJL: [],
      classCodeAllList: [], //打印列表用法
      t3A5: "",
      t3A4: "",
    };
  },
  watch: {
    patientId: {
      handler(value) {
        this.patientId = value;
        // this.date = [new Date(), new Date()];
        this.getReceiptDetail();
      },
    },
  },
  mounted() {
    // this.date = [new Date(), new Date()];
    // 查询票据明细
    // this.getReceiptDetail();
    this.classCodeAllFun();
  },
  methods: {
    // 打印费用明细   start
    handleSelectionChange(val) {
      this.receiptPrintList = [];
      this.receiptPrintListData = val;
      for (let i = 0; i < val.length; i++) {
        this.receiptPrintList.push(val[i].receiptId);
      }
    },
    async classCodeAllFun() {
      try {
        this.loading = true;
        let res = await service.classCodeAll({});
        if (res.code == "1") {
          this.classCodeAllList = res.data;
        } else {
          this.$message.error(error.msg || "获取费用类别失败");
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg || "获取费用类别失败");
      }
    },
    /* 分页符测试 */
    async printFunc(size) {
      if (!this.receiptPrintListData.length) {
        this.$message.error("请选择已开票的数据再进行打印！！");
        return;
      }
      let recordStatusStyle = false;
      for (let i = 0; i < this.receiptPrintListData.length; i++) {
        if (this.receiptPrintListData[i].recordStatus != "1") {
          recordStatusStyle = true;
          break;
        }
      }
      if (recordStatusStyle) {
        this.$message.error("请选择已开票的数据！！");
        return;
      }
      /* if (!this["t3" + size]) {
        let resTpl = await getPrintTpl(codes["t3" + size]);
        if (resTpl.code != 1) return;
        if (size === "A5") {
          this.t3A5 = resTpl.data;
        } else if (size === "A4") {
          this.t3A4 = resTpl.data;
        }
      } */

      let arr = [];
      for (let i in this.receiptPrintList) {
        try {
          let res = await service.receiptPrint({
            receiptId: this.receiptPrintList[i],
          });
          if (res.code == "1") {
            let printDataItem = res.data;
            let printDataItemObj = deepClone(printDataItem);
            printDataItemObj.RMB = this.changeRMB(printDataItem.totalAmount);
            printDataItem.freePayAmount = this.formatNumber(
              printDataItem.freePayAmount
            );
            printDataItemObj.selfPayAmount = this.formatNumber(
              printDataItem.selfPayAmount
            );
            printDataItemObj.deratePayAmount = this.formatNumber(
              printDataItem.deratePayAmount
            );
            printDataItemObj.totalAmount = this.formatNumber(
              printDataItem.totalAmount
            );
            let outpChargeDetailNewPOsData = [];
            for (let i in printDataItem.outpChargeDetailNewPOs) {
              let item = printDataItem.outpChargeDetailNewPOs[i];
              let obj = {};
              let datas = {
                tableName: "fin_class_code",
                columns: ["class_code_name"],
                conditionMap: {
                  fin_class_code: item.classCode,
                },
                deleted_status: "0",
              };
              await getTableData(datas).then((resData) => {
                this.codeTransformList = resData.data;
                obj.classCode = this.codeTransformList[0]["class_code_name"];
                obj.chargePrice = this.formatNumber(item.chargePrice, 4);
                obj.chargeQuantity = this.formatNumber(item.chargeQuantity);
                obj.totalMoney = this.formatNumber(item.totalMoney, 4);
                obj.freePayMoney = this.formatNumber(item.freePayMoney);
                obj.derateAmount = this.formatNumber(item.derateAmount);
                obj.siSelfAccountMoney = this.formatNumber(
                  item.siSelfAccountMoney
                );
                obj.selfPayAmount = this.formatNumber(item.selfPayAmount);
                obj.orderChargeItemQuantity = this.formatNumber(
                  item.orderChargeItemQuantity
                );
                this.$set(
                  outpChargeDetailNewPOsData,
                  outpChargeDetailNewPOsData.length,
                  {
                    ...item,
                    ...obj,
                  }
                );
              });
            }
            printDataItemObj.outpChargeDetailNewPOs =
              outpChargeDetailNewPOsData;
            printDataItemObj.siSelfAccountMoney = this.formatNumber(
              printDataItem.siSelfAccountMoney || 0
            );
            printDataItemObj.siFundPayMoney = this.formatNumber(
              printDataItem.siFundPayMoney || 0
            );
            let orgName =
              JSON.parse(localStorage.getItem("pamars")).hosName || "";
            let hosName = `${
              JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团"
            }`;
            printDataItemObj.title = "门诊费用清单";
            printDataItemObj.title = hosName + orgName + "门诊费用清单";
            printDataItemObj.chargeUserName =
              printDataItem.chargeUserName || "";
            printDataItemObj.printName = Base64.decode(getUserName()) || "";
            printDataItemObj.printTimes = this.dayjs(new Date()).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            arr.push(printDataItemObj);
          } else {
            this.$message.error(error.msg || "费用明细失败");
          }
        } catch (error) {}
      }
      let contentArr;
      for (let i in arr) {
        let tableContent = await generateTable(deepClone(arr[i]), size);
        this.$set(arr[i], "tableContent", tableContent);
        let content = size === "A5" ? t3A5 : t3A4;
        for (const key in arr[i]) {
          const value = arr[i][key];
          let re = new RegExp('"' + key + '"', "g");
          content = content.replace(re, '"' + value + '"');
        }
        contentArr += content;
      }

      printNew(null, "", {}, contentArr, "", size);
    },
    /* 分页符测试 */

    // 打印费用明细   end
    // load
    load() {},
    // 查询票据明细
    async getReceiptDetail() {
      this.currentPJMX = {};
      this.currentJYJL = [];
      try {
        if (!this.patientId || this.patientId == "") {
          this.$message.error("请选择患者");
          return;
        }
        this.loading = true;
        let obj = {
          patientId: this.patientId || undefined,
          pageNo: this.pageParams.pageNo, // 页码
          pageSize: this.pageParams.pageSize, // 页码大小
          sDate: "",
          eDate: "",
        };
        if (this.date && this.date.length > 1) {
          obj.sDate = this.date[0];
          obj.eDate = this.date[1];
        }
        let res = await service.getReceiptDetail(obj);
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.info(error);
        this.$message.error(error.msg || "查询票据明细失败");
      }
    },
    changeRMB(n) {
      var fraction = ["角", "分"];
      var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
      var unit = [
        ["元", "万", "亿"],
        ["", "拾", "佰", "仟"],
      ];
      var IsNum = Number(n);
      if (!isNaN(IsNum)) {
        var head = n < 0 ? "欠" : "";
        n = Math.abs(n);
        var s = "";
        for (var i = 0; i < fraction.length; i++) {
          s += (
            digit[Math.floor(((n * 100) / 10) * Math.pow(10, i)) % 10] +
            fraction[i]
          ).replace(/零./, "");
        }
        s = s || "整";
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
          var p = "";
          for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
          }
          s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
        }
        return (
          head +
          s
            .replace(/(零.)*零元/, "元")
            .replace(/(零.)+/g, "零")
            .replace(/^整$/, "零元整")
        );
      } else {
        return "";
      }
    },
    // 查询交易记录
    async selectTradeDetail(row) {
      if (!row.receiptId) {
        this.$message.error("请选择一条票据明细");
        return;
      }
      this.currentPJMX = row;
      this.tableDataThree = [];
      this.tableDataTwo = [];
      try {
        this.selectReceiptDetail(row);
        this.loadingTwo = true;
        let obj = {
          receiptId: row.receiptId,
          pageNo: this.pageParamsTwo.pageNo, // 页码
          pageSize: this.pageParamsTwo.pageSize, // 页码大小
        };
        let res = await service.getTradeDetailByReceiptIdPage(obj);
        this.tableDataTwo = res.data;

        this.pageParamsTwo.total = res.total;
        this.loadingTwo = false;
        // 查询收费明细
        let ids = [];
        if (this.tableDataTwo.length > 0) {
          this.tableDataTwo.forEach((val) => {
            ids.push(val.tradeId);
          });
          this.currentJYJL = ids;
          this.selectChargeDetail(ids);
        }
      } catch (error) {
        this.loadingTwo = false;
        console.log(error);
        this.$message.error(error.msg || "查询交易明细失败");
      }
    },
    // 查询收费明细
    async selectChargeDetail(tradeIds) {
      try {
        if (tradeIds.length <= 0) {
          this.tableDataThree = [];
          this.$message.error("请选择一条交易记录");
          return;
        }
        let obj = {
          tradeIds: tradeIds,
          pageNo: this.pageParamsThree.pageNo, // 页码
          pageSize: this.pageParamsThree.pageSize, // 页码大小
        };
        this.loadingThree = true;
        // let res = await service.getOutpChargeDetail(tradeIds);
        let res = await service.getOutpChargeDetailByPage(obj);
        this.pageParamsThree.total = res.total;
        res.data.forEach((item, index) => {
          item.index = index;
        });
        this.tableDataThree = res.data;
        this.loadingThree = false;
        this.$nextTick(() => {
          console.log(this.$refs.DrugUnit);
        });
      } catch (error) {
        this.loadingThree = false;
        console.info(error);
        this.$message.error(error.msg || "查询收费明细失败");
      }
    },
    isChinese(temp) {
      var re = /[\d]+/;
      if (re.test(temp)) return false;
      return true;
    },
    // 勾选交易明细
    selectReceiptDetail(data) {
      this.$emit("selectReceiptDetail", data);
    },
    // 筛选收费明细
    getChargeDetail(row) {
      let list = [];
      list.push(row.tradeId);
      this.currentJYJL = list;
      this.selectChargeDetail(list);
    },
    // 千位分隔
    formatNumber(a, num) {
      if (!a && num !== 4) {
        return "0.00";
      }
      if (!a && num === 4) {
        return "0.0000";
      }
      let fixNum = num || 2;
      let res = a
        .toFixed(fixNum)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    // 票据明细分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getReceiptDetail();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getReceiptDetail();
    },
    // 交易记录分页
    handleSizeChangeTwo(val) {
      this.pageParamsTwo.pageSize = val;
      this.selectTradeDetail(this.currentPJMX);
    },
    handleCurrentChangeTwo(val) {
      this.pageParamsTwo.pageNo = val;
      this.selectTradeDetail(this.currentPJMX);
    },
    // 费用明细分页
    handleSizeChangeThree(val) {
      this.pageParamsThree.pageSize = val;
      this.selectChargeDetail(this.currentJYJL);
    },
    handleCurrentChangeThree(val) {
      this.pageParamsThree.pageNo = val;
      this.selectChargeDetail(this.currentJYJL);
    },
    async receiptPrintFun(size) {
      if (!this.receiptPrintListData.length) {
        this.$message.warning("请至少选择一条已开票的数据！");
        return;
      }
      let recordStatusStyle = false;
      for (let i = 0; i < this.receiptPrintListData.length; i++) {
        if (this.receiptPrintListData[i].recordStatus != "1") {
          recordStatusStyle = true;
          break;
        }
      }
      if (recordStatusStyle) {
        this.$message.warning("请选择已开票的数据！");
        return;
      }
      for (let i in this.receiptPrintList) {
        await this.receiptPrintFunlist(this.receiptPrintList[i], size);
      }
    },
    async receiptPrintFunlist(id, size) {
      let obj = {
        receiptId: id,
      };
      try {
        this.loading = true;
        let res = await service.receiptPrint(obj);
        if (res.code == "1") {
          await this.receiptPrintFunData(res.data, size);
        } else {
          this.$message.error(error.msg || "费用明细失败");
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    async receiptPrintFunData(printData, size) {
      let printDataItem = printData;
      let printDataItemObj = deepClone(printDataItem);
      printDataItemObj.RMB = this.changeRMB(printDataItem.totalAmount);
      printDataItem.freePayAmount = this.formatNumber(
        printDataItem.freePayAmount
      );
      printDataItemObj.selfPayAmount = this.formatNumber(
        printDataItem.selfPayAmount
      );
      printDataItemObj.deratePayAmount = this.formatNumber(
        printDataItem.deratePayAmount
      );
      printDataItemObj.totalAmount = this.formatNumber(
        printDataItem.totalAmount
      );
      let outpChargeDetailNewPOsData = [];
      for (let i in printDataItem.outpChargeDetailNewPOs) {
        let item = printDataItem.outpChargeDetailNewPOs[i];
        let obj = {};
        obj.chargePrice = this.formatNumber(item.chargePrice, 4);
        obj.chargeQuantity = item.chargeQuantity;
        obj.totalMoney = this.formatNumber(item.totalMoney, 4);
        obj.freePayMoney = this.formatNumber(item.freePayMoney);
        obj.derateAmount = this.formatNumber(item.derateAmount);
        obj.siSelfAccountMoney = this.formatNumber(item.siSelfAccountMoney);
        obj.selfPayAmount = this.formatNumber(item.selfPayAmount);
        obj.orderChargeItemQuantity = this.formatNumber(
          item.orderChargeItemQuantity
        );
        this.$set(
          outpChargeDetailNewPOsData,
          outpChargeDetailNewPOsData.length,
          {
            ...item,
            ...obj,
          }
        );
        /* let datas = {
          tableName: "fin_class_code",
          columns: ["class_code_name"],
          conditionMap: {
            fin_class_code: item.classCode,
          },
          deleted_status: "0",
        };
        await getTableData(datas).then((resData) => {
          this.codeTransformList = resData.data;
          obj.classCode = this.codeTransformList[0]["class_code_name"];
          obj.chargePrice = this.formatNumber(item.chargePrice);
          obj.chargeQuantity = this.formatNumber(item.chargeQuantity);
          obj.totalMoney = this.formatNumber(item.totalMoney);
          obj.freePayMoney = this.formatNumber(item.freePayMoney);
          obj.derateAmount = this.formatNumber(item.derateAmount);
          obj.siSelfAccountMoney = this.formatNumber(item.siSelfAccountMoney);
          obj.selfPayAmount = this.formatNumber(item.selfPayAmount);
          obj.orderChargeItemQuantity = this.formatNumber(
            item.orderChargeItemQuantity
          );
          this.$set(
            outpChargeDetailNewPOsData,
            outpChargeDetailNewPOsData.length,
            {
              ...item,
              ...obj,
            }
          );
        }); */
      }
      printDataItemObj.outpChargeDetailNewPOs = outpChargeDetailNewPOsData;
      let tableContent = await generateTable(deepClone(printDataItemObj), size);
      printDataItemObj.tableContent = tableContent;
      printDataItemObj.siSelfAccountMoney =
        printDataItemObj.siSelfAccountMoney || "";
      printDataItemObj.siFundPayMoney = printDataItemObj.siFundPayMoney || "";
      let orgName = JSON.parse(localStorage.getItem("pamars")).hosName || "";
      let hosName = `${
        JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团"
      }`;
      printDataItemObj.title = hosName + orgName + "门诊费用清单";
      printDataItemObj.chargeUserName = printDataItemObj.chargeUserName || "";
      printDataItemObj.printName = Base64.decode(getUserName()) || "";
      printDataItemObj.printTimes = this.dayjs(new Date()).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      // let { code, data: dataTpl } = await getPrintTpl(codes.t3A5);
      // if (code != 1) return;
      let content = size === "A5" ? t3A5Old : t3A4Old;
      let flag = this.receiptPrintListData.length === 1 ? false : true;
      print(null, content, {}, printDataItemObj, flag);
    },
  },
};
</script>
<style lang="scss" scoped>
.printed {
  .title {
    height: 63px;
  }

  .tableDiv {
    height: calc(100% - 63px);
  }

  .page {
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
</style>
