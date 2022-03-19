<template>
  <l-layout
    :boxExpanded="false"
    :isToolBox="false"
    :hasThreeRouterFlag="false"
    :patientListShow="false"
  >
    <template #content>
      <div class="main">
        <div class="top-seatch">
          <el-row :gutter="10">
            <el-col :span="4">
              <l-formt-title required label="医保类别">
                <el-select v-model="medicareType" placeholder="请选择医保类别">
                  <el-option
                    v-for="item in medicareList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <l-formt-title label="对账日期">
                <el-date-picker
                  v-model="checkDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  clearable
                ></el-date-picker>
              </l-formt-title>
            </el-col>
            <el-col :span="4">
              <l-formt-title required label="业务类型">
                <el-select v-model="itemType" placeholder="请选择">
                  <el-option
                    v-for="item in controlItemsList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col :span="10" class="align-right">
              <el-button type="primary">对账</el-button>
              <el-button type="primary" plain @click="checkHistory">查询历史对账</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="center">
          <div class="center-item float-left">
            <l-card-title class="card-title">
              <span slot="left">院内交易</span>
            </l-card-title>
            <div class="search-box">
              <el-row :gutter="10">
                <el-col :span="8" style="margin-bottom:7px;">
                  <l-formt-title label="结算时间">
                    <el-date-picker
                      v-model="leftStockDater"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      clearable
                    ></el-date-picker>
                  </l-formt-title>
                </el-col>
                <el-col :span="6">
                  <l-formt-title label="结算流水号">
                    <el-input v-model="leftSearchParams.settlementNum" placeholder="请输入"></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="10">
                  <div class="check-box">
                    <el-checkbox v-model="syncQuery" @change="syncQueryChange">同步查询条件</el-checkbox>
                    <el-checkbox v-model="leftSearchParams.displayRecords">只显示多余记录</el-checkbox>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24" class="align-right">
                  <el-button type="primary" @click="search">查询</el-button>
                  <el-button type="primary" plain @click="reset">重置</el-button>
                  <el-button type="primary" plain>导出</el-button>
                </el-col>
              </el-row>
            </div>
            <div class="left-table">
              <el-table
                ref="leftTable"
                :data="tableData"
                v-loading="loading"
                border
                stripe
                width="100%"
                height="100%"
                highlight-current-row
                @current-change="handleCurrentChange"
                @header-dragend="headerDragend"
              >
                <el-table-column
                  v-for="(item ,index) in tableHeader"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  header-align="center"
                  :align="item.align || 'left'"
                  :width="item.width"
                  :fixed="item.fixed"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'hosDosageType'">
                      <span
                        v-if="cacheItemType === '0'"
                        tableName="hrp_form"
                        :conditionMap="{form_code: scope.row[item.prop]}"
                        columns="form_name"
                        v-tableTransform
                      ></span>
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                    <template v-else-if="item.prop === 'hosUnit'">
                      <span
                        v-if="cacheItemType === '0'"
                        :val="scope.row[item.prop]"
                        code="DrugUnit"
                        v-codeTransform
                      ></span>
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                    <span v-else>{{ scope.row[item.prop] }}</span>
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
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageParams.total"
              ></el-pagination>
            </div>
          </div>
          <div class="center-item float-right">
            <l-card-title class="card-title">
              <span slot="left">医保交易</span>
            </l-card-title>
            <div class="search-box">
              <el-row :gutter="10">
                <el-col :span="8" style="margin-bottom:7px;">
                  <l-formt-title label="结算时间">
                    <el-date-picker
                      v-model="rightStockDater"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      clearable
                    ></el-date-picker>
                  </l-formt-title>
                </el-col>
                <el-col :span="6">
                  <l-formt-title label="结算流水号">
                    <el-input v-model="rightSearchParams.settlementNum" placeholder="请输入"></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="10">
                  <div class="check-box">
                    <el-checkbox v-model="rightSearchParams.displayRecords">只显示多余记录</el-checkbox>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24" class="align-right">
                  <el-button type="primary" @click="searchRight">查询</el-button>
                  <el-button type="primary" plain @click="resetRight">重置</el-button>
                  <el-button type="primary" plain>导出</el-button>
                  <el-button type="primary" plain>下载明细</el-button>
                </el-col>
              </el-row>
            </div>
            <div class="right-table">
              <el-table
                ref="rightTable"
                :data="tableDataRight"
                v-loading="loadingRight"
                border
                stripe
                width="100%"
                height="100%"
                highlight-current-row
                @current-change="handleCurrentChangeRight"
                @header-dragend="headerDragendRight"
              >
                <el-table-column
                  v-for="(item ,index) in tableHeaderRight"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  header-align="center"
                  :align="item.align || 'left'"
                  :width="item.width"
                  :fixed="item.fixed"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span
                      v-if="item.prop === 'medicareType'"
                    >{{ medicareTypeShow[scope.row[item.prop]] }}</span>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                  </template>
                </el-table-column>
                <el-table-column key="handler" fixed="right" align="center" label="操作" width="70">
                  <template slot-scope="scope">
                    <el-button type="text" @click="changeAccount(scope.row)">改账</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page align-right">
              <el-pagination
                background
                @size-change="changeSizeRight"
                @current-change="changePageRight"
                :current-page="pageParamsRight.pageNo"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageParamsRight.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageParamsRight.total"
              ></el-pagination>
            </div>
          </div>
        </div>
        <l-card-title class="card-title">
          <span slot="left">错误信息</span>
        </l-card-title>
        <div class="contrast-table">
          <el-table
            ref="bottomTable"
            :data="tableDataBottom"
            v-loading="loadingBottom"
            border
            stripe
            width="100%"
            height="100%"
            highlight-current-row
            @header-dragend="headerDragendBottom"
          >
            <el-table-column
              v-for="(item ,index) in tableHeaderBottom"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              header-align="center"
              :align="item.align || 'left'"
              :width="item.width"
              :fixed="item.fixed"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
        </div>
        <!-- 改账 -->
        <l-dialog
          :visible.sync="modelVisible"
          width="460px"
          title="改账"
          @confirm="conserve"
          @cancel="modelVisible = false"
        >
          <template #content></template>
        </l-dialog>
        <!-- 历次对账结果 -->
        <l-dialog
          :visible.sync="modelVisible2"
          width="800px"
          title="历次对账结果"
          @confirm="conserve"
          @cancel="modelVisible2 = false"
        >
          <template #content>
            <div class="check-his">
              <el-table
                ref="checkTable"
                :data="checkHisTableData"
                v-loading="loading"
                border
                stripe
                width="100%"
                height="300px"
                highlight-current-row
                @current-change="handleCurrentChange"
                @header-dragend="headerDragend"
              >
                <el-table-column
                  v-for="(item ,index) in checkHisTableHeader"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  header-align="center"
                  :align="item.align || 'left'"
                  :width="item.width"
                  :fixed="item.fixed"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'hosDosageType'">
                      <span
                        v-if="cacheItemType === '0'"
                        tableName="hrp_form"
                        :conditionMap="{form_code: scope.row[item.prop]}"
                        columns="form_name"
                        v-tableTransform
                      ></span>
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                    <template v-else-if="item.prop === 'hosUnit'">
                      <span
                        v-if="cacheItemType === '0'"
                        :val="scope.row[item.prop]"
                        code="DrugUnit"
                        v-codeTransform
                      ></span>
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page align-right">
                <el-pagination
                  background
                  @size-change="changeSizeCheck"
                  @current-change="changePageCheck"
                  :current-page="checkHisPage.pageNo"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="checkHisPage.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="checkHisPage.total"
                ></el-pagination>
              </div>
            </div>
          </template>
        </l-dialog>
      </div>
    </template>
  </l-layout>
