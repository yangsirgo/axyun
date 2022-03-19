
<template>
  <div class="container">
    <div class="topAtea">
      <div class="selectType">
        <el-select v-model="params.type" placeholder="请选择类型" @change="queryHandle" style="margin-right:16px;">
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="item in selectOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>编码:
        <el-input style="width: 180px;margin-right:16px;" v-model="params.code" v-on:keyup.enter.native="queryHandle" />名称:
        <el-input style="width: 180px;margin-right:16px;" v-model="params.name" v-on:keyup.enter.native="queryHandle" />
      </div>
      <div class="header-button">
        <el-button type="primary" @click="handleAdd">添加资源</el-button>
        <el-button type="primary" @click="handleRemove">删除</el-button>
      </div>
    </div>

    <!-- <div class="textRight">
             <el-button type="primary" size="mini" @click="handleAll">批量关联权限</el-button>
    </div>-->

    <el-table
      :data="tableData"
      style="width: 100%;overflow-y: auto;flex:1;"
      ref="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="150px" header-align="center" align="center"></el-table-column>
      <el-table-column prop="code" label="资源编码" width="240"></el-table-column>
      <el-table-column prop="type" label="资源类型" width="240"></el-table-column>
      <el-table-column prop="name" label="资源名称" width="240"></el-table-column>
      <el-table-column prop="uri" label="资源地址" width="240"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click.native.prevent="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click.native.prevent="handleClick(scope.row)" type="text" size="small">关联权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <pagination
        v-show="total>0"
        :total="total"
        :pageSize.sync="params.pageSize"
        :page.sync="params.pageNo"
        @pagination="changeSize"
      />
    </div>

    <el-dialog :visible.sync="dialogVisible" title="资源关联权限" :before-close="handleClose">
      <div class="treeBox" style="height:360px;overflow-y:auto">
        <el-tree
          :expand-on-click-node="false"
          show-checkbox
          :data="menuTree"
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :check-strictly="true"
          :default-checked-keys="resIds"
          :props="defaultProps"
        ></el-tree>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round size="mini" @click="handleOk">确认</el-button>
        <el-button type="primary" round size="mini" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible1"
      :title="dialogType==='edit'?'编辑资源':'新建资源'"
      :before-close="handleClose1"
    >
      <el-form
        :model="resource"
        label-width="100px"
        label-position="right"
        ref="rform"
        :rules="rules"
        style="height:360px;overflow-y:auto"
      >
        <el-form-item label="资源编码" prop="code">
          <el-input v-model="resource.code" placeholder="请输入资源编码" style="width:360px;" />
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-select v-model="resource.type" placeholder="请选择类型">
            <el-option
              v-for="item in selectOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="resource.name" placeholder="请输入资源名称" style="width:360px;" />
        </el-form-item>
        <el-form-item label="资源地址" prop="uri">
          <el-input v-model="resource.uri" placeholder="请输入资源名称" style="width:360px;" />
        </el-form-item>
        <!-- <el-form-item label="关联子项目" prop="uri">
          <el-select v-model="resource.uri" placeholder="请选择关联子项目">
            <el-option value="子项目1" label="子项目1"></el-option>
            <el-option value="子项目2" label="子项目2"></el-option>
            <el-option value="子项目3" label="子项目3"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="mini" type="primary" @click="handleOk1">确 定</el-button>
        <el-button round size="mini" @click="handleClose1">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getResourceAll,
  addRes,
  addResNew,
  getResRouter,
  addResource,
  editResource,
  removeResource,
} from "@/api/admin/resource";
import { getMenuTree } from "@/api/admin/menu";
export default {
  data() {
    return {
      params: {
        code: "",
        name: "",
        pageNo: 1,
        pageSize: 10,
        orderBy: "created_at desc",
        type: null,
      },
      all: "alone",
      total: 0,
      tableData: [],
      dialogVisible: false,
      dialogVisible1: false,
      dialogType: "add",
      menuTree: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      resIds: [],
      authId: "",
      id: "",
      selectOptions: [],
      resource: {},

      rules: {
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        type: [{ required: true, message: "请输入类型", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }], //,
        // uri : [{required: true, message: '请输入地址', trigger: 'blur'}]
      },
    };
  },
  mounted() {
    this.getResourceAll();
    this.getResourceType();
  },
  methods: {
    getResourceAll() {
      getResourceAll(this.params).then((res) => {
        if (res.code === 1) {
          this.tableData = res.data;
          this.total = res.total;
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    getResR() {
      getResRouter({ authId: this.authId }).then((res) => {
        let arr = [];
        if (res.code === 1) {
          for (let index of res.data) {
            arr.push(index.id);
            this.resIds = [...arr];
          }
          console.log(this.resIds);
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    getMenuTree() {
      getMenuTree().then((res) => {
        if (res.code === 1) {
          this.menuTree = res.data;
          this.getResR();
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    addRes(obj) {
      addResNew(obj).then((res) => {
        if (res.code === 1) {
          this.$message("添加资源成功");
        } else {
          this.$message("添加资源失败");
        }
        this.id = "";
        this.resIds = [];
        this.dialogVisible = false;
        this.toggleSelection();
      });
    },

    handleClick(row) {
      this.authId = row.id;
      this.getMenuTree();
      this.dialogVisible = true;
      this.all = "alone";
    },

    changeSize(obj) {
      let val = {
        pageNo: obj.page,
      };
      this.params = { ...this.params, ...val };
      this.getResourceAll();
    },

    handleOk() {
      const tree = this.$refs.tree.getCheckedNodes();
      console.log(tree);
      let arr = [];
      for (let index of tree) {
        arr.push(index.id);
      }
      let obj = {
        resId: this.authId,
        authIds: arr,
      };
      this.addRes(obj);
    },

    handleSelectionChange(val) {
      let arr = [];
      for (let index of val) {
        arr.push(index.id);
      }
      this.resIds = [...arr];
    },

    handleAll() {
      if (this.resIds.length === 0) {
        this.$message("请您先选中节点");
        return;
      }
      this.getMenuTree();
      this.dialogVisible = true;
      this.all = "all";
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }

      this.$refs.tree.setCheckedKeys([]);
    },

    handleClose() {
      let arr = [];
      this.resIds = [...arr];
      this.resource = {};
      this.dialogVisible = false;
    },

    handleAdd() {
      this.dialogVisible1 = true;
      this.dialogType = "add";
    },

    handleRemove() {
      if (this.resIds.length <= 0) {
        this.$alert("请正确选择需要操作的记录！", "警告", {
          confirmButtonText: "确定",
        });
        return;
      }

      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delResource();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    handleClose1() {
      this.dialogVisible1 = false;
      this.resource = {};
      this.$refs["rform"].resetFields();
    },

    handleOk1() {
      this.$refs["rform"].validate((valid) => {
        if (!valid) return;
        if (!this.resource.id) {
          this.handleAddResource();
        } else {
          this.handleEditResource();
        }
      });
    },

    getResourceType() {
      this.selectOptions = [
        {
          //  id: "1",
          value: "router",
          label: "router",
        },
        {
          //  id: "2",
          value: "button",
          label: "button",
        },
        {
          //  id: "5",
          value: "biz",
          label: "biz",
        },
        /*   {
            //  id: "3",
            value: "data",
            label: "data"
          },
          {
            //  id: "4",
            value: "table",
            label: "table"
          },
          {
            //  id: "5",
            value: "tree",
            label: "tree"
          }*/
      ];
    },

    handleAddResource() {
      addResource(this.resource).then((res) => {
        if (res.code === 1) {
          this.$message({
            message: "数据添加成功",
            type: "success",
          });
          this.getResourceAll();
          // this.getResource(this.selectOrg.selectId[0])
        } else {
          this.$message({
            message: res.msg || "数据添加失败",
            type: "error",
          });
        }
        this.dialogVisible1 = false;
        this.$refs.rform.resetFields();
        this.resource = {};
      });
    },

    handleEditResource() {
      editResource(this.resource).then((res) => {
        if (res.code === 1) {
          this.$message({
            message: "数据修改成功",
            type: "success",
          });
          this.getResourceAll();
          // this.getResource(this.selectOrg.selectId[0])
        } else {
          this.$message({
            message: "数据修改失败",
            type: "error",
          });
        }
        this.dialogVisible1 = false;
        this.$refs.rform.resetFields();
        this.resource = {};
      });
    },

    handleEdit(row) {
      console.log(row);
      this.dialogVisible1 = true;
      this.dialogType = "edit";
      this.resource = { ...row };
    },

    handleDelete(row) {
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.handleRemoveResource(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    handleRemoveResource(row) {
      let arr = [];
      arr.push(row.id);
      this.resIds = [...arr];
      this.delResource();
    },

    delResource() {
      removeResource(this.resIds).then((res) => {
        if (res.code === 1) {
          this.getResourceAll();
          this.$message("删除数据成功");
        } else {
          this.$message("删除数据失败");
        }
      });
    },

    queryHandle(item) {
      this.params.pageNo = 1;
      this.getResourceAll();
    },
  },
};
</script>
<style lang="scss" scoped>
.textRight {
  text-align: right;
}
//设置按钮
.el-button--mini {
  border-radius: 0;
}
.el-message-box__btns .el-button--small {
  border-radius: 0px !important;
}
.treeBox {
  height: 400px;
  overflow: hidden;
  overflow-y: auto;
}
.container {
  background-color: #ffffff;
  overflow: hidden;
  height: 100%;
  padding: 16px;
  display:flex;
  flex-direction: column;
  .topAtea {
    display: flex;
    margin-bottom:16px;
    .selectType {
      flex:1;
    }
    .header-button {
      width: 200px;
      text-align: right;
    }
  }
  .page{
    margin-top:16px;
  }
}

// 添加弹出框
.el-form {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 10px;
}

.el-input {
  padding: 0;
}
.el-tree {
  padding-left: 30px;
}

/deep/.el-form-item__error {
  position: static !important;
}
/deep/.el-textarea__inner {
  width: 300px;
}
// /deep/.el-input__inner{
//     width: 300px;

// }
/deep/.el-dialog__body {
  .el-input__inner {
    width: 300px;
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
/deep/.pagination-container{
  margin:0;
}
</style>

