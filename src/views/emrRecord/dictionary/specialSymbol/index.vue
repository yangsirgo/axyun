<template>
  <div class="height100 width100 bg-center">
    <l-layout
      :toolBoxShow="false"
      :isLeftExpand="false"
      :patientListShow="false"
    >
      <template #content>
        <div class="bg-contain width100 height100">
          <div class="m-contain">
            <div class="width100 clearfix">
              <div class="float-left" style="width: calc(100% - 180px)">
                <div class="common-width margin-top-10">
                  <l-formt-title label="符号编码">
                    <el-input v-model="form.speCharCode"></el-input>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="符号名称">
                    <el-input v-model="form.speCharName"></el-input>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="医护标识">
                    <l-value-domain-emr
                      clearable
                      code="EmployeeMark"
                      :value.sync="form.dnFlag"
                      placeholder="请选择"
                    ></l-value-domain-emr>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="是否启用">
                    <l-value-domain-emr
                      clearable
                      code="ModelStatus"
                      :value.sync="form.enabled"
                      placeholder="请选择"
                    ></l-value-domain-emr>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="是否显示">
                    <l-value-domain-emr
                      clearable
                      code="speCharVisible"
                      :value.sync="form.visible"
                      placeholder="请选择"
                    ></l-value-domain-emr>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="符号类型">
                    <l-value-domain-emr
                      clearable
                      code="speCharType"
                      :value.sync="form.speCharType"
                      placeholder="请选择"
                    ></l-value-domain-emr>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10 special-item">
                  <!-- <l-formt-title>
                    <el-checkbox v-model="level0">全院</el-checkbox>
                    <el-checkbox v-model="level1">科室</el-checkbox>
                    <l-value-domain-emr
                      style="width: 210px"
                      multiple
                      clearable
                      collapse-tags
                      filterable
                      :localFilterKeys="deptLocalFilterKeys"
                      :value.sync="deptVal"
                      :reserve-keyword="reserveKeyword"
                      remoteUrl="/wadmin/hos/dept"
                      remoteShowKey="orgNm"
                      remoteValueKey="id"
                      placeholder="请选择"
                      @change="changeDept"
                    ></l-value-domain-emr>
                    <el-checkbox v-model="level2">个人</el-checkbox>
                  </l-formt-title> -->
                  <l-org-operate
                    ref="lOrgOperateRef"
                    @choosePerson="choosePerson"
                  />
                </div>
              </div>
              <div class="float-right clearfix margin-top-10">
                <el-button
                  class="el-button--primary"
                  style="width: 68px; height: 30px"
                  @click="handleQuery"
                  >查询
                </el-button>
                <el-button
                  class="el-button--default"
                  style="width: 68px; height: 30px"
                  @click="handleReset"
                  >重置
                </el-button>
              </div>
            </div>
          </div>
          <div class="tablist">
            <div class="operate clearfix">
              <div class="float-right">
                <el-button icon="el-icon-plus" @click="create">新建</el-button>
                <el-button icon="el-icon-remove-outline" @click="edit"
                  >修改
                </el-button>
                <el-button icon="el-icon-remove-outline" @click="handleRemove"
                  >删除
                </el-button>
                <el-button icon="el-icon-check" @click="enable">启用</el-button>
                <el-button icon="el-icon-close" @click="disable"
                  >停用</el-button
                >
              </div>
            </div>
            <div class="table-contain">
              <l-table
                :total="pageParams.total"
                :pageSize.sync="pageParams.pageSize"
                :page.sync="pageParams.pageNo"
                layout="total,prev,pager,next,jumper"
                :singlePageShow="true"
                @changeSize="changeSize"
              >
                <el-table
                  stripe
                  width="100%"
                  height="100%"
                  border
                  :data="specialSymbolData"
                  ref="tempTable"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="dblclickOpen"
                  @row-click="selectRow"
                  v-loading="tlm_isLoading"
                >
                  <el-table-column
                    fixed
                    type="selection"
                    width="40"
                  ></el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                  ></el-table-column>
                  <el-table-column
                    prop="speCharCode"
                    label="符号编码"
                    width="150"
                  ></el-table-column>
                  <el-table-column
                    prop="speCharName"
                    label="符号名称"
                    width="150"
                  ></el-table-column>
                  <el-table-column
                    prop="speCharContent"
                    label="符号"
                    width="150"
                  ></el-table-column>
                  <el-table-column
                    prop="scopeLevel"
                    label="所属级别"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.scopeLevel"
                        code="LevelType"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ownerId" label="所属名称">
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.scopeLevel === '0'"
                        tableName="sys_org"
                        :conditionMap="{ id: scope.row.ownerId }"
                        columns="org_nm"
                        v-tableTransformEmr
                      ></span>
                      <span
                        v-else-if="scope.row.scopeLevel === '1'"
                        v-for="(item, index) in scope.row.ownerId.split(',')"
                        :key="item"
                      >
                        <span
                          tableName="sys_org"
                          :conditionMap="{ id: item }"
                          columns="org_nm"
                          v-tableTransformEmr
                        ></span>
                        <i
                          v-if="
                            index != scope.row.ownerId.split(',').length - 1
                          "
                          >、</i
                        >
                      </span>
                      <span
                        v-else-if="scope.row.scopeLevel === '2'"
                        tableName="sys_user"
                        :conditionMap="{ id: scope.row.ownerId }"
                        columns="name"
                        v-tableTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="typeCode" label="医护标识" width="150">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.dnFlag"
                        code="EmployeeMark"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="visible" label="是否显示" width="150">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.visible"
                        code="speCharVisible"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="speCharType"
                    label="符号类型"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.speCharType"
                        code="speCharType"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="enabled" label="启用标识" width="80">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.enabled"
                        code="ModelStatus"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="description"
                    label="描述"
                    width="150"
                  ></el-table-column>
                </el-table>
              </l-table>
            </div>
            <edit-section
              :isShow.sync="dialogVisible"
              :template="sTemplate"
              :disabledFlag="disabledFlag"
              @handle-save="handleSave"
              @handle-update="handleUpdate"
            ></edit-section>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getManageList,
  getDetail,
  multiUpdate,
  removeSpecialSymbalbatch
} from "@/api/emrRecord/emr/specialSymbol";

