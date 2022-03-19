<template>
    <el-table
            :data="list"
            element-loading-text="Loading"
            height="410"
            border
            fit
            highlight-current-row
            @row-click='handleClick'
            @selection-change="handleSelectionChange"
           
    >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="员工编号" width="200">
            <template slot-scope="scope">{{ scope.row.userNo }}</template>
        </el-table-column>
        <el-table-column label="姓名" width="150" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="性别" width="80" align="center">
            <template slot-scope="scope">{{ scope.row.gender === 'M' ? '男':'女' }}</template>
        </el-table-column>
        <el-table-column label="年龄" width="80" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.age}}</span>
            </template>
        </el-table-column>
        <el-table-column label="员工类型" align="center">
            <template slot-scope="scope">
              <span :val="scope.row.workType" code="EmployeeMark" v-codeTransform></span>
            </template>
        </el-table-column>
        <el-table-column label="职称" align="center">
            <template slot-scope="scope">
                <span  v-if="scope.row.title" :val="scope.row.title" code="doctorProfessionalTitle" v-codeTransform></span>
            </template>
        </el-table-column>
         <el-table-column label="手术级别" align="center">
            <template slot-scope="scope">
               <span v-if="scope.row.operationLevel" :val="scope.row.operationLevel" code="SurgicalGrade" v-codeTransform></span>
            </template>
        </el-table-column>
        <el-table-column label="处方权" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.prescribe=="Yes"?"是":scope.row.prescribe=="No"?"否":""}}</span>
            </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" round @click="handleDis(scope.row)">{{scope.row.status === 0 ?'启动':'禁用'}}</el-button>
            </template>
        </el-table-column>

        <el-table-column label="操作" width="150">
            <template slot-scope="scope">
                <el-button @click.native.prevent="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click.native.prevent="handleRemove(scope.row)" type="text" size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
    export default {
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {};
        },
        methods: {
            handleSelectionChange(val) {
                this.$emit("selectionChange", val);
            },
            handleEdit(row) {
                this.$emit("editRow", row);
            },
            handleRemove(row) {
                let arr = [];
                arr.push(row.id);
                this.$emit("removeRow", arr);
            },
            handleUserAddRole(row) {
                this.$emit("userAddRole", row);
            },
            handleDis(row){
                this.$emit('editStatus',row)
            },
            handleClick(row){
                this.$emit("clickChange",row)
            }
        }
    };
</script>
<style lang="scss" scoped>
//设置按钮
    .el-button--mini{
        border-radius: 2px;
        padding:0 10px;
        
    }
    .el-button--primary{
        height: 30px;
        font-size: 13px;
     }

</style>
