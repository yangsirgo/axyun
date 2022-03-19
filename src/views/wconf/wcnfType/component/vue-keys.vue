<template>
    <el-dialog :visible="dialogVisible" :title="dialogType==='edit'?'编辑属性值':'新建属性值'">
        <el-button type="primary" size="mini" round @click="handleAdd">添加</el-button>
        <el-row :model="orgValues">
            <el-col
                v-for="(item,index) in orgValues"
                :key="index"
            >
                <span>label</span>
                <el-input v-model="item.label" placeholder="请填写组织字段值所显示的汉字"></el-input>
                <span>value</span>
                <el-input v-model="item.value" placeholder="请填写组织字段值所选中的值"></el-input>
            </el-col>
        </el-row>

        <el-button type="primary" size="mini" round @click="handelSave">保存</el-button>
    </el-dialog>
</template>
<script>
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        dialogType: {
            type: String,
            default: "add"
        },
        orgValues: {
            type: Array,
            default(){
                return [
                    {
                        label: "",
                        value: ""
                    }
                ]
            }
        }
    },
    data(){
        return{

        }
    },
    methods:{
        handleAdd(){
            this.orgValues.push({
                label: "",
                value: ""
            })
        },
        handelSave(){

        }
    }
}
</script>
<style lang="scss" scoped>

</style>
