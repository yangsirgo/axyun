<template>
  <div class="catalogue width100 height100 clearfix padding10">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="4">
              <l-read-card ref="readCard" @readCard="getReadCard"></l-read-card>
            </el-col>

            <el-col :span="4">
              <LFormtTitle label="患者姓名">
                <el-input
                  v-model="patientName"
                  placeholder="请输入患者姓名"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="患者编号">
                <el-input
                  v-model="patientCode"
                  placeholder="请输入患者编码"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="医嘱单号">
                <el-input
                  v-model="orderBillNum"
                  placeholder="请输入医嘱单号"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="医嘱收费明细ID">
                <el-input
                  v-model="orderChargeDetailId"
                  placeholder="请输入医嘱收费明细ID"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="交易ID">
                <el-input
                  v-model="tradeId"
                  placeholder="请输入交易ID"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="width100 margin-top-10">
            <el-col :span="4">
              <LFormtTitle label="开单科室">
                <l-value-domain
                  clearable
                  :value.sync="ouptDeptName"
                  remoteUrl="/appointment/doctorSchedule/getDept"
                  :remoteParams="{}"
                  remoteShowKey="deptName"
                  remoteValueKey="deptName"
                  placeholder="请选择开单科室"
                />
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="开单医生">
                <l-value-domain
                  clearable
                  :value.sync="doctorName"
                  remoteUrl="/admin/wadmin/hos-user"
                  :remoteParams="{ hosId, utype: '1' }"
                  remoteShowKey="name"
                  remoteValueKey="name"
                  placeholder="请选择开单医生"
                />
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="医嘱名称">
                <el-input
                  clearable
                  v-model="orderName"
                  placeholder="请输入医嘱名称"
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="7">
              <LFormtTitle label="收费时间">
                <el-date-picker
                  width="100%"
                  class="chargeTimePicker"
                  v-model="date"
                  type="datetimerange"
                  :default-time="['00:00:00', '23:59:59']"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :clearable="false"
                ></el-date-picker>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <el-button
                type="primary"
                plain
                class="float-right"
                @click="setOut"
                >导出</el-button
              >
              <el-button
                type="primary"
                plain
                class="float-right"
                style="margin-right: 6px"
                @click="reset"
                >重置</el-button
              >
              <el-button
                type="primary"
                class="float-right"
                style="margin-right: 6px"
                @click="search"
                >查询</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="table-cont">
        <el-table
          ref="tableData"
          :data="tableData"
          width="100%"
          height="100%"
          stripe
          border
          v-loading="loading"
          show-summary
          :summary-method="getSummaries"
          :element-loading-text="$t('retreat.loadInfo')"
          highlight-current-row
          @row-click="rowClick"
        >
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            sortable
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width || item.label.length * 18 + 24"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'recordStatus'">
                <span v-if="scope.row[item.prop] == '1'">收费</span>
                <span v-else-if="scope.row[item.prop] == '2'">已退费</span>
                <span v-else-if="scope.row[item.prop] == '9'">退费</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>

              <template v-else-if="item.prop == 'orderType'">
                <span
                  columns="doctors_advice_name"
                  :conditionMap="{ doctors_advice_code: scope.row.orderType }"
                  tableName="cnf_doctors_advice"
                  v-tableTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'orderSource'">
                <span
                  :val="scope.row['orderSource']"
                  code="orderSource"
                  v-codeTransform
                ></span>
              </template>
              <span v-else class="overflow-point">{{
                scope.row[item.prop]
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[50, 100, 200]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api/financeManagement/outpOrderChargeDetail";
import services from "@/api/cis/receiptPrint/receiptPrint";
import { getPamars } from "@/utils/auth";
import { onPreview } from "@/utils/print";
import { onExcel } from "@/utils/excel/excel";
import { deepClone } from "@/utils";
import {
  transformCodeFunc,
  transformTableFunc
} from "@/views/appointment/outpatientAppointment/utils/utils.js";
export default {
  name: "outpOrderChargeDetail",
  components: {},
  data() {
    return {
      hosId: "",
      ouptDeptName: "",
      doctorName: "",
      orderName: "",
      addStatus: false,
      loading: false,
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      orderChargeDetailId: "",
      tradeId: "",
      orderBillId: "",
      orderBillNum: "",
      patientName: "",
      patientCode: "",
      patientId: "",
      recordStatus: "",
      deptList: {},
      isTrue: {
        "0": "否",
        "1": "是"
      },
      prestoreCodeShow: {},
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "patientCode",
          label: "患者编号",
          align: "left",
          headerAlign: "left",
          width: "150",
          fixed: false
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "left",
          width: "150",
          fixed: false
        },
        {
          prop: "chargeTime",
          label: "收费时间",
          align: "left",
          headerAlign: "center",
          width: "170"
        },
        {
          prop: "orderTime",
          label: "开单日期",
          align: "left",
          headerAlign: "center",
          width: "170"
        },
        {
          prop: "orderType",
          label: "医嘱类型",
          align: "left",
          headerAlign: "center",
          width: "130"
        },
        {
          prop: "orderBillNum",
          label: "医嘱单号",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "orderName",
          label: "医嘱项目名称",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "orderQuantity",
          label: "医嘱数量",
          align: "right",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "totalMoney",
          label: "总金额",
          align: "right",
          headerAlign: "center",
          width: "150"
        },
        /* {
          prop: "freePayMoney",
          label: "记账金额",
          align: "right",
          headerAlign: "center",
          width: "150"
        }, */
        {
          prop: "derateAmount",
          label: "减免总额",
          align: "right",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "orderSource",
          label: "医嘱来源",
          align: "left",
          headerAlign: "center",
          width: "170"
        },
        {
          prop: "tradeId",
          label: "交易ID",
          align: "left",
          headerAlign: "center",
          width: "290"
        },
        {
          prop: "orderChargeDetailId",
          label: "医嘱收费明细ID",
          align: "left",
          headerAlign: "center",
          width: "290",
          fixed: false
        },
        {
          prop: "oldOrderChargeDetailId",
          label: "原医嘱收费明细ID",
          align: "left",
          headerAlign: "center",
          width: "290",
          fixed: false
        }

        // {
        //   prop: "orderId",
        //   label: "医嘱ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "orderItemId",
        //   label: "医嘱项目ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "170"
        // },
        // {
        //   prop: "orderCode",
        //   label: "医嘱项目CODE",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },

        // {
        //   prop: "orderBillId",
        //   label: "医嘱单ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },

        // {
        //   prop: "executeDeptId",
        //   label: "执行科室ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "executeDeptCode",
        //   label: "执行科室编码",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "executeDeptName",
        //   label: "执行科室名称",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "confirmQuantity",
        //   label: "确认数量",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "executeQuantity",
        //   label: "执行数量",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "pharmacyExecFlag",
        //   label: "药房执行标志",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "170"
        // },
        // {
        //   prop: "additionalFeeFlag",
        //   label: "附加费标志",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "relOrderChargeDetailId",
        //   label: "关联医嘱费用明细ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "thirdPartyOrderChargeTradeSerialNum",
        //   label: "第三方医嘱费用交易序列号",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },{
        //   prop: "callbackType",
        //   label: "回调方式",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },{
        //   prop: "callbackContent",
        //   label: "回调内容",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "callbackResult",
        //   label: "回调结果",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "partRefundFlag",
        //   label: "是否允许部分退",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        orderChargeDetailId: "",
        oldOrderChargeDetailId: "",
        tradeId: "",
        orderType: "",
        orderId: "",
        orderItemId: "",
        orderCode: "",
        orderName: "",
        orderQuantity: "",
        orderSource: "",
        orderTime: "",
        orderBillId: "",
        orderBillNum: "",
        totalMoney: "",
        freePayMoney: "",
        derateAmount: "",
        executeDeptId: "",
        executeDeptCode: "",
        executeDeptName: "",
        confirmQuantity: "",
        executeQuantity: "",
        pharmacyExecFlag: "",
        additionalFeeFlag: "",
        relOrderChargeDetailId: "",
        thirdPartyOrderChargeTradeSerialNum: "",
        callbackType: "",
        callbackContent: "",
        callbackResult: "",
        partRefundFlag: "",
        recordStatus: "1"
      },
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 100,
        total: 0
      },
      cardInfo: {}
    };
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.tableData.doLayout();
    });
  },
  mounted() {
    this.hosId = JSON.parse(getPamars()).hosId;
    this.getListPageOutpOrderChargeDetail();
  },
  methods: {
    // 千位分隔
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    // 表格总价设置方法
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));

        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            }
            return prev;
          }, 0.0);
          if (index === 7) {
            sums[index] = this.formatNumber(sums[index]);
          } else if (index === 8 || index === 9 || index === 10) {
            sums[index] = "￥" + this.formatNumber(sums[index]);
          } else {
            sums[index] = "";
          }
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    getReadCard(data) {
      //获取读卡信息
      this.cardInfo = data;
      this.pageParams.pageNo = 1;
      this.getListPageOutpOrderChargeDetail();
    },
    async getListPageOutpOrderChargeDetail() {
      this.loading = true;
      let obj = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        orderChargeDetailId: this.orderChargeDetailId,
        tradeId: this.tradeId,
        orderBillId: this.orderBillId,
        orderBillNum: this.orderBillNum,
        patientId: this.cardInfo.patientId,
        patientName: this.patientName,
        patientCode: this.cardInfo.patientCode || this.patientCode || "",
        startChargeTime: "",
        endChargeTime: "",
        ouptDeptName: this.ouptDeptName,
        doctorName: this.doctorName,
        orderName: this.orderName
      };
      if (this.date && this.date.length > 1) {
        obj.startChargeTime = this.dayjs(this.date[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        obj.endChargeTime = this.dayjs(this.date[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.$message.error("收费时间不能为空！");
        this.loading = false;
        return;
      }
      let res = await service.getListPageOutpOrderChargeDetail(obj);
      this.loading = false;
      this.tableData = res.data.map(item => {
        item.totalMoney = item.totalMoney.toFixed(2);
        item.freePayMoney = item.freePayMoney.toFixed(2);
        item.orderQuantity = item.orderQuantity.toFixed(2);
        item.derateAmount = item.derateAmount.toFixed(2);
        return item;
      });
      this.pageParams.total = res.total;
      if (typeof tableData !== "undefined") {
        this.currentData = this.tableData[0];
        this.$emit("currentData", this.currentData);
        this.form = { ...this.currentData };
      } else {
        this.currentData = [];
      }
    },
    search() {
      this.cardInfo = {};
      if (this.$refs.readCard.cardData !== "") {
        this.$refs.readCard.getPatient();
      } else {
        this.pageParams.pageNo = 1;
        this.getListPageOutpOrderChargeDetail();
      }
    },
    reset() {
      this.$refs.readCard.cardData = "";
      this.pageParams.pageNo = 1;
      this.orderChargeDetailId = "";
      this.tradeId = "";
      this.orderBillId = "";
      this.orderBillNum = "";
      this.patientName = "";
      this.patientCode = "";
      this.startChargeTime = "";
      this.endChargeTime = "";
      this.ouptDeptName = "";
      this.doctorName = "";
      this.orderName = "";
      this.date = [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ];
      this.cardInfo.patientId = "";
      this.cardInfo.patientCode = "";
    },
    rowClick(row) {
      this.currentData = row;
      this.$emit("currentData", this.currentData);
      this.form = { ...this.currentData };
      this.addStatus = false;
      // this.form.grantDepartmentId = parseInt(row.grantDepartmentId);
    },
    async add() {
      this.form = {
        orderChargeDetailId: "",
        oldOrderChargeDetailId: "",
        tradeId: "",
        orderType: "",
        orderId: "",
        orderItemId: "",
        orderCode: "",
        orderName: "",
        orderQuantity: "",
        orderSource: "",
        orderTime: "",
        orderBillId: "",
        orderBillNum: "",
        totalMoney: "",
        freePayMoney: "",
        derateAmount: "",
        executeDeptId: "",
        executeDeptCode: "",
        executeDeptName: "",
        confirmQuantity: "",
        executeQuantity: "",
        pharmacyExecFlag: "",
        additionalFeeFlag: "",
        relOrderChargeDetailId: "",
        thirdPartyOrderChargeTradeSerialNum: "",
        callbackType: "",
        callbackContent: "",
        callbackResult: "",
        partRefundFlag: "",
        recordStatus: "1"
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.OnlinePaySettlementDetailId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delOnlinePaySettlementDetailById(
          this.form.OnlinePaySettlementDetailId
        );
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.getListPageOutpOrderChargeDetail();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "删除失败");
      }
    },
    async save() {
      if (this.addStatus) {
        try {
          this.$showLoading();
          console.log(this.form);
          let res = await service.addOnlinePaySettlementDetail(this.form);
          this.$hideLoading();
          if (res.code === 1) {
            this.$message({ type: "success", message: "新增成功" });
            this.getListPageOutpOrderChargeDetail();
          } else {
            this.$message({ type: "flag", message: "新增失败" });
          }
        } catch (error) {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "新增失败");
        }
      } else {
        try {
          this.$showLoading();
          let res = await service.updateOnlinePaySettlementDetail(this.form);
          this.$hideLoading();
          this.$message({ type: "success", message: "保存成功" });
          this.getListPageOutpOrderChargeDetail();
        } catch (error) {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "保存失败");
        }
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getListPageOutpOrderChargeDetail();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getListPageOutpOrderChargeDetail();
    },
    //导出
    async setOut() {
      let obj = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        orderChargeDetailId: this.orderChargeDetailId,
        tradeId: this.tradeId,
        orderBillId: this.orderBillId,
        orderBillNum: this.orderBillNum,
        patientId: this.cardInfo.patientId,
        patientName: this.patientName,
        patientCode: this.cardInfo.patientCode || this.patientCode || "",
        startChargeTime: "",
        endChargeTime: "",
        ouptDeptName: this.ouptDeptName,
        doctorName: this.doctorName,
        orderName: this.orderName,
        exportType: 2,
      };
      if (this.date && this.date.length > 1) {
        obj.startChargeTime = this.dayjs(this.date[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        obj.endChargeTime = this.dayjs(this.date[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.$message.error("收费时间不能为空！");
        return;
      }
      let res = await services.exportChargeExcel(obj);
      var blob = res;
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        var parent = document.getElementsByClassName("catalogue")[0];

        var a = document.createElement('a');
        a.setAttribute("id","billHref");
        a.download = '门诊医嘱费用明细.xls';
        a.href = e.target.result;
        parent.appendChild(a);
        let aDom = document.getElementById("billHref");
        aDom.click();
        parent.removeChild(aDom);
      }
      return;
      let tHeader = this.tableParams.map(item => {
        return item.label;
      });
      let filterVal = this.tableParams.map(item => {
        return item.prop;
      });
      let tableData = deepClone(this.tableData);
      for (let i in tableData) {
        let orderType = "";
        try {
          orderType = await transformTableFunc(
            "doctors_advice_name",
            {
              doctors_advice_code: tableData[i]["orderType"] || ""
            },
            "cnf_doctors_advice"
          );
        } catch (error) {
          orderType = "";
        }
        tableData[i]["orderType"] = orderType;
        let orderSource = "";
        try {
          orderSource = await transformCodeFunc(
            "name",
            "orderSource",
            tableData[i]["orderSource"] || ""
          );
        } catch (error) {
          orderSource = "";
        }
        tableData[i]["orderSource"] = orderSource;
        let recordStatus =
          tableData[i]["recordStatus"] == "1"
            ? "收费"
            : tableData[i]["recordStatus"] == "2"
            ? "已退费"
            : tableData[i]["recordStatus"] == "9"
            ? "退费"
            : "";
        tableData[i]["recordStatus"] = recordStatus;
      }
      console.log(tableData);
      let excelData = {
        title: "门诊医嘱费用明细",
        tHeader,
        filterVal,
        listDate: tableData,
        fileName: "门诊医嘱费用明细",
        merges: ["A1:P1"]
      };
      onExcel(excelData);
    }
  }
};
</script>
<style lang="scss" scoped>
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-20 {
  margin-top: 20px;
}
.catalogue {
  background-color: #fff;
  .catalogue-left {
    width: 100%;

    // border-right: 1px solid $l-color-bgcolor-11;
    .search-area {
      display: flex;
      .search-input {
        flex: 1;
      }
    }
    .table-cont {
      height: calc(100% - 150px);
      margin: 20px 0;
    }
    .page {
      text-align: right;
      .el-pagination {
        padding: 0;
        /deep/ .el-pagination__editor.el-input .el-input__inner {
          height: 100% !important;
        }
      }
    }
  }
  .catalogue-right {
    width: 300px;
    padding: 10px;
    overflow-y: scroll;
    .catalogue-right-form {
      // height: calc(100% - 46px);
      border-bottom: 1px solid $l-color-bgcolor-11;
    }
    .catalogue-right-btn {
      margin-top: 10px;
    }
  }
  /deep/.el-table .cell{
   line-height: 40px !important;
   font-size: 16px;
  }
}
</style>
