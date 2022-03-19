<template>
  <div class="finance height100">
    <div class="finance-right height100 float-right" v-loading="formLoad">
      <l-card-title class="card-title">
        <span slot="left">诊区</span>
      </l-card-title>
      <div class="form">
        <el-form :model="form" :rules="rules" ref="form" label-width="0">
          <el-form-item prop="areaName">
            <l-formt-title label="名称" required>
              <el-input v-model="form.areaName" placeholder="请输入"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="areaCode">
            <l-formt-title label="编号" required>
              <el-input v-model="form.areaCode" placeholder="请输入"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="location">
            <l-formt-title label="位置">
              <el-input v-model="form.location" placeholder="请输入"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="locationMac">
            <l-formt-title label="MAC地址">
              <el-input v-model="form.locationMac" placeholder="请输入"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="recordStatus">
            <l-formt-title label="状态" required>
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
          <el-form-item prop="recordRemark">
            <l-formt-title label="备注">
              <el-input v-model="form.recordRemark" placeholder="请输入"></el-input>
            </l-formt-title>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-btn align-right">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="finance-left height100">
      <div class="search">
        <div class="search-input">
          <el-row :gutter="10">
            <el-col :span="8">
              <l-formt-title label="名称">
                <el-input v-model="searchParams.areaName" clearable placeholder="请输入"></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="8">
              <l-formt-title label="编号">
                <el-input v-model="searchParams.areaCode" clearable placeholder="请输入"></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="8">
              <l-formt-title label="位置">
                <el-input v-model="searchParams.location" clearable placeholder="请输入"></el-input>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <l-formt-title label="MAC地址">
                <el-input v-model="searchParams.locationMac" clearable placeholder="请输入"></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="8">
              <l-formt-title label="状态">
                <el-select v-model="searchParams.recordStatus" placeholder="请选择">
                  <el-option
                    v-for="item in recordStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col></el-col>
          </el-row>
        </div>
        <div class="search-btn">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="reset">重置</el-button>
          <el-button type="primary" plain @click="newAdd">新增</el-button>
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
          <!-- 业务列 -->
          <el-table-column
            v-for="item in tableParams"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            header-align="center"
            :align="item.align || 'center'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- 可自定义内容 -->
              <span v-if="item.prop === 'recordStatus'">{{ recordStatusShow[scope.row[item.prop]] }}</span>
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
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="delItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page align-right">
        <el-pagination
          background
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
import scheManagement from "@/api/schedule/scheduleManagement.js";

export default {
  name: "treatRegionMaintain",
  data() {
    return {
      searchParams: {
        stationName: "",
        stationCode: "",
        location: "",
        locationMac: "",
        recordStatus: ""
      },
      recordStatusOptions: [
        {
          label: "启用",
          value: "1"
        },
        {
          label: "停用",
          value: "2"
        }
      ],
      recordStatusShow: {
        "1": "启用",
        "2": "停用"
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      loading: false,
      tableParams: [
        {
          prop: "areaName",
          label: "名称",
          fixed: "left"
        },
        {
          prop: "areaCode",
          label: "编号"
        },
        {
          prop: "location",
          label: "位置"
        },
        {
          prop: "locationMac",
          label: "MAC地址"
        },
        {
          prop: "recordStatus",
          label: "状态"
        },
        {
          prop: "recordRemark",
          label: "备注"
        },
        {
          prop: "updatedByName",
          label: "操作人"
        },
        {
          prop: "updatedAt",
          label: "操作时间",
          width: 170
        }
      ],
      tableData: [],
      // 是否是新增，true：是；false：否
      isNewAdd: false,
      form: {
        areaName: "",
        areaCode: "",
        location: "",
        locationMac: "",
        recordStatus: "",
        recordRemark: ""
      },
      rules: {
        areaName: [{ required: true, message: "请输入", trigger: "blur" },
        { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }],
        areaCode: [{ required: true, message: "请输入", trigger: "blur" },
        { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }],
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
      this.isNewAdd = false;
      this.form = { ...row };
    },
    loadTable() {
      const params = {
        ...this.searchParams,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      };
      this.loading = true;
      scheManagement
        .getAreaList(params)
        .then(res => {
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
            // 默认选中第一个
            if (this.tableData.length > 0) {
              this.rowClick(this.tableData[0]);
              this.$refs.singleTable &&
                this.$refs.singleTable.setCurrentRow(this.tableData[0]);
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
      this.$confirmFunc({
        titleText: "提示",
        contentText: "此操作将永久删除该诊区!",
        confirm: (action, instance, done) => {
          this.$showLoading();
          scheManagement
            .delArea(data.areaId)
            .then(res => {
              this.$hideLoading();
              done();
              if (res.code === 1) {
                this.search();
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
            scheManagement
              .addArea(this.form)
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
            const params = {
              ...this.form
            };
            // 删除更新信息
            delete params.updatedAt;
            delete params.updatedBy;
            delete params.updatedByName;
            scheManagement
              .updateArea(params)
              .then(res => {
                if (res.code === 1) {
                  this.formLoad = false;
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
  margin-right: 300px;
}
.finance-right {
  width: 300px;
  padding: 10px;
  border-left: 1px solid $l-color-bgcolor-11;
}
.search {
  overflow: hidden;
}
.align-right {
  text-align: right;
}
.search {
  display: flex;
  .search-input {
    flex: 1;
    overflow: hidden;
  }
  .search-btn {
    margin-left: 10px;
    text-align: right;
  }
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
  border-bottom: 1px solid $l-color-bgcolor-11;
  overflow: hidden;
  overflow-y: auto;
  /deep/ .el-form-item__content {
    height: 36px;
    margin-bottom: 20px;
  }
}
</style>
<style>
.pay-item-cancel-btn {
  float: right;
  margin-left: 10px;
}
</style>