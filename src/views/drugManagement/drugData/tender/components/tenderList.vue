<template>
  <div class="drugList width100 height100 position-relative">
    <el-card class="card-cont width100 height100">
      <div class="search-input">
        <el-row :gutter="10">
          <el-col :span="4">
            <l-formt-title label="药品名称" labelWidth="76">
              <el-input v-model="searchData.name" style="line-height: 34px;" placeholder="药品名称"></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="供应商" labelWidth="76">
              <Supplier clearable :value.sync="searchData.supplierCode" />
            </l-formt-title>
          </el-col>
          <el-col :span="3">
            <el-checkbox
              v-model="searchData.isShow"
              @change="isvalid"
              style="margin: 8px 0 0 15px"
            >仅显示有效药品</el-checkbox>
          </el-col>
          <el-col :span="11" style="text-align: right;">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
            <el-button type="primary" plain @click="del">删除</el-button>
            <el-button type="primary" plain @click="newadd">新增</el-button>
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
          @current-change="rowClick"
          @selection-change="handleSelectionChange"
          @header-dragend="headerDragend"
          v-loading="tlm_isLoading"
          element-loading-text="加载中..."
        >
          <el-table-column type="selection" width="40"></el-table-column>
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
              <template v-else-if="item.prop == 'originIdentificationCode'">
                <span
                  :val="scope.row.originIdentificationCode"
                  code="DrugManufacturerFlag"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'supplierCode'">
                <span :val="scope.row.supplierCode" code="DrugSupplier" v-codeTransform></span>
              </template>
              <template v-else-if="item.prop == 'purchasePrice'">
                <span>{{ formatNum(scope.row.purchasePrice) }}</span>
              </template>
              <template v-else-if="item.prop == 'price'">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
              <template v-else>
                <span class="overflow-point">{{ scope.row[item.prop]}}</span>
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
    </el-card>
  </div>
</template>

<script>
import base from "@/api/hmm/base";
import formatNum from "@/utils/formatPrice.js";
import Supplier from "@/views/drugManagement/drugstock/purchase/component/supplier.vue";

export default {
  props: ["refreshList", "supplierList"],
  components: {
    Supplier
  },
  data() {
    return {
      //搜索条件
      searchData: {
        name: "",
        status: "",
        supplierCode: "",
        isShow: false
      },
      chacklist: [], //删除选中的数据
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
          prop: "originCode",
          label: "生产厂商",
          align: "left",
          width: "200",
          fixed: false
        },
        {
          prop: "supplierCode",
          label: "供应商",
          align: "left",
          width: "200",
          fixed: false
        },
        {
          prop: "purchasePrice",
          label: "进价(元)",
          align: "right",
          width: "120",
          fixed: false
        },
        {
          prop: "price",
          label: "售价(元)",
          align: "right",
          width: "120",
          fixed: false
        },
        {
          prop: "originIdentificationCode",
          label: "生产厂商标识",
          align: "left",
          width: "120",
          fixed: false
        },

        {
          prop: "createdByName",
          label: "创建人",
          align: "left",
          width: "90",
          fixed: false
        },
        {
          prop: "createdAt",
          label: "创建时间",
          align: "left",
          width: "180",
          fixed: false
        },
        {
          prop: "updatedByName",
          label: "修改人",
          align: "left",
          width: "90",
          fixed: false
        },
        {
          prop: "updatedAt",
          label: "修改时间",
          align: "left",
          width: "180",
          fixed: false
        },
        {
          prop: "contractNum",
          label: "合同编号",
          align: "left",
          width: "120",
          fixed: false
        }
      ],
      //表格数据
      drugData: [],
      //分页数据
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      tlm_isLoading: false
    };
  },
  watch: {
    refreshList() {
      this.getDrugList();
    }
  },
  mounted() {
    this.search();
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    newadd() {
      this.$refs.singleTable && this.$refs.singleTable.setCurrentRow();
      this.$emit("newadd");
    },
    //获取药品表格数据
    getDrugList() {
      this.tlm_isLoading = true;
      base
        .getbidDrugList({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          name: this.searchData.name,
          status: this.searchData.status,
          supplierCode: this.searchData.supplierCode
        })
        .then(res => {
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.drugData = res.data;
            this.setCurrent(this.drugData[0] || {});
          }
          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.$message.error(err);
          this.tlm_isLoading = false;
        });
    },
    //高亮首行
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    //搜索
    async search() {
      this.pageParams.page = 1;
      this.pageParams.total = 0;
      this.searchData.status = this.searchData.status;
      this.getDrugList();
      this.$emit("getIsDrug", this.drugData[0]);
    },
    //仅显示有效
    isvalid(val) {
      this.searchData.isShow = val;
      if (this.searchData.isShow == true) {
        this.searchData.status = "1";
        this.search();
      }
      if (this.searchData.isShow == false) {
        this.searchData.status = "";
        this.search();
      }
    },
    //点击某一行药品
    rowClick(row) {
      this.$emit("getIsDrug", row);
    },
    //重置
    reset() {
      this.searchData.name = "";
      this.searchData.supplierCode = "";
      this.searchData.isShow = false;
      this.searchData.status = "";
      this.pageParams.pageNo = 1;
      this.pageParams.total = 0;
      this.search();
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.getDrugList();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.getDrugList();
    },
    //勾选行
    handleSelectionChange(val) {
      this.chacklist = val;
    },
    //删除行
    del() {
      if (this.chacklist.length == 0) {
        this.$message.warning("请选择一条或者多条数据");
        return;
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除选中条目?",
        confirm: (action, instance, done) => {
          let ids = [];
          this.chacklist.map(item => ids.push(item.id));
          this.$showLoading();
          base
            .delbidDrug(ids)
            .then(res => {
              done();
              this.$hideLoading();
              if (res.code === 1) {
                this.$message.success(res.msg || "删除成功!");
                this.search();
              } else {
                this.$message.error(res.msg || "删除失败");
              }
            })
            .catch(err => {
              done();
              this.$hideLoading();
              this.$message.error(err.msg || "删除失败");
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
      height: calc(100% - 106px);
      margin: 20px 0;
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
