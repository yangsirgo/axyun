<template>
  <div class="sys-container height100">
    <l-layout
      :toolBoxShow="false"
      :isLeftExpand="false"
      :patientListShow="false"
    >
      <template #content>
        <el-card style="height: 100%; width: 100%" id="medRecLvlMain">
          <div class="containtor" style="margin: 10px">
            <div class="search-con clearfix">
              <div class="search-main float-left"></div>
              <div class="float-right margin-top-10">
                <el-button class="el-button--primary" @click="query"
                  >查询
                </el-button>
              </div>
            </div>
          </div>
          <div class="table-contain">
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
                <el-button icon="el-icon-close" @click="disable"
                  >停用</el-button
                >
              </div>
            </div>
            <div class="table-con">
              <l-table
                :total="pageParams.total"
                :pageSize.sync="pageParams.pageSize"
                :page.sync="pageParams.pageNo"
                layout="total,prev,pager,next,jumper"
                :singlePageShow="true"
                @changeSize="changeSize"
              >
                <el-table
                  :data="tableData"
                  border
                  width="100%"
                  height="100%"
                  @row-click="onRowClick"
                  ref="medRecLvlTable"
                  :highlight-current-row="true"
                  element-loading-text="加载中..."
                  v-loading="tlm_isLoading"
                >
                  <el-table-column
                    type="selection"
                    width="50px"
                  ></el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
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
                        v-if="item.prop == 'dnFlag'"
                        :val="scope.row[item.prop]"
                        code="EmployeeMark"
                        v-codeTransformEmr
                      ></span>
                      <span
                        v-else-if="item.prop == 'visitType'"
                        :val="scope.row[item.prop]"
                        code="MedicalRecordType"
                        v-codeTransformEmr
                      ></span>
                      <span
                        v-else-if="item.prop == 'enabled'"
                        :val="scope.row[item.prop]"
                        code="ModelStatus"
                        v-codeTransformEmr
                      ></span>
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </l-table>
            </div>
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
                        >级别</span
                      >
                    </el-col>
                    <el-col :span="20">
                      <el-form-item
                        prop="mrGrade"
                        size="mini"
                        class="myFormItem"
                      >
                        <el-input
                          v-model="serverData.mrGrade"
                          style="width: 350px"
                          :disabled="vDisabled"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top: 10px">
                    <el-col :span="4" style="text-align: right">
                      <span style="margin-right: 10px; line-height: 30px"
                        >最小值</span
                      >
                    </el-col>
                    <el-col :span="20">
                      <el-form-item
                        prop="minValue"
                        size="mini"
                        class="myFormItem"
                      >
                        <el-input
                          v-model="serverData.minValue"
                          style="width: 350px"
                          :disabled="vDisabled"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top: 10px">
                    <el-col :span="4" style="text-align: right">
                      <span style="margin-right: 10px; line-height: 30px"
                        >最大值</span
                      >
                    </el-col>
                    <el-col :span="20">
                      <el-form-item
                        prop="maxValue"
                        size="mini"
                        class="myFormItem"
                      >
                        <el-input
                          v-model="serverData.maxValue"
                          style="width: 350px"
                          :disabled="vDisabled"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top: 10px">
                    <el-col :span="4" style="text-align: right">
                      <span style="margin-right: 10px; line-height: 30px"
                        >医护标识</span
                      >
                    </el-col>
                    <el-col :span="20">
                      <l-value-domain-emr
                        clearable
                        style="width: 350px"
                        code="EmployeeMark"
                        :value.sync="serverData.dnFlag"
                        placeholder="请选择"
                        :disabled="vDisabled"
                      ></l-value-domain-emr>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top: 10px">
                    <el-col :span="4" style="text-align: right">
                      <span style="margin-right: 10px; line-height: 30px"
                        >就诊类型</span
                      >
                    </el-col>
                    <el-col :span="20">
                      <l-value-domain-emr
                        clearable
                        style="width: 350px"
                        code="MedicalRecordType"
                        :value.sync="serverData.visitType"
                        placeholder="请选择"
                        :disabled="vDisabled"
                      ></l-value-domain-emr>
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
      </template>
    </l-layout>
  </div>
</template>

<script>
import {
  insert,
  modify,
  multiRemove,
  getInPage,
  detail,
  multiModify
} from "@/api/emrRecord/emr/MedRecLvl.js";

