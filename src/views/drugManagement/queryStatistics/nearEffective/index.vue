<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="search">
            <el-row :gutter="10">
              <el-col :span="7"  >
                <div style="display:flex" >
                  <LFormtTitle label="近效期时间设置">
                    <el-input-number
                      class="near-input"
                      v-model="searchData.expDays"
                      :min="0"
                      :max="99999"
                      label="描述文字"
                    ></el-input-number>
                  </LFormtTitle>
                  <span style=" line-height: 34px;height: 18px;text-align: center;margin-left: 3px;">天</span>
                </div>
              </el-col>
              <el-col :span="3">
                <LFormtTitle label="库房选择">
                  <el-select v-model="searchData.storageCode" clearable placeholder="请选择">
                    <el-option
                      v-for="item in drugStorageList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="14" class="align-right">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" plain @click="print" v-hotKey="{ func: 'func_print' }">打印</el-button>
                <el-button type="primary" plain @click="exportExcel">导出</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="table">
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
            >
              <el-table-column
                v-for="(item,index) in tableParams"
                :key="index"
                sortable
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align || 'left'"
                header-align="center"
                :fixed="item.fixed"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <template v-if="item.prop == 'price'">
                    <span>{{ formatNum(scope.row.price) }}</span>
                  </template>
                  <template v-else-if="item.prop == 'purchasePrice'">
                    <span>{{ formatNum(scope.row.purchasePrice) }}</span>
                  </template>
                  <template v-else>
                    <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page align-right">
            <el-pagination
              background
              @size-change="changeSize"
              @current-change="changePage"
              :current-page="pageParams.pageNo"
              :page-sizes="[10, 20, 30, 40, 100, 200, 1000]"
              :page-size="pageParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageParams.total"
            ></el-pagination>
          </div>
        </div>
      </slot>
    </flow-menu>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import hmmBaseApi from "@/api/hmm/base";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";

export default {
  name: "nearEffective",
  components: { FlowMenu },
  data() {
    return {
      searchData: {
        hasStock: true,
        expDays: 180,
        storageCode: "",
        orderBy: "exp_date"
      },
      tableParams: [
        {
          prop: "drugName",
          label: "药品名称",
          fixed: "left",
          width: 170
        },
        {
          prop: "spec",
          label: "药品规格",
          width: 120
        },
        {
          prop: "formName",
          label: "剂型",
          width: 120
        },
        {
          prop: "originName",
          label: "生产厂商",
          width: 170
        },
        {
          prop: "batchNum",
          label: "生产批号",
          width: 120
        },
/*        {
          prop: "supplierCode",
          label: "供应商",
          width: 170
        },*/
        {
          prop: "expiryDate",
          label: "有效期",
          width: 120
        },
        {
          prop: "purchasePrice",
          label: "进价(元)",
          align: "right",
          width: "100"
        },
        {
          prop: "price",
          label: "售价(元)",
          align: "right",
          width: "100"
        },
        {
          prop: "drugStockDisplay",
          label: "库存数量",
          width: 120
        },
        {
          prop: "expDays",
          align: "right",
          label: "到期(天)",
          width: 120
        }
      ],
      drugData: [],
      drugStorageList: [
        {
          code: "",
          name: "全部"
        }
      ],
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
    this.search();
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
      this.tlm_isLoading = true;
      let params = {
        ...this.searchData,
        ...this.pageParams
      };
      hmmBaseApi
        .getStockDForPage(params)
        .then(res => {
          if (res.code === 1) {
            this.pageParams.total = res.pageParams.total;
            this.drugData = res.data;
          }
          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.tlm_isLoading = false;
        });
    },
    // 分页
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    //获取药库数据
    getDrugStorageList(params) {
      hmmBaseApi
        .getDrugStorage(params)
        .then(res => {
          if (res.code == 1) {
            this.drugStorageList = this.drugStorageList.concat(res.data);
          } else {
            this.$message.error(res.msg || "获取药库数据失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无药库数据");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取药库数据失败");
        });
    },
    // 导出
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
      let excelData = {
        title: ["近效期药品", "", "", "", "", "", "", "", "", ""],
        tHeader: [
          "药品名称",
          "药品规格",
          "剂型",
          "生产厂商",
          "生产批号",
          "有效期",
          "进价(元)",
          "售价(元)",
          "库存数量",
          "到期(天)"
        ],
        filterVal: [
          "drugName",
          "spec",
          "formName",
          "originName",
          "batchNum",
          "expiryDate",
          "purchasePrice",
          "price",
          "drugStockDisplay",
          "expDays"
        ],
        listDate: data,
        fileName: "近效期药品",
        merges: ["A1:J1"]
      };
      jsonToExcel(excelData);
    },
    // 打印
    print() {
      if (this.drugData.length === 0) {
        this.$message.warning("暂无要打印数据!");
        return;
      }
      let data = {};
      data.title = "近效期药品";
      let detailList = this.drugData.map(item => {
        const dataItem = {};
        for (let i in item) {
          dataItem[i] = item[i].toString();
        }
        return dataItem;
      });
      data.detailList = detailList;
      onPreview(data, "近效期药品");
    },
    headerDragend() {
      this.$refs.singleTable.doLayout();
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
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
.near-input {
  line-height: 32px;
  /deep/ .el-input__inner {
    padding: 0 35px !important;
    text-align: center;
  }
}
.table {
  height: calc(100% - 110px);
  margin: 20px 0;
  /deep/.el-table .cell{
    line-height: 40px !important;
    font-size: 16px;
  }
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
