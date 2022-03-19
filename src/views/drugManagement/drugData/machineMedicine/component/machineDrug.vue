<template>
  <div class="main-box height100">
    <div class="list">
      <div class="search-box">
        <div class="search-input">
          <el-row class="width100" :gutter="20">
            <el-col :span="7">
              <l-formt-title label="机器" :disabled="machineDisabled">
                <div class="choose-machine">
                  <el-select
                    v-model="searchParams.machineCode"
                    placeholder="请选择"
                    :disabled="machineDisabled"
                    @change="machineChange"
                  >
                    <el-option
                      v-for="item in machineList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                  <el-button type="primary" @click="machineDisabled = false"
                    >切换机器</el-button
                  >
                </div>
              </l-formt-title>
            </el-col>
            <el-col :span="5">
              <l-formt-title label="机器药品代码">
                <el-input v-model="searchParams.machineDrugCode"></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="5">
              <l-formt-title label="药品名称">
                <el-input v-model="searchParams.drugName"></el-input>
              </l-formt-title>
            </el-col>
            <el-col class="lineh34" :span="6">
              <el-checkbox v-model="searchParams.status">
                仅显示有效药品
              </el-checkbox>
            </el-col>
          </el-row>
        </div>
        <div class="search-btn">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button plain @click="reset">重置</el-button>
          <el-button plain @click="del">删除</el-button>
          <el-button plain @click="newAdd">新增</el-button>
        </div>
      </div>
      <div class="table-box">
        <l-table
          :total="pageParams.total"
          :page="pageParams.pageNo"
          :pageSize="pageParams.pageSize"
          @changeSize="pageChangeSzie"
        >
          <el-table
            ref="singleTable"
            :data="tableData"
            border
            width="100%"
            height="100%"
            highlight-current-row
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            v-loading="loading"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              v-for="item in tableColumn"
              :key="item.prop"
              :prop="item.prop"
              :label="item.name"
              :width="item.width"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'originCode'">
                  <span
                    :val="scope.row[item.prop]"
                    code="Manufacturer"
                    v-codeTransform
                  ></span>
                </template>
                <template v-else-if="item.prop === 'formCode'">
                  <span
                    tableName="hrp_form"
                    :conditionMap="{ form_code: scope.row[item.prop] }"
                    columns="form_name"
                    v-tableTransform
                  ></span>
                </template>
                <template v-else-if="item.prop === 'dosageUnit'">
                  <span
                    :val="scope.row[item.prop]"
                    code="DrugDoseUnit"
                    v-codeTransform
                  ></span>
                </template>
                <template v-else-if="item.prop === 'packUnit'">
                  <span
                    :val="scope.row[item.prop]"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
                <template v-else-if="item.prop === 'drugUnit'">
                  <span
                    :val="scope.row[item.prop]"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
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
        </l-table>
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
        <el-form-item prop="drugName">
          <l-formt-title label="药品名称" required>
            <Linput
              :popoverWidth="400"
              v-model="ruleForm.drugName"
              suffix-icon="el-icon-search"
              :tableData="selectOptions"
              @query="elsearch($event)"
              @select="select"
              @change="resetChooseDrug"
              :tableParams="dropColumn"
              placeholder="请选择药品"
            ></Linput>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="machineDrugCode">
          <l-formt-title label="机器药品代码" required>
            <el-input v-model="ruleForm.machineDrugCode"></el-input>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="spec">
          <l-formt-title label="规格" disabled>
            <div class="input-box">{{ ruleForm.spec }}</div>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="originCode">
          <l-formt-title label="生产厂商" disabled>
            <div class="input-box">
              <span
                :val="ruleForm.originCode"
                code="Manufacturer"
                v-codeTransform
              ></span>
            </div>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="formCode">
          <el-row :gutter="10">
            <el-col :span="12">
              <l-formt-title label="剂型" disabled>
                <div class="input-box">
                  <span
                    tableName="hrp_form"
                    :conditionMap="{ form_code: ruleForm.formCode }"
                    columns="form_name"
                    v-tableTransform
                  ></span>
                </div>
              </l-formt-title>
            </el-col>
            <el-col :span="12">
              <l-formt-title label="包装单位" disabled>
                <div class="input-box">
                  <span
                    :val="ruleForm.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </div>
              </l-formt-title>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="dosageValue">
          <el-row :gutter="10">
            <el-col :span="12">
              <l-formt-title label="剂量值" disabled>
                <div class="input-box">{{ ruleForm.dosageValue }}</div>
              </l-formt-title>
            </el-col>
            <el-col :span="12">
              <l-formt-title label="剂量单位" disabled>
                <div class="input-box">
                  <span
                    :val="ruleForm.dosageUnit"
                    code="DrugDoseUnit"
                    v-codeTransform
                  ></span>
                </div>
              </l-formt-title>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="packQuantity">
          <el-row :gutter="10">
            <el-col :span="12">
              <l-formt-title label="包装量" disabled>
                <div class="input-box">{{ ruleForm.packQuantity }}</div>
              </l-formt-title>
            </el-col>
            <el-col :span="12">
              <l-formt-title label="最小单位" disabled>
                <div class="input-box">
                  <span
                    :val="ruleForm.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </div>
              </l-formt-title>
            </el-col>
          </el-row>
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
              placeholder="请输入内容"
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
import Linput from "@/views/drugManagement/drugData/location/components/Linput.vue";

