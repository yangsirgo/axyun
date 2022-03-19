<template>
  <div class="finance height100">
    <div class="finance-right el-card height100 float-right" v-loading="formLoad">
      <l-card-title class="card-title">
        <span slot="left">财务分类代码</span>
      </l-card-title>
      <div class="form">
        <el-form :model="form" :rules="rules" ref="form" label-width="0">
          <el-form-item prop="finClassCode">
            <l-formt-title label="财务分类码" required :disabled="!isNewAdd">
              <el-input :disabled="!isNewAdd" v-model="form.finClassCode" placeholder="请输入"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="classCodeName">
            <l-formt-title label="分类码名称" required>
              <el-input v-model="form.classCodeName" placeholder="请输入"></el-input>
            </l-formt-title>
          </el-form-item>

          <el-form-item prop="medicalIncome">
            <l-formt-title label="是否属于医疗收入" required>
              <el-select v-model="form.medicalIncome" placeholder="请选择">
                <el-option
                  v-for="item in medicalIncomeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-form-item>
          <el-form-item
            label=""
            prop="dischargeItemClassCode"
            :show-message="false"
          >
            <l-formt-title
              label="票据分类"
              class=" pr5"
            >
              <l-value-domain
                clearable
                remoteUrl="/finance-pub/dictionary/getDischargeItemClassCode"
                type="select"
                :value.sync="form.dischargeItemClassCode"
                remoteShowKey="dictionaryName"
                remoteValueKey="dictionaryCode"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="recordStatus">
            <l-formt-title label="状态标识" required>
              <el-select v-model="form.recordStatus" placeholder="请选择">
                <el-option
                  v-for="item in recordStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-btn align-right">
        <el-button @click="newAdd">新增</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="finance-left el-card height100">
      <div class="search">
        <div class="search-input">
          <el-row :gutter="10">
            <el-col :span="6">
              <l-formt-title label="财务分类码">
                <el-input v-model="searchParams.finClassCode" clearable placeholder="请输入"></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <l-formt-title label="分类码名称">
                <el-input v-model="searchParams.classCodeName" clearable placeholder="请输入"></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <l-formt-title label="是否属于医疗收入">
                <el-select v-model="searchParams.medicalIncome" clearable placeholder="请选择">
                  <el-option
                    v-for="item in medicalIncomeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <l-formt-title label="状态标识">
                <el-select v-model="searchParams.recordStatus" clearable placeholder="请选择">
                  <el-option
                    v-for="item in recordStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
          </el-row>
        </div>
        <div class="search-btn">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
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
          <!-- 需要列 -->
          <el-table-column
            key="no"
            type="index"
            label="序号"
            width="50"
            header-align="center"
            align="center"
          ></el-table-column>
          <!-- 业务列 -->
          <el-table-column
            v-for="item in tableParams"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'center'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- 可自定义内容 -->
              <span
                v-if="item.prop === 'medicalIncome'"
              >{{ medicalIncomeShow[scope.row.medicalIncome] }}</span>
              <span
                v-else-if="item.prop === 'recordStatus'"
              >{{ recordStatusShow[scope.row.recordStatus] }}</span>
              <span v-else>{{ scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column
            key="handlercol"
            type="index"
            label="操作"
            width="100"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="delItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page align-right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageParams.pageNo"
          :page-sizes="[10, 20, 50, 100]"
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
  getFinClassCodeList,
  addFinClassCode,
  updateFinClassCode,
  deleteFinClassCode
} from "@/api/systemManagement/dataMaintain/financeCode.js";

export default {
  name: "financeCode",
  data() {
    return {
      remoteSonParams: { dictionaryName: "" }, // 分页参数
      searchParams: {
        finClassCode: "",
        classCodeName: "",
        medicalIncome: "",
        recordStatus: ""
      },
      medicalIncomeOptions: [
        {
          label: "非医疗收入",
          value: "0"
        },
        {
          label: "医疗收入",
          value: "1"
        }
      ],
      recordStatusOptions: [
        {
          label: "暂停",
          value: "0"
        },
        {
          label: "在用",
          value: "1"
        }
      ],
      medicalIncomeShow: {
        "0": "非医疗收入",
        "1": "医疗收入"
      },
      recordStatusShow: {
        "0": "暂停",
        "1": "在用"
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      loading: false,
      tableParams: [
        {
          prop: "finClassCode",
          label: "财务分类码"
        },
        {
          prop: "classCodeName",
          label: "分类码名称"
        },
        {
          prop: "dischargeItemClassCode",
          label: "票据分类码"
        },
        {
          prop: "medicalIncome",
          label: "是否属于医疗收入",
          width: 140
        },
        {
          prop: "recordStatus",
          label: "状态标识"
        },
        {
          prop: "updatedAt",
          label: "操作时间",
          width: 180
        },
        {
          prop: "updatedByName",
          label: "操作人员"
        }
      ],
      tableData: [],
      // 是否是新增，true：是；false：否
      isNewAdd: false,
      form: {
        finClassId: "",
        finClassCode: "",
        classCodeName: "",
        medicalIncome: "",
        dischargeItemClassCode:"",
        recordStatus: ""
      },
      rules: {
        finClassCode: [{ required: true, message: "请输入", trigger: "blur" }],
        classCodeName: [{ required: true, message: "请输入", trigger: "blur" }],
        medicalIncome: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        recordStatus: [{ required: true, message: "请选择", trigger: "change" }]
      },
      formLoad: false
    };
  },
  methods: {
    search() {
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    reset() {
      this.searchParams = this.$options.data().searchParams;
    },
    rowClick(row) {
      this.$refs.form.resetFields();
      this.isNewAdd = false;
      this.form = { ...row };
    },
    dischargeItemClassCodeChange(value) {
      console.log(value);
      this.form.dischargeItemClassCode = "";
      this.remoteSonParams = {dictionaryCode: value };
    },
    loadTable() {
      const params = {
        ...this.searchParams,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      };
      this.loading = true;
      getFinClassCodeList(params)
        .then(res => {
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
            // 默认选中第一个
            if (res.data.length > 0) {
              this.rowClick(res.data[0]);
              this.$refs.singleTable &&
                this.$refs.singleTable.setCurrentRow(res.data[0]);
            } else {
              this.newAdd();
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    delItem(data) {
      this.$confirm("此操作将永久删除该财务分类码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteFinClassCode(data.finClassId)
            .then(res => {
              if (res.code === 1) {
                this.search();
                this.$message({
                  type: "success",
                  message: res.msg || "删除成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.msg || "删除失败!"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err.msg || "删除失败!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    newAdd() {
      this.isNewAdd = true;
      this.$refs.singleTable && this.$refs.singleTable.setCurrentRow();
      this.$refs.form.resetFields();
      this.form = this.$options.data().form;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formLoad = true;
          if (this.isNewAdd) {
            addFinClassCode(this.form)
              .then(res => {
                this.formLoad = false;
                if (res.code === 1) {
                  this.search();
                  this.$message.success(res.msg || "新增成功!");
                } else {
                  this.$message.error(res.msg || "新增失败!");
                }
              })
              .catch(err => {
                this.formLoad = false;
                this.$message.error(err.msg || "新增失败!");
              });
          } else {
            updateFinClassCode(this.form)
              .then(res => {
                this.formLoad = false;
                if (res.code === 1) {
                  this.search();
                  this.$message.success(res.msg || "修改成功!");
                } else {
                  this.$message.error(res.msg || "修改失败!");
                }
              })
              .catch(err => {
                this.formLoad = false;
                this.$message.error(err.msg || "修改失败!");
              });
          }
        }
      });
    }
  },
  created() {
    this.search();
  }
};
</script>

<style lang="scss" scoped>
.finance {
  overflow: hidden;
}
.finance-left {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-right: 310px;
}
.finance-right {
  width: 300px;
  padding: 10px;
}
.search {
  display: flex;
  overflow: hidden;
  .search-input {
    flex: 1;
    overflow: hidden;
  }
  .search-btn {
    margin-left: 10px;
  }
}
.align-right {
  text-align: right;
}
.search {
  .el-row {
    margin-bottom: 10px;
    /deep/ .l-input-wrap {
      vertical-align: top;
    }
  }
}
.table {
  flex: 1;
  overflow: hidden;
  margin-bottom: 10px;
}
.page {
  .el-pagination {
    padding: 0;
  }
  /deep/ .el-input--medium .el-input__inner {
    height: 100% !important;
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
  height: calc(100% - 76px);
  margin-bottom: 10px;
  overflow: hidden;
  overflow-y: auto;
  /deep/ .el-form-item__content {
    height: 36px;
    margin-bottom: 20px;
  }
}
</style>
