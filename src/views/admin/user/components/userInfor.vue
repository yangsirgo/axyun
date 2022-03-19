<template>
  <div>
    <el-form
      :model="userForm"
      :label-position="labelPosition"
      label-width="80px"
      ref="userForm"
      :rules="rules"
      style="padding: 0 0 20px 0"
    >
      <el-row :gutter="20" style="height: 330px; overflow-y: auto">
        <el-col :span="10" style="padding: 20px">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="userForm.name"
              placeholder="请输入姓名"
              :disabled="!isShowBtn"
            ></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account" v-if="dialogType == 'add'">
            <el-input
              v-model="userForm.account"
              placeholder="请输入账号"
              :disabled="!isShowBtn"
            ></el-input>
          </el-form-item>
          <el-form-item label="员工编号" prop="userNo">
            <el-input
              v-model="userForm.userNo"
              placeholder="请输入员工编号"
              :disabled="!isShowBtn"
            ></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input-number
              class="width100"
              v-model="userForm.age"
              placeholder="请输入年龄"
              :min="0"
              :max="200"
              :disabled="!isShowBtn"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="员工类型" prop="workType">
            <!--<el-select v-model="userForm.workType" placeholder="请选择员工类型">
                        <el-option label="医生" value="1"></el-option>
                        <el-option label="护士" value="2"></el-option>
            </el-select>-->
            <l-value-domain
              code="EmployeeMark"
              :value.sync="userForm.workType"
              :disabled="!isShowBtn"
            />
          </el-form-item>
          <el-form-item label="职称" prop="title">
            <l-value-domain
              code="doctorProfessionalTitle"
              :value.sync="userForm.title"
              :disabled="!isShowBtn"
            />
          </el-form-item>
          <el-form-item label="手术级别" prop="operationLevel">
            <!--<el-select v-model="userForm.operationLevel" placeholder="请选择手术级别">-->
            <l-value-domain
              code="SurgicalGrade"
              :value.sync="userForm.operationLevel"
              :disabled="!isShowBtn"
            />
          </el-form-item>
          <el-form-item label="处方权" prop="prescribe">
            <el-select
              v-model="userForm.prescribe"
              placeholder="请选择处方权"
              :disabled="!isShowBtn"
            >
              <el-option label="是" value="Yes"></el-option>
              <el-option label="否" value="No"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="deptName">
            <el-radio-group v-model="userForm.gender" :disabled="!isShowBtn">
              <el-radio label="M">男</el-radio>
              <el-radio label="W">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- <el-form-item label="所属医院">
                    <el-button type="text" @click="handleShowTree">{{userForm.hosName}}</el-button>
          </el-form-item>-->
          <!-- <el-form-item v-if="show">
                    <el-tree
                            ref="tree"
                            :data="data"
                            show-checkbox
                            node-key="id"
                            :check-strictly="true"
                            :props="defaultProps"
                            @check-change="checkChange"
                            @node-click="nodeClick"
                            :default-checked-keys="[userForm.hosId]"


                    >
                    </el-tree>
          </el-form-item>-->
        </el-col>
        <el-col :span="14">
          <div v-if="isTenant">
            <el-button
              type="primary"
              size="mini"
              @click="relevanceHos"
              style="margin-bottom: 15px"
              >关联医院</el-button
            >
            <el-button
              v-if="this.dialogType != 'add'"
              type="primary"
              size="mini"
              @click="handlereset"
              style="margin-bottom: 15px"
              icon="el-icon-refresh"
              >刷新</el-button
            >
            <el-table
              :data="this.dialogType == 'add' ? hos : hosNames"
              element-loading-text="Loading"
              height="250"
              border
              fit
              style="margin-right: 20px; width: 97%"
            >
              <el-table-column align="center" label="序号" width="50">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column label="医院名称" align="center">
                <template slot-scope="scope">{{ scope.row.hosNm }}</template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="handleDel(scope.row)"
                    type="text"
                    size="small"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else-if="dialogType == 'add' && !isTenant">
            <span class="hos">
              <span style="font-weight: 600; margin-right: 10px"
                >所属医院:</span
              >
              {{ hosName }}
            </span>
          </div>
        </el-col>
      </el-row>

      <div style="text-align: right; margin-right: 30px" v-if="isShowBtn">
        <el-button type="primary" size="mini" @click="handleOk">保存</el-button>
        <el-button type="primary" size="mini" @click="handleClose"
          >取消</el-button
        >
      </div>
    </el-form>
    <el-dialog
      append-to-body
      :visible.sync="hosVisible"
      title="关联医院1"
      :before-close="handleClose1"
      style="min-height: 300px"
    >
      <!-- <el-table
        :data="data"
        style="width:97%;padding-left:30px;height:300px;overflow-y:auto"
        :ref="dialogType=='edit'?'hosInfo':'dataTable'"
        height="300"
        @select-all="handleSelection"
        @select="handleSelection"
        :row-key="getRowKeys"
      >-->
      <!-- <el-table-column type="selection" width="55" v-if="this.dialogType=='add'"></el-table-column>
        <el-table-column align="center" label width="50" v-else>
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.id"
              v-model="hosid"
              @change.native="toggleSelect(scope.$index,scope.row)"
            >&nbsp;</el-radio>
          </template>
      </el-table-column>-->
      <!-- <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="医院名称" align="center">
          <template slot-scope="scope">{{ scope.row.hosNm}}</template>
        </el-table-column>
      </el-table>-->
      <!-- <pagination
        v-show="total>0"
        :total="total"
        :pageSize.sync="params.pageSize"
        :page.sync="params.page"
        @pagination="changeSize"
      />-->
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        style="width: 255px; margin: 10px 20px; height: 38px"
      ></el-input>
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        :default-checked-keys="ids"
        node-key="id"
        ref="tree"
        height="300"
        highlight-current
        :filter-node-method="filterNode"
        :check-strictly="true"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button round size="mini" type="primary" @click="handleSelectionOk"
          >确 定</el-button
        >
        <el-button round size="mini" @click="handleClose1">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getOrgTree, getDelHos, getHosData, getAddHos } from "@/api/admin/user";
