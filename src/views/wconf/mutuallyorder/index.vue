<template>
  <div class="app-container" ref="page">
    <el-row :gutter="20" style="height: 100%;">
      <el-col :span="4" style="padding:30px!important;height: 100%;">
        <el-input v-model="inputSearch" placeholder="输入关键字进行检索" style="width: 60%;"></el-input>
        <span>
          <el-button type="primary" @click="handleAdd" style="margin-left:20px">查询</el-button>
        </span>
        <div class="tree_box" style="height: 90%;padding-bottom:20px;">
            <el-collapse v-model="activeName">
                <el-collapse-item title="结算和收费项目维护" name="1">
                    <div>财务分类码</div>
                    <div>收费项目维护</div>
                </el-collapse-item>
                <el-collapse-item title="医嘱目录维护" name="2">
                    <div>医嘱项目</div>
                    <div @click="clickItem">互斥医嘱</div>
                </el-collapse-item>
            </el-collapse>
        </div>
      </el-col>
      <el-col :span="20" style="padding:10px!important;height: 100%;overflow:auto">
        <el-col :span="12" style="border-right: 1px solid #e4e4e4;height: 100%;padding:0px!important;">
            <div class="table_box">
                <div style="display: flex;align-items: baseline;justify-content: space-between;">
                    <span style="margin-left: 5px;">互斥组</span>
                    <span style="">
                    <el-input v-model="inputSearch" placeholder="输入关键字进行检索" style="width: 200px;"></el-input>
                    <el-button type="primary" @click="handleAdd" style="margin-left:20px">查询</el-button>
                    <el-button type="primary" size="mini" round @click="handleAdd()">新增</el-button>
                    <el-button type="primary" size="mini" round @click="handleRemove()">删除</el-button>
                    </span>
                </div>
                <el-table
                    :data="cnfanData"
                    style="width: 100%;margin-top:20px;"
                    tooltip-effect="dark"
                    height='832'
                    border
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                    type="selection"
                    width="50">
                    </el-table-column>
                    <el-table-column
                    prop="cnfField"
                    label="互斥组"
                    width="380">
                    </el-table-column>
                    <el-table-column
                    prop="cnfFieldName"
                    label="互斥类型"
                    width="380">
                    </el-table-column>
                    <!-- <el-table-column
                    fixed="right"
                    label="操作"
                    >
                    <template slot-scope="scope">

                        <el-button
                        @click.native.prevent="handleEdit(scope.row)"
                        type="text"
                        size="small"
                        >
                        编辑
                        </el-button>

                    </template>
                    </el-table-column> -->
                </el-table>
            </div>
        </el-col>
        <el-col :span="12" style="height: 100%;padding-left:30px!important;">
            <div class="table_box">
                <div style="display: flex;align-items: baseline;justify-content: space-between;">
                    <span style="margin-left: 5px;">互斥项明细</span>
                    <span style="">
                    <el-button type="primary" size="mini" round @click="handleAdd()">新增</el-button>
                    <el-button type="primary" size="mini" round @click="handleRemove()">删除</el-button>
                    <el-button type="primary" size="mini" round @click="handleAdd()">保存</el-button>
                    <el-button type="primary" size="mini" round @click="handleAdd()">取消</el-button>
                    </span>
                </div>
                <el-table
                    :data="cnfanData"
                    style="width: 100%;margin-top:20px;"
                    tooltip-effect="dark"
                    height='832'
                    border
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                    type="selection"
                    width="50">
                    </el-table-column>
                    <el-table-column
                    prop="cnfField"
                    label="医嘱名称"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="cnfFieldName"
                    label="医嘱子类"
                    width="180">
                    </el-table-column>

                    <el-table-column
                    prop="cnfFieldType"
                    label="规格">
                    </el-table-column>
                    <el-table-column
                    prop="cnfFieldOrder"
                    label="单位">
                    </el-table-column>
                </el-table>
            </div>
        </el-col>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      title="新增互斥组"
      class="form_dialog"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm" label-width="120px">
        <el-form-item label="互斥组名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
                <el-radio label="全排斥"></el-radio>
                <el-radio label="部分排斥"></el-radio>
            </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCnfTypeL1s,
  getCnfTreeSingle,
  getCnfanTypeTree,
  getColumns,
  getDatas,
  delRowVal,
  getCnfTypes,
  getCnfItem,
  getCnfanTypeTable,
  addCnf,
  searchType,
  deleteCnfTree,
  putCnfItem
} from "@/api/wconf/wparam";
import { deepClone } from "@/utils";
import { log } from "util";
export default {
  data() {
    return {
        inputSearch: '',
        activeName: ['1','2'],
        rules: {
          name: [
            { required: true, message: '请输入互斥组名称', trigger: 'blur' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ]
        },
        ruleForm: {
          name: '',
          resource: '',
        },


      isShow:false,
      cancelForm:{},
      item: {},
      isTop: false,
      dialogVisible: false,
      showContent: false,
      isDisabled: true,
      isDis: true,
      uplevelShow: true,
      upLevel: "",
      type1: "",
      type2: "",
      button_show: true,
      type: "",
      form1: {
        treeItem: []
      },
      form2: {
        treeItem: []
      },
      formAdd: {
        treeItem: []
      },
      types: [],
      labelPosition: "left",
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      data: [],
      tableData: [],
      types_l1: [
        {
          paramName: 123,
          id: 123
        }
      ],
      tl1: null,
      columns: [],
      total: 0,
      form: {
        pageSize: 10,
        page: 1
      },
      id: null,
      pageSizes: [10]
    };
  },
  mounted() {
    this.getCnfTypeL1s();
    //这只要单级列表数据
    this.getCnfTree(this.tl1);
    this.getCnfTypes();
  },
  methods: {
    clickItem() {
        console.log('clickItem');

    },
    handleAdd() {
        // if (this.tl1) {
            // this.type2 = "";
            // this.formAdd.treeItem = [];
            this.dialogVisible = true;
            // this.id=""
        // } else {
        //     this.$message("请选择所属模块");
        // }
    },



    
    handleOk() {
      if (this.type2) {
        this.dialogVisible = false;
      }
      this.handleAddCnf(this.type2, this.formAdd.treeItem);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleSelectAdd(val) {
      this.isTop = true;
      this.getCnfanTypeTable(val);
    },
    handleDelete(item) {
      console.log("itemitem", item);
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
    deleteCnfanTree(id) {
      deleteCnfTree(id).then(res => {
        if (res.code === 1) {
          this.$message("删除数据成功");
          this.getCnfTree(this.tl1);
          this.handleCnfClear();
          this.isShow=false
        } else {
          this.$message("删除数据失败");
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
    getCnfTypeL1s() {
      getCnfTypeL1s()
        .then(res => {
          if (res.code === 1) {
            this.types_l1 = res.data;
          } else {
            this.$message("获取数据失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCnfanType(id) {
      getCnfanTypeTree(id)
        .then(res => {
          if (res.code === 1) {
            this.data = res.data;
          } else {
            this.$message("获取数据失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCnfTree(pid) {
      getCnfTreeSingle(pid).then(res => {
        if (res.code === 1) {
          this.data = res.data;
        } else {
          this.$message("请求数据失败");
        }
      });
    },
    // 选择类型
    handleSelect(val) {
      this.isTop = false;
      this.getCnfanTypeTable(val);
    },
    //  传入类型，获取表单
    getCnfanTypeTable(val) {
      getCnfanTypeTable({ type: val }).then(res => {
        if (res.code === 1) {
          let list = [...res.data];
          let arr = [];
          let arr1 = [];
          for (let index of res.data) {
            if (
              index.cfnFieldType === "checkbox" &&
              index.hasOwnProperty("cfnFieldValue") === false
            ) {
              index.cfnFieldValue = [];
            }

            if (index.cnfFieldValues && index.cnfFieldValueType === "remote") {
              arr.push(index.cnfFieldValues);
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
                  if (index.cnfFieldValues === index1) {
                    let arr2 = [];
                    for (let index of res.data[index1]) {
                      let obj = {
                        label: index.name,
                        value: index.code
                      };
                      arr2.push(obj);
                    }
                    index.cnfFieldValues = JSON.stringify(arr2);
                  }
                }
              }
              console.log("list", list);
              if (this.isTop) {
                this.formAdd.treeItem = list;
              } else {
                this.form2.treeItem = list;
              }
            });
          } else {
            if (this.isTop) {
              this.formAdd.treeItem = list;
            } else {
              this.form2.treeItem = list;
            }
          }
          /**/
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    handleCnfAdd() {
      this.handleAddCnf(this.type, this.form2.treeItem);
    },
    // 点击保存按钮
    handleCnfSave() {
      this.editCnfanItem()
    },
    editCnfanItem() {
      putCnfItem(this.form1.treeItem).then(res => {
        if (res.code === 1) {
          this.$message("编辑数据成功");
            this.getCnfTree(this.tl1);
            this.isDis=true;

        } else {
          this.$message("编辑数据失败 ",res.msg);
        }

      });
    },
    handleAddCnf(type, treeItem) {
      if (!type) {
        this.$message("请先选择类型");
        return;
      }
      let obj = {};
      let cloneTreeItem = deepClone(treeItem);

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
      if (this.isTop) {
        obj.isSingle = 1;
      } else {
        obj.isrow = 1;
      }

      console.log("objpbjdj", obj);
      //
      addCnf(obj).then(res => {
        if (res.code === 1) {
          this.$message("添加成功");
          if (this.isTop) {
            this.getCnfTree(this.tl1);
          } else {
            this.getColumns({ id: this.id });
          }
        } else {
          this.$message("添加失败!" + res.msg);
        }
        for (let i in treeItem) {
          treeItem[i].cnfFieldValue = "";
        }

        this.uplevelShow = true;
      });
    },
    getDatas() {
      let obj = {
        ...this.form,
        ...{ id: this.id, pageSize: this.columns.length * this.form.pageSize }
      };
      getDatas(obj).then(res => {
        if (res.code === 1) {
          this.tableData = res.data;
          this.total = res.total / this.columns.length;
          if (this.tableData.length <= 0) {
            this.type = "";
          }
        } else {
          this.$message("请求数据失败");
        }
      });
    },
    searchType(data) {
      // let data={id:this.id}
      searchType(data).then(res => {
        if (res.code === 1) {
          // console.log("res......", res);

          this.type = res.data;
          if (res.data) {
            this.getCnfanTypeTable(res.data);
          }
        } else {
          this.$message("请求数据失败");
        }
      });
    },
    getColumns(data) {
      // console.log(data);
      getColumns(data).then(res => {
        if (res.code === 1) {
          if (res.data.length > 0) {
            this.columns = res.data;
            console.log("this.columns", res.data);
          } else {
            this.columns = [];
            return;
          }

          this.getDatas();
          console.log("+++++++++", this.type);
        } else {
          this.$message("请求数据失败");
        }
      });
    },
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },
    handleSelectL1() {
      if (this.tl1 === "") {
        this.tl1 = null;
      }
      this.isShow=false
      this.getCnfTree(this.tl1);
    },
    changeSize(obj) {
      this.form = { ...this.form, ...obj };
      this.getDatas();
    },

    handleChange(data) {
      this.isShow=true;
      this.isDis = true;
      // console.log("datatatata", data);
      this.showContent = true;
      this.id = data.id;
      this.searchType(data);
      this.getColumns({ id: data.id });
      this.handleEdit(data);
      this.handleCnfClear();
      // 加载类型
      this.getCnfTypes();
    },
    handleCancel(){
      this.getCnfanItem({id:this.id});
       this.isDis=true;
      this.$message("已取消编辑");
      
    },
    handleSingleEdit(data) {
        this.isShow=true;
        this.showContent = true;
        this.id = data.id;
        this.searchType(data);
        this.getColumns({ id: data.id });
        this.handleEdit(data);
        this.handleCnfClear();
        this.isDis = false;
        this.getCnfTypes();
      //  this.cancelForm=this.form1;
    },
    handleEdit(item) {
      console.log("item", item);
      this.type1 = item.exts.cnfTypeName;
      if (item.exts.cnfType) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
      const arr = this.data.filter(index => index.id === item.id);
      if (arr.length > 0) {
        this.upLevel = arr[0].label;
      } else {
        this.upLevel = "";
      }
      this.getCnfanItem({ id: item.id });
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
          this.form1.treeItem = res.data;

        } else {
          this.$message("获取数据失败");
        }
      });
    },
    // 点击清空
    handleCnfClear() {
      // this.type = ""
      this.uplevelShow = true;
      let form=[]
      if(!this.isDis){
          form=this.form1.treeItem
      }else{
         form=this.form2.treeItem
      }
      for (let i in form) {
        form[i].cnfFieldValue = "";
      }
    },
    //输入值改变时设置长度限制
    changeValue(item) {
      // console.log(item);
      if (item.cnfFieldValue.length > item.cnfFieldLength) {
        let str = item.cnfFieldValue.substr(0, item.cnfFieldLength);
        item.cnfFieldValue = str;
        this.$message({
          message:
            item.cnfFieldName +
            "的长度限制为" +
            item.cnfFieldLength +
            ",请您重新输入",
          type: "error"
        });
      }
    },
    handleRemove(val) {
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(val);
          delRowVal(val._id)
            .then(res => {
              if (res.code != 1 && res.data === 0) {
                this.$message("删除数据失败");
              } else {
                this.form.page = 1;
                this.getDatas();
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
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
  padding: 20px 0 30px 0px;
}
.table_box {
  padding: 20px 30px 30px 0;
//   text-align: right;
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
//设置按钮
.el-button--mini {
  border-radius: 0;
}
// 添加弹出框
.el-form {
  padding: 30px;
}

// 左侧
.el-col-4 {
  background-color: #fff;

  height: 100%;
  box-sizing: border-box;
}

// 右侧
.el-col-20 {
  background-color: #fff;
  padding: 20px;
  width: 81.6667%;
  margin-left: 1.4%;
  height: 100%;
}

/deep/.el-pagination {
  text-align: right;
}
/deep/.el-input.is-disabled .el-input__inner {
  margin-bottom: 7px;
  width: 255px;
}
/deep/.construction {
  .el-input__suffix {
    position: absolute;
    height: 100%;
    right: 5px;
    top: -5px;
    text-align: center;
    color: #c0c4cc;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    pointer-events: none;
  }
}
.el-col-13 {
  /deep/.el-input__inner {
    width: 255px;
  }
}
.type {
  width: 96px;
  display: inline-block;
  color: #606266;
  font-weight: 700;
  font-size: 16px;
}
.allCount {
  height: 30px;
  line-height: 30px;
  text-align: right;
  margin-right: 30px;
}
/deep/.el-dialog__body {
  padding: 30px;
  height: 200px;
  overflow: auto;
  .el-input__inner {
    width: 300px;
  }
  .el-form-item {
    margin-bottom: 40px;
    }
}
/deep/.el-dialog {
  width: 900px;
  .el-form {
    padding: 0 0 0 20px;
  }
  .el-form-item__label {
    padding: 0;
    font-size: 16px;
  }
}
</style>

