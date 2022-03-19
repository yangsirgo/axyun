<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap">
        <flow-menu>
          <slot name="content">
            <div class="drugInfoMaintain width100 height100">
              <div class="left height100">
                <div class="drugList width100 height100 position-relative">
                  <el-card class="card-cont card-flex width100 height100">
                    <div class="search">
                      <div class="search-input">
                        <el-row :gutter="10">
                          <el-col :span="4">
                            <LFormtTitle label="剂型名称">
                              <el-input v-model="searchData.name" placeholder="请输入"></el-input>
                            </LFormtTitle>
                          </el-col>
                          <el-col :span="4">
                            <LFormtTitle label="中西分类">
                              <l-value-domain code="CWM" clearable :value.sync="searchData.cwType" />
                            </LFormtTitle>
                          </el-col>
                          <el-col :span="4">
                            <LFormtTitle label="是否输液">
                              <el-select v-model="searchData.isInj" clearable placeholder="请选择">
                                <el-option
                                  v-for="item in isInjList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                ></el-option>
                              </el-select>
                            </LFormtTitle>
                          </el-col>
                          <el-col :span="4">
                            <el-checkbox
                              v-model="searchData.status"
                              style="margin: 8px 0 0 15px"
                            >只显示有效剂型</el-checkbox>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="search-btn">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button type="primary" plain @click="reset">重置</el-button>
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
                        @current-change="handleCurrentChange"
                        v-loading="tlm_isLoading"
                        @header-dragend="headerDragend"
                        element-loading-text="加载中..."
                      >
                        <el-table-column
                          v-for="(item,index) in tableParams"
                          :key="index"
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
                            <template v-if="item.prop == 'cwType'">
                              <span code="CWM" v-codeTransform :val="scope.row[item.prop]"></span>
                            </template>
                            <template v-else-if="item.prop == 'isInj'">
                              <span>{{ display[scope.row.isInj] }}</span>
                            </template>
                            <template v-else-if="item.prop == 'isConvertUnit'">
                              <span>{{ display[scope.row.isConvertUnit] }}</span>
                            </template>
                            <template v-else-if="item.prop == 'status'">
                              <span>{{ display[scope.row.status] }}</span>
                            </template>
                            <template v-else>
                              <span>{{ scope.row[item.prop]}}</span>
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
              </div>
              <div class="right height100">
                <div class="drugForm width100 height100">
                  <el-card class="card-cont width100 height100">
                    <el-row style="border-bottom:1px solid #E4E4E4">
                      <el-col :span="24" class="cardTitleStyle">
                        <l-card-title>
                          <span slot="left">剂型信息</span>
                        </l-card-title>
                      </el-col>
                    </el-row>
                    <el-form
                      class="drug-form"
                      ref="drugFormDeail"
                      :model="drugFormDeail"
                      :rules="rules"
                    >
                      <el-form-item label label-width prop="formCode">
                        <l-formt-title label="剂型代码" :required="true">
                          <el-input v-model="drugFormDeail.formCode" maxlength="6" show-word-limit></el-input>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item label label-width prop="formName">
                        <l-formt-title label="剂型名称" :required="true">
                          <el-input v-model="drugFormDeail.formName" maxlength="7" show-word-limit></el-input>
                        </l-formt-title>
                      </el-form-item>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label label-width prop="phoneticCode">
                            <l-formt-title :disabled="true" label="拼音码">
                              <el-input :disabled="true" v-model="drugFormDeail.phoneticCode"></el-input>
                            </l-formt-title>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label label-width prop="fiveStrokeCode">
                            <l-formt-title :disabled="true" label="五笔码">
                              <el-input :disabled="true" v-model="drugFormDeail.fiveStrokeCode"></el-input>
                            </l-formt-title>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-form-item label label-width prop="customizeCode">
                        <l-formt-title label="自定义码">
                          <el-input v-model="drugFormDeail.customizeCode"></el-input>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item label label-width prop="cwType">
                        <l-formt-title label="中西分类" :required="true">
                          <l-value-domain code="CWM" :value.sync="drugFormDeail.cwType" />
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item label label-width prop="isInj">
                        <l-formt-title label="是否输液" :required="true">
                          <el-select v-model="drugFormDeail.isInj" placeholder="请选择">
                            <el-option
                              v-for="item in isInjList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item label label-width prop="isConvertUnit">
                        <l-formt-title label="打印标签时是否转换单位" :required="true">
                          <el-select v-model="drugFormDeail.isConvertUnit" placeholder="请选择">
                            <el-option
                              v-for="item in isConvertUnitList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item label label-width prop="status">
                        <l-formt-title label="状态标识" :required="true">
                          <el-select v-model="drugFormDeail.status" placeholder="请选择">
                            <el-option
                              v-for="item in statusList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item label label-width prop="createdByName">
                        <l-formt-title :disabled="true" label="创建人">
                          <el-input :disabled="true" v-model="drugFormDeail.createdByName"></el-input>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item label label-width prop="createdAt">
                        <l-formt-title :disabled="true" label="创建时间">
                          <el-date-picker
                            :disabled="true"
                            v-model="drugFormDeail.createdAt"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                          ></el-date-picker>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item label label-width prop="updatedByName">
                        <l-formt-title :disabled="true" label="修改人">
                          <el-input :disabled="true" v-model="drugFormDeail.updatedByName"></el-input>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item label label-width prop="updatedAt">
                        <l-formt-title :disabled="true" label="修改时间">
                          <el-date-picker
                            :disabled="true"
                            v-model="drugFormDeail.updatedAt"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="选择日期时间"
                          ></el-date-picker>
                        </l-formt-title>
                      </el-form-item>
                    </el-form>
                    <div class="button-cont">
                      <el-button type="primary" v-hotKey="{func:'func_save'}" @click="saveForm">保存</el-button>
                    </div>
                  </el-card>
                </div>
              </div>
            </div>
          </slot>
        </flow-menu>
      </div>
    </div>
  </div>
