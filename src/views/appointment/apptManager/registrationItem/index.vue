<template>
  <div class="finance height100">
    <div class="finance-right height100 float-right" v-loading="formLoad">
      <l-card-title class="card-title">
        <span slot="left">挂号项目</span>
      </l-card-title>
      <div class="form">
        <el-form :model="form" :rules="rules" ref="form" label-width="0">
          <el-form-item prop="diagTreatType">
            <l-formt-title label="诊疗类型" required>
              <l-value-domain
                :value.sync="form.diagTreatType"
                remoteUrl="/appointment/diagTreatType/selectDiagTreatTypePO?recordStatus=1"
                type="select"
                remoteShowKey="diagTreatTypeName"
                remoteValueKey="diagTreatTypeCode"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item>
          <!-- <el-form-item prop="workCode">
            <l-formt-title label="挂牌工种" required>
              <l-value-domain
                :value.sync="form.workCode"
                code="doctorProfessionalTitle"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item> -->
          <el-form-item prop="chargeItemId">
            <l-formt-title label="收费项目名称" required>
              <el-select
                v-model="form.chargeItemId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="chargeItemIdChange"
              >
                <el-option
                  v-for="item in options"
                  :key="item.chargeItemId"
                  :label="item.chargeItemName"
                  :value="item.chargeItemId"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="itemMoney">
            <l-formt-title label="项目金额" required>
              <el-input
                v-model="form.itemMoney"
                @change="priceChange"
                placeholder="请输入"
              ></el-input>
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
              <l-formt-title label="诊疗类型">
                <l-value-domain
                  clearable
                  :value.sync="searchParams.diagTreatType"
                  remoteUrl="/appointment/diagTreatType/selectDiagTreatTypePO?recordStatus=1"
                  type="select"
                  remoteShowKey="diagTreatTypeName"
                  remoteValueKey="diagTreatTypeCode"
                ></l-value-domain>
              </l-formt-title>
            </el-col>
            <!-- <el-col :span="8">
              <l-formt-title label="挂牌工种">
                <l-value-domain
                  clearable
                  :value.sync="searchParams.workCode"
                  code="doctorProfessionalTitle"
                ></l-value-domain>
              </l-formt-title>
            </el-col> -->
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
            :align="item.align || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- 可自定义内容 -->
              <template v-if="item.prop === 'workCode'">
                <span
                  code="doctorProfessionalTitle"
                  :val="scope.row[item.prop]"
                  v-codeTransform
                ></span>
              </template>
              <span v-else>{{ scope.row[item.prop] }}</span>
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
              <el-button type="text" @click="delItem(scope.row)"
                >删除</el-button
              >
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
import registrationItem from "@/api/appointmentNew/registrationItem.js";
import _ from "lodash";

export default {
  name: "registrationItem",
  data() {
    return {
      searchParams: {
        diagTreatType: "",
        workCode: "",
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      options: [],
      loading: false,
      tableParams: [
        {
          prop: "diagTreatTypeName",
          label: "诊疗类型",
          fixed: "left",
        },
        // {
        //   prop: "workCode",
        //   label: "挂牌工种"
        // },
        {
          prop: "chargeItemName",
          label: "收费项目名称",
        },
        {
          prop: "itemMoney",
          align: "right",
          label: "项目金额",
        },
        {
          prop: "updatedByName",
          label: "操作人",
        },
        {
          prop: "updatedAt",
          label: "操作时间",
          width: 170,
        },
      ],
      tableData: [],
      // 是否是新增，true：是；false：否
      isNewAdd: false,
      form: {
        diagTreatType: "",
        workCode: "",
        chargeItemId: "",
        itemMoney: "",
      },
      rules: {
        diagTreatType: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        workCode: [{ required: true, message: "请选择", trigger: "change" }],
        chargeItemId: [{ required: true, message: "请输入", trigger: "blur" }],
        itemMoney: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      formLoad: false,
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
      this.options = [
        {
          chargeItemId: this.form.chargeItemId,
          chargeItemName: this.form.chargeItemName,
        },
      ];
    },
    loadTable() {
      const params = {
        ...this.searchParams,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
      };
      this.loading = true;
      registrationItem
        .getDiagTreatTypeRegItemList(params)
        .then((res) => {
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
        .catch((err) => {
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
        contentText: "此操作将永久删除该挂号项目!",
        confirm: (action, instance, done) => {
          this.$showLoading();
          registrationItem
            .delDiagTreatTypeRegItem(data.recordId)
            .then((res) => {
              this.$hideLoading();
              done();
              if (res.code === 1) {
                this.search();
                this.$message.success(res.msg || "删除成功!");
              } else {
                this.$message.error(res.msg || "删除失败!");
              }
            })
            .catch((err) => {
              this.$hideLoading();
              done();
              this.$message.error(err.msg || "删除失败!");
            });
        },
      });
    },
    newAdd() {
      this.isNewAdd = true;
      this.$refs.singleTable && this.$refs.singleTable.setCurrentRow();
      this.$refs.form.resetFields();
      // this.form = this.$options.data().form;
      this.form = {
        diagTreatType: "",
        workCode: "",
        chargeItemId: "",
        itemMoney: "",
      };
      this.options = [];
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoad = true;
          if (this.isNewAdd) {
            registrationItem
              .addDiagTreatTypeRegItem(this.form)
              .then((res) => {
                this.formLoad = false;
                if (res.code === 1) {
                  this.search();
                  this.$message.success(res.msg || "新增成功!");
                } else {
                  this.$message.error(res.msg || "新增失败!");
                }
              })
              .catch((err) => {
                this.formLoad = false;
                this.$message.error(err.msg || "新增失败!");
              });
          } else {
            const params = {
              ...this.form,
            };
            // 删除更新信息
            delete params.updatedAt;
            delete params.updatedBy;
            delete params.updatedByName;
            registrationItem
              .updateDiagTreatTypeRegItem(params)
              .then((res) => {
                if (res.code === 1) {
                  this.formLoad = false;
                  this.search();
                  this.$message.success(res.msg || "修改成功!");
                } else {
                  this.$message.error(res.msg || "修改失败!");
                }
              })
              .catch((err) => {
                this.formLoad = false;
                this.$message.error(err.msg || "修改失败!");
              });
          }
        }
      });
    },
    // 单价正则校验大于等于0，最多2位小数
    priceChange(val) {
      const valid = /^(\d*)(\d*)(\.\d{1,2})?$/;
      if (!valid.test(val)) {
        this.$message.warning("请输入大等于0且最多2位小数的数字!");
        this.$set(this.form, "itemMoney", "");
      }
    },
    chargeItemIdChange(val){
      for(let i in this.options){
        if(this.options[i].chargeItemId == this.form.chargeItemId){
          this.form.itemMoney = this.options[i].chargePrice;
          return
        }
      }
    },
    remoteMethod(query) {
      _.debounce(() => {
        this.getChargeItem(query);
      }, 500)();
    },
    getChargeItem(val) {
      registrationItem
        .getChargeItemList({
          pageNo: 1,
          pageSize: 20,
          chargeItemName: val,
        })
        .then((res) => {
          if (res.code === 1) {
            this.options = res.data;
          }
        });
    },
  },
  created() {
    this.search();
  },
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
  margin-right: 450px;
  background-color: $l-color-white;
}
.finance-right {
  width: 440px;
  padding: 10px;
  background-color: $l-color-white;
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
