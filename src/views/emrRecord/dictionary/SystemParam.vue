<template>
  <div class="sys-container height100">
    <flow-menu>
      <el-card style="height: 100%; width: 100%" id="sysParamMain">
        <div class="containtor" style="margin: 10px">
          <div class="search-con clearfix">
            <div class="search-main float-left">
              <div class="common-width margin-top-10">
                <span>编码</span>
                <el-input
                  style="width: 110px"
                  v-model="queryParam.paramCode"
                ></el-input>
              </div>
              <div class="common-width margin-top-10">
                <span>名称</span>
                <el-input
                  style="width: 110px"
                  v-model="queryParam.paramName"
                ></el-input>
              </div>
              <div class="float-right margin-top-10">
                <el-button class="el-button--primary" @click="query"
                  >查询</el-button
                >
                <el-button class="el-button--default" @click="clearCondition"
                  >重置</el-button
                >
              </div>
            </div>
          </div>
        </div>
        <div style="margin: 10px; border: 1px solid #dcdfe6">
          <div style="margin: 10px" class="iconBtn clearfix">
            <div class="float-right">
              <el-button @click="create" icon="el-icon-plus">新建</el-button>
              <el-button icon="el-icon-edit-outline" @click="modify"
                >编辑</el-button
              >
              <el-button icon="el-icon-remove-outline" @click="remove"
                >删除</el-button
              >
              <el-button icon="el-icon-check" @click="enable">启用</el-button>
              <el-button icon="el-icon-close" @click="disable">停用</el-button>
            </div>
          </div>

          <l-table
            :total="total"
            :pageSize.sync="pageParams.pageSize"
            :page.sync="pageParams.pageNo"
            :layout="layout"
            :singlePageShow="true"
            @changeSize="changeSize"
          >
            <el-table
              :data="tableData"
              border
              :height="tableHeight"
              @row-click="onRowClick"
              ref="table"
              :highlight-current-row="true"
              element-loading-text="加载中..."
              v-loading="tlm_isLoading"
            >
              <el-table-column type="selection" width="50px"></el-table-column>
              <el-table-column
                type="index"
                label="序号"
                :index="indexMethod"
                width="100px"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                v-for="(item, index) in tableParams"
                :type="item.type"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                header-align="center"
                :align="item.align || 'left'"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <span
                    v-if="item.prop == 'enable'"
                    :val="scope.row.enable"
                    code="ModelStatus"
                    v-codeTransformEmr
                  ></span>
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </el-table-column>
            </el-table>
          </l-table>

          <el-dialog
            :title="dialogMode"
            :visible.sync="showDialog"
            :close-on-click-modal="false"
            @close="dialogClose"
            width="480px"
          >
            <el-form
              :model="serverData"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
            >
              <div style="width: 480px; padding: 20px 20px">
                <el-row>
                  <el-col :span="4" style="text-align: right">
                    <span style="margin-right: 10px; line-height: 30px"
                      >编码</span
                    >
                  </el-col>
                  <el-col :span="20">
                    <el-form-item
                      prop="paramCode"
                      size="mini"
                      class="myFormItem"
                    >
                      <el-input
                        v-model="serverData.paramCode"
                        style="width: 350px"
                        :disabled="wDisabled"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="4" style="text-align: right">
                    <span style="margin-right: 10px; line-height: 30px"
                      >名称</span
                    >
                  </el-col>
                  <el-col :span="20">
                    <el-form-item
                      prop="paramName"
                      size="mini"
                      class="myFormItem"
                    >
                      <el-input
                        v-model="serverData.paramName"
                        style="width: 350px"
                        :disabled="wDisabled"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="4" style="text-align: right">
                    <span style="margin-right: 10px; line-height: 30px"
                      >关键字</span
                    >
                  </el-col>
                  <el-col :span="20">
                    <el-form-item
                      prop="paramKey"
                      size="mini"
                      class="myFormItem"
                    >
                      <el-input
                        v-model="serverData.paramKey"
                        style="width: 350px"
                        :disabled="wDisabled"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="4" style="text-align: right">
                    <span style="margin-right: 10px; line-height: 30px"
                      >值</span
                    >
                  </el-col>
                  <el-col :span="20">
                    <el-form-item
                      prop="paramValue"
                      size="mini"
                      class="myFormItem"
                    >
                      <el-input
                        v-model="serverData.paramValue"
                        style="width: 350px"
                        :disabled="vDisabled"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="4" style="text-align: right">
                    <span style="margin-right: 10px; line-height: 30px"
                      >拼音码</span
                    >
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="serverData.phoneticCode"
                      style="width: 130px"
                      :disabled="true"
                    ></el-input>
                  </el-col>
                  <el-col :span="4" style="text-align: right">
                    <span style="margin-right: 10px; line-height: 30px"
                      >五笔码</span
                    >
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="serverData.fiveStrokeCode"
                      style="width: 130px"
                      :disabled="true"
                    ></el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="4" style="text-align: right">
                    <span style="margin-right: 10px; line-height: 30px"
                      >助记码</span
                    >
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="serverData.customizeCode"
                      style="width: 130px"
                      :disabled="vDisabled"
                    ></el-input>
                  </el-col>
                  <el-col :span="4" style="text-align: right">
                    <span style="margin-right: 10px; line-height: 30px"
                      >顺序码</span
                    >
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="serverData.sortCode"
                      style="width: 130px"
                      :disabled="vDisabled"
                    ></el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="4" style="text-align: right">
                    <span style="margin-right: 10px; line-height: 30px"
                      >描述</span
                    >
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      v-model="serverData.recordRemark"
                      type="textarea"
                      style="width: 350px"
                      :disabled="vDisabled"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
            </el-form>
            <div slot="footer">
              <el-button v-if="!vDisabled" type="primary" @click="submitForm"
                >确定</el-button
              >
              <el-button v-if="!vDisabled" @click="showDialog = false"
                >取消</el-button
              >
            </div>
          </el-dialog>
        </div>
      </el-card>
    </flow-menu>
  </div>