</template>

<script>
import {
  getPagemd,
  getPageHosChargeList,
  getPageItemList,
  getMatchItem,
  getPageItemMatchDTOList,
  cancelMatchById
} from "@/api/medicalInsurance/index.js";

export default {
  name: "healthCheck",
  data() {
    return {
      medicareType: "",
      medicareList: [],
      medicareTypeShow: {},
      itemType: "",
      checkDate: [],
      controlItemsList: [
        {
          code: "0",
          name: "全部"
        },
        {
          code: "1",
          name: "门诊"
        },
        {
          code: "2",
          name: "住院"
        }
      ],
      leftSearchParams: {
        settlementNum: "",
        displayRecords: false
      },
      leftStockDater: [],
      syncQuery: false,
      loading: false,
      tableHeader: [
        {
          prop: "hosItemCode",
          label: "结算流水号"
        },
        {
          prop: "hosItemName",
          label: "报销类型"
        },
        {
          prop: "hosMaxPrice",
          label: "个人编码"
        },
        {
          prop: "hosDosageType",
          label: "姓名"
        },
        {
          prop: "hosUnit",
          label: "结算时间"
        },
        {
          prop: "hosDosageValue",
          label: "总费用"
        },
        {
          prop: "hosPrice",
          label: "报销总金额"
        }
      ],
      tableData: [],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      rightSearchParams: {
        settlementNum: "",
        displayRecords: false
      },
      rightStockDater: [],
      loadingRight: false,
      tableHeaderRight: [
        {
          prop: "medicareType",
          label: "结算流水号"
        },
        {
          prop: "itemType",
          label: "报销类型"
        },
        {
          prop: "itemCode",
          label: "个人编码"
        },
        {
          prop: "itemName",
          label: "姓名"
        },
        {
          prop: "itemGeneralName",
          label: "结算时间"
        },
        {
          prop: "itemStandardName",
          label: "总费用"
        },
        {
          prop: "itemEnName",
          label: "报销总金额"
        }
      ],
      tableDataRight: [],
      pageParamsRight: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      loadingBottom: false,
      tableHeaderBottom: [
        {
          prop: "uploadFlag",
          label: "结算流水号"
        },
        {
          prop: "staffApproval",
          label: "错误信息",
          width: 800
        },
        {
          prop: "residentApproval",
          label: "报销类型"
        },
        {
          prop: "siItemCode",
          label: "个人编码"
        },
        {
          prop: "siItemName",
          label: "姓名"
        },
        {
          prop: "siItemType",
          label: "结算时间"
        },
        {
          prop: "itemLevel",
          label: "总费用"
        },
        {
          prop: "hosMaxPrice",
          label: "报销总金额"
        }
      ],
      tableDataBottom: [],
      currentRow: null,
      currentRowRight: null,
      // 缓存查询条件
      cacheLeftSearchParams: {},
      cacheRightSearchParams: {},
      // 改账弹窗
      modelVisible: false,
      // 历次对账结果弹窗
      modelVisible2: false,
      checkHisTableHeader: [
        {
          prop: "s1",
          label: "交易日期区间"
        },
        {
          prop: "s2",
          label: "结果"
        },
        {
          prop: "s3",
          label: "原因"
        },
        {
          prop: "s4",
          label: "操作员"
        },
        {
          prop: "s5",
          label: "日期"
        }
      ],
      checkHisTableData: [],
      checkHisPage: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  created() {
    this.getMedicareType();
  },
  methods: {
    // 获取医保类别
    getMedicareType() {
      getPagemd().then(res => {
        if (res.code === 1) {
          this.medicareList = res.data;
          res.data.forEach(item => {
            this.medicareTypeShow[item.dictCode] = item.dictName;
          });
        }
      });
    },
    search() {
      this.cacheLeftSearchParams = { ...this.leftSearchParams };
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    reset() {
      this.leftStockDater = null;
      this.syncQuery = false;
      this.leftSearchParams = this.$options.data().leftSearchParams;
    },
    // 获取院内交易
    loadTable() {
      this.leftSearchParams = { ...this.cacheLeftSearchParams };
      const params = {
        ...this.leftSearchParams,
        itemType: this.itemType,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      };
      /* this.loading = true;
      getPageHosChargeList(params)
        .then(res => {
          if (res.code === 1) {
            this.currentRow = null;
            this.$refs.leftTable.setCurrentRow();
            this.pageParams.total = res.total;
            this.tableData = res.data;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        }); */
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.loadTableBottom(val);
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    searchRight() {
      this.cacheRightSearchParams = { ...this.rightSearchParams };
      this.pageParamsRight.pageNo = 1;
      this.loadTableRight();
    },
    resetRight() {
      this.rightStockDater = [];
      this.rightSearchParams = this.$options.data().rightSearchParams;
    },
    // 获取医保交易
    loadTableRight() {
      this.rightSearchParams = { ...this.cacheRightSearchParams };
      const params = {
        ...this.rightSearchParams,
        medicareType: this.medicareType,
        itemType: this.itemType,
        pageNo: this.pageParamsRight.pageNo,
        pageSize: this.pageParamsRight.pageSize
      };
      /* this.loadingRight = true;
      getPageItemList(params)
        .then(res => {
          if (res.code === 1) {
            this.currentRowRight = null;
            this.$refs.rightTable.setCurrentRow();
            this.pageParamsRight.total = res.total;
            this.tableDataRight = res.data;
          }
          this.loadingRight = false;
        })
        .catch(err => {
          this.loadingRight = false;
        }); */
    },
    handleCurrentChangeRight(val) {
      this.currentRowRight = val;
    },
    changeSizeRight(val) {
      this.pageParamsRight.pageSize = val;
      this.loadTableRight();
    },
    changePageRight(val) {
      this.pageParamsRight.pageNo = val;
      this.loadTableRight();
    },
    // 获取院内交易错误信息
    loadTableBottom(params) {
      /*  this.loadingBottom = true;
      getPageItemMatchDTOList(params)
        .then(res => {
          if (res.code === 1) {
            this.currentRowBottom = null;
            this.$refs.bottomTable.setCurrentRow();
            this.tableDataBottom = this.tableDataBottom.concat(res.data);
          }
          this.loadingBottom = false;
        })
        .catch(err => {
          this.loadingBottom = false;
        }); */
    },
    headerDragend() {
      this.$refs.leftTable.doLayout();
    },
    headerDragendRight() {
      this.$refs.rightTable.doLayout();
    },
    headerDragendBottom() {
      this.$refs.bottomTable.doLayout();
    },
    // 改账
    changeAccount(data) {
      this.modelVisible = true;
    },
    // 同步查询条件
    syncQueryChange(val) {
      if (val) {
        this.rightStockDater = this.leftStockDater;
        this.rightSearchParams.settlementNum = this.leftSearchParams.settlementNum;
      }
    },
    conserve() {},
    // 查询历史对账
    checkHistory() {
      this.modelVisible2 = true;
    },
    changeSizeCheck(val) {
      this.checkHisPage.pageSize = val;
    },
    changePageCheck(val) {
      this.checkHisPage.pageNo = val;
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
.top-seatch {
  line-height: 34px;
  /deep/ .l-input-wrap {
    vertical-align: top;
  }
}

.top-search-item {
  display: inline-block;
  width: 200px;
  vertical-align: top;
  margin-right: 10px;
}

.center {
  height: calc(100% - 251px);
  overflow: hidden;
}

.center-item {
  width: calc(50% - 10px);
  height: 100%;
}

.left-table {
  height: calc(100% - 173px);
  margin: 10px 0;
}

.right-table {
  height: calc(100% - 173px);
  margin: 10px 0;
}

.contrast {
  padding: 10px 0;
}

.align-right {
  text-align: right;
}

.page {
  .el-pagination {
    padding: 0;
    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
  }
}
.card-title {
  height: 40px;
  line-height: 40px;
  /deep/ .titleleft::before {
    margin-top: 10px;
  }
}
.contrast-table {
  height: 175px;
}
.check-box {
  line-height: 34px;
}
.check-his {
  padding: 20px;
  .page {
    margin-top: 20px;
  }
}
</style>
