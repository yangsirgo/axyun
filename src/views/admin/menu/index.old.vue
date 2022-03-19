
<template>
    <div class="container" ref="page">
        <el-button type="primary" size="mini" @click="handleAdd">添加顶级菜单</el-button>

        <div class="drag">
            <!--
            <el-table
                    :data="tableData"
                    row-key="id"
                    style="width: 100%;margin-top:30px;"
                    border
                    default-expand-all
            >
                <el-table-column
                        prop="label"
                        label="菜单名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="exts.type"
                        label="菜单类型"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="exts.icon"
                        label="菜单图标">
                </el-table-column>
                <el-table-column
                        prop="exts.orderNum"
                        label="菜单排序">
                </el-table-column>
                <el-table-column
                        prop="exts.enabled"
                        label="菜单是否可用">
                </el-table-column>
                <el-table-column
                        prop="exts.description"
                        label="菜单描述">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                >
                    <template slot-scope="scope">
                        <el-button
                                @click.native.prevent="handleNext(scope.row)"
                                type="text"
                                size="small">
                            添加下一级
                        </el-button>
                        <el-button
                                @click.native.prevent="handleEdit(scope.row)"
                                type="text"
                                size="small">
                            编辑
                        </el-button>

                        <el-button
                                @click.native.prevent="handleRemove(scope.row)"
                                type="text"
                                size="small">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>-->

            <vueDragTable
                    :data="treeData"
                    :onDrag="onTreeDataChange"
                    :fixed="true"
                    :isdraggable="true"
                     ref="tree"
                    class="drag-table"
            ></vueDragTable>
        </div>

        <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑菜单':'新建菜单'" :before-close="handleClose" >
            <el-form :model="menu" label-width="120px" label-position="right" ref="menu" :rules="rules"  style="height:360px;overflow:auto">
                <el-form-item label="菜单名称" prop="title">
                    <el-input v-model="menu.title" placeholder="请输入菜单名称"/>
                </el-form-item >
                <el-form-item label="菜单图标" prop="icon">
                    <el-input v-model="menu.icon" placeholder="请输入菜单图标" />
                </el-form-item>
                <el-form-item label="菜单类型" prop="type">
                    <el-select v-model="menu.type" placeholder="请选择菜单类型">
                        <el-option label="默认" value="wauth"></el-option>
                    </el-select>
                </el-form-item>
                <!--
                <el-form-item label="是否可用" prop="enabled">
                    <el-radio-group v-model="menu.enabled">
                        <el-radio label="1">是</el-radio> 
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否显示" prop="initHidden">
                    <el-radio-group v-model="menu.initHidden">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                -->
                <el-form-item label="是否显示流程" prop="isFlow">
                    <el-radio-group v-model="menu.isFlow">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单级别" prop="level" v-if="show">
                    <el-input v-model="menu.level" controls-position="right" :min="1" :max="10" disabled class="level"></el-input>
                </el-form-item>
                <el-form-item label="菜单排序" prop="orderNum">
                    <el-input v-model="menu.orderNum" controls-position="right" :min="1" :max="1000" class="level"></el-input>
                </el-form-item>
                <el-form-item label="菜单描述" prop="description">
                    <el-input type="textarea" placeholder="请添加菜单描述" v-model="menu.description" ></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" round  size="mini" @click="handleOk">确认</el-button>
                <el-button type="primary" round size="mini" @click="handleClose">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {getMenuTree,addMenu,updMenu,delMenuSub} from '@/api/admin/menu'