export default {
  name: "MedRecLvl",
  components: {},
  computed: {
    vDisabled() {
      if (this.serverData.enabled == "1" || this.serverData.enabled == "2") {
        return true;
      }
      return false;
    }
  },
  data() {
    return {
      tableData: [],
      tlm_isLoading: false,
      pageParams: {
        pageNo: 1, // 当前页数
        total: 5, // 总共条数
        pageSize: 20 // 每页数据条数
      },
      tableParams: [
        {
          prop: "mrGrade",
          label: "级别",
          width: "200",
          align: "center"
        },
        {
          prop: "minValue",
          label: "最小值(大于)",
          width: "200",
          align: "center"
        },
        {
          prop: "maxValue",
          label: "最大值(小于等于)",
          width: "200",
          align: "center"
        },
        {
          prop: "dnFlag",
          label: "医护标识",
          width: "200",
          align: "center"
        },
        {
          prop: "visitType",
          label: "就诊类型",
          width: "200",
          align: "center"
        },
        {
          prop: "enabled",
          label: "启用标识",
          width: "200",
          align: "center"
        }
      ],
      dialogMode: "新建",
      showDialog: false,
      serverData: {
        mrGrade: "",
        minValue: "",
        maxValue: "",
        dnFlag: "",
        enabled: "0",
        visitType: ""
      },
      rules: {
        mrGrade: [{ required: true, message: "请输入等级", trigger: "blur" }],
        minValue: [
          { required: true, message: "请输入最小值", trigger: "blur" }
        ],
        maxValue: [{ required: true, message: "请输入最大值", trigger: "blur" }]
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
    enable() {
      if (this.$refs.medRecLvlTable.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.$refs.medRecLvlTable.selection) {
        let status = index.enabled;
        if (status == "1") {
          this.$message.error(index.mrGrade + "已启用，不能再次启用!");
          return;
        }

        index.enabled = "1";
        arr.push(index);
      }
      multiModify(arr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "启用成功!",
            type: "success"
          });
          this.query();
        } else {
          this.$message.error("启用失败!" + res.message);
        }
      });
    },
    disable() {
      if (this.$refs.medRecLvlTable.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.$refs.medRecLvlTable.selection) {
        let status = index.enabled;
        if (status == "2") {
          this.$message.error(index.mrGrade + "已启用，不能再次停用!");
          return;
        }

        if (status === "0") {
          this.$message.error(index.mrGrade + "不可停用，请先启用后再停用!");
          return;
        }

        index.enabled = "2";
        arr.push(index);
      }
      multiModify(arr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "停用成功!",
            type: "success"
          });
          this.query();
        } else {
          this.$message.error("停用失败!" + res.message);
        }
      });
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
        document.getElementById("medRecLvlMain").offsetHeight - 200;
      console.log("tableHeight", this.tableHeight);
    },
    //查询
    query() {
      this.initQuery();
      this.loadTable();
    },
    create() {
      this.showDialog = true;
      this.dialogMode = "新建";
      this.clearServerData();
    },
    clearServerData() {
      this.serverData = {
        mrGrade: "",
        minValue: "",
        maxValue: "",
        enabled: "0",
        dnFlag: "",
        visitType: ""
      };
    },
    modify() {
      if (
        this.$refs.medRecLvlTable.selection.length > 1 ||
        this.$refs.medRecLvlTable.selection.length == 0
      ) {
        this.$message({
          message: "请选择一条数据修改!",
          type: "warning"
        });
        return;
      }

      detail({ id: this.$refs.medRecLvlTable.selection[0].id })
        .then(res => {
          if (res.code == 1) {
            this.serverData = res.data;
            this.showDialog = true;
            this.dialogMode = "修改";
          } else {
            this.$message.error(res.msg || "接口报错");
            return;
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    remove() {
      if (this.$refs.medRecLvlTable.selection.length == 0) {
        this.$message({
          message: "请选择!",
          type: "warning"
        });
        return;
      }

      let arr = this.$refs.medRecLvlTable.selection.filter(item => {
        return item.enabled === "0";
      });

      if (arr.length == 0) {
        this.$message.warning("所选记录已为启用/停用状态,不可删除");
        return;
      }

      multiRemove(arr)
        .then(res => {
          if (res.code == 1) {
            this.$message.success("删除成功");
            this.initQuery();
            this.loadTable();
          } else {
            this.$message.error(res.msg || "接口报错");
            return;
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    onRowClick(row, event, column) {
      this.$refs.medRecLvlTable.toggleRowSelection(row);
    },
    initQuery() {
      this.pageParams = {
        pageNo: 1, // 当前页数
        total: 0, // 总共条数
        pageSize: 20 // 每页数据条数
      };
      this.tableData = [];
    },
    changeSize(val) {
      // console.log("val====", val)
      this.pageParams.pageNo = val.page;
      this.loadTable();
    },
    loadTable() {
      this.tlm_isLoading = true;
      getInPage(this.pageParams)
        .then(res => {
          if (res.code == 1) {
            this.tableData = res.data;
            this.pageParams = {
              pageNo: res.pageNo,
              total: res.total,
              pageSize: res.pageSize
            };
          } else {
            this.$message.error(res.msg);
          }
          this.tlm_isLoading = false;
        })
        .catch(res => {
          this.$message.error(res.msg);
          this.tlm_isLoading = false;
        });
    },
    handleDetermine() {
      this.showDialog = false;
      if (this.dialogMode == "新建") {
        insert(this.serverData)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("新增成功");
              this.initQuery();
              this.loadTable();
            } else {
              this.$message.error(res.msg || "接口报错");
              return;
            }
          })
          .catch(res => {
            this.$message.error(res.msg);
          });
      } else {
        modify(this.serverData)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("修改成功");
              this.initQuery();
              this.loadTable();
            } else {
              this.$message.error(res.msg || "接口报错");
              return;
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
  .table-contain {
    height: calc(100% - 60px);
    margin-top: 10px;
    position: relative;
    padding: 10px 20px;
    border-top: 1px solid #e4e4e4;
  }

  .table-con {
    margin-top: 10px;
    height: calc(100% - 80px);
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

    .margin-top-10 {
      margin-top: 10px;
    }
  }

  .myFormItem {
    width: 298px;
    display: inline-block;
  }

  .el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }

  /deep/ .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>
