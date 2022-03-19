<template>
  <div class="drugList width100 height100 position-relative">
    <el-card class="card-cont width100 height100">
      <div class="search-input">
        <el-row :gutter="5">
          <el-col :span="24" style="text-align: right;">
            <el-button type="primary" @click="del">删除</el-button>
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
              <template v-if="item.prop == 'isDefault'">
                <span v-if="scope.row.isDefault=='0'">是</span>
                <span v-if="scope.row.isDefault=='1'">否</span>
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
          width: "160",
          fixed: "left"
        },

        {
          prop: "storageCode",
          label: "药库编码",
          align: "left",
          width: "100",
          fixed: false
        },
        {
          prop: "storageName",
          label: "药库名称",
          align: "left",
          width: "100",
          fixed: false
        },
        /* {
          prop: "isDefault",
          label: "是否默认",
          align: "left",
          width: "90",
          fixed: false
        }, */
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
      chacklist: [], //删除选中的数据
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
  computed: {
    // 控制是否还可以继续加载
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  methods: {
    //获取药品表格数据
    getDrugList() {
      this.tlm_isLoading = true;
      base
        .getStrgPharRela({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize
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
    search() {
      this.pageParams.page = 1;
      this.pageParams.total = 0;
      this.getDrugList();
      this.$emit("getIsDrug", this.drugData[0]);
    },
    //点击某一行药品
    rowClick(row) {
      this.$emit("getIsDrug", row);
    },
    //勾选行
    handleSelectionChange(val) {
      this.chacklist = val;
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.getDrugList();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.getDrugList();
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
          const pharCodeList = this.chacklist.map(item => item.id);
          this.$showLoading();
          base
            .delsTrgPharRela(pharCodeList)
            .then(res => {
              done();
              this.$hideLoading();
              if (res.code === 1) {
                this.$message.success(res.msg || "删除成功!");
                this.search();
              } else {
                this.$message.error(res.msg || "删除失败!");
              }
            })
            .catch(err => {
              done();
              this.$hideLoading();
              this.$message.error(err.msg || "删除失败!");
            });
        }
      });
    },
    newadd() {
      this.$refs.singleTable && this.$refs.singleTable.setCurrentRow();
      this.$emit("newadd");
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
