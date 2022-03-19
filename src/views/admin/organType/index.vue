<template>
    <div class="app-container" ref="page">
        <el-row :gutter="20" style="height:100%;">
            <el-col :span="8" style="height: 100%">
                <div class="tree_box" style="height: 100%;padding-bottom:20px;">
                    <el-input
                            placeholder="输入关键字进行过滤"
                            v-model="filterText"
                    >

                    </el-input>
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
                            style="height: 90%;overflow-y: auto"
                    >
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="16" style="height:100%">
                <div class="table_box">
                    <el-button type="primary" size="mini"  @click="handleAdd()">添加</el-button>
                    <el-button type="primary" size="mini"  @click="handleRemove()">删除</el-button>
                    <el-table
                            :data="organData"
                            style="width: 100%;margin-top:20px;"
                            tooltip-effect="dark"
                            border
                            height="450"
                            @selection-change="handleSelectionChange"
                    >
                        <el-table-column
                                type="selection"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                prop="orgField"
                                label="组织字段"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="orgFieldName"
                                label="组织字段名称"
                                width="180">
                        </el-table-column>

                        <el-table-column
                                prop="orgFieldType"
                                label="组织字段类型">
                        </el-table-column>
                        <el-table-column
                                prop="orgFieldOrder"
                                label="组织字段排序">
                        </el-table-column>
                        <el-table-column
                                prop="orgFieldValues"
                                label="组织字段值域">
                        </el-table-column>
                        <el-table-column
                                prop="orgFieldLength"
                                label="长度限制">
                        </el-table-column>
                        <el-table-column
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

