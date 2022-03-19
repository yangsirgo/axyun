<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="search">
            <el-row :gutter="10">
              <el-col :span="6">
                <LFormtTitle label="统计月份">
                  <el-date-picker v-model="searchData.startYearMonth" type="month"
                      format="yyyy-MM" value-format="yyyyMM"></el-date-picker>
                </LFormtTitle>
              </el-col>
              <el-col :span="3">
                <LFormtTitle label="统计库房">
                  <el-select v-model="searchData.storageCode" clearable placeholder="请选择">
                    <el-option v-for="item in drugStorageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="12" class="align-right">
                <el-button type="primary" @click="search">查询</el-button>
                <!-- <el-button type="primary" plain>打印</el-button> -->
                <el-button type="primary" plain @click="exportExcel">导出</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="table">
            <el-table ref="singleTable" v-if="drugDataStyle" :data="drugData" border width="100%" show-summary
              :summary-method="getSummaries" height="600px" highlight-current-row v-loading="tlm_isLoading"
              element-loading-text="加载中...">
              <el-table-column v-for="(item,index) in tableParams" :key="index" :prop="item.prop" :label="item.label"
                :width="item.width" :align="item.align || 'left'" header-align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <template v-if="item.prop == 'originCode'">
                    <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
                  </template>
                  <template v-else-if="item.prop == 'originIdentificationCode'">
                    <span :val="scope.row.originIdentificationCode" code="DrugManufacturerFlag" v-codeTransform></span>
                  </template>
                  <template v-else-if="item.prop == 'cwType'">
                    <span v-if="scope.row.cwType=='1'">西药</span>
                    <span v-if="scope.row.cwType=='2'">中成药</span>
                    <span v-if="scope.row.cwType=='3'">中草药</span>
                  </template>
                  <template v-else-if="item.prop == 'supplierCode'">
                    <span :val="scope.row.supplierCode" code="DrugSupplier" v-codeTransform></span>
                  </template>
                  <template v-else-if="item.prop == 'drugUnit'">
                    <div class="Units">
                      <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                    </div>
                  </template>
                  <template v-else-if="item.prop == 'price'">
                    <span>{{ formatNum(scope.row.price) }}</span>
                  </template>
                  <template v-else-if="item.prop == 'purchasePrice'">
                    <span>{{ formatNum(scope.row.purchasePrice) }}</span>
                  </template>
                  <template v-else-if="item.prop == 'drugStock'">
                    <span>{{scope.row.outfit}}</span>
                    <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                    <template v-if="scope.row.bluk!==0">
                      <span>{{scope.row.bluk}}</span>
                      <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                    </template>
                  </template>
                  <template v-else-if="item.prop == 'manageType'">
                    <span :val="scope.row.manageType" code="DrugManaType" v-codeTransform></span>
                  </template>
                  <template v-else-if="item.prop == 'formCode'">
                    <span tableName="hrp_form" :conditionMap="{form_code: scope.row.formCode}" columns="form_name"
                      v-tableTransform></span>
                  </template>
                  <template v-else-if="item.prop == 'controlLevel'">
                    <span :val="scope.row.controlLevel" code="DrugReimbursementType" v-codeTransform></span>
                  </template>
                  <template v-else-if="item.prop == 'basicType'">
                    <span :val="scope.row.basicType" code="BasicDrugType" v-codeTransform></span>
                  </template>
                  <template v-else-if="item.prop == 'classCode'">
                    <span :val="scope.row.classCode" code="DrugTypeCode" v-codeTransform></span>
                  </template>
                  <template v-else>
                    <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page align-right">
            <el-pagination background @size-change="changeSize" @current-change="changePage" :current-page="pageParams.pageNo"
              :page-sizes="[10, 20, 30, 40]" :page-size="pageParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
              :total="pageParams.total"></el-pagination>
          </div>
        </div>
      </slot>
    </flow-menu>
  </div>
</template>

