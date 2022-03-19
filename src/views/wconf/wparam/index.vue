<template>
  <div class="container">
    <el-button type="primary" @click="handleClick()" size="mini" round>添加类型</el-button>

    <el-table
      ref="table"
      :data="tableData"
      row-key="id"
      style="width: 100%;margin-top:20px;height: 100%;max-height:100%;overflow-y:auto"
      border
      height="100%"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChild'}"
    >
      >
      <el-table-column prop="exts.paramName" label="类型名" width="180"></el-table-column>
      <el-table-column prop="exts.paramValue" label="类型值" width="180"></el-table-column>

      <el-table-column prop="exts.paramDesc" label="类型描述"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="handleCh(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.exts.required !=='1'&&scope.row.parentId"
          >改变父级</el-button>
          <el-button
            @click.native.prevent="handleClick(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.exts.required !=='1'"
            :style="!scope.row.parentId?'margin-left:65px':''"
          >添加下一级</el-button>
          <el-button
            @click.native.prevent="handleEdit(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.exts.required !=='1'"
          >编辑</el-button>

          <el-button
            @click.native.prevent="handleRemove(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.exts.required !=='1'"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 可以拆成组件 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑类型':'新建类型'"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="type"
        label-width="80px"
        label-position="right"
        ref="type"
        :rules="rules"
        style="height:310px;overflow-y:auto;"
      >
        <el-form-item label="父类型" prop="paramType" v-if="showParent">
          <el-input v-model="type.paramType" placeholder="请输入类型名" :disabled="extsDisabled" />
        </el-form-item>
        <el-form-item label="类型名称" prop="paramName">
          <el-input v-model="type.paramName" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="类型值" prop="paramValue">
          <el-input v-model="type.paramValue" placeholder="请输入类型值" />
        </el-form-item>

        <el-form-item label="描述" prop="paramDesc">
          <el-input
            v-model="type.paramDesc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入参数描述"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round size="mini" @click="handleOk">确认</el-button>
        <el-button type="primary" round size="mini" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="changeVisible"
      title="改变父级"
      :before-close="handleClose1"
      class="changefa"
      :close-on-click-modal="false"
    >
      <el-form
        :model="chType"
        label-width="100px"
        label-position="left"
        ref="chType"
        :rules="rules"
        style="height:300px;overflow-y:auto;"
      >
        <el-form-item label="父级类型值" prop="paramType">
          <el-input v-model="chType.paramValue" placeholder="请输入父级名称" />
        </el-form-item>
        <span>如果父级名称为空则为顶级</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round size="mini" @click="handleOk1">确认</el-button>
        <el-button type="primary" round size="mini" @click="handleClose1">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTypeTree,
  addTypeTree,
  putTypeTree,
  deleteTypeTree,
  getParamsTree,
  getTypeTreeId,
  putParent,
} from "@/api/wconf/wparam";