<!--                                <el-button-->
<!--                                        @click.native.prevent="handleRemove(scope.row)"-->
<!--                                        type="text"-->
<!--                                        size="small">-->
<!--                                    删除-->
<!--                                </el-button>-->
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
        <!-- 可以拆成组件 -->
        <el-dialog :visible.sync="visible" :title="visibleType==='edit'?'编辑组织':'新建组织'" :before-close="handleClose" >
            <el-form :model="organ" label-width="120px" label-position="left" ref="organ" :rules="rules" status-icon  style="height:360px;overflow-y:auto">
                <el-form-item label="组织字段" prop="orgField" >
                    <el-input v-model="organ.orgField" placeholder="请输入组织字段" :disabled="organ.orgField === 'name'" style="width:300px"/>
                </el-form-item>
                <el-form-item label="组织字段名称" prop="orgFieldName">
                    <el-input v-model="organ.orgFieldName" placeholder="请输入类型值"  style="width:300px"/>
                </el-form-item>

                <el-form-item label="组织字段类型" prop="orgFieldType" @change="handleType">
                    <el-select v-model="organ.orgFieldType" placeholder="请选择类型" >
                        <el-option
                                v-for="(item) in types"
                                :key="item.id"
                                :label="item.label"
                                :value="item.value"
                                 style="width:300px"
                        >

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织字段排序" prop="orgFieldOrder">
                    <el-input v-model="organ.orgFieldOrder" placeholder="请输入组织字段排序" style="width:300px!important" />
                </el-form-item>
                  <el-form-item label="长度限制" prop="orgFieldLength">
                    <el-input v-model="organ.orgFieldLength" placeholder="请输入长度限制" style="width:300px!important" />
                </el-form-item>
                <el-tabs v-model="organ.orgFieldValueType" @tab-click="handleClick" v-if="organ.orgFieldType === 'select'||organ.orgFieldType === 'checkbox'">
                    <el-tab-pane label="本地数据" name="local">
                        <el-form-item label="组织字段值域"  prop="orgFieldValues">
                            <el-input type="textarea" :rows="4" v-model="organ.orgFieldValues" placeholder="请输入组织字段值域" disabled  style="width:300px" />


                            <el-row :model="orgValue" style="margin-top:20px;">
                                <el-col
                                        v-for="(item,index) in orgValue"
                                        :key="index"
                                        style="display: flex;margin-bottom:20px;"
                                >

                                    <span style="padding-right:0px;width:50px;display: inline-block">label</span>
                                    <el-input v-model="item.label" placeholder="请填写组织字段值所显示的汉字" style="margin-right:6px;display: inline-block;" class="orgin"></el-input>
                                    <span style="padding-right:0px;width:50px;display: inline-block;margin-left:10px">value</span>
                                    <el-input v-model="item.value" placeholder="请填写组织字段值所选中的值" style="display: inline-block;" class="seleorgin"></el-input>
                                    <el-button @click="handleRe(index)" class="del">删除</el-button>
                                </el-col>
                            </el-row>

                            <el-button type="primary" size="mini" @click="handleShow" round >添加</el-button>
                            <el-button type="primary" size="mini" @click="handleSave" round >保存</el-button>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="远程数据" name="remote">
                        <el-form-item label="组织字段值域"  prop="orgFieldValues">
                            <el-input type="textarea" :rows="4" v-model="organ.orgFieldValues" placeholder="请输入组织字段值域"  style="width:300px" />
                            <div>值域只能是code和name</div>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" round  size="mini" @click="handleOk">确认</el-button>
                <el-button type="primary" round size="mini" @click="handleClose">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import {getOrganTypeTree,getOrganTypeTable,addOrganType,putOrganType,deleteOrganType} from '@/api/admin/type'
    export default {

        data(){
            var validatePass = (rule,value,callback) =>{
              if(!Number(value)){
                callback(new Error('请输入数字'))
              }else{
                callback()
              }

            }
            return{
                orgValue:[
                    {label: "", value: ""}
                ],
                dialogType:"add",
                dialogVisible:false,
                labelPosition:"right",
                visible: false,
                visibleType: 'add',
                filterText: '',
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                data: [],
                organData:[],
                types:[
                    {
                        id: "1",
                        label: "input",
                        value: 'input'
                    },
                    {
                        id: "2",
                        label: "select",
                        value: 'select'
                    },
                    {
                        id:"3",
                        label:'checkbox',
                        value:'checkbox'
                    }
                ],
                organ:{
                  orgFieldOrder:"",
                  orgFieldValueType:"local",
                  orgFieldLength:''

                },
                obj:{

                },
                orgType:"",
                selection:[],
                rules:{
                  orgFieldOrder:[
                    { validator: validatePass, trigger: 'blur' }
                  ]
                }

            }

        },
        mounted(){
            this.getOrganType()
        },
        methods:{
             handleType(){
                this.organ.orgFieldValueType=""
            },
            getOrganType(){
                getOrganTypeTree()
                    .then(res =>{
                        if(res.code === 1){
                            this.data = res.data
                        }else{
                            this.$message('获取数据失败')
                        }
                    }).catch(error=>{
                      console.log(error)
                })
            },
            getOrganTable(params){
                console.log(params)
                getOrganTypeTable({type:params.orgType})
                    .then(res =>{
                        if(res.code === 1){
                            console.log('-------------')
                            console.log(res.data)
                            this.organData = res.data
                        }else{
                            this.$message("获取数据失败")
                        }
                    })
            },
            addOrganType(params){
                addOrganType(params)
                    .then(res =>{
                        if(res.code === 1){
                            this.$message('添加类型定义成功')
                            this.getOrganTable({orgType:this.orgType})
                        }else{
                            this.$message('添加类型定义失败')
                        }
                        this.$refs["organ"].resetFields();
                        this.visible = false
                        this.organ = {orgFieldValueType:"local"}
                        this.orgValue = [
                            {label: "", value: ""}
                        ]
                    })
            },
            putOrganType(params){
                putOrganType(params)
                    .then(res =>{
                        if(res.code === 1){
                            this.$message('修改类型定义成功')
                            this.getOrganTable({orgType:this.orgType})
                        }else{
                            this.$message("删除类型定义失败")
                        }
                        this.$refs["organ"].resetFields();
                        this.visible = false
                        this.organ = {orgFieldValueType:"local"}
                        this.orgValue = [
                            {label: "", value: ""}
                        ]
                })
            },
            deleteOrganType(params){
                deleteOrganType(params)
                    .then(res =>{
                        if(res.code === 1){
                            this.$message('删除类型定义成功')
                            this.getOrganTable({orgType:this.orgType})
                        }else{
                            this.$message("删除类型定义失败")
                        }
                        this.selection = []
                    })
            },
            filterNode(value, data) {
                if(!value){
                    return true;
                }
                return data.label.indexOf(value) !== -1;
            },
            handleChange(data){
          /*      if(data.hasOwnProperty('parentId')){*/
                    this.id = data.id
                    this.orgType = data.exts.paramValue
                    this.obj = {orgType:data.exts.paramValue,orgTypeName:data.exts.paramName}

                    //this.getResource(data.id)
                    this.getOrganTable({orgType:data.exts.paramValue})
              /*  }else{
                    this.id = ""
                }*/


            },
            handleSelect(val){
                this.type = val
                //请求数据
            },
            handleAdd(){
                if(!this.id){
                    this.$message("请您选取节点后再添加数据")
                    return;
                }
                this.visible = true;
                this.visibleType = 'add'

            },
            handleEdit(row){
                console.log(row)
                this.visible = true;
                this.visibleType = 'edit'
                this.organ = row
                if(row.hasOwnProperty('orgFieldValues')&& row.cnfFieldValues === 'remote'){
                    this.orgValue = JSON.parse(row.orgFieldValues)
                }else{
                    this.orgValue = [
                        {label: "", value: ""}
                    ]
                }


            },
            handleOk(){

              this.$refs['organ'].validate((valid) => {
                    //console.log("======================")
                    //console.log(valid)
                if(valid){
                  if(this.organ.hasOwnProperty('id')){
                    if(this.organ['orgFieldType'] === 'input'){
                      this.putOrganType({...this.obj,...this.organ,...{orgFieldValues:""}})
                    }else{
                      this.putOrganType({...this.obj,...this.organ})
                    }

                  }else{
                    this.addOrganType({...this.obj,...this.organ})
                  }
                }else{
                  return
                }


              })


            },
            handleSelectionChange(val){
                this.selection = val
            },
            handleRemove(){
              let hasOne = this.selection.some(index => index.orgField === 'name')
              if(hasOne){
                  this.$message("默认必须有name属性不能删除")
                   return
              }
                if(this.selection.length <= 0){
                    this.$alert("请正确选择需要操作的记录！", "警告", {
                        confirmButtonText: "确定"
                    });
                    return
                }
                let arr = []
                for(let index of this.selection){
                    arr.push(index.id)
                }



                this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.deleteOrganType(arr)
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });

            },
            handleShow(){
                console.log(this.organ)

                this.orgValue.push({
                    label: "",
                    value: ""
                })
            },
            handleSave(organ){
                this.$set(this.organ,'orgFieldValues',JSON.stringify(this.orgValue))
            },
            handleClose(){
                this.visible = false
                this.organ = {}
                this.orgValue = [
                    {label: "", value: ""}
                ]
            },
            handleRe(index){
                this.orgValue.splice(index,1)
            },
            handleClick(val){
                this.organ.orgFieldValueType = val.paneName
            }


        },

    watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
    }