import EditSection from "./components/editSection";
import LOrgOperate from "@/views/emrRecord/components/LOrgOperate";

import commonMixins from "@/views/emrRecord/DocTempMaintenance/mixins/common.js";
import { getUId } from "@/utils/crypto";

export default {
  name: "specialSymbolManagement",
  components: {
    EditSection,
    LOrgOperate
  },
  mixins: [commonMixins],
  data() {
    return {
      reserveKeyword: false,
      deptLocalFilterKeys: ["orgNm"],
      tlm_isLoading: false,
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      activeName: "mainTab",
      //接口参数
      form: {
        speCharCode: "", //符号编码
        speCharName: "", //符号名称
        dnFlag: "", //医护标识
        visible: "", //0-隐藏 1-显示
        speCharType: "", // 单位 unit /数字 number /符号 symbal /文字 char /其他 else
        hospitalId: "",
        enabled: ""
      },
      persId: "",
      deptVal: [],
      dialogVisible: false,
      selection: [],
      sTemplate: {},
      specialSymbolData: [],
      tableHeight: 300,
      disabledFlag: false
    };
  },
  mounted() {
    this.handleQuery();
  },
  methods: {
    choosePerson(val) {
      this.persId = val ? getUId() : "";
    },
    selectRow(row, column, event) {
      this.$refs.tempTable.toggleRowSelection(row);
    },
    changeSize(val) {
      console.log("val====", val);
      this.pageParams.pageNo = val.page;
      this.fetchData();
    },
    //查询
    handleQuery() {
      if (this.level1 == false) {
        this.deptVal = [];
      }

      const lOrgOperateRef = this.$refs.lOrgOperateRef;
      const {
        flagTenant,
        flagHos,
        flagDept,
        flagUser
      } = lOrgOperateRef.judgeFlag();
      // const currUserRole = this.getCurrRoleCodeHandler();

      let obj = {
        hosIds: lOrgOperateRef.hosValHandler(),
        level9: flagTenant ? 1 : null,
        level0: flagHos ? 1 : null,
        level1: flagDept ? 1 : null,
        level2: flagUser ? 1 : null,
        // currDept: this.level1 == true ? "1" : "0",
        // currUser: this.level2 == true ? "1" : "0",
        deptIds: flagDept ? lOrgOperateRef.deptsHandler() : "",
        userIds: this.persId
      };
      this.form = { ...this.form, ...obj };
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: 0
      };
      this.specialSymbolData = [];
      this.fetchData();
    },
    //调接口
    fetchData() {
      this.tlm_isLoading = true;
      getManageList({ ...this.form, ...this.pageParams })
        .then(res => {
          if (res.code === 1) {
            this.specialSymbolData = res.data;
            this.dataTotal = res.total;
            this.pageParams = {
              pageNo: res.pageNo,
              total: res.total,
              pageSize: res.pageSize
            };
            console.log("page", this.pageParams);
          } else {
            this.$message.error("获取数据失败");
            return;
          }
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },
    handleReset() {
      this.form.speCharCode = ""; // 符号编码
      this.form.speCharName = ""; // 符号名称
      this.form.dnFlag = ""; // 医护标识
      this.form.visible = ""; // 0-隐藏 1-显示
      this.form.speCharType = ""; // 单位 unit /数字 number /符号 symbal /文字 char /其他 else
      this.form.scopeLevel = ""; // 所属级别. 0:通用 1:科室 2:个人
      this.form.enabled = "";

      this.deptVal = [];

      this.$refs.lOrgOperateRef.resetData();
    },
    //选择项发生变化
    handleSelectionChange(val) {
      this.selection = val;
    },
    //双击打开编辑模板内容
    dblclickOpen(row, column, event) {
      this.$refs.tempTable.clearSelection();
      this.$refs.tempTable.toggleRowSelection(row, true);
      this.edit(row);
    },
    //新建按钮
    create() {
      this.disabledFlag = false;

      this.sTemplate = {
        speCharCode: "", //符号编码
        speCharName: "", //符号名称
        speCharContent: "", //符号
        speCharType: "spe_else",
        visible: "1",
        scopeLevel: "0",
        speCharId: "",
        dnFlag: "1",
        enabled: "0",
        number: this.getSequence()
      };
      setTimeout(() => {
        this.dialogVisible = true;
      }, 200);
    },
    getSequence() {
      let returnNumber = 1;
      for (let item of this.specialSymbolData) {
        if (item.number !== "" && item.number > returnNumber) {
          returnNumber = item.number + 1;
        }
      }
      return returnNumber;
    },
    paramsArrHandler(arr = []) {
      let list = [];
      list = arr.map(item => {
        return {
          id: item.speCharId,
          code: item.speCharCode,
          scopeLevel: item.scopeLevel,
          ownerId: item.ownerId,
          oprRoleLevel: item.oprRoleLevel
        };
      });
      return list;
    },
    //编辑
    async edit(row = "") {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      if (this.selection.length > 1) {
        this.$message("只能选择一条数据");
        return;
      }

      const params = this.paramsArrHandler([this.selection[0]]);
      const flag = await this.authorityHandler(params);

      this.disabledFlag = !flag;
      getDetail(this.selection[0].speCharId).then(res => {
        if (res.code === 1) {
          this.sTemplate = res.data;
          setTimeout(() => {
            this.dialogVisible = true;
          }, 200);
        } else {
          this.$message.error("获取明细失败!");
          return;
        }
      });
    },
    //删除
    async handleRemove() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }

      let arr = [];
      let delList = [];
      for (let index of this.selection) {
        arr.push(index.speCharId);

        delList.push(index.enabled);
      }

      if (delList.includes("1") || delList.includes("2")) {
        this.$message.warning("所选记录含有启用/停用状态,不可删除");
        return;
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);

      if (!flag) return;

      this.handleDelete(arr);
    },
    //启用
    async enable() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.enabled;
        if (status == "1") {
          this.$message.error(
            index.speCharName +
              "(" +
              index.speCharCode +
              ")已启用，不能再次启用!"
          );
          return;
        }

        index.enabled = "1";
        arr.push(index);
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);

      if (!flag) return;

      multiUpdate(arr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "启用成功!",
            type: "success"
          });
          this.handleQuery();
        } else {
          this.$message.error("启用失败!" + res.message);
          return;
        }
      });
    },
    //停用
    async disable() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.enabled;
        if (status == "2") {
          this.$message.error(
            index.speCharName +
              "(" +
              index.speCharCode +
              ")已停用，不能再次停用!"
          );
          return;
        }

        if (status === "0") {
          this.$message.error(
            index.speCharName +
              "(" +
              index.speCharCode +
              ")不可停用，请先启用后再停用!"
          );
          return;
        }

        index.enabled = "2";
        arr.push(index);
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);

      if (!flag) return;

      multiUpdate(arr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "停用成功!",
            type: "success"
          });
          this.handleQuery();
        } else {
          this.$message.error("停用失败!" + res.message);
          return;
        }
      });
    },
    handleDelete(arr) {
      this.$confirm("此操作将删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteList(arr);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    deleteList(delArr) {
      removeSpecialSymbalbatch(delArr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "删除成功! 共删除" + delArr.length + "条数据",
            type: "success"
          });
          this.handleQuery();
        } else {
          this.$message.error("删除失败!");
          return;
        }
      });
    },

    //信息编辑回调
    handleSave() {
      this.handleReset();
      this.handleQuery();
    },
    handleUpdate(template) {
      this.handleReset();
      this.handleQuery();
    },
    changeDept() {
      if (this.deptVal.length > 0) {
        if (this.level1 == false) {
          this.level1 = true;
        }
      }
    }
  },
  computed: {
    ...mapGetters(["role"]),
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .m-contain {
    margin: 0 20px;
    padding: 20px 0;
  }
  .tablist {
    height: calc(100% - 160px);
    position: relative;
    padding: 10px 20px;
    border-top: 1px solid #e4e4e4;
    .table-contain {
      margin-top: 10px;
      height: calc(100% - 40px);
    }
  }
}

.common-width {
  margin-right: 10px;
  display: inline-block;
  width: 240px;
}

.special-item {
  width: 850px;
}

.margin-top-10 {
  margin-top: 10px;
}
</style>
