<template>
  <div class="priceAdjustment width100 height100 position-relative">
    <el-form :inline="true" :model="searchData">
      <div class="search-input clearfix">
        <div style="float:left;width:550px">
          <span>调价时间：</span>
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
            <template v-if="item.prop == 'adjustPriceType'">
              <span v-if="scope.row.adjustPriceType == '0'">定时调价</span>
              <span v-if="scope.row.adjustPriceType == '1'">即时调价</span>
            </template>
            <template v-else-if="item.prop == 'formCode'">
              <span
                tableName="hrp_form"
                :conditionMap="{form_code: scope.row.formCode}"
                columns="form_name"
                v-tableTransform
              ></span>
            </template>
            <template v-else-if="item.prop === 'drugStock'">
              {{scope.row.outfit}}
              <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
              <template v-if="scope.row.bluk !== 0">
                {{scope.row.bluk}}
                <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
              </template>
            </template>
            <template v-else-if="item.prop == 'oldPrice'">
              <span>{{ formatNum(scope.row.oldPrice) }}</span>
            </template>
            <template v-else-if="item.prop == 'newPrice'">
              <span>{{ formatNum(scope.row.newPrice) }}</span>
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
import { print, preview, onPreview } from "@/utils/print";
import { onExcel } from "@/utils/excel/excel";
import { blukToOutfit } from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";

export default {
  name: "priceAdjustment",
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
          width: "255",
          fixed: "left",
          tooltipShow:true
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          width: "140",
          fixed: false,
          tooltipShow:true
        },
        {
          prop: "formCode",
          label: "剂型",
          align: "left",
          width: "120",
          fixed: false,
          tooltipShow:false
        },
        {
          prop: "adjustPriceTime",
          label: "调价时间",
          align: "left",
          width: "200",
          fixed: false,
          tooltipShow:false
        },
        {
          prop: "adjustPriceType",
          label: "调价类型",
          align: "left",
          width: "140",
          fixed: false,
          tooltipShow:false
        },
        {
          prop: "drugStock",
          label: "调价数量",
          align: "left",
          width: "136",
          fixed: false,
          tooltipShow:false
        },
        {
          prop: "oldPrice",
          label: "调前售价(元)",
          align: "right",
          width: "160",
          fixed: false,
          tooltipShow:false
        },
        {
          prop: "newPrice",
          label: "调后售价(元)",
          align: "right",
          width: "160",
          fixed: false,
          tooltipShow:false
        },
        {
          prop: "adjustPriceUserName",
          label: "调价人员",
          align: "left",
          width: "90",
          fixed: false,
          tooltipShow:true
        },
        {
          prop: "recordRemark",
          label: "备注",
          align: "left",
          width: "280",
          fixed: false,
          tooltipShow:true
        }
      ],
      drugData: [], //表格数据
      drugDataUnit: [], //当前页数据
      total: 0,
      tlm_isLoading: false
    };
  },
  created() {
    this.getCurrentMonthFirst();
    this.getCurrentMonthLast();
    this.search();
  },
  methods: {
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
    async getDrugList() {
      this.tlm_isLoading = true;
      try {
        //获取药品数据接口,传参searchData,drugId
        let response = await stock.getAdjustPrice({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          ids: this.drugId,
          sDate: this.searchData.date && this.searchData.date[0] || "",
          eDate: this.searchData.date && this.searchData.date[1] || ""
        });
        let { code, data } = response;
        if (code === 1) {
          this.pageParams.total = response.total;
          let list = data.map(item => {
            let { out, bl } = blukToOutfit(item.drugStock, item.packQuantity);
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
      this.pageParams.page = 1;
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
      data.title = "调价信息";
      data.detailList = this.drugData;
      console.log(data);
      onPreview(data, "调价单");
    },
    //导出
    exportTable() {
      let excelData = {
        title: "调价信息",
        tHeader: ["药品名称", "规格", "调价前售价", "调价后售价", "备注"],
        filterVal: ["drugName", "spec", "oldPrice", "newPrice", "recordRemark"],
        listDate: this.drugData
      };
      onExcel(excelData);
    },
    headerDragend() {
      this.$refs.singleTable.doLayout();
    }
  }
};
</script>

<style scoped lang="scss">
.priceAdjustment {
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
