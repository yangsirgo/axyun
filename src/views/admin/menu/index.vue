
<template>
  <div class="app-container" ref="page">
    <el-row :gutter="20" style="height:100%">
      <el-col :span="9" style="padding-right:0;height:100%;">
        <div class="tree_box" style="height:100%;padding-bottom: 20px;padding-top: 20px;">
          <el-button
            type="primary"
            size="mini"
            style="float:right;width:126px;margin-bottom:10px;margin-right:15px"
            @click="handleAdd"
          >添加一级菜单</el-button>
          <div style="display:flex;width:100%;border:1px solid #eee;">
            <div style="flex:1;height:30px;line-height:30px;padding-left:20px">菜单名称</div>
            <div
              style="flex:1;height:30px;line-height:30px;padding-left:80px;text-align:right;margin-right:5%"
            >菜单序号</div>
          </div>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          <el-tree
            :expand-on-click-node="false"
            :data="data"
            default-expand-all
            node-key="id"
            ref="tree"
            @node-click="handleChange"
            highlight-current
            :filter-node-method="filterNode"
            :props="defaultProps"
            class="tree-list"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }" style="width:100%">
              <span>{{ node.label }}</span>
              <span class="custom_span">
                <!-- <el-button
                  type="primary"
                  size="mini"
                  @click="handleMenuNext(data)"
                >添加下一级</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  v-if="selectData.id"
                  @click="handleMenuEdit(data)"
                >
                  编
                  <span style="padding:15px"></span>辑
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  v-if="selectData.id"
                  @click="handleMenuRemove(data)"
                >
                  删
                  <span style="padding:15px"></span>除
                </el-button>-->
                <el-button type="text" size="mini" @click="() => handleMenuNext(data)">添加下一级</el-button>
                <el-button type="text" size="mini" @click="() => handleMenuRemove(data)">删 除</el-button>
                <el-button type="text" size="mini" @click="() => handleMenuEdit(data)">编 辑</el-button>
              </span>

              <div style="float:right;margin-right:8%">{{data.exts.orderNum}}</div>
            </div>
          </el-tree>
        </div>
      </el-col>
      <!-- 右侧盒子 -->
      <el-col :span="15" style="padding-left:0;height:100%;">
        <div class="table_box">
          <el-card shadow="hover" style="margin-bottom:15px;padding:20px">
            <!-- <el-button
              type="primary"
              size="mini"
              style="float:right;width:126px"
              @click="handleAdd"
            >添加顶级菜单</el-button>-->
            <!-- <el-button
              style="float:right;width:126px;margin-right:20px;"
              type="primary"
              size="mini"
              v-if="selectData.id"
              @click="handleMenuNext(selectData)"
            >添加下一级</el-button>-->
            <el-button
              style="float:right;margin-right:20px;width:126px"
              type="primary"
              size="mini"
              v-if="selectData.id"
              @click="handleRelevance(selectData)"
            >关联资源</el-button>
            <!-- <el-button
              style="float:right;margin-right:20px;width:126px;"
              type="primary"
              size="mini"
              v-if="selectData.id"
              @click="handleMenuEdit(selectData)"
            >
              编
              <span style="padding:15px"></span>辑
            </el-button>
            <el-button
              style="float:right;margin-right:20px;width:126px;"
              type="primary"
              size="mini"
              v-if="selectData.id"
              @click="handleMenuRemove(selectData)"
            >
              删
              <span style="padding:15px"></span>除
            </el-button>-->

            <div style="padding:0 20px;height:50px;line-height:50px;">
              <span class="title">菜单名称 :</span>
              <span v-if="selectData.id">{{selectData.label}}</span>
            </div>
            <div style="padding:0 20px;height:50px;line-height:50px;">
              <span class="title">菜单图标 :</span>
              <span v-if="selectData.id">{{selectData.exts.icon}}</span>
            </div>
            <div style="padding:0 20px;height:50px;line-height:50px;">
              <span class="title">菜单排序 :</span>
              <span v-if="selectData.id">{{selectData.exts.orderNum}}</span>
            </div>
            <div style="padding:0 20px;height:50px;line-height:50px;">
              <span class="title">菜单描述 :</span>
              <span v-if="selectData.id">{{selectData.exts.description}}</span>
            </div>
          </el-card>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            border
          >
            <!--   @selection-change="handleSelectionChange"  -->

            <!--<el-table-column type="selection" width="60"></el-table-column>-->
            <el-table-column label="资源编码" width="270">
              <template slot-scope="scope">{{ scope.row.code }}</template>
            </el-table-column>
            <el-table-column prop="type" label="资源类型" width="200"></el-table-column>
            <el-table-column prop="name" label="资源名称"></el-table-column>
            <el-table-column prop="uri" label="资源地址" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <!-- <el-button @click.native.prevent="handleEdit(scope.row)" type="text" size="small">修改</el-button> -->
                <el-button
                  @click.native.prevent="handleDelet(scope.row)"
                  type="text"
                  size="small"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 关联权限 -->
    <el-dialog
      :visible.sync="resourceVisible"
      title="关联资源"
      :before-close="handleClose1"
      width="1000px"
      class="resource"
    >
      <el-select v-model="params.type" placeholder="请选择类型" @change="queryHandle">
        <el-option label="请选择" value></el-option>
        <el-option
          v-for="item in selectOptions"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>编码:
      <el-input style="width: 180px" v-model="params.code" v-on:keyup.enter.native="queryHandle" />名称:
      <el-input style="width: 180px" v-model="params.name" v-on:keyup.enter.native="queryHandle" />
      <el-table
        :data="resourceData"
        style="width:97%;padding-left:30px;height:300px;overflow-y:auto"
        ref="resourceTable"
        height="300"
        @select-all="handleSelection"
        @select="handleSelection"
        :row-key="getRowKeys"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="100px" header-align="center" align="center"></el-table-column>
        <el-table-column prop="code" label="资源编码" width="180"></el-table-column>
        <el-table-column prop="type" label="资源类型" width="180"></el-table-column>
        <el-table-column prop="name" label="资源名称" width="180"></el-table-column>
        <el-table-column prop="uri" label="资源地址"></el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :pageSize.sync="params.pageSize"
        :page.sync="params.page"
        @pagination="changeSize"
      />

      <div slot="footer" class="dialog-footer">
        <el-button round size="mini" type="primary" @click="handleSelectionOk">确 定</el-button>
        <el-button round size="mini" @click="handleClose1">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加菜单编辑菜单 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑菜单':'新建菜单'"
      :before-close="handleClose"
      class="menuSelect"
    >
      <el-form
        :model="menu"
        label-width="120px"
        label-position="right"
        ref="menu"
        :rules="rules"
        style="height:360px;overflow:auto"
      >
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="menu.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="menu.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="menu.type" placeholder="请选择菜单类型">
            <el-option label="默认" value="wauth"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示流程" prop="isFlow">
          <el-radio-group v-model="menu.isFlow">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单级别" prop="level" v-if="show">
          <el-input
            v-model="menu.level"
            controls-position="right"
            :min="1"
            :max="10"
            disabled
            class="level"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单排序" prop="orderNum">
          <el-input
            v-model="menu.orderNum"
            controls-position="right"
            :min="1"
            :max="1000"
            class="level"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单描述" prop="description">
          <el-input type="textarea" placeholder="请添加菜单描述" v-model="menu.description"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round size="mini" @click="handleOk">确认</el-button>
        <el-button type="primary" round size="mini" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getReses,
  addResNew,
  delRes,
  editResource,
  getResourceAll,
  addAuthRes,
  removeAuthor
} from "@/api/admin/resource";
import { getMenuTree, addMenu, updMenu, delMenuSub } from "@/api/admin/menu";
export default {
  data() {
    return {
      data: [],
      filterText: "",
      selectData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectOrg: {
        selectId: []
      },
      show: false,
      dropNode: {},
      menu: {
        enabled: "1",
        initHidden: "1",
        isFlow: "0",
        level: "1"
      },
      dialogType: "add",
      tableData: [],
      selection: [],
      dialogVisible: false,
      resourceVisible: false,
      resource: {},
      id: "",
      selectOptions: [],
      resourceData: [],
      total: 0,
      params: {
        code: "",
        name: "",
        pageNo: 1,
        pageSize: 10,
        orderBy: "created_at desc",
        type: null
      },
      resIds: [],
      authId: "",
      resId: "",
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
        orderNum: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (/^\+?[1-9]\d*$/.test(value) == false) {
                  callback(new Error("请填写大于0的数字"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.getMenuTree();
    this.getResourceType();
  },
  methods: {
    // handleDelet(row) {
    //   console.log("row", row);
    //   console.log("object", { authId: row.aid, resId: row.rid });
    //   this.removeAuthor({ authId: row.aid, resId: row.rid });
    // },
    // removeAuthor(obj) {
    //   console.log("obj", obj);
    //   removeAuthor(obj)
    //     .then(res => {
    //       if (res.code === 1) {
    //         this.$message("删除资源成功");
    //         this.getResource(this.authId);
    //       } else {
    //         this.$message({message:"删除资源失败,"+res.msg,type:'error'});
    //       }
    //     })
    //     .catch(res => {
    //       // this.$message.error("删除失败" + res.msg);
    //     });
    //   this.resourceVisible = false;
    //   this.resIds = [];
    //   this.$refs.resourceTable.clearSelection();
    // },
    getMenuTree() {
      getMenuTree().then(response => {
        const menuTree = response.data;
        this.data = menuTree;
        console.log("this.data", this.data);
      });
    },
    //拖拽
    /*    allowDrop(draggingNode, dropNode, type) {
      // 只能移动到内部
       return type == "inner";
    },
    allowDrag(draggingNode) {
      //顶级菜单不可移动
      console.log('draggingNode', draggingNode)
      
      return draggingNode.data.exts.level != 1;
    },
    handleDragStart(node, ev) {
      this.from = node;
    },
    handleDragOver(node, ev) {
     this.dropNode=node
    },
    handleDragEnd(node, ev){
      return ;
 
    },
      handleDrop(draggingNode, dropNode, dropType, ev) {
    this.onTreeDataChange(this.from, dropNode);
    },


    onTreeDataChange(from, to) {
      const fromLabel = from.label;
      const tolabel = to.label;
      this.$confirm(
        `您是否要把 ${fromLabel}菜单 拖拽到 ${tolabel} 菜单下`,
        "提示",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let obj = {
            id: from.id,
            parentId: to.id
          };
          this.dragUpdMenu(obj);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消拖拽菜单"
          });
        });
    },
    dragUpdMenu(obj) {
      updMenu(obj).then(res => {
        if (res.code === 1) {
          this.getMenuTree();
          this.$message("拖拽菜单成功");
        } else {
          this.$message("拖拽菜单失败");
        }
      });
    },
    */
    // 关联资源界面所有资源信息
    getResourceAll() {
      getResourceAll(this.params).then(res => {
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
          this.$message({message:"获取数据失败,"+res.msg,type:'error'});
        }
      });
    },
    addAuthRes() {
      let obj = {
        authId: this.authId,
        resIds: this.resIds
      };
      addAuthRes(obj)
        .then(res => {
          if (res.code === 1) {
            this.$message("添加资源成功");

            console.log("obj.authId", obj.authId);
            this.getResource(obj.authId);
          } else {
            this.$message({message:"添加资源失败,"+res.msg,type:'error'});
          }
        })
        .catch(res => {
          console.log("res", res);
          // this.$message.error("添加失败," + res.msg);
        });
      this.resourceVisible = false;
      //   this.authId = "";
      this.resIds = [];
      this.$refs.resourceTable.clearSelection();
    },
    //删除关联资源
    handleDelet(row) {
      console.log("row", row);
      console.log("object", { authId: row.aid, resId: row.rid });
      this.removeAuthor({ authId: row.aid, resId: row.rid });
    },
    removeAuthor(obj) {
      console.log("obj", obj);
      removeAuthor(obj)
        .then(res => {
          if (res.code === 1) {
            this.$message("删除资源成功");
            this.getResource(this.authId);
          } else {
            this.$message({message:"删除资源失败,"+res.msg,type:'error'});
          }
        })
        .catch(res => {
          // this.$message.error("删除失败" + res.msg);
        });
      this.resourceVisible = false;
      this.resIds = [];
      this.$refs.resourceTable.clearSelection();
    },
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      console.log("value,data", value, data);
      return data.label.indexOf(value) !== -1;
    },
    handleChange(data) {
      this.id = data.id;
      this.authId = data.id;
      this.selectData = data;
      console.log("data", data);
      this.getResource(data.id);
    },
    handleSelectionChange(val) {
      this.selection = val;
      console.log(this.selection);
    },

    handleAdd() {
      this.dialogVisible = true;
      this.show = true;
      this.dialogType = "add";
      this.parentId = "";
      this.menu = {
        enabled: "1",
        level: "1",
        initHidden: "1",
        isFlow: "0"
      };
    },

    getResource(id) {
      /*
                             let params = {authId:''}
                             params.authId = id
                             */
      let params = {};
      params["authId"] = id;
      getReses(params).then(res => {
        console.log(res);
        this.tableData = res.data;
      });
    },

    handleClose() {
      this.dialogVisible = false;
      this.$refs["menu"].resetFields();
      this.menu = {};
    },

    handleEditResource() {
      editResource(this.resource).then(res => {
        if (res.code === 1) {
          this.dialogVisible = false;
          this.$message({
            message: "数据修改成功",
            type: "success"
          });
          this.getResource(this.id);
          // this.getResource(this.selectOrg.selectId[0])
        } else {
          this.$message({
            message: "数据修改失败"+res.msg,
            type: "error"
          });
        }
        this.$refs.form.resetFields();
        this.resource = {};
      });
    },
    handleEdit(row) {
      console.log(row);
      this.dialogVisible = true;
      this.resource = row;
      //  let obj = Object.assign({},this.resource,{id:row.id})
      //console.log("11",obj)
    },
    getResourceType() {
      this.selectOptions = [
        {
          //  id: "1",
          value: "router",
          label: "router"
        },
        {
          //  id: "2",
          value: "button",
          label: "button"
        },
        {
          //  id: "3",
          value: "biz",
          label: "biz"
        }
      ];
    },
    // 点击关联资源
    handleRelevance(data) {
      this.id = data.id;
      this.resourceVisible = true;
      this.authId = data.id;
      let params = {};
      params["authId"] = data.id;
      // 请求到已关联资源信息
      getReses(params).then(res => {
        for (let index of res.data) {
          this.resIds.push(index.id);
        }
        this.params = {
          code: "",
          name: "",
          pageNo: 1,
          pageSize: 10,
          orderBy: "created_at desc",
          type: null
        };
        this.getResourceAll();
      });
    },
    getRowKeys(row) {
      return row.id;
    },
    handleSelection(selection, row) {
      console.log("selection", selection, "row", row);
      //   if (this.resIds.indexOf(row.id) <= -1) {
      //     this.resIds.push(row.id);
      //   } else {
      //     this.resIds = [...this.resIds.filter(it => it !== row.id)];
      //   }

      //   this.resIds = [...Array.from(new Set(this.resIds))];
      this.resIds = [];
      selection.map(val => {
        this.resIds.push(val.id);
      });
    },
    changeSize(obj) {
      let val = {
        pageNo: obj.page
      };
      this.params = { ...this.params, ...val };
      this.getResourceAll();
    },
    handleClose1() {
      this.resourceVisible = false;
      this.resIds = [];
      this.authId = "";
      this.$refs.resourceTable.clearSelection();
    },
    handleSelectionOk() {
      if (Array.isArray(this.resIds) && this.resIds.length <= 0) {
        this.$message("资源不能为空");
        return;
      }
      this.addAuthRes();
    },
    handleSelectionClose() {},
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.resourceTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.resourceTable.clearSelection();
      }
    },
    queryHandle(item) {
      this.params.pageNo = 1;
      this.getResourceAll();
    },
    handleMenuNext(row) {
      console.log("row", row);
      this.parentId = row.id;
      this.dialogVisible = true;
      this.dialogType = "add";
      this.show = false;
      this.menu = {
        enabled: "1",
        initHidden: "1",
        isFlow: "0"
      };
    },
    handleMenuEdit(row) {
      console.log(row);
      // row.title=row.label;
      // this.menu = row
      this.menu = {
        ...{
          id: row.id,
          title: row.label,
          description: row.description,
          icon: row.icon,
          orderNum: row.orderNum,
          parentId: row.parentId,
          type: row.type,
          children: row.children,
          isFlow: row.isFlow
        },
        ...row.exts
      };
      console.log(this.menu);
      this.dialogVisible = true;
      this.dialogType = "edit";
    },
    handleMenuRemove(row) {
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delMenuSub(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delMenuSub(row) {
      console.log("row", row);
      delMenuSub(row.id).then(res => {
        if (res.code === 1) {
          this.$message("删除菜单成功");
          this.selectData = {};
          this.tableData = [];
          console.log("row**********", row);
          this.getMenuTree();
        } else {
          this.$message({message:"删除菜单失败,"+res.msg,type:'error'});
        }
      });
    },
    handleOk() {
      if (this.menu.hasOwnProperty("id")) {
        console.log(this.menu);
        this.updMenu(this.menu);
      } else {
        if (this.parentId) {
          this.addMenu({ ...{ parentId: this.parentId }, ...this.menu });
        } else {
          this.addMenu(this.menu);
        }
      }
    },
    updMenu(obj) {
      this.$refs["menu"].validate(valid => {
        if (!valid) return;
        updMenu(obj).then(res => {
          if (res.code === 1) {
            this.$message("修改菜单成功");
            this.selectData = {};
            this.tableData = [];
            this.getMenuTree();
          } else {
            this.$message({message:"修改菜单失败,"+res.msg,type:"error"});
          }
          this.menu = {};

          this.dialogVisible = false;
          this.$refs["menu"].resetFields();
        });
      });
    },
    addMenu(obj) {
      this.$refs["menu"].validate(valid => {
        if (!valid) return;
        addMenu(obj).then(res => {
          if (res.code === 1) {
            this.$message("添加菜单成功");
            this.selectData = {};
            this.tableData = [];
            this.getMenuTree();
          } else {
            this.$message({message:"添加菜单失败,"+res.msg,type:'error'});
          }
          this.menu = {};

          this.dialogVisible = false;
          this.$refs["menu"].resetFields();
        });
      });
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  // background-color: #ffffff;
  overflow: hidden;
  height: 100%;
  padding: 0;
}
.tree_box {
  background-color: #fff;
  padding: 30px;
}
.table_box {
  padding: 30px;
  background-color: #fff;
  height: 100%;
}
//设置按钮
.el-button--mini {
  border-radius: 0;
}
.resource {
  // 关联资源弹出框
  .el-select--medium {
    padding: 10px 30px;
  }
}

// 弹出框底部
.pagination-container {
  padding: 20px 16px 0px;
}

.el-col-15 {
  width: 61%;
  margin-left: 1.5%;
  // box-sizing: border-box;
}
/deep/.el-tree {
  border: 1px solid #dcdfe6;
}
.btn_group {
  text-align: right;
  margin-bottom: 20px;
}
.custom_span {
  margin-left: 30px;
  display: none;
  button {
    // border: 1px solid #ff6a00;
    padding: 3px 15px;
    font-size: 12px;
    // color: #2b4583;
    background: #2b4583;
    color: #fff;
  }
  // button {
  //   // border: 1px solid #ff6a00;
  //   padding: 0px 10px;
  //   height: 25px;
  //   line-height: 25px;
  //   font-size: 10px;

  // }
}
.el-tree-node.is-current > .el-tree-node__content {
  .custom_span {
    display: inline-block;
  }
}

.tree-list {
  // height: 85%;
  height: 82%;
  overflow-y: auto;
}
/deep/.el-pagination {
  /deep/.el-input__inner {
    height: 28px !important;
  }
}
/deep/.el-button--text {
  color: #4b4b4b;
}
.title {
  font-weight: 600;
}
.el-button--mini {
  border-radius: 0;
}
.level {
  /deep/.el-input__inner {
    width: 300px;
  }
}
.action-item {
  margin-right: 15px;
}
// 添加顶级菜单弹出框
.el-form {
  padding: 20px;
}

//  添加顶级菜单弹出框输入框
.el-form-item {
  margin-bottom: 8px;
}
.drag {
  height: 100%;
  position: relative;
  .drag-table {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    /deep/.drag-tree-table-header {
      height: 30px !important;
      line-height: 30px !important;
      padding: 0;
      font-size: 14px;
      font-weight: 400;
    }
    /deep/.action-item {
      display: inline-block;
      margin-right: 10px;
      color: $l-color-primary;
    }
    /deep/.tree-column {
      text-align: left !important;
    }
    /deep/.drag-tree-table-body {
      height: 100%;
      padding-bottom: 80px;
      overflow-y: auto !important;
    }
  }
}
.el-dialog {
  height: 400px;
  overflow-y: auto;
}
/deep/.el-form-item__error {
  position: static !important;
}
.menuSelect {
  /deep/.el-input__inner {
    width: 300px;
  }
}

/deep/.el-textarea__inner {
  width: 300px;
}
.el-tree-node__content {
  /deep/.el-button--mini {
    height: 25px;
    line-height: 25px;
  }
}
/deep/.el-button--text {
  color: #2b4583;
}
</style>