</template>

<script>
import {
  getPageInCondition,
  insertParam,
  modifyParam,
  detailQuery,
  multiRemove,
  multiModify
} from "@/api/emrRecord/emr/SysParam.js";
import FlowMenu from "@/components/FlowMenu";

export default {
  name: "SystemParam",
  components: {
    FlowMenu
  },
  computed: {
    vDisabled() {
      if (this.serverData.enable === "1") {
        return true;
      }
      return false;
    },
    wDisabled() {
      if (this.serverData.enable === "0") {
        return false;
      }
      return true;
    }
  },
  data() {
    return {
      tableHeight: 500,
      queryParam: {
        paramCode: "",
        paramName: ""
      },
      tableData: [],
      tlm_isLoading: false,
      layout: "total,prev,pager,next,jumper",
      total: 0,
      pageParams: {
        pageNo: 1, // 当前页数
        pageSize: 20 // 每页数据条数
      },
      tableParams: [
        {
          prop: "paramCode",
          label: "参数编码",
          width: "200",
          align: "center"
        },
        {
          prop: "paramName",
          label: "参数名称",
          width: "200",
          align: "center"
        },
        {
          prop: "paramKey",
          label: "关键字",
          width: "200",
          align: "center"
        },
        {
          prop: "paramValue",
          label: "值",
          width: "100",
          align: "center"
        },
        {
          prop: "enable",
          width: "100",
          label: "启用标识",
          align: "center"
        },
        {
          prop: "recordRemark",
          width: "200",
          label: "描述",
          align: "center"
        }
      ],
      dialogMode: "新建",
      showDialog: false,
      serverData: {
        paramCode: "",
        paramName: "",
        paramKey: "",
        paramValue: "",
        phoneticCode: "",
        fiveStrokeCode: "",
        customizeCode: "",
        sortCode: "",
        recordRemark: "",
        enable: "0"
      },
      rules: {
        paramCode: [{ required: true, message: "请输入编码", trigger: "blur" }],
        paramName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        paramKey: [
          { required: true, message: "请输入关键字", trigger: "blur" }
        ],
        paramValue: [{ required: true, message: "请输入值", trigger: "blur" }]
      }
    };
  },
  mounted() {
    setTimeout(() => {
      this.changeTableHeight();
    });
    this.query();
  },
  methods: {
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    resetPageParams() {
      this.tableData = [];
      this.totle = 0;
      this.pageParams = {
        pageNo: 1, // 当前页数
        pageSize: 20 // 每页数据条数
      };
    },
    dialogClose() {
      this.$refs.ruleForm.clearValidate();
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.handleDetermine();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeTableHeight() {
      this.tableHeight =
        document.getElementById("sysParamMain").offsetHeight - 200;
      console.log("tableHeight", this.tableHeight);
    },
    enable() {
      if (this.$refs.table.selection.length == 0) {
        this.$message({
          message: "请选择!",
          type: "warning"
        });
        return;
      }

      let arr = [];
      for (let index of this.$refs.table.selection) {
        let status = index.enable;
        if (status == "1") {
          this.$message.error(index.paramName + "已启用，不能再次启用!");
          return;
        }
        index.enable = "1";
        arr.push(index);
      }

      multiModify(arr)
        .then(res => {
          if (res.code == 1) {
            this.$message.success("启用成功");
            this.resetPageParams();
            this.loadTable();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    disable() {
      if (this.$refs.table.selection.length == 0) {
        this.$message({
          message: "请选择!",
          type: "warning"
        });
        return;
      }

      let arr = [];
      for (let index of this.$refs.table.selection) {
        let status = index.enable;
        if (status === "2") {
          this.$message.error(index.paramName + "已停用，不能再次停用!");
          return;
        }

        if (status === "0") {
          this.$message.error(index.paramName + "不可停用，请先启用后再停用!");
          return;
        }

        index.enable = "2";
        arr.push(index);
      }

      multiModify(arr)
        .then(res => {
          if (res.code == 1) {
            this.$message.success("停用成功");
            this.resetPageParams();

            this.loadTable();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    //查询
    query() {
      this.resetPageParams();
      this.loadTable();
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.loadTable();
    },
    //重置
    clearCondition() {
      this.queryParam = {
        code: "",
        name: ""
      };
    },
    create() {
      this.showDialog = true;
      this.dialogMode = "新建";
      this.clearServerData();
    },
    clearServerData() {
      this.serverData = {
        paramCode: "",
        paramName: "",
        paramKey: "",
        paramValue: "",
        phoneticCode: "",
        fiveStrokeCode: "",
        customizeCode: "",
        sortCode: "",
        recordRemark: "",
        enable: "0"
      };
    },
    modify() {
      if (this.$refs.table.selection.length == 0) {
        this.$message({
          message: "请选择!",
          type: "warning"
        });
        return;
      }
      detailQuery(this.$refs.table.selection[0])
        .then(res => {
          if (res.code == 1) {
            this.serverData = res.data;
            this.showDialog = true;
            this.dialogMode = "修改";
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    remove() {
      if (this.$refs.table.selection.length == 0) {
        this.$message({
          message: "请选择!",
          type: "warning"
        });
        return;
      }
      let array = [];
      this.$refs.table.selection.forEach(item => {
        if (item.enable === "0") {
          array.push(item.id);
        }
      });

      if (array.length == 0) {
        this.$message.warning("所选记录已为启用/停用状态,不可删除");
        return;
      }

      multiRemove(array)
        .then(res => {
          if (res.code === 1) {
            this.$message.success("删除成功");
            this.resetPageParams();
            this.loadTable();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    onRowClick(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },

    loadTable() {
      this.tlm_isLoading = true;
      getPageInCondition({ ...this.queryParam, ...this.pageParams })
        .then(res => {
          let { code, data, total, pageNo, pageSize, msg } = res;
          if (code === 1) {
            this.tableData = [...data];
            this.total = total; // 总共条数
            this.pageParams = {
              pageNo: pageNo,
              pageSize: pageSize
            };
          } else {
            this.$message.error(msg);
          }
        })
        .catch(res => {
          this.$message.error(res || "获取数据错误");
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },
    handleDetermine() {
      this.showDialog = false;
      if (this.dialogMode == "新建") {
        insertParam(this.serverData)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("新增成功");
              this.resetPageParams();

              this.loadTable();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(res => {
            this.$message.error(res.msg);
          });
      } else {
        modifyParam(this.serverData)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("修改成功");
              this.resetPageParams();
              this.loadTable();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(res => {
            this.$message.error(res.msg);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sys-container {
  overflow: hidden;
  .fangkuai {
    width: 4px;
    height: 16px;
    background-color: $l-color-bgcolor-12;
    margin-left: 16px;
    margin-top: 19px;
    float: left;
  }
  .myFormItem {
    width: 298px;
    display: inline-block;
  }
  .el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }
  /deep/.el-form-item__content {
    margin-left: 0px !important;
  }
  .containtor {
    .search-con {
      width: 100%;
      .search-main {
        width: calc(100% - 160px);
      }
    }
    .common-width {
      margin-right: 10px;
      display: inline-block;
      width: 220px;
    }
  }
}
</style>
