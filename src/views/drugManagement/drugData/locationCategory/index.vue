<template>
  <flow-menu>
    <slot name="content">
      <div class="height100">
        <div class="bottom">
          <div class="right float-right">
            <el-card class="padding20 height100">
              <div class="form">
                <el-form
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  label-width="0"
                  class="demo-ruleForm"
                >
                  <LFormtTitle required label="位置大类代码">
                    <el-form-item prop="locationSort">
                      <el-input v-model="ruleForm.locationSort"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                  <LFormtTitle required label="位置大类名称">
                    <el-form-item prop="locationSortName">
                      <el-input v-model="ruleForm.locationSortName" maxlength="12"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <LFormtTitle label="拼音码" disabled>
                        <el-form-item prop="phoneticCode">
                          <el-input disabled v-model="ruleForm.phoneticCode"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="12">
                      <LFormtTitle label="五笔码" disabled>
                        <el-form-item prop="fiveStrokeCode">
                          <el-input disabled v-model="ruleForm.fiveStrokeCode"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                  <LFormtTitle required label="位置大类类型">
                    <el-form-item prop="locationType">
                      <l-value-domain
                        :value.sync="ruleForm.locationType"
                        code="DrugPositionType"
                        placeholder="请选择"
                      />
                    </el-form-item>
                  </LFormtTitle>
                  <LFormtTitle label="创建人" disabled>
                    <el-form-item prop="createdByName" disabled>
                      <el-input disabled v-model="ruleForm.createdByName"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                  <LFormtTitle disabled label="创建时间">
                    <el-form-item prop="createdAt">
                      <el-input disabled v-model="ruleForm.createdAt"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                  <LFormtTitle disabled label="修改人">
                    <el-form-item prop="updatedByName">
                      <el-input disabled v-model="ruleForm.updatedByName"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                  <LFormtTitle disabled label="修改时间">
                    <el-form-item prop="updatedAt">
                      <el-input disabled v-model="ruleForm.updatedAt"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-form>
              </div>
              <div class="form-btn">
                <el-button type="primary" @click="save">保存</el-button>
              </div>
            </el-card>
          </div>
          <div class="left">
            <el-card class="padding20 height100">
              <el-row class="search" :gutter="10">
                <el-col :span="5">
                  <LFormtTitle label="位置名称">
                    <el-input v-model="searchData.name" placeholder="请输入"></el-input>
                  </LFormtTitle>
                </el-col>
                <el-col :span="19" class="align-right">
                  <el-button type="primary" @click="search">查询</el-button>
                  <el-button type="primary" plain @click="del">删除</el-button>
                  <el-button type="primary" plain @click="add">新增</el-button>
                </el-col>
              </el-row>
              <div class="table-height">
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  stripe
                  border
                  style="width: 100%"
                  height="100%"
                  highlight-current-row
                  @selection-change="handleSelectionChange"
                  @current-change="handleCurrentChange"
                  @header-dragend="headerDragend"
                  v-loading="loading"
                >
                  <el-table-column type="selection" key="key1" width="45"></el-table-column>
                  <el-table-column
                    v-for="item in tableHeader"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :fixed="item.fixed || false"
                    :align="item.align || 'left'"
                    header-align="center"
                  >
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'locationType'">
                        <span :val="scope.row.locationType" code="DrugPositionType" v-codeTransform></span>
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
            </el-card>
          </div>
        </div>
      </div>
    </slot>
  </flow-menu>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import stockApi from "@/api/hmm/stock.js";