export default {
  data() {
    return {
      dialogVisible: false,
      changeVisible: false,
      visible: false,
      dialogType: "add",
      type: {},
      tableData: [],
      parentId: null,
      extsDisabled: false,
      expand: true,
      rules: {
        paramName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        paramValue: [{ required: true, message: "请输入值", trigger: "blur" }],
      },
      id: -1,
      maps: new Map(),
      chType: {
        paramValue: null,
      },
      chObj: {},
      showParent: false,
      paramType: "",
    };
  },
  mounted() {
    this.getTree();
  },
  methods: {
    getTree() {
      let obj = {
        id: -1,
      };
      getParamsTree(obj).then((res) => {
        if (res.code === 1) {
          this.tableData = res.data;
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    getTreeId(id) {
      getTypeTreeId({ id: id }).then((res) => {
        const { hasChild } = res.data;
        let getId = null;
        if (hasChild === "1") {
          getId = res.data.id;
        } else {
          getId = res.data.parentId;
        }
        if (this.maps.has(getId)) {
          const { tree, treeNode, resolve } = this.maps.get(getId);
          this.load(tree, treeNode, resolve);
        }
      });
    },
    getTreeNew(id) {
      if (!id) {
        id = -1;
      }

      let obj = {
        id: -1,
      };
      getParamsTree(obj).then((res) => {
        if (res.code === 1) {
          this.tableData = res.data;
          this.getTreeId(id);
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    addTree(params) {
      let id = null;
      if (params.parentId) {
        id = params.parentId;
      } else {
        id = -1;
      }
      if (id !== -1) {
        getTypeTreeId({ id: id }).then((res) => {
          const { hasChild } = res.data;
          let getId = null;
          if (hasChild === "1") {
            getId = res.data.id;
          } else {
            getId = res.data.parentId;
          }
          addTypeTree(params).then((res) => {
            if (res.code === 1) {
              this.$message("添加类型成功");
              let obj = {
                id: -1,
              };
              getParamsTree(obj).then((res) => {
                if (res.code === 1) {
                  this.tableData = res.data;
                  if (this.maps.has(getId)) {
                    const { tree, treeNode, resolve } = this.maps.get(getId);
                    this.load(tree, treeNode, resolve);
                  }
                } else {
                  this.$message("获取数据失败");
                }
              });
            } else {
              this.$message("添加类型失败-" + res.msg);
            }
            this.$refs["type"].resetFields();
            this.dialogVisible = false;
            this.type = {};
          });
        });
      } else {
        addTypeTree(params).then((res) => {
          if (res.code === 1) {
            this.$message("添加类型成功");
            let obj = {
              id: -1,
            };
            getParamsTree(obj).then((res) => {
              if (res.code === 1) {
                this.tableData = res.data;
                if (this.maps.has(id)) {
                  const { tree, treeNode, resolve } = this.maps.get(id);
                  this.load(tree, treeNode, resolve);
                }
              } else {
                this.$message("获取数据失败");
              }
            });
          } else {
            this.$message("添加类型失败-" + res.msg);
          }
          this.$refs["type"].resetFields();
          this.dialogVisible = false;
          this.type = {};
        });
      }
    },
    editTree(params) {
      putTypeTree(params).then((res) => {
        if (res.code === 1) {
          this.$message("修改类型成功");
          this.getTreeNew(params.id);
        } else {
          this.$message("修改类型失败-" + res.msg);
        }
        this.$refs["type"].resetFields();
        this.dialogVisible = false;
        this.type = {};
      });
    },
    deleteTree(data) {
      getTypeTreeId(data).then((res) => {
        const id = res.data.parentId;
        deleteTypeTree(data).then((res) => {
          if (res.code === 1) {
            this.$message("删除类型成功");
            let obj = {
              id: -1,
            };
            getParamsTree(obj).then((res) => {
              if (res.code === 1) {
                this.tableData = res.data;
                this.$nextTick(() => {
                  if (this.maps.has(id)) {
                    const { tree, treeNode, resolve } = this.maps.get(id);
                    this.loadDel(tree, treeNode, resolve);
                  }
                });
              } else {
                this.$message("获取数据失败");
              }
            });
          } else {
            this.$message("删除类型成功");
          }
        });
      });
    },
    handleClick(item) {
      this.type = {};
      this.dialogVisible = true;
      this.dialogType = "add";

      if (item) {
        this.paramType = item.exts.paramValue;
        this.parentId = item.id;
        this.extsDisabled = true;
        this.$set(this.type, "paramType", item.exts.paramName);
        this.showParent = true;
      } else {
        this.extsDisabled = false;
        this.parentId = null;
        this.showParent = false;
      }
    },
    handleOk() {
      this.$refs["type"].validate((valid) => {
        if (!valid) return;
        if (this.type.hasOwnProperty("id")) {
          this.editTree(this.type);
        } else {
          if (this.parentId) {
            this.addTree({
              ...{ parentId: this.parentId },
              ...this.type,
              ...{ paramType: this.paramType },
            });
          } else {
            this.addTree(this.type);
          }
        }
      });
    },
    handleEdit(row) {
      if (row.hasOwnProperty("parentId")) {
        this.extsDisabled = true;
        this.showParent = true;
      } else {
        this.extsDisabled = false;
        this.showParent = false;
      }
      this.dialogVisible = true;
      this.dialogType = "edit";
      this.type = { ...{ id: row.id }, ...row.exts };
    },
    handleClose() {
      this.dialogVisible = false;
      this.type = {};
      this.$refs.type.resetFields();
    },
    handleRemove(row) {
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteTree({ id: row.id });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    load(tree, treeNode, resolve) {
      let id = tree.id;
      this.maps.set(id, { tree, treeNode, resolve });
      getParamsTree({ id: id }).then((res) => {
        resolve(res.data);
      });
    },
    loadDel(tree, treeNode, resolve) {
      let id = tree.id;
      this.maps.set(id, { tree, treeNode, resolve });
      getParamsTree({ id: id }).then((res) => {
        this.$set(this.$refs.table.store.states.lazyTreeNodeMap, id, []);
        resolve(res.data);
      });
    },
    handleCh(row) {
      this.chObj = row;
      this.changeVisible = true;
    },
    handleOk1() {
      this.$refs["chType"].validate((valid) => {
        if (!valid) return;
        if (this.chType.paramValue == this.chObj.exts.paramValue) {
          this.$message({ type: "error", message: "不可修改父级为自己" });
          return;
        }
        this.putParent();
      });
    },
    handleClose1() {
      this.changeVisible = false;
      this.chType = { paramValue: null };
      this.chObj = {};
      this.$refs.chType.resetFields();
    },
    putParent() {
      if (this.chObj.hasOwnProperty("parentId")) {
        let obj = { ...this.chType, ...{ id: this.chObj.id } };
        putParent(obj).then((res) => {
          if (res.code === 1) {
            this.$message("修改父级成功");
            if (res.hasOwnProperty("data")) {
              if (this.maps.has(res.data)) {
                const { tree, treeNode, resolve } = this.maps.get(res.data);
                this.load(tree, treeNode, resolve);
              }
            }
            if (this.maps.has(this.chObj.parentId)) {
              const { tree, treeNode, resolve } = this.maps.get(
                this.chObj.parentId
              );
              this.loadDel(tree, treeNode, resolve);
            }
            this.$nextTick(() => {
              this.getTree();
            });
            this.chObj = {};
            this.chType = { paramValue: null };
            this.changeVisible = false;
            this.$refs["chType"].resetFields();
          } else {
            this.$message("修改父级失败-" + res.msg);
          }
        });
      } else {
        let obj = { ...this.chType, ...{ id: this.chObj.id } };
        putParent(obj).then((res) => {
          if (res.code === 1) {
            this.$message("修改父级成功");
            if (res.hasOwnProperty("data")) {
              if (this.maps.has(res.data)) {
                const { tree, treeNode, resolve } = this.maps.get(res.data);
                this.load(tree, treeNode, resolve);
              }
            }
            if (this.maps.has(this.chObj.id)) {
              const { tree, treeNode, resolve } = this.maps.get(
                this.chObj.parentId
              );
              this.loadDel(tree, treeNode, resolve);
            }
            this.$nextTick(() => {
              this.getTree();
            });
            this.chObj = {};
            this.chType = { paramValue: null };
            this.changeVisible = false;
            this.$refs["chType"].resetFields();
          } else {
            this.$message("修改父级失败-" + res.msg);
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  background-color: #ffffff;
  overflow: hidden;
  height: 100%;
}
/deep/.el-dialog__body {
  padding: 20px;
}
//设置按钮
.el-button--mini {
  border-radius: 0;
}

.el-input {
  padding: 7px 0;
}
/deep/.el-form-item__error {
  position: static !important;
}
/deep/.el-textarea__inner {
  width: 300px;
}
/deep/.el-input__inner {
  width: 300px;
}

.changefa {
  /deep/.el-form-item__label {
    margin-top: 5px;
  }
  .el-form-item {
    margin-bottom: 14px;
  }
}
</style>