import { getIsTenant, getPamars } from "@/utils/auth";
export default {
  props: {
    dialogType: {
      type: String,
      default() {
        return "";
      }
    },
    hosNames: {
      type: Array,
      default() {
        return [];
      }
    },
    isShowBtn: {
      type: Boolean,
      default() {
        return true;
      }
    },
    isShowTip: {
      type: Boolean,
      default() {
        return true;
      }
    },
    userForm: {
      type: Object,
      default() {
        return {
          name: "",
          userNo: "",
          age: "",
          gender: "",
          hosId: "",
          workType: "",
          hosName: "",
          id: "",
          doctorProfessionalTitle: "",
          operationLevel: "",
          userIntrict: ""
        };
      }
    }
  },
  data() {
    return {
      isTenant: false,
      ids: [],
      hosVisible: false,
      labelPosition: "right",
      data: [],
      show: false,
      hosid: "",
      hos: [],
      hosData: [],
      data: [],
      hosSelect: [],
      total: 0,
      hosIds: [],
      hosId: "",
      selection: [],
      filterText: "",
      hosName: "",
      hosInfo: {},
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        userNo: [{ required: true, message: "请输入编码", trigger: "blur" }],
        workType: [{ required: true, message: "请选择员工类型" }],
        account: [{ required: true, message: "请输入账号" }]
      },
      defaultProps: {
        children: "children",
        label: "label",
        disabled: this.disabledFn
      }
    };
  },
  mounted() {
    // this.getHosData();
    this.isTenant = JSON.parse(getIsTenant()).isTenant;
    this.hosName = JSON.parse(getPamars()).hosName;
    this.hosId = JSON.parse(getPamars()).hosId;
  },
  methods: {
    // toggleSelect(index, row) {
    //   this.hosInfo = row;
    // },
    disabledFn(data, node) {
      if (data.exts.orgType == "_ORG_" || data.exts.orgType == "_TENANT_") {
        return true;
      }
      if (this.dialogType == "add") {
        let isTrues = false;
        this.hos.map(val => {
          if (val.id == data.id) {
            isTrues = true;
          }
        });
        if (isTrues) {
          return true;
        }
      } else {
        let isTrue = false;
        this.hosNames.map(val => {
          if (val.hosId == data.id) {
            isTrue = true;
          }
        });
        if (isTrue) {
          return true;
        }
      }
    },
    handleOk() {
      this.$refs["userForm"].validate(valid => {
        if (!valid) return;
        if (this.isTenant) {
          this.userForm.hoss = this.hosIds;
        } else {
          this.userForm.hoss = [this.hosId];
        }
        // console.log("userSubmit", this.userForm);

        // if (this.userForm["hoss"].length <= 0) {
        //   this.$message.error("请关联医院");
        //   return;
        // }

        this.$emit("userSubmit", this.userForm);
        // this.hosIds = [];
        // this.hos = [];
      });
    },
    handleClose() {
      this.show = false;
      this.$refs.userForm.resetFields();
      this.$emit("userClose");
      this.hos = [];
    },
    //查询所有医院
    queryOrgTree() {
      getOrgTree().then(res => {
        if (res.code === 1) {
          console.log("rse.data", res.data);
          this.data = res.data;
          this.data.map(val => {
            val.hosNm = val.label;
          });
          let datas = Array.from(new Set(this.hosIds));
          console.log("datas", datas);
        } else {
          this.$message({ message: "请求失败," + res.msg, type: "error" });
        }
      });
    },
    /*   checkChange(item, node, self) {
      console.log(item);
      this.id = item.id;
      if (node == true) {
        //点击未选中复选框
        this.userForm.hosId = item.id;
        // this.userForm.hosName = item.label
        this.$refs.tree.setCheckedKeys([item.id]);
      } else {
        if (this.userForm.hosId == item.id) {
          //点击已选中复选框，保证至少一个选中
          this.$refs.tree.setCheckedKeys([item.id]);
        }
      }
    },
    nodeClick(item, node, self) {
      this.userForm.hosId = item.id;
      // this.userForm.hosName = item.label;
      this.$refs.tree.setCheckedKeys([item.id]);
    },
    handleShowTree() {
      this.show = true;
      this.queryOrgTree();
    },*/
    // 关联医院按钮
    relevanceHos() {
      this.hosVisible = true;
      // 清空搜索条件
      this.filterText = "";
      this.queryOrgTree();
    },
    /*    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.dataTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.dataTable.clearSelection();
      }
    },
    */
    filterNode(value, data, node) {
      if (!value) {
        return true;
      }
      let _array = [];
      this.getReturnNode(node, _array, value);
      let result = false;
      _array.forEach(item => {
        result = result || item;
      });
      return result;
    },
    getReturnNode(node, _array, value) {
      let isPass =
        node.data && node.data.label && node.data.label.indexOf(value) !== -1;
      isPass ? _array.push(isPass) : "";
      this.index++;
      console.log(this.index);
      if (!isPass && node.level != 1 && node.parent) {
        this.getReturnNode(node.parent, _array, value);
      }
    },
    handleClick() {},
    handleSelectionOk() {
      this.hosSelect = [];
      this.hosIds = this.$refs.tree.getCheckedKeys();
      /*     this.selection.map(el => {
        this.hosSelect.push(el);
        this.hosSelect.map(val => {
          val.hosId = val.id;
        });
        this.hosIds.push(el.id);
      });*/
      if (this.dialogType == "add") {
        // if (Array.isArray(this.hosIds) && this.hosIds.length <= 0) {
        //   this.$message("医院不能为空");
        //   return;
        // }
      }
      this.addHos();
    },
    handlereset() {
      this.$emit("handleHosData");
    },
    // 添加addHos
    addHos() {
      this.hosVisible = false;
      if (this.dialogType == "add") {
        this.hos = this.$refs.tree.getCheckedNodes();
        this.hos.map(val => {
          val.hosNm = val.label;
        });
      } else {
        let arr = [];
        this.hosIds.map(val => {
          arr.push({
            userId: this.userForm.id,
            hosId: val
          });
        });
        getAddHos(arr).then(res => {
          if (res.code == 1) {
            this.$message("关联成功");
            this.$emit("handleHosData");
          } else {
            this.$message({
              message: "关联失败," + res.msg,
              type: "error"
            });
          }
        });
      }
    },
    handleClose1() {
      this.hosVisible = false;
    },
    handleDel(val) {
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = [];
          if (this.dialogType == "add") {
            this.hosIds = [];
            this.hos.map(el => {
              if (val.id != el.id) {
                arr.push(el);
                this.hosIds.push(el.id);
              }
            });
            this.hos = arr;
            this.$emit("addHos", this.hos);
          } else {
            //数据请求
            this.getDelHos({ hosId: val.hosId, userId: val.userId });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // changeSize(obj) {
    //   console.log("obj", obj);
    //   this.form = { ...this.form, ...obj };
    //   console.log("this.form ", this.form);
    // },
    getDelHos(data) {
      getDelHos(data).then(res => {
        if (res.code == 1) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.$emit("handleHosData", "dele");

          // this.getHosData();
        } else {
          this.$message({
            type: "error",
            message: "删除失败" + res.msg
          });
        }
      });
    },
    // 选中医院
    handleSelection(val) {
      this.selection = val;
    },
    getRowKeys(row) {
      return row.id;
    }
  },
  computed: {
    id() {
      return this.userForm.id;
    }
  },
  watch: {
    id() {
      // this.getHosData();
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    isShowTip(val) {
      if (!val) {
        this.$refs.userForm.resetFields();
        this.$emit("handleisShowTip");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
//设置按钮
.el-button--mini {
  border-radius: 0;
}
.el-row {
  margin-left: 20px !important;
  margin-right: 20px !important;
}

/deep/.el-input {
  margin-bottom: 7px;
  width: 255px;
}
/deep/.el-row {
  overflow-y: auto;
}
/deep/.el-dialog__body {
  height: 360px;
  overflow-y: auto;
  /deep/.el-input--medium {
    width: 300px;
  }
}
/deep/.el-dialog__body {
  padding: 20px;
}
/deep/.el-form-item__content {
  position: relative;
}
/deep/.el-form-item__error {
  position: absolute;
  // padding-top: 0;
  // padding-bottom: 4px;
}
.hos {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
}
/deep/.el-popover {
  position: relative;
}
</style>
