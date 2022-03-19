<template>
  <div class="main-box height100">
    <div class="list">
      <div class="search-box">
        <div class="search-input">
          <el-row class="width100" :gutter="20">
            <el-col :span="6">
              <l-formt-title label="机器类型">
                <el-select
                  v-model="searchParams.machineType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in machineList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col class="lineh34" :span="4">
              <el-checkbox v-model="searchParams.status"
                @change="searchParamsStatus" >仅显示启用机器</el-checkbox
              >
            </el-col>
          </el-row>
        </div>
        <div class="search-btn">
          <el-button type="primary" @click="getTableData">查询</el-button>
          <el-button plain @click="reset">重置</el-button>
          <el-button plain @click="newAdd">新增</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          width="100%"
          height="100%"
          highlight-current-row
          @current-change="handleCurrentChange"
          v-loading="loading"
        >
          <el-table-column
            v-for="item in tableColumn"
            :key="item.prop"
            :prop="item.prop"
            :label="item.name"
            :width="item.width"
            :min-width="item.minWidth"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'machineType'">
                <span>{{ machineShow[scope.row[item.prop]] || "" }}</span>
              </template>
              <template v-else-if="item.prop === 'status'">
                <span>{{ statusShow[scope.row[item.prop]] || "" }}</span>
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0"
        class="demo-ruleForm"
      >
        <el-form-item prop="machineCode">
          <l-formt-title label="机器代码" required>
            <el-input v-model="ruleForm.machineCode"></el-input>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="machineName">
          <l-formt-title label="机器名称" required>
            <el-input v-model="ruleForm.machineName"></el-input>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="machineType">
          <l-formt-title label="机器类型" required>
            <el-select v-model="ruleForm.machineType" placeholder="请选择">
              <el-option
                v-for="item in machineList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="produceCompanyName">
          <l-formt-title label="厂家名称" required>
            <el-input v-model="ruleForm.produceCompanyName"></el-input>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="produceCompanyContact">
          <l-formt-title label="厂家联系人">
            <el-input v-model="ruleForm.produceCompanyContact"></el-input>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="phoneNum">
          <l-formt-title label="联系人号码">
            <el-input v-model="ruleForm.phoneNum"></el-input>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="status">
          <l-formt-title label="状态" required>
            <el-select v-model="ruleForm.status">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="recordRemark">
          <l-formt-title label="备注" :isMultiRow="true">
            <el-input
              type="textarea"
              :rows="3"
              maxlength=200
              placeholder="请输入内容(不超过200个字符)"
              v-model="ruleForm.recordRemark"
            >
            </el-input>
          </l-formt-title>
        </el-form-item>
      </el-form>
      <div class="form-btn">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import base from "@/api/hmm/base.js";

export default {
  name: "MachineMaintenance",
  data() {
    return {
      machineList: [
        {
          label: "包药机",
          value: "0",
        },
        {
          label: "发药机",
          value: "1",
        },
      ],
      machineShow: {
        0: "包药机",
        1: "发药机",
      },
      searchParams: {
        machineType: "",
        status: false,
      },
      statusList: [
        {
          name: "停用",
          value: "0",
        },
        {
          name: "启用",
          value: "1",
        },
      ],
      statusShow: {
        0: "停用",
        1: "启用",
      },
      tableColumn: [
        {
          prop: "machineCode",
          name: "机器代码",
        },
        {
          prop: "machineName",
          name: "机器名称",
        },
        {
          prop: "machineType",
          name: "机器类型",
        },
        {
          prop: "status",
          name: "状态",
        },
        {
          prop: "produceCompanyName",
          name: "厂家名称",
        },
        {
          prop: "produceCompanyContact",
          name: "厂家联系人",
          minWidth: 120,
        },
        {
          prop: "phoneNum",
          name: "联系人号码",
          minWidth: 120,
        },
        {
          prop: "recordRemark",
          name: "备注",
        },
        {
          prop: "updatedByName",
          name: "操作人",
        },
        {
          prop: "updatedAt",
          name: "操作时间",
          width: 170,
        },
      ],
      tableData: [],
      pageParams: {
        pageNo: 1,
        pageSize: 1000,
      },
      ruleForm: {
        machineCode: "",
      },
      rules: {
        machineCode: [
          { required: true, message: "请输入机器代码", trigger: "blur" },
        ],
        machineName: [
          { required: true, message: "请输入机器名称", trigger: "blur" },
        ],
        machineType: [
          { required: true, message: "请选择机器类型", trigger: "change" },
        ],
        produceCompanyName: [
          { required: true, message: "请输入厂家名称", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      currentRow: null,
      loading: false,
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getMachine() {},
    searchParamsStatus(){
      this.getTableData();
    },
    reset() {
      this.searchParams = this.$options.data().searchParams;
    },
    newAdd() {
      this.$refs.singleTable && this.$refs.singleTable.setCurrentRow();
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      this.ruleForm = this.$options.data().ruleForm;
    },
    getTableData() {
      const params = {
        ...this.pageParams,
        machineType: this.searchParams.machineType,
        status: this.searchParams.status ? "1" : "",
      };
      this.loading = true;
      base
        .getMachineList(params)
        .then((res) => {
          this.loading = false;
          if (res.code === 1) {
            this.tableData = res.data;
            this.$refs.singleTable &&
              this.$refs.singleTable.setCurrentRow(res.data[0]);
          } else {
            this.$message.error(res.msg || "获取机器维护列表失败");
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.msg || "获取机器维护列表失败");
        });
    },
    handleCurrentChange(val) {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      this.$emit("set-machine", val);
      this.currentRow = val;
      this.ruleForm = {
        ...val,
      };
    },
    save() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$showLoading();
          base
            .addMachine(this.ruleForm)
            .then((res) => {
              this.$hideLoading();
              if (res.code === 1) {
                this.$message.success(res.msg || "保存机器成功");
                this.getTableData();
              } else {
                this.$message.error(res.msg || "保存机器失败");
              }
            })
            .catch((err) => {
              this.$hideLoading();
              this.$message.error(err.msg || "保存机器失败");
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-box {
  display: flex;
  .list {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .table-box {
      flex: 1;
      overflow: hidden;
    }
  }
}
.search-box {
  display: flex;
  margin-bottom: 20px;
  .search-input {
    flex: 1;
    overflow: hidden;
  }
}
.lineh34 {
  line-height: 34px;
}
.form {
  display: flex;
  flex-direction: column;
  width: 320px;
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px solid $l-color-bgcolor-11;
  .el-form {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    .el-form-item {
      margin-bottom: 8px;
    }
  }
  .form-btn {
    text-align: right;
  }
}
</style>