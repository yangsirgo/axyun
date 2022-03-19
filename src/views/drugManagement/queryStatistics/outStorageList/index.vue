<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="search">
            <el-row :gutter="10">
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
              <el-col :span="3">
                <LFormtTitle label="出库类型">
                  <el-select v-model="searchData.type" clearable placeholder="请选择">
                    <el-option
                      v-for="item in outTypeList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="3">
                <LFormtTitle label="药品名称">
                  <el-input v-model="searchData.name"  @keyup.native.enter="search" clearable label="描述文字"></el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="6">
                <LFormtTitle label="出库时间">
                  <el-date-picker
                    v-model="outDate"
                    type="datetimerange"
                    clearable
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00','23:59:59']"
                  ></el-date-picker>
                </LFormtTitle>
              </el-col>
              <el-col :span="9" class="align-right">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="reset" plain>重置</el-button>
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
                  <template v-else-if="item.prop == 'amt'">
                    <span>{{ formatNum(scope.row.amt) }}</span>
                  </template>
                  <template v-else-if="item.prop == 'totalAmt'">
                    <span>{{ formatNum(scope.row.totalAmt) }}</span>
                  </template>
                  <template v-else-if="item.prop === 'outType'">
                    <span>{{ wayShowObj[scope.row.outType] }}</span>
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
              :page-sizes="[10, 20, 30, 1000]"
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
import stock from "@/api/hmm/stock";
import formatNum from "@/utils/formatPrice.js";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";

export default {
  name: "outStorageList",
  components: { FlowMenu },
  data() {
    return {
      searchData: {
        type: "",
        storageCode: "",
        name: ""
      },
      tableParams: [
        {
          prop: "outType",
          label: "出库类型",
          fixed: "left",
          width: 120
        },
        {
          prop: "drugName",
          label: "药品名称",
          fixed: "left",
          width: 120
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
          width: 160
        },
        {
          prop: "batchNum",
          label: "生产批号",
          width: 130
        },
/*        {
          prop: "supplierCode",
          label: "供应商",
          width: 160
        },*/
        {
          prop: "targetName",
          label: "目标方",
          width: 160
        },
        {
          prop: "purchasePrice",
          label: "进价(元)",
          align: "right",
          width: "130"
        },
        {
          prop: "price",
          label: "售价(元)",
          align: "right",
          width: "130"
        },
        {
          prop: "outQuantityDisplay",
          label: "出库数量",
          width: "130"
        },
        {
          prop: "totalAmt",
          label: "进价金额(元)",
          align: "right",
          width: "150"
        },
        {
          prop: "amt",
          label: "售价金额(元)",
          align: "right",
          width: "150"
        },
        {
          prop: "outTime",
          label: "出库时间",
          width: 170
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
      // 出库类型数据源
      outTypeList: [],

      outDate: [],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      // 出库类型返显
      wayShowObj: {}
    };
  },
  created() {
    this.getWayShow();
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
      this.outDate = [];
    },
    loadTable() {
      this.tlm_isLoading = true;
      let params = {
        ...this.searchData,
        ...this.pageParams,
        sDate:
          this.outDate && this.outDate[0] ? this.outDate[0]: "",
        eDate:
          this.outDate && this.outDate[1] ? this.outDate[1]: ""
      };
      stock
        .getOutStorage(params)
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
          if (res.data.length === 0) {
            this.$message.error("暂无药库数据");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取药库数据失败");
        });
    },
    // 出库类型返显
    getWayShow() {
      hmmBaseApi
        .getlistForDropDown({
          io: "O"
        })
        .then(res => {
          if (res.code === 1) {
            const list = [];
            res.data.forEach(item => {
              for (let i in item) {
                list.push({
                  code: i,
                  name: item[i]
                });
                this.wayShowObj[i] = item[i];
              }
            });
            this.outTypeList = list;
          }
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
        title: ["各类出库明细", "", "", "", "", "", "", ""],
        tHeader: [
          "药品名称",
          "生产批号",
          "进价(元)",
          "售价(元)",
          "出库数量",
          "进价金额(元)",
          "售价金额(元)",
          "出库时间"
        ],
        filterVal: [
          "drugName",
          "batchNum",
          "purchasePrice",
          "price",
          "outQuantityDisplay",
          "totalAmt",
          "amt",
          "outTime"
        ],
        listDate: data,
        fileName: "各类出库明细",
        merges: ["A1:H1"]
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
      data.title = "各类出库明细";
      let detailList = this.drugData.map(item => {
        const dataItem = {};
        for (let i in item) {
          dataItem[i] = item[i].toString();
        }
        return dataItem;
      });
      data.detailList = detailList;
      onPreview(data, "各类出库明细");
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
/deep/.el-table .cell{
  line-height: 40px !important;
  font-size: 16px;
}
.align-right {
  text-align: right;
}
.near-input {
  line-height: 32px;
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
