<template>
    <div class="app-container" ref="page">
        <el-row :gutter="20">
            <el-col :span="8" style="padding-right:0">
                <span>
                      所属模块:
                </span>

                <el-select placeholder="请选择1级类型" v-model="tl1" @change="handleSelectL1">
                    <el-option label="请选择" value=""/>
                    <el-option
                            v-for="(item) in types_l1"
                            :key="item.id"
                            :label="item.paramName"
                            :value="item.id"
                    >
                    </el-option>
                </el-select>
                <div class="tree_box">
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
                            highlight-current
                            @node-click="handleChange"
                            :filter-node-method="filterNode"
                            :props="defaultProps"
                    >
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="16" style="padding-left:30px;" >
                <el-table
                    :data="tableData"
                    style
                >
                    <el-table-column v-for="(item,index) in columns" :prop="item.cf" :label="item.cfn" :key="index">

                    </el-table-column>
                </el-table>

                <pagination
                        v-show="total>0"
                        :total="total"
                        :pageSize.sync="form.pageSize"
                        :page.sync="form.page"
                        @pagination="changeSize"
                />
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {getCnfTypeL1s,getCnfTree,getCnfanTypeTree,getColumns,getDatas} from '@/api/wconf/wparam'
    import {deepClone} from '@/utils'
    import adHeight from '@/mixins/adHeight'
    export default {
        mixins:[adHeight],

        data(){
            return{
                labelPosition: "left",
                filterText: '',
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                data: [

                ],
                tableData: [],
                types_l1:[
                    {
                        paramName: 123,
                        id: 123
                    }
                ],
                tl1:null,
                columns:[
                    {
                        prop: "date",
                        label: "时间"
                    },
                    {
                        prop: "name",
                        label: "名字"
                    },
                    {
                        prop: "address",
                        label: "地址"
                    }
                ],
                total:0,
                form: {
                    pageSize: 10,
                    page:1
                },
                id:null

            }

        },
        mounted(){
            this.getCnfTypeL1s()
            this.getCnfTree(this.tl1)
        },
        methods:{
            getCnfTypeL1s(){
                getCnfTypeL1s()
                    .then(res =>{
                        if(res.code === 1){
                            console.log(res.data)
                            this.types_l1 = res.data
                        }else{
                            this.$message('获取数据失败')
                        }
                    }).catch(error=>{
                    console.log(error)
                })
            },
            getCnfanType(id){
                getCnfanTypeTree(id)
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
            getCnfTree(pid) {
                getCnfTree(pid)
                    .then(res => {
                        if(res.code === 1){
                            this.data = res.data;
                        }else{
                            this.$message('请求数据失败')
                        }
                    })
            },
            getDatas(){
                let obj = {...this.form,...{id: this.id,pageSize: this.columns.length * this.form.pageSize,}}
                getDatas(obj)
                    .then(res=>{
                        if(res.code === 1){
                            this.tableData = res.data
                            this.total = res.total
                        }else{
                            this.$message('请求数据失败')
                        }
                    })
            },
            getColumns(data){
                getColumns(data)
                    .then(res=>{
                        if(res.code === 1){
                            if(res.data.length !== 0){
                                this.columns = res.data
                            }else{
                                return false
                            }

                            this.getDatas()
                        }else{
                            this.$message('请求数据失败')
                        }
                    })
            },
            filterNode(value, data) {
                console.log(value)
                console.log(data)
                if(!value){
                    return true;
                }
                return data.label.indexOf(value) !== -1;
            },
            handleSelectL1(){
                if( this.tl1 === "" ){
                    this.tl1 = null
                }
                this.getCnfTree(this.tl1)
            },
            changeSize(obj){
                this.form = { ...this.form, ...obj }
                this.getDatas()
            },
            handleChange(data){
                console.log(123)
                this.id = data.id
                this.getColumns({id:data.id})
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .app-container{
        background-color: #ffffff;
    }
    .tree_box{
        padding:20px 0 30px 0px;
    }
    .table_box{
        padding:60px 30px 30px 0;
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
    /deep/.el-form-item--medium .el-form-item__content{
        overflow: hidden;
    }
    .isNone{
        display: none;
    }
    .orgType{
        padding:3px 5px;
        border:1px solid $l-color-primary;
        display: inline-block;
        margin-left:10px;
        border-radius: 4px;
        color:$l-color-primary;
        font-size:10px;
        line-height: 10px;
        margin-right:10px;
    }
</style>

