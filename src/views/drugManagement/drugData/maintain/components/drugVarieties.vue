<template>
  <div class="drug-varieties width100 height100 position-relative">
    <div class="search-input clearfix">
      <el-col :span="5">
        <LFormtTitle label="搜索药品" labelWidth="76">
          <el-input
            v-model="searchValue"
            style="line-height: 34px"
            placeholder="拼音/五笔"
            @keyup.enter.native="search"
          ></el-input>
        </LFormtTitle>
      </el-col>
      <el-col :span="19" style="text-align: right">
        <el-button class="primary-button" @click="search">查询</el-button>
      </el-col>
    </div>

    <div class="drug-varieties-cont">
      <el-table
        ref="singleTable"
        :data="drugData"
        border
        stripe
        width="100%"
        height="100%"
        highlight-current-row
        @current-change="rowClick"
        @header-dragend="headerDragend"
        v-loading="tlm_isLoading"
        element-loading-text="加载中..."
      >
        <el-table-column
          v-for="(item, index) in drugParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align || 'left'"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.prop == 'price'">
              <span>{{ formatNum(scope.row.price) }}</span>
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
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import formatNum from "@/utils/formatPrice.js";
import hmmBaseApi from "@/api/hmm/base";

export default {
  name: "drugVarieties",
  components: {},
  data() {
    return {
      searchValue: "", //搜索框
      //表格
      drugParams: [
        {
          prop: "className",
          label: "药品分类",
          align: "left",
          width: "203",
          fixed: "left",
        },
        {
          prop: "drugName",
          label: "药品名称",
          align: "left",
          width: "377",
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          width: "244",
        },
        {
          prop: "originName",
          label: "生产厂商",
          align: "left",
          // width: 100
        },
        {
          prop: "formName",
          label: "剂型",
          align: "left",
          width: "160",
        },
        {
          prop: "manageTypeName",
          label: "管理类型",
          align: "left",
        },
        {
          prop: "controlLevelName",
          label: "控制级别",
          align: "left",
        },
        {
          prop: "price",
          label: "参考售价(元)",
          align: "right",
          width: "120",
        },
      ],
      drugData: [], //表格数据
      drugDataUnit: [], //单页表格数据
      currentIndex: 0, //当前行数
      //分页数据
      page: 1,
      limit: 20,
      total: 0,
      tlm_isLoading: false,
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    //获取药品表格数据
    async getDrugList() {
      if (this.tlm_isLoading) return;
      this.tlm_isLoading = true;

      hmmBaseApi
        .getListForPage({
          currDrugStorage: "1",
          pageNo: this.page,
          pageSize: this.limit,
          name: this.searchValue
        })
        .then((response) => {
          this.drugData = [];
          if (response.code === 1) {
            this.total = response.total;
            this.drugData = response.data;
            this.setCurrent(this.drugData[0] || {});
          }
          this.tlm_isLoading = false;
        })
        .catch((error) => {
          this.tlm_isLoading = false;
        });
    },
    //高亮首行
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
      this.$emit("getIsDrug", row.drugId);
    },
    //enter搜索
    search() {
      this.page = 1;
      this.total = 0;
      this.getDrugList();
    },
    //点击某一行药品
    rowClick(row) {
      this.$emit("getIsDrug", row.drugId);
    },
    changeSize(val) {
      this.limit = val;
      this.getDrugList();
    },
    changePage(val) {
      this.page = val;
      this.getDrugList();
    },
    headerDragend() {
      this.$refs.singleTable.doLayout();
    },
  },
};
</script>

<style scoped lang="scss">
.drug-varieties {
  .search-input {
    .primary-button {
      width: 80px;
      height: 36px;
      padding: 0 12px;
      margin-left: 20px;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: $l-font-size;

      font-weight: 400;
      color: $l-color-white;
      border: none;
    }
  }

  .drug-varieties-cont {
    height: calc(100% - 104px);
    margin: 18px 0 20px 0;
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