</template>
<script>
import FlowMenu from "@/components/FlowMenu";
import service from "@/api/hmm/base.js";

export default {
  name: "dosageMaintain",
  components: { FlowMenu },
  data() {
    return {
      searchData: {
        name: "",
        cwType: "",
        isInj: "",
        status: false,
      },
      tlm_isLoading: false,
      isInjList: [
        {
          label: "是",
          value: "1",
        },
        {
          label: "否",
          value: "0",
        },
      ],
      isConvertUnitList: [
        {
          label: "是",
          value: "1",
        },
        {
          label: "否",
          value: "0",
        },
      ],
      display: {
        0: "否",
        1: "是",
      },
      statusList: [
        {
          label: "正常",
          value: "1",
        },
        {
          label: "停用",
          value: "0",
        },
      ],
      statusSHow: {
        0: "停用",
        1: "正常",
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      tableParams: [
        {
          prop: "formCode",
          label: "剂型代码",
        },
        {
          prop: "formName",
          label: "剂型名",
          width: 120,
        },
        {
          prop: "phoneticCode",
          label: "拼音码",
        },
        {
          prop: "fiveStrokeCode",
          label: "五笔码",
        },
        {
          prop: "customizeCode",
          label: "自定义码",
        },
        {
          prop: "cwType",
          label: "中西分类",
        },
        {
          prop: "isInj",
          label: "是否输液",
        },
        {
          prop: "isConvertUnit",
          label: "是否转换单位",
          width: 120,
        },
        {
          prop: "status",
          label: "状态",
        },
        {
          prop: "createdByName",
          label: "创建人",
        },
        {
          prop: "createdAt",
          label: "创建时间",
          width: 180,
        },
        {
          prop: "updatedByName",
          label: "修改人",
        },
        {
          prop: "updatedAt",
          label: "修改时间",
          width: 180,
        },
      ],
      drugData: [],
      drugFormDeail: {
        formCode: "",
        formName: "",
        phoneticCode: "",
        fiveStrokeCode: "",
        customizeCode: "",
        cwType: "",
        isInj: "",
        isConvertUnit: "",
        status: "",
        createdByName: "",
        createdAt: "",
        updatedByName: "",
        updatedAt: "",
      },
      rules: {
        formCode: [{ required: true, message: "请输入", trigger: "blur" }],
        formName: [{ required: true, message: "请输入", trigger: "blur" }],
        customizeCode: [
          { required: false, message: "请输入", trigger: "blur" },
        ],
        cwType: [{ required: true, message: "请选择", trigger: "change" }],
        isInj: [{ required: true, message: "请选择", trigger: "change" }],
        isConvertUnit: [{ required: true, message: "请选择", trigger: "change" }],
        status: [{ required: true, message: "请选择", trigger: "change" }],
      },
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    reset() {
      this.searchData = this.$options.data().searchData;
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    loadTable() {
      this.tlm_isLoading = true;
      let params = {
        ...this.searchData,
        ...this.pageParams,
        status: this.searchData.status ? "1" : "",
      };
      service
        .getFormList(params)
        .then((res) => {
          if (res.code === 1) {
            this.pageParams = res.pageParams;
            this.drugData = res.data;
            this.$refs.singleTable.setCurrentRow(res.data[0]);
            this.handleCurrentChange(res.data[0] || {});
          }
          this.tlm_isLoading = false;
        })
        .catch((err) => {
          this.tlm_isLoading = false;
        });
    },
    handleCurrentChange(val) {
      this.$refs.drugFormDeail.resetFields();
      this.$nextTick(() => {
        this.drugFormDeail = JSON.parse(JSON.stringify(val));
      });

      // 去掉验证
      setTimeout(() => {
        this.$refs.drugFormDeail.clearValidate();
      }, 50);
    },
    newadd() {
      this.$refs.singleTable.setCurrentRow();
      this.$refs.drugFormDeail.resetFields();
      this.$nextTick(() => {
        this.drugFormDeail = this.$options.data().drugFormDeail;
      });
    },
    saveForm() {
      this.$refs.drugFormDeail.validate((valid) => {
        if (valid) {
          let params = {
            ...this.drugFormDeail,
          };
          this.$delete(params, "createdByName");
          this.$delete(params, "createdAt");
          this.$delete(params, "createdBy");
          this.$delete(params, "updatedByName");
          this.$delete(params, "updatedAt");
          this.$delete(params, "updatedBy");
          this.$showLoading();
          service
            .formSave(params)
            .then((res) => {
              if (res.code === 1) {
                this.search();
                this.newadd();
                this.$message.success(res.msg || "保存成功");
              } else {
                this.$message.error(res.msg || "保存失败");
              }
              this.$hideLoading();
            })
            .catch((err) => {
              this.$hideLoading();
              this.$message.error(err.msg || "保存失败");
            });
        }
      });
    },
    headerDragend() {
      this.$refs.singleTable.doLayout();
    },
  },
};
</script>
<style lang="scss" scoped>
.patient-card-container {
  margin-bottom: 20px;
  height: 66px;
  width: 100%;
}
.cardTitleStyle {
  padding: 8px 0px;
}
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
.wrapper {
  padding: 0;
  height: 100%;
  overflow: hidden;
  .main {
    width: 100%;
    height: 100%;
    .main_wrap {
      height: 100%;
      .drugInfoMaintain {
        .left {
          width: calc(100% - 450px);
          float: left;
        }

        .right {
          width: 440px;
          margin-left: 10px;
          float: right;
        }
      }
    }
  }
}
.drugList {
  .card-cont {
    padding: 20px;
  }
  .drug-list-cont {
    height: calc(100% - 106px);
    margin: 20px 0;
    /deep/ .el-tooltip{
      width: 100% !important;
    }
  }
}
.drugForm {
  .card-cont {
    padding: 0 20px 20px 20px;

    .el-form-item {
      margin-bottom: 0;
      /deep/ .el-form-item__content {
        height: 36px;
      }
    }
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
.drug-form {
  height: calc(100% - 121px);
  overflow-y: auto;
  padding-top: 8px;
  /deep/.el-form-item__content {
    margin-bottom: 4px;
  }
}
.button-cont {
  padding-top: 20px;
  border-top: 1px solid $l-color-bgcolor-11;
  text-align: right;

  .confirm-button {
    width: 80px;
    height: 36px;
    padding: 0;
    text-align: center;
    line-height: 36px;
    background: $l-color-primary;
    border-radius: 2px;
    font-size: $l-font-size;

    font-weight: 400;
    color: $l-color-white;
    float: right;
  }
}
</style>
