<template>
  <el-card class="ownMedicineReport height100">
    <div class="search-cont">
      <l-common-search rightAreaWidth="250">
        <template slot="leftCon">
          <l-formt-title label="开单时间" style="width: 500px">
            <el-date-picker
              clearable
              v-model="searchValue.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </l-formt-title>
        </template>
        <template slot="rightCon">
          <div class="btns-contain">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" class="plain-btn" plain @click="print"
              >打印</el-button
            >
            <el-button type="primary" plain class="float-right" @click="setOut"
              >导出</el-button
            >
          </div>
        </template>
      </l-common-search>
    </div>
    <div class="table-cont">
      <l-table
        :pageSize="pageParams.pageSize"
        :page="pageParams.pageNo"
        :total="pageParams.total"
        :background="false"
        :paginationSmall="true"
        layout="sizes,prev,pager,next,jumper,total"
        :pageSizes="[10, 20, 30, 40]"
        paginationAlign="right"
        :pagerCount="5"
        :singlePageShow="true"
        @changeSize="changeSize"
      >
        <el-table
          ref="multiTable"
          :data="multiData"
          width="100%"
          height="100%"
          border
        >
          <el-table-column
            type="index"
            width="70"
            label="序号"
            align="center"
          ></el-table-column>
          <el-table-column
            v-for="(item, index) in multiParams"
            :key="index"
            sortable
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'unit'">
                <span
                  class="units"
                  :val="scope.row.unit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </l-table>
    </div>
  </el-card>
</template>
<script>
import { getSelfOrdersByStatistic } from "@/api/cis/report/outPatientReports.js";
import { onPreview } from "@/utils/print";
import { onExcel } from "@/utils/excel/excel";
export default {
  name: "ownMedicineReport",
  data() {
    return {
      searchValue: {
        date: [
          this.dayjs(new Date()).format("YYYY-MM-DD") + " 00:00:00",
          this.dayjs(new Date()).format("YYYY-MM-DD") + " 23:59:59",
        ],
      },
      pageParams: {
        pageSize: 20,
        pageNo: 1,
        total: 0,
      },
      multiParams: [
        {
          prop: "orderItemName",
          label: "药品名称",
          width: "120",
          align: "left",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "spec",
          label: "规格",
          width: "100",
          align: "left",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "quantity",
          label: "数量",
          width: "70",
          align: "center",
          headerAlign: "center",
          fixed: false,
        },
        {
          prop: "unit",
          label: "单位",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false,
        },
      ],
      multiData: [],
    };
  },
  mounted() {
    // this.searchValue.date = [];
    this.search();
  },
  methods: {
    search() {
      this.pageParams.pageNo = 1;
      this.getList();
    },
    async getList() {
      let startTime = this.searchValue.date.length
        ? this.searchValue.date[0]
        : "";
      let endTime = this.searchValue.date.length
        ? this.searchValue.date[1]
        : "";
      let hosId = JSON.parse(localStorage.getItem("pamars")).hosId;
      let params = {
        // hosId,
        startTime,
        endTime,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
      };
      this.$showLoading();
      try {
        let res = await getSelfOrdersByStatistic(params);
        if (res.code === 1) {
          this.multiData = res.data;
          this.pageParams.total = res.total;
        } else {
          this.$message.error("请求失败");
        }
        this.$hideLoading();
      } catch (e) {
        console.log(e);
        this.$hideLoading();
      }
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.pageParams.pageSize = val.pageSize;
      this.getList();
    },
    print() {},
    setOut() {
      let units = this.$refs.multiTable.bodyWrapper.querySelectorAll(
        ".units"
      );
      let tableData_new = this.multiData.map((item, i) => {
        return Object.assign(item, { _unit: units[i].innerText });
      });
      let excelData = {
        title: "入库信息",
        tHeader: ["药品名称", "规格", "数量", "单位"],
        filterVal: ["orderItemName", "spec", "quantity", "_unit"],
        listDate: tableData_new,
      };
      onExcel(excelData);
    },
  },
};
</script>
<style lang="scss" scoped>
.ownMedicineReport {
  padding: 10px;
  overflow-y: auto;
  .search-cont {
    height: 50px;
    margin-bottom: 10px;
  }
  .table-cont {
    height: calc(100% - 60px);
  }
  /deep/.el-table .cell{
   line-height: 40px !important;
   font-size: 16px;
  }
}
</style>