<script>
  import FlowMenu from "@/components/FlowMenu";
  import hmmBaseApi from "@/api/hmm/base";
  import {
    blukToOutfit,
    outfitToBluk
  } from "@/utils/drugManagement.js";
  import formatNum from "@/utils/formatPrice.js";
  import { jsonToExcel } from "@/utils/excel/excel";

  export default {
    name: "pharmacyMonthly",
    components: {
      FlowMenu
    },
    data() {
      return {
        searchData: {
          startYearMonth: "",
          storageCode: ""
        },
        date: [],
        tableParams: [{
            prop: "drugName",
            label: "药品名称",
            fixed: "left"
          },
          {
            prop: "spec",
            label: "规格"
          },
          {
            prop: "drugUnit",
            label: "单位"
          },
          {
            prop: "beginPurchaseAmt",
            label: "期初进价金额",
            align: "right"
          },
          {
            prop: "beginAmt",
            label: "期初零售金额",
            align: "right"
          },
          {
            prop: "inPurchaseAmt",
            label: "入库进价金额",
            align: "right"
          },
          {
            prop: "inAmt",
            label: "入库零售金额",
            align: "right"
          },
          {
            prop: "outPurchaseAmt",
            label: "出库进价金额",
            align: "right"
          },
          {
            prop: "outAmt",
            label: "出库零售金额",
            align: "right"
          },
          {
            prop: "endPurchaseAmt",
            label: "期末进价金额",
            align: "right"
          },
          {
            prop: "endAmt",
            label: "期末零售金额",
            align: "right"
          }
        ],
        drugData: [],
        drugDataStyle: true,
        drugStorageList: [],
        tlm_isLoading: false,
        pageParams: {
          pageNo: 1,
          pageSize: 20,
          total: 0
        }
      };
    },
    created() {
      this.getDrugStorageList("0,1,2");
    },
    methods: {
      formatNum(num) {
        return formatNum(num);
      },
      search() {
        this.pageParams.pageNo = 1;
        this.loadTable();
      },
      reset() {
        this.searchData = this.$options.data().searchData;
      },
      loadTable() {
        this.drugDataStyle = false;
        this.tlm_isLoading = true;
        let params = {
          // startYearMonth: this.searchData.yearMonth[0],
          // endYearMonth: this.searchData.yearMonth[1],
          ...this.searchData,
          ...this.pageParams
        };
        hmmBaseApi
          .getStockMonthReport(params)
          .then(res => {
            if (res.code === 1) {
              this.pageParams.total = res.total;
              this.drugData = res.data;
              this.drugDataStyle = true;
            }
            this.tlm_isLoading = false;
          })
          .catch(err => {
            this.tlm_isLoading = false;
          });
      },
      // 分页
      changePage(obj) {
        this.pageParams.pageNo = obj;
        this.loadTable();
      },
      changeSize(obj) {
        this.pageParams.pageSize = obj;
        this.loadTable();
        this.changePage();
      },
      //获取药库数据
      getDrugStorageList(params) {
        hmmBaseApi
          .getDrugStorage(params)
          .then(res => {
            if (res.code == 1) {
              this.drugStorageList = this.drugStorageList.concat(res.data);
              this.searchData.storageCode = this.drugStorageList[0].code;
            } else {
              this.$message.error(res.msg || "获取药库数据失败");
            }
            if (res.data.length == 0) {
              this.$message.error("暂无药库数据");
            }
          })
          .catch(res => {
            this.$message.error(res.msg || "获取药库数据失败");
          }).finally(res =>{
            this.search();
          });
      },
      // 合计
      getSummaries(param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "合计";
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (column.property == "drugName" || column.property == "spec" || column.property == "drugUnit") {
                  sums[index] = "";
          } else {
            if(!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return (prev * 100 + curr * 100) / 100;
                }
                return prev;
              }, 0);
              sums[index] += " 元";
            } else {
              sums[index] = "";
            }

          }
        });
        return sums;
      },
      exportExcel() {
        if (this.drugData.length === 0) {
          this.$message.warning("暂无要导出数据!");
          return;
        }
        const data = this.drugData.map(item => {
          const dataItem = {};
          for (let i in item) {
            dataItem[i] = item[i].toString();
          }
          return dataItem;
        });
        let units = this.$refs.singleTable.bodyWrapper.querySelectorAll(
        ".Units"
      );
      let tableData_new = data.map((item, i) => {
        return Object.assign(item, { unit: units[i].innerText });
      });
        let excelData = {
          title: ["药库月明细报表", "", "", "", "", "", "", "","","",""],
          tHeader: [
            "药品名称",
            "规格",
            "单位",
            "期初进价金额",
            "期初零售金额",
            "入库进价金额",
            "入库零售金额",
            "出库进价金额",
            "出库零售金额",
            "期末进价金额",
            "期末零售金额",
          ],
          filterVal: [
            "drugName",
            "spec",
            "unit",
            "beginPurchaseAmt",
            "beginAmt",
            "inPurchaseAmt",
            "inAmt",
            "outPurchaseAmt",
            "outAmt",
            "endPurchaseAmt",
            "endAmt"
          ],
          listDate: tableData_new,
          fileName: "药库月明细报表",
          merges: ["A1:K1"],
          sumVal: [
            "beginPurchaseAmt",
            "beginAmt",
            "inPurchaseAmt",
            "inAmt",
            "outPurchaseAmt",
            "outAmt",
            "endPurchaseAmt",
            "endAmt"
            ]
        };
        jsonToExcel(excelData);
      },
    }
  };
</script>

<style lang="scss" scoped>
  .wrapper {
    overflow: hidden;
  }

  /deep/ .el-table__fixed {
    bottom: 0.5px;
  }

  .main {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: $l-color-white;
  }

  .align-right {
    text-align: right;
  }

  .table {
    height: calc(100% - 110px);
    margin: 20px 0;
  }

  .page {
    .el-pagination {
      padding: 0;

      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }
</style>
