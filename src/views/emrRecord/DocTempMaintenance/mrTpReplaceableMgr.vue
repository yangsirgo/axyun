<template>
  <div class="height100 width100 bg-center">
    <l-layout
      :toolBoxShow="false"
      :patientListShow="false"
      pageName="docSubmit"
    >
      <template #content>
        <div class="bg-contain width100 height100">
          <div class="m-contain height100">
            <div class="top-search">
              <l-common-search rightAreaWidth="210">
                <template slot="leftCon">
                  <div class="common-item">
                    <l-formt-title label="文书类型编码">
                      <el-input v-model="queryParam.typeCode"></el-input>
                    </l-formt-title>
                  </div>
                  <div class="common-item">
                    <l-formt-title label="文书类型组">
                      <el-select
                        v-model="queryParam.typeGroupId"
                        clearable
                        filterable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in typeGroupOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </l-formt-title>
                  </div>
                  <div class="common-item">
                    <l-formt-title label="文书类型">
                      <el-select
                        v-model="queryParam.typeId"
                        clearable
                        filterable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in typeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </l-formt-title>
                  </div>
                  <div class="common-item">
                    <l-formt-title label="医护标识">
                      <el-select
                        v-model="queryParam.dnFlag"
                        clearable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in dnFlagOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </l-formt-title>
                  </div>
                </template>
                <template slot="rightCon">
                  <div class="btns-contain">
                    <el-button class="el-button--primary" @click="btnQuare"
                      >查询</el-button
                    >
                    <el-button
                      class="el-button--default"
                      @click="clearCondition"
                      >重置</el-button
                    >
                  </div>
                </template>
              </l-common-search>
            </div>

            <!-- 表格部分 -->
            <div class="table-con margin-top-10">
              <div
                style="
                  padding: 10px 20px;
                  border-top: 1px solid #dcdfe6;
                  margin-top: 10px;
                  height: calc(100% - 75px);
                "
              >
                <div class="iconBtn clearfix">
                  <div class="float-right">
                    <el-button @click="createType" icon="el-icon-plus"
                      >新建</el-button
                    >
                    <el-button icon="el-icon-edit-outline" @click="modifyType"
                      >编辑</el-button
                    >
                    <el-button icon="el-icon-remove-outline" @click="delType"
                      >删除</el-button
                    >
                  </div>
                </div>
                <div
                  class=""
                  style="height: calc(100% - 40px); margin-top: 10px"
                >
                  <l-table
                    :total="pageParams.total"
                    :pageSize.sync="pageParams.pageSize"
                    :page.sync="pageParams.pageNo"
                    :layout="layout"
                    :singlePageShow="true"
                    @changeSize="changeSize"
                  >
                    <el-table
                      :data="typeTable"
                      ref="typeTable"
                      border
                      height="100%"
                      style="width: 100%"
                      v-loading="tlm_isLoading"
                      element-loading-background="rgba(255, 255, 255, 0.5)"
                      @row-click="handleRowClick"
                    >
                      <el-table-column
                        type="selection"
                        width="50px"
                      ></el-table-column>
                      <el-table-column
                        type="index"
                        label="序号"
                        :index="indexMethod"
                        width="100px"
                      ></el-table-column>
                      <el-table-column
                        prop="replaceableGroupCode"
                        label="编码"
                        width="280px"
                      ></el-table-column>
                      <!--<el-table-column  prop="typeName" label="文书类型名称"  width="280px"></el-table-column>-->
                      <el-table-column
                        prop="typeGroupName"
                        label="文书类型组名称"
                        width="280px"
                      ></el-table-column>
                      <el-table-column
                        prop="dnFlag"
                        label="医护标识"
                        width="280px"
                      >
                        <template slot-scope="scope">
                          <span>{{
                            typeTable[scope.$index].dnFlag == "1"
                              ? "医生"
                              : "护士"
                          }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="typeName"
                        label="可替换文书类型"
                      ></el-table-column>
                    </el-table>
                  </l-table>
                </div>

                <el-dialog
                  :title="tDialogMode"
                  :visible.sync="createTypeDialog"
                  :close-on-click-modal="false"
                  width="480px"
                >
                  <div style="width: 480px; padding: 20px 40px">
                    <div style="margin: 0px -20px 15px 0px">
                      <div class="block"></div>
                      <span class="title" style="">基本属性</span>
                      <div style="clear: both"></div>
                    </div>
                    <el-row>
                      <span style="margin-left: 5em; margin-right: 5px"
                        >编码</span
                      >
                      <el-input
                        disabled
                        v-model="createData.replaceableCode"
                        style="width: 280px"
                        @change="isNumberOrChar"
                      ></el-input>
                    </el-row>
                    <el-row style="margin-top: 10px">
                      <span style="margin-left: 2em; margin-right: 5px"
                        >文书类型组</span
                      >
                      <el-select
                        clearable
                        filterable
                        v-model="createData.typeGroupCode"
                        placeholder="请选择"
                        style="width: 280px"
                        @change="changeTypeGroupCode"
                      >
                        <el-option
                          v-for="item in typeGroupOptions1"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-row>
                    <el-row style="margin-top: 10px">
                      <span style="margin-left: 0em; margin-right: 5px"
                        >可替换文书类型</span
                      >
                      <el-select
                        v-model="createData.replaceTypeCode"
                        multiple
                        clearable
                        filterable
                        collapse-tags
                        placeholder="请选择"
                        style="width: 280px"
                      >
                        <el-option
                          v-for="item in typeOptions1"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-row>
                  </div>
                  <div slot="footer">
                    <el-button type="primary" @click="submitForm"
                      >确定</el-button
                    >
                    <el-button @click="createTypeDialog = false"
                      >取消</el-button
                    >
                  </div>
                </el-dialog>
              </div>
            </div>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import {
  getPageByCondition,
  save,
  detailQuery,
  modify,
  remove,
  getSeq
} from "@/api/emrRecord/emr/replaceableType.js";
import { getTypeGroups } from "@/api/emrRecord/emr/typeGroup";
import { getTypeSelectByCondition } from "@/api/emrRecord/emr/template";

export default {
  name: "rpTypeGroupMt",
  components: {},
  data() {
    return {
      queryParam: {
        typeCode: "",
        typeGroupId: "",
        typeId: "",
        dnFlag: ""
      },
      typeGroupOptions: [],
      typeOptions: [],
      typeGroupOptions1: [],
      typeOptions1: [],
      dnFlagOptions: [
        {
          value: "1",
          label: "医生"
        },
        {
          value: "2",
          label: "护士"
        }
      ],
      typeTable: [],
      tlm_isLoading: false,
      createTypeDialog: false,
      tDialogMode: "新建可替换文书类型",
      createData: {
        replaceableCode: "",
        typeGroupCode: "",
        // origTypeCode: '',
        replaceTypeCode: ""
      },
      layout: "total,prev,pager,next,jumper",
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      tag: {}
    };
  },
  methods: {
    isNumberOrChar(value) {
      var reg = new RegExp(/^\w+$/);
      if (!reg.test(value)) {
        this.$message.error("请输入数字或字符串！");
        return false;
      }
      return true;
    },
    changeTypeGroupCode(value) {
      getTypeSelectByCondition({
        typeGroupCode: value
      })
        .then(res => {
          if (res.code == 1) {
            this.typeOptions1 = [];
            res.data.forEach(item => {
              let opt1 = {
                value: item.code,
                label: item.name
              };
              this.typeOptions1.push(opt1);
              this.createData.replaceTypeCode = [];
            });
          } else {
            this.$message.error(res.msg || "接口报错");
            return;
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    getSeq() {
      getSeq()
        .then(res => {
          if (res.code === 1) {
            this.createData.replaceableCode = res.data;
          } else {
            this.createData.replaceableCode = "";
            this.$message.error("获取接口失败!");
            return;
          }
        })
        .catch(error => {
          this.dataEleInfo.dataElementCode = "";
          this.$message.error("获取接口失败!");
        });
    },
    createType() {
      this.getSeq();
      this.createTypeDialog = true;
      this.tDialogMode = "新建可替换文书类型";

      this.createData = {
        replaceableCode: "",
        typeGroupCode: "",
        // origTypeCode: '',
        replaceTypeCode: ""
      };
    },
    modifyType() {
      if (this.$refs.typeTable.selection.length == 0) {
        this.$message({
          message: "请选择!",
          type: "warning"
        });
        return;
      }
      if (this.$refs.typeTable.selection.length > 1) {
        this.$message({
          message: "请选择一条数据!",
          type: "warning"
        });
        return;
      }
      detailQuery(this.$refs.typeTable.selection[0].replaceableGroupId)
        .then(res => {
          if (res.code == 1) {
            this.tag = res.data;
            this.createData.replaceableCode =
              res.data.replaceableTypeGroupPO.replaceableGroupCode;
            this.createData.typeGroupCode =
              res.data.replaceableTypeGroupPO.typeGroupCode;
            this.createData.replaceTypeCode = [];

            res.data.replaceableTypePOLst.forEach(item => {
              let typeIndex = this.typeOptions1.findIndex(option => {
                return option.value === item.typeCode;
              });

              if (typeIndex > -1) {
                this.createData.replaceTypeCode.push(item.typeCode);
              }
            });
          } else {
            this.$message.error(res.msg || "接口报错");
            return;
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });

      this.createTypeDialog = true;
      this.tDialogMode = "编辑可替换文书类型";
    },
    delType() {
      if (this.$refs.typeTable.selection.length == 0) {
        this.$message({
          message: "请选择!",
          type: "warning"
        });
        return;
      }

      let list = [];
      this.$refs.typeTable.selection.forEach(item => {
        list.push({
          dataVersion: item.dataVersion,
          replaceableGroupId: item.replaceableGroupId
        });
      });
      remove(list)
        .then(res => {
          if (res.code == 1) {
            this.query();
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.msg || "接口报错");
            return;
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.query();
    },
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    btnQuare() {
      this.pageParams.pageNo = 1;
      this.query();
    },
    query() {
      this.tlm_isLoading = true;
      let param = { ...this.queryParam, ...this.pageParams };
      getPageByCondition(param)
        .then(res => {
          if (res.code == 1) {
            if (res.data) {
              this.pageParams.total = res.data.total;
              this.typeTable = res.data.replaceableTypeContentDtoLst;
            }
            this.tlm_isLoading = false;
          } else {
            this.tlm_isLoading = false;
            this.$message.error(res.msg || "接口报错");
            return;
          }
        })
        .catch(res => {
          this.tlm_isLoading = false;
          this.$message.error(res.msg);
        });
    },
    initOpt() {
      getTypeGroups({ typeGroupStatus: "1" })
        .then(res => {
          if (res.code == 1) {
            res.data.forEach(item => {
              let opt = {
                value: item.typeGroupId,
                label: item.typeGroupName
              };
              this.typeGroupOptions.push(opt);
              let opt1 = {
                value: item.typeGroupCode,
                label: item.typeGroupName,
                id: item.typeGroupId
              };
              this.typeGroupOptions1.push(opt1);
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });

      getTypeSelectByCondition({})
        .then(res => {
          if (res.code === 1) {
            res.data.forEach(item => {
              let opt = {
                value: item.id,
                label: item.name
              };
              this.typeOptions.push(opt);

              let opt1 = {
                value: item.code,
                label: item.name
              };
              this.typeOptions1.push(opt1);
            });
          } else {
            this.$message.error(res.msg || "接口报错");
            return;
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    clearCondition() {
      this.queryParam = {
        typeCode: "",
        typeGroupId: "",
        typeId: "",
        dnFlag: ""
      };
    },
    handleRowClick(row, event, column) {
      this.$refs.typeTable.toggleRowSelection(row);
    },

    submitForm() {
      if (
        this.createData.replaceableCode === "" ||
        !this.createData.replaceableCode
      ) {
        this.$message.error("编码不可为空！");
        return;
      }

      if (!this.isNumberOrChar(this.createData.replaceableCode)) {
        this.$message.error("编码只能输入数字或字符串！");
        return;
      }
      if (
        this.createData.typeGroupCode === "" ||
        !this.createData.typeGroupCode
      ) {
        this.$message.error("文书类型组不可为空！");
        return;
      }
      if (
        this.createData.replaceTypeCode === "" ||
        !this.createData.replaceTypeCode
      ) {
        this.$message.error("可替换文书类型不可为空！");
        return;
      }

      if (this.tDialogMode == "新建可替换文书类型") {
        let replaceableTypeGroupPO = {
          replaceableGroupCode: this.createData.replaceableCode,
          typeGroupCode: this.createData.typeGroupCode
        };
        let replaceableTypePOLst = [];
        this.createData.replaceTypeCode.forEach(item => {
          replaceableTypePOLst.push({
            typeCode: item
          });
        });
        save({
          replaceableTypeGroupPO: replaceableTypeGroupPO,
          replaceableTypePOLst: replaceableTypePOLst
        })
          .then(res => {
            if (res.code == 1) {
              this.createTypeDialog = false;
              this.query();
              this.$message.success("保存成功");
            } else {
              // this.createTypeDialog = false;
              this.$message.error(res.msg || "保存接口报错！");
            }
          })
          .catch(res => {
            // this.createTypeDialog = false;
            this.$message.error(res.msg || "保存接口报错！");
          });
      } else {
        this.tag.replaceableTypeGroupPO.replaceableGroupCode = this.createData.replaceableCode;
        this.tag.replaceableTypeGroupPO.typeGroupCode = this.createData.typeGroupCode;
        this.tag.replaceableTypePOLst = [];
        this.createData.replaceTypeCode.forEach(item => {
          this.tag.replaceableTypePOLst.push({
            typeCode: item
          });
        });
        modify(this.tag)
          .then(res => {
            if (res.code === 1) {
              this.createTypeDialog = false;
              this.query();
              this.$message.success("保存成功");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(res => {
            this.$message.error(res.msg);
          });
      }
    }
  },
  mounted() {
    this.initOpt();
    this.query();
  }
};
</script>

<style lang="scss" scoped>
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  .m-contain {
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 0;
    .top-search {
      padding-top: 20px;
    }
    .table-con {
      height: calc(100% - 70px);
    }
  }
}
/deep/ .el-col {
  padding-left: 0 !important;
}
/deep/ .el-tabs {
  height: calc(100% + 50px);
}
/deep/ .el-tabs__content {
  height: calc(100% + 50px);
}
</style>
