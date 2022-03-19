<template>
  <div class="app-container">
    <el-button type="primary" @click="handleRelevance">添加</el-button>
    <el-button type="primary" @click="handleQuery">查询</el-button>
    <el-table :data="tableData" style="width: 100%" height="410">
      <el-table-column prop="deptName" label="科室" align="center" width="300"></el-table-column>
      <el-table-column prop="roleName" label="角色" align="center"></el-table-column>
      <el-table-column label="功能总数" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.reses.length}}</span>
        </template>
      </el-table-column>
      <el-table-column label="功能" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            class="lookbtn"
            v-if="scope.row.reses.length"
            @click="checkInfo(scope.row)"
          >查看</el-button>
          <!-- <ul>
                        <li v-for="item in scope.row.reses" :key="item.resIds">{{item.resName}}</li>
                    </ul>
          -->
          <div v-else>无功能</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click.native.prevent="handleRemove(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="relevanceTotal>0"
      :total="relevanceTotal"
      :pageSize.sync="relevanceParams.pageSize"
      :page.sync="relevanceParams.pageNo"
      @pagination="handleChangeSize"
    />
    <el-dialog
      title="角色关联功能"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="60%"
      class="role"
      :close-on-click-modal="false"
    >
      <el-form :model="relevance" label-position="left" label-width="100px;" ref="relevance">
        <el-form-item label="部门" prop="name" v-if="deptShow">
          <el-input type="text" v-model="newDeptName" :disabled="deptShow"></el-input>
        </el-form-item>

        <el-form-item label="部门" prop="name" v-else>
          <el-select v-model="relevance.deptId" placeholder="请选择" multiple collapse-tags>
            <el-option :value="mineDept" style="height:300px;overflow-y:auto" disabled>
              <el-tree
                :data="data"
                :expand-on-click-node="false"
                show-checkbox
                node-key="id"
                ref="tree"
                highlight-current
                :props="defaultProps"
                :check-strictly="true"
                @check-change="handleCheckChange"
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="userNo">
          <el-select v-model="relevance.roleId" filterable :disabled="deptShow">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-table
          :data="resourceData"
          style="width:100%;padding: 0px;height:200px;overflow-y:auto"
          ref="resourceTable"
          height="200"
          @select-all="handleSelection"
          @select="handleSelection"
          :row-key="getRowKeys"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="100px"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column prop="code" label="资源编码" width="180"></el-table-column>
          <el-table-column prop="type" label="资源类型" width="180"></el-table-column>
          <el-table-column prop="name" label="资源名称" width="180"></el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :pageSize.sync="params.pageSize"
          :page.sync="params.page"
          @pagination="changeSize"
        />

        <div style="text-align:right;" class="footer">
          <el-button type="primary" size="mini" @click="handleOk">确认</el-button>
          <el-button type="primary" size="mini" @click="handleClose">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 查看功能弹出框 -->
    <el-dialog
      title="功能信息"
      :visible.sync="funVisible"
      width="50%"
      :before-close="handleClosed"
      class="functioninfo"
      :close-on-click-modal="false"
    >
      <div class="info">
        <b>{{dialogDeptName}}</b>的
        <b>{{dialogRoleName}}</b>的功能有:
      </div>
      <el-tag
        v-for="tag in reses"
        :key="tag.resIds"
        type="warning"
        size="medium"
        effect="dark"
      >{{tag.resName}}</el-tag>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="funVisible = false">确定</el-button>
        <el-button type="primary" @click="funVisible = false" style="margin-left:10px">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRoleList,
  getDeptList,
  getBizRes,
  addRoleRes,
  RoleResList,
  DelRoleRes,
  editRoleRes
} from "@/api/admin/role";
import { getResourceAll } from "@/api/admin/resource";
import { arrayToTree } from "@/utils";
export default {
  data() {
    return {
      reses: [],
      dialogDeptName: "",
      dialogRoleName: "",
      funVisible: false,
      tableData: [],
      relevance: {},
      dialogVisible: false,
      mineDept: [],
      defaultProps: {
        children: "children",
        label: "orgNm"
      },
      data: [],
      options: [],
      resourceData: [],
      resIds: [],
      params: {
        pageNo: 1,
        pageSize: 10,
        type: "biz"
      },
      total: 0,
      relevanceParams: {
        pageNo: 1,
        pageSize: 10
      },
      relevanceTotal: 0,
      newDeptId: null,
      newDeptName: "",
      deptShow: false,
      type: "add"
    };
  },
  mounted() {
    this.RoleResList();
  },
  methods: {
    DelRoleRes(params) {
      DelRoleRes(params).then(res => {
        if (res.code === 1) {
          this.$message("删除数据成功");
          this.RoleResList();
        } else {
          this.$message("删除数据失败");
        }
      });
    },

    RoleResList() {
      RoleResList(this.relevanceParams).then(res => {
        if (res.code === 1) {
          this.tableData = res.data;
          this.relevanceTotal = res.total;
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    checkInfo(val) {
      console.log(val);
      this.funVisible = true;
      this.reses = val.reses;
      this.dialogDeptName = val.deptName;
      this.dialogRoleName = val.roleName;
    },
    // 关闭弹窗
    handleClosed(done) {
      this.funVisible = false;
    },
    addRoleRes(parmas) {
      addRoleRes(parmas).then(res => {
        console.log(res);
        if (res.code === 1) {
          if (res.data == 0) {
            this.$message("无添加-更新记录");
          } else {
            this.$message("角色关联功能成功");
            this.RoleResList();
          }
        } else {
          this.$message("角色关联功能失败");
        }
        this.dialogVisible = false;
        this.resIds = [];
        this.mineDept = [];
        this.relevance = {};
        this.newDeptId = null;
        this.deptShow = false;
        this.type = "add";
        this.$refs.relevance.resetFields();
      });
    },
    editRoleRes(params) {
      editRoleRes(params).then(res => {
        console.log(res);
        if (res.code === 1) {
          this.$message("修改角色关联功能成功");
          this.RoleResList();
        } else {
          this.$message("修改角色关联功能失败");
        }
        this.dialogVisible = false;
        this.resIds = [];
        this.mineDept = [];
        this.relevance = {};
        this.newDeptId = null;
        this.deptShow = false;
        this.type = "add";
        this.$refs.relevance.resetFields();
      });
    },
    getResourceAll() {
      getBizRes(this.params).then(res => {
        if (res.code === 1) {
          for (let index of res.data) {
            index.checked = false;
          }
          this.resourceData = res.data;
          this.total = res.total;

          let datas = Array.from(new Set(this.resIds));
          if (this.resIds.length > 0) {
            datas.map(item => {
              this.resourceData.map((items, index) => {
                if (item === items.id) {
                  this.$nextTick(() => {
                    this.toggleSelection([this.resourceData[index]]);
                  });
                }
              });
            });
          }
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    getRoleList() {
      getRoleList().then(res => {
        if (res.code === 1) {
          this.options = res.data;
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    getDeptList() {
      getDeptList().then(res => {
        if (res.code === 1) {
          this.data = arrayToTree(res.data, "id", "parentId");
          console.log(this.data);
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.resourceTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.resourceTable.clearSelection();
      }
    },
    handleRelevance() {
      this.deptShow = false;
      this.dialogVisible = true;
      this.type = "add";
      this.getResourceAll();
      this.getDeptList();
      this.getRoleList();
    },
    handleClose() {
      this.dialogVisible = false;
      this.resIds = [];
      this.mineDept = [];
      this.relevance = {};
      this.newDeptId = null;
      this.deptShow = false;
      this.type = "add";
      this.$refs.relevance.resetFields();
    },
    handleOk() {
      this.$refs.relevance.validate(valid => {
        if (valid) {
          if (Array.isArray(this.resIds) && this.resIds.length > 0) {
            let deptId = null;
            if (this.newDeptId) {
              deptId = this.newDeptId;
            } else {
              deptId = this.mineDept[0].id;
            }
            let obj = {
              deptId: deptId,
              resIds: this.resIds,
              roleId: this.relevance.roleId
            };
            if (this.type === "add") {
              this.addRoleRes(obj);
            } else {
              this.editRoleRes(obj);
            }
          } else {
            this.$message("请选择功能");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCheckChange(data, checked, node) {
      if (checked === true) {
        this.$refs.tree.setCheckedNodes([data]);
      }
      let res = this.$refs.tree.getCheckedNodes(); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
      let arrLabel = [];
      let arr = [];

      res.forEach(item => {
        arrLabel.push(item.orgNm);
        arr.push(item);
      });
      this.mineDept = arr;
      this.relevance.deptId = arrLabel;
    },
    handleClick(data) {
      this.$refs.tree.setCheckedNodes([data]);
    },
    handleSelection(selection, row) {
      // console.log("selection,row", selection, row);
      // if (row) {
      //   if (this.resIds.indexOf(row.id) <= -1) {
      //     this.resIds.push(row.id);
      //   } else {
      //     this.resIds = [...this.resIds.filter(it => it !== row.id)];
      //   }
      // } else {
      this.resIds = [];
      selection.map(val => {
        this.resIds.push(val.id);
      });
      // }
      this.resIds = [...Array.from(new Set(this.resIds))];
    },
    getRowKeys(row) {
      return row.id;
    },
    changeSize(obj) {
      let val = {
        pageNo: obj.page,
        pageSize: obj.pageSize
      };
      this.params = { ...this.params, ...val };
      this.getResourceAll();
    },
    handleChangeSize(obj) {
      let val = {
        pageNo: obj.page,
        pageSize: obj.pageSize
      };
      this.relevanceParams = { ...this.relevanceParams, ...val };
      this.RoleResList();
    },
    handleEdit(row) {
      this.dialogVisible = true;
      this.type = "edit";
      this.getResourceAll();
      this.getDeptList();
      this.getRoleList();
      this.$nextTick(() => {
        this.newDeptId = row.deptId;
        this.newDeptName = row.deptName;
        this.deptShow = true;
        this.relevance = {
          deptId: row.deptId,
          roleId: row.roleId
        };

        const arr = [...row.reses];
        console.log(arr);
        for (let index of arr) {
          this.resIds.push(Number(index.resId));
        }
      });
    },
    handleRemove(row) {
      let obj = {
        deptId: row.deptId,
        roleId: row.roleId
      };
      this.$confirm("您是否要删除当前数据?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.DelRoleRes(obj);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleQuery() {
      let val = {
        pageNo: 1
      };
      this.params = { ...this.params, ...val };
      this.RoleResList();
    }
  },
  watch: {
    relevance: function(val) {
      console.log("============");
      console.log(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 20px;
  height: 100%;
  overflow: hidden;
  background-color: #ffffff;
}
.el-button--medium {
  margin: 0 0 15px 0px;
}
.el-form--label-left {
  margin: 20px;
}
.el-select {
  margin: 5px 0;
}
.el-form-item__label {
  height: 40px;
  line-height: 40px;
}
/deep/.el-dialog__body {
  padding: 0;
}

//设置按钮
.el-button {
  border-radius: 0;
}
/deep/.el-dialog__body {
  padding: 20px;
  .info {
    height: 30px;
    line-height: 30px;
    margin-bottom: 5px;
  }
  // 设置标签
  .el-tag {
    margin: 8px 5px 8px 10px;
    background-color: #ff6a00;
    font-size: 14px;
    padding: 0 12px;
    height: 30px;
    line-height: 30px;
  }
}
//查看按钮
.el-button--mini {
  height: 30px;
  font-size: 14px;
  padding: 0px 12px;
}

.footer {
  padding: 0;
}
/deep/.el-dialog {
  .el-button--mini {
    height: 36px;
    font-size: 14px;
    padding: 5px 20px;
  }
  .el-form-item {
    .el-input {
      width: 300px;
    }
  }
}
/deep/.el-dialog__footer {
  padding: 20px 20px 10px;
}
.functioninfo {
  /deep/.el-dialog__body {
    height: 340px;
    overflow-y: auto;
  }
}
.role {
  /deep/.el-tag {
    background-color: #fff;
    font-size: 14px;
    padding: 0 12px;
    height: 30px;
    line-height: 30px;
  }
  .el-form--label-left {
    margin: 0 10px 5px;
  }
  .pagination-container {
    padding: 20px 15px;
  }
  /deep/.el-pagination {
    text-align: left;
  }
}
/deep/.el-pagination {
  text-align: right;
}
/deep/.el-pagination {
  /deep/.el-input__inner {
    height: 28px !important;
  }
}
</style>