export default {
  name: "MachineDrug",
  components: {
    Linput
  },
  props: {
    machine: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      machineList: [],
      searchParams: {
        machineCode: "",
        status: false,
        machineDrugCode: "",
        drugName: ""
      },
      machineDisabled: true,
      statusList: [
        {
          name: "停用",
          value: "0"
        },
        {
          name: "启用",
          value: "1"
        }
      ],
      statusShow: {
        0: "停用",
        1: "启用"
      },
      tableColumn: [
        {
          prop: "machineDrugCode",
          name: "机器药品代码",
          width: 120,
          fixed: "left"
        },
        {
          prop: "drugName",
          name: "药品名称",
          width: 200,
          fixed: "left"
        },
        {
          prop: "spec",
          name: "规格",
          fixed: "left",
          width: 120
        },
        {
          prop: "originCode",
          name: "生产厂商",
          width: 200
        },
        {
          prop: "formCode",
          name: "剂型"
        },
        {
          prop: "dosageValue",
          name: "剂量"
        },
        {
          prop: "dosageUnit",
          name: "剂量单位"
        },
        {
          prop: "packQuantity",
          name: "包装量"
        },
        {
          prop: "packUnit",
          name: "最小单位"
        },
        {
          prop: "drugUnit",
          name: "包装单位"
        },
        {
          prop: "status",
          name: "状态"
        },
        {
          prop: "recordRemark",
          name: "备注"
        },
        {
          prop: "updatedByName",
          name: "操作人"
        },
        {
          prop: "updatedAt",
          name: "操作时间",
          width: 170
        }
      ],
      tableData: [],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      ruleForm: {
        drugName: "",
        machineDrugCode: "",
        formCode: "",
        status: "",
        recordRemark: ""
      },
      curChooseDrug: {},
      selectOptions: [],
      rules: {
        drugName: [{ required: true, message: "请选择药品", trigger: "blur" }],
        machineDrugCode: [
          { required: true, message: "请输入机器药品代码", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      selectOptions: [],
      dropColumn: [
        {
          prop: "drugName",
          label: "药品名称",
          width: 150
        },
        {
          prop: "spec",
          label: "规格",
          width: 100
        },
        {
          prop: "originCode",
          label: "生产厂商",
          width: 100
        },
        {
          prop: "formCode",
          label: "剂型",
          width: 50
        }
      ],
      curChooseDrug: {},
      storageCode: "",
      loading: true,
      currentRow: {},
      multipleSelection: []
    };
  },
  watch: {
    machine: {
      deep: true,
      handler(val) {
        if (val && val.machineCode) {
          this.searchParams.machineCode = val.machineCode;
          this.setDefaultMachine(this.machineList, val.machineCode);
          this.search();
        }
      }
    }
  },
  created() {
    this.getMachine();
  },
  methods: {
    search() {
      this.pageParams.pageNo = 1;
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
    machineChange() {
      this.machineDisabled = true;
    },
    // 获取当前登录的药房
    getUserStorage() {
      hmmBaseApi
        .getCurDrugStorage()
        .then(res => {
          if (res.code === 1) {
            this.storageCode = res.data.storageCode;
          } else {
            this.$message.error("获取当前库房失败");
          }
        })
        .catch(err => {
          this.$message.error("获取当前库房失败");
        });
    },
    getMachine() {
      base
        .getMachineSelect()
        .then(res => {
          if (res.code === 1) {
            this.machineList = res.data;
            this.setDefaultMachine(res.data, this.searchParams.machineCode);
            this.getTableData();
          }
        })
        .catch(err => {
          this.$message.error("获取机器列表失败");
        });
    },
    setDefaultMachine(list, code) {
      if (list.length === 0) {
        return;
      }
      const data = list.find(it => it.code === code);
      if (!data) {
        this.searchParams.machineCode = list[0].code;
      }
    },
    getTableData() {
      const params = {
        ...this.pageParams,
        ...this.searchParams,
        status: this.searchParams.status ? "1" : ""
      };
      this.loading = true;
      base
        .getMachineDrugList(params)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.tableData = res.data;
            this.pageParams.total = res.total;
            this.$refs.singleTable &&
              this.$refs.singleTable.setCurrentRow(res.data[0]);
          } else {
            this.$message.error(res.msg || "获取机器药品维护列表失败");
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.msg || "获取机器药品维护列表失败");
        });
    },
    pageChangeSzie(data) {
      this.pageParams.pageNo = data.page;
      this.pageParams.pageSize = data.pageSize;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      this.currentRow = val;
      this.ruleForm = {
        ...val
      };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    save() {
      if (!this.searchParams.machineCode) {
        this.$message.warning("请选择发药机");
        return;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = {
            ...this.ruleForm,
            machineCode: this.searchParams.machineCode
          };
          this.$showLoading();
          base
            .addMachineDrug(data)
            .then(res => {
              this.$hideLoading();
              if (res.code === 1) {
                this.getTableData();
                this.$message.success(res.msg || "保存机器药品成功");
              } else {
                this.$message.error(res.msg || "保存机器药品成功");
              }
            })
            .catch(err => {
              this.$hideLoading();
              this.$message.error(err.msg || "保存机器药品成功");
            });
        }
      });
    },
    del() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请选择要删除的机器药品");
        return;
      }
      const ids = this.multipleSelection.map(item => item.id);
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除选中的机器药品?",
        confirm: (action, instance, done) => {
          done();
          this.$showLoading();
          base
            .deleteMachineDrug(ids)
            .then(res => {
              this.$hideLoading();
              if (res.code === 1) {
                this.getTableData();
                this.$refs.singleTable &&
                  this.$refs.singleTable.clearSelection();
                this.multipleSelection = [];
                this.$message.success(res.msg || "删除成功!");
              } else {
                this.$message.error(res.msg || "删除失败!");
              }
            })
            .catch(err => {
              this.$hideLoading();
              this.$message.error(RangeError.msg || "删除失败!");
            });
        }
      });
    },
    //联想输入方法
    elsearch(drugName) {
      //搜索联想
      const searchParams = {
        drugName: drugName,
        pageNo: 1,
        pageSize: 10000,
        storageCode: this.storageCode
      };
      this.selectOptions = [];
      this.getDrugList(searchParams);
    },
    //获取联想搜索结果
    getDrugList(params) {
      base.getAssociation(params).then(res => {
        this.selectOptions = res.data;
      });
    },
    //回填
    select(row) {
      this.curChooseDrug = JSON.parse(JSON.stringify(row));
      this.$delete(this.curChooseDrug, "status");
      this.selectOptions = [];
      this.ruleForm = {
        ...this.ruleForm,
        ...this.curChooseDrug
      };
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField("drugName");
      });
    },
    resetChooseDrug(val) {
      // 如果用户不选择药品，则自动默认到上一次选择的药品
      this.ruleForm.drugName = val;
      this.$nextTick(() => {
        if (val !== this.curChooseDrug.drugName) {
          this.$set(
            this.ruleForm,
            "drugName",
            this.curChooseDrug.drugName || ""
          );
        }
      });
    }
  }
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

.choose-machine {
  display: flex;
  .el-select {
    flex: 1;
    margin-right: 10px;
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
.input-box {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
}
</style>
