<template>
  <div class="dict-box width100 height100">
    <div class="dict-right float-right height100" v-loading="formLoad">
      <l-card-title class="card-title">
        <span slot="left">预约字典</span>
      </l-card-title>
      <div class="form">
        <el-form :model="form" :rules="rules" ref="form" label-width="0">
          <el-form-item prop="dictItemCode">
            <l-formt-title label="预约字典目录编码" required disabled>
              <el-input v-model="form.dictItemCode" disabled></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="dictCode">
            <l-formt-title label="预约字典编码" required>
              <el-input v-model="form.dictCode"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="dictName">
            <l-formt-title label="预约字典名称" required>
              <el-input v-model="form.dictName"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="dictValue">
            <l-formt-title label="预约字典值" required>
              <el-input v-model="form.dictValue"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="namePy" v-if="!isNewAdd">
            <l-formt-title label="拼音" disabled>
              <el-input v-model="form.namePy" disabled></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="nameWb" v-if="!isNewAdd">
            <l-formt-title label="五笔" disabled>
              <el-input v-model="form.nameWb" disabled></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="recordStatus">
            <l-formt-title label="状态" required>
              <el-radio-group v-model="form.recordStatus">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">停用</el-radio>
              </el-radio-group>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="sortNum">
            <l-formt-title label="排序" required>
              <el-input v-model="form.sortNum"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="recordRemark">
            <l-formt-title label="备注">
              <el-input v-model="form.recordRemark"></el-input>
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
              <template v-if="item.prop === 'recordStatus'">
                <span>{{ statusShow[scope.row[item.prop]] }}</span>
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
  getPageDictValueList,
  adddictValue,
  updatedictValue,
  deldictValue
} from "@/api/appointmentNew/apptDict.js";

export default {
  name: "apptDictManagement",
  props: {
    cataData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      tableParams: [
        {
          prop: "dictCode",
          label: "预约字典编码"
        },
        {
          prop: "dictName",
          label: "预约字典名称"
        },
        {
          prop: "dictValue",
          label: "预约字典值"
        },
        {
          prop: "namePy",
          label: "拼音"
        },
        {
          prop: "nameWb",
          label: "五笔"
        },
        {
          prop: "recordRemark",
          label: "备注"
        },
        {
          prop: "recordStatus",
          label: "状态"
        },
        {
          prop: "sortNum",
          label: "排序"
        }
      ],
      statusShow: {
        "0": "未启用",
        "1": "启用"
      },
      tableData: [],
      loading: false,
      form: {
        dictItemCode: "",
        dictCode: "",
        dictName: "",
        dictValue: "",
        recordRemark: "",
        recordStatus: "",
        sortNum: ""
      },
      rules: {
        dictCode: [{ required: true, message: "请输入", trigger: "blur" }],
        dictName: [{ required: true, message: "请输入", trigger: "blur" }],
        dictValue: [{ required: true, message: "请输入", trigger: "blur" }],
        recordStatus: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        sortNum: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      isNewAdd: false,
      formLoad: false,
      currentRow: {}
    };
  },
  activated() {
    if (this.cataData && this.cataData.dictCode) {
      this.form.dictItemCode = this.cataData.dictCode;
      this.pageParams.pageNo = 1;
      this.loadTable();
    }
  },
  methods: {
    loadTable() {
      this.loading = true;
      const params = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        dictItemCode: this.cataData.dictCode
      };
      getPageDictValueList(params)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
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
      this.$refs.form.resetFields();
      this.currentRow = { ...row };
      this.form = { ...row, dictItemCode: this.cataData.dictCode };
    },
    newAdd() {
      this.isNewAdd = true;
      this.currentRow = {};
      this.$refs.singleTable && this.$refs.singleTable.setCurrentRow();
      this.$refs.form.resetFields();
      this.form = {
        ...this.$options.data().form,
        dictItemCode: this.cataData.dictCode
      };
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formLoad = true;
          if (this.isNewAdd) {
            adddictValue(this.form)
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
            updatedictValue(this.form)
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
      if (!this.currentRow.id) {
        this.$message.warning("请选择要删除的预约字典!");
        return;
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: "此操作将永久删除该预约字典!",
        confirm: (action, instance, done) => {
          this.$showLoading();
          deldictValue(this.currentRow.id)
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
