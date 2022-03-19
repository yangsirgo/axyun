<template>
  <el-card class="temMeasure height100">
    <div class="search-cont">
      <el-form :model="searchValue"  ref="searchValue"  >
        <el-row :gutter="24">
          <el-col :span="3"
          ><el-form-item prop="storageId">
            <LFormtTitle label="库房" disabled
            ><el-select clearable v-model="searchValue.storageId"  disabled>
              <el-option v-for="item in storageNameList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
            </el-select></LFormtTitle
            ></el-form-item></el-col>
          <el-col :span="3"
          ><el-form-item prop="type"><LFormtTitle label="物资类型"
          ><l-value-domain

            clearable
            code="goodsType"
            :value.sync="searchValue.type"
          /></LFormtTitle
          ></el-form-item></el-col>
          <el-col :span="3"
          ><el-form-item prop="goodsName"><LFormtTitle label="物资名称"
          ><el-input v-model="searchValue.goodsName" placeholder="拼音码/汉字"></el-input></LFormtTitle
          ></el-form-item></el-col>
          <el-col :span="4">
            <div class="float-right">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="" @click="resetForm('searchValue')">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-cont">
      <el-table
        ref="tableData"
        :data="tableData"
        height="100%"
        v-loading="loading"
        border
      >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          sortable
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.prop == 'goodsType'">
                  <span
                    :val="scope.row.goodsType"
                    code="goodsType"
                    v-codeTransform
                  ></span>
            </template>
            <template v-else>
              <span class="overflow-point">{{ scope.row[item.prop] }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page align-right margin-top-10">
      <span class="total-box">
        <span>进价总金额 ： {{totalPurchaseAmount}}元</span>
         <span style="margin-left: 50px">售价总金额 ： {{totalAmount}}元</span>
      </span>
      <el-pagination
        background
        @size-change="changeSize"
        @current-change="changePage"
        :current-page="pageParams.pageNo"
        :page-sizes="[50, 100, 200]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
        :pager-count="5"
      ></el-pagination>
    </div>

  </el-card>
</template>
<script>
import WarehousingAPI from "@/api/materielStorage/warehousing";
import { deepClone } from "@/utils/index.js";
export default {
  components: {

  },
  data() {
    return {
      searchValue: {
        storageId:JSON.parse(window.localStorage.getItem('role')).deptId,
        type:'',
        goodsName:''
      },
      totalPurchaseAmount:'',
      totalAmount:'',
      storageNameList:[],
      pageParams: {
        pageNo: 1,
        pageSize: 100,
      },
      loading: false,
      columns: [
        {
          label: "物资名称",
          prop: "goodsName",
          width: 110,
        },
        {
          label: "规格",
          prop: "spec",
          width: 170,
        },
        {
          label: "库存量",
          prop: "stockQtyDisplay",
          width: 110,
        },
        {
          label: "进价",
          prop: "purchasePrice",
          width: 80,
        },
        {
          label: "售价",
          prop: "price",
          width:110,
        },
        {
          label: "生产批号",
          prop: "batchNum",
          width: 110,
        },
        {
          label: "有效期",
          prop: "expDate",
          width: 130,
        },
        {
          label: "生产厂商",
          prop: "originName",
          width: 220,
        },
        {
          label: "厂商标识",
          prop: "originIdentificationName",
          width: 150,
        },
        {
          label: "物资类型",
          prop: "goodsType",
          width: 120,
        },
        {
          label: "物资编码",
          prop: "goodsCode",
          width: 120,
        },{
          label: "条码",
          prop: "barCode",
          width: 130,
        },{
          label: "进价金额",
          prop: "purchaseAmt",
          width: 120,
        },{
          label: "售价金额",
          prop: "amt",
          width: 120,
        }
      ],
      tableData: [],

    };
  },
  created() {
    let param = {}
    param.deptId = JSON.parse(window.localStorage.getItem('role')).deptId
    param.deptName = JSON.parse(window.localStorage.getItem('role')).deptName
    this.storageNameList.push(param)
    this.search()
  },
  methods: {

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.search();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.search();
    },
    async search() {
      try {
        this.loading = true;
        let param = {
          goodsName:this.searchValue.goodsName,
          storageId:this.searchValue.storageId,
          type:this.searchValue.type,
          totalAmountFlag:'1',
          ...this.pageParams,

        };
        let res = await WarehousingAPI.getWarehousingCheck(param);
        if (res.code === 1) {
          this.tableData = res.data;
          this.pageParams.total = res.total;
          this.totalAmount = res.totalAmount;
          this.totalPurchaseAmount = res.totalPurchaseAmount
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },






  },
};
</script>
<style scoped lang="scss">
.temMeasure {
  padding: 6px;
  .search-cont {
  }
  .table-cont {
    margin-top: 10px;
    height: calc(100% - 100px);
  }
  .page {
    .total-box{
      float: left;
      line-height: 32px;
      margin-left: 100px;
    }
    /deep/.el-pagination {
      padding: 0;
      float: right;
      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
      /deep/ .el-pager .number {
        width: auto;
      }
      /deep/ .el-pagination__editor.el-input {
        width: auto;
      }
    }
  }
  .align-right {
    text-align: right;
  }
}
</style>


