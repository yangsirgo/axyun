<template>
  <div class="drugList width100 height100 position-relative">
    <el-card class="card-cont width100 height100">
      <div class="search-input">
        <el-row :gutter="10">
          <el-col :span="5">
            <LFormtTitle label="药房名称" labelWidth="76">
              <el-input v-model="searchData.name" style="line-height: 34px;" placeholder="药房名称"></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="3">
            <el-checkbox
              v-model="searchData.isShow"
              @change="isvalid"
              style="margin: 8px 0 0 15px"
            >仅显示有效药房</el-checkbox>
          </el-col>
          <el-col :span="16" style="text-align: right;">
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
          v-loading="tlm_isLoading"
          @header-dragend="headerDragend"
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
              <template v-if="item.prop == 'deptId'">
                <span
                  tableName="sys_org"
                  :conditionMap="{org_type: '_DEPT_', id: scope.row.deptId}"
                  columns="org_nm"
                  v-tableTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'pharType'">
                <span v-if="scope.row.pharType=='00'">门诊药房</span>
                <span v-if="scope.row.pharType=='01'">住院药房</span>
                <span v-if="scope.row.pharType=='02'">草药房</span>
                <span v-if="scope.row.pharType=='03'">静配中心</span>
                <span v-if="scope.row.pharType=='04'">病区科室药房</span>
                <span v-if="scope.row.pharType=='05'">输液室药房</span>
                <span v-if="scope.row.pharType=='06'">综合药房</span>
              </template>
              <template v-else-if="item.prop == 'wmedicinePermit'">
                <span v-if="scope.row.wmedicinePermit==false">否</span>
                <span v-if="scope.row.wmedicinePermit==true">是</span>
              </template>
              <template v-else-if="item.prop == 'cmedicinePermit'">
                <span v-if="scope.row.cmedicinePermit==false">否</span>
                <span v-if="scope.row.cmedicinePermit==true">是</span>
              </template>
              <template v-else-if="item.prop == 'subdispensePermit'">
                <span v-if="scope.row.subdispensePermit==false">否</span>
                <span v-if="scope.row.subdispensePermit==true">是</span>
              </template>
              <template v-else-if="item.prop == 'applyPermit'">
                <span v-if="scope.row.applyPermit==false">否</span>
                <span v-if="scope.row.applyPermit==true">是</span>
              </template>
              <template v-else-if="item.prop == 'scrapPermit'">
                <span v-if="scope.row.scrapPermit==false">否</span>
                <span v-if="scope.row.scrapPermit==true">是</span>
              </template>
              <template v-else-if="item.prop == 'status'">
                <span v-if="scope.row.status=='0'">暂停</span>
                <span v-if="scope.row.status=='1'">正常</span>
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
export default {
  props: ["refreshList"],
  data() {
    return {
      //搜索条件
      searchData: {
        name: "",
        status: "",
        isShow: false
      },
      chacklist: [], //删除选中的数据
      //表头数据
      drugParams: [
        {
          prop: "pharCode",
          label: "药房编码",
          align: "left",
          width: "80",
          fixed: "left"
        },
        {
          prop: "pharName",
          label: "药房名称",
          align: "left",
          width: "90",
          fixed: "left"
        },

        {
          prop: "phoneticCode",
          label: "拼音码",
          align: "left",
          width: "150",
          fixed: false
        },
        {
          prop: "fiveStrokeCode",
          label: "五笔码",
          align: "left",
          width: "70",
          fixed: false
        },

        {
          prop: "customizeCode",
          label: "自定义码",
          align: "left",
          width: "90",
          fixed: false
        },

        {
          prop: "deptId",
          label: "所属科室",
          align: "left",
          width: "180",
          fixed: false
        },

        {
          prop: "pharType",
          label: "药房类型",
          align: "left",
          width: "100",
          fixed: false
        },

        {
          prop: "wmedicinePermit",
          label: "西药配方权",
          align: "left",
          width: "100",
          fixed: false
        },

        {
          prop: "cmedicinePermit",
          label: "草药配方权",
          align: "left",
          width: "100",
          fixed: false
        },

        {
          prop: "subdispensePermit",
          label: "是否允许代配",
          align: "left",
          width: "120",
          fixed: false
        },

        {
          prop: "applyPermit",
          label: "是否允许申请",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "scrapPermit",
          label: "是否允许报废",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "status",
          label: "状态类型",
          align: "left",
          width: "110",
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
    //获取药品表格数据
    getDrugList() {
      this.tlm_isLoading = true;
      base
        .getPharmacy({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          name: this.searchData.name,
          status: this.searchData.status
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
    //点击某一行药品
    rowClick(row) {
      this.$emit("getIsDrug", row);
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
    //重置
    reset() {
      this.searchData.name = "";
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
    // 取消高亮
    clearHightCur() {
      this.$refs.singleTable.setCurrentRow();
      this.$emit("getIsDrug", {});
    },
    newadd() {
      this.$emit("newadd");
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
          ids = ids.join(",");
          this.$showLoading();
          base
            .delpharmac(ids)
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