import { log } from 'util'
    export default {
        data(){
            return{
                dialogVisible:false,
                dialogType:"add",
                menu:{
                    enabled:'1',
                    initHidden:'1',
                    isFlow:'0',
                    level: "1"
                },
                treeData: {
                    columns: [
                        {
                            type: 'selection',
                            title: "菜单名名称",
                            field: "label",
                            width: '10%'
                        },
                        /*
                        {
                            title: "菜单类型",
                            field: "type",
                            width: '10%'
                        },*/
                        {
                            title: "菜单图标",
                            field: "icon",
                            width: '10%'
                        },
                        {
                            title: "菜单排序",
                            field: "orderNum",
                            width: '10%'
                        },
                        /*
                        {
                            title: "菜单是否可用",
                            field: "enabled",
                            width: '10%'
                        },
                        {
                            title: "菜单是否显示",
                            field: "initHidden",
                            width: '10%'
                        },
                        */
                        {
                            title: "菜单描述",
                            field: "description",
                            width: '25%'
                        },
                        {
                            title: "操作",
                            type: 'action',
                            align: 'center',
                            actions: [
                                {
                                    text: '添加下一级',
                                    onclick: this.handleNext,
                                    formatter: (item) => {
                                        return '<span class="action_btn">添加下一级</span>'
                                    }
                                },
                                {
                                    text: '编辑',
                                    onclick: this.handleEdit,
                                    formatter: (item) => {
                                        return '<span class="action_btn">编辑</span>'
                                    }
                                },
                                {
                                    text: '删除',
                                    onclick: this.handleRemove,
                                    formatter: (item) => {
                                        return '<span class="action_btn">删除</span>'
                                    }
                                }
                            ]
                        }

                    ],
                    lists: [],
                    custom_field: {
                        id: 'id',
                        order: 'sort',
                        lists: 'children',
                        parent_id: 'parentId'
                    }
                },
                parentId:"",
                show:false,
                rules: {
                  'title' : [{required: true, message: '请输入名称', trigger: 'blur'}],
                  'type' : [{required: true, message: '请选择菜单类型', trigger: 'blur'}],
                  'orderNum':[{
                           validator:(rule,value,callback)=>{
                            if(value){
                                if((/^\+?[1-9]\d*$/).test(value) == false){
                                    callback(new Error("请填写大于0的数字"));
                                }else{
                                    callback();
                                }
                            }else{
                                callback();
                            }
                        },
                        trigger:'change'
                    }
                  ]
                }
            }
        },
        mounted() {
            this.getMenuTree()
        },
        methods:{ 
            setTree(tree){
                for(let index of tree){
                    index.description = index.exts.description
                    index.orderNum = index.exts.orderNum
                    index.type = index.exts.type
                    index.enabled = index.exts.enabled
                    index.initHidden = index.exts.initHidden
                    index.icon = index.exts.icon
                    if(!index.children){
                        index.children=[]
                    }
                    if(index.children.length >0 ){
                        this.setTree(index.children)
                    }
                }
            },
            getMenuTree(){
                getMenuTree()
                    .then(res =>{
                        if(res.code === 1){
                            this.setTree(res.data)
                            this.treeData.lists = res.data
                            console.log(res.data)
                        }else{
                            this.$message("获取数据失败")
                        }
                    })
            },
            addMenu(obj){
              this.$refs['menu'].validate((valid) => {
                if(!valid) return;
                addMenu(obj)
                  .then(res => {
                    if (res.code === 1) {
                        this.$message('添加菜单成功')
                        
                        if(res.data.parentId){
                            console.log({...res.data,children:[],label:res.data.title})
                            this.getCurMenu(this.treeData.lists,{...res.data,children:[],label:res.data.title})
                        }else{
                            // this.getMenuTree()
                            this.treeData.lists.push({...res.data,children:[],label:res.data.title})
                        }
                    } else {
                      this.$message('添加菜单失败')
                    }
                    this.menu = {
                    };
                    this.dialogVisible = false
                    this.$refs['menu'].resetFields();
                  })
              })
            },
           getCurMenu(data,obj){
                    for (var i in data) {
                        if (data[i].id == obj.parentId) {
                            data[i].children.push(obj)
                            break;
                        } else {
                            this.getCurMenu(data[i].children, obj);                           
                        }
                    }  
               this.$refs.tree.custom_field.open=true;
               this.$forceUpdate();
                     
             },
            //  前台编辑删除
           setMenu(data,obj,type){
                 for (var i in data) {
                        if (data[i].id == obj.id) {
                            if(type=="edit"){
                                data.splice(i,1)
                                data.push(obj)
                            }else if(type=="delete"){
                                 data.splice(i,1);  
                            }
                           break;
                        } else {
                            this.setMenu(data[i].children, obj,type);
                        }
                    }
            },
            updMenu(obj){
              this.$refs['menu'].validate((valid) => {
                if(!valid) return;
                updMenu(obj)
                    .then(res =>{
                        if(res.code === 1){    
                            this.$message('修改菜单成功')
                            console.log("obj",obj)
                            // if(obj.parentId){
                                // obj.label=obj.title    
                                let type="edit"
                                this.setMenu(this.treeData.lists,{...obj,label:obj.title},type)
                            // }else{
                            //     this.getMenuTree()
                            // }
                            
                        }else{
                            this.$message('修改菜单失败')
                        }
                        this.menu = {
                        };

                        this.dialogVisible = false
                        this.$refs['menu'].resetFields();
                    })
              })
            },
            delMenuSub(row){
                delMenuSub(row.id)
                    .then(res =>{
                        if(res.code === 1){
                            this.$message('删除菜单成功')
                            console.log("row**********",row)
                            let type="delete"
                            this.setMenu(this.treeData.lists,row,type)
                            // this.getMenuTree()
                        }else{
                            this.$message('删除菜单失败')
                        }
                    })
            },
            handleAdd(){
                this.dialogVisible = true
                this.show = true
                this.dialogType = 'add'
                this.parentId = ""
                this.menu = {
                    enabled:'1',
                    level:'1',
                    initHidden:'1',
                    isFlow:'0',
                };

            },
            handleOk(){
                if(this.menu.hasOwnProperty('id')){
                    console.log(this.menu)
                    this.updMenu(this.menu)
                }else{
                    if(this.parentId){
                        this.addMenu({...{parentId: this.parentId},...this.menu})
                    }else{
                        this.addMenu(this.menu)
                    }

                }
            },
            handleNext(row){
                console.log(row)
                this.parentId = row.id
                this.dialogVisible = true
                this.dialogType = 'add'
                this.show = false
                this.menu = {
                    enabled:'1',
                    initHidden:'1',
                    isFlow:'0',
                };
            },
            handleEdit(row){
                console.log(row)
                // row.title=row.label;
                // this.menu = row
                this.menu = {
                    ...{id:row.id,title:row.label,description:row.description,icon:row.icon,orderNum:row.orderNum,parentId:row.parentId,type:row.type,children:row.children,isFlow:row.isFlow},
                    ...row.exts}
                    console.log(this.menu)
                this.dialogVisible = true
                this.dialogType = 'edit'
            },
            handleRemove(row){
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
            handleClose(){
                this.dialogVisible = false
                this.$refs['menu'].resetFields();
                this.menu = {
                }
            },
            onTreeDataChange(list, from, to, where) {
                const fromLabel = from.label
                const tolabel = to.label
                this.$confirm(`您是否要把 ${fromLabel}菜单 拖拽到 ${tolabel} 菜单下`, "提示", {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        let obj = {
                            id:from.id,
                            parentId:to.id
                        }
                        this.dragUpdMenu(obj)
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消拖拽菜单"
                        });
                    });

            },
            dragUpdMenu(obj){
                updMenu(obj)
                    .then(res =>{
                        if(res.code === 1){
                            this.getMenuTree()
                            this.$message('拖拽菜单成功')
                        }else{
                            this.$message('拖拽菜单失败')
                        }
                    })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .container{
        padding:20px;
        height: 100%;
        overflow: hidden;
        background-color: #ffffff;
    }
    .el-button--mini{
        border-radius: 0;
    }
    .level{
        /deep/.el-input__inner{
            width:300px;
        }
    }
    .action-item{
        margin-right:15px;
    }
    // 添加顶级菜单弹出框
   .el-form{
     padding: 20px;
    }
    
    //  添加顶级菜单弹出框输入框
    .el-form-item {
    margin-bottom: 8px;
}
    .drag{
        height:100%;
        position: relative;
        .drag-table{
            position: absolute;
            top:0;
            left:0;
            right:0;
            width:100%;
            height: 100%;
            /deep/.drag-tree-table-header{
                height: 30px!important;
                line-height: 30px!important;
                padding:0;
                font-size: 14px;
                font-weight: 400;
            }
            /deep/.action-item{
                display: inline-block;
                margin-right:10px;
                color:$l-color-primary;
            }
            /deep/.tree-column{
                text-align: left!important;
            }
            /deep/.drag-tree-table-body{
                height: 100%;
                padding-bottom:80px;
                overflow-y: auto!important;
            }
        }
    }
    .el-dialog{
        height: 400px;
        overflow-y: auto;
    }  
     /deep/.el-form-item__error{
         position: static!important;
    }  
      /deep/.el-input__inner{
        width: 300px;
    }
    /deep/.el-textarea__inner{
        width: 300px;
    }

</style>
