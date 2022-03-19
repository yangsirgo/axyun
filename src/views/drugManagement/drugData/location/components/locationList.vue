<template>
  <div class="drugList width100 height100 position-relative">
    <el-card class="card-cont width100 height100">
      <div class="search-input">
        <el-row :gutter="10">
          <el-col :span="5">
            <l-formt-title label="库房" labelWidth="36">
              <el-select v-model="searchData.storageCode" @change="storageChange" placeholder="请选择">
                <el-option
                  v-for="item in drugStorageList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="5">
            <l-formt-title label="药品名称" labelWidth="76">
              <el-input v-model="searchData.drugName" style="line-height: 34px;" placeholder="药品名称"></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="4">
            <l-formt-title label="货位大类" labelWidth="76">
              <el-select v-model="searchData.locationSort" placeholder="请选择">
                <el-option
                  v-for="item in locationList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="10" style="text-align: right;">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
<!--            <el-button type="primary" plain @click="newadd">新增</el-button>-->
          </el-col>
        </el-row>
      </div>
      <div
        class="drug-list-cont position-absolute"
        style="top: 55px;bottom:20px;left: 20px;right: 20px;"
      >
        <el-table
          ref="singleTable"
          :data="drugData"
          border
          width="100%"
          height="100%"
          highlight-current-row
          @current-change="rowClick"
          @header-dragend="headerDragend"
        >
          <el-table-column
            v-for="(item,index) in drugParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'originCode'">
                <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
              </template>
              <template v-else-if="item.prop == 'purchasePrice'">
                <span>{{ formatNum(scope.row.purchasePrice) }}</span>
              </template>
              <template v-else-if="item.prop == 'price'">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
              <template v-else-if="item.prop == 'locationSort'">
                <span
                    tableName="hrp_location_sort"
                    :conditionMap="{STORAGE_CODE: scope.row.storageCode,LOCATION_SORT: scope.row.locationSort || ''}"
                    columns="LOCATION_SORT_NAME"
                    v-tableTransform
                  ></span>
              </template>
              <template v-else>
                <span class="overflow-point">{{ scope.row[item.prop]}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import stock from "@/api/hmm/stock";
import formatNum from "@/utils/formatPrice.js";
import hmmBaseApi from "@/api/hmm/base";
export default {
  props: ["refreshList", "drugStorageList", "storageCode", "locationList"],
  data() {
    return {
      //搜索条件
      searchData: {
        storageCode: this.storageCode,
        drugName: "",
        locationSort: ""
      },
      //表头数据
      drugParams: [
        {
          prop: "drugName",
          label: "药品名称",
          align: "left",
          width: "213",
          fixed: "left"
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          width: "150",
          fixed: false
        },
        {
          prop: "locationSort",
          label: "货位大类",
          align: "left",
          width: "100",
          fixed: false
        },
        {
          prop: "locationSortNo",
          label: "货位号",
          align: "left",
          width: "100",
          fixed: false
        },
        {
          prop: "originCode",
          label: "生产厂商",
          align: "left",
          width: "240",
          fixed: false
        },
        {
          prop: "purchasePrice",
          label: "参考进价(元)",
          align: "right",
          width: "120",
          fixed: false
        },
        {
          prop: "price",
          label: "参考售价(元)",
          align: "right",
          width: "120",
          fixed: false
        },
        {
          prop: "updatedByName",
          label: "操作人",
          align: "left",
          width: "90",
          fixed: false
        },
        {
          prop: "updatedAt",
          label: "操作时间",
          align: "left",
          width: "160",
          fixed: false
        }
      ],
      //表格数据
      drugData: [],
      //每次请求的分页表格数据
      drugDataUnit: [],
      //分页数据
      page: 1,
      limit: 10,
      total: 0,
      tlm_noMore: false,
      tlm_isLoading: false,
      loading: false
    };
  },
  watch: {
    refreshList() {
      this.getDrugList();
    },
    storageCode: {
      handler(val) {
        this.searchData.storageCode = val;
        this.search();
      }
    }
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    //获取药品表格数据
    getDrugList() {
      this.$showLoading();
      let pharmacyPositionQueryVO = {};
      pharmacyPositionQueryVO.storageCode = this.searchData.storageCode;
      pharmacyPositionQueryVO.drugId = this.searchData.drugId;
      pharmacyPositionQueryVO.drugName = this.searchData.drugName;
      pharmacyPositionQueryVO.locationSort = this.searchData.locationSort;
      stock.getPharmacyPositionList(pharmacyPositionQueryVO).then(res => {
        this.$hideLoading();
        this.drugData = res;
        this.setCurrent(this.drugData[0]);
        this.$emit("getIsDrug", this.drugData[0]);
      });
    },
    //高亮首行
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    //搜索
    async search() {
      this.getDrugList();
    },
    //重置
    reset() {
      this.searchData.storageCode = "";
      this.searchData.drugName = "";
      this.searchData.locationSort = "";
      this.pageParams.pageNo = 1;
      this.pageParams.total = 0;
      this.search();
    },
    //点击某一行药品
    rowClick(row) {
      this.$emit("getIsDrug", row);
    },
    storageChange(val) {
      this.$emit("getStorageCode", val);
    },
    newadd() {
      this.$refs.singleTable.setCurrentRow();
      this.$emit("newadd");
    },
    headerDragend() {
      this.$refs.singleTable.doLayout();
    },
    getLocation(code) {
      hmmBaseApi
        .getSelectLocation(code)
        .then(res => {
          if (res.code === 1) {
            this.locationList = res.data;
          } else {
            this.$message.error("获取位置大类失败");
          }
        })
        .catch(err => {
          this.$message.error("获取位置大类失败");
        });
    },
  }
};
</script>

<style scoped lang="scss">
.drugList {
  .card-cont {
    padding: 20px;

    .search-button {
      width: 80px;
      height: 36px;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: $l-font-size;
      
      font-weight: 400;
      color: $l-color-white;
    }

    .drug-list-cont {
      margin-top: 20px;
    }
  }
}
</style>
