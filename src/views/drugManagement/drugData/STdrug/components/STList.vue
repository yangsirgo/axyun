<template>
  <div class="drugList width100 height100 position-relative">
    <el-card class="card-cont width100 height100">
      <div class="search">
        <div class="search-input">
          <el-row :gutter="10">
            <el-col :span="4">
              <LFormtTitle label="药品名称" labelWidth="76">
                <el-input v-model="searchData.name" style="line-height: 34px;" placeholder="药品名称"></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="皮试液类型" labelWidth="76">
                <el-select v-model="searchData.liquid" placeholder="请选择">
                  <el-option
                    v-for="item in liquidlist"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="皮试类型" labelWidth="76">
                <el-select v-model="searchData.stCode" placeholder="请选择">
                  <el-option
                    v-for="item in stCodelist"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="3">
              <el-checkbox
                v-model="searchData.isShow"
                @change="isvalid"
                style="margin: 8px 0 0 15px"
              >仅显示有效药品</el-checkbox>
            </el-col>
          </el-row>
        </div>
        <div class="search-btn">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="reset">重置</el-button>
          <el-button type="primary" plain @click="del">删除</el-button>
          <el-button type="primary" plain @click="newadd">新增</el-button>
        </div>
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
              <template v-if="item.prop == 'status'">
                <span v-if="scope.row.status=='0'">暂停</span>
                <span v-if="scope.row.status=='1'">正常</span>
              </template>
              <template v-else-if="item.prop == 'stType'">
                <span v-if="scope.row.stType=='0'">非必须皮试</span>
                <span v-if="scope.row.stType=='1'">必须皮试</span>
              </template>
              <template v-else-if="item.prop == 'stSolutionType'">
                <span v-if="scope.row.stSolutionType=='0'">原液皮试</span>
                <span v-if="scope.row.stSolutionType=='1'">皮试液皮试</span>
              </template>
              <template v-else-if="item.prop == 'positiveDispense'">
                <span v-if="scope.row.positiveDispense=='0'">阳性不允许发药</span>
                <span v-if="scope.row.positiveDispense=='1'">阳性允许发药</span>
              </template>
              <template v-else-if="item.prop == 'applicationRange'">
                <span v-if="scope.row.applicationRange=='0'">全院</span>
                <span v-if="scope.row.applicationRange=='1'">住院</span>
                <span v-if="scope.row.applicationRange=='2'">门诊</span>
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
        liquid: "",
        stCode: "",
        status: "",
        isShow: false
      },
      chacklist: [], //删除选中的数据
      liquidlist: [
        { code: "0", name: "原液皮试" },
        { code: "1", name: "皮试液皮试" }
      ], //皮试液类型数据源
      stCodelist: [
        { code: "0", name: "非必须皮试" },
        { code: "1", name: "必须皮试" }
      ], //皮试类型数据源
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
          prop: "stType",
          label: "皮试类型",
          align: "left",
          width: "90",
          fixed: false
        },
        {
          prop: "stSolutionType",
          label: "皮试液类型",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "stRemindTime",
          label: "提醒时间",
          align: "right",
          width: "90",
          fixed: false
        },
        {
          prop: "validTime",
          label: "有效时间",
          align: "right",
          width: "90",
          fixed: false
        },

        {
          prop: "positiveDispense",
          label: "阳性允许发药",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "applicationRange",
          label: "适用范围",
          align: "left",
          width: "90",
          fixed: false
        },
        {
          prop: "status",
          label: "状态标识",
          align: "left",
          width: "90",
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
  mounted() {
    this.search();
  },
  watch: {
    refreshList() {
      this.getDrugList();
    }
  },
  methods: {
    //获取药品表格数据
    getDrugList() {
      this.tlm_isLoading = true;
      base
        .getstDrugList({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          name: this.searchData.name,
          stSolutionType: this.searchData.liquid,
          stType: this.searchData.stCode,
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
    newadd() {
      this.$refs.singleTable && this.$refs.singleTable.setCurrentRow();
      this.$emit("newadd");
    },
    //高亮首行
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    //搜索
    search() {
      this.pageParams.page = 1;
      this.pageParams.total = 0;
      this.searchData.status = this.searchData.status;
      this.getDrugList();
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
      this.searchData.liquid = "";
      this.searchData.stCode = "";
      this.searchData.isShow = false;
      this.searchData.status = "";
      this.pageParams.pageNo = 1;
      this.pageParams.total = 0;
      this.search();
    },
    //点击某一行药品
    rowClick(row) {
      this.$emit("getIsDrug", row);
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
      if (this.chacklist.length === 0) {
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
            .delestDrug(ids)
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
    .search {
      display: flex;
      .search-input {
        flex: 1;
        overflow: hidden;
        margin-right: 10px;
      }
      .search-btn {
        text-align: right;
      }
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
