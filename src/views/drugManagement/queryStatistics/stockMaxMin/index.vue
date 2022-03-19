<template>
  <div class="wrapper height100">
    <div class="main height100 stock">
      <div class="main_wrap height100">
        <flow-menu>
          <slot name="content">
            <div class="ledger width100 height100">
              <el-tabs v-model="searchData.compareToStock" style="margin-bottom: 15px" type="card" @tab-click="handleClick">
                <el-tab-pane label="低储药品" name="min"></el-tab-pane>
                <el-tab-pane label="高储药品" name="max"></el-tab-pane>
              </el-tabs>
              <div class="search-input">
                <el-row :gutter="10">
                  <el-col :span="4">
                    <LFormtTitle label="库房选择" labelWidth="76">
                      <el-select
                        v-model="searchData.storageCode"
                        clearable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in drugStorageList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="4">
                    <LFormtTitle class="drug-box" label="关键字">
                      <el-input
                        v-model="searchData.name"
                        @keyup.native.enter="search"
                        placeholder="汉字名称"
                      ></el-input>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="6" style="text-align: right;">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="primary" plain @click="reset"
                      >重置</el-button
                    >
                    <el-button type="primary" plain @click="exportExcel"
                      >导出</el-button
                    >
                  </el-col>
                </el-row>
              </div>
              <div class="drug-list-cont">
                <el-table
                  ref="singleTable"
                  :data="drugData"
                  border
                  width="100%"
                  height="100%"
                  highlight-current-row
                  v-loading="tlm_isLoading"
                  element-loading-text="加载中..."
                  @header-dragend="headerDragend"
                  id="out-table"
                >
                  <el-table-column
                    v-for="item in tableParams"
                    :key="item.prop"
                    sortable
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.width"
                    :align="item.align || 'left'"
                    :fixed="item.fixed"
                    show-overflow-tooltip
                    class-name="outfitNum"
                  >
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'price'">
                        <span>{{ formatNum(scope.row.price) }}</span>
                      </template>
                      <template v-else-if="item.prop == 'basicType'">
                        <span
                          :val="scope.row.basicType"
                          code="BasicDrugType"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else>
                        <span class="overflow-point">{{
                          scope.row[item.prop]
                        }}</span>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row>
                <el-col
                  :span="16"
                  :offset="8"
                  style="display: flex;align-items:center;justify-content: flex-end;"
                >
                  <el-pagination
                    background
                    @size-change="changeSize"
                    @current-change="changePage"
                    :current-page="pageParams.pageNo"
                    :page-sizes="[20, 30, 40,100,200,1000]"
                    :page-size="pageParams.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageParams.total"
                  ></el-pagination>
                </el-col>
                </el-row>
              </div>
            </div>
          </slot>
        </flow-menu>
      </div>
    </div>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import hmmBaseApi from "@/api/hmm/base";
import formatNum from "@/utils/formatPrice.js";
import { exportTemperatureExcel } from "@/api/ipnw/temperatureMeasure.js";
import { jsonToExcel } from "@/utils/excel/excel";
import XLSX from "xlsx";
import FileSaver from "file-saver";

