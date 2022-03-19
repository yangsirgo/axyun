<template>
  <div class="out-storage width100 height100">
    <el-form :inline="true" :model="searchData">
      <div class="search-input clearfix">
        <div style="float:left;width:550px">
          <span>出库时间：</span>
          <el-date-picker
            v-model="searchData.date"
            type="datetimerange"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <!-- <el-date-picker
            style="display: inline-block;"
            v-model="searchData.startTime"
            type="datetime"
            :editable="false"
            default-time="['00:00:00']"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
          ></el-date-picker>
          <span style="padding: 0 3px">--</span>
          <el-date-picker
            style="display: inline-block;"
            v-model="searchData.endTime"
            type="datetime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
          ></el-date-picker>-->
        </div>
        <div style="float:right;">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="print">打印</el-button>
          <el-button type="primary" plain @click="exportTable">导出</el-button>
        </div>
      </div>
    </el-form>
    <div class="out-storage-cont">
      <el-table
        ref="singleTable"
        :data="drugData"
        border
        stripe
        width="100%"
        height="100%"
        highlight-current-row
        v-loading="tlm_isLoading"
        @header-dragend="headerDragend"
        element-loading-text="加载中..."
      >
        <el-table-column
          v-for="(item, index) in drugParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :fixed="item.fixed"
          :show-overflow-tooltip="item.tooltipShow"
        >
          <template slot-scope="scope">
            <template v-if="item.prop == 'originCode'">
              <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'formCode'">
              <span
                tableName="hrp_form"
                :conditionMap="{form_code: scope.row.formCode}"
                columns="form_name"
                v-tableTransform
              ></span>
            </template>
            <template v-else-if="item.prop == 'originIdentificationCode'">
              <span
                :val="scope.row.originIdentificationCode"
                code="DrugManufacturerFlag"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.prop === 'outType'">
              <span>{{ wayShowObj[scope.row.outType] }}</span>
            </template>
            <template v-else-if="item.prop == 'supplierCode'">
              <span :val="scope.row.supplierCode" code="DrugSupplier" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop === 'outQuantity'">
              {{scope.row.outfit}}
              <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
              <template v-if="scope.row.bluk !== 0">
                {{scope.row.bluk}}
                <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
              </template>
            </template>
            <template v-else-if="item.prop == 'purchasePrice'">
              <span>{{ formatNum(scope.row.purchasePrice) }}</span>
            </template>
            <template v-else-if="item.prop == 'totalAmt'">
              <span>{{ formatNum(scope.row.totalAmt) }}</span>
            </template>
            <template v-else-if="item.prop == 'price'">
              <span>{{ formatNum(scope.row.price) }}</span>
            </template>
            <template v-else-if="item.prop == 'amt'">
              <span>{{ formatNum(scope.row.amt) }}</span>
            </template>
            <template v-else-if="item.prop == 'expDate'">
              <span>{{ dateFormat(scope.row.expDate)}}</span>
            </template>
            <template v-else>
              <span class="overflow-point">{{ scope.row[item.prop] }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        background
        @size-change="changeSize"
        @current-change="changePage"
        :current-page="pageParams.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import stock from "@/api/hmm/stock";
import hmmBaseApi from "@/api/hmm/base";
import { print, preview, onPreview } from "@/utils/print";
import { onExcel } from "@/utils/excel/excel";
import { blukToOutfit } from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";
import { refToArr } from "@/utils/util.js";

export default {
  name: "outStorage",
  props: ["drugId"],
  data() {
    return {
      //搜索数据
      searchData: {
        date: []
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      //表格
      drugParams: [
        {
          prop: "drugName",
          label: "药品名称",
          align: "left",
          width: "218",
          fixed: "left",
          tooltipShow:true
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          width: "160",
          fixed: false,
          tooltipShow:true
        },
        {
          prop: "formCode",
          label: "剂型",
          align: "left",
          width: "120",
          fixed: false,
          tooltipShow:true
        },
        {
          prop: "outTime",
          label: "出库时间",
          align: "left",
          width: "180",
          fixed: false,
          tooltipShow:true
        },
        {
          prop: "outQuantity",
          label: "数量",
          align: "left",
          width: "140",
          fixed: false,
          tooltipShow:false
        },
        {
          prop: "outType",
          label: "出库类型",
          align: "left",
          width: "120",
          fixed: false,
          tooltipShow:true
        },
        {
          prop: "outNum",
          label: "单号",
          align: "left",
          width: "88",
          fixed: false,
          tooltipShow:true
        },
        {
          prop: "inId",
          label: "批次",
          align: "left",
          width: "88",
          fixed: false,
          tooltipShow:true
        },
        {
          prop: "purchasePrice",
          label: "进价(元)",
          align: "right",
          width: "120",
          fixed: false,
          tooltipShow:false
        },
        {
          prop: "totalAmt",
          label: "进价金额(元)",
          align: "right",
          width: "160",
          fixed: false,
          tooltipShow:false
        },
        {
          prop: "price",
          label: "售价(元)",
          align: "right",
          width: "120",
          fixed: false,
          tooltipShow:false
        },
        {
          prop: "amt",
          label: "售价金额(元)",
          align: "right",
          width: "160",
          fixed: false,
          tooltipShow:false
        },
        {
          prop: "originCode",
          label: "生产厂商",
          align: "left",
          width: "200",
          fixed: false,
          tooltipShow:true

        },
        {
          prop: "originIdentificationCode",
          label: "生产厂商标适",
          align: "left",
          width: "120",
          fixed: false,
          tooltipShow:true
        },
/*        {
          prop: "supplierCode",
          label: "供应商",
          align: "left",
          width: "200",
          fixed: false,
          tooltipShow:true
        },*/
        {
          prop: "batchNum",
          label: "生产批号",
          align: "left",
          width: "120",
          fixed: false,
          tooltipShow:true
        },
        {
          prop: "expDate",
          label: "有效期",
          align: "left",
          width: "142",
          fixed: false,
          tooltipShow:true
        },
/*        {
          prop: "recordRemark",
          label: "备注",
          align: "left",
          width: "168",
          fixed: false,
          tooltipShow:true
        },*/
        {
          prop: "outUserName",
          label: "出库人员",
          align: "left",
          width: "80",
          fixed: false,
          tooltipShow:true
        }
      ],
      drugData: [], //表格数据
      drugDataUnit: [], //当前页数据
      total: 0,
      tlm_isLoading: false,
      wayShowObj: {}
    };
  },
  created() {
    this.getWayShow();
    this.getCurrentMonthFirst();
    this.getCurrentMonthLast();
    this.search();
  },
  methods: {
    //  格式化日期
    dateFormat(date) {
      if (date == undefined) {
        return ''
      }
      return new Date(date).format("yyyy-MM-dd")
    },
    formatNum(num) {
      return formatNum(num);
    },
    getCurrentMonthFirst() {
      var date = new Date();
      date.setDate(1);
      var year = date.getFullYear().toString();
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      let startTime = year + "-" + month + "-" + day + " 00:00:00";
      this.searchData.date.push(startTime);
    },
    getCurrentMonthLast() {
      var date = new Date();
      var year = date.getFullYear().toString();
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      let endTime =
        year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
      this.searchData.date.push(endTime);
    },
    //获取药品列表
    async getDrugList() {
      this.tlm_isLoading = true;
      try {
        //获取药品数据接口,传参searchData,drugId
        let response = await stock.getOutStorage({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          ids: this.drugId,
          currDrugStorage: "1",
          hasStock: this.searchData.hasStock,
          sDate: this.searchData.date && this.searchData.date[0] || "",
          eDate: this.searchData.date && this.searchData.date[1] || ""
        });
        let { code, data } = response;
        if (code === 1) {
          this.pageParams.total = response.total;
          let list = data.map(item => {
            let { out, bl } = blukToOutfit(item.outQuantity, item.packQuantity);
            return {
              ...item,
              outfit: out,
              bluk: bl
            };
          });
          this.drugData = list;
        }
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
      }
    },
    search() {
      this.pageParams.pageNo = 1;
      this.getDrugList();
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.getDrugList();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.getDrugList();
    },
    //打印
    print() {
      let data = {};
      data.title = "出库信息";
      let tableArr =  refToArr(this.$refs.singleTable);
      let detailList = this.drugData.map((data, index) => {
        return {
          ...data,
          drugQuantity: tableArr[index][4]
        };
      });
      data.detailList = detailList;
      onPreview(data, "住院药房汇总单");
    },
    //导出
    exportTable() {
      let tableArr =  refToArr(this.$refs.singleTable);
      let detailList = this.drugData.map((data, index) => {
        return {
          ...data,
          drugQuantity: tableArr[index][4]
        };
      });
      let excelData = {
        title: "出库信息",
        tHeader: ["药品名称", "规格", "数量", "备注"],
        filterVal: ["drugName", "spec", "drugQuantity", "recordRemark"],
        listDate: detailList
      };
      onExcel(excelData);
    },
    //向下滑动加载更多
    load() {
      if (this.tlm_noMore) {
        return;
      }
      this.searchData.page++;
      this.getDrugList();
    },
    getWayShow() {
      hmmBaseApi.getlistForDropDown().then(res => {
        if (res.code === 1) {
          res.data.forEach(item => {
            for (let i in item) {
              this.wayShowObj[i] = item[i];
            }
          });
        }
      });
    },
    headerDragend() {
      this.$refs.singleTable.doLayout();
    }
  }
};
</script>

<style scoped lang="scss">
.out-storage {
  display: flex;
  flex-direction: column;
  /deep/.el-form-item--medium .el-form-item__label {
    font-weight: normal;
  }
  .search-input {
    width: 100%;

    .search-button {
      width: 80px;
      height: 36px;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: $l-font-size;

      font-weight: 400;
      color: $l-color-white;
    }

    .print-button,
    .export-button {
      width: 80px;
      height: 36px;
      background: $l-color-white;
      border-radius: 2px;
      font-size: $l-font-size;

      font-weight: 400;
      color: $l-color-primary;
      border: 1px solid $l-color-primary;
    }
  }

  .out-storage-cont {
    flex: 1;
    margin: 20px 0;
    overflow: hidden;
    /deep/ .el-tooltip{
      width: 100% !important;
    }
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
</style>
