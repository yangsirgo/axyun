
<template>
  <div class="app-container" ref="page">
    <el-row :gutter="20" style="height:100%">
      <!-- 左侧盒子 -->
      <el-col :span="8" style="padding-right:0;height:100%;">
        <!-- threebox 左侧树形盒子 -->
        <div class="tree_box" style="height:100%;padding-bottom: 20px;">
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
            <span class="custom-tree-node" slot-scope="{ node, data }" >
              <span>{{ node.label }}</span>
              <span class="custom_span" >
                <!--   <el-button
                                            type="text"
                                            size="mini"
                                            @click="() => handleChange(data)"
                                    >
                                        查看资源
                </el-button>-->
                <el-button type="text" size="mini" @click="(e) => handleRelevance(e,data)">关联资源</el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <!-- 右侧盒子 -->

      <el-col :span="16" style="padding-left:0;height:100%;">
        <div class="table_box">
          <!-- <div class="btn_group">
                        <el-button  type="primary" size="mini" @click="handleAdd">添加</el-button>
                        <el-button  type="primary" size="mini" @click="handleRemove">删除</el-button>
          </div>-->
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            border
          >
            <!--   @selection-change="handleSelectionChange"  -->

            <!--<el-table-column type="selection" width="60"></el-table-column>-->
            <el-table-column label="资源编码" width="200">
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

    <el-dialog :visible.sync="dialogVisible" title="新建资源" :before-close="handleClose">
      <el-form
        :model="resource"
        label-width="80px"
        label-position="left"
        ref="rform"
        :rules="rules"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="mini" @click="handleClose">取 消</el-button>
        <el-button round size="mini" type="primary" @click="handleOk">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="resourceVisible"
      title="关联资源"
      :before-close="handleClose1"
      width="1000px"
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
import { getMenuTree } from "@/api/admin/menu";
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        uri: [{ required: true, message: "请输入地址", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }]
      },
      filterText: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectOrg: {
        selectId: []
      },
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
      resId:''
    };
  },
  mounted() {
    getMenuTree().then(response => {
      const menuTree = response.data;
      this.data = menuTree;
    });
    this.getResourceType();
  },
  methods: {
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
          this.$message("获取数据失败");
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

            console.log('obj.authId', obj.authId)
            this.getResource(obj.authId);
          } else {
            this.$message("添加资源失败");
          }
        })
        .catch(res => {
          this.$message.error("添加失败" + res);
        });
      this.resourceVisible = false;
    //   this.authId = "";
      this.resIds = [];
      this.$refs.resourceTable.clearSelection();
    },
    //删除关联资源
    handleDelet(row) {
      console.log("row", row)
      console.log('object', {authId:row.aid,resId:row.rid});
      this.removeAuthor({authId:row.aid,resId:row.rid});
    },
    removeAuthor(obj) {
  
      console.log('obj', obj)
      removeAuthor(obj)
        .then(res => {
          if (res.code === 1) {
            this.$message("删除资源成功");
            this.getResource(this.authId)
          } else {
            this.$message("删除资源失败");
          }
        })
        .catch(res => {
          this.$message.error("删除失败" + res.msg);
        });
      this.resourceVisible = false;
      this.resIds = [];
      this.$refs.resourceTable.clearSelection();
    },
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      console.log('value,data', value,data)
      return data.label.indexOf(value) !== -1;
    },
    handleChange(data) {
      this.id = data.id;
      this.authId = data.id;
      console.log(data);
      this.getResource(data.id);
    },
    handleSelectionChange(val) {
      this.selection = val;
      console.log(this.selection);
    },
    handleRemove() {
      /*
                          if(this.selection.length < 0){
                              return
                          }
                          let list = []
                          for(let index of this.selection){
                              list.push(index.id)
                          }
                          removeResource(list)
                              .then(res=>{
                                  if(res.code === 1){
                                      this.getResource(this.selectOrg.selectId[0])
                                  }
                              })
                        */
      if (this.selection.length <= 0) {
        this.$alert("请正确选择需要操作的记录！", "警告", {
          confirmButtonText: "确定"
        });
        return;
      }

      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handleRemoveResource();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleAdd() {
      if (!this.id) {
        this.$message("请您选取节点后再添加数据");
        return;
      }
      this.dialogVisible = true;
    },
    handleOk() {
      this.$refs["rform"].validate(valid => {
        if (!valid) return;
        this.resource.authId = this.id;
        //console.log("@@ ",this.resource)
        //if(JSON.stringify(this.resource) === '{}'){
        //if( this.resource === {} ){
        if (!this.resource.id) {
          this.handleAddResource();
        } else {
          this.handleEditResource();
        }
      });
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
      this.resource = {};
      this.$refs.form.resetFields();
    },
    handleRemoveResource() {
      let list = [];
      for (let index of this.selection) {
        list.push(index.id);
      }
      let data = {
        authId: this.id,
        list: list
      };
      delRes(data).then(res => {
        if (res.code === 1) {
          this.getResource(this.id);
          // this.getResource(this.selectOrg.selectId[0])
        }
      });
    },
    handleAddResource() {
      addResNew(this.resource).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "数据添加成功",
            type: "success"
          });
          this.getResource(this.id);
          // this.getResource(this.selectOrg.selectId[0])
        } else {
          this.$message({
            message: res.msg || "数据添加失败",
            type: "error"
          });
        }
        this.dialogVisible = false;
        this.$refs.form.resetFields();
        this.resource = {};
      });
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
            message: "数据修改失败",
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
    handleRelevance(e, data) {
      e.stopPropagation();
      this.id=data.id
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
// 关联资源弹出框
.el-select--medium {
  padding: 10px 30px;
}
// 弹出框底部
.pagination-container {
  padding: 20px 16px 0px;
}

.el-col-16 {
  width: 65.26667%;
  margin-left: 1.4%;
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
  margin-left: 100px;
  display: none;
  button {
    border: 1px solid #ff6a00;
    padding: 2px 10px;
    font-size: 12px;
  }
}
.el-tree-node.is-current>.el-tree-node__content {
  .custom_span{
    display: inline-block;
  }
  }

.tree-list {
  height: 90%;
  overflow-y: auto;
}
/deep/.el-pagination {
  /deep/.el-input__inner {
    height: 28px !important;
  }
}
</style>


