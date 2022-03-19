<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap">
        <flow-menu>
          <slot name="content">
            <div class="drugInfoMaintain width100 height100">
              <div class="left height100">
                <div class="drugList width100 height100 position-relative">
                  <el-card class="card-cont width100 height100">
                    <div class="search-input">
                      <el-row :gutter="10">
                        <el-col :span="5">
                          <LFormtTitle label="频率名称" labelWidth="76">
                            <el-input v-model="searchData.keyword" placeholder="请输入"></el-input>
                          </LFormtTitle>
                        </el-col>
                        <el-col :span="5">
                          <el-checkbox v-model="searchData.status" @change="searchDataStatus" style="margin: 8px 0 0 15px">只显示有效频率</el-checkbox>
                        </el-col>
                        <el-col :span="14" style="text-align: right;">
                          <el-button type="primary" @click="search">查询</el-button>
                          <el-button type="primary" plain @click="newadd">新增</el-button>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="drug-list-cont">
                      <el-table ref="singleTable" :data="drugData" border width="100%" height="100%"
                        highlight-current-row @current-change="handleCurrentChange" v-loading="tlm_isLoading"
                        @header-dragend="headerDragend" element-loading-text="加载中...">
                        <el-table-column v-for="(item,index) in tableParams" :key="index" :prop="item.prop" :label="item.label"
                          :min-width="item.width" header-align="center" :align="item.align || 'left'" :fixed="item.fixed"
                          show-overflow-tooltip>
                          <template slot-scope="scope">
                            <!-- 可自定义内容 -->
                            <span v-if="item.prop === 'status'">
                              <span v-if="scope.row.status=='0'">暂停</span>
                              <span v-if="scope.row.status=='1'">正常</span>
                            </span>
                            <span v-else>{{ scope.row[item.prop]}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <div class="page">
                      <el-pagination background @size-change="changeSize" @current-change="changePage" :current-page="pageParams.pageNo"
                        :page-sizes="[10, 20, 30, 40]" :page-size="pageParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="pageParams.total"></el-pagination>
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
                          <span slot="left">频率信息</span>
                        </l-card-title>
                      </el-col>
                    </el-row>
                    <el-form class="drug-form" ref="drugFormDeail" :model="drugFormDeail" :rules="rules">
                      <el-form-item label label-width prop="frequencyCode">
                        <l-formt-title label="频率代码" :required="true">
                          <el-input v-model="drugFormDeail.frequencyCode"></el-input>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item label label-width prop="frequencyName">
                        <l-formt-title label="频率名称" :required="true">
                          <el-input v-model="drugFormDeail.frequencyName"></el-input>
                        </l-formt-title>
                      </el-form-item>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label label-width prop="phoneticCode">
                            <l-formt-title :disabled="true" label="拼音码">
                              <el-input v-model="drugFormDeail.phoneticCode" :disabled="true"></el-input>
                            </l-formt-title>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label label-width prop="fiveStrokeCode">
                            <l-formt-title label="五笔码" :disabled="true">
                              <el-input v-model="drugFormDeail.fiveStrokeCode" :disabled="true"></el-input>
                            </l-formt-title>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-form-item label label-width prop="customizeCode">
                        <l-formt-title label="自定义码">
                          <el-input v-model="drugFormDeail.customizeCode"></el-input>
                        </l-formt-title>
                      </el-form-item>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label label-width prop="cycleNum">
                            <l-formt-title label="周期数量" :required="true">
                              <el-input v-model="drugFormDeail.cycleNum"></el-input>
                            </l-formt-title>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label label-width prop="cycleUnit">
                            <l-formt-title label="周期单位" :required="true">
                              <el-input v-model="drugFormDeail.cycleUnit"></el-input>
                            </l-formt-title>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label label-width prop="frequencyTimes">
                            <l-formt-title label="频率次数" :required="true">
                              <el-input v-model="drugFormDeail.frequencyTimes"></el-input>
                            </l-formt-title>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-form-item label label-width prop="cycleTimePoint">
                        <l-formt-title label="日时间点(分号分隔)" :required="true">
                          <el-input v-model="drugFormDeail.cycleTimePoint"></el-input>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item label label-width prop="cycleDatePoint">
                        <l-formt-title label="执行间隔(天)" :required="true">
                          <el-input v-model="drugFormDeail.cycleDatePoint" onKeypress="return (/^[;0-9]*$/.test(String.fromCharCode(event.keyCode)))" @change="cycleDateChange"></el-input>
                        </l-formt-title>
                      </el-form-item>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label label-width prop="sortNum">
                            <l-formt-title label="全院排序" :required="true">
                              <el-input v-model="drugFormDeail.sortNum"></el-input>
                            </l-formt-title>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label label- width prop="status">
                            <l-formt-title label="状态标识" :required="true">
                              <el-select v-model="drugFormDeail.status" placeholder="请选择">
                                <el-option v-for="item in ztbs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                              </el-select>
                            </l-formt-title>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <template v-if="drugFormDeail.id">
                        <el-form-item label label-width prop="createdByName">
                          <l-formt-title label="创建人" :disabled="true">
                            <el-input v-model="drugFormDeail.createdByName" :disabled="true"></el-input>
                          </l-formt-title>
                        </el-form-item>
                        <el-form-item label label-width prop="createdAt">
                          <l-formt-title label="创建时间" :disabled="true">
                            <el-date-picker :disabled="true" v-model="drugFormDeail.createdAt" value-format="yyyy-MM-dd HH:mm:ss"
                              type="datetime" placeholder="选择日期时间"></el-date-picker>
                          </l-formt-title>
                        </el-form-item>
                        <el-form-item label label-width prop="updatedByName">
                          <l-formt-title label="修改人" :disabled="true">
                            <el-input v-model="drugFormDeail.updatedByName" :disabled="true"></el-input>
                          </l-formt-title>
                        </el-form-item>
                        <el-form-item label label-width prop="updatedAt">
                          <l-formt-title label="修改时间" :disabled="true">
                            <el-date-picker v-model="drugFormDeail.updatedAt" :disabled="true" value-format="yyyy-MM-dd HH:mm:ss"
                              type="datetime" placeholder="选择日期时间"></el-date-picker>
                          </l-formt-title>
                        </el-form-item>
                      </template>
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
  import baseApi from "@/api/hmm/base.js";

  export default {
    name: "medicationFrequency",
    components: {
      FlowMenu
    },
    data() {
      return {
        // 启用，暂停
        searchData: {
          keyword: "",
          status: false
        },
        tlm_isLoading: false,
        pageParams: {
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        tableParams: [{
            prop: "frequencyCode",
            label: "频率代码"
          },
          {
            prop: "frequencyName",
            label: "频率名称"
          },
          {
            prop: "phoneticCode",
            label: "拼音码"
          },
          {
            prop: "fiveStrokeCode",
            label: "五笔码"
          },
          {
            prop: "customizeCode",
            label: "自定义码"
          },
          {
            prop: "cycleNum",
            label: "周期数量"
          },
          {
            prop: "cycleUnit",
            label: "周期单位"
          },
          {
            prop: "frequencyTimes",
            label: "频率次数"
          },
          {
            prop: "cycleTimePoint",
            label: "周期时间点"
          },
          {
            prop: "cycleDatePoint",
            label: "间隔天数"
          },
          /* {
            prop: "s11",
            label: "是否自动分解"
          }, */
          {
            prop: "sortNum",
            label: "全院排序"
          },
          /* {
            prop: "outpSortNum",
            label: "门诊排序"
          },
          {
            prop: "inpSortNum",
            label: "住院排序"
          }, */
          {
            prop: "status",
            label: "启用状态"
          }
        ],
        drugData: [],
        drugFormDeail: {
          frequencyCode: "",
          frequencyName: "",
          phoneticCode: "",
          fiveStrokeCode: "",
          customizeCode: "",
          cycleNum: "",
          cycleUnit: "",
          frequencyTimes: "",
          cycleDatePoint: "",
          cycleTimePoint: "",
          sortNum: ""
        },
        rules: {
          frequencyCode: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }],
          frequencyName: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }],
          cycleNum: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }],
          cycleUnit: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }],
          frequencyTimes: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }],
          sortNum: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }],
          outpSortNum: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }],
          inpSortNum: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }],
          status: [{
            required: true,
            message: "请选择",
            trigger: "change"
          }],
          cycleDatePoint: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }]
        },
        ztbs: [{
            value: "0",
            label: "暂停"
          },
          {
            value: "1",
            label: "正常"
          }
        ]
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
      changeSize(val) {
        this.pageParams.pageSize = val;
        this.loadTable();
      },
      changePage(val) {
        this.pageParams.pageNo = val;
        this.loadTable();
      },
      searchDataStatus(){
        this.loadTable();
      },
      loadTable() {
        let params = {
          ...this.searchData,
          ...this.pageParams,
          status: this.searchData.status ? "1" : ""
        };
        this.tlm_isLoading = true;
        baseApi
          .getFrequencyPageList(params)
          .then(res => {
            if (res.code === 1) {
              this.pageParams = res.pageParams;
              this.drugData = res.data;
              this.$refs.singleTable.setCurrentRow(res.data[0]);
              this.handleCurrentChange(res.data[0] || {});
            }
            this.tlm_isLoading = false;
          })
          .catch(err => {
            this.tlm_isLoading = false;
          });
      },
      handleCurrentChange(val) {
        this.$refs.drugFormDeail.resetFields();
        this.$nextTick(() => {
          this.drugFormDeail = { ...val
          };
        });
      },
      newadd() {
        this.$refs.singleTable.setCurrentRow();
        this.$refs.drugFormDeail.resetFields();
        this.$nextTick(() => {
          this.drugFormDeail = this.$options.data().drugFormDeail;
        });
      },
      saveForm() {
        this.$refs.drugFormDeail.validate(valid => {
          if (valid) {
            let params = {
              ...this.drugFormDeail
            };
            this.$delete(params, "createdByName");
            this.$delete(params, "createdAt");
            this.$delete(params, "createdBy");
            this.$delete(params, "updatedByName");
            this.$delete(params, "updatedAt");
            this.$delete(params, "updatedBy");
            this.$showLoading();
            baseApi
              .frequencyFormSave(params)
              .then(res => {
                if (res.code === 1) {
                  this.search();
                  this.newadd();
                  this.$message.success(res.msg || "保存成功");
                } else {
                  this.$message.error(res.msg || "保存失败");
                }
                this.$hideLoading();
              })
              .catch(err => {
                this.$hideLoading();
                this.$message.error(err.msg || "保存失败");
              });
          }
        });
      },
      cycleDateChange(val) {
        // /^[;0-9]*$/.test(this.value)
        const num = /^[;0-9]*$/;
        if (!num.test(val)) {
          this.$message.warning("请输入正确的间隔天数");
          this.$set(this.drugFormDeail, "cycleDatePoint", "");
        }
      },
      headerDragend() {
        this.$refs.singleTable.doLayout();
      }
    }
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

  .page {
    text-align: right;

    .el-pagination {
      padding: 0;

      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
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
