<template>
<!-- 病区管理 -->
    <div class="container">
        <div class="header-button">
            <el-button  type="primary" size="mini" @click="handleAdd">添加病区</el-button>
            <el-button  type="primary" size="mini" @click="handleRemove">删除</el-button>
            <el-button  type="primary" size="mini" @click="handleQuery">查询</el-button>
        </div>
        <el-table
                :data="tableData"
                style="width: 100%;overflow-y: auto"
                ref="table"
                height='410'
                border
                @selection-change="handleSelectionChange"

        >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    type="index"
                    label="序号"
                    width="150px"
                    header-align="center"
                    align="center"
            ></el-table-column>

            <el-table-column
                    prop="wardName"
                    label="病区名称"
                    >
            </el-table-column>
            <el-table-column
                    prop="wardCode"
                    label="病区代码"
                    >
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
            >
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="handleEdit(scope.row)"
                            type="text"
                            size="small">
                        编辑
                    </el-button>
                    <el-button
                            @click.native.prevent="handleDelete(scope.row)"
                            type="text"
                            size="small">
                        删除
                    </el-button>
                    <el-button
                            @click.native.prevent="handleClick(scope.row)"
                            type="text"
                            size="small">
                        关联科室
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
            <pagination v-show="total>0" :total="total" :pageSize.sync="params.pageSize" :page.sync="params.pageNo" @pagination="changeSize" />
        </div>
        <!-- 新建病区编辑病区 -->
            <el-dialog :visible.sync="dialogVisible1" :title="dialogType==='edit'?'编辑病区':'新建病区'" :before-close="handleClose1" >
                        <el-form :model="ward" label-width="90px" label-position="right" ref="rform" :rules="rules" style="height:360px;overflow-y:auto">

                            <el-form-item label="病区名称" prop="wardName">
                                <el-input v-model="ward.wardName" placeholder="请输入病区名称" style="width:360px;" />
                            </el-form-item>
                            <el-form-item label="病区代码" prop="wardCode">
                                <el-input v-model="ward.wardCode" placeholder="请输入病区编码" style="width:360px;" />
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button round size="mini" type="primary" @click="handleOk1">确 定</el-button>
                            <el-button round size="mini" @click="handleClose1">取 消</el-button>
                        </div>
                    </el-dialog>
        <!-- 关联科室 -->
      <el-dialog :visible.sync="dialogVisible" title="关联科室" :before-close="handleClose">
            <div class="treeBox" style="height:360px;overflow-y:auto">
                <el-tree
                        :expand-on-click-node="false"
                        show-checkbox
                        :data="wardTree"
                        default-expand-all
                        node-key="id"
                        ref="tree"
                        highlight-current
                        :check-strictly="true"
                        :default-checked-keys="wardIds"
                        :props="defaultProps">
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" round  size="mini" @click="handleOk">确认</el-button>
                <el-button type="primary" round size="mini" @click="handleClose">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
  import {getWardAll,addWard,editWard,removeWard,getWardTree,getResRouter,addWardRelation,getSelectWard} from '@/api/admin/whis/ward'

  export default {
    data(){
      return {
        params: {
          pageNo: 1,
          pageSize: 10,
          orderBy: "updated_at desc"
        },
        all: 'alone',
        total: 0,
        tableData: [],
        dialogVisible: false,
        dialogVisible1: false,
        dialogType: 'add',
        wardTree: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        wardIds: [],
        id: "",
        selectOptions: [],
        // wardId:'',
        wardFunId: '',
        ward: {},
        rules: {
             wardName: [{required: true, message: '请输入病区名称', trigger: 'blur'}],
             wardCode: [{required: true, message: '请输入病区编码', trigger: 'blur'}]

        }

      }
    },
    mounted() {

      this.getWardAll();
    },
    methods: {
        sortchange(){

        },
        // 分页加载数据
        getWardAll(){
            getWardAll(this.params)
                    .then(res => {
                        console.log(res)
                        if (res.code === 1) {
                        this.tableData = res.data
                        this.total = res.total
                        } else {
                        this.$message('获取数据失败')
                        }
                    })
        },
     // 添加病区
     handleAdd(){
        this.dialogVisible1 = true;
        this.dialogType = "add";
     },
    // 添加/编辑弹出框点击确定
     handleOk1() {
        this.$refs['rform'].validate((valid) => {
          if (!valid) {return;}
          if (!this.ward.id) {
            this.handleAddWard();
          } else {
            this.handleEditWard();
          }
        })

      },
      //     handleClose1() {
      //   this.dialogVisible1 = false;
      //   this.ward = {}
      //   this.$refs['rform'].resetFields();
      // },
    //   添加数据
    handleAddWard() {
            addWard(this.ward).then(res => {
                console.log(res)

            if (res.code === 1) {
                this.$message({
                message: "数据添加成功",
                type: "success"
                });
                this.getWardAll()
            } else {
              this.$message({
                    message: res.msg || '数据添加失败',
                    type: "error"
                    });
            }
            this.dialogVisible1 = false;
            this.$refs.rform.resetFields();
            this.ward = {};
            })
        },

     //关闭新建编辑弹出框
      handleClose1() {
        this.dialogVisible1 = false;
        this.ward = {}
        this.$refs['rform'].resetFields();
      },

// 编辑病区

      handleEdit(row){
        console.log(row)
        this.dialogVisible1 = true;
        this.dialogType = "edit";
        this.ward = {...row}
      },
    // 编辑病区数据
     handleEditWard(){
        editWard(this.ward).then(res => {
          if (res.code === 1) {

            this.$message({
              message: "数据修改成功",
              type: "success"
            });
            this.getWardAll()

          } else {
            this.$message({
              message: res.msg || "数据修改失败",
              type: "error"
            });
          }
          this.dialogVisible1 = false;
          this.$refs['rform'].resetFields();
          this.ward = {};
        });
      },








// 删除当前病区
    // 点击删除弹出警告框
      handleDelete(row) {
        this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
               this.handleRemoveWard(row)
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
    handleRemoveWard(row){
         let arr = []
        arr.push(row.id)
        this.wardIds = [...arr]
        this.deleteWard()
    },
// 批量删除
     handleRemove() {
        if (this.wardIds.length <= 0) {
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
            this.deleteWard();

          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
        deleteWard(){
            removeWard(this.wardIds)
            .then(res=>{
                if(res.code === 1){
                this.getWardAll()
                this.$message('删除数据成功')
                }else{
                this.$message('删除数据失败')
                }
            })
      },
      handleSelectionChange(val) {
        let arr = []
        for(let index of val){
          arr.push(index.id)
        }
        this.wardIds = [...arr]
      },
// 关联科室
 handleClick(row) {
        this.wardFunId = row.id
        this.getWardTree()
        this.dialogVisible = true
        this.all = 'alone'

      },
    getWardTree(){
         getWardTree()
          .then(res => {
                console.log('-------------')
              console.log('------resres-------',res)
            if (res.code === 1) {

              this.wardTree = res.data;
              this.getWard()


            } else {
              this.$message("获取数据失败")
            }
          });
    },
     getWard() {
        getSelectWard({wardId: this.wardFunId})
          .then(res => {
            this.wardIds = res.data
          })
      },
       handleOk() {
            const tree = this.$refs.tree.getCheckedNodes()
            console.log(tree)
            let arr = []
            for (let index of tree) {
            arr.push(index.id)
            }
            let obj = {
            wardId: this.wardFunId,
            deptIds: arr

            }
            this.addWardFun(obj)



        },
      handleClose() {
        let arr = []
        this.wardIds = [...arr]
        this.ward = {}
        this.dialogVisible = false
      },
        addWardFun(obj) {
        addWardRelation(obj)
          .then(res => {
              console.log(res)
            if (res.code === 1) {
              this.$message('关联科室成功')
            } else {
              this.$message('关联科室失败')
            }
            this.id = "";
            this.wardIds = []
            this.dialogVisible = false
            this.toggleSelection()
          })
      },

      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.table.toggleRowSelection(row);
          });
        } else {
          this.$refs.table.clearSelection();
        }

        this.$refs.tree.setCheckedKeys([])
      },

      // 分页
      changeSize(obj) {
              let val = {
                pageNo: obj.page
              }
              this.params = {...this.params, ...val}
              this.getWardAll()
            },
        queryHandle(item){
              this.params.pageNo = 1
              this.getWardAll();
              },
        handleAll() {
          if (this.wardIds.length === 0) {
            this.$message('请您先选中节点')
            return
          }
          this.getWardTree()
          this.dialogVisible = true
          this.all = 'all'
        } ,
        handleQuery(){
          let val = {
            pageNo: 1
          }
          this.params = {...this.params, ...val}
          this.getWardAll();
        }


   }
  }
</script>
<style lang="scss" scoped>
    .textRight{
        text-align: right;
    }
    //设置按钮
    .el-button--mini{
        border-radius: 0;
    }
   .el-message-box__btns .el-button--small{
         border-radius: 0px!important;
    }
    .treeBox{
        height: 400px;
        overflow: hidden;
        overflow-y: auto;
    }
    .container{
        background-color: #ffffff;
        overflow: hidden;
        height: 100%;
        padding:20px;
    }
    .header-button{
        padding: 7px 0;
    }
         // 添加弹出框
   .el-form {
    padding: 20px;

    }
    .selectType{
        padding: 0 0 7px;
    }
    .el-form-item{
      margin-bottom: 10px;
    }

    .el-input{
        padding:0;
    }
    .el-tree{
        padding-left: 30px;
    }

/deep/.el-form-item__error{
   position: static!important;
}
/deep/.el-textarea__inner{
        width: 300px;

    }
    // /deep/.el-input__inner{
    //     width: 300px;

    // }
    /deep/.el-dialog__body {
      .el-input__inner{
        width:300px;
      }
    }
  /deep/.el-pagination {
      text-align: right;
    }
       /deep/.el-pagination{
    /deep/.el-input__inner{
      height: 28px!important;
    }
  }
</style>