export default {
  name: "medicalOrders",
  components: {
    FlowMenu
  },
  data() {
    return {
      searchData: {
        name: ""
      },
      tableHeader: [
        {
          label: "位置大类名称",
          prop: "locationSortName",
          fixed: true
        },
        {
          label: "位置大类代码",
          prop: "locationSort"
        },
        {
          label: "位置大类类型",
          prop: "locationType"
        },
        {
          label: "拼音码",
          prop: "phoneticCode"
        },
        {
          label: "五笔码",
          prop: "fiveStrokeCode"
        },
        {
          label: "创建人",
          prop: "createdByName"
        },
        {
          label: "创建时间",
          prop: "createdAt",
          width: 180
        },
        {
          label: "修改人",
          prop: "updatedByName"
        },
        {
          label: "修改时间",
          prop: "updatedAt",
          width: 180
        }
      ],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      // 表格选中集合
      multipleSelection: [],
      ruleForm: {
        locationSort: "",
        locationSortName: "",
        locationType: ""
      },
      rules: {
        locationSort: [
          { required: true, message: "请输入位置大类代码", trigger: "blur" }
        ],
        locationSortName: [
          { required: true, message: "请输入位置大类名称", trigger: "blur" }
        ],
        locationType: [
          { required: true, message: "请选择位置大类类型", trigger: "change" }
        ]
      },
      currentRow: null,
      loading: false
    };
  },
  watch: {
    currentRow: {
      deep: true,
      handler(val) {
        if (val) {
          this.ruleForm = { ...val };
        }
      }
    }
  },
  mounted() {
    this.search();
  },
  methods: {
    search() {
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    // 新增
    add() {
      this.$refs.multipleTable.setCurrentRow();
      this.$refs.ruleForm.resetFields();
      this.ruleForm = this.$options.data().ruleForm;
    },
    // 删除
    del() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请勾选要删除的位置大类!");
        return;
      }
      const params = this.multipleSelection.map(item => item.id);
      this.$showLoading();
      stockApi
        .locationSortDelete(params)
        .then(res => {
          if (res.code === 1) {
            this.search();
            this.$message.success(res.msg || "删除成功");
            this.search();
          } else {
            this.$message.error(res.msg || "删除失败");
          }
          this.$hideLoading();
        })
        .catch(err => {
          console.log(err);
          this.$hideLoading();
          this.$message.error(err.msg || "删除失败");
        });
    },
    // 保存
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {
            id: this.ruleForm.id || "",
            locationSort: this.ruleForm.locationSort,
            locationSortName: this.ruleForm.locationSortName,
            locationType: this.ruleForm.locationType,
            dataVersion: this.ruleForm.id ? this.ruleForm.dataVersion : ""
          };
          this.$showLoading();
          stockApi
            .locationSortSave(params)
            .then(res => {
              if (res.code === 1) {
                this.$message.success(res.msg || "保存成功");
                this.search();
              } else {
                this.$message.error(res.msg || "保存失败");
              }
              this.$hideLoading();
            })
            .catch(err => {
              this.$hideLoading();
              this.$message.success(err.msg || "保存失败");
            });
        }
      });
    },
    // 表格checkbox
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 表格高亮选中
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 表格查询
    loadTable() {
      const params = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        name: this.searchData.name
      };
      this.loading = true;
      stockApi
        .locationSortList(params)
        .then(res => {
          if (res.code === 1) {
            this.pageParams.total = res.pageParams.total;
            this.tableData = res.data;
            this.$refs.multipleTable &&
              this.$refs.multipleTable.setCurrentRow(this.tableData[0]);
            this.handleCurrentChange(this.tableData[0]);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 分页回调
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    headerDragend() {
      this.$refs.multipleTable.doLayout();
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}
.top {
  padding: 20px;
  margin-bottom: 20px;
  background-color: $l-color-white;
}
.bottom {
  height: 100%;
  overflow: hidden;
}
.left {
  height: 100%;
  margin-right: 450px;
}
.right {
  height: 100%;
  width: 440px;
}
.align-right {
  text-align: right;
}
.form {
  height: calc(100% - 56px);
  overflow: hidden;
  overflow-y: auto;
  margin-bottom: 20px;

  /deep/ .l-input-wrap {
    margin-bottom: 4px;
  }
}
.form-btn {
  text-align: center;
}
.padding20 {
  padding: 20px;
}
.table-height {
  height: calc(100% - 100px);
  margin-bottom: 20px;
}
.search {
  margin-bottom: 9px;
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