export default {
  name: "stockMaxMin",
  components: {
    FlowMenu
  },
  data() {
    return {
      searchData: {
        currDrugStorage: "1",
        compareToStock: "min",
        storageCode: "",
        name: ""
      },

      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      cwTypelist: [
        {
          id: "1",
          name: "西药"
        },
        {
          id: "2",
          name: "中成药"
        },
        {
          id: "3",
          name: "中草药"
        }
      ],
      tableMinParams: [
        {
          prop: "cwTypeName",
          label: "药品类型",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "drugName",
          label: "药品名称",
          align: "left",
          width: "213",
          fixed: "left"
        },
        {
          prop: "spec",
          label: "药品规格",
          align: "left",
          width: "150",
          fixed: false
        },
        {
          prop: "originName",
          label: "药品厂家",
          align: "left",
          width: "240",
          fixed: false
        },
        {
          prop: "formName",
          label: "药品剂型",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "drugUnitName",
          label: "包装单位",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "price",
          label: "药品售价",
          align: "right",
          width: "120",
          fixed: false
        },
        {
          prop: "minStockDisplay",
          label: "低储值",
          align: "right",
          width: "180",
          fixed: false
        },
        {
          prop: "drugStockDisplay",
          label: "药品库存",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "originIdentificationName",
          label: "生产厂商标识",
          align: "left",
          width: "160",
          fixed: false
        },
        {
          prop: "manageTypeName",
          label: "管理类型",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "basicType",
          label: "基药类型",
          align: "left",
          width: "120",
          fixed: false
        },
      ],
      tableMaxParams: [
        {
          prop: "cwTypeName",
          label: "药品类型",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "drugName",
          label: "药品名称",
          align: "left",
          width: "213",
          fixed: "left"
        },
        {
          prop: "spec",
          label: "药品规格",
          align: "left",
          width: "150",
          fixed: false
        },
        {
          prop: "originName",
          label: "药品厂家",
          align: "left",
          width: "240",
          fixed: false
        },
        {
          prop: "formName",
          label: "药品剂型",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "drugUnitName",
          label: "包装单位",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "price",
          label: "药品售价",
          align: "right",
          width: "120",
          fixed: false
        },
        {
          prop: "maxStockDisplay",
          label: "高储值",
          align: "right",
          width: "180",
          fixed: false
        },
        {
          prop: "drugStockDisplay",
          label: "药品库存",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "originIdentificationName",
          label: "生产厂商标识",
          align: "left",
          width: "160",
          fixed: false
        },
        {
          prop: "manageTypeName",
          label: "管理类型",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "basicType",
          label: "基药类型",
          align: "left",
          width: "120",
          fixed: false
        },
      ],
      drugData: [],
      pageAmount: 0,
      totalAmount: 0,
      drugStorageList: [
        {
          code: "",
          name: "全部"
        }
      ],
      tlm_isLoading: false
    };
  },
  created() {
    this.getDrugStorageList("1");
    this.search();
  },
  methods: {
    handleClick(tab, event) {

      this.search()
    },
    formatNum(num) {
      return formatNum(num, 4);
    },
    search() {
      if(this.searchData.compareToStock === 'min' ){
        this.tableParams = this.tableMinParams
      }else{
        this.tableParams = this.tableMaxParams
      }
      this.pageParams.pageNo = 1;
      this.loadTable();

    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    reset() {
      this.searchData = this.$options.data().searchData;
    },
    loadTable() {
      this.tlm_isLoading = true;
      let params = {
        ...this.searchData,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
      };
      hmmBaseApi
        .getStockMaxMINForPage(params)
        .then(res => {
          if (res.code === 1) {
            this.$nextTick(()=>{
              this.$refs.singleTable.doLayout()
            })
            this.pageParams = res.pageParams;
            this.drugData = res.data;
            this. pageParams.total = res.total;
            this.pageAmount = res.pageAmount;
            this.totalAmount = res.totalAmount
          }

          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.tlm_isLoading = false;
        });
    },
    headerDragend() {
      this.$refs.singleTable && this.$refs.singleTable.doLayout();
    },
    //获取药库数据
    getDrugStorageList(params) {
      hmmBaseApi
        .getDrugStorage(params)
        .then(res => {
          if (res.code == 1) {
            this.drugStorageList = this.drugStorageList.concat(res.data);
          } else {
            this.$message.error(res.msg || "获取药房数据失败");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取药房数据失败");
        });
    },
    // 导出
    async exportExcel() {
      try {
        let param = {
          name: this.searchData.name,
          compareToStock: this.searchData.compareToStock,
        };

        let res = await hmmBaseApi
          .exportStockExcel(param);
        var blob = res;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          var parent = document.getElementsByClassName("stock")[0];
          var a = document.createElement('a');
          a.setAttribute("id","billHref");
          a.download = '高低储报表.xls';
          a.href = e.target.result;
          parent.appendChild(a);
          let aDom = document.getElementById("billHref");
          aDom.click();
          parent.removeChild(aDom);
        }
      } catch (error) {}
    },
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}

.ledger {
  padding: 20px;
  background-color: $l-color-white;
}

.drug-info {
  line-height: 24px;
  margin-top: 5px;
}

.search-input {
  height: 38px;
  margin-bottom: 10px;
}

.drug-list-cont {
  height: calc(100% - 130px);
}


  /deep/.el-table .cell{
    line-height: 40px !important;
    font-size: 16px;
  }

.drug-box {
  /deep/ .l-input-body-main > div {
    width: 100% !important;
  }
}
</style>
