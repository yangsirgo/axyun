<template>
  <div class="dict-box width100 height100">
    <div class="dict-right float-right height100">
      <l-card-title class="card-title">
        <span slot="left">医院字典</span>
      </l-card-title>
      <div class="form">
        <el-form :model="form" :rules="rules" ref="form" label-width="0">
          <el-form-item prop="siDictName">
            <l-formt-title label="医保字典名称" disabled>
              <el-input v-model="form.siDictName" disabled></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="hosDictCode">
            <l-formt-title label="医院字典编码" required :disabled="!isNewAdd">
              <el-input v-model="form.hosDictCode" :disabled="!isNewAdd"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="hosDictName">
            <l-formt-title label="医院字典名称" required>
              <el-input v-model="form.hosDictName"></el-input>
            </l-formt-title>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-btn align-right">
        <el-button type="primary" plain @click="newAdd">新增</el-button>
        <el-button type="primary" plain @click="del" v-show="!isNewAdd">删除</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="dict-left height100">
      <div class="table">
        <el-table
          ref="singleTable"
          highlight-current-row
          @row-click="rowClick"
          :data="tableData"
          border
          width="100%"
          height="100%"
          v-loading="loading"
        >
          <!-- 业务列 -->
          <el-table-column
            v-for="item in tableParams"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            header-align="center"
            :align="item.align || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- 可自定义内容 -->
              <template v-if="item.prop === 'medicareType'">
                <span>{{ mtShow[scope.row[item.prop]] }}</span>
              </template>
              <span v-else>{{ scope.row[item.prop] }}</span>
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
    </div>
  </div>
</template>

<script>
import {
  getPagemd,
  getPageDictMatchList,
  addDictMatch,
  deleteDictMatchById,
  updateDictMatcht
} from "@/api/medicalInsurance/index.js";

export default {
  name: "dictContrast",
  props: {
    dictData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      searchParams: {
        medicareType: "",
        hosDictCode: "",
        hosDictName: ""
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      mtList: [],
      mtShow: {},
      tableParams: [
        {
          prop: "medicareType",
          label: "医保类别"
        },
        {
          prop: "siDictCode",
          label: "医保字典编码"
        },
        {
          prop: "siDictName",
          label: "医保字典名称"
        },
        {
          prop: "hosDictCode",
          label: "医院字典编码"
        },
        {
          prop: "hosDictName",
          label: "医院字典名称"
        }
      ],
      tableData: [],
      loading: false,
      form: {
        siDictName: "",
        hosDictCode: "",
        hosDictName: ""
      },
      rules: {
        hosDictCode: [{ required: true, message: "请输入", trigger: "blur" }],
        hosDictName: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      isNewAdd: false,
      currentRow: {}
    };
  },
  created() {
    this.getMedicareType();
  },
  activated() {
    if (this.dictData && this.dictData.siDictCatalogId) {
      this.form.siDictCatalogName = this.dictData.siDictCatalogName;
      this.loadTable();
    }
  },
  methods: {
    getMedicareType() {
      getPagemd().then(res => {
        if (res.code === 1) {
          this.mtList = res.data;
          res.data.forEach(item => {
            this.mtShow[item.dictCode] = item.dictName;
          });
        }
      });
    },
    loadTable() {
      this.loading = true;
      const params = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        medicareType: this.dictData.medicareType,
        siDictCode: this.dictData.dictCode
      };
      getPageDictMatchList(params)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
            this.pageParams.total = res.total;
            if (this.tableData.length > 0) {
              this.rowClick(this.tableData[0]);
              this.$refs.singleTable.setCurrentRow(this.tableData[0]);
            } else {
              this.newAdd();
              this.$refs.singleTable.setCurrentRow();
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    rowClick(row) {
      this.isNewAdd = false;
      this.currentRow = { ...row };
      this.form = {
        ...row,
        medicareType: this.dictData.medicareType,
        siDictCode: this.dictData.dictCode,
        siDictName: this.dictData.dictName
      };
    },
    newAdd() {
      this.isNewAdd = true;
      this.currentRow = {};
      this.$refs.singleTable && this.$refs.singleTable.setCurrentRow();
      this.$refs.form.resetFields();
      this.form = {
        ...this.$options.data().form,
        medicareType: this.dictData.medicareType,
        siDictCode: this.dictData.dictCode,
        siDictName: this.dictData.dictName
      };
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formLoad = true;
          if (this.isNewAdd) {
            addDictMatch({
              ...this.form,
              siDictCatalogCode: this.dictData.siDictCatalogCode
            })
              .then(res => {
                this.formLoad = false;
                if (res.code === 1) {
                  this.loadTable();
                  this.$message.success(res.msg || "新增成功");
                } else {
                  this.$message.error(res.msg || "新增失败");
                }
              })
              .catch(err => {
                this.formLoad = false;
                this.$message.error(err.msg || "新增失败");
              });
          } else {
            updateDictMatcht(this.form)
              .then(res => {
                this.formLoad = false;
                if (res.code === 1) {
                  this.loadTable();
                  this.$message.success(res.msg || "修改成功");
                } else {
                  this.$message.error(res.msg || "修改失败");
                }
              })
              .catch(err => {
                this.formLoad = false;
                this.$message.error(err.msg || "修改失败");
              });
          }
        }
      });
    },
    del() {
      if (!this.currentRow.siDictMatchId) {
        this.$message.warning("请选择要删除的医保字典对照!");
        return;
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: "此操作将永久删除该医保字典对照!",
        confirm: (action, instance, done) => {
          this.$showLoading();
          deleteDictMatchById(this.currentRow.siDictMatchId)
            .then(res => {
              this.$hideLoading();
              done();
              if (res.code === 1) {
                this.loadTable();
                this.$message.success(res.msg || "删除成功!");
              } else {
                this.$message.error(res.msg || "删除失败!");
              }
            })
            .catch(err => {
              this.$hideLoading();
              done();
              this.$message.error(err.msg || "删除失败!");
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dict-box {
  overflow: hidden;
  background-color: $l-color-white;
  .dict-left {
    display: flex;
    flex-direction: column;
    margin-right: 300px;
    padding: 10px;
    overflow: hidden;
    .search {
      display: flex;
      .search-input {
        flex: 1;
        overflow: hidden;
      }
      .search-btn {
        margin-left: 10px;
      }
    }
    .table {
      flex: 1;
      overflow: hidden;
      margin: 10px 0;
    }
  }
  .dict-right {
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 10px;
    border-left: 1px solid $l-color-bgcolor-11;
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
  .card-title {
    height: 20px;
    line-height: 20px;
    margin-bottom: 10px;
    /deep/ .titleleft::before {
      margin-top: 0;
    }
  }
  .form {
    flex: 1;
    overflow: hidden;
    margin-bottom: 10px;
    overflow-y: auto;
    /deep/ .el-form-item__content {
      height: 36px;
      margin-bottom: 20px;
    }
  }
  .form-btn {
    text-align: right;
    padding-top: 10px;
    border-top: 1px solid $l-color-bgcolor-11;
  }
}
</style>
