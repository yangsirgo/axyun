<template>
  <div class="catalogue2 width100 height100 clearfix">
    <div class="catalogue-left height100 float-left">
      <el-row :gutter="8">
        <el-col :span="4">
          <l-read-card
            style="width: 250px; display: inline-block"
            ref="readCard"
            @readCard="getReadCard"
          ></l-read-card>
        </el-col>
        <el-col :span="4">
          <LFormtTitle label="患者编码">
            <el-input
              v-model="patientCode"
              placeholder="请输入患者编码"
              clearable
            ></el-input>
          </LFormtTitle>
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
          <LFormtTitle label="收费项目名称">
            <el-input
              v-model="chargeItemName"
              placeholder="请输入收费项目名称"
              clearable
            ></el-input>
          </LFormtTitle>
        </el-col>
        <el-col :span="8">
          <LFormtTitle label="收费时间">
            <el-date-picker
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
      </el-row>
      <el-row :gutter="8">
        <el-col :span="4">
          <l-formt-title label="收费员">
            <l-value-domain
              clearable
              type="select"
              :value.sync="searchValue.chargeUserId"
              remoteUrl="/user/page"
              :remoteParams="remoteParams"
              remoteShowKey="name"
              remoteValueKey="id"
              placeholder="请选择收费员"
              @change="roleChange"
            >
            </l-value-domain>
          </l-formt-title>
        </el-col>
        <el-col :span="4">
          <l-formt-title label="开单医生">
            <l-value-domain
              clearable
              :value.sync="searchValue.doctorId"
              remoteUrl="/admin/wadmin/hos-user"
              :remoteParams="{ hosId, utype: '1' }"
              remoteShowKey="name"
              remoteValueKey="id"
              placeholder="请选择开单医生"
            />
          </l-formt-title>
        </el-col>
        <el-col :span="4">
          <l-formt-title label="项目类型">
            <l-value-domain
              clearable
              filterable
              type="select"
              :value.sync="searchValue.finClassCode"
              remoteUrl="/finance-pub/classCode/getClassCodePO"
              remoteShowKey="classCodeName"
              remoteValueKey="finClassCode"
              placeholder="请选择收类型"
            >
            </l-value-domain>
          </l-formt-title>
        </el-col>
        <el-col :span="4">
          <l-formt-title label="是否免费">
            <el-select v-model="searchValue.freeFlag" placeholder="请选择">
              <el-option
                v-for="(item, index) in freeFlagOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <el-checkbox v-model="searchValue.drugFlag">不显示药品</el-checkbox>
          <el-checkbox v-model="searchValue.chargeNormalFlag"
            >正常收费</el-checkbox
          >
          <div class="float-right">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="resetHandler"
              >重置</el-button
            >
            <el-button
              type="primary"
              plain
              @click="setOut"
              >导出</el-button
            >
            <el-button
              type="primary"
              plain
              @click="printFuc('A4')"
              >打印(A4)</el-button
            >
            <el-button
              type="primary"
              plain
              @click="printFuc('A5')"
              >打印(A5)</el-button
            >
          </div>
        </el-col>
      </el-row>
      <div class="table-cont">
        <el-table
          ref="tableData"
          :data="tableData"
          width="100%"
          height="100%"
          stripe
          border
          show-summary
          :summary-method="getSummaries"
          v-loading="loading"
          :element-loading-text="$t('retreat.loadInfo')"
          highlight-current-row
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
                <!-- <span v-if="scope.row[item.prop] == '1'">收费</span>
                <span v-else-if="scope.row[item.prop] == '2'">已退费</span>
                <span v-else-if="scope.row[item.prop] == '9'">退费</span>
                <span v-else>{{ scope.row[item.prop] }}</span> -->
                <span>{{
                  recordStatusList[scope.row[item.prop]] || scope.row[item.prop]
                }}</span>
              </template>
              <template v-else-if="item.prop == 'chargeApprove'">
                <span v-if="scope.row[item.prop] == '0'">无需审批</span>
                <span v-else-if="scope.row[item.prop] == '1'">审批成公费</span>
                <span v-else-if="scope.row[item.prop] == '2'">审批成自费</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else-if="item.prop == 'willingSelfPay'">
                <span v-if="scope.row[item.prop] == '0'">否</span>
                <span v-else-if="scope.row[item.prop] == '1'">是</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else-if="item.prop == 'chargeType'">
                <span
                  :val="scope.row['chargeType']"
                  code="charge_type"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'classCode'">
                <span
                  tableName="fin_class_code"
                  :conditionMap="{
                    fin_class_code: scope.row[item.prop] || '',
                  }"
                  columns="class_code_name"
                  v-tableTransform
                  class="units classCode"
                ></span>
              </template>
              <template v-else-if="item.prop == 'drugApproach'">
                <span
                  :val="scope.row['drugApproach']"
                  code="MedicationRouteCode"
                  v-codeTransform
                ></span>
              </template>
              <template
                v-else-if="
                  item.prop == 'dosageUnit' || item.prop == 'useLevelUnit'
                "
              >
                <span
                  :val="scope.row[item.prop]"
                  code="DrugDoseUnit"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'dosageType'">
                <span
                  :val="scope.row['dosageType']"
                  code="DrugFormulationCode"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'skinTest'">
                <span
                  :val="scope.row['skinTest']"
                  code="SkinTestWay"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'drugUsage'">
                <span
                  :val="scope.row['drugUsage']"
                  code="MedicationRouteCode"
                  v-codeTransform
                ></span>
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
              <template v-else-if="item.prop == 'chargeQuantity'">
                <span v-if="scope.row[item.prop]">{{
                  formatNumber(scope.row[item.prop])
                }}</span>
                <span v-if="!scope.row[item.prop]">0.00</span>
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
import service from "@/api/financeManagement/outpChargeDetailNew";
import serviceSum from "@/api/financeManagement/sumOutpChargeDetailNew";
import services from "@/api/cis/receiptPrint/receiptPrint";
import { getPamars } from "@/utils/auth";
import { onExcel } from "@/utils/excel/excel";
import { print } from "@/utils/print_new";
import { deepClone } from "@/utils/index.js";
import {
  sumOutpChargeDetailNewA4,
  sumOutpChargeDetailNewA5,
  handlePrintData,
} from "@/printTemplete/module/sumOutpChargeDetailNew.js";
export default {
  name: "sumOutpChargeDetailNew",
  components: {},
  data() {
    return {
      hosId: "",
      finClassCodeList: {},
      searchValue: {
        chargeUserId: "",
        finClassCode: "",
        doctorId: "",
        drugFlag: true,
        chargeNormalFlag: true,
        freeFlag: "",
      },
      remoteParams: {
        pageSize: 210,
        page: 1,
        orderBy: "updated_at desc",
      },
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59",
      ],
      freeFlagOptions: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "是",
          value: "1",
        },
        {
          label: "否",
          value: "0",
        },
      ],
      loading: false,
      chargeDetailId: "",
      orderChargeDetailId: "",
      orderId: "",
      tradeId: "",
      deptList: {},
      patientName: "",
      patientId: "",
      chargeItemName: "",
      patientCode: "",
      prestoreCodeShow: {},
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "patientCode",
          label: "患者编码",
          align: "left",
          headerAlign: "left",
          width: "100",
          fixed: false,
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "left",
          width: "100",
          fixed: false,
        },
        {
          prop: "orderName",
          label: "医嘱名称",
          align: "left",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "classCode",
          label: "收费项目类型",
          align: "left",
          headerAlign: "center",
          width: "130",
        },
        {
          prop: "chargeItemName",
          label: "收费项目名称",
          align: "left",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "chargePrice",
          label: "收费单价",
          align: "right",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "chargeQuantity",
          label: "收费数量",
          align: "right",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "chargeUnit",
          label: "收费单位",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "totalMoney",
          label: "总金额",
          align: "right",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "derateAmount",
          label: "减免总额",
          align: "right",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "doctorName",
          label: "开单医生",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "orderTime",
          label: "开单日期",
          align: "left",
          headerAlign: "center",
          width: "130",
        },
        {
          prop: "chargeTime",
          label: "收费时间",
          align: "left",
          headerAlign: "center",
          width: "130",
        },
        {
          prop: "recordStatus",
          label: "状态标志",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "chargeUserName",
          label: "收费人",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
      ],
      cardInfo: {},
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 100,
        total: 0,
      },
      // 状态标识list
      recordStatusList: {
        1: "收费",
        2: "已退费",
        9: "退费",
      },
      sumOutpInfo: {
        totalChargeQuantity: "0.00",
        totalChargeAmt: "0.00",
        totalDerateAmt: "0.00",
      },
      tableDataInit: [],
    };
  },

  updated() {
    this.$nextTick(() => {
      this.$refs.tableData.doLayout();
    });
  },
  mounted() {
    this.hosId = JSON.parse(getPamars()).hosId;
    this.getInfos();
    // this.getClassCodePO();
  },
  methods: {
    resetHandler() {
      this.$refs.readCard.cardData = "";
      this.patientCode = "";
      this.patientName = "";
      this.chargeItemName = "";
      this.date = [];
      this.searchValue.chargeUserId = "";
      this.searchValue.finClassCode = "";
    },
    async getClassCodePO() {
      let res = await service.getClassCodePO();
      if (res.code === 1) {
        res.data.forEach((item) => {
          this.finClassCode[item.finClassCode] = item.classCodeName;
        });
      }
    },
    roleChange(data, obj) {
      console.info(obj);
      console.info(data);
      if (obj) {
        this.searchValue.chargeUserId = obj.id;
      } else {
        this.searchValue.chargeUserId = "";
      }
    },
    getReadCard(data) {
      //获取读卡信息
      this.cardInfo = data;
      this.pageParams.pageNo = 1;
      this.getInfos();
    },
    async getInfos() {
      let obj = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        chargeDetailId: this.chargeDetailId || "",
        orderChargeDetailId: this.orderChargeDetailId || "",
        orderId: this.orderId || "",
        tradeId: this.tradeId || "",
        patientId: this.cardInfo.patientId || "",
        patientName: this.patientName || "",
        patientCode: this.patientCode || "",
        chargeItemName: this.chargeItemName || "",
        chargeUserId: this.searchValue.chargeUserId || "",
        finClassCode: this.searchValue.finClassCode || "",
        doctorId: this.searchValue.doctorId || "",
        drugFlag: this.searchValue.drugFlag ? 0 : "",
        chargeNormalFlag: this.searchValue.chargeNormalFlag ? 1 : "",
        freeFlag: this.searchValue.freeFlag,
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
      await this.getListPageOutpChargeDetailNew(obj);
      await this.sumOutpChargeDetailNew(obj);
    },
    async getListPageOutpChargeDetailNew(obj) {
      this.loading = true;
      try {
        let res = await service.getListPageOutpChargeDetailNew(obj);
        if (res.code == 1) {
          this.tableData = res.data.map((item) => {
            item.totalMoney = item.totalMoney.toFixed(2);
            item.freePayMoney = item.freePayMoney.toFixed(2);
            item.derateAmount = item.derateAmount.toFixed(2);
            item.chargePrice = item.chargePrice.toFixed(4);
            return item;
          });
          this.pageParams.total = res.total;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    async sumOutpChargeDetailNew(obj) {
      try {
        let res = await serviceSum.sumOutpChargeDetailNew(obj);
        if (res.code == 1) {
          this.sumOutpInfo = {
            totalChargeQuantity:
              Number(res.data.totalChargeQuantity).toFixed(2) || "0.00",
            totalChargeAmt:
              Number(res.data.totalChargeAmt).toFixed(2) || "0.00",
            totalDerateAmt:
              Number(res.data.totalDerateAmt).toFixed(2) || "0.00",
          };
        }
      } catch (error) {}
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

        if (index === 6) {
          sums[index] = this.sumOutpInfo.totalChargeQuantity;
        } else if (index === 8) {
          sums[index] = "￥" + this.sumOutpInfo.totalChargeAmt;
        } else if (index === 9) {
          sums[index] = "￥" + this.sumOutpInfo.totalDerateAmt;
        } else {
          sums[index] = "";
        }
        /*const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            }
            return prev;
          }, 0.0);
          if (index === 6) {
            sums[index] = this.formatNumber(sums[index]);
          } else if (index === 9 || index === 8) {
            sums[index] = "￥" + this.formatNumber(sums[index]);
          } else {
            sums[index] = "";
          }
        } else {
          if (index === 1) {
            sums[index] = data.length + "人次";
          } else {
            sums[index] = "";
          }
        } */
      });
      return sums;
    },
    search() {
      this.cardInfo = {};
      if (this.$refs.readCard.cardData !== "") {
        this.$refs.readCard.getPatient();
      } else {
        this.pageParams.pageNo = 1;
        this.getInfos();
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getInfos();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getInfos();
    },
    async setOut() {
      let obj = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        chargeDetailId: this.chargeDetailId || "",
        orderChargeDetailId: this.orderChargeDetailId || "",
        orderId: this.orderId || "",
        tradeId: this.tradeId || "",
        patientId: this.cardInfo.patientId || "",
        patientName: this.patientName || "",
        patientCode: this.patientCode || "",
        chargeItemName: this.chargeItemName || "",
        chargeUserId: this.searchValue.chargeUserId || "",
        finClassCode: this.searchValue.finClassCode || "",
        doctorId: this.searchValue.doctorId || "",
        drugFlag: this.searchValue.drugFlag ? 0 : "",
        chargeNormalFlag: this.searchValue.chargeNormalFlag ? 1 : "",
        freeFlag: this.searchValue.freeFlag,
        exportType: 4
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
        var parent = document.getElementsByClassName("catalogue2")[0];

        var a = document.createElement('a');
        a.setAttribute("id","billHref");
        a.download = '诊疗项目费用明细.xls';
        a.href = e.target.result;
        parent.appendChild(a);
        let aDom = document.getElementById("billHref");
        aDom.click();
        parent.removeChild(aDom);
      }
      return;
      let tHeader = this.tableParams.map((item) => {
        return item.label;
      });
      let filterVal = this.tableParams.map((item) => {
        return item.prop;
      });
      let elTableRow =
        this.$refs.tableData.bodyWrapper.querySelectorAll(".el-table__row");
      let tableData = [];
      for (let i in this.tableData) {
        let obj = {};
        let item = this.tableData[i];
        let elTableRowItem = elTableRow[i];
        let units = elTableRowItem.querySelectorAll(".units");
        for (let j in units) {
          let items = units[j];
          if (items.className && items.className.indexOf(" ") > -1) {
            obj[items.className.split(" ")[1]] = items.innerText;
          }
        }
        obj = {
          ...item,
          recordStatus:
            this.recordStatusList[item.recordStatus] || item.recordStatus,
          ...obj,
        };
        tableData.push({ ...obj });
      }
      let excelData = {
        title: "门诊项目费用明细报表",
        tHeader,
        filterVal,
        listDate: tableData,
        fileName: "门诊项目费用明细报表",
        merges: ["A1:N1"],
      };
      onExcel(excelData);
    },
    async printFuc(size) {
      let obj = {
        pageNo: 1,
        pageSize: 200,
        total: 0,
        chargeDetailId: this.chargeDetailId || "",
        orderChargeDetailId: this.orderChargeDetailId || "",
        orderId: this.orderId || "",
        tradeId: this.tradeId || "",
        patientId: this.cardInfo.patientId || "",
        patientName: this.patientName || "",
        patientCode: this.patientCode || "",
        chargeItemName: this.chargeItemName || "",
        chargeUserId: this.searchValue.chargeUserId || "",
        finClassCode: this.searchValue.finClassCode || "",
        doctorId: this.searchValue.doctorId || "",
        drugFlag: this.searchValue.drugFlag ? 0 : "",
        chargeNormalFlag: this.searchValue.chargeNormalFlag ? 1 : "",
        freeFlag: this.searchValue.freeFlag,
      };
      if (this.date && this.date.length > 1) {
        obj.startChargeTime = this.dayjs(this.date[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        obj.endChargeTime = this.dayjs(this.date[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      this.tableDataInit = [];
      await this.getPrintData(obj);
      let printData = handlePrintData(
        {
          tableData: deepClone(this.tableDataInit),
          totalChargeQuantity: this.sumOutpInfo.totalChargeQuantity || "0.00",
          totalChargeAmt: this.sumOutpInfo.totalChargeAmt || "0.00",
          date: obj.startChargeTime + " ~ " + obj.endChargeTime,
        },
        size
      );
      let sumOutpChargeDetailNew =
        size === "A4" ? sumOutpChargeDetailNewA4 : sumOutpChargeDetailNewA5;
      print("", sumOutpChargeDetailNew, {}, printData, true);
    },
    async getPrintData(obj) {
      try {
        let res = await service.getListPageOutpChargeDetailNew(obj);
        if (res.code == 1) {
          let tableData = res.data.map((item) => {
            item.totalMoney = item.totalMoney.toFixed(2);
            item.freePayMoney = item.freePayMoney.toFixed(2);
            item.derateAmount = item.derateAmount.toFixed(2);
            item.chargePrice = item.chargePrice.toFixed(4);
            item.chargeTime = item.chargeTime.split(" ")[0];
            item.orderTime = item.orderTime.split(" ")[0];
            return item;
          });
          this.tableDataInit = this.tableDataInit.concat(tableData);
          if (obj.pageNo * obj.pageSize < res.total) {
            await this.getPrintData({
              ...obj,
              pageNo: obj.pageNo + 1,
            });
          }
        }
      } catch (error) {}
    },
    isChinese(temp) {
      var re = /[\d]+/;
      if (re.test(temp)) return false;
      return true;
    },
    // 千位分隔
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
  },
};
</script>
<style lang="scss" scoped>
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-20 {
  margin-top: 20px;
}
.catalogue2 {
  background-color: #fff;
  padding: 10px;
  .catalogue-left {
    width: 100%;

    .search-area {
      display: flex;
      .search-input {
        flex: 1;
      }
    }
    .table-cont {
      height: calc(100% - 160px);
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
      // margin-top: 10px;
    }
  }
  /deep/.el-table .cell{
   line-height: 40px !important;
   font-size: 16px;
  }
}
</style>
