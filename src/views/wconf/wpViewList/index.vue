<template>
  <div class="container" ref="page">
    <el-row :gutter="20" style="height:100%">
      <el-col :span="8" style="padding:20px!important;height: 100%;">
        
        <div class="tree_box" style="height: 90%;padding-bottom:20px;">
          所属模块:
          <el-select placeholder="请选择1级类型" v-model="tl1" @change="handleSelectL1">
            <el-option label="请选择" value />
            <el-option
              v-for="(item) in types_l1"
              :key="item.id"
              :label="item.paramName"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <el-button @click="handleReset" type="primary" size="mini" style="margin-left:50px">刷新</el-button> -->
               <el-button
                size="mini"
                icon="el-icon-refresh"
                type="primary"
                @click="handleReset"
                style="float:right;margin-right:20px"
              >刷新</el-button>
          <br />
          <br />

          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          <el-tree
            :expand-on-click-node="false"
            :data="data"
            :load="loadTreeNodes"
            lazy
            node-key="id"
            ref="tree"
            highlight-current
            :filter-node-method="filterNode"
            :props="defaultProps"
            style="height: 90%;overflow-y: auto"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button type="text" size="mini" @click="() => handledisable(data)">查看</el-button>
                <el-button type="text" size="mini" @click="() => handleNext(data)">添加下一级</el-button>
                <el-button type="text" size="mini" @click="() => handleEdit(data)">编辑</el-button>
                <el-button type="text" size="mini" @click="() => handleDelete(data)">删除</el-button>
              </span>
            </span>
          </el-tree>
          <div class="allCount"><el-button type="text" icon="el-icon-refresh" style='margin-right:30px' @click="handleCnfClear">刷新</el-button>      共&nbsp;{{this.data.length}}&nbsp;条</div>
        </div>
      </el-col>
      <el-col :span="16" style="padding-left:30px;height:100%;overflow:auto;">
        <div class="table_box">
          <!--  <el-row :model="form" ref="form" label-width="100px;">
                          <el-col
                              v-for="(row,index) in form"
                              :key="index"
                          >
                              <el-select v-model="row.type" placeholder="请选择类型">
                                  <el-option
                                      v-for="(item) in types"
                                      :key="item.id"
                                      :label="item.label"
                                      :value="item.value"
                                  >

                                  </el-option>
                              </el-select>
                          </el-col>
          </el-row>-->
          <!-- <div style="margin-bottom:20px;" v-if="uplevelShow === true">
                        <span style="width:80px;display: inline-block;">父级</span>
                        <el-input v-model="upLevel" :disabled="dis"  style="width:360px;display: inline-block;"></el-input>
          </div>-->
          <!--    <div style="margin-bottom:20px;">

                          <span style="width:80px;display: inline-block;">模块</span>
                          <el-select v-model="cmodule" placeholder="请选择模块"  :disabled="isDisabled">
                            <el-option label="请选择" value=""/>
                            <el-option
                              v-for="(item) in types_l1"
                              :key="item.id"
                              :label="item.paramName"
                              :value="item.id"
                            >

                            </el-option>
                          </el-select>
          </div>-->
          <div v-if="uplevelShow === true" style="margin-bottom:0;">
            <span class="type">上一级</span>
            <el-input v-model="upLevel" :disabled="dis" style="width:360px;display: inline-block;"></el-input>
          </div>
          <div style="">
            <span class="type">类型</span>
            <el-select
              v-model="type"
              placeholder="请选择类型"
              @change="handleSelect"
              :disabled="isDisabled"
            >
              <el-option
                v-for="(item) in types"
                :key="item.id"
                :label="item.paramName"
                :value="item.paramValue"
              ></el-option>
            </el-select>
          </div>
          <el-form :model="form" :label-position="labelPosition" ref="form" label-width="120px">
            <el-form-item
              v-for="(item,index) in form.treeItem"
              :key="index"
              :label="item.cnfFieldName"
              :prop="item.cnfField"
            >
              <el-input
                v-if="item.cnfFieldType === 'input'"
                v-model="item.cnfFieldValue"
                style="width:360px;"
                :disabled="isDis"
              ></el-input>
              <el-select
                v-model="item.cnfFieldValue"
                v-if="item.cnfFieldType === 'select' && item.cnfFieldValues"
                :disabled="isDis"
              >
                <el-option
                  v-for="it in (JSON.parse(item.cnfFieldValues))"
                  :key="it.value"
                  :label="it.label"
                  :value="it.value"
                ></el-option>
              </el-select>
              <el-checkbox-group
                v-model="item.cnfFieldValue"
                v-if="item.cnfFieldType === 'checkbox' && item.cnfFieldValues"
                :disabled="isDis"
              >
                <el-checkbox
                  v-for="it in (JSON.parse(item.cnfFieldValues))"
                  :label="it.label"
                  :key="it.label"
                >{{it.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item v-if="button_show" class="btn_groups">
              <el-button type="primary" size="mini" @click="handleCnfAdd()">保存</el-button>
              <el-button type="primary" size="mini" @click="handleCnfClear()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!--
                <div class="table_box">
                    <el-table
                            :data="tableData"
                    >
                        <el-table-column v-for="(item,index) in columns" :prop="item.cf" :label="item.cfn" :key="index">

                        </el-table-column>
                    </el-table>
        </div>-->
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  getCnfTypes,
  getCnfanTypeTable,
  addCnf,
  getCnfMultiTree,
  deleteCnfTree,
  getCnfItem,
  putCnfItem,
  getCnfTypeL1s,
  getArrayList
} from "@/api/wconf/wparam";
import { deepClone } from "@/utils";
export default {
  data() {
    return {
      item: {},
      obj: {},
      labelPosition: "left",
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: (data, node) => {
          return !node.data.hasChild;
        }
      },
      data: [],
      types: [],
      type: "",
      form: {
        treeItem: []
      },
      selectType: "first",
      id: "",
      isDisabled: false,
      upLevel: "",
      isShow: false,
      dis: true,
      uplevelShow: true,
      tl1: null,
      types_l1: [],
      type_edit: "",
      isDis: false,
      button_show: true,

      tableData: [],
      columns: []
    };
  },
  mounted() {
    this.getCnfTypes();
    this.getCnfTypeL1s();
  },
  methods: {
    getCnfTypeL1s() {
      getCnfTypeL1s()
        .then(res => {
          if (res.code === 1) {
            console.log(res.data);
            this.types_l1 = res.data;
          } else {
            this.$message("获取数据失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSelectL1() {
      /*
                  console.log(this.tl1)
                  if( "" != this.tl1 && null != this.tl1 ){
                      this.getCnfTree(this.tl1)
                  }else{
                      this.data = []
                  }
                  */
      if (this.tl1 === "") {
        this.tl1 = null;
        this.type = "";
        this.form.treeItem = [];
      }
      this.getCnfMultiTree(this.tl1);
    },
    getCnfMultiTree(pid) {
      getCnfMultiTree(pid).then(res => {
        if (res.code === 1) {
          this.data = res.data;
          this.$nextTick(()=>{
            this.$refs.tree.filter(this.filterText);
          })
        } else {
          this.$message("请求数据失败");
        }
      });
    },
    getCnfTypes() {
      getCnfTypes().then(res => {
        if (res.code === 1) {
          this.types = res.data;
        } else {
          this.$message("请求数据失败");
        }
      });
    },
    loadTreeNodes(node, resolve) {
      if (node.level === 0) {
        return resolve(this.data);
      } else {
        getCnfMultiTree(this.tl1, node.data.id).then(res => {
          if (res.code === 1) {
            console.log(res);
            return resolve(res.data);
          } else {
            this.$message("请求数据失败");
          }
        });
      }
    },
    addCnfan() {
      if (!this.type) {
        this.$message("请先选择类型");
        return;
      }
      let obj = {};
      let cloneTreeItem = deepClone(this.form.treeItem);

      for (let index of cloneTreeItem) {
        if (Array.isArray(index.cnfFieldValue)) {
          index.cnfFieldValue = index.cnfFieldValue.join(";");
        }
      }
      //
      if (this.id) {
        obj = {
          cnfValues: cloneTreeItem,
          parentId: this.id
        };
      } else {
        obj = {
          cnfValues: cloneTreeItem
        };
      }

      obj.cmodule = this.tl1;

      // obj.isrow = 1
      obj.isSingle = 0;

      //
      this.obj = obj;
      addCnf(obj).then(res => {
        if (res.code === 1) {
          this.$message("添加成功");
          //  this.getCnfMultiTree(this.tl1)
          if (this.id) {
            this.refreshNodeBy(this.id);
          } else {
            this.getCnfMultiTree(this.tl1);
          }
        } else {
          this.$message("添加失败");
        }
        this.id = "";
        this.$refs["form"].resetFields();
        this.$set(this.form, "treeItem", []);
        this.type = "";
        this.upLevel = "";
        this.uplevelShow = true;
      });
    },
    refreshNodeBy(id) {
      let node = this.$refs.tree.getNode(id); // 通过节点id找到对应树节点对象
      node.loaded = false;
      node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
    },
    deleteCnfanTree(id) {
      deleteCnfTree(id).then(res => {
        if (res.code === 1) {
          this.$message("删除数据成功");
          if (this.item.parentId) {
            this.refreshNodeBy(this.item.parentId);
          } else {
            this.getCnfMultiTree(this.tl1);
          }

          // this.getCnfMultiTree(this.tl1)
          this.handleCnfClear();
        } else {
          this.$message("删除数据失败");
        }
      });
    },
    getCnfanItem(params) {
      getCnfItem(params).then(res => {
        if (res.code === 1) {
          for (let index of res.data) {
            if (index.orgFieldValueType === "remote") {
              let obj = { name: index.orgFieldValues };
              getArrayList(obj).then(res => {
                let arr = [];
                if (res.code === 1) {
                  for (let index1 of res.data) {
                    let obj = {
                      label: index1.name,
                      value: index1.code
                    };
                    arr.push(obj);
                    index.orgFieldValues = JSON.stringify(arr);
                  }
                }
              });
            }
            if (index.cnfFieldType === "checkbox") {
              if (index.hasOwnProperty("orgFieldValue")) {
                index.orgFieldValue = index.orgFieldValue.split(";");
              } else {
                index.orgFieldValue = "";
              }
            }
          }
          this.form.treeItem = res.data;
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    filterNode(value, data) {
      console.log(value);
      console.log(data);
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },
    handleSelect(val) {
      this.type = val;
      getCnfanTypeTable({ type: val }).then(res => {
        if (res.code === 1) {
          for (let index of res.data) {
            if (
              index.cnfFieldType === "checkbox" &&
              index.hasOwnProperty("cnfFieldValue") === false
            ) {
              index.cnfFieldValue = [];
            } else {
              index.cnfFieldValue = "";
            }
          }
          this.form.treeItem = res.data;
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    editCnfanItem() {
      putCnfItem(this.form.treeItem).then(res => {
        if (res.code === 1) {
          this.$message("编辑数据成功");
          // this.getCnfMultiTree(this.tl1)
          if (this.item.parentId) {
            this.refreshNodeBy(this.item.parentId);
          } else {
            this.getCnfMultiTree(this.tl1);
          }
        } else {
          this.$message("编辑数据失败");
        }
        this.isDisabled = false;
        this.type = "";
        this.id = "";
        this.upLevel = "";
        this.uplevelShow = true;
        this.$refs["form"].resetFields();
        this.$set(this.form, "treeItem", []);
      });
    },
    handleCnfAdd() {
      if (this.type_edit === "edit") {
        this.editCnfanItem();
      } else {
        this.addCnfan();
      }
    },
    handleEdit(item) {
      this.item = item;
      this.uplevelShow = false;
      const arr = this.data.filter(index => index.id === item.parentId);

      this.type = item.exts.cnfType;
      this.isDisabled = true;
      this.isDis = false;
      this.button_show = true;
      this.type_edit = "edit";
      if (arr.length > 0) {
        this.upLevel = arr[0].label;
      } else {
        this.upLevel = "";
      }
      this.getCnfanItem({ id: item.id });
    },
    handleNext(item) {
      this.item = item;
      console.log(item);
      this.$set(this.form, "treeItem", []);
      this.uplevelShow = true;
      this.isDis = false;
      this.upLevel = item.label;
      this.isDisabled = false;
      this.button_show = true;
      this.type = "";
      this.type_edit = "";
      this.id = item.id;
      /*  this.handleSelect(item.exts.cnfType)*/
    },
    handleDelete(item) {
      this.item = item;
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteCnfanTree(item.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleCnfClear() {
      this.upLevel = "";
      this.type = "";
      this.type_edit = "";
      this.id = "";
      this.upLevel = "";
      this.isDis = false;
      this.uplevelShow = true;
      this.isDisabled = false;
      this.$refs["form"].resetFields();
      this.$set(this.form, "treeItem", []);
      this.$refs.tree.setCurrentKey();
    },
    handleReset() {
      this.tl1 = null;
      this.filterText='';
      this.getCnfMultiTree(this.tl1);
      this.handleCnfClear();
    },

    handledisable(data) {
      this.handleEdit(data);
      this.isDis = true;
      this.button_show = false;
      this.$nextTick(() => {
        this.isDisabled = true;
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
.container {
  // background-color: #ffffff;
  overflow: hidden;
  height: 100%;
}
.tree_box {
  padding: 10px 0 30px 0px;
}
.table_box {
  padding: 30px 30px 30px 0;
}
/deep/.el-tree {
  border: 1px solid #dcdfe6;
}
.btn_group {
  text-align: right;
  margin-bottom: 20px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
/deep/.el-form-item--medium .el-form-item__content {
  overflow: hidden;
}
.isNone {
  display: none;
}
//设置按钮
.el-button--mini {
  border-radius: 0;
}
// 添加弹出框
.el-form {
  padding: 30px;
}

// 左侧
.el-col-8 {
  background-color: #fff;
  padding: 20px 30px;
  height: 100%;

  box-sizing: border-box;
}

// 右侧
.el-col-16 {
  background-color: #fff;
  padding: 0px 30px;
  width: 65.36667%;
  margin-left: 1.1%;
  height: 100%;
}

// .table_box .el-input{
// padding:7px;
// }
.el-form--label-right {
  padding: 0;
}
.el-form--label-left {
  padding: 0;
}
// /deep/.table_box{
//     .el-form-item--medium{
//         padding: 0;
//         margin-bottom: 10px;
//         .el-input__inner{
//             margin:0px;

//         }
//     }
// }
.table_box {
  /deep/.el-input__inner {
    width: 300px;
    margin-bottom: 10px;
    padding: 0 10px;
  }
}
.type {
  width: 116px;
  display: inline-block;
  color: #606266;
  font-weight: 700;
}
.allCount {
  height: 30px;
  line-height: 30px;
  text-align: right;
  margin-right: 30px;
}
.btn_groups {
  padding-left: 65px;
  padding-top: 10px;
}
</style>
