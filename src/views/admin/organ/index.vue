<template>
  <div class="app-container" ref="page">
    <el-row :gutter="20" style="height:100%">
      <!-- 左侧目录 -->
      <el-col :span="9" style="padding-right:30px;padding-left:30px!important;height: 100%; ">
        <el-button @click="handleReset" type="primary" size="mini">重置</el-button>
        <div class="tree_box" style="height: 73%;overflow-x:auto;width:100%">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
            <el-scrollbar style="height:94%">
          <el-tree
            :expand-on-click-node="false"
            :data="data"
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :filter-node-method="filterNode"
            :props="defaultProps"

            class="el-tree"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <div class="orgType" :style="data.exts.orgType =='_TENANT_'?'color:#fff;background: #2b4583;':''">{{data.exts.orgTypeName}}</div>
                <el-button type="text" size="mini" @click="() => handledisable(data)">查看</el-button>
                <el-button type="text" size="mini" @click="() => handleNext(data)">添加下一级</el-button>
                <el-button type="text" size="mini" @click="() => handleEdit(data)" v-if = "data.exts.orgType !=='_TENANT_' ">编辑</el-button>
                <el-button type="text" size="mini" v-else style="color:rgb(166, 164, 164)">编辑</el-button>
                <el-button type="text" size="mini" @click="() => handleDelete(data)" v-if = "data.exts.orgType !=='_TENANT_' ">删除</el-button>
                 <el-button type="text" size="mini" v-else style="color:rgb(166, 164, 164)">删除</el-button>
              </span>
            </span>
          </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <!-- 右侧添加信息 -->
      <el-col :span="15" style="padding-left:30px;height: 100%;">
        <div class="table_box" style="height:500px!important;overflow-y:auto">
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
          <div style="margin-bottom:10px;" v-if="uplevelShow === true">
            <span style="width:116px;display: inline-block;font-weight:700">上一级</span>
            <el-input v-model="upLevel" :disabled="dis" style="width:360px;display: inline-block;"></el-input>
          </div>
          <div style="margin-bottom:10px;">
            <span style="width:116px;display: inline-block;font-weight:700;">类型</span>
            <el-select
              v-model="type"
              placeholder="请选择类型"
              @change="handleSelect"
              :disabled="isDisabled"
              label-width="120px"
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
              :label="item.orgFieldName"
              :prop="item.orgField"
            >
              <el-input
                v-if="item.orgFieldType === 'input'"
                v-model="item.orgFieldValue"
                style="width:360px;"
                :disabled="isDis"
                @input="changeValue(item)"
              ></el-input>
              <el-select
                v-model="item.orgFieldValue"
                v-if="item.orgFieldType === 'select' && item.orgFieldValues "
                :disabled="isDis"
              >
                <el-option
                  v-for="it in (getJsonData(item.orgFieldName,item.orgFieldValues))"
                  :key="it.value"
                  :label="it.label"
                  :value="it.value"
                ></el-option>
              </el-select>
              <el-checkbox-group
                v-model="item.orgFieldValue"
                v-if="item.orgFieldType === 'checkbox' && item.orgFieldValues"
                :disabled="isDis"
              >
                <el-checkbox
                  v-for="it in (getJsonData(item.orgFieldName,item.orgFieldValues))"
                  :label="it.label"
                  :key="it.label"
                >{{it.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item v-if="button_show">
              <el-button type="primary" size="mini" @click="handleOrgAdd()">保存</el-button>
              <el-button type="primary" size="mini" @click="handleOrgClear()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  getOrgTypes,
  getOrganTypeTable,
  addOrg,
  getOrgTree,
  deleteOrgTree,
  getOrgItem,
  putOrgItem,
  getArrayList
} from "@/api/admin/type";
import { deepClone } from "@/utils";
import { log } from "util";
export default {
  data() {
    return {
      length: "",
      labelPosition: "left",
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label"
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
      obj: {},
      uplevelShow: true,
      isDis: false,
      button_show: true,
      type_edit: "",
      checked: ""
    };
  },
  mounted() {
    this.getOrgTree();
    this.getOrgTypes();
  },
  methods: {
    getJsonData(_label, _data) {
      try {
        return JSON.parse(_data);
      } catch (e) {
        console.log("#####[err]", _label + "-数据有错误,不是正确json");
        return {};
      }
    },

    changeValue(item) {
      console.log(item.orgFieldValue.length);
      if (item.orgFieldValue.length > item.orgFieldLength) {
        let str = item.orgFieldValue.substr(0, item.orgFieldLength);
        item.orgFieldValue = str;
        this.$message({
          message:
            item.orgFieldName +
            "的长度限制为" +
            item.orgFieldLength +
            "请重新输入",
          type: "error"
        });
      }
    },

    handlerPageNo(value) {
      console.log(value);
    },

    getOrgTree() {
      getOrgTree().then(res => {
        if (res.code === 1) {
          this.data = res.data;
        } else {
          this.$message({message:"请求数据失败-" + res.msg,type:'error'});
        }
      });
    },
    getOrgTypes() {
      getOrgTypes().then(res => {
        if (res.code === 1) {
          this.types = res.data;
        } else {
          this.$message({message:"请求数据失败-" + res.msg,type:'error'});
        }
      });
    },
    addOrgan() {
      let obj = {};
      let cloneTreeItem = deepClone(this.form.treeItem);

      for (let index of cloneTreeItem) {
        if (Array.isArray(index.orgFieldValue)) {
          index.orgFieldValue = index.orgFieldValue.join(";");
        }
      }
      if (this.id) {
        obj = {
          orgValues: cloneTreeItem,
          parentId: this.id
        };
      } else {
        obj = {
          orgValues: cloneTreeItem
        };
      }
      addOrg(obj)
        .then(res => {
          if (res.code === 1) {
            this.$message("添加成功");
            this.getOrgTree();
          } else {
            this.$message({message:"添加失败-" + res.msg,type:'error'});
          }
          this.id = "";
          this.$refs["form"].resetFields();
          for (let index of this.form.treeItem) {
            index.orgFieldValue = "";
          }
          this.type = "";
          this.upLevel = "";
          this.$set(this.form, "treeItem", []);
        })
        .catch(_err => {
          this.$message({
            type: "error",
            message: _err.msg
          });
        });
    },
    deleteOrganTree(id) {
      deleteOrgTree(id).then(res => {
        if (res.code === 1) {
          this.$message("删除数据成功");
          this.getOrgTree();
          this.handleOrgClear();
        } else {
          this.$message({message:"删除数据失败" + res.msg,type:'error'});
        }
      });
    },
    getOrganItem(params) {
      getOrgItem(params).then(res => {
        if (res.code === 1) {
          let list = [...res.data];
          let arr = [];
          let arr1 = [];
          for (let index of res.data) {
            if (
              index.orgFieldType === "checkbox" &&
              index.hasOwnProperty("orgFieldValue") === false
            ) {
              index.orgFieldValue = [];
            }

            if (
              index.orgFieldValues &&
              index.orgFieldValues != "" &&
              index.orgFieldValueType === "remote"
            ) {
              arr.push(index.orgFieldValues);
            }
          }

          if (arr.length > 0) {
            let newArr = Array.from(new Set(arr));
            for (let index of newArr) {
              let obj = {
                code: index
              };
              arr1.push(obj);
            }
            getArrayList(arr1).then(res => {
              for (let index of list) {
                for (let index1 in res.data) {
                  console.log(index1);
                  if (index.orgFieldValues === index1) {
                    let arr2 = [];

                    for (let index of res.data[index1]) {
                      let obj = {
                        label: index.name,
                        value: index.code
                      };
                      arr2.push(obj);
                    }
                    index.orgFieldValues = JSON.stringify(arr2);
                  }
                }
              }
              console.log(list);
              this.form.treeItem = list;
            });
          } else {
            this.form.treeItem = list;
          }
          /**/
        } else {
          this.$message({message:"获取数据失败" + res.msg,type:'error'});
        }
      });
    },
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },
    handleSelect(val) {
      this.type = val;
      getOrganTypeTable({ type: val }).then(res => {
        console.log(res);
        if (res.code === 1) {
          let list = [...res.data];
          let arr = [];
          let arr1 = [];
          for (let index of res.data) {
            if (
              index.orgFieldType === "checkbox" &&
              index.hasOwnProperty("orgFieldValue") === false
            ) {
              index.orgFieldValue = [];
            }

            if (index.orgFieldValues && index.orgFieldValueType === "remote") {
              arr.push(index.orgFieldValues);
            }
          }
          if (arr.length > 0) {
            let newArr = Array.from(new Set(arr));
            for (let index of newArr) {
              let obj = {
                code: index
              };
              arr1.push(obj);
            }
            getArrayList(arr1).then(res => {
              for (let index of list) {
                for (let index1 in res.data) {
                  console.log(index1);
                  if (index.orgFieldValues === index1) {
                    let arr2 = [];
                    for (let index of res.data[index1]) {
                      let obj = {
                        label: index.name,
                        value: index.code
                      };
                      arr2.push(obj);
                    }
                    index.orgFieldValues = JSON.stringify(arr2);
                  }
                }
              }
              console.log(list);
              this.form.treeItem = list;
            });
          } else {
            this.form.treeItem = list;
          }

          /**/
        } else {
          this.$message({message:"获取数据失败" + res.msg,type:'error'});
        }
      });
    },
    editOrganItem() {
      putOrgItem(this.form.treeItem).then(res => {
        if (res.code === 1) {
          this.$message("编辑数据成功");
          this.getOrgTree();
        } else {
          this.$message({message:"编辑数据失败-" + res.msg,type:'error'});
        }
        this.isDisabled = false;
        this.type = "";
        this.$refs["form"].resetFields();
        this.$set(this.form, "treeItem", []);
      });
    },
    handleOrgAdd() {
      if (this.type_edit === "edit") {
        this.editOrganItem();
      } else {
        this.addOrgan();
      }
      this.type_edit = "";
    },
    handleEdit(item) {
      this.uplevelShow = false;
      this.isDis = false;
      const arr = this.data.filter(index => index.id === item.parentId);
      this.type = item.exts.orgType;
      this.isDisabled = true;
      this.button_show = true;
      this.type_edit = "edit";
      if (arr.length > 0) {
        this.upLevel = arr[0].label;
      } else {
        this.upLevel = "";
      }
      this.getOrganItem({ id: item.id });
    },
    handleNext(item) {
      console.log(item);
      this.$set(this.form, "treeItem", []);
      this.uplevelShow = true;
      this.upLevel = item.label;
      this.isDisabled = false;
      this.isDis = false;
      this.type = "";
      this.type_edit = "";
      this.id = item.id;
      this.button_show = true;
      /*  this.handleSelect(item.exts.orgType)*/
    },
    handleDelete(item) {
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteOrganTree(item.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleOrgClear() {
      this.upLevel = "";
      this.type = "";
      this.id = "";
      this.type_edit = "";
      this.isDisabled = false;
      this.isDis = false;
      this.uplevelShow = true;
      this.$refs["form"].resetFields();
      this.$set(this.form, "treeItem", []);
    },
    handledisable(data) {
      this.handleEdit(data);
      this.isDis = true;
      this.button_show = false;
      this.$nextTick(() => {
        this.isDisabled = true;
      });
    },
    handleReset() {
      this.getOrgTree();
      this.handleOrgClear();
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
  padding-top: 0px;
}
// 左侧
.el-col-9 {
  background-color: #fff;
  padding: 20px 30px;
  height: 100%;
  min-height: 845px;
  width: 37.5%;
}
// 右侧
.el-col-15 {
  background-color: #fff;
  padding: 20px 30px;
//   width: 65.26667%;
  width: 61%;
  margin-left: 1.5%;
  // height: 100%;
  min-height: 845px;
}
//设置按钮
.el-button--mini {
  border-radius: 0;
}
//       .el-input {
//     margin-bottom: 7px;
// }
.tree_box {
  padding: 0px;
  margin-top: 20px;
}
.table_box {
  padding: 60px 30px 30px 0;
}
/deep/.tree_box {
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
.orgType {
  padding: 3px 5px;
  border: 1px solid $l-color-primary;
  display: inline-block;
  margin-left: 10px;
  border-radius: 4px;
  color: $l-color-primary;
  font-size: 10px;
  line-height: 10px;
  margin-right: 10px;
}
.el-form-item--medium {
  margin-bottom: 7px;
}
/deep/.table_box {
  .el-input__inner {
    width: 300px;
  }
}
.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
  display: block;
}
/deep/.el-tree > .el-tree-node {
//   height: 350px; //这里的高根据实际情况
  min-width: 100%;
  display: inline-block;
}
</style>