</script>
<style lang="scss" scoped>
    .app-container{
        // background-color: #ffffff;
        overflow: hidden;
        height: 100%;
        padding-top: 0;
    }
    //设置按钮
    .el-button--mini{
        border-radius: 0;
    }

     // 左侧
    .el-col-8{
        background-color: #fff;
        // padding: 20px 30px;
        height: 100%;
        min-height: 845px;
    }
    // 添加弹出框
   .el-form {
    padding: 20px;

}
    .el-input{
        padding: 7px 0;
    }
    .el-select{
        padding: 7px 0;
    }
    // 右侧
    .el-col-16{
        background-color: #fff;
        padding:20px;
        width: 65.26667%;
        margin-left: 1.4%;
        // height: 100%;
     min-height: 845px;
    }
    .tree_box{
         padding:20px;
    }
    .table_box{
        padding:0 20px;
        // text-align: right;
        // margin-top: 20px;
    }
    /deep/.el-tree{
        border:1px solid #DCDFE6;
    }
    .btn_group{
        text-align:right;
        margin-bottom:20px;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    // 弹出框选择select最后一行
    .el-col-24{
        height: 50px;
        line-height: 50px;
    }
    .el-button--medium{
        margin: 13px 0 0;
    }
/deep/.el-form-item__error{
   position: static!important;
}




    /deep/.el-textarea__inner{
        width: 300px;

    }
/deep/.el-dialog__body{
    .el-input__inner{
        width: 300px;
    }

.el-tabs__content{
        .orgin{
            width: 220px;
            .el-input__inner{
        width: 220px;
    }

        }
          .seleorgin {
             width: 205px;
          .el-input__inner{
        width: 205px;
    }
    }
    .el-button{
        font-size: 14px;
        height: 31px;
        padding: 2px 15px;
    }
    .del{
         height: 36px;
          padding: 5px 15px;
         margin-left: 20px;
    }
}
}

</style>
